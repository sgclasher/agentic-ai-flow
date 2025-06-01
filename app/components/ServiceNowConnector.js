'use client';

import React, { useState, useEffect } from 'react';
import useAgenticStore from '../store/useAgenticStore';
import Image from 'next/image';

// Helper to safely get nested properties
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};

export default function ServiceNowConnector() {
  // Fetch non-sensitive connection details from API on mount
  const [instanceUrl, setInstanceUrl] = useState('');
  const [scopeId, setScopeId] = useState('');

  useEffect(() => {
    fetch('/api/servicenow/get-credentials')
      .then(res => res.json())
      .then(data => {
        setInstanceUrl(data.instanceUrl || '');
        setScopeId(data.scopeId || '');
      })
      .catch(() => {
        // fallback to empty/defaults if fetch fails
      });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAgenticData = useAgenticStore((state) => state.setAgenticData);
  const setConnectionDetails = useAgenticStore((state) => state.setConnectionDetails);

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Fetching data using server-side credentials...');

    if (!instanceUrl || !scopeId) {
      setError('Instance URL and Scope ID are required.');
      setIsLoading(false);
      return;
    }

    try {
      // Format the instance URL
      let formattedUrl = instanceUrl.trim();
      if (!formattedUrl.startsWith('https://') && !formattedUrl.startsWith('http://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      if (formattedUrl.endsWith('/')) {
        formattedUrl = formattedUrl.slice(0, -1);
      }

      // Store connection details for refresh operations (no sensitive data)
      const connectionDetails = {
        instanceUrl: formattedUrl,
        scopeId
      };
      
      console.log('Setting connection details with instance URL:', formattedUrl);

      // Use our API route to fetch all the data at once
      // Credentials are handled server-side via environment variables
      const response = await fetch('/api/servicenow/fetch-agentic-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionDetails),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch data from ServiceNow';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use the status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Process the response
      const data = await response.json();
      console.log('Data fetched successfully:', data);

      // Store connection details (for refresh) and then update the store with the data
      setConnectionDetails(connectionDetails);
      setAgenticData(data);

    } catch (err) {
      console.error('Error fetching or processing ServiceNow data:', err);
      setError(err.message || 'An unknown error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
          {/* Cube icon at the top */}
          <div className="cube-icon" style={{ backgroundColor: '#2196f3', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="white" fill="none" strokeWidth="1"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="white" strokeWidth="1"></line>
            </svg>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Agentic AI Visualizer</h2>
          
          <div className="login-branding" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="nowgentic-logo">
              {/* Using the SVG file from public directory with correct filename */}
              <img 
                src="/images/nowgenticLogo.svg" 
                alt="NOWGENTIC Logo" 
                width={120} 
                height={30} 
                style={{ display: 'block' }}
              />
            </div>
          </div>
          
          <p className="login-subtitle" style={{ fontSize: '0.9rem', color: '#666', margin: '0' }}>
            Connect to your ServiceNow instance to visualize Agentic AI flows
          </p>
        </div>
        
        <div className="login-form" style={{ padding: '0 1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="instanceUrl" style={{ display: 'flex', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Instance URL
            </label>
            <input
              type="text"
              id="instanceUrl"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
              placeholder="your-instance.service-now.com"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem', color: '#444' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="scopeId" style={{ display: 'flex', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Application Scope Sys ID
            </label>
            <input
              type="text"
              id="scopeId"
              value={scopeId}
              onChange={(e) => setScopeId(e.target.value)}
              placeholder="Enter the sys_id of the target scope"
              readOnly
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem', color: '#444' }}
            />
          </div>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <strong>Secure Connection:</strong> Authentication is handled server-side using environment variables.
            </p>
          </div>
        </div>
        
        {error && (
          <div className="login-error" style={{ margin: '0 1.5rem 1.5rem', padding: '0.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        
        <button
          onClick={handleFetchData}
          disabled={isLoading}
          className="login-button"
          style={{ 
            width: 'calc(100% - 3rem)', 
            margin: '0 1.5rem 1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <>
              <svg className="spinner" viewBox="0 0 50 50" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="5"></circle>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
              Connect & Visualize
            </>
          )}
        </button>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Or explore our client intelligence tools:
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.location.href = '/profiles'}
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3498db',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Client Profiles
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/timeline'}
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              AI Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}