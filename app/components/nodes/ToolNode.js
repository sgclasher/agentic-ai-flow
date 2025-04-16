'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function ToolNode({ data, id }) {
  // Extract all props directly from the data object passed by FlowVisualizer
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, toolType, details
  } = data || {}; // Access data directly
  
  // Get ServiceNow URL from store
  const serviceNowUrl = useAgenticStore(state => state.serviceNowUrl);
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;
  
  // Toggle collapse state
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', id);
    }
  }, [id, onToggle]);
  
  // Handle external link click
  const handleExternalLinkClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'tool', details?.sys_id, toolType);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id, toolType]);

  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node tool-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header">
        <div className="header-content">
          <div className="node-type">TOOL</div>
          <div className="node-title">{label}</div>
        </div>
        
        {canNavigate && (
          <button 
            className="node-external-link"
            onClick={handleExternalLinkClick}
            onMouseDown={(e) => e.stopPropagation()}
            title="Open in ServiceNow"
          >
            <ExternalLinkIcon />
          </button>
        )}
        
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
        {toolType && (
          <div className="node-field">
            <span className="field-label">Type:</span> {toolType}
          </div>
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