'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function ToolNode({ data, layoutDirection }) {
  // Determine target position based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;

  return (
    <div className="node tool-node">
      <Handle type="target" position={targetPosition} />
      <div className="node-header">
        <div className="node-type">Tool: {data.toolType}</div>
        <div className="node-title">{data.label}</div>
      </div>
      {data.description && (
        <div className="node-content">
          <div className="node-description">{data.description}</div>
        </div>
      )}
    </div>
  );
}

export default memo(ToolNode); 