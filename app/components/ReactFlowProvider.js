'use client';

import { ReactFlowProvider as Provider } from 'reactflow';

export default function ReactFlowProvider({ children }) {
  return <Provider>{children}</Provider>;
} 