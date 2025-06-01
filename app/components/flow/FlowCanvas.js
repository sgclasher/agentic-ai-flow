'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Panel,
  addEdge
} from 'reactflow';

import UseCaseNode from '../nodes/UseCaseNode';
import TriggerNode from '../nodes/TriggerNode';
import AgentNode from '../nodes/AgentNode';
import ToolNode from '../nodes/ToolNode';

// Define node types outside of the component to avoid recreation on each render
const nodeTypes = {
  useCaseNode: UseCaseNode,
  triggerNode: TriggerNode,
  agentNode: AgentNode,
  toolNode: ToolNode,
};

export default function FlowCanvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onNodeClick,
  selectedNode,
  lastUpdate,
  layoutDirection,
  toggleNodeExpansion
}) {
  
  // Add the required props to each node object
  const nodesWithProps = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        layoutDirection,
        onToggle: toggleNodeExpansion
      }
    }));
  }, [nodes, layoutDirection, toggleNodeExpansion]);

  // Handle edge connections
  const onConnect = useCallback(
    (params) => onEdgesChange((eds) => addEdge(params, eds)),
    [onEdgesChange]
  );

  return (
    <ReactFlow
      nodes={nodesWithProps}
      edges={edges.filter(edge => !edge.hidden)}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{
        padding: 0.6,
        includeHiddenNodes: false,
        duration: 800,
        minZoom: 0.3,
        maxZoom: 1.5
      }}
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ zoom: 0.75, x: 0, y: 0 }}
      style={{ background: '#f8f8f8' }}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
      

      
      {selectedNode && (
        <Panel position="bottom-right" className="details-panel">
          <div className="details-title">Selected: {selectedNode.data.label}</div>
          <div className="details-content">
            <div className="details-field">
              <span className="details-label">Type:</span>
              <span className="details-value">{selectedNode.data.type}</span>
            </div>
            <div className="details-field">
              <span className="details-label">Level:</span>
              <span className="details-value">{selectedNode.data.level}</span>
            </div>
            <div className="details-field">
              <span className="details-label">Children:</span>
              <span className="details-value">{selectedNode.data.childrenCount}</span>
            </div>
            <div className="details-field">
              <span className="details-label">Collapsed:</span>
              <span className="details-value">{selectedNode.data.isCollapsed ? 'Yes' : 'No'}</span>
            </div>
            {selectedNode.data.description && (
              <div className="details-field">
                <span className="details-label">Description:</span>
                <span className="details-value">{selectedNode.data.description}</span>
              </div>
            )}
            {selectedNode.data.role && (
              <div className="details-field">
                <span className="details-label">Role:</span>
                <span className="details-value">{selectedNode.data.role}</span>
              </div>
            )}
          </div>
        </Panel>
      )}
    </ReactFlow>
  );
} 