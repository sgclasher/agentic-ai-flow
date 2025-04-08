/**
 * Transforms ServiceNow agentic AI data into React Flow nodes and edges
 * @param {Object} agenticData - ServiceNow agentic AI data
 * @param {String} layoutDirection - Layout direction ('LR' or 'TB')
 * @returns {Object} { nodes, edges }
 */
import { applyDagreLayout } from './layoutGraph';

export function transformAgenticData(agenticData, layoutDirection = 'LR') {
  if (!agenticData || !agenticData.use_cases || !agenticData.use_cases.length) {
    return { nodes: [], edges: [] };
  }

  const nodes = [];
  const edges = [];
  let nodeId = 1;

  // Process each use case
  agenticData.use_cases.forEach((useCase, useCaseIndex) => {
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
        details: useCase
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
            label: trigger.name || 'Trigger',
            type: 'trigger',
            target_table: trigger.target_table,
            condition: trigger.condition,
            objective: trigger.objective_template,
            details: trigger
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
            details: agent
          },
          type: 'agentNode'
        });

        // Edge from use case to agent
        edges.push({
          id: `edge-${useCaseId}-${agentId}`,
          source: useCaseId,
          target: agentId,
          label: 'uses'
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
                details: tool
              },
              type: 'toolNode'
            });

            // Edge from agent to tool
            edges.push({
              id: `edge-${agentId}-${toolId}`,
              source: agentId,
              target: toolId,
              label: 'uses'
            });
          });
        }
      });
    }
  });

  // Apply Dagre layout
  const layoutedGraph = applyDagreLayout(nodes, edges, {
    direction: layoutDirection,
    nodeSeparation: 200,
    rankSeparation: 300,
  });

  return layoutedGraph;
} 