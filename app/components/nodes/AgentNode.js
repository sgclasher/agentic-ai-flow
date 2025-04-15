'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

function AgentNode({ data, id }) {
  // Extract values from data prop
  const { layoutDirection, onToggle, isCollapsed, label, childrenCount, description, role } = data || {};
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('Toggle clicked for agent node:', id, 'Current collapsed state:', isCollapsed);
    
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
    <div className="node agent-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <div className="node-header">
        <div className="node-type">Agent</div>
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
        {role && (
          <div className="node-role">
            <span className="label">Role:</span>
            <span className="value">{role}</span>
          </div>
        )}
        {description && (
          <div className="node-description">{description}</div>
        )}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default memo(AgentNode); 