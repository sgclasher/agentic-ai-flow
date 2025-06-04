'use client';

/**
 * Enhanced AI Transformation Timeline Service
 * 
 * Now integrated with Supabase backend while maintaining backward compatibility.
 * Features dual-write strategy, caching, regeneration capabilities, and comprehensive
 * timeline management with audit trails.
 * 
 * Key Features:
 * - Supabase integration with localStorage fallback
 * - Timeline caching and regeneration
 * - Audit trail for timeline operations
 * - Sharing and collaboration features
 * - Export functionality preparation
 * - AI provider cost tracking
 */

import { 
  TimelineDB, 
  ProfileDB, 
  AuthService, 
  AuditService,
  AIConversationDB 
} from './supabaseService';

export class TimelineService {
  // Migration configuration
  static MIGRATION_CONFIG = {
    enableSupabase: false,  // DISABLED - using localStorage only to avoid errors
    dualWriteMode: false,
    fallbackToLocalStorage: true,
    enableCaching: true,
    cacheExpiryHours: 24,
    retryAttempts: 3,
    retryDelay: 1000
  };

  // Cache management
  static cache = new Map();

  /**
   * Generate AI transformation timeline with enhanced backend integration
   * @param {Object} businessProfile - Business profile data
   * @param {string} scenarioType - Timeline scenario (conservative/balanced/aggressive)
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Generated timeline with metadata
   */
  static async generateTimeline(businessProfile, scenarioType = 'balanced', options = {}) {
    try {
      const user = await this.getCurrentUser();
      const startTime = Date.now();
      
      // Check cache first if enabled
      if (this.MIGRATION_CONFIG.enableCaching && !options.forceRegenerate) {
        const cached = await this.getCachedTimeline(businessProfile, scenarioType);
        if (cached) {
          await this.logTimelineAccess(cached.id, 'cache_hit', user?.id);
          return cached;
        }
      }

      // Generate timeline using existing algorithm
      const timeline = await this.generateTimelineCore(businessProfile, scenarioType, options);
      
      // Enhance timeline with metadata
      const enhancedTimeline = {
        ...timeline,
        id: this.generateTimelineId(),
        scenarioType,
        businessProfile: {
          companyName: businessProfile.companyName,
          industry: businessProfile.industry,
          size: businessProfile.companySize
        },
        metadata: {
          generatedAt: new Date().toISOString(),
          generatedBy: user?.id || 'anonymous',
          duration: Date.now() - startTime,
          version: '2.0',
          aiProvider: options.aiProvider || 'internal',
          cost: timeline.estimatedCost || 0
        },
        sharing: {
          isPublic: false,
          sharedWith: [],
          accessLevel: 'private'
        }
      };

      // Store in Supabase and cache
      await this.storeTimeline(enhancedTimeline, businessProfile.profileId, user?.id);
      
      // Cache the result
      if (this.MIGRATION_CONFIG.enableCaching) {
        this.setCachedTimeline(businessProfile, scenarioType, enhancedTimeline);
      }

      return enhancedTimeline;

    } catch (error) {
      console.error('Error generating timeline:', error);
      throw error;
    }
  }

  /**
   * Core timeline generation logic (existing algorithm preserved)
   */
  static async generateTimelineCore(businessProfile, scenarioType, options) {
    const { companyName, industry, companySize, aiMaturityLevel } = businessProfile;
    
    // Base timeline structure
    const timeline = {
      summary: {
        companyName,
        industry,
        approachType: scenarioType,
        totalDuration: this.calculateDuration(scenarioType),
        expectedROI: this.calculateROI(businessProfile, scenarioType),
        riskLevel: this.calculateRiskLevel(scenarioType, aiMaturityLevel)
      },
      phases: []
    };

    // Generate phases based on scenario
    timeline.phases = await this.generatePhases(businessProfile, scenarioType, options);
    
    // Add scenario-specific adjustments
    timeline.adjustments = this.getScenarioAdjustments(scenarioType, businessProfile);
    
    // Calculate success metrics
    timeline.successMetrics = this.calculateSuccessMetrics(businessProfile, scenarioType);
    
    return timeline;
  }

    /**
   * Store timeline in Supabase with audit trail
   */
  static async storeTimeline(timeline, profileId, userId) {
    console.log('TimelineService.storeTimeline called with:', {
      timelineId: timeline.id,
      profileId: profileId,
      userId: userId,
      scenarioType: timeline.scenarioType,
      enableSupabase: this.MIGRATION_CONFIG.enableSupabase
    });

    // Always store locally first as a backup
    await this.storeTimelineLocally(timeline);
    console.log('Timeline stored locally as backup');

    if (!this.MIGRATION_CONFIG.enableSupabase) {
      console.log('Supabase disabled, using localStorage only');
      return timeline;
    }

    try {
      console.log('Attempting to store timeline in Supabase...');
      const timelineData = {
        profile_id: profileId,
        scenario_type: timeline.scenarioType,
        data: timeline,
        generated_by: timeline.metadata.aiProvider,
        cost_usd: timeline.metadata.cost
      };

      const stored = await TimelineDB.create(timelineData, userId);
      console.log('Timeline stored successfully in Supabase:', stored.id);
      
      // Log the creation (non-blocking)
      try {
        await AuditService.log('CREATE', 'timeline', stored.id, null, timelineData);
      } catch (auditError) {
        console.warn('Failed to log audit entry:', auditError);
      }
      
      // Track AI conversation if external provider used (non-blocking)
      if (timeline.metadata.aiProvider !== 'internal') {
        try {
          await this.trackAIConversation(profileId, timeline, userId);
        } catch (trackError) {
          console.warn('Failed to track AI conversation:', trackError);
        }
      }

      return stored;

    } catch (error) {
      console.warn('Failed to store timeline in Supabase, using localStorage fallback:', {
        message: error.message,
        code: error.code,
        details: error.details
      });
      
      // Always return the timeline object even if Supabase storage fails
      // since we already stored it locally
      return timeline;
    }
  }

  /**
   * Get timeline by ID with caching
   */
  static async getTimeline(timelineId, userId) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const timeline = await TimelineDB.getById(timelineId, userId);
          if (timeline) {
            await this.logTimelineAccess(timelineId, 'retrieve', userId);
            return this.transformSupabaseToTimeline(timeline);
          }
        } catch (error) {
          console.warn('Failed to fetch timeline from Supabase:', error);
        }
      }

      // Fallback to localStorage
      return await this.getTimelineLocally(timelineId);

    } catch (error) {
      console.error('Error fetching timeline:', error);
      return null;
    }
  }

  /**
   * Get all timelines for a profile
   */
  static async getTimelinesByProfile(profileId, userId) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const timelines = await TimelineDB.getByProfileId(profileId, userId);
          return timelines.map(this.transformSupabaseToTimeline);
        } catch (error) {
          console.warn('Failed to fetch timelines from Supabase:', error);
        }
      }

      // Fallback to localStorage
      return await this.getTimelinesLocallyByProfile(profileId);

    } catch (error) {
      console.error('Error fetching timelines:', error);
      return [];
    }
  }

  /**
   * Update timeline with versioning
   */
  static async updateTimeline(timelineId, updates, userId) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const updatedTimeline = await TimelineDB.update(timelineId, updates, userId);
          
          // Log the update
          await AuditService.log('UPDATE', 'timeline', timelineId, null, updatedTimeline);
          
          // Update cache
          this.invalidateCache(timelineId);
          
          // Dual-write to localStorage if enabled
          if (this.MIGRATION_CONFIG.dualWriteMode) {
            await this.updateTimelineLocally(timelineId, updates);
          }

          return this.transformSupabaseToTimeline(updatedTimeline);

        } catch (error) {
          console.warn('Failed to update timeline in Supabase:', error);
        }
      }

      // Fallback to localStorage
      return await this.updateTimelineLocally(timelineId, updates);

    } catch (error) {
      console.error('Error updating timeline:', error);
      throw error;
    }
  }

  /**
   * Delete timeline (soft delete)
   */
  static async deleteTimeline(timelineId, userId) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          await TimelineDB.delete(timelineId, userId);
          
          // Log the deletion
          await AuditService.log('DELETE', 'timeline', timelineId);
          
          // Clear cache
          this.invalidateCache(timelineId);
          
          // Delete from localStorage if dual-write mode
          if (this.MIGRATION_CONFIG.dualWriteMode) {
            await this.deleteTimelineLocally(timelineId);
          }

          return true;

        } catch (error) {
          console.warn('Failed to delete timeline from Supabase:', error);
        }
      }

      // Fallback to localStorage
      return await this.deleteTimelineLocally(timelineId);

    } catch (error) {
      console.error('Error deleting timeline:', error);
      return false;
    }
  }

  /**
   * Regenerate timeline with new parameters
   */
  static async regenerateTimeline(timelineId, newScenarioType, options = {}, userId) {
    try {
      // Get the original timeline
      const originalTimeline = await this.getTimeline(timelineId, userId);
      if (!originalTimeline) {
        throw new Error('Timeline not found');
      }

      // Get the original business profile
      const businessProfile = originalTimeline.businessProfile;
      
      // Generate new timeline
      const newTimeline = await this.generateTimeline(
        businessProfile, 
        newScenarioType, 
        { ...options, forceRegenerate: true }
      );

      // Update the existing timeline record
      await this.updateTimeline(timelineId, {
        data: newTimeline,
        scenario_type: newScenarioType,
        regenerated_at: new Date().toISOString(),
        regenerated_by: userId
      }, userId);

      return newTimeline;

    } catch (error) {
      console.error('Error regenerating timeline:', error);
      throw error;
    }
  }

  // ============================================================================
  // CACHING UTILITIES
  // ============================================================================

  static getCacheKey(businessProfile, scenarioType) {
    const profileKey = `${businessProfile.companyName}-${businessProfile.industry}-${businessProfile.companySize}`;
    return `timeline-${profileKey}-${scenarioType}`;
  }

  static async getCachedTimeline(businessProfile, scenarioType) {
    const cacheKey = this.getCacheKey(businessProfile, scenarioType);
    const cached = this.cache.get(cacheKey);
    
    if (cached && this.isCacheValid(cached.timestamp)) {
      return cached.timeline;
    }
    
    return null;
  }

  static setCachedTimeline(businessProfile, scenarioType, timeline) {
    const cacheKey = this.getCacheKey(businessProfile, scenarioType);
    this.cache.set(cacheKey, {
      timeline,
      timestamp: Date.now()
    });
  }

  static isCacheValid(timestamp) {
    const expiryTime = this.MIGRATION_CONFIG.cacheExpiryHours * 60 * 60 * 1000;
    return (Date.now() - timestamp) < expiryTime;
  }

  static invalidateCache(timelineId) {
    // Remove specific timeline from cache if it exists
    for (const [key, value] of this.cache.entries()) {
      if (value.timeline?.id === timelineId) {
        this.cache.delete(key);
      }
    }
  }

  static clearCache() {
    this.cache.clear();
  }

  // ============================================================================
  // DATA TRANSFORMATION
  // ============================================================================

  static transformSupabaseToTimeline(supabaseTimeline) {
    return {
      id: supabaseTimeline.id,
      ...supabaseTimeline.data,
      profileId: supabaseTimeline.profile_id,
      scenarioType: supabaseTimeline.scenario_type,
      createdAt: supabaseTimeline.created_at,
      updatedAt: supabaseTimeline.updated_at,
      metadata: {
        ...supabaseTimeline.data.metadata,
        costUsd: supabaseTimeline.cost_usd,
        generatedBy: supabaseTimeline.generated_by
      }
    };
  }

  // ============================================================================
  // LOCALSTORAGE OPERATIONS (FALLBACK)
  // ============================================================================

  static async storeTimelineLocally(timeline) {
    try {
      const timelines = this.getTimelinesFromLocalStorage();
      timelines.push(timeline);
      localStorage.setItem('aiTimelines', JSON.stringify(timelines));
      return timeline;
    } catch (error) {
      console.warn('Error storing timeline locally:', error);
      throw error;
    }
  }

  static async getTimelineLocally(timelineId) {
    try {
      const timelines = this.getTimelinesFromLocalStorage();
      return timelines.find(t => t.id === timelineId) || null;
    } catch (error) {
      console.warn('Error getting timeline locally:', error);
      return null;
    }
  }

  static async getTimelinesLocallyByProfile(profileId) {
    try {
      const timelines = this.getTimelinesFromLocalStorage();
      return timelines.filter(t => t.profileId === profileId);
    } catch (error) {
      console.warn('Error getting timelines locally:', error);
      return [];
    }
  }

  static async updateTimelineLocally(timelineId, updates) {
    try {
      const timelines = this.getTimelinesFromLocalStorage();
      const index = timelines.findIndex(t => t.id === timelineId);
      
      if (index !== -1) {
        timelines[index] = { ...timelines[index], ...updates };
        localStorage.setItem('aiTimelines', JSON.stringify(timelines));
        return timelines[index];
      }
      
      return null;
    } catch (error) {
      console.warn('Error updating timeline locally:', error);
      throw error;
    }
  }

  static async deleteTimelineLocally(timelineId) {
    try {
      const timelines = this.getTimelinesFromLocalStorage();
      const filtered = timelines.filter(t => t.id !== timelineId);
      localStorage.setItem('aiTimelines', JSON.stringify(filtered));
      return true;
    } catch (error) {
      console.warn('Error deleting timeline locally:', error);
      return false;
    }
  }

  static getTimelinesFromLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem('aiTimelines') || '[]');
    } catch (error) {
      console.warn('Error reading timelines from localStorage:', error);
      return [];
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  static async getCurrentUser() {
    try {
      return await AuthService.getCurrentUser();
    } catch (error) {
      console.warn('Could not get current user:', error);
      return null;
    }
  }

  static async logTimelineAccess(timelineId, action, userId) {
    try {
      await AuditService.log('ACCESS', 'timeline', timelineId, null, { action });
    } catch (error) {
      console.warn('Failed to log timeline access:', error);
    }
  }

  static async trackAIConversation(profileId, timeline, userId) {
    try {
      await AIConversationDB.create({
        profile_id: profileId,
        provider: timeline.metadata.aiProvider,
        conversation_type: 'timeline_generation',
        input_data: { scenarioType: timeline.scenarioType },
        output_data: timeline,
        tokens_used: timeline.metadata.tokensUsed || 0,
        cost_usd: timeline.metadata.cost || 0,
        duration_ms: timeline.metadata.duration || 0
      }, userId);
    } catch (error) {
      console.warn('Failed to track AI conversation:', error);
    }
  }

  static generateTimelineId() {
    return `timeline-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  }

  // ============================================================================
  // EXISTING CORE METHODS (PRESERVED)
  // ============================================================================

  static calculateDuration(scenarioType) {
    const baseDurations = {
      conservative: 18,
      balanced: 12,
      aggressive: 8
    };
    return baseDurations[scenarioType] || 12;
  }

  static calculateROI(businessProfile, scenarioType) {
    const baseROI = {
      conservative: 0.15,
      balanced: 0.25,
      aggressive: 0.40
    };
    return baseROI[scenarioType] || 0.25;
  }

  static calculateRiskLevel(scenarioType, aiMaturityLevel) {
    const riskMatrix = {
      conservative: { beginner: 'Low', emerging: 'Low', developing: 'Low', advanced: 'Very Low' },
      balanced: { beginner: 'Medium', emerging: 'Low', developing: 'Low', advanced: 'Low' },
      aggressive: { beginner: 'High', emerging: 'Medium', developing: 'Medium', advanced: 'Low' }
    };
    return riskMatrix[scenarioType]?.[aiMaturityLevel] || 'Medium';
  }

  static async generatePhases(businessProfile, scenarioType, options) {
    // Existing phase generation logic preserved
    const phases = [
      {
        name: 'Foundation & Assessment',
        duration: this.getPhaseDuration(1, scenarioType),
        activities: this.getPhaseActivities(1, businessProfile, scenarioType),
        deliverables: this.getPhaseDeliverables(1, scenarioType),
        risks: this.getPhaseRisks(1, scenarioType),
        successCriteria: this.getPhaseSuccessCriteria(1, scenarioType)
      },
      {
        name: 'Pilot Implementation',
        duration: this.getPhaseDuration(2, scenarioType),
        activities: this.getPhaseActivities(2, businessProfile, scenarioType),
        deliverables: this.getPhaseDeliverables(2, scenarioType),
        risks: this.getPhaseRisks(2, scenarioType),
        successCriteria: this.getPhaseSuccessCriteria(2, scenarioType)
      },
      {
        name: 'Scale & Expansion',
        duration: this.getPhaseDuration(3, scenarioType),
        activities: this.getPhaseActivities(3, businessProfile, scenarioType),
        deliverables: this.getPhaseDeliverables(3, scenarioType),
        risks: this.getPhaseRisks(3, scenarioType),
        successCriteria: this.getPhaseSuccessCriteria(3, scenarioType)
      },
      {
        name: 'Optimization & Growth',
        duration: this.getPhaseDuration(4, scenarioType),
        activities: this.getPhaseActivities(4, businessProfile, scenarioType),
        deliverables: this.getPhaseDeliverables(4, scenarioType),
        risks: this.getPhaseRisks(4, scenarioType),
        successCriteria: this.getPhaseSuccessCriteria(4, scenarioType)
      }
    ];

    return phases;
  }

  static getPhaseDuration(phaseNumber, scenarioType) {
    const durations = {
      conservative: [4, 6, 5, 3],
      balanced: [3, 4, 3, 2],
      aggressive: [2, 3, 2, 1]
    };
    return durations[scenarioType]?.[phaseNumber - 1] || 3;
  }

  static getPhaseActivities(phaseNumber, businessProfile, scenarioType) {
    // Existing activity generation logic
    const activities = {
      1: ['AI Readiness Assessment', 'Technology Infrastructure Review', 'Process Documentation'],
      2: ['Use Case Selection', 'Pilot Development', 'Training Programs'],
      3: ['Cross-Department Rollout', 'Process Integration', 'Performance Monitoring'],
      4: ['Advanced Optimization', 'Innovation Programs', 'Continuous Improvement']
    };
    return activities[phaseNumber] || [];
  }

  static getPhaseDeliverables(phaseNumber, scenarioType) {
    const deliverables = {
      1: ['AI Strategy Document', 'Readiness Assessment Report', 'Implementation Roadmap'],
      2: ['Pilot Results Report', 'Training Materials', 'Performance Metrics'],
      3: ['Scaled Implementation', 'Process Documentation', 'Success Stories'],
      4: ['Optimization Report', 'Innovation Pipeline', 'Continuous Improvement Plan']
    };
    return deliverables[phaseNumber] || [];
  }

  static getPhaseRisks(phaseNumber, scenarioType) {
    const risks = {
      1: ['Lack of stakeholder buy-in', 'Insufficient technical infrastructure'],
      2: ['Pilot failure', 'Resource constraints'],
      3: ['Change resistance', 'Integration challenges'],
      4: ['Stagnation', 'Technology obsolescence']
    };
    return risks[phaseNumber] || [];
  }

  static getPhaseSuccessCriteria(phaseNumber, scenarioType) {
    const criteria = {
      1: ['Stakeholder alignment achieved', 'Technical requirements defined'],
      2: ['Pilot success metrics met', 'Team training completed'],
      3: ['Department-wide adoption', 'Process integration successful'],
      4: ['Continuous improvement cycle established', 'Innovation culture developed']
    };
    return criteria[phaseNumber] || [];
  }

  static getScenarioAdjustments(scenarioType, businessProfile) {
    return {
      resourceAllocation: this.getResourceAllocation(scenarioType),
      changeManagement: this.getChangeManagementApproach(scenarioType),
      riskMitigation: this.getRiskMitigationStrategies(scenarioType)
    };
  }

  static getResourceAllocation(scenarioType) {
    const allocations = {
      conservative: { budget: 'Moderate', team: 'Dedicated core team', timeline: 'Extended' },
      balanced: { budget: 'Substantial', team: 'Cross-functional teams', timeline: 'Standard' },
      aggressive: { budget: 'Significant investment', team: 'Multiple teams', timeline: 'Accelerated' }
    };
    return allocations[scenarioType];
  }

  static getChangeManagementApproach(scenarioType) {
    const approaches = {
      conservative: 'Gradual adoption with extensive training',
      balanced: 'Structured change with regular checkpoints',
      aggressive: 'Rapid transformation with intensive support'
    };
    return approaches[scenarioType];
  }

  static getRiskMitigationStrategies(scenarioType) {
    const strategies = {
      conservative: ['Extensive testing', 'Gradual rollout', 'Multiple fallback options'],
      balanced: ['Regular reviews', 'Phased implementation', 'Risk monitoring'],
      aggressive: ['Rapid iteration', 'Quick pivots', 'Agile responses']
    };
    return strategies[scenarioType] || [];
  }

  static calculateSuccessMetrics(businessProfile, scenarioType) {
    return {
      efficiency: this.calculateEfficiencyGains(scenarioType),
      cost: this.calculateCostSavings(scenarioType),
      revenue: this.calculateRevenueImpact(scenarioType),
      adoption: this.calculateAdoptionTargets(scenarioType)
    };
  }

  static calculateEfficiencyGains(scenarioType) {
    const gains = {
      conservative: '15-25%',
      balanced: '25-40%',
      aggressive: '40-60%'
    };
    return gains[scenarioType];
  }

  static calculateCostSavings(scenarioType) {
    const savings = {
      conservative: '10-20%',
      balanced: '20-35%',
      aggressive: '35-50%'
    };
    return savings[scenarioType];
  }

  static calculateRevenueImpact(scenarioType) {
    const impact = {
      conservative: '5-15%',
      balanced: '15-30%',
      aggressive: '30-50%'
    };
    return impact[scenarioType];
  }

  static calculateAdoptionTargets(scenarioType) {
    const targets = {
      conservative: '60-80%',
      balanced: '80-90%',
      aggressive: '90-95%'
    };
    return targets[scenarioType];
  }
} 