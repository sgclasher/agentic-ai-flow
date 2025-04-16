'use client';

import { create } from 'zustand';

const useAgenticStore = create((set) => ({
  agenticData: null,
  isLoading: false,
  error: null,
  serviceNowUrl: '', // Base ServiceNow instance URL
  
  // Set the ServiceNow URL
  setServiceNowUrl: (url) => {
    console.log('Setting ServiceNow URL:', url);
    set({ serviceNowUrl: url });
  },
  
  // Set the agentic data from JSON
  setAgenticData: (data) => set({ agenticData: data, error: null }),
  
  // Load agentic data from file
  loadAgenticData: async (file) => {
    try {
      set({ isLoading: true, error: null });
      
      const text = await file.text();
      const parsedData = JSON.parse(text);
      
      set({ 
        agenticData: parsedData,
        isLoading: false
      });
      
      return true;
    } catch (error) {
      set({ 
        error: `Failed to parse data: ${error.message}`,
        isLoading: false 
      });
      return false;
    }
  },
  
  // Reset the store
  resetData: () => set({ agenticData: null, error: null, serviceNowUrl: '' }),
}));

export default useAgenticStore; 