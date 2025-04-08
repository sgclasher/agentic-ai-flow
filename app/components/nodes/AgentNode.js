'use client';

import { memo, useState } from 'react';
import { Handle, Position } from 'reactflow';

function AgentNode({ data, layoutDirection }) {
  const [expanded, setExpanded] = useState(false);

  // Determine target and source positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  return (
    <div className="node agent-node">
      <Handle type="target" position={targetPosition} />
      <div className="node-header">
        <div className="node-type">Agent</div>
        <div className="node-title">{data.label}</div>
        <button 
          className="expand-button" 
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? '−' : '+'}
        </button>
      </div>
      <div className="node-content">
        {data.description && (
          <div className="node-description">{data.description}</div>
        )}
      </div>
      {expanded && (
        <div className="node-expanded-content">
          {data.role && (
            <div className="node-section">
              <div className="section-title">Role</div>
              <div className="section-content">{data.role}</div>
            </div>
          )}
          {data.instructions && (
            <div className="node-section">
              <div className="section-title">Instructions</div>
              <div className="section-content">{data.instructions}</div>
            </div>
          )}
        </div>
      )}
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default memo(AgentNode); 