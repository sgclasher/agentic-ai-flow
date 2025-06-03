/**
 * Tests for Enhanced ProfileService with Supabase Integration
 * 
 * Comprehensive test suite covering:
 * - Supabase integration with localStorage fallback
 * - Dual-write strategy and data synchronization
 * - Error handling and graceful degradation
 * - Migration utilities and data transformation
 * - Timeline integration and audit trails
 */

// Mock environment for testing
process.env.NODE_ENV = 'test';

// Mock the Supabase service
jest.mock('../supabaseService', () => ({
  ProfileDB: {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    search: jest.fn()
  },
  AuthService: {
    getCurrentUser: jest.fn()
  },
  AuditService: {
    log: jest.fn()
  },
  TimelineDB: {
    create: jest.fn()
  }
}));

// Mock the markdownService
jest.mock('../markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn()
  }
}));

// Mock localStorage
const mockLocalStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn()
};
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
});

import { ProfileService } from '../profileService';
import { ProfileDB, AuthService, AuditService, TimelineDB } from '../supabaseService';
import { markdownService } from '../markdownService';

describe('Enhanced ProfileService with Supabase Integration', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockProfileData = {
    companyName: 'Test Corporation',
    industry: 'Technology',
    size: '51-200 employees',
    valueSellingFramework: {
      businessIssues: ['Revenue Growth Pressure'],
      impact: { totalAnnualImpact: 500000 }
    },
    aiOpportunityAssessment: {
      aiReadinessScore: 7
    }
  };

  const mockSupabaseProfile = {
    id: 'profile-456',
    user_id: 'user-123',
    company_name: 'Test Corporation',
    industry: 'Technology',
    size: '51-200 employees',
    data: mockProfileData,
    markdown: '# Test Profile',
    status: 'draft',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('[]');
    markdownService.generateMarkdown.mockReturnValue('# Test Profile');
    AuthService.getCurrentUser.mockResolvedValue(mockUser);
    
    // Reset migration configuration
    ProfileService.MIGRATION_CONFIG.enableSupabase = true;
    ProfileService.MIGRATION_CONFIG.dualWriteMode = true;
    ProfileService.MIGRATION_CONFIG.fallbackToLocalStorage = true;
  });

  describe('Migration Configuration', () => {
    it('should have correct default migration configuration', () => {
      expect(ProfileService.MIGRATION_CONFIG).toEqual({
        enableSupabase: true,
        dualWriteMode: true,
        fallbackToLocalStorage: true,
        retryAttempts: 3,
        retryDelay: 1000
      });
    });
  });

  describe('createProfile', () => {
    it('should create profile in Supabase and localStorage (dual-write mode)', async () => {
      ProfileDB.create.mockResolvedValue(mockSupabaseProfile);
      AuditService.log.mockResolvedValue({});

      const result = await ProfileService.createProfile(mockProfileData);

      // Verify Supabase creation
      expect(ProfileDB.create).toHaveBeenCalledWith(mockProfileData, mockUser.id);
      
      // Verify audit logging
      expect(AuditService.log).toHaveBeenCalledWith(
        'CREATE',
        'profile',
        mockSupabaseProfile.id,
        null,
        mockSupabaseProfile
      );

      // Verify localStorage dual-write
      expect(mockLocalStorage.setItem).toHaveBeenCalled();

      // Verify transformed response
      expect(result).toEqual(
        expect.objectContaining({
          id: mockSupabaseProfile.id,
          companyName: mockSupabaseProfile.company_name,
          industry: mockSupabaseProfile.industry
        })
      );
    });

    it('should fall back to localStorage when Supabase fails', async () => {
      ProfileDB.create.mockRejectedValue(new Error('Supabase connection failed'));

      const result = await ProfileService.createProfile(mockProfileData);

      // Verify fallback to localStorage
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          companyName: mockProfileData.companyName,
          industry: mockProfileData.industry
        })
      );
    });

    it('should use localStorage only when Supabase is disabled', async () => {
      ProfileService.MIGRATION_CONFIG.enableSupabase = false;

      const result = await ProfileService.createProfile(mockProfileData);

      // Verify Supabase is not called
      expect(ProfileDB.create).not.toHaveBeenCalled();
      
      // Verify localStorage usage
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          companyName: mockProfileData.companyName
        })
      );
    });

    it('should throw error when both Supabase and localStorage fallback fail', async () => {
      ProfileDB.create.mockRejectedValue(new Error('Supabase failed'));
      ProfileService.MIGRATION_CONFIG.fallbackToLocalStorage = false;

      await expect(ProfileService.createProfile(mockProfileData))
        .rejects.toThrow('Supabase failed');
    });
  });

  describe('getProfiles', () => {
    it('should retrieve profiles from Supabase and sync with localStorage', async () => {
      const mockSupabaseProfiles = [mockSupabaseProfile];
      ProfileDB.getAll.mockResolvedValue(mockSupabaseProfiles);

      const result = await ProfileService.getProfiles();

      expect(ProfileDB.getAll).toHaveBeenCalledWith(mockUser.id);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          companyName: 'Test Corporation'
        })
      );
    });

    it('should fall back to localStorage when Supabase fails', async () => {
      ProfileDB.getAll.mockRejectedValue(new Error('Network error'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([{
        id: 'local-1',
        companyName: 'Local Company'
      }]));

      const result = await ProfileService.getProfiles();

      expect(result).toHaveLength(1);
      expect(result[0].companyName).toBe('Local Company');
    });

    it('should sync Supabase profiles with localStorage in dual-write mode', async () => {
      const mockSupabaseProfiles = [mockSupabaseProfile];
      ProfileDB.getAll.mockResolvedValue(mockSupabaseProfiles);
      
      const localProfile = { id: 'local-only', companyName: 'Local Only' };
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([localProfile]));

      await ProfileService.getProfiles();

      // Verify sync occurred
      const setItemCall = mockLocalStorage.setItem.mock.calls.find(
        call => call[0] === 'clientProfiles'
      );
      expect(setItemCall).toBeTruthy();
      
      const syncedProfiles = JSON.parse(setItemCall[1]);
      expect(syncedProfiles).toHaveLength(2); // Supabase + local-only
    });
  });

  describe('getProfile', () => {
    it('should retrieve specific profile from Supabase', async () => {
      ProfileDB.getById.mockResolvedValue(mockSupabaseProfile);

      const result = await ProfileService.getProfile('profile-456');

      expect(ProfileDB.getById).toHaveBeenCalledWith('profile-456', mockUser.id);
      expect(result.companyName).toBe('Test Corporation');
    });

    it('should fall back to localStorage when profile not found in Supabase', async () => {
      ProfileDB.getById.mockResolvedValue(null);
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([{
        id: 'profile-456',
        companyName: 'Local Profile'
      }]));

      const result = await ProfileService.getProfile('profile-456');

      expect(result.companyName).toBe('Local Profile');
    });

    it('should return null when profile not found anywhere', async () => {
      ProfileDB.getById.mockResolvedValue(null);
      mockLocalStorage.getItem.mockReturnValue('[]');

      const result = await ProfileService.getProfile('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('updateProfile', () => {
    it('should update profile in Supabase with audit trail', async () => {
      const updatedProfileData = {
        ...mockProfileData,
        companyName: 'Updated Corp'
      };
      const updatedSupabaseProfile = { 
        ...mockSupabaseProfile, 
        company_name: 'Updated Corp',
        data: updatedProfileData
      };
      ProfileDB.update.mockResolvedValue(updatedSupabaseProfile);
      AuditService.log.mockResolvedValue({});

      const result = await ProfileService.updateProfile('profile-456', updatedProfileData);

      expect(ProfileDB.update).toHaveBeenCalledWith('profile-456', expect.objectContaining({
        company_name: 'Updated Corp',
        industry: 'Technology',
        size: '51-200 employees'
      }), mockUser.id);
      expect(AuditService.log).toHaveBeenCalledWith(
        'UPDATE',
        'profile',
        'profile-456',
        null,
        updatedSupabaseProfile
      );
      expect(result.companyName).toBe('Updated Corp');
    });

    it('should update localStorage in dual-write mode', async () => {
      ProfileDB.update.mockResolvedValue(mockSupabaseProfile);
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([{
        id: 'profile-456',
        companyName: 'Old Name'
      }]));

      await ProfileService.updateProfile('profile-456', mockProfileData);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should fall back to localStorage when Supabase update fails', async () => {
      ProfileDB.update.mockRejectedValue(new Error('Update failed'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([{
        id: 'profile-456',
        companyName: 'Old Name'
      }]));

      const result = await ProfileService.updateProfile('profile-456', mockProfileData);

      expect(result.companyName).toBe(mockProfileData.companyName);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('deleteProfile', () => {
    it('should soft delete profile in Supabase with audit trail', async () => {
      ProfileDB.delete.mockResolvedValue({ id: 'profile-456', status: 'deleted' });
      AuditService.log.mockResolvedValue({});

      const result = await ProfileService.deleteProfile('profile-456');

      expect(ProfileDB.delete).toHaveBeenCalledWith('profile-456', mockUser.id);
      expect(AuditService.log).toHaveBeenCalledWith('DELETE', 'profile', 'profile-456');
      expect(result).toBe(true);
    });

    it('should delete from localStorage in dual-write mode', async () => {
      ProfileDB.delete.mockResolvedValue({});
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([{
        id: 'profile-456',
        companyName: 'Test'
      }]));

      await ProfileService.deleteProfile('profile-456');

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should fall back to localStorage when Supabase delete fails', async () => {
      ProfileDB.delete.mockRejectedValue(new Error('Delete failed'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([{
        id: 'profile-456',
        companyName: 'Test'
      }]));

      const result = await ProfileService.deleteProfile('profile-456');

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('searchProfiles', () => {
    it('should search profiles in Supabase', async () => {
      const mockSearchResults = [mockSupabaseProfile];
      ProfileDB.search.mockResolvedValue(mockSearchResults);

      const result = await ProfileService.searchProfiles('Test');

      expect(ProfileDB.search).toHaveBeenCalledWith('Test', mockUser.id);
      expect(result).toHaveLength(1);
      expect(result[0].companyName).toBe('Test Corporation');
    });

    it('should fall back to localStorage search when Supabase fails', async () => {
      ProfileDB.search.mockRejectedValue(new Error('Search failed'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { id: '1', companyName: 'Test Corp', industry: 'Tech' },
        { id: '2', companyName: 'Other Corp', industry: 'Finance' }
      ]));

      const result = await ProfileService.searchProfiles('Test');

      expect(result).toHaveLength(1);
      expect(result[0].companyName).toBe('Test Corp');
    });
  });

  describe('generateTimelineFromProfile', () => {
    it('should generate timeline and store in Supabase', async () => {
      // Mock the dynamic import
      const mockTimelineService = {
        generateTimeline: jest.fn().mockResolvedValue({
          scenarioType: 'balanced',
          phases: []
        })
      };
      
      jest.doMock('../timelineService', () => ({
        TimelineService: mockTimelineService
      }));

      TimelineDB.create.mockResolvedValue({});

      const result = await ProfileService.generateTimelineFromProfile(mockProfileData);

      expect(mockTimelineService.generateTimeline).toHaveBeenCalled();
      expect(TimelineDB.create).toHaveBeenCalledWith(
        expect.objectContaining({
          scenario_type: 'balanced',
          generated_by: 'timeline_service'
        }),
        mockUser.id
      );
      expect(result).toBeDefined();
    });

    it('should continue if timeline storage in Supabase fails', async () => {
      const mockTimelineService = {
        generateTimeline: jest.fn().mockResolvedValue({
          scenarioType: 'balanced',
          phases: []
        })
      };
      
      jest.doMock('../timelineService', () => ({
        TimelineService: mockTimelineService
      }));

      TimelineDB.create.mockRejectedValue(new Error('Storage failed'));

      const result = await ProfileService.generateTimelineFromProfile(mockProfileData);

      expect(result).toBeDefined(); // Should still return timeline
    });
  });

  describe('Data Transformation', () => {
    it('should transform Supabase profile to expected format', () => {
      const transformed = ProfileService.transformSupabaseToProfile(mockSupabaseProfile);

      expect(transformed).toEqual({
        id: 'profile-456',
        companyName: 'Test Corporation',
        industry: 'Technology',
        size: '51-200 employees',
        ...mockProfileData,
        markdown: '# Test Profile',
        status: 'draft',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z'
      });
    });
  });

  describe('Sync Operations', () => {
    it('should sync profiles between Supabase and localStorage', async () => {
      const supabaseProfiles = [
        ProfileService.transformSupabaseToProfile(mockSupabaseProfile)
      ];
      const localProfiles = [
        { id: 'local-only', companyName: 'Local Company' }
      ];

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(localProfiles));

      await ProfileService.syncProfilesWithLocalStorage(supabaseProfiles);

      const setItemCall = mockLocalStorage.setItem.mock.calls.find(
        call => call[0] === 'clientProfiles'
      );
      expect(setItemCall).toBeTruthy();

      const syncedProfiles = JSON.parse(setItemCall[1]);
      expect(syncedProfiles).toHaveLength(2);
      expect(syncedProfiles.some(p => p.id === 'profile-456')).toBe(true);
      expect(syncedProfiles.some(p => p.id === 'local-only')).toBe(true);
    });
  });

  describe('LocalStorage Operations', () => {
    it('should save profile to localStorage', async () => {
      const profile = { id: 'test', companyName: 'Test' };
      mockLocalStorage.getItem.mockReturnValue('[]');

      await ProfileService.saveToLocalStorage(profile);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'clientProfiles',
        JSON.stringify([profile])
      );
    });

    it('should handle localStorage read errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = ProfileService.getFromLocalStorage();

      expect(result).toEqual([]);
    });

    it('should update profile in localStorage', async () => {
      const existingProfiles = [
        { id: 'profile-1', companyName: 'Old Name' },
        { id: 'profile-2', companyName: 'Other' }
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingProfiles));

      const updatedProfile = { id: 'profile-1', companyName: 'New Name' };
      await ProfileService.updateInLocalStorage('profile-1', updatedProfile);

      const setItemCall = mockLocalStorage.setItem.mock.calls[0];
      const savedProfiles = JSON.parse(setItemCall[1]);
      
      expect(savedProfiles[0].companyName).toBe('New Name');
      expect(savedProfiles[1].companyName).toBe('Other');
    });

    it('should delete profile from localStorage', async () => {
      const existingProfiles = [
        { id: 'profile-1', companyName: 'Keep' },
        { id: 'profile-2', companyName: 'Delete' }
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingProfiles));

      await ProfileService.deleteFromLocalStorage('profile-2');

      const setItemCall = mockLocalStorage.setItem.mock.calls[0];
      const savedProfiles = JSON.parse(setItemCall[1]);
      
      expect(savedProfiles).toHaveLength(1);
      expect(savedProfiles[0].id).toBe('profile-1');
    });
  });

  describe('Business Logic Utilities', () => {
    it('should determine scenario type based on profile characteristics', () => {
      const aggressiveProfile = {
        aiOpportunityAssessment: { aiReadinessScore: 9 },
        decisionTimeline: 4,
        riskTolerance: 'high'
      };

      const conservativeProfile = {
        aiOpportunityAssessment: { aiReadinessScore: 3 },
        decisionTimeline: 24,
        riskTolerance: 'low'
      };

      expect(ProfileService.determineScenarioType(aggressiveProfile)).toBe('aggressive');
      expect(ProfileService.determineScenarioType(conservativeProfile)).toBe('conservative');
      expect(ProfileService.determineScenarioType({})).toBe('balanced');
    });

    it('should calculate AI maturity correctly', () => {
      expect(ProfileService.calculateAIMaturity({ aiOpportunityAssessment: { aiReadinessScore: 2 } })).toBe('beginner');
      expect(ProfileService.calculateAIMaturity({ aiOpportunityAssessment: { aiReadinessScore: 5 } })).toBe('emerging');
      expect(ProfileService.calculateAIMaturity({ aiOpportunityAssessment: { aiReadinessScore: 7 } })).toBe('developing');
      expect(ProfileService.calculateAIMaturity({ aiOpportunityAssessment: { aiReadinessScore: 9 } })).toBe('advanced');
    });

    it('should estimate budget range correctly', () => {
      const highImpactProfile = {
        valueSellingFramework: { impact: { totalAnnualImpact: 6000000 } }
      };
      const mediumImpactProfile = {
        valueSellingFramework: { impact: { totalAnnualImpact: 750000 } }
      };

      expect(ProfileService.estimateBudgetRange(highImpactProfile)).toBe('>5m');
      expect(ProfileService.estimateBudgetRange(mediumImpactProfile)).toBe('500k-1m');
    });

    it('should generate unique profile IDs', () => {
      const id1 = ProfileService.generateProfileId('Test Company');
      const id2 = ProfileService.generateProfileId('Test Company');

      expect(id1).toMatch(/^test-company-/);
      expect(id2).toMatch(/^test-company-/);
      expect(id1).not.toBe(id2); // Should be unique
    });

    it('should identify risk factors correctly', () => {
      const riskProfile = {
        aiOpportunityAssessment: { aiReadinessScore: 3 },
        changeManagementCapability: 'Low'
      };

      const risks = ProfileService.identifyRiskFactors(riskProfile);

      expect(risks).toHaveLength(2);
      expect(risks[0].type).toBe('Technical Readiness');
      expect(risks[1].type).toBe('Change Management');
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', async () => {
      AuthService.getCurrentUser.mockRejectedValue(new Error('Auth failed'));

      const result = await ProfileService.getProfiles();

      // Should fall back to localStorage
      expect(result).toBeDefined();
      expect(ProfileDB.getAll).not.toHaveBeenCalled();
    });

    it('should handle missing user gracefully', async () => {
      AuthService.getCurrentUser.mockResolvedValue(null);

      const result = await ProfileService.createProfile(mockProfileData);

      // Should fall back to localStorage
      expect(result).toBeDefined();
      expect(result.companyName).toBe(mockProfileData.companyName);
    });

    it('should handle Supabase service unavailable', async () => {
      ProfileService.MIGRATION_CONFIG.enableSupabase = false;

      const result = await ProfileService.getProfiles();

      expect(ProfileDB.getAll).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
}); 