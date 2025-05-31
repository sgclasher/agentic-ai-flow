'use client';

import React, { useState, useRef } from 'react';
import useAgenticStore from './store/useAgenticStore';
import ServiceNowConnector from './components/ServiceNowConnector';
import FlowVisualizer from './components/FlowVisualizer';
import { ReactFlowProvider } from 'reactflow';

export default function Home() {
  const agenticData = useAgenticStore((state) => state.agenticData);
  const clearAgenticData = useAgenticStore((state) => state.clearAgenticData);
  const refreshData = useAgenticStore((state) => state.refreshData);
  const resetData = useAgenticStore((state) => state.resetData);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Flow control states
  const [layoutDirection, setLayoutDirection] = useState('LR');
  const [autoFitEnabled, setAutoFitEnabled] = useState(false);
  
  // Refs for flow control methods
  const flowVisualizerRef = useRef({
    expandAllNodes: () => {},
    collapseAllNodes: () => {},
  });

  // Simple error boundary implementation
  const handleError = (error) => {
    console.error("Error in flow visualization:", error);
    setError(error.message || "An error occurred displaying the flow diagram");
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err.message || "Failed to refresh data from ServiceNow");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Flow control handlers
  const handleLayoutChange = (direction) => {
    setLayoutDirection(direction);
  };
  
  const handleExpandAll = () => {
    flowVisualizerRef.current.expandAllNodes();
  };
  
  const handleCollapseAll = () => {
    flowVisualizerRef.current.collapseAllNodes();
  };
  
  const handleAutoFitToggle = () => {
    setAutoFitEnabled(!autoFitEnabled);
  };
  
  const handleResetFlow = () => {
    resetData();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-0" style={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {agenticData && (
        <header className="app-header">
          <div className="header-top">
            <div className="logo-and-title">
              <h1 className="app-title">Agentic AI Flow Manager</h1>
              <div className="logo-wrapper">
                <img
                  src="/images/nowgenticLogo.svg"
                  alt="NOWGENTIC Logo"
                  height={30}
                  width={120}
                />
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => window.location.href = '/timeline'}
                className="btn btn-success"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                AI Timeline
              </button>
              <button 
                onClick={clearAgenticData}
                className="btn btn-secondary"
              >
                <span>Disconnect</span>
              </button>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-primary"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'} 
              </button>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="btn btn-secondary btn-icon"
                aria-label="Toggle debug info"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M12 16v.01"></path>
                  <path d="M12 8v4"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {showDebug && (
            <div className="debug-info">
              <details open>
                <summary>Debug Information</summary>
                <pre>
                  {JSON.stringify({
                    dataPresent: !!agenticData,
                    useCases: agenticData?.use_cases?.length || 0,
                    firstUseCase: agenticData?.use_cases?.[0]?.name || 'None'
                  }, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <div className="header-tabs">
            <div className="button-group">
              <button 
                className={`btn ${layoutDirection === 'LR' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleLayoutChange('LR')}
              >
                Horizontal Layout
              </button>
              <button 
                className={`btn ${layoutDirection === 'TB' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => handleLayoutChange('TB')}
              >
                Vertical Layout
              </button>
            </div>
            <div className="button-group">
              <button 
                className="btn btn-neutral"
                onClick={handleCollapseAll}
              >
                Collapse All
              </button>
              <button 
                className="btn btn-neutral"
                onClick={handleExpandAll}
              >
                Expand All
              </button>
            </div>
            <button 
              className="btn btn-secondary"
              onClick={handleAutoFitToggle}
            >
              Auto-Fit: 
              <span className={`status-badge ${autoFitEnabled ? 'status-badge-on' : 'status-badge-off'}`}>
                {autoFitEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
            <button 
              className="btn btn-danger"
              onClick={handleResetFlow}
            >
              Reset Flow
            </button>
          </div>
        </header>
      )}
      
      <div className={`flex-1 w-full ${agenticData ? 'mt-0' : 'mt-8'}`}>
        {!agenticData ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <ServiceNowConnector />
          </div>
        ) : error ? (
          <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50 mb-4 m-4">
            <h3 className="font-bold">Error Displaying Flow</h3>
            <p>{error}</p>
            <button 
              onClick={clearAgenticData}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 120px)', width: '100%', position: 'relative' }}>
            <ReactFlowProvider>
              <FlowVisualizer 
                onError={handleError} 
                layoutDirection={layoutDirection}
                autoFitOnChange={autoFitEnabled}
                ref={flowVisualizerRef}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </main>
  );
} 