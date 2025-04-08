'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function UseCaseNode({ data, layoutDirection }) {
  // Determine target and source positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  return (
    <div className="node use-case-node">
      <Handle type="target" position={targetPosition} />
      <div className="node-header">
        <div className="node-type">Use Case</div>
        <div className="node-title">{data.label}</div>
      </div>
      {data.description && (
        <div className="node-content">
          <div className="node-description">{data.description}</div>
        </div>
      )}
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default memo(UseCaseNode); 