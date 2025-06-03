'use client';

import React, { useState, useRef } from 'react';
import useAgenticStore from './store/useAgenticStore';
import ServiceNowConnector from './components/ServiceNowConnector';
import FlowVisualizer from './components/FlowVisualizer';
import { ReactFlowProvider } from 'reactflow';
import { Users, TrendingUp, Info } from 'lucide-react';

export default function Home() {
  const agenticData = useAgenticStore((state) => state.agenticData);
  const clearAgenticData = useAgenticStore((state) => state.clearAgenticData);
  const refreshData = useAgenticStore((state) => state.refreshData);
  const resetData = useAgenticStore((state) => state.resetData);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
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
  const handleExpandAll = () => {
    flowVisualizerRef.current.expandAllNodes();
  };
  
  const handleCollapseAll = () => {
    flowVisualizerRef.current.collapseAllNodes();
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
                onClick={() => window.location.href = '/profiles'}
                className="btn btn-primary"
              >
                <Users size={18} />
                Client Profiles
              </button>
              <button 
                onClick={() => window.location.href = '/timeline'}
                className="btn btn-success"
              >
                <TrendingUp size={18} />
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
                <Info size={18} />
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
                ref={flowVisualizerRef}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </main>
  );
} 