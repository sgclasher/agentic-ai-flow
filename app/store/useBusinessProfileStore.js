'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { TimelineService } from '../services/timelineService';

const useBusinessProfileStore = create(
  persist(
    (set, get) => ({
      // Business profile information
      businessProfile: {
        companyName: '',
        industry: '',
        companySize: '',
        currentTechStack: [],
        aiMaturityLevel: '',
        primaryGoals: [],
        budget: '',
        timeframe: '',
      },
      
      // Timeline settings
      scenarioType: 'balanced', // 'conservative', 'balanced', 'aggressive'
      selectedYear: new Date().getFullYear(),
      expandedSections: {}, // Track which timeline sections are expanded
      theme: 'dark', // 'dark' or 'light'
      
      // Generated timeline data
      timelineData: null,
      isGenerating: false,
      
      // Actions
      setBusinessProfile: (profile) => 
        set({ businessProfile: { ...get().businessProfile, ...profile } }),
        
      updateBusinessProfile: (updates) => 
        set({ businessProfile: { ...get().businessProfile, ...updates } }),
      
      setScenarioType: (type) => set({ scenarioType: type }),
      
      setSelectedYear: (year) => set({ selectedYear: year }),
      
      toggleSection: (sectionId) => 
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [sectionId]: !state.expandedSections[sectionId]
          }
        })),
      
      toggleTheme: () => 
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark'
        })),
      
      expandAllSections: () => {
        const sections = ['current-state', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'future-state'];
        const expanded = {};
        sections.forEach(section => { expanded[section] = true; });
        set({ expandedSections: expanded });
      },
      
      collapseAllSections: () => set({ expandedSections: {} }),
      
      hasValidProfile: () => {
        const { businessProfile } = get();
        return businessProfile.companyName && 
               businessProfile.industry && 
               businessProfile.companySize &&
               businessProfile.aiMaturityLevel &&
               businessProfile.primaryGoals.length > 0;
      },
      
      generateTimeline: async (profile) => {
        set({ isGenerating: true });
        
        // If profile is provided, update it first
        if (profile) {
          set({ businessProfile: profile });
        }
        
        const { businessProfile, scenarioType } = get();
        
        try {
          // Use the timeline service to generate the timeline
          const timelineData = await TimelineService.generateTimeline(businessProfile, scenarioType);
          set({ timelineData, isGenerating: false });
        } catch (error) {
          console.error('Error generating timeline:', error);
          set({ isGenerating: false });
          throw error;
        }
      },
      
      clearTimeline: () => set({ timelineData: null, expandedSections: {} }),
    }),
    {
      name: 'business-profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);



export default useBusinessProfileStore; 