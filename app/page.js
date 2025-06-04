'use client';

import React, { useState, useRef } from 'react';
import useAgenticStore from './store/useAgenticStore';
import ServiceNowConnector from './components/ServiceNowConnector';
import FlowVisualizer from './components/FlowVisualizer';
import { ReactFlowProvider } from 'reactflow';
import { Users, TrendingUp, Info, LogIn, LogOut, User } from 'lucide-react';
import { useAuth } from './contexts/AuthContext';
import AuthModal from './components/auth/AuthModal';

export default function Home() {
  // Authentication
  const { user, loading, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Agentic data
  const agenticData = useAgenticStore((state) => state.agenticData);
  const clearAgenticData = useAgenticStore((state) => state.clearAgenticData);
  const refreshData = useAgenticStore((state) => state.refreshData);
  const resetData = useAgenticStore((state) => state.resetData);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Layout direction state (restored)
  const [layoutDirection, setLayoutDirection] = useState('LR'); // 'LR' for horizontal, 'TB' for vertical
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
  const handleExpandAll = () => {
    flowVisualizerRef.current.expandAllNodes();
  };
  
  const handleCollapseAll = () => {
    flowVisualizerRef.current.collapseAllNodes();
  };
  
  const handleResetFlow = () => {
    resetData();
  };

  // Layout control handlers (restored)
  const handleLayoutChange = (direction) => {
    setLayoutDirection(direction);
  };

  const toggleAutoFit = () => {
    setAutoFitEnabled(!autoFitEnabled);
  };

  // Authentication handlers
  const handleLogin = () => {
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const closeAuthModal = () => {
    setShowAuthModal(false);
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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
              
              {/* Authentication Controls */}
              {loading ? (
                <div className="auth-loading">
                  <div className="spinner-small"></div>
                </div>
              ) : user ? (
                <div className="user-menu">
                  <button 
                    onClick={toggleUserMenu}
                    className="btn btn-user"
                  >
                    <User size={18} />
                    <span>{user.user_metadata?.firstName || user.email?.split('@')[0] || 'User'}</span>
                  </button>
                  {showUserMenu && (
                    <div className="user-dropdown">
                      <div className="user-info">
                        <p><strong>{user.user_metadata?.fullName || 'User'}</strong></p>
                        <p>{user.email}</p>
                      </div>
                      <button onClick={handleSignOut} className="dropdown-item">
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button 
                  onClick={handleLogin}
                  className="btn btn-auth"
                >
                  <LogIn size={18} />
                  Sign In
                </button>
              )}
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
                    firstUseCase: agenticData?.use_cases?.[0]?.name || 'None',
                    layoutDirection,
                    autoFitEnabled
                  }, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <div className="header-tabs">
            {/* Layout Controls (restored) */}
            <div className="button-group">
              <button 
                className={`btn ${layoutDirection === 'LR' ? 'btn-primary' : 'btn-neutral'}`}
                onClick={() => handleLayoutChange('LR')}
                title="Horizontal Layout"
              >
                Horizontal Layout
              </button>
              <button 
                className={`btn ${layoutDirection === 'TB' ? 'btn-primary' : 'btn-neutral'}`}
                onClick={() => handleLayoutChange('TB')}
                title="Vertical Layout"
              >
                Vertical Layout
              </button>
            </div>
            
            {/* Node Controls */}
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
            
            {/* Auto-fit Toggle */}
            <button 
              className={`btn ${autoFitEnabled ? 'btn-success' : 'btn-neutral'}`}
              onClick={toggleAutoFit}
              title={autoFitEnabled ? 'Auto-Fit: ON' : 'Auto-Fit: OFF'}
            >
              Auto-Fit: {autoFitEnabled ? 'ON' : 'OFF'}
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
                ref={flowVisualizerRef}
                layoutDirection={layoutDirection}
                autoFitOnChange={autoFitEnabled}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
      
      {/* Authentication Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={closeAuthModal}
        defaultMode="login"
      />
      
      <style jsx>{`
        .auth-loading {
          display: flex;
          align-items: center;
          padding: 0.5rem;
        }

        .spinner-small {
          width: 20px;
          height: 20px;
          border: 2px solid #e2e8f0;
          border-top: 2px solid #3498db;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .user-menu {
          position: relative;
        }

        .btn-user {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          color: #495057;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-user:hover {
          background: #e9ecef;
          border-color: #adb5bd;
        }

        .btn-auth {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: #3498db;
          border: none;
          color: white;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-auth:hover {
          background: #2980b9;
          transform: translateY(-1px);
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
        }

        .user-info {
          padding: 1rem;
          border-bottom: 1px solid #e9ecef;
          background: #f8f9fa;
        }

        .user-info p {
          margin: 0;
          font-size: 0.9rem;
        }

        .user-info p:first-child {
          color: #212529;
        }

        .user-info p:last-child {
          color: #6c757d;
          margin-top: 0.25rem;
        }

        .dropdown-item {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: none;
          border: none;
          color: #495057;
          cursor: pointer;
          transition: background-color 0.2s ease;
          font-size: 0.9rem;
        }

        .dropdown-item:hover {
          background: #f8f9fa;
          color: #dc3545;
        }
      `}</style>
    </main>
  );
} 