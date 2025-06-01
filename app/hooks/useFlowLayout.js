'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { applyDagreLayout } from '../utils/layoutGraph';

export function useFlowLayout(nodes, setNodes, edges, setEdges) {
  const [layoutDirection, setLayoutDirection] = useState('LR');
  const [autoFitEnabled, setAutoFitEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const reactFlowInstance = useReactFlow();
  
  // Track node collapse changes to prevent infinite layout re-rendering
  const lastCollapseStateRef = useRef({});
  const isLayoutNecessaryRef = useRef(false);

  // Helper function to recursively update visibility of all descendants
  const updateDescendantVisibility = useCallback((nodes, parentId, hidden) => {
    // Find all immediate children of the parent
    const children = nodes.filter(node => node.data.parentId === parentId);
    
    children.forEach(child => {
      // Find the child in the nodes array
      const childIndex = nodes.findIndex(n => n.id === child.id);
      if (childIndex !== -1) {
        // Check if this child has its own children
        const grandChildren = nodes.filter(n => n.data.parentId === child.id);
        const hasGrandChildren = grandChildren.length > 0;
        
        // Update this child's visibility
        nodes[childIndex] = {
          ...nodes[childIndex],
          hidden: hidden,
          data: {
            ...nodes[childIndex].data,
            // If this node has children and is being hidden, ensure it's set to collapsed state
            isCollapsed: hasGrandChildren ? true : nodes[childIndex].data.isCollapsed
          }
        };
        
        // Recursively update this child's descendants
        updateDescendantVisibility(nodes, child.id, hidden);
      }
    });
    
    return nodes;
  }, []);

  // Toggle node expansion/collapse
  const toggleNodeExpansion = useCallback((nodeId) => {
    console.log(`Toggle expansion for node: ${nodeId}`);
    
    setNodes(currentNodes => {
      const nodeIndex = currentNodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) {
        console.error(`Node with id ${nodeId} not found`);
        return currentNodes;
      }

      const node = currentNodes[nodeIndex];
      const isCollapsed = !node.data.isCollapsed;
      
      console.log(`Setting node ${nodeId} collapsed state to: ${isCollapsed}`);
      
      // First update the node's collapse state
      const updatedNodes = [...currentNodes];
      updatedNodes[nodeIndex] = {
        ...node,
        data: {
          ...node.data,
          isCollapsed
        }
      };
      
      // Find immediate children of this node
      const childNodes = currentNodes.filter(n => n.data.parentId === nodeId);
      const hasChildren = childNodes.length > 0;
      
      if (hasChildren) {
        console.log(`Node ${nodeId} has ${childNodes.length} children, updating their visibility`);
        
        // Update visibility of all child nodes based on collapse state
        childNodes.forEach(childNode => {
          const childIndex = updatedNodes.findIndex(n => n.id === childNode.id);
          if (childIndex !== -1) {
            // Check if this child has its own children
            const grandChildren = currentNodes.filter(n => n.data.parentId === childNode.id);
            const hasGrandChildren = grandChildren.length > 0;
            
            updatedNodes[childIndex] = {
              ...updatedNodes[childIndex],
              hidden: isCollapsed, // Hide child if parent is collapsed
              data: {
                ...updatedNodes[childIndex].data,
                // If this child has children, ensure it's set to collapsed state when becoming visible
                isCollapsed: hasGrandChildren ? true : updatedNodes[childIndex].data.isCollapsed
              }
            };
            
            // If we're collapsing, also collapse any grandchildren
            if (isCollapsed) {
              // Recursively hide all descendants
              updateDescendantVisibility(updatedNodes, childNode.id, true);
            }
          }
        });
        
        setLastUpdate(`${nodeId} ${isCollapsed ? 'collapsed' : 'expanded'} at ${new Date().toLocaleTimeString()}`);
        isLayoutNecessaryRef.current = true;
        
        // Get visible node IDs after update
        const visibleNodeIds = new Set(
          updatedNodes
            .filter(node => !node.hidden)
            .map(node => node.id)
        );
        
        // Update edges visibility
        setEdges(currentEdges => 
          currentEdges.map(edge => ({
            ...edge,
            hidden: !(visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
          }))
        );
        
        // Only fit view if autoFitEnabled is enabled
        if (autoFitEnabled) {
          window.requestAnimationFrame(() => {
            setTimeout(() => {
              reactFlowInstance.fitView({
                padding: 0.6,
                includeHiddenNodes: false,
                duration: 800,
                minZoom: 0.3,
                maxZoom: 1.5
              });
            }, 400);
          });
        }
      }
      
      return updatedNodes;
    });
  }, [setNodes, setEdges, reactFlowInstance, updateDescendantVisibility, autoFitEnabled]);

  // Expand all nodes
  const expandAllNodes = useCallback(() => {
    setLastUpdate(`Expanding all nodes: ${new Date().toLocaleTimeString()}`);
    
    setNodes(nodes => {
      // Mark all nodes as expanded and visible
      const expandedNodes = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isCollapsed: false
        },
        hidden: false
      }));
      
      // Show all edges
      setEdges(currentEdges => 
        currentEdges.map(edge => ({ ...edge, hidden: false }))
      );
      
      // Force layout update
      isLayoutNecessaryRef.current = true;
      
      if (autoFitEnabled) {
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance.fitView({
              padding: 0.3,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 1.5
            });
          }, 300);
        });
      }
      
      return expandedNodes;
    });
  }, [setNodes, setEdges, reactFlowInstance, autoFitEnabled]);

  // Collapse all nodes to show only use cases
  const collapseAllNodes = useCallback(() => {
    setLastUpdate(`Collapsing to show only top-level nodes: ${new Date().toLocaleTimeString()}`);
    
    setNodes(nodes => {
      const updatedNodes = nodes.map(node => {
        // Top level nodes (use cases) - expanded
        if (node.data.level === 0) {
          return {
            ...node,
            data: {
              ...node.data,
              isCollapsed: true
            },
            hidden: false
          };
        }
        // All other nodes - hidden
        return {
          ...node,
          data: {
            ...node.data,
            isCollapsed: true
          },
          hidden: true
        };
      });
      
      // Get visible node IDs after collapse
      const visibleNodeIds = new Set(
        updatedNodes
          .filter(node => !node.hidden)
          .map(node => node.id)
      );
      
      // Update edges visibility in the next tick
      setTimeout(() => {
        setEdges(currentEdges => 
          currentEdges.map(edge => ({
            ...edge,
            hidden: !(visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
          }))
        );
      }, 0);
      
      // Force layout update
      isLayoutNecessaryRef.current = true;
      
      if (autoFitEnabled) {
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance.fitView({
              padding: 0.3,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 1.5
            });
          }, 300);
        });
      }
      
      return updatedNodes;
    });
  }, [setNodes, setEdges, reactFlowInstance, autoFitEnabled]);

  // Apply layout when needed
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;
    
    // Check if any collapse states have changed
    let hasCollapseStateChanged = false;
    const currentCollapseState = {};
    const changedNodeIds = [];
    
    nodes.forEach(node => {
      if (node.data && node.data.isCollapsed !== undefined) {
        currentCollapseState[node.id] = node.data.isCollapsed;
        if (lastCollapseStateRef.current[node.id] !== node.data.isCollapsed) {
          hasCollapseStateChanged = true;
          changedNodeIds.push(node.id);
        }
      }
    });
    
    // Only re-layout if collapse state changed or layout was requested
    if (hasCollapseStateChanged || isLayoutNecessaryRef.current) {
      const updateType = hasCollapseStateChanged ? 
        `Node(s) ${changedNodeIds.join(', ')} toggled` : 
        'Layout direction changed';
      
      setLastUpdate(`${updateType} - applying layout: ${new Date().toLocaleTimeString()}`);
      lastCollapseStateRef.current = {...currentCollapseState};
      isLayoutNecessaryRef.current = false;
      
      // Filter visible nodes for the layout
      const visibleNodes = nodes.filter(node => !node.hidden);
      const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
      
      // Update edge visibility based on connected nodes
      const updatedEdges = edges.map(edge => {
        if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
          return { ...edge, hidden: false };
        } else {
          return { ...edge, hidden: true };
        }
      });
      
      // Apply layout with visible nodes and edges
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
        visibleNodes,
        updatedEdges,
        {
          direction: layoutDirection,
          nodeSeparation: 200,
          rankSeparation: 300,
        }
      );

      // Merge the new positions into the original nodes array
      const mergedNodes = nodes.map(node => {
        const layoutedNode = layoutedNodes.find(n => n.id === node.id);
        if (layoutedNode) {
          return {
            ...node,
            position: layoutedNode.position
          };
        }
        return node;
      });

      setNodes(mergedNodes);
      setEdges(layoutedEdges);

      // Only fit view if autoFitEnabled is enabled
      if (autoFitEnabled) {
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance.fitView({ 
              padding: 0.6,
              includeHiddenNodes: false,
              duration: 800,
              minZoom: 0.3,
              maxZoom: 1.5
            });
          }, 400);
        });
      }
    }
  }, [nodes, edges, layoutDirection, setNodes, setEdges, reactFlowInstance, autoFitEnabled]);

  // Handle layout direction change
  const handleLayoutChange = useCallback((direction) => {
    setLayoutDirection(direction);
    isLayoutNecessaryRef.current = true;
    setLastUpdate(`Layout direction changed to ${direction}: ${new Date().toLocaleTimeString()}`);
  }, []);

  return {
    layoutDirection,
    autoFitEnabled,
    lastUpdate,
    setAutoFitEnabled,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    handleLayoutChange
  };
} 