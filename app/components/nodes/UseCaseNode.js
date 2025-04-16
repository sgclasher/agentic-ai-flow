'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function UseCaseNode({ data, id }) {
  // Extract all props directly from the data object
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, details
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
    
    console.log('Toggle clicked for use case node:', id, 'Current collapsed state:', isCollapsed);
    
    // Call the parent's toggle function if available
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', id);
    }
  }, [id, onToggle, isCollapsed]);

  // Handle external link click
  const handleExternalLinkClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'useCase', details?.sys_id);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id]);

  // Only show the toggle button if this node has children
  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node use-case-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header use-case-header">
        <div className="header-content">
          <div className="node-type">USE CASE</div>
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
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(UseCaseNode); 