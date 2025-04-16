'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function TriggerNode({ data, id }) { 
  // Extract all props directly from the data object passed by FlowVisualizer
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, condition, details
  } = data || {}; // Access data directly
  
  // Get ServiceNow URL from store
  const serviceNowUrl = useAgenticStore(state => state.serviceNowUrl);
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state (keep for potential future use, though Triggers don't have children now)
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Toggle clicked for trigger node:', id, 'Current collapsed state:', isCollapsed);
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
    
    console.log('TriggerNode external link clicked:', {
      serviceNowUrl,
      details,
      sys_id: details?.sys_id,
      hasDetails: !!details,
    });
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'trigger', details?.sys_id);
    
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
    <div className="node trigger-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      {/* Header now only contains the type */}
      <div className="node-header">
        <div className="node-type">TRIGGER</div>
        
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
        
        {/* Keep expand button logic if needed */}
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

      {/* Content area holds the objective (label) and description */}
      <div className="node-content">
        {/* Display the objective (label) as main body text */}
        {label && (
          <div className="trigger-objective-body">{label}</div>
        )}
        {/* Display condition if present */}
        {condition && (
          <div className="node-condition">
            <div className="condition-label">Condition:</div>
            <div className="condition-value">{condition}</div>
          </div>
        )}
        {/* Display description below objective if present */}
        {description && (
          <div className="node-description">{description}</div>
        )}
        {/* Children info (though likely unused for triggers) */}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TriggerNode); 