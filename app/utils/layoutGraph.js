import dagre from 'dagre';

/**
 * Applies an organized hierarchical layout to nodes and edges using Dagre
 * @param {Array} nodes - React Flow nodes
 * @param {Array} edges - React Flow edges
 * @param {Object} options - Layout options
 * @returns {Object} { nodes, edges } - Positioned nodes and edges
 */
export const applyDagreLayout = (nodes, edges, options = {}) => {
  const {
    direction = 'LR', // LR = left to right, TB = top to bottom
    nodeWidth = 280,
    nodeHeight = 150, 
    rankSeparation = 250, // Distance between ranks (vertical layers)
    nodeSeparation = 150, // Distance between nodes in the same rank
  } = options;

  // Skip if no nodes or edges
  if (!nodes.length) return { nodes, edges };

  // Create a new directed graph
  const dagreGraph = new dagre.graphlib.Graph({ multigraph: true });
  
  // Set default edge and node properties
  dagreGraph.setGraph({
    rankdir: direction,
    nodesep: nodeSeparation,
    ranksep: rankSeparation,
    marginx: 50,
    marginy: 50,
  });
  
  // Default to assigning a new object as a label for each edge/node
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setDefaultNodeLabel(() => ({}));
  
  // Add nodes to the graph with their dimensions
  nodes.forEach((node) => {
    const width = node.type === 'useCaseNode' ? nodeWidth * 1.2 : nodeWidth;
    const height = node.type === 'agentNode' && node.data.instructions ? nodeHeight * 1.5 : nodeHeight;
    
    dagreGraph.setNode(node.id, { width, height });
  });
  
  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });
  
  // Apply layout
  dagre.layout(dagreGraph);
  
  // Get positioned nodes from dagre
  const positionedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWithPosition.width / 2,
        y: nodeWithPosition.y - nodeWithPosition.height / 2,
      },
    };
  });
  
  return { nodes: positionedNodes, edges };
}; 