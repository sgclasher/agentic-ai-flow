'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function AgentNode({ data, id }) {
  // Extract all props directly from the data object passed by FlowVisualizer
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, role, details
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
    
    console.log('AgentNode external link clicked:', {
      serviceNowUrl,
      details,
      sys_id: details?.sys_id,
      hasDetails: !!details,
    });
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'agent', details?.sys_id);
    
    console.log('Generated URL:', url);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id]);
  
  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node agent-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header">
        <div className="header-content">
          <div className="node-type">AGENT</div>
          <div className="node-title">{label}</div>
        </div>
        
        <div className="node-header-buttons">
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
      </div>
      <div className="node-content">
        {description && (
          <div className="node-description">{description}</div>
        )}
        {role && (
          <div className="node-field">
            <span className="field-label">Role:</span> {role}
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

export default memo(AgentNode); 