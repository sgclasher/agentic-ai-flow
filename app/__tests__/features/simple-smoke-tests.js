/**
 * Simple Smoke Tests for MVP
 * Verifies that key features can be imported and basic functionality exists
 * For actual integration testing, use manual testing or E2E tests
 */

describe('MVP Smoke Tests', () => {
  
  describe('ServiceNow Flow Visualization', () => {
    it('should have required components', () => {
      // Verify components can be imported
      const FlowVisualizer = require('../../components/FlowVisualizer').default;
      const ServiceNowConnector = require('../../components/ServiceNowConnector').default;
      const useAgenticStore = require('../../store/useAgenticStore').default;
      
      expect(FlowVisualizer).toBeDefined();
      expect(ServiceNowConnector).toBeDefined();
      expect(useAgenticStore).toBeDefined();
    });
    
    it('should have flow utility functions', () => {
      const { transformAgenticData } = require('../../utils/transformAgenticData');
      const { applyDagreLayout } = require('../../utils/layoutGraph');
      
      expect(transformAgenticData).toBeDefined();
      expect(applyDagreLayout).toBeDefined();
      expect(typeof transformAgenticData).toBe('function');
      expect(typeof applyDagreLayout).toBe('function');
    });
  });
  
  describe('Client Profile Management', () => {
    it('should have profile services', () => {
      const { ProfileService } = require('../../services/profileService');
      const { markdownService } = require('../../services/markdownService');
      const { demoDataService } = require('../../services/demoDataService');
      
      expect(ProfileService).toBeDefined();
      expect(markdownService).toBeDefined();
      expect(demoDataService).toBeDefined();
      
      // Verify key methods exist as static methods
      expect(ProfileService.createProfile).toBeDefined();
      expect(ProfileService.getProfiles).toBeDefined();
      expect(markdownService.generateMarkdown).toBeDefined();
      expect(demoDataService.getDemoProfiles).toBeDefined();
    });
    
    it('should generate valid markdown', () => {
      const { markdownService } = require('../../services/markdownService');
      
      const testProfile = {
        companyName: 'Test Company',
        industry: 'Technology',
        companyOverview: {
          description: 'A test company'
        }
      };
      
      const markdown = markdownService.generateMarkdown(testProfile);
      expect(markdown).toContain('# Client Profile: Test Company');
      expect(markdown).toContain('Technology');
    });
  });
  
  describe('AI Timeline Generation', () => {
    it('should have timeline service', () => {
      const { TimelineService } = require('../../services/timelineService');
      
      expect(TimelineService).toBeDefined();
      expect(TimelineService.generateTimeline).toBeDefined();
      expect(typeof TimelineService.generateTimeline).toBe('function');
    });
    
    it('should generate timeline structure', async () => {
      const { TimelineService } = require('../../services/timelineService');
      
      const businessProfile = {
        companyName: 'Test Company',
        industry: 'Technology',
        companySize: '100-500',
        aiMaturity: 'beginner'
      };
      
      const timeline = await TimelineService.generateTimeline(businessProfile, 'balanced');
      
      expect(timeline).toBeDefined();
      expect(timeline.currentState).toBeDefined();
      expect(timeline.phases).toBeDefined();
      expect(Array.isArray(timeline.phases)).toBe(true);
      expect(timeline.phases.length).toBeGreaterThan(0);
    });
    
    it('should have timeline store', () => {
      const useBusinessProfileStore = require('../../store/useBusinessProfileStore').default;
      
      expect(useBusinessProfileStore).toBeDefined();
      expect(typeof useBusinessProfileStore).toBe('function');
    });
  });
  
  describe('API Routes', () => {
    it('should have validation utilities', () => {
      const validation = require('../../utils/validation');
      
      expect(validation.validateInstanceUrl).toBeDefined();
      expect(validation.validateScopeId).toBeDefined();
      expect(validation.validateBusinessProfile).toBeDefined();
      expect(validation.validateScenarioType).toBeDefined();
    });
  });
  
  describe('Data Integrity', () => {
    it('should have demo data in correct format', () => {
      const { demoDataService } = require('../../services/demoDataService');
      
      const demoProfiles = demoDataService.getDemoProfiles();
      expect(Array.isArray(demoProfiles)).toBe(true);
      expect(demoProfiles.length).toBeGreaterThan(0);
      
      // Check first demo profile has required fields
      const firstProfile = demoProfiles[0];
      expect(firstProfile.companyName).toBeDefined();
      expect(firstProfile.industry).toBeDefined();
      expect(firstProfile.size).toBeDefined();
      expect(firstProfile.valueSellingFramework).toBeDefined();
    });
  });
}); 