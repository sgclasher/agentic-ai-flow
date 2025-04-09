'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function ToolNode({ data, id }) {
  // Extract values from data prop
  const { layoutDirection, onToggle, isCollapsed, label, childrenCount, description } = data || {};
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Toggle clicked for tool node:', id, 'Current collapsed state:', isCollapsed);
    
    // Call the parent's toggle function if available
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', id);
    }
  }, [id, onToggle, isCollapsed]);
  
  // Only show the toggle button if this node has children
  const hasChildren = childrenCount > 0;

  return (
    <div className="node tool-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header">
        <div className="node-type">Tool</div>
        <div className="node-title">{label}</div>
        {hasChildren && (
          <button 
            className="expand-button" 
            onClick={handleToggle}
            onMouseDown={(e) => e.stopPropagation()}
            title={isCollapsed ? "Show child nodes" : "Hide child nodes"}
          >
            {isCollapsed ? '+' : '−'}
          </button>
        )}
      </div>
      <div className="node-content">
        {description && (
          <div className="node-description">{description}</div>
        )}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ToolNode); 