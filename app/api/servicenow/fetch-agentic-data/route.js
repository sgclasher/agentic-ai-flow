// Specialized API route to fetch all ServiceNow agentic AI data in one go

import { NextResponse } from 'next/server';

// Helper to safely get nested properties
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};

export async function POST(request) {
  try {
    // Parse request body
    const body = await request.json();
    const { instanceUrl, username, password, scopeId } = body;

    // Validate required parameters
    if (!instanceUrl || !username || !password || !scopeId) {
      return NextResponse.json(
        { error: 'Missing required parameters: instanceUrl, username, password, scopeId' },
        { status: 400 }
      );
    }

    // Make sure instanceUrl is properly formatted
    let formattedUrl = instanceUrl.trim();
    if (!formattedUrl.startsWith('https://') && !formattedUrl.startsWith('http://')) {
      formattedUrl = 'https://' + formattedUrl;
    }
    if (formattedUrl.endsWith('/')) {
      formattedUrl = formattedUrl.slice(0, -1);
    }

    // Create authorization header
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Define tables and fields to fetch
    const tablesToFetch = {
      usecase: { 
        name: 'sn_aia_usecase', 
        fields: ['sys_id', 'name', 'description', 'team'] 
      },
      trigger: { 
        name: 'sn_aia_trigger_configuration', 
        fields: ['sys_id', 'name', 'objective_template', 'condition', 'target_table', 'usecase'] 
      },
      team: { 
        name: 'sn_aia_team', 
        fields: ['sys_id', 'name'] 
      },
      team_member: { 
        name: 'sn_aia_team_member', 
        fields: ['team', 'agent'] 
      },
      agent: { 
        name: 'sn_aia_agent', 
        fields: ['sys_id', 'name', 'description', 'role', 'instructions', 'prompt', 'agent_prompt'] 
      },
      agent_tool: { 
        name: 'sn_aia_agent_tool_m2m', 
        fields: ['agent', 'tool'] 
      },
      tool: { 
        name: 'sn_aia_tool', 
        fields: ['sys_id', 'name', 'description', 'type'] 
      }
    };

    // Function to fetch data from ServiceNow
    async function fetchTableData(tableName, fields) {
      const query = `sys_scope=${scopeId}`;
      const url = `${formattedUrl}/api/now/table/${tableName}?sysparm_query=${query}&sysparm_fields=${fields.join(',')}&sysparm_display_value=false&sysparm_exclude_reference_link=true`;
      
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': authHeader,
          'Accept': 'application/json'
        }
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch ${tableName}: ${response.status} ${response.statusText}. Details: ${errorText}`);
      }

      const data = await response.json();
      return data.result || [];
    }

    // Fetch all data concurrently
    const fetchPromises = Object.entries(tablesToFetch).map(async ([key, config]) => {
      try {
        const results = await fetchTableData(config.name, config.fields);
        return { key, results };
      } catch (error) {
        console.error(`Error fetching ${config.name}:`, error);
        throw error; // Re-throw to be caught by the main try/catch
      }
    });

    // Wait for all fetches to complete
    const fetchedDataArrays = await Promise.all(fetchPromises);

    // Process fetched data into a map for easier access
    const fetchedData = fetchedDataArrays.reduce((acc, { key, results }) => {
      acc[key] = results;
      return acc;
    }, {});

    // --- Data Processing Logic (similar to what was in ServiceNowConnector.js) ---

    // 1. Process Tools
    const toolsMap = fetchedData.tool.reduce((acc, tool) => {
      acc[tool.sys_id] = {
        sys_id: tool.sys_id,
        name: tool.name || 'Unnamed Tool',
        description: tool.description || '',
        type: tool.type || 'unknown'
      };
      return acc;
    }, {});

    // 2. Process Agents
    const agentsMap = fetchedData.agent.reduce((acc, agent) => {
      // Determine instructions based on field availability
      const instructions = agent.instructions || agent.prompt || agent.agent_prompt || '';
      acc[agent.sys_id] = {
        sys_id: agent.sys_id,
        name: agent.name || 'Unnamed Agent',
        description: agent.description || '',
        role: agent.role || '',
        instructions: instructions,
        tools: [] // Initialize tools array
      };
      return acc;
    }, {});

    // 3. Link Tools to Agents
    fetchedData.agent_tool.forEach(link => {
      // ServiceNow references might be stored differently depending on API response format
      const agentId = link.agent?.value || link.agent;
      const toolId = link.tool?.value || link.tool;
      
      if (agentId && toolId) {
        const agent = agentsMap[agentId];
        const tool = toolsMap[toolId];
        
        if (agent && tool) {
          if (!agent.tools.some(t => t.sys_id === tool.sys_id)) {
            agent.tools.push(tool);
          }
        }
      }
    });

    // 4. Process Teams and Link Agents to Teams
    const teamsMap = fetchedData.team.reduce((acc, team) => {
      acc[team.sys_id] = {
        sys_id: team.sys_id,
        name: team.name,
        agents: [] // Initialize agents array
      };
      return acc;
    }, {});

    fetchedData.team_member.forEach(member => {
      const teamId = member.team?.value || member.team;
      const agentId = member.agent?.value || member.agent;
      
      if (teamId && agentId) {
        const team = teamsMap[teamId];
        const agent = agentsMap[agentId];
        
        if (team && agent) {
          if (!team.agents.some(a => a.sys_id === agent.sys_id)) {
            team.agents.push(agent);
          }
        }
      }
    });

    // 5. Process Use Cases, Link Triggers, and Link Agents (via Team)
    const finalUseCases = fetchedData.usecase.map(useCase => {
      const useCaseTeamId = useCase.team?.value || useCase.team;
      const teamAgents = useCaseTeamId && teamsMap[useCaseTeamId] ? teamsMap[useCaseTeamId].agents : [];

      return {
        sys_id: useCase.sys_id,
        name: useCase.name || 'Unnamed Use Case',
        description: useCase.description || '',
        triggers: [], // Initialize triggers array
        agents: teamAgents // Add agents associated with the use case's team
      };
    });

    // Create a map for easy lookup during trigger linking
    const finalUseCasesMap = finalUseCases.reduce((acc, uc) => {
      acc[uc.sys_id] = uc;
      return acc;
    }, {});

    // Link Triggers to Use Cases
    fetchedData.trigger.forEach(trigger => {
      const useCaseId = trigger.usecase?.value || trigger.usecase;
      
      if (useCaseId) {
        const useCase = finalUseCasesMap[useCaseId];
        
        if (useCase) {
          useCase.triggers.push({
            sys_id: trigger.sys_id,
            name: trigger.name || null, // Keep null if no name
            objective_template: trigger.objective_template || '',
            condition: trigger.condition || '',
            target_table: trigger.target_table || ''
          });
        }
      }
    });

    // Final Structure
    const processedData = { use_cases: finalUseCases };

    // Return the processed data
    return NextResponse.json(processedData);

  } catch (error) {
    console.error('Error in fetch-agentic-data API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch or process ServiceNow data' },
      { status: 500 }
    );
  }
} 