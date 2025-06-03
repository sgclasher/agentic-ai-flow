/**
 * Tests for Enhanced DemoDataService with Supabase Integration
 * 
 * Comprehensive test suite covering:
 * - Demo data initialization and management
 * - Industry-specific template generation
 * - Demo mode toggle functionality
 * - Supabase integration with fallback mechanisms
 * - Profile, timeline, and conversation generation
 * - Export/import capabilities
 */

// Mock environment for testing
process.env.NODE_ENV = 'test';

// Mock the Supabase service
jest.mock('../supabaseService', () => ({
  ProfileDB: {
    create: jest.fn(),
    delete: jest.fn()
  },
  TimelineDB: {
    create: jest.fn()
  },
  AuthService: {
    getCurrentUser: jest.fn()
  },
  AuditService: {
    log: jest.fn()
  },
  AIConversationDB: {
    create: jest.fn()
  },
  FeatureService: {
    enableUserFeature: jest.fn(),
    disableUserFeature: jest.fn()
  }
}));

// Mock ProfileService
jest.mock('../profileService', () => ({
  ProfileService: {
    createProfile: jest.fn(),
    deleteProfile: jest.fn(),
    getProfiles: jest.fn(),
    extractBusinessProfile: jest.fn()
  }
}));

// Mock TimelineService
jest.mock('../timelineService', () => ({
  TimelineService: {
    generateTimeline: jest.fn()
  }
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

import { DemoDataService } from '../demoDataService';
import { AuthService, FeatureService, AIConversationDB } from '../supabaseService';
import { ProfileService } from '../profileService';
import { TimelineService } from '../timelineService';

describe('Enhanced DemoDataService with Supabase Integration', () => {
  const mockUser = { id: 'user-123', email: 'demo@example.com' };
  const mockProfile = {
    id: 'profile-123',
    companyName: 'TechNova Solutions',
    industry: 'Technology',
    size: '51-200 employees',
    isDemoData: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Reset demo configuration
    DemoDataService.DEMO_CONFIG.demoMode = false;
    DemoDataService.DEMO_CONFIG.enableSupabase = true;
    DemoDataService.demoCache.clear();
    
    // Setup default mocks
    AuthService.getCurrentUser.mockResolvedValue(mockUser);
    ProfileService.createProfile.mockResolvedValue(mockProfile);
    ProfileService.getProfiles.mockResolvedValue([]);
    ProfileService.extractBusinessProfile.mockReturnValue({
      companyName: 'TechNova Solutions',
      industry: 'Technology',
      companySize: 'small'
    });
    TimelineService.generateTimeline.mockResolvedValue({
      id: 'timeline-123',
      scenarioType: 'balanced'
    });
    
    mockLocalStorage.getItem.mockReturnValue(null);
  });

  describe('Demo Configuration', () => {
    it('should have correct default demo configuration', () => {
      expect(DemoDataService.DEMO_CONFIG).toEqual({
        enableSupabase: true,
        fallbackToLocalStorage: true,
        demoMode: false,
        autoGenerateTimelines: true,
        industryTemplates: [
          'technology', 'healthcare', 'finance', 'manufacturing', 
          'retail', 'education', 'government', 'consulting'
        ]
      });
    });

    it('should support all defined industry templates', () => {
      const industries = DemoDataService.DEMO_CONFIG.industryTemplates;
      
      industries.forEach(industry => {
        const template = DemoDataService.getIndustryTemplate(industry);
        expect(template).toBeDefined();
        expect(template.companyNames).toBeDefined();
        expect(template.businessIssues).toBeDefined();
        expect(template.aiReadinessScores).toBeDefined();
      });
    });
  });

  describe('initializeDemoData', () => {
    it('should initialize demo data with default settings', async () => {
      const profiles = [mockProfile];
      ProfileService.createProfile.mockResolvedValue(mockProfile);
      AIConversationDB.create.mockResolvedValue({ id: 'conversation-123' });

      const result = await DemoDataService.initializeDemoData();

      expect(result).toBe(true);
      expect(ProfileService.createProfile).toHaveBeenCalled();
      expect(TimelineService.generateTimeline).toHaveBeenCalled();
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('demoMode', 'true');
    });

    it('should initialize demo data with custom options', async () => {
      const options = {
        clearExisting: false,
        industries: ['technology', 'healthcare'],
        profileCount: 2,
        generateTimelines: false
      };

      ProfileService.createProfile.mockResolvedValue(mockProfile);

      const result = await DemoDataService.initializeDemoData(options);

      expect(result).toBe(true);
      expect(ProfileService.createProfile).toHaveBeenCalledTimes(2);
      expect(TimelineService.generateTimeline).not.toHaveBeenCalled();
    });

    it('should clear existing data when clearExisting is true', async () => {
      ProfileService.getProfiles.mockResolvedValue([mockProfile]);
      ProfileService.deleteProfile.mockResolvedValue(true);

      const result = await DemoDataService.initializeDemoData({
        clearExisting: true,
        profileCount: 1
      });

      expect(ProfileService.deleteProfile).toHaveBeenCalledWith(mockProfile.id);
      expect(result).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      ProfileService.createProfile.mockRejectedValue(new Error('Creation failed'));

      const result = await DemoDataService.initializeDemoData();

      // The service continues and returns true even if individual profile creations fail
      // because it still enables demo mode and creates what it can
      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('demoMode', 'true');
    });
  });

  describe('createDemoProfile', () => {
    it('should create a demo profile for technology industry', async () => {
      ProfileService.createProfile.mockResolvedValue(mockProfile);

      const result = await DemoDataService.createDemoProfile('technology');

      expect(ProfileService.createProfile).toHaveBeenCalledWith(
        expect.objectContaining({
          industry: 'Technology',
          isDemoData: true
        })
      );
      expect(result).toEqual(
        expect.objectContaining({
          isDemoData: true,
          demoIndustry: 'technology'
        })
      );
    });

    it('should create demo profiles for all supported industries', async () => {
      ProfileService.createProfile.mockResolvedValue(mockProfile);

      const industries = ['technology', 'healthcare', 'finance', 'manufacturing'];
      
      for (const industry of industries) {
        const result = await DemoDataService.createDemoProfile(industry);
        expect(result).toBeDefined();
        expect(result.isDemoData).toBe(true);
        expect(result.demoIndustry).toBe(industry);
      }
    });

    it('should handle profile creation errors', async () => {
      ProfileService.createProfile.mockRejectedValue(new Error('Creation failed'));

      const result = await DemoDataService.createDemoProfile('technology');

      expect(result).toBeNull();
    });
  });

  describe('generateDemoTimeline', () => {
    it('should generate timeline for demo profile', async () => {
      const timeline = { id: 'timeline-123', scenarioType: 'balanced' };
      TimelineService.generateTimeline.mockResolvedValue(timeline);

      const result = await DemoDataService.generateDemoTimeline(mockProfile);

      expect(ProfileService.extractBusinessProfile).toHaveBeenCalledWith(mockProfile);
      expect(TimelineService.generateTimeline).toHaveBeenCalledWith(
        expect.objectContaining({
          profileId: mockProfile.id
        }),
        expect.any(String),
        expect.objectContaining({
          aiProvider: 'demo',
          isDemoData: true
        })
      );
      expect(result).toEqual(timeline);
    });

    it('should handle timeline generation errors', async () => {
      TimelineService.generateTimeline.mockRejectedValue(new Error('Timeline failed'));

      const result = await DemoDataService.generateDemoTimeline(mockProfile);

      expect(result).toBeNull();
    });
  });

  describe('createDemoAIConversations', () => {
    it('should create demo AI conversations for profiles', async () => {
      const profiles = [mockProfile];
      AIConversationDB.create.mockResolvedValue({ id: 'conversation-123' });

      const result = await DemoDataService.createDemoAIConversations(profiles);

      expect(AIConversationDB.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_id: mockProfile.id,
          provider: 'demo-ai',
          conversation_type: 'consultation'
        }),
        mockUser.id
      );
      expect(result).toHaveLength(1);
    });

    it('should limit conversations to first 5 profiles', async () => {
      const profiles = Array(10).fill(mockProfile).map((p, i) => ({ ...p, id: `profile-${i}` }));
      AIConversationDB.create.mockResolvedValue({ id: 'conversation-123' });

      await DemoDataService.createDemoAIConversations(profiles);

      expect(AIConversationDB.create).toHaveBeenCalledTimes(5);
    });

    it('should handle conversation creation errors', async () => {
      AIConversationDB.create.mockRejectedValue(new Error('Creation failed'));

      const result = await DemoDataService.createDemoAIConversations([mockProfile]);

      expect(result).toEqual([]);
    });
  });

  describe('getDemoProfiles', () => {
    it('should return cached demo profiles', async () => {
      const cachedProfiles = [mockProfile];
      DemoDataService.demoCache.set('profiles', cachedProfiles);

      const result = await DemoDataService.getDemoProfiles();

      expect(result).toEqual(cachedProfiles);
      expect(ProfileService.getProfiles).not.toHaveBeenCalled();
    });

    it('should fetch and filter demo profiles from ProfileService', async () => {
      const allProfiles = [
        mockProfile,
        { id: 'profile-456', companyName: 'Regular Company', isDemoData: false }
      ];
      ProfileService.getProfiles.mockResolvedValue(allProfiles);

      const result = await DemoDataService.getDemoProfiles();

      expect(ProfileService.getProfiles).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].isDemoData).toBe(true);
    });

    it('should handle errors gracefully', async () => {
      ProfileService.getProfiles.mockRejectedValue(new Error('Fetch failed'));

      const result = await DemoDataService.getDemoProfiles();

      expect(result).toEqual([]);
    });
  });

  describe('Demo Mode Management', () => {
    describe('enableDemoMode', () => {
      it('should enable demo mode with localStorage and Supabase', async () => {
        FeatureService.enableUserFeature.mockResolvedValue(true);

        const result = await DemoDataService.enableDemoMode();

        expect(result).toBe(true);
        expect(DemoDataService.DEMO_CONFIG.demoMode).toBe(true);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('demoMode', 'true');
        expect(FeatureService.enableUserFeature).toHaveBeenCalledWith(mockUser.id, 'demo_mode');
      });

      it('should enable demo mode even if Supabase fails', async () => {
        FeatureService.enableUserFeature.mockRejectedValue(new Error('Supabase failed'));

        const result = await DemoDataService.enableDemoMode();

        expect(result).toBe(true);
        expect(mockLocalStorage.setItem).toHaveBeenCalledWith('demoMode', 'true');
      });

      it('should work when Supabase is disabled', async () => {
        DemoDataService.DEMO_CONFIG.enableSupabase = false;

        const result = await DemoDataService.enableDemoMode();

        expect(result).toBe(true);
        expect(FeatureService.enableUserFeature).not.toHaveBeenCalled();
      });
    });

    describe('disableDemoMode', () => {
      it('should disable demo mode with localStorage and Supabase cleanup', async () => {
        FeatureService.disableUserFeature.mockResolvedValue(true);

        const result = await DemoDataService.disableDemoMode();

        expect(result).toBe(true);
        expect(DemoDataService.DEMO_CONFIG.demoMode).toBe(false);
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('demoMode');
        expect(FeatureService.disableUserFeature).toHaveBeenCalledWith(mockUser.id, 'demo_mode');
      });

      it('should disable demo mode even if Supabase fails', async () => {
        FeatureService.disableUserFeature.mockRejectedValue(new Error('Supabase failed'));

        const result = await DemoDataService.disableDemoMode();

        expect(result).toBe(true);
        expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('demoMode');
      });
    });

    describe('isDemoMode', () => {
      it('should return true when demo mode is enabled in config', () => {
        DemoDataService.DEMO_CONFIG.demoMode = true;

        const result = DemoDataService.isDemoMode();

        expect(result).toBe(true);
      });

      it('should return true when demo mode is enabled in localStorage', () => {
        mockLocalStorage.getItem.mockReturnValue('true');

        const result = DemoDataService.isDemoMode();

        expect(result).toBe(true);
      });

      it('should return false when demo mode is disabled', () => {
        DemoDataService.DEMO_CONFIG.demoMode = false;
        mockLocalStorage.getItem.mockReturnValue(null);

        const result = DemoDataService.isDemoMode();

        expect(result).toBe(false);
      });
    });
  });

  describe('clearDemoData', () => {
    it('should clear all demo profiles and cache', async () => {
      const demoProfiles = [mockProfile, { ...mockProfile, id: 'profile-456' }];
      ProfileService.getProfiles.mockResolvedValue(demoProfiles);
      ProfileService.deleteProfile.mockResolvedValue(true);

      const result = await DemoDataService.clearDemoData();

      expect(result).toBe(true);
      expect(ProfileService.deleteProfile).toHaveBeenCalledTimes(2);
      expect(DemoDataService.demoCache.size).toBe(0);
    });

    it('should handle deletion errors gracefully', async () => {
      // Set up cached profiles first so clearDemoData tries to work with them
      DemoDataService.demoCache.set('profiles', []);
      ProfileService.getProfiles.mockRejectedValue(new Error('Fetch failed'));

      const result = await DemoDataService.clearDemoData();

      // The service returns true when it successfully clears the cache, 
      // even if fetching profiles fails
      expect(result).toBe(true);
      expect(DemoDataService.demoCache.size).toBe(0);
    });
  });

  describe('Export/Import Configuration', () => {
    describe('exportDemoConfig', () => {
      it('should export demo configuration with profiles', async () => {
        const demoProfiles = [mockProfile];
        DemoDataService.demoCache.set('profiles', demoProfiles);

        const result = await DemoDataService.exportDemoConfig();

        expect(result).toEqual(
          expect.objectContaining({
            version: '1.0',
            exportedAt: expect.any(String),
            demoConfig: DemoDataService.DEMO_CONFIG,
            profileCount: 1,
            industries: expect.arrayContaining(['Technology']),
            profiles: expect.arrayContaining([
              expect.objectContaining({
                industry: 'Technology',
                companyName: 'TechNova Solutions'
              })
            ])
          })
        );
      });

      it('should handle export errors', async () => {
        // Mock error in getDemoProfiles
        jest.spyOn(DemoDataService, 'getDemoProfiles').mockRejectedValue(new Error('Export failed'));

        const result = await DemoDataService.exportDemoConfig();

        expect(result).toBeNull();
      });
    });

    describe('importDemoConfig', () => {
      it('should import demo configuration and create profiles', async () => {
        const config = {
          version: '1.0',
          profiles: [
            { industry: 'technology', companyName: 'Test Tech' },
            { industry: 'healthcare', companyName: 'Test Health' }
          ]
        };

        ProfileService.createProfile.mockResolvedValue(mockProfile);
        jest.spyOn(DemoDataService, 'clearDemoData').mockResolvedValue(true);
        jest.spyOn(DemoDataService, 'createDemoProfile').mockResolvedValue(mockProfile);

        const result = await DemoDataService.importDemoConfig(config);

        expect(result).toBe(true);
        expect(DemoDataService.clearDemoData).toHaveBeenCalled();
        expect(DemoDataService.createDemoProfile).toHaveBeenCalledTimes(2);
      });

      it('should reject invalid configuration format', async () => {
        const invalidConfig = { version: '2.0' };

        const result = await DemoDataService.importDemoConfig(invalidConfig);

        expect(result).toBe(false);
      });

      it('should handle import errors', async () => {
        const config = { version: '1.0', profiles: [] };
        jest.spyOn(DemoDataService, 'clearDemoData').mockRejectedValue(new Error('Clear failed'));

        const result = await DemoDataService.importDemoConfig(config);

        expect(result).toBe(false);
      });
    });
  });

  describe('Industry Template Generation', () => {
    it('should generate realistic profile data for technology industry', () => {
      const template = DemoDataService.getIndustryTemplate('technology');
      const profileData = DemoDataService.generateProfileData(template);

      expect(profileData).toEqual(
        expect.objectContaining({
          companyName: expect.any(String),
          industry: 'Technology',
          size: expect.any(String),
          annualRevenue: expect.any(String),
          isDemoData: true,
          valueSellingFramework: expect.objectContaining({
            businessIssues: expect.any(Array),
            impact: expect.objectContaining({
              totalAnnualImpact: expect.any(Number)
            }),
            decisionMakers: expect.objectContaining({
              economicBuyer: expect.objectContaining({
                name: expect.any(String),
                title: expect.any(String)
              })
            })
          }),
          aiOpportunityAssessment: expect.objectContaining({
            aiReadinessScore: expect.any(Number),
            currentTechnology: expect.any(Array)
          })
        })
      );
    });

    it('should generate different data for different industries', () => {
      const techTemplate = DemoDataService.getIndustryTemplate('technology');
      const healthTemplate = DemoDataService.getIndustryTemplate('healthcare');

      const techData = DemoDataService.generateProfileData(techTemplate);
      const healthData = DemoDataService.generateProfileData(healthTemplate);

      expect(techData.industry).toBe('Technology');
      expect(healthData.industry).toBe('Healthcare');
      expect(techData.companyName).not.toBe(healthData.companyName);
    });

    it('should fall back to technology template for unknown industry', () => {
      const template = DemoDataService.getIndustryTemplate('unknown');
      const techTemplate = DemoDataService.getIndustryTemplate('technology');

      expect(template).toEqual(techTemplate);
    });
  });

  describe('Helper Methods', () => {
    it('should select random items from array', () => {
      const array = ['item1', 'item2', 'item3', 'item4'];
      
      const single = DemoDataService.randomSelect(array);
      expect(array).toContain(single);

      const multiple = DemoDataService.randomSelect(array, 2);
      expect(multiple).toHaveLength(2);
      expect(Array.isArray(multiple)).toBe(true);
    });

    it('should generate appropriate revenue for company size', () => {
      const smallRevenue = DemoDataService.generateRevenueFromSize('1-50 employees');
      const largeRevenue = DemoDataService.generateRevenueFromSize('1000+ employees');

      expect(['<5M', '5M-15M']).toContain(smallRevenue);
      expect(['1B-5B', '>5B']).toContain(largeRevenue);
    });

    it('should generate impact based on budget range', () => {
      const smallImpact = DemoDataService.generateImpactFromBudget('<100k');
      const largeImpact = DemoDataService.generateImpactFromBudget('>5m');

      expect(smallImpact).toBeLessThan(500000);
      expect(largeImpact).toBeGreaterThan(5000000);
    });

    it('should generate executive names and titles', () => {
      const name = DemoDataService.generateExecutiveName();
      const title = DemoDataService.generateExecutiveTitle();

      expect(typeof name).toBe('string');
      expect(name.length).toBeGreaterThan(0);
      expect(typeof title).toBe('string');
      expect(['CEO', 'CFO', 'COO', 'VP of Operations', 'VP of Finance']).toContain(title);
    });

    it('should generate change management capability based on AI readiness', () => {
      expect(DemoDataService.generateChangeManagement(8)).toBe('High');
      expect(DemoDataService.generateChangeManagement(6)).toBe('Medium');
      expect(DemoDataService.generateChangeManagement(3)).toBe('Low');
    });

    it('should generate risk tolerance based on AI readiness', () => {
      expect(DemoDataService.generateRiskTolerance(9)).toBe('high');
      expect(DemoDataService.generateRiskTolerance(6)).toBe('medium');
      expect(DemoDataService.generateRiskTolerance(3)).toBe('low');
    });

    it('should generate decision timeline based on company size', () => {
      const smallTimeline = DemoDataService.generateDecisionTimeline('1-50 employees');
      const largeTimeline = DemoDataService.generateDecisionTimeline('1000+ employees');

      expect(smallTimeline).toBeLessThan(10);
      expect(largeTimeline).toBeGreaterThan(10);
    });
  });

  describe('Demo Content Generation', () => {
    it('should generate industry-specific demo questions', () => {
      const techQuestion = DemoDataService.getDemoQuestion('Technology');
      const healthQuestion = DemoDataService.getDemoQuestion('Healthcare');

      expect(techQuestion).toContain('AI');
      expect(techQuestion).not.toBe(healthQuestion);
      expect(typeof techQuestion).toBe('string');
    });

    it('should generate industry-specific demo responses', () => {
      const techResponse = DemoDataService.getDemoResponse('Technology');
      const financeResponse = DemoDataService.getDemoResponse('Finance');

      expect(typeof techResponse).toBe('string');
      expect(techResponse).not.toBe(financeResponse);
    });

    it('should generate industry-specific recommendations', () => {
      const techRecommendations = DemoDataService.getDemoRecommendations('Technology');
      const retailRecommendations = DemoDataService.getDemoRecommendations('Retail');

      expect(Array.isArray(techRecommendations)).toBe(true);
      expect(techRecommendations.length).toBeGreaterThan(0);
      expect(techRecommendations).not.toEqual(retailRecommendations);
    });

    it('should fall back to technology content for unknown industries', () => {
      const unknownQuestion = DemoDataService.getDemoQuestion('Unknown');
      const techQuestion = DemoDataService.getDemoQuestion('Technology');

      expect(unknownQuestion).toBe(techQuestion);
    });
  });
}); 