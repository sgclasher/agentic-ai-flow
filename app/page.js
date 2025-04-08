import FlowVisualizer from './components/FlowVisualizer';
import ReactFlowProvider from './components/ReactFlowProvider';

export default function Home() {
  return (
    <main style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column' }}>
      <header style={{ padding: '1rem', borderBottom: '1px solid #eaeaea' }}>
        <h1>ServiceNow Agentic AI Flow Visualizer</h1>
        <p>Visualize how agentic AI solutions work in ServiceNow</p>
      </header>
      <ReactFlowProvider>
        <FlowVisualizer />
      </ReactFlowProvider>
    </main>
  );
} 