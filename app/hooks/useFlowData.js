'use client';

import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { transformAgenticData } from '../utils/transformAgenticData';
import { applyDagreLayout } from '../utils/layoutGraph';

export function useFlowData(agenticData, layoutDirection, setNodes, setEdges, onError) {
  const reactFlowInstance = useReactFlow();

  // Load nodes and edges when agenticData changes
  useEffect(() => {
    if (agenticData) {
      try {
        // Get raw nodes and edges without layout applied
        const { nodes: rawNodes, edges: rawEdges } = transformAgenticData(agenticData);
        
        // Check if we got valid data back
        if (!rawNodes.length && !rawEdges.length) {
          throw new Error('Unable to transform the data into a valid flow diagram');
        }
        
        console.log(`Successfully transformed data: ${rawNodes.length} nodes, ${rawEdges.length} edges`);
        
        // Create a map to identify parent-child relationships
        const childrenMap = {};
        rawNodes.forEach(node => {
          if (node.data.parentId) {
            if (!childrenMap[node.data.parentId]) {
              childrenMap[node.data.parentId] = [];
            }
            childrenMap[node.data.parentId].push(node.id);
          }
        });
        
        // Set initial collapse/hidden states
        const initializedNodes = rawNodes.map(node => {
          const nodeChildren = childrenMap[node.id] || [];
          const hasChildren = nodeChildren.length > 0;
          
          if (node.data.level === 0) {
            return {
              ...node,
              data: { ...node.data, isCollapsed: true, childrenCount: nodeChildren.length },
              hidden: false // Top-level nodes are visible
            };
          } else {
            return {
              ...node,
              data: { ...node.data, isCollapsed: hasChildren, childrenCount: nodeChildren.length },
              hidden: true // Child nodes are hidden initially
            };
          }
        });
        
        // --- Apply Initial Layout --- 
        // Filter for initially visible nodes (top-level use cases)
        const visibleNodesInitial = initializedNodes.filter(node => !node.hidden);
        const visibleNodeIdsInitial = new Set(visibleNodesInitial.map(node => node.id));
        
        // Filter edges to include only those connecting visible nodes
        const visibleEdgesInitial = rawEdges.filter(edge => 
          visibleNodeIdsInitial.has(edge.source) && visibleNodeIdsInitial.has(edge.target)
        );

        // Apply layout only to visible nodes/edges
        const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
          visibleNodesInitial,
          visibleEdgesInitial,
          {
            direction: layoutDirection,
            nodeSeparation: 200,
            rankSeparation: 300,
          }
        );
        
        // Merge layout positions back into the *full* initializedNodes array
        const finalNodes = initializedNodes.map(node => {
          const layoutedNode = layoutedNodes.find(n => n.id === node.id);
          if (layoutedNode) {
            // Apply layout position only if the node was part of the layout
            return { ...node, position: layoutedNode.position };
          }
          // Keep original position (likely 0,0) for hidden nodes
          return node; 
        });

        // Set the final state for nodes and edges
        setNodes(finalNodes);
        setEdges(rawEdges); 
        
        // Trigger fitView after layout is applied
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance?.fitView?.({
              padding: 0.6,
              includeHiddenNodes: false,
              duration: 800,
              minZoom: 0.3,
              maxZoom: 1.5
            });
          }, 400);
        });
      } catch (error) {
        console.error("Error processing agentic data:", error);
        if (onError) {
          onError(error);
        }
      }
    }
  }, [agenticData, layoutDirection, setNodes, setEdges, reactFlowInstance, onError]);
} 