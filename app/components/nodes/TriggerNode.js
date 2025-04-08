'use client';

import { memo } from 'react';
import { Handle, Position } from 'reactflow';

function TriggerNode({ data, layoutDirection }) {
  // Determine source position based on layout direction
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  return (
    <div className="node trigger-node">
      <div className="node-header">
        <div className="node-type">Trigger</div>
        <div className="node-title">{data.label || 'Trigger'}</div>
      </div>
      <div className="node-content">
        {data.target_table && (
          <div className="node-field">
            <span className="field-label">Table:</span> {data.target_table}
          </div>
        )}
        {data.condition && (
          <div className="node-field">
            <span className="field-label">Condition:</span> {data.condition}
          </div>
        )}
        {data.objective && (
          <div className="node-field">
            <span className="field-label">Objective:</span> {data.objective}
          </div>
        )}
      </div>
      <Handle type="source" position={sourcePosition} />
    </div>
  );
}

export default memo(TriggerNode); 