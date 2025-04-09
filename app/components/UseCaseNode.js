'use client';

import { memo, useCallback } from 'react';
import { Handle, Position, useReactFlow } from 'reactflow';

function UseCaseNode({ data, layoutDirection, id }) {
  const { setNodes } = useReactFlow();
  
  // Determine target and source positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state and trigger layout update
  const toggleCollapse = useCallback((e) => {
    // Stop event propagation to prevent React Flow from handling it
    e.stopPropagation();
    
    setNodes((nodes) => {
      const updatedNodes = nodes.map((node) => {
        if (node.id === id) {
          // Toggle collapse state
          return {
            ...node,
            data: {
              ...node.data,
              isCollapsed: !node.data.isCollapsed,
            },
          };
        }
        return node;
      });
      
      return updatedNodes;
    });
  }, [id, setNodes]);

  return (
    <div 
      className={`node use-case-node ${data.isCollapsed ? 'collapsed' : ''}`}
      onClick={(e) => e.stopPropagation()} // Prevent click from triggering node selection
    >
      <Handle type="target" position={targetPosition} />
      <div className="node-header">
        <div className="node-type">Use Case</div>
        <div className="node-title">{data.label}</div>
        <button 
          className="expand-button" 
          onClick={toggleCollapse}
        >
          {data.isCollapsed ? '+' : '−'}
        </button>
      </div>
      {!data.isCollapsed && data.description && (
        <div className="node-content">
          <div className="node-description">{data.description}</div>
        </div>
      )}
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default memo(UseCaseNode); 