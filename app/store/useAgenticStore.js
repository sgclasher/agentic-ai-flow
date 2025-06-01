'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the store
const useAgenticStore = create(
  persist(
    (set, get) => ({
      agenticData: null, // Initial state is null
      connectionDetails: null, // Store connection details for refresh
      serviceNowUrl: '', // Base ServiceNow instance URL for opening links
      isLoading: false,
      error: null,

      // Action to set the agentic data (used by file upload OR API fetch)
      setAgenticData: (data) => set({ agenticData: data }),

      // Store connection details for later refresh
      setConnectionDetails: (details) => {
        // Extract the instance URL and store it for node links
        const { instanceUrl } = details;
        set({ 
          connectionDetails: details,
          serviceNowUrl: instanceUrl // Set the serviceNowUrl for external links
        });
      },

      // Action to clear the data
      clearAgenticData: () => set({ 
        agenticData: null, 
        connectionDetails: null,
        serviceNowUrl: '',
        error: null 
      }),
      
      // Action to reset just the flow data, keeping connection details for refresh
      resetData: () => set({ 
        agenticData: null,
        error: null 
      }),

      // Fetch fresh data using stored connection details
      refreshData: async () => {
        const { connectionDetails } = get();
        
        if (!connectionDetails) {
          throw new Error('No connection details available for refresh');
        }

        set({ isLoading: true, error: null });
        
        try {
          const { instanceUrl, scopeId } = connectionDetails;
          
          // Keep or update the serviceNowUrl
          set({ serviceNowUrl: instanceUrl });
          
          // Only send non-sensitive connection details
          // Credentials are handled server-side via environment variables
          const response = await fetch('/api/servicenow/fetch-agentic-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              instanceUrl,
              scopeId
            }),
          });

          if (!response.ok) {
            let errorMessage = 'Failed to refresh data from ServiceNow';
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
          console.log('Data refreshed successfully:', data);

          // Update the store with the processed data
          set({ agenticData: data, isLoading: false });
          return data;
        } catch (err) {
          console.error('Error refreshing ServiceNow data:', err);
          set({ error: err.message || 'An unknown error occurred while refreshing data', isLoading: false });
          throw err;
        }
      },

      // Add other state/actions as needed, e.g., layout direction, expanded nodes
      layoutDirection: 'LR', // 'LR' (Horizontal) or 'TB' (Vertical)
      setLayoutDirection: (direction) => set({ layoutDirection: direction }),

      // Store expanded/collapsed state if needed across re-renders or persistence
      // Example: expandedNodes: { nodeId: true, ... }
      // setNodeExpansion: (nodeId, isExpanded) => set((state) => ({ ... })),
    }),
    {
      name: 'agentic-flow-storage', // Name for local storage key
      storage: createJSONStorage(() => localStorage), // Use local storage
      // Only persist non-sensitive data
      partialize: (state) => ({
        layoutDirection: state.layoutDirection,
        serviceNowUrl: state.serviceNowUrl, // Persist the serviceNowUrl
        // Store connection details (no sensitive data included)
        connectionDetails: state.connectionDetails
      }),
    }
  )
);

export default useAgenticStore;