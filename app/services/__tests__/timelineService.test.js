/**
 * Tests for Enhanced TimelineService with Supabase Integration
 * 
 * Comprehensive test suite covering:
 * - Supabase integration with localStorage fallback
 * - Timeline caching and regeneration
 * - Dual-write strategy and data synchronization
 * - Error handling and graceful degradation
 * - AI provider integration and cost tracking
 * - Audit trail and timeline management
 */

// Mock environment for testing
process.env.NODE_ENV = 'test';

// Mock the Supabase service
jest.mock('../supabaseService', () => ({
  TimelineDB: {
    create: jest.fn(),
    getById: jest.fn(),
    getByProfileId: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  },
  ProfileDB: {
    getById: jest.fn()
  },
  AuthService: {
    getCurrentUser: jest.fn()
  },
  AuditService: {
    log: jest.fn()
  },
  AIConversationDB: {
    create: jest.fn()
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

import { TimelineService } from '../timelineService';
import { TimelineDB, AuthService, AuditService, AIConversationDB } from '../supabaseService';

describe('Enhanced TimelineService with Supabase Integration', () => {
  const mockUser = { id: 'user-123', email: 'test@example.com' };
  const mockBusinessProfile = {
    companyName: 'Test Corporation',
    industry: 'Technology',
    companySize: 'small',
    aiMaturityLevel: 'developing',
    profileId: 'profile-456'
  };

  const mockTimeline = {
    id: 'timeline-123',
    scenarioType: 'balanced',
    summary: {
      companyName: 'Test Corporation',
      industry: 'Technology',
      approachType: 'balanced',
      totalDuration: 12,
      expectedROI: 0.25,
      riskLevel: 'Low'
    },
    phases: [
      {
        name: 'Foundation & Assessment',
        duration: 3,
        activities: ['AI Readiness Assessment'],
        deliverables: ['AI Strategy Document']
      }
    ],
    metadata: {
      generatedAt: '2024-01-01T00:00:00Z',
      generatedBy: 'user-123',
      duration: 1000,
      version: '2.0',
      aiProvider: 'internal',
      cost: 0
    }
  };

  const mockSupabaseTimeline = {
    id: 'timeline-123',
    profile_id: 'profile-456',
    scenario_type: 'balanced',
    data: mockTimeline,
    generated_by: 'internal',
    cost_usd: 0,
    status: 'active',
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z'
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue('[]');
    AuthService.getCurrentUser.mockResolvedValue(mockUser);
    
    // Reset migration configuration
    TimelineService.MIGRATION_CONFIG.enableSupabase = true;
    TimelineService.MIGRATION_CONFIG.dualWriteMode = true;
    TimelineService.MIGRATION_CONFIG.fallbackToLocalStorage = true;
    TimelineService.MIGRATION_CONFIG.enableCaching = true;
    
    // Clear cache
    TimelineService.clearCache();
  });

  describe('Migration Configuration', () => {
    it('should have correct default migration configuration', () => {
      expect(TimelineService.MIGRATION_CONFIG).toEqual({
        enableSupabase: true,
        dualWriteMode: true,
        fallbackToLocalStorage: true,
        enableCaching: true,
        cacheExpiryHours: 24,
        retryAttempts: 3,
        retryDelay: 1000
      });
    });
  });

  describe('generateTimeline', () => {
    it('should generate timeline and store in Supabase with audit trail', async () => {
      TimelineDB.create.mockResolvedValue(mockSupabaseTimeline);
      AuditService.log.mockResolvedValue({});

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      // Verify timeline structure
      expect(result).toEqual(
        expect.objectContaining({
          scenarioType: 'balanced',
          summary: expect.objectContaining({
            companyName: 'Test Corporation',
            industry: 'Technology'
          }),
          phases: expect.arrayContaining([
            expect.objectContaining({
              name: 'Foundation & Assessment'
            })
          ]),
          metadata: expect.objectContaining({
            version: '2.0',
            aiProvider: 'internal'
          })
        })
      );

      // Verify Supabase storage
      expect(TimelineDB.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_id: 'profile-456',
          scenario_type: 'balanced',
          generated_by: 'internal'
        }),
        mockUser.id
      );

      // Verify audit logging
      expect(AuditService.log).toHaveBeenCalledWith(
        'CREATE',
        'timeline',
        expect.any(String),
        null,
        expect.any(Object)
      );

      // Verify localStorage dual-write
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'aiTimelines',
        expect.any(String)
      );
    });

    it('should return cached timeline when cache is valid', async () => {
      // Set up cache
      const cachedTimeline = { ...mockTimeline, id: 'cached-timeline' };
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', cachedTimeline);

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      expect(result.id).toBe('cached-timeline');
      expect(TimelineDB.create).not.toHaveBeenCalled();
      expect(AuditService.log).toHaveBeenCalledWith(
        'ACCESS',
        'timeline',
        'cached-timeline',
        null,
        { action: 'cache_hit' }
      );
    });

    it('should force regenerate when forceRegenerate option is true', async () => {
      // Set up cache
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', mockTimeline);
      TimelineDB.create.mockResolvedValue(mockSupabaseTimeline);

      const result = await TimelineService.generateTimeline(
        mockBusinessProfile, 
        'balanced', 
        { forceRegenerate: true }
      );

      expect(TimelineDB.create).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should fall back to localStorage when Supabase fails', async () => {
      TimelineDB.create.mockRejectedValue(new Error('Supabase connection failed'));

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'aiTimelines',
        expect.any(String)
      );
      expect(result).toBeDefined();
    });

    it('should track AI conversation for external providers', async () => {
      TimelineDB.create.mockResolvedValue(mockSupabaseTimeline);
      AIConversationDB.create.mockResolvedValue({});

      await TimelineService.generateTimeline(
        mockBusinessProfile, 
        'balanced', 
        { aiProvider: 'openai' }
      );

      expect(AIConversationDB.create).toHaveBeenCalledWith(
        expect.objectContaining({
          profile_id: 'profile-456',
          provider: 'openai',
          conversation_type: 'timeline_generation'
        }),
        mockUser.id
      );
    });

    it('should use localStorage only when Supabase is disabled', async () => {
      TimelineService.MIGRATION_CONFIG.enableSupabase = false;

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      expect(TimelineDB.create).not.toHaveBeenCalled();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });

  describe('getTimeline', () => {
    it('should retrieve timeline from Supabase', async () => {
      TimelineDB.getById.mockResolvedValue(mockSupabaseTimeline);

      const result = await TimelineService.getTimeline('timeline-123', mockUser.id);

      expect(TimelineDB.getById).toHaveBeenCalledWith('timeline-123', mockUser.id);
      expect(result).toEqual(
        expect.objectContaining({
          id: 'timeline-123',
          scenarioType: 'balanced'
        })
      );
      expect(AuditService.log).toHaveBeenCalledWith(
        'ACCESS',
        'timeline',
        'timeline-123',
        null,
        { action: 'retrieve' }
      );
    });

    it('should fall back to localStorage when Supabase fails', async () => {
      TimelineDB.getById.mockRejectedValue(new Error('Network error'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTimeline]));

      const result = await TimelineService.getTimeline('timeline-123', mockUser.id);

      expect(result).toEqual(
        expect.objectContaining({
          id: 'timeline-123'
        })
      );
    });

    it('should return null when timeline not found anywhere', async () => {
      TimelineDB.getById.mockResolvedValue(null);
      mockLocalStorage.getItem.mockReturnValue('[]');

      const result = await TimelineService.getTimeline('nonexistent', mockUser.id);

      expect(result).toBeNull();
    });
  });

  describe('getTimelinesByProfile', () => {
    it('should retrieve all timelines for a profile from Supabase', async () => {
      const mockTimelines = [mockSupabaseTimeline];
      TimelineDB.getByProfileId.mockResolvedValue(mockTimelines);

      const result = await TimelineService.getTimelinesByProfile('profile-456', mockUser.id);

      expect(TimelineDB.getByProfileId).toHaveBeenCalledWith('profile-456', mockUser.id);
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(
        expect.objectContaining({
          id: 'timeline-123',
          profileId: 'profile-456'
        })
      );
    });

    it('should fall back to localStorage when Supabase fails', async () => {
      TimelineDB.getByProfileId.mockRejectedValue(new Error('Network error'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([
        { ...mockTimeline, profileId: 'profile-456' }
      ]));

      const result = await TimelineService.getTimelinesByProfile('profile-456', mockUser.id);

      expect(result).toHaveLength(1);
      expect(result[0].profileId).toBe('profile-456');
    });
  });

  describe('updateTimeline', () => {
    it('should update timeline in Supabase with audit trail', async () => {
      const updates = { status: 'completed' };
      const updatedSupabaseTimeline = { ...mockSupabaseTimeline, ...updates };
      TimelineDB.update.mockResolvedValue(updatedSupabaseTimeline);

      const result = await TimelineService.updateTimeline('timeline-123', updates, mockUser.id);

      expect(TimelineDB.update).toHaveBeenCalledWith('timeline-123', updates, mockUser.id);
      expect(AuditService.log).toHaveBeenCalledWith(
        'UPDATE',
        'timeline',
        'timeline-123',
        null,
        updatedSupabaseTimeline
      );
      expect(result).toBeDefined();
    });

    it('should invalidate cache when updating timeline', async () => {
      // Set up cache
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', mockTimeline);
      
      const updates = { status: 'completed' };
      TimelineDB.update.mockResolvedValue({ ...mockSupabaseTimeline, ...updates });

      await TimelineService.updateTimeline('timeline-123', updates, mockUser.id);

      // Cache should be invalidated for this timeline
      const cached = await TimelineService.getCachedTimeline(mockBusinessProfile, 'balanced');
      expect(cached).toBeNull();
    });

    it('should update localStorage in dual-write mode', async () => {
      const updates = { status: 'completed' };
      TimelineDB.update.mockResolvedValue({ ...mockSupabaseTimeline, ...updates });
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTimeline]));

      await TimelineService.updateTimeline('timeline-123', updates, mockUser.id);

      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });

    it('should fall back to localStorage when Supabase update fails', async () => {
      const updates = { status: 'completed' };
      TimelineDB.update.mockRejectedValue(new Error('Update failed'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTimeline]));

      const result = await TimelineService.updateTimeline('timeline-123', updates, mockUser.id);

      expect(result).toBeDefined();
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('deleteTimeline', () => {
    it('should soft delete timeline in Supabase with audit trail', async () => {
      TimelineDB.delete.mockResolvedValue({});

      const result = await TimelineService.deleteTimeline('timeline-123', mockUser.id);

      expect(TimelineDB.delete).toHaveBeenCalledWith('timeline-123', mockUser.id);
      expect(AuditService.log).toHaveBeenCalledWith('DELETE', 'timeline', 'timeline-123');
      expect(result).toBe(true);
    });

    it('should clear cache when deleting timeline', async () => {
      // Set up cache
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', mockTimeline);
      
      TimelineDB.delete.mockResolvedValue({});

      await TimelineService.deleteTimeline('timeline-123', mockUser.id);

      // Cache should be cleared for this timeline
      const cached = await TimelineService.getCachedTimeline(mockBusinessProfile, 'balanced');
      expect(cached).toBeNull();
    });

    it('should delete from localStorage in dual-write mode', async () => {
      TimelineDB.delete.mockResolvedValue({});
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTimeline]));

      await TimelineService.deleteTimeline('timeline-123', mockUser.id);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('aiTimelines', '[]');
    });

    it('should fall back to localStorage when Supabase delete fails', async () => {
      TimelineDB.delete.mockRejectedValue(new Error('Delete failed'));
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify([mockTimeline]));

      const result = await TimelineService.deleteTimeline('timeline-123', mockUser.id);

      expect(result).toBe(true);
      expect(mockLocalStorage.setItem).toHaveBeenCalled();
    });
  });

  describe('regenerateTimeline', () => {
    it('should regenerate timeline with new scenario type', async () => {
      // Create a complete mock timeline with business profile
      const mockTimelineWithBusinessProfile = {
        ...mockSupabaseTimeline,
        data: {
          ...mockTimeline,
          businessProfile: mockBusinessProfile
        }
      };
      
      // Mock existing timeline
      TimelineDB.getById.mockResolvedValue(mockTimelineWithBusinessProfile);
      
      // Mock timeline generation
      TimelineDB.create.mockResolvedValue(mockSupabaseTimeline);
      
      // Mock timeline update
      const updatedTimeline = { ...mockSupabaseTimeline, scenario_type: 'aggressive' };
      TimelineDB.update.mockResolvedValue(updatedTimeline);

      const result = await TimelineService.regenerateTimeline(
        'timeline-123', 
        'aggressive', 
        {}, 
        mockUser.id
      );

      expect(TimelineDB.getById).toHaveBeenCalledWith('timeline-123', mockUser.id);
      expect(TimelineDB.update).toHaveBeenCalledWith(
        'timeline-123',
        expect.objectContaining({
          scenario_type: 'aggressive',
          regenerated_at: expect.any(String),
          regenerated_by: mockUser.id
        }),
        mockUser.id
      );
      expect(result).toBeDefined();
    });

    it('should throw error when original timeline not found', async () => {
      TimelineDB.getById.mockResolvedValue(null);

      await expect(
        TimelineService.regenerateTimeline('nonexistent', 'aggressive', {}, mockUser.id)
      ).rejects.toThrow('Timeline not found');
    });
  });

  describe('Caching System', () => {
    it('should cache timeline correctly', () => {
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', mockTimeline);

      const cacheKey = TimelineService.getCacheKey(mockBusinessProfile, 'balanced');
      expect(TimelineService.cache.has(cacheKey)).toBe(true);
    });

    it('should validate cache expiry correctly', () => {
      const recentTimestamp = Date.now() - 1000; // 1 second ago
      const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago

      expect(TimelineService.isCacheValid(recentTimestamp)).toBe(true);
      expect(TimelineService.isCacheValid(oldTimestamp)).toBe(false);
    });

    it('should generate correct cache keys', () => {
      const key = TimelineService.getCacheKey(mockBusinessProfile, 'balanced');
      expect(key).toBe('timeline-Test Corporation-Technology-small-balanced');
    });

    it('should clear cache correctly', () => {
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', mockTimeline);
      TimelineService.clearCache();

      const cached = TimelineService.cache.get(
        TimelineService.getCacheKey(mockBusinessProfile, 'balanced')
      );
      expect(cached).toBeUndefined();
    });

    it('should invalidate specific timeline from cache', () => {
      TimelineService.setCachedTimeline(mockBusinessProfile, 'balanced', mockTimeline);
      TimelineService.invalidateCache('timeline-123');

      const cached = TimelineService.cache.get(
        TimelineService.getCacheKey(mockBusinessProfile, 'balanced')
      );
      expect(cached).toBeUndefined();
    });
  });

  describe('Data Transformation', () => {
    it('should transform Supabase timeline to expected format', () => {
      const transformed = TimelineService.transformSupabaseToTimeline(mockSupabaseTimeline);

      expect(transformed).toEqual({
        id: 'timeline-123',
        ...mockTimeline,
        profileId: 'profile-456',
        scenarioType: 'balanced',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        metadata: {
          ...mockTimeline.metadata,
          costUsd: 0,
          generatedBy: 'internal'
        }
      });
    });
  });

  describe('LocalStorage Operations', () => {
    it('should store timeline locally', async () => {
      mockLocalStorage.getItem.mockReturnValue('[]');

      await TimelineService.storeTimelineLocally(mockTimeline);

      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'aiTimelines',
        JSON.stringify([mockTimeline])
      );
    });

    it('should handle localStorage read errors gracefully', () => {
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('localStorage error');
      });

      const result = TimelineService.getTimelinesFromLocalStorage();

      expect(result).toEqual([]);
    });

    it('should update timeline in localStorage', async () => {
      const existingTimelines = [mockTimeline];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingTimelines));

      const updates = { status: 'completed' };
      await TimelineService.updateTimelineLocally('timeline-123', updates);

      const setItemCall = mockLocalStorage.setItem.mock.calls[0];
      const savedTimelines = JSON.parse(setItemCall[1]);
      
      expect(savedTimelines[0]).toEqual({ ...mockTimeline, ...updates });
    });

    it('should delete timeline from localStorage', async () => {
      const existingTimelines = [mockTimeline, { id: 'other-timeline' }];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(existingTimelines));

      await TimelineService.deleteTimelineLocally('timeline-123');

      const setItemCall = mockLocalStorage.setItem.mock.calls[0];
      const savedTimelines = JSON.parse(setItemCall[1]);
      
      expect(savedTimelines).toHaveLength(1);
      expect(savedTimelines[0].id).toBe('other-timeline');
    });

    it('should filter timelines by profile ID locally', async () => {
      const timelines = [
        { ...mockTimeline, profileId: 'profile-456' },
        { id: 'other-timeline', profileId: 'profile-789' }
      ];
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(timelines));

      const result = await TimelineService.getTimelinesLocallyByProfile('profile-456');

      expect(result).toHaveLength(1);
      expect(result[0].profileId).toBe('profile-456');
    });
  });

  describe('Business Logic', () => {
    it('should calculate correct duration for different scenarios', () => {
      expect(TimelineService.calculateDuration('conservative')).toBe(18);
      expect(TimelineService.calculateDuration('balanced')).toBe(12);
      expect(TimelineService.calculateDuration('aggressive')).toBe(8);
    });

    it('should calculate correct ROI for different scenarios', () => {
      expect(TimelineService.calculateROI(mockBusinessProfile, 'conservative')).toBe(0.15);
      expect(TimelineService.calculateROI(mockBusinessProfile, 'balanced')).toBe(0.25);
      expect(TimelineService.calculateROI(mockBusinessProfile, 'aggressive')).toBe(0.40);
    });

    it('should calculate risk level based on scenario and maturity', () => {
      expect(TimelineService.calculateRiskLevel('conservative', 'beginner')).toBe('Low');
      expect(TimelineService.calculateRiskLevel('balanced', 'developing')).toBe('Low');
      expect(TimelineService.calculateRiskLevel('aggressive', 'beginner')).toBe('High');
    });

    it('should generate phases correctly for different scenarios', async () => {
      const phases = await TimelineService.generatePhases(mockBusinessProfile, 'balanced', {});

      expect(phases).toHaveLength(4);
      expect(phases[0].name).toBe('Foundation & Assessment');
      expect(phases[1].name).toBe('Pilot Implementation');
      expect(phases[2].name).toBe('Scale & Expansion');
      expect(phases[3].name).toBe('Optimization & Growth');
    });

    it('should generate unique timeline IDs', () => {
      const id1 = TimelineService.generateTimelineId();
      const id2 = TimelineService.generateTimelineId();

      expect(id1).toMatch(/^timeline-/);
      expect(id2).toMatch(/^timeline-/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('Error Handling', () => {
    it('should handle authentication errors gracefully', async () => {
      AuthService.getCurrentUser.mockRejectedValue(new Error('Auth failed'));

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      // Should still generate timeline but with anonymous user
      expect(result).toBeDefined();
      expect(result.metadata.generatedBy).toBe('anonymous');
    });

    it('should handle missing user gracefully', async () => {
      AuthService.getCurrentUser.mockResolvedValue(null);

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      expect(result).toBeDefined();
      expect(result.metadata.generatedBy).toBe('anonymous');
    });

    it('should handle Supabase service unavailable', async () => {
      TimelineService.MIGRATION_CONFIG.enableSupabase = false;

      const result = await TimelineService.generateTimeline(mockBusinessProfile, 'balanced');

      expect(TimelineDB.create).not.toHaveBeenCalled();
      expect(result).toBeDefined();
    });
  });
}); 