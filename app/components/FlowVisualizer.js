'use client';

import { useState, useEffect, useCallback, useRef, useMemo, memo, useLayoutEffect, forwardRef, useImperativeHandle } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges
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

// Define node types outside of the component to avoid recreation on each render
const nodeTypes = {
  useCaseNode: UseCaseNode,
  triggerNode: TriggerNode,
  agentNode: AgentNode,
  toolNode: ToolNode,
};

const FlowVisualizer = forwardRef(({ onError, layoutDirection: externalLayoutDirection, autoFitOnChange: externalAutoFitOnChange }, ref) => {
  const { agenticData, isLoading, error } = useAgenticStore();
  
  // Debug logging
  console.log('FlowVisualizer rendering with agenticData:', agenticData);
  console.log('Is any data present?', agenticData && Object.keys(agenticData).length > 0);
  console.log('Are there use_cases?', agenticData?.use_cases?.length);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [layoutDirection, setLayoutDirection] = useState(externalLayoutDirection || 'LR'); // LR = left-to-right, TB = top-to-bottom
  const [lastUpdate, setLastUpdate] = useState('');
  const reactFlowInstance = useReactFlow();
  
  // Track node collapse changes to prevent infinite layout re-rendering
  const lastCollapseStateRef = useRef({});
  const isLayoutNecessaryRef = useRef(false);
  
  // Use external auto-fit setting if provided
  const [autoFitOnChange, setAutoFitOnChange] = useState(
    typeof externalAutoFitOnChange !== 'undefined' ? externalAutoFitOnChange : false
  );
  
  // Update internal state when external props change
  useEffect(() => {
    if (typeof externalLayoutDirection !== 'undefined') {
      setLayoutDirection(externalLayoutDirection);
      isLayoutNecessaryRef.current = true;
    }
  }, [externalLayoutDirection]);
  
  useEffect(() => {
    if (typeof externalAutoFitOnChange !== 'undefined') {
      setAutoFitOnChange(externalAutoFitOnChange);
    }
  }, [externalAutoFitOnChange]);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    expandAllNodes: () => {
      expandAllNodes();
    },
    collapseAllNodes: () => {
      collapseAllNodes();
    }
  }));

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
  
  // Helper to update visibility of all child nodes recursively
  const updateChildNodesVisibility = useCallback((nodes, parentId, isParentCollapsed) => {
    console.log(`Updating visibility for children of ${parentId}, collapsed: ${isParentCollapsed}`);
    
    return nodes.map(node => {
      // Only process direct children of the toggled node
      if (node.data.parentId === parentId) {
        console.log(`Found child node: ${node.id}, setting hidden: ${isParentCollapsed}`);
        
        // Mark this child node as hidden if parent is collapsed
        const updatedNode = {
          ...node,
          hidden: isParentCollapsed
        };
        
        // If this child node has its own children, and either:
        // 1. The parent is collapsed (so this node is hidden)
        // 2. This node itself is collapsed
        // Then we need to hide all descendants of this node
        if (isParentCollapsed || node.data.isCollapsed) {
          // Find all the node's children and hide them
          const childrenOfThisNode = nodes.filter(n => n.data.parentId === node.id);
          if (childrenOfThisNode.length > 0) {
            console.log(`Node ${node.id} has ${childrenOfThisNode.length} children that will be hidden`);
          }
          
          // Process this node's children
          return updateChildNodesVisibility(nodes, node.id, true)
            .find(n => n.id === node.id) || updatedNode;
        }
        
        return updatedNode;
      }
      
      // For nodes that aren't direct children of the toggled node, return unchanged
      return node;
    });
  }, []);
  
  // Store references to layout functions to pass to nodes
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
      console.log(`Node level: ${node.data.level}, parent: ${node.data.parentId || 'none'}`);
      
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
        
        // Log how many nodes are visible after the update
        const visibleCount = updatedNodes.filter(n => !n.hidden).length;
        console.log(`After toggle, ${visibleCount} nodes are visible out of ${updatedNodes.length}`);
        
        setLastUpdate(`${nodeId} ${isCollapsed ? 'collapsed' : 'expanded'}, showing/hiding ${childNodes.length} children at ${new Date().toLocaleTimeString()}`);
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
        
        // Only fit view if autoFitOnChange is enabled
        if (autoFitOnChange) {
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
        
        return updatedNodes;
      } else {
        // No children to hide/show, just update the node's collapse state
        console.log(`Node ${nodeId} has no children, just updating its own state`);
        setLastUpdate(`${nodeId} toggle state (no children) at ${new Date().toLocaleTimeString()}`);
        return updatedNodes;
      }
    });
  }, [setNodes, setEdges, reactFlowInstance, updateDescendantVisibility, autoFitOnChange]);

  // Add the required props to each node object instead of in nodeTypes
  const getNodesWithProps = useCallback((currentNodes) => {
    return currentNodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        layoutDirection,
        onToggle: toggleNodeExpansion
      }
    }));
  }, [layoutDirection, toggleNodeExpansion]);

  // Preprocess nodes to include the needed props
  const nodesWithProps = useMemo(() => {
    return getNodesWithProps(nodes);
  }, [nodes, getNodesWithProps]);

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
          visibleEdgesInitial, // Use initially visible edges for layout
          {
            direction: layoutDirection, // Use the current layout direction state
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
          // Keep original position (likely 0,0) for hidden nodes, though it shouldn't matter
          return node; 
        });

        // Set the final state for nodes and edges
        setNodes(finalNodes);
        // Set the full edge list; visibility will be handled by the other useEffect
        setEdges(rawEdges); 
        
        // Initialize last collapse state ref
        const collapseState = {};
        finalNodes.forEach(node => {
          collapseState[node.id] = node.data.isCollapsed;
        });
        lastCollapseStateRef.current = collapseState;
        setLastUpdate('Initial layout applied to visible nodes');
        
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
  }, [agenticData, setNodes, setEdges, layoutDirection, reactFlowInstance, onError]);

  // Manually trigger a custom node change to fix any onClick propagation issues
  const customNodesChange = useCallback((changes) => {
    onNodesChange(changes);
    setLastUpdate('Nodes updated: ' + new Date().toLocaleTimeString());
  }, [onNodesChange]);

  // Custom nodes state setter to track changes
  const customSetNodes = useCallback((updater) => {
    setNodes((nodes) => {
      const newNodes = typeof updater === 'function' ? updater(nodes) : updater;
      setLastUpdate('Nodes state updated: ' + new Date().toLocaleTimeString());
      return newNodes;
    });
  }, [setNodes]);

  // Watch for changes to node collapse states and update layout
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

      // Only fit view if autoFitOnChange is enabled
      if (autoFitOnChange) {
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
  }, [nodes, edges, layoutDirection, setNodes, setEdges, reactFlowInstance, autoFitOnChange]);

  // Update edge visibility when node visibility changes
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;
    
    // Get visible node IDs
    const visibleNodeIds = new Set(
      nodes
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
  }, [nodes, setEdges]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodeClick = useCallback((event, node) => {
    // Set the selected node for details display
    setSelectedNode(node);
    setLastUpdate(`Node clicked: ${node.id} at ${new Date().toLocaleTimeString()}`);
  }, []);

  // Function to re-layout the graph
  const onLayout = useCallback((direction) => {
    setLayoutDirection(direction);
    isLayoutNecessaryRef.current = true;
    setLastUpdate(`Layout direction changed to ${direction}: ${new Date().toLocaleTimeString()}`);
  }, []);

  // Function to expand all nodes
  const expandAllNodes = useCallback(() => {
    setLastUpdate(`Expanding all nodes: ${new Date().toLocaleTimeString()}`);
    
    customSetNodes(nodes => {
      // First mark all nodes as expanded (not collapsed)
      const expandedNodes = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isCollapsed: false
        },
        hidden: false // Show all nodes
      }));
      
      return expandedNodes;
    });
    
    // Show all edges
    setEdges(currentEdges => 
      currentEdges.map(edge => ({ ...edge, hidden: false }))
    );
    
    // Force layout update
    isLayoutNecessaryRef.current = true;
    
    // Only fit view if autoFitOnChange is enabled
    if (autoFitOnChange) {
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
  }, [customSetNodes, setEdges, reactFlowInstance, autoFitOnChange]);

  // Function to collapse all nodes to show only use cases
  const collapseAllNodes = useCallback(() => {
    setLastUpdate(`Collapsing to show only top-level nodes: ${new Date().toLocaleTimeString()}`);
    
    customSetNodes(nodes => {
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
            isCollapsed: true // Ensure they're collapsed if they become visible later
          },
          hidden: true // Hide child nodes
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
      
      // Only fit view if autoFitOnChange is enabled
      if (autoFitOnChange) {
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
  }, [customSetNodes, setEdges, reactFlowInstance, autoFitOnChange]);

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
          <FileUploader />
        </div>
      ) : (
        <ReactFlow
          nodes={nodesWithProps}
          edges={edges.filter(edge => !edge.hidden)}
          onNodesChange={customNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.6, // Significantly increased padding
            includeHiddenNodes: false,
            duration: 800,
            minZoom: 0.3,
            maxZoom: 1.5
          }}
          minZoom={0.1}
          maxZoom={2}
          defaultViewport={{ zoom: 0.75, x: 0, y: 0 }}
          style={{ background: '#f8f8f8' }} // Add background color to make it visible
        >
          <Controls />
          <MiniMap />
          <Background variant="dots" gap={12} size={1} />
          
          {/* Status update panel */}
          <Panel position="bottom-left" style={{ 
            background: 'rgba(255, 255, 255, 0.8)', 
            padding: '8px 12px', 
            borderRadius: '4px',
            fontSize: '12px',
            color: '#333'
          }}>
            Last update: {lastUpdate || 'No updates yet'}
          </Panel>
          
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
      )}
    </div>
  );
});

FlowVisualizer.displayName = 'FlowVisualizer';

export default FlowVisualizer; 