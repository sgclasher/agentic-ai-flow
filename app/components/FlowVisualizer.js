'use client';

import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import useAgenticStore from '../store/useAgenticStore';
import { useFlowLayout } from '../hooks/useFlowLayout';
import { useFlowData } from '../hooks/useFlowData';
import FlowCanvas from './flow/FlowCanvas';

const FlowVisualizer = forwardRef(({ onError, layoutDirection: externalLayoutDirection, autoFitOnChange: externalAutoFitOnChange }, ref) => {
  const { agenticData, isLoading, error } = useAgenticStore();
  
  // Debug logging
  console.log('FlowVisualizer rendering with agenticData:', agenticData);
  console.log('Is any data present?', agenticData && Object.keys(agenticData).length > 0);
  console.log('Are there use_cases?', agenticData?.use_cases?.length);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Use our custom hooks for layout and data management
  const {
    layoutDirection,
    autoFitEnabled,
    lastUpdate,
    setAutoFitEnabled,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    handleLayoutChange
  } = useFlowLayout(nodes, setNodes, edges, setEdges);
  
  // Load and transform data
  useFlowData(agenticData, layoutDirection, setNodes, setEdges, onError);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    expandAllNodes,
    collapseAllNodes
  }));

  // Handle node clicks
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'row',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0 
    }}>
      {!agenticData ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            <p>No data available. Please connect to ServiceNow to visualize agentic AI flows.</p>
          </div>
        </div>
      ) : (
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          selectedNode={selectedNode}
          lastUpdate={lastUpdate}
          layoutDirection={layoutDirection}
          toggleNodeExpansion={toggleNodeExpansion}
        />
      )}
    </div>
  );
});

FlowVisualizer.displayName = 'FlowVisualizer';

export default FlowVisualizer; 