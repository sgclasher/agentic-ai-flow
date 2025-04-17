'use client';

import React, { useState } from 'react';
import useAgenticStore from '../store/useAgenticStore';

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
  // Hardcoded values for testing
  const [instanceUrl, setInstanceUrl] = useState('https://nowgenticllcdemo1.service-now.com');
  const [username, setUsername] = useState('integrationUser');
  const [password, setPassword] = useState('J5)F{b!L]3hPkrU]V_j:c[({h4QV@iQn7Ob!@o+rne0A<VV+*U.z^[r)e&@mO.o7}E1{xJSyAfDhd:A&?*LUa4TCYl;QZXNF@]_a');
  const [scopeId, setScopeId] = useState('33df17ef47d8ea10d93447c4416d43cd');
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAgenticData = useAgenticStore((state) => state.setAgenticData);
  const setConnectionDetails = useAgenticStore((state) => state.setConnectionDetails);

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Fetching data using proxy API...');

    if (!instanceUrl || !username || !password || !scopeId) {
      setError('Please fill in all fields.');
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

      // Store connection details for refresh operations
      const connectionDetails = {
        instanceUrl: formattedUrl,
        username,
        password,
        scopeId
      };

      // Use our API route to fetch all the data at once
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
    <div className="p-4 border rounded-lg shadow-sm bg-white max-w-md mx-auto mt-5">
      <h2 className="text-xl font-semibold mb-4 text-center">Connect to ServiceNow</h2>
      <div className="space-y-3">
        <div>
          <label htmlFor="instanceUrl" className="block text-sm font-medium text-gray-700">
            Instance URL
          </label>
          <input
            type="text"
            id="instanceUrl"
            value={instanceUrl}
            onChange={(e) => setInstanceUrl(e.target.value)}
            placeholder="your-instance.service-now.com"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            readOnly
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password / Token
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            readOnly
          />
           <p className="mt-1 text-xs text-gray-500">Note: Server-side authentication is used for security.</p>
        </div>
        <div>
          <label htmlFor="scopeId" className="block text-sm font-medium text-gray-700">
            Application Scope Sys ID
          </label>
          <input
            type="text"
            id="scopeId"
            value={scopeId}
            onChange={(e) => setScopeId(e.target.value)}
            placeholder="Enter the sys_id of the target scope"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-gray-100"
            readOnly
          />
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-600 text-sm">
          Error: {error}
        </div>
      )}

      <button
        onClick={handleFetchData}
        disabled={isLoading}
        className="mt-4 w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
      >
        {isLoading ? 'Connecting...' : 'Fetch Data'}
      </button>
    </div>
  );
}