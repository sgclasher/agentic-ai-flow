import { ProfileService } from '../profileService';
import { markdownService } from '../markdownService';

// Mock the markdownService
jest.mock('../markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn()
  }
}));

// Mock the TimelineService import
jest.mock('../timelineService', () => ({
  TimelineService: {
    generateTimeline: jest.fn()
  }
}));

describe('ProfileService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
    jest.clearAllMocks();
  });

  describe('createProfile', () => {
    const mockProfileData = {
      companyName: 'Test Company',
      industry: 'Technology',
      size: '51-200 employees',
      annualRevenue: '15M',
      valueSellingFramework: {
        businessIssues: ['Revenue Growth Pressure'],
        impact: {
          totalAnnualImpact: 850000
        }
      },
      aiOpportunityAssessment: {
        aiReadinessScore: 6
      }
    };

    it('should create a profile with unique ID', async () => {
      const mockMarkdown = '# Test Profile';
      markdownService.generateMarkdown.mockReturnValue(mockMarkdown);

      const profile = await ProfileService.createProfile(mockProfileData);

      expect(profile).toMatchObject({
        ...mockProfileData,
        markdown: mockMarkdown,
        status: 'draft'
      });
      expect(profile.id).toBeTruthy();
      expect(profile.createdAt).toBeTruthy();
      expect(profile.updatedAt).toBeTruthy();
      expect(markdownService.generateMarkdown).toHaveBeenCalledWith(mockProfileData);
    });

    it('should save profile to localStorage', async () => {
      await ProfileService.createProfile(mockProfileData);

      const saved = JSON.parse(localStorage.getItem('clientProfiles'));
      expect(saved).toHaveLength(1);
      expect(saved[0].companyName).toBe('Test Company');
    });

    it('should handle errors gracefully', async () => {
      markdownService.generateMarkdown.mockImplementation(() => {
        throw new Error('Markdown generation failed');
      });

      await expect(ProfileService.createProfile(mockProfileData)).rejects.toThrow();
    });
  });

  describe('generateProfileId', () => {
    it('should generate valid profile ID', () => {
      const id = ProfileService.generateProfileId('Test Company');
      
      expect(id).toMatch(/^test-company-[a-z0-9]+$/);
      expect(id.length).toBeLessThanOrEqual(40); // Reasonable length
    });

    it('should handle special characters in company name', () => {
      const id = ProfileService.generateProfileId('Test & Company, Inc.');
      
      expect(id).toMatch(/^test---company--inc--[a-z0-9]+$/);
      expect(id).not.toMatch(/[^a-z0-9-]/); // Only alphanumeric and hyphens
    });

    it('should truncate long company names', () => {
      const longName = 'A'.repeat(100);
      const id = ProfileService.generateProfileId(longName);
      
      expect(id.length).toBeLessThanOrEqual(40);
    });
  });

  describe('generateTimelineFromProfile', () => {
    const mockProfile = {
      companyName: 'Test Company',
      industry: 'Technology',
      size: '51-200 employees',
      aiOpportunityAssessment: {
        aiReadinessScore: 8
      },
      valueSellingFramework: {
        decisionMakers: {
          economicBuyer: {
            name: 'John Doe'
          }
        },
        impact: {
          totalAnnualImpact: 1000000
        },
        businessIssues: ['Revenue Growth Pressure', 'Cost Reduction Mandate'],
        solutionCapabilities: ['Automate workflows']
      }
    };

    it('should generate timeline from profile', async () => {
      const { TimelineService } = await import('../timelineService');
      const mockTimeline = { phases: [], summary: {} };
      TimelineService.generateTimeline.mockResolvedValue(mockTimeline);

      const result = await ProfileService.generateTimelineFromProfile(mockProfile);

      expect(TimelineService.generateTimeline).toHaveBeenCalled();
      expect(result).toBeTruthy();
    });

    it('should determine correct scenario type - aggressive', async () => {
      const aggressiveProfile = {
        ...mockProfile,
        aiReadinessScore: 9,
        decisionTimeline: 3,
        riskTolerance: 'high'
      };

      const scenarioType = ProfileService.determineScenarioType(aggressiveProfile);
      expect(scenarioType).toBe('aggressive');
    });

    it('should determine correct scenario type - conservative', async () => {
      const conservativeProfile = {
        ...mockProfile,
        aiReadinessScore: 3,
        decisionTimeline: 24,
        riskTolerance: 'low'
      };

      const scenarioType = ProfileService.determineScenarioType(conservativeProfile);
      expect(scenarioType).toBe('conservative');
    });

    it('should determine correct scenario type - balanced', async () => {
      const balancedProfile = {
        ...mockProfile,
        aiReadinessScore: 6,
        decisionTimeline: 12,
        riskTolerance: 'medium'
      };

      const scenarioType = ProfileService.determineScenarioType(balancedProfile);
      expect(scenarioType).toBe('balanced');
    });
  });

  describe('extractBusinessProfile', () => {
    it('should extract business profile data correctly', () => {
      const profile = {
        companyName: 'Test Co',
        industry: 'Healthcare',
        size: '1000+ employees',
        aiOpportunityAssessment: {
          aiReadinessScore: 7
        },
        valueSellingFramework: {
          businessIssues: ['Cost Reduction Mandate'],
          decisionMakers: {
            economicBuyer: {
              budget: '500000'
            }
          }
        }
      };

      const businessProfile = ProfileService.extractBusinessProfile(profile);

      expect(businessProfile).toMatchObject({
        companyName: 'Test Co',
        industry: 'Healthcare',
        companySize: 'large',
        aiMaturityLevel: 'developing'
      });
    });
  });

  describe('mapCompanySize', () => {
    it('should map company sizes correctly', () => {
      expect(ProfileService.mapCompanySize('1-50 employees')).toBe('startup');
      expect(ProfileService.mapCompanySize('51-200 employees')).toBe('small');
      expect(ProfileService.mapCompanySize('201-1000 employees')).toBe('medium');
      expect(ProfileService.mapCompanySize('1000+ employees')).toBe('large');
      expect(ProfileService.mapCompanySize('unknown')).toBe('medium');
    });
  });

  describe('calculateAIMaturity', () => {
    it('should calculate AI maturity levels correctly', () => {
      expect(ProfileService.calculateAIMaturity({ aiReadinessScore: 2 })).toBe('beginner');
      expect(ProfileService.calculateAIMaturity({ aiReadinessScore: 5 })).toBe('emerging');
      expect(ProfileService.calculateAIMaturity({ aiReadinessScore: 7 })).toBe('developing');
      expect(ProfileService.calculateAIMaturity({ aiReadinessScore: 9 })).toBe('advanced');
      expect(ProfileService.calculateAIMaturity({})).toBe('emerging'); // Default
    });
  });

  describe('extractPrimaryGoals', () => {
    it('should extract goals from business issues', () => {
      const profile = {
        businessIssue: {
          revenueGrowth: true,
          costReduction: true,
          customerExperience: false,
          operationalEfficiency: true
        }
      };

      const goals = ProfileService.extractPrimaryGoals(profile);

      expect(goals).toContain('Increase Revenue');
      expect(goals).toContain('Reduce Operational Costs');
      expect(goals).toContain('Automate Workflows');
      expect(goals).not.toContain('Improve Customer Experience');
    });

    it('should handle missing business issues', () => {
      const goals = ProfileService.extractPrimaryGoals({});
      expect(goals).toEqual([]);
    });
  });

  describe('getProfiles', () => {
    it('should retrieve all profiles from localStorage', async () => {
      const profiles = [
        { id: '1', companyName: 'Company 1' },
        { id: '2', companyName: 'Company 2' }
      ];
      localStorage.setItem('clientProfiles', JSON.stringify(profiles));

      const result = await ProfileService.getProfiles();

      expect(result).toEqual(profiles);
    });

    it('should return empty array if no profiles exist', async () => {
      const result = await ProfileService.getProfiles();
      expect(result).toEqual([]);
    });
  });

  describe('getProfile', () => {
    it('should retrieve specific profile by ID', async () => {
      const profiles = [
        { id: '1', companyName: 'Company 1' },
        { id: '2', companyName: 'Company 2' }
      ];
      localStorage.setItem('clientProfiles', JSON.stringify(profiles));

      const result = await ProfileService.getProfile('2');

      expect(result).toEqual({ id: '2', companyName: 'Company 2' });
    });

    it('should return undefined if profile not found', async () => {
      const result = await ProfileService.getProfile('nonexistent');
      expect(result).toBeUndefined();
    });
  });

  describe('generateOpportunityRecommendations', () => {
    it('should generate finance opportunities', async () => {
      const profile = {
        problems: {
          finance: {
            manualInvoiceProcessing: true
          }
        }
      };

      const opportunities = await ProfileService.generateOpportunityRecommendations(profile);

      expect(opportunities).toContainEqual(expect.objectContaining({
        department: 'Finance',
        title: 'Automated Invoice Processing'
      }));
    });

    it('should generate HR opportunities', async () => {
      const profile = {
        problems: {
          hr: {
            manualResumeScreening: true
          }
        }
      };

      const opportunities = await ProfileService.generateOpportunityRecommendations(profile);

      expect(opportunities).toContainEqual(expect.objectContaining({
        department: 'HR',
        title: 'AI Resume Screening'
      }));
    });

    it('should sort opportunities by priority', async () => {
      const profile = {
        problems: {
          finance: { manualInvoiceProcessing: true },
          hr: { manualResumeScreening: true },
          customerService: { responseTime: true }
        }
      };

      const opportunities = await ProfileService.generateOpportunityRecommendations(profile);
      
      // High priority should come first
      const priorities = opportunities.map(o => o.priority);
      expect(priorities[0]).toBe('High');
    });
  });

  describe('identifyRiskFactors', () => {
    it('should identify technical readiness risks', () => {
      const profile = {
        aiReadinessScore: 2,
        changeManagementCapability: 'High'
      };

      const risks = ProfileService.identifyRiskFactors(profile);

      expect(risks).toContainEqual(expect.objectContaining({
        type: 'Technical Readiness',
        level: 'High'
      }));
    });

    it('should identify change management risks', () => {
      const profile = {
        aiReadinessScore: 8,
        changeManagementCapability: 'Low'
      };

      const risks = ProfileService.identifyRiskFactors(profile);

      expect(risks).toContainEqual(expect.objectContaining({
        type: 'Change Management',
        level: 'Medium'
      }));
    });

    it('should return empty array for low-risk profiles', () => {
      const profile = {
        aiReadinessScore: 8,
        changeManagementCapability: 'High'
      };

      const risks = ProfileService.identifyRiskFactors(profile);
      expect(risks).toEqual([]);
    });
  });
}); 