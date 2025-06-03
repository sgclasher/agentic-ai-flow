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
  const [edges, setEdges, onEdgesState] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Use our custom hooks for layout and data management
  const {
    layoutDirection: internalLayoutDirection,
    autoFitEnabled: internalAutoFitEnabled,
    lastUpdate,
    setAutoFitEnabled,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    handleLayoutChange
  } = useFlowLayout(nodes, setNodes, edges, setEdges);
  
  // Use external props if provided, otherwise fall back to internal state
  const activeLayoutDirection = externalLayoutDirection || internalLayoutDirection;
  const activeAutoFitEnabled = externalAutoFitOnChange !== undefined ? externalAutoFitOnChange : internalAutoFitEnabled;
  
  // Load and transform data with the active layout direction
  useFlowData(agenticData, activeLayoutDirection, setNodes, setEdges, onError);
  
  // Update internal auto-fit state when external prop changes
  React.useEffect(() => {
    if (externalAutoFitOnChange !== undefined && externalAutoFitOnChange !== internalAutoFitEnabled) {
      setAutoFitEnabled(externalAutoFitOnChange);
    }
  }, [externalAutoFitOnChange, internalAutoFitEnabled, setAutoFitEnabled]);
  
  // Update internal layout direction when external prop changes
  React.useEffect(() => {
    if (externalLayoutDirection && externalLayoutDirection !== internalLayoutDirection) {
      handleLayoutChange(externalLayoutDirection);
    }
  }, [externalLayoutDirection, internalLayoutDirection, handleLayoutChange]);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    expandAllNodes,
    collapseAllNodes,
    setLayoutDirection: handleLayoutChange,
    getLayoutDirection: () => activeLayoutDirection,
    setAutoFit: setAutoFitEnabled,
    getAutoFit: () => activeAutoFitEnabled
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
          layoutDirection={activeLayoutDirection}
          toggleNodeExpansion={toggleNodeExpansion}
        />
      )}
    </div>
  );
});

FlowVisualizer.displayName = 'FlowVisualizer';

export default FlowVisualizer; 