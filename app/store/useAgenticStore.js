'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Define the store
const useAgenticStore = create(
  persist(
    (set, get) => ({
      agenticData: null, // Initial state is null
      connectionDetails: null, // Store connection details for refresh
      isLoading: false,
      error: null,

      // Action to set the agentic data (used by file upload OR API fetch)
      setAgenticData: (data) => set({ agenticData: data }),

      // Store connection details for later refresh
      setConnectionDetails: (details) => set({ connectionDetails: details }),

      // Action to clear the data
      clearAgenticData: () => set({ 
        agenticData: null, 
        connectionDetails: null,
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
          const { instanceUrl, username, password, scopeId } = connectionDetails;
          
          const response = await fetch('/api/servicenow/fetch-agentic-data', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              instanceUrl,
              username,
              password,
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
      // Don't persist sensitive data like passwords
      partialize: (state) => ({
        layoutDirection: state.layoutDirection,
        // Only store the most recent connection details but not the password
        connectionDetails: state.connectionDetails ? {
          ...state.connectionDetails,
          password: undefined // Exclude password from localStorage
        } : null
      }),
    }
  )
);

export default useAgenticStore;