'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function AgentNode({ data, layoutDirection, id, onToggle }) {
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Toggle clicked for agent node:', id, 'Current collapsed state:', data.isCollapsed);
    
    // Call the parent's toggle function
    onToggle(id);
  }, [id, onToggle, data.isCollapsed]);
  
  // Only show the toggle button if this node has children
  const hasChildren = data.childrenCount > 0;

  return (
    <div className="node agent-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <div className="node-header">
        <div className="node-type">Agent</div>
        <div className="node-title">{data.label}</div>
        {hasChildren && (
          <button 
            className="expand-button" 
            onClick={handleToggle}
            onMouseDown={(e) => e.stopPropagation()}
            title={data.isCollapsed ? "Show child nodes" : "Hide child nodes"}
          >
            {data.isCollapsed ? '+' : '−'}
          </button>
        )}
      </div>
      <div className="node-content">
        {data.role && (
          <div className="node-role">
            <span className="label">Role:</span>
            <span className="value">{data.role}</span>
          </div>
        )}
        {data.description && (
          <div className="node-description">{data.description}</div>
        )}
        {hasChildren && (
          <div className="node-children-info">
            {data.childrenCount} child node{data.childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default memo(AgentNode); 