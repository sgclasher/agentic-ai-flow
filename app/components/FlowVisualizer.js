'use client';

import { useState, useEffect, useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import FileUploader from './FileUploader';
import UseCaseNode from './nodes/UseCaseNode';
import TriggerNode from './nodes/TriggerNode';
import AgentNode from './nodes/AgentNode';
import ToolNode from './nodes/ToolNode';
import useAgenticStore from '../store/useAgenticStore';
import { transformAgenticData } from '../utils/transformAgenticData';
import { applyDagreLayout } from '../utils/layoutGraph';

export default function FlowVisualizer() {
  const { agenticData, isLoading, error } = useAgenticStore();
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutDirection, setLayoutDirection] = useState('LR'); // LR = left-to-right, TB = top-to-bottom
  const reactFlowInstance = useReactFlow();

  // Define node types with layout direction
  const nodeTypes = useCallback(() => ({
    useCaseNode: (props) => <UseCaseNode {...props} layoutDirection={layoutDirection} />,
    triggerNode: (props) => <TriggerNode {...props} layoutDirection={layoutDirection} />,
    agentNode: (props) => <AgentNode {...props} layoutDirection={layoutDirection} />,
    toolNode: (props) => <ToolNode {...props} layoutDirection={layoutDirection} />,
  }), [layoutDirection]);

  // Load nodes and edges when agenticData changes
  useEffect(() => {
    if (agenticData) {
      const { nodes: newNodes, edges: newEdges } = transformAgenticData(agenticData, layoutDirection);
      setNodes(newNodes);
      setEdges(newEdges);
    }
  }, [agenticData, setNodes, setEdges, layoutDirection]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  // Function to re-layout the graph
  const onLayout = useCallback((direction) => {
    setLayoutDirection(direction);
    
    const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
      nodes,
      edges,
      {
        direction,
        nodeSeparation: 200,
        rankSeparation: 300,
      }
    );

    setNodes([...layoutedNodes]);
    setEdges([...layoutedEdges]);

    // Center the graph after layout
    window.requestAnimationFrame(() => {
      reactFlowInstance.fitView({ padding: 0.2 });
    });
  }, [nodes, edges, setNodes, setEdges, reactFlowInstance]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'row' }}>
      {!agenticData ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <FileUploader />
        </div>
      ) : (
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes()}
          fitView
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          <Panel position="top-right" style={{ display: 'flex', gap: '10px' }}>
            <button 
              onClick={() => onLayout('LR')}
              style={{
                background: layoutDirection === 'LR' ? '#2980b9' : '#3498db',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Horizontal Layout
            </button>
            <button 
              onClick={() => onLayout('TB')}
              style={{
                background: layoutDirection === 'TB' ? '#27ae60' : '#2ecc71',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Vertical Layout
            </button>
            <button 
              onClick={() => useAgenticStore.getState().resetData()}
              style={{
                background: '#e74c3c',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
              }}
            >
              Reset Flow
            </button>
          </Panel>
          {selectedNode && (
            <Panel position="bottom-right" className="details-panel">
              <div className="details-title">Selected: {selectedNode.data.label}</div>
              <div className="details-content">
                <div className="details-field">
                  <span className="details-label">Type:</span>
                  <span className="details-value">{selectedNode.data.type}</span>
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
      )}
    </div>
  );
} 