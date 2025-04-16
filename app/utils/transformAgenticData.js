/**
 * Transforms ServiceNow agentic AI data into React Flow nodes and edges
 * @param {Object} agenticData - ServiceNow agentic AI data
 * @param {String} layoutDirection - Layout direction ('LR' or 'TB')
 * @returns {Object} { nodes, edges }
 */
// Remove the layout import as it's no longer used here
// import { applyDagreLayout } from './layoutGraph';

export function transformAgenticData(agenticData, layoutDirection = 'LR') {
  if (!agenticData || !agenticData.use_cases || !agenticData.use_cases.length) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];
  let nodeId = 1;

  // --- Sort Use Cases by Name ---
  const sortedUseCases = [...agenticData.use_cases].sort((a, b) => {
    // Basic string comparison should work due to the leading number in the name
    const nameA = a.name || '';
    const nameB = b.name || '';
    return nameA.localeCompare(nameB);
  });

  // Process sorted use cases
  sortedUseCases.forEach((useCase, useCaseIndex) => {
    // Log to debug
    console.log(`Processing use case: ${useCase.name} (${useCase.sys_id})`);
    
    // Use case node
    const useCaseId = `usecase-${useCase.sys_id}`;
    nodes.push({
      id: useCaseId,
      // Initial positions will be overridden by the layout function
      position: { x: 0, y: 0 },
      data: { 
        label: useCase.name,
        type: 'useCase',
        description: useCase.description,
        details: useCase,
        isCollapsed: false,
        childrenCount: (useCase.agents || []).length,
        nodeType: 'useCaseNode',
        parentId: null,
        level: 0
      },
      type: 'useCaseNode'
    });

    // Process triggers for this use case
    if (useCase.triggers && useCase.triggers.length) {
      useCase.triggers.forEach((trigger, triggerIndex) => {
        const triggerId = `trigger-${trigger.sys_id || nodeId++}`;
        
        // Trigger node
        nodes.push({
          id: triggerId,
          position: { x: 0, y: 0 },
          data: { 
            // Use objective_template as the primary label if name is null
            label: trigger.name || trigger.objective_template || 'Trigger', 
            type: 'trigger',
            target_table: trigger.target_table,
            condition: trigger.condition,
            // Keep objective mapped for potential use in details panel, but label is primary display
            objective: trigger.objective_template, 
            details: trigger,
            isCollapsed: false,
            childrenCount: 0,
            nodeType: 'triggerNode',
            parentId: null,
            level: 0
          },
          type: 'triggerNode'
        });

        // Edge from trigger to use case
        edges.push({
          id: `edge-${triggerId}-${useCaseId}`,
          source: triggerId,
          target: useCaseId,
          animated: true,
          label: 'initiates'
        });
      });
    }

    // Process agents for this use case
    if (useCase.agents && useCase.agents.length) {
      useCase.agents.forEach((agent, agentIndex) => {
        const agentId = `agent-${agent.sys_id}`;
        
        // Agent node
        nodes.push({
          id: agentId,
          position: { x: 0, y: 0 },
          data: { 
            label: agent.name,
            type: 'agent',
            description: agent.description,
            role: agent.role,
            instructions: agent.instructions,
            details: agent,
            isCollapsed: false,
            childrenCount: (agent.tools || []).length,
            nodeType: 'agentNode',
            parentId: useCaseId,  // Parent is the use case
            level: 1,
            visible: true  // Initially visible
          },
          type: 'agentNode'
        });

        // Edge from use case to agent
        edges.push({
          id: `edge-${useCaseId}-${agentId}`,
          source: useCaseId,
          target: agentId,
          label: 'uses',
          data: {
            parentRelationship: true  // Mark this as a parent-child relationship edge
          }
        });

        // Process tools for this agent
        if (agent.tools && agent.tools.length) {
          agent.tools.forEach((tool, toolIndex) => {
            const toolId = `tool-${tool.sys_id}`;
            
            // Tool node
            nodes.push({
              id: toolId,
              position: { x: 0, y: 0 },
              data: { 
                label: tool.name,
                type: 'tool',
                description: tool.description,
                toolType: tool.type,
                details: tool,
                isCollapsed: false,
                childrenCount: 0,
                nodeType: 'toolNode',
                parentId: agentId,  // Parent is the agent
                level: 2,
                visible: true  // Initially visible
              },
              type: 'toolNode'
            });

            // Edge from agent to tool
            edges.push({
              id: `edge-${agentId}-${toolId}`,
              source: agentId,
              target: toolId,
              label: 'uses',
              data: {
                parentRelationship: true  // Mark this as a parent-child relationship edge
              }
            });
          });
        }
      });
    }
  });

  // Remove the layout application from this function
  // const layoutedGraph = applyDagreLayout(nodes, edges, {
  //   direction: layoutDirection,
  //   nodeSeparation: 200,
  //   rankSeparation: 300,
  // });

  // Return raw nodes and edges
  return { nodes, edges };
} 