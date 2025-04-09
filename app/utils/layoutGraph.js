import * as dagre from 'dagre';

/**
 * Applies Dagre layout to React Flow nodes and edges
 * 
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {Object} options - Layout options
 * @param {String} options.direction - Layout direction ('LR' or 'TB')
 * @param {Number} options.nodeSeparation - Separation between nodes (default: 100)
 * @param {Number} options.rankSeparation - Separation between ranks (default: 200)
 * @returns {Object} { nodes, edges } with positions applied
 */
export function applyDagreLayout(nodes, edges, options = {}) {
  const direction = options.direction || 'LR';
  const nodeSeparation = options.nodeSeparation || 100;
  const rankSeparation = options.rankSeparation || 200;
  
  // Filter out hidden nodes
  const visibleNodes = nodes.filter(node => !node.hidden);
  
  // Get IDs of all visible nodes
  const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
  
  // Filter edges to only include those connecting visible nodes
  const visibleEdges = edges.filter(edge => 
    visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)
  );
  
  // Mark other edges as hidden
  const updatedEdges = edges.map(edge => {
    if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
      return { ...edge, hidden: false };
    } else {
      return { ...edge, hidden: true };
    }
  });
  
  // Create a new directed graph
  const g = new dagre.graphlib.Graph();
  g.setGraph({
    rankdir: direction,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
    marginx: 25,
    marginy: 25,
    acyclicer: 'greedy',     // Use greedy algorithm to handle cycles
    ranker: 'network-simplex' // Use network simplex algorithm for ranking
  });
  g.setDefaultEdgeLabel(() => ({}));
  
  // Define node dimensions based on type and collapsed state
  const getNodeDimensions = (node) => {
    // Base dimensions
    const defaultDimensions = { width: 250, height: 100 };
    
    // If node is collapsed, make it smaller
    if (node.data.isCollapsed) {
      return { width: 180, height: 50 };
    }
    
    // Set dimensions based on node type and content
    if (node.type === 'useCaseNode') {
      return { width: 260, height: node.data.description ? 130 : 80 };
    }
    
    if (node.type === 'triggerNode') {
      const hasFields = node.data.target_table || node.data.condition || node.data.objective;
      return { width: 270, height: hasFields ? 160 : 80 };
    }
    
    if (node.type === 'agentNode') {
      const hasDetails = node.data.role || node.data.instructions;
      const hasDescription = node.data.description;
      
      if (hasDetails && node.data.expanded) {
        return { width: 280, height: 240 };
      } else if (hasDescription) {
        return { width: 260, height: 120 };
      }
      return { width: 230, height: 80 };
    }
    
    if (node.type === 'toolNode') {
      return { width: 230, height: node.data.description ? 110 : 70 };
    }
    
    return defaultDimensions;
  };
  
  // Add nodes to the graph with computed dimensions
  visibleNodes.forEach((node) => {
    const { width, height } = getNodeDimensions(node);
    g.setNode(node.id, { width, height, id: node.id });
  });
  
  // Add edges to the graph
  visibleEdges.forEach((edge) => {
    g.setEdge(edge.source, edge.target);
  });
  
  // Apply the layout algorithm
  try {
    dagre.layout(g);
  } catch (error) {
    console.error("Error during layout calculation:", error);
    // Return original nodes if layout fails
    return { nodes, edges: updatedEdges };
  }
  
  // Get the positioned nodes from the graph with original properties
  const positionedNodes = nodes.map((node) => {
    if (node.hidden) {
      // Keep hidden nodes as is, but under their parent if possible
      const parentNode = node.data.parentId ? nodes.find(n => n.id === node.data.parentId) : null;
      if (parentNode && parentNode.position) {
        return {
          ...node,
          position: {
            x: parentNode.position.x,  // Place under parent
            y: parentNode.position.y + 200  // Place below parent
          }
        };
      }
      return node;
    }

    const graphNode = g.node(node.id);
    
    // Skip if node wasn't positioned correctly
    if (!graphNode) {
      console.warn(`Node ${node.id} was not positioned correctly by Dagre`);
      return node;
    }
    
    const { width, height } = getNodeDimensions(node);
    
    return {
      ...node,
      position: {
        x: graphNode.x - width / 2,
        y: graphNode.y - height / 2,
      },
      // Preserve original dimensions and any other properties
      width,
      height,
    };
  });
  
  return { nodes: positionedNodes, edges: updatedEdges };
} 