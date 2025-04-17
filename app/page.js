'use client';

import React, { useState } from 'react';
import useAgenticStore from './store/useAgenticStore';
// import FileUploader from './components/FileUploader'; // Remove FileUploader
import ServiceNowConnector from './components/ServiceNowConnector'; // Import ServiceNowConnector
import FlowVisualizer from './components/FlowVisualizer';
import { ReactFlowProvider } from 'reactflow'; // Import ReactFlowProvider

export default function Home() {
  const agenticData = useAgenticStore((state) => state.agenticData);
  const clearAgenticData = useAgenticStore((state) => state.clearAgenticData);
  const refreshData = useAgenticStore((state) => state.refreshData);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-8 lg:p-12">
      <div className="z-10 max-w-none w-full items-center justify-between font-mono text-sm lg:flex flex-col">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 text-center">Agentic AI Flow Visualizer</h1>

        {/* Conditionally render Connector or Visualizer */} 
        {!agenticData ? (
            // <FileUploader /> // Remove FileUploader instance
            <ServiceNowConnector /> // Add ServiceNowConnector instance
        ) : error ? (
          <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50 mb-4">
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
          <>
            <div className="flex gap-4 mb-4">
              <button 
                onClick={clearAgenticData}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Disconnect / Load New Data
              </button>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'} 
              </button>
            </div>
            
            {/* Add debug information */}
            <div className="mb-4 text-xs text-gray-500">
              <details>
                <summary>Debug Info</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded overflow-auto max-h-40">
                  {JSON.stringify({
                    dataPresent: !!agenticData,
                    useCases: agenticData?.use_cases?.length || 0,
                    firstUseCase: agenticData?.use_cases?.[0]?.name || 'None'
                  }, null, 2)}
                </pre>
              </details>
            </div>

            <div style={{ height: 'calc(100vh - 150px)', width: '100%', position: 'relative' }}>
              <ReactFlowProvider>
                <FlowVisualizer onError={handleError} />
              </ReactFlowProvider>
            </div>
          </>
        )}
      </div>
    </main>
  );
} 