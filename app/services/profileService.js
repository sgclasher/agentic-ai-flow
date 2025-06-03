'use client';

/**
 * Enhanced Client Profile Management Service
 * 
 * Now integrated with Supabase backend while maintaining backward compatibility.
 * Implements dual-write strategy for safe migration and comprehensive error handling.
 * 
 * Features:
 * - Supabase integration with localStorage fallback
 * - Automatic data migration and sync
 * - Comprehensive error handling and retry logic
 * - Audit trail and versioning
 * - AI timeline integration
 */

import { markdownService } from './markdownService';
import { 
  ProfileDB, 
  AuthService, 
  AuditService, 
  ProfileVersionDB 
} from './supabaseService';

export class ProfileService {
  // Migration configuration
  static MIGRATION_CONFIG = {
    enableSupabase: true,
    dualWriteMode: true,
    fallbackToLocalStorage: true,
    retryAttempts: 3,
    retryDelay: 1000
  };

  /**
   * Create a new client profile with Supabase integration
   * @param {Object} profileData - Raw form data
   * @returns {Promise<Object>} Created profile with ID
   */
  static async createProfile(profileData) {
    try {
      // Generate unique ID and prepare profile
      const profileId = this.generateProfileId(profileData.companyName);
      const markdown = markdownService.generateMarkdown(profileData);
      
      const profile = {
        id: profileId,
        ...profileData,
        markdown,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };

      // Attempt Supabase creation first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            const supabaseProfile = await ProfileDB.create(profileData, user.id);
            
            // Log successful creation
            await AuditService.log('CREATE', 'profile', supabaseProfile.id, null, supabaseProfile);
            
            // If dual-write is enabled, also save to localStorage
            if (this.MIGRATION_CONFIG.dualWriteMode) {
              await this.saveToLocalStorage(profile);
            }
            
            return this.transformSupabaseToProfile(supabaseProfile);
          }
        } catch (supabaseError) {
          console.warn('Supabase profile creation failed, falling back to localStorage:', supabaseError);
          
          // Fall back to localStorage if enabled
          if (this.MIGRATION_CONFIG.fallbackToLocalStorage) {
            await this.saveToLocalStorage(profile);
            return profile;
          }
          throw supabaseError;
        }
      }

      // Default to localStorage
      await this.saveToLocalStorage(profile);
      return profile;
      
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Get all profiles with Supabase integration
   * @returns {Promise<Array>} Array of profiles
   */
  static async getProfiles() {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            const supabaseProfiles = await ProfileDB.getAll(user.id);
            
            // Transform Supabase profiles to expected format
            const transformedProfiles = supabaseProfiles.map(this.transformSupabaseToProfile);
            
            // If dual-write mode, sync with localStorage
            if (this.MIGRATION_CONFIG.dualWriteMode) {
              await this.syncProfilesWithLocalStorage(transformedProfiles);
            }
            
            return transformedProfiles;
          }
        } catch (supabaseError) {
          console.warn('Supabase profile fetch failed, falling back to localStorage:', supabaseError);
        }
      }

      // Fall back to localStorage
      return this.getFromLocalStorage();
      
    } catch (error) {
      console.error('Error fetching profiles:', error);
      // Emergency fallback
      return this.getFromLocalStorage();
    }
  }

  /**
   * Get a specific profile by ID
   * @param {string} profileId - Profile ID
   * @returns {Promise<Object|null>} Profile data or null
   */
  static async getProfile(profileId) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            const supabaseProfile = await ProfileDB.getById(profileId, user.id);
            if (supabaseProfile) {
              return this.transformSupabaseToProfile(supabaseProfile);
            }
          }
        } catch (supabaseError) {
          console.warn('Supabase profile fetch failed, falling back to localStorage:', supabaseError);
        }
      }

      // Fall back to localStorage
      const localProfiles = this.getFromLocalStorage();
      return localProfiles.find(p => p.id === profileId) || null;
      
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  }

  /**
   * Update a profile with versioning and audit trail
   * @param {string} profileId - Profile ID
   * @param {Object} profileData - Updated profile data
   * @returns {Promise<Object>} Updated profile
   */
  static async updateProfile(profileId, profileData) {
    try {
      const markdown = markdownService.generateMarkdown(profileData);
      const updatedProfile = {
        ...profileData,
        id: profileId,
        markdown,
        updatedAt: new Date().toISOString()
      };

      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            // Transform to Supabase format
            const supabaseData = {
              company_name: profileData.companyName,
              industry: profileData.industry,
              size: profileData.size,
              data: profileData,
              markdown,
              status: profileData.status || 'draft'
            };
            
            const supabaseProfile = await ProfileDB.update(profileId, supabaseData, user.id);
            
            // Log the update
            await AuditService.log('UPDATE', 'profile', profileId, null, supabaseProfile);
            
            // If dual-write mode, also update localStorage
            if (this.MIGRATION_CONFIG.dualWriteMode) {
              await this.updateInLocalStorage(profileId, updatedProfile);
            }
            
            return this.transformSupabaseToProfile(supabaseProfile);
          }
        } catch (supabaseError) {
          console.warn('Supabase profile update failed, falling back to localStorage:', supabaseError);
        }
      }

      // Fall back to localStorage
      await this.updateInLocalStorage(profileId, updatedProfile);
      return updatedProfile;
      
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Delete a profile (soft delete)
   * @param {string} profileId - Profile ID
   * @returns {Promise<boolean>} Success status
   */
  static async deleteProfile(profileId) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            await ProfileDB.delete(profileId, user.id);
            
            // Log the deletion
            await AuditService.log('DELETE', 'profile', profileId);
            
            // If dual-write mode, also delete from localStorage
            if (this.MIGRATION_CONFIG.dualWriteMode) {
              await this.deleteFromLocalStorage(profileId);
            }
            
            return true;
          }
        } catch (supabaseError) {
          console.warn('Supabase profile deletion failed, falling back to localStorage:', supabaseError);
        }
      }

      // Fall back to localStorage
      await this.deleteFromLocalStorage(profileId);
      return true;
      
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  /**
   * Search profiles by company name or industry
   * @param {string} searchTerm - Search term
   * @returns {Promise<Array>} Matching profiles
   */
  static async searchProfiles(searchTerm) {
    try {
      // Try Supabase first
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            const supabaseProfiles = await ProfileDB.search(searchTerm, user.id);
            return supabaseProfiles.map(this.transformSupabaseToProfile);
          }
        } catch (supabaseError) {
          console.warn('Supabase search failed, falling back to localStorage:', supabaseError);
        }
      }

      // Fall back to localStorage search
      const localProfiles = this.getFromLocalStorage();
      return localProfiles.filter(profile => 
        profile.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profile.industry?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    } catch (error) {
      console.error('Error searching profiles:', error);
      return [];
    }
  }

  /**
   * Generate AI timeline from profile data with enhanced backend integration
   */
  static async generateTimelineFromProfile(profile) {
    try {
      // Extract business profile data for timeline service
      const businessProfile = this.extractBusinessProfile(profile);
      
      // Determine scenario type based on profile characteristics
      const scenarioType = this.determineScenarioType(profile);
      
      // Use existing timeline service with enhanced context
      const { TimelineService } = await import('./timelineService');
      const timeline = await TimelineService.generateTimeline(businessProfile, scenarioType);
      
      // Store timeline in Supabase if available
      if (this.MIGRATION_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            await this.storeTimelineInSupabase(profile.id, timeline, user.id);
          }
        } catch (error) {
          console.warn('Failed to store timeline in Supabase:', error);
        }
      }
      
      // Enhance timeline with profile-specific insights
      return this.enhanceTimelineWithProfile(timeline, profile);
    } catch (error) {
      console.error('Error generating timeline from profile:', error);
      throw error;
    }
  }

  // ============================================================================
  // MIGRATION UTILITIES
  // ============================================================================

  /**
   * Transform Supabase profile to expected format
   */
  static transformSupabaseToProfile(supabaseProfile) {
    return {
      id: supabaseProfile.id,
      companyName: supabaseProfile.company_name,
      industry: supabaseProfile.industry,
      size: supabaseProfile.size,
      ...supabaseProfile.data,
      markdown: supabaseProfile.markdown,
      status: supabaseProfile.status,
      createdAt: supabaseProfile.created_at,
      updatedAt: supabaseProfile.updated_at
    };
  }

  /**
   * Sync profiles between Supabase and localStorage
   */
  static async syncProfilesWithLocalStorage(supabaseProfiles) {
    try {
      const localProfiles = this.getFromLocalStorage();
      const syncedProfiles = [...supabaseProfiles];

      // Add any local-only profiles to the synced list
      for (const localProfile of localProfiles) {
        const existsInSupabase = supabaseProfiles.find(sp => sp.id === localProfile.id);
        if (!existsInSupabase) {
          syncedProfiles.push(localProfile);
        }
      }

      // Save the synced profiles back to localStorage
      localStorage.setItem('clientProfiles', JSON.stringify(syncedProfiles));
      
    } catch (error) {
      console.warn('Error syncing profiles with localStorage:', error);
    }
  }

  /**
   * Store timeline in Supabase
   */
  static async storeTimelineInSupabase(profileId, timeline, userId) {
    try {
      const { TimelineDB } = await import('./supabaseService');
      await TimelineDB.create({
        profile_id: profileId,
        scenario_type: timeline.scenarioType || 'balanced',
        data: timeline,
        generated_by: 'timeline_service'
      }, userId);
    } catch (error) {
      console.error('Error storing timeline in Supabase:', error);
      throw error;
    }
  }

  // ============================================================================
  // LOCALSTORAGE OPERATIONS (FALLBACK)
  // ============================================================================

  /**
   * Save profile to localStorage
   */
  static async saveToLocalStorage(profile) {
    const profiles = this.getFromLocalStorage();
    profiles.push(profile);
    localStorage.setItem('clientProfiles', JSON.stringify(profiles));
  }

  /**
   * Get profiles from localStorage
   */
  static getFromLocalStorage() {
    try {
      return JSON.parse(localStorage.getItem('clientProfiles') || '[]');
    } catch (error) {
      console.warn('Error reading from localStorage:', error);
      return [];
    }
  }

  /**
   * Update profile in localStorage
   */
  static async updateInLocalStorage(profileId, updatedProfile) {
    const profiles = this.getFromLocalStorage();
    const index = profiles.findIndex(p => p.id === profileId);
    if (index !== -1) {
      profiles[index] = updatedProfile;
      localStorage.setItem('clientProfiles', JSON.stringify(profiles));
    }
  }

  /**
   * Delete profile from localStorage
   */
  static async deleteFromLocalStorage(profileId) {
    const profiles = this.getFromLocalStorage();
    const filteredProfiles = profiles.filter(p => p.id !== profileId);
    localStorage.setItem('clientProfiles', JSON.stringify(filteredProfiles));
  }

  // ============================================================================
  // EXISTING UTILITY METHODS (PRESERVED)
  // ============================================================================

  /**
   * Extract business profile data from client profile
   */
  static extractBusinessProfile(profile) {
    return {
      companyName: profile.companyName,
      industry: profile.industry,
      companySize: this.mapCompanySize(profile.size),
      aiMaturityLevel: this.calculateAIMaturity(profile),
      primaryGoals: this.extractPrimaryGoals(profile),
      currentTechStack: profile.currentTechnology || [],
      budget: this.estimateBudgetRange(profile),
      timeframe: this.extractTimeframe(profile)
    };
  }

  /**
   * Determine AI adoption scenario based on profile characteristics
   */
  static determineScenarioType(profile) {
    const aiReadiness = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    const decisionTimeline = profile.decisionTimeline || 12;
    const riskTolerance = profile.riskTolerance || 'medium';
    
    if (aiReadiness >= 8 && decisionTimeline <= 6 && riskTolerance === 'high') {
      return 'aggressive';
    } else if (aiReadiness <= 4 || decisionTimeline >= 18 || riskTolerance === 'low') {
      return 'conservative';
    }
    return 'balanced';
  }

  /**
   * Enhanced timeline with profile-specific context
   */
  static enhanceTimelineWithProfile(timeline, profile) {
    // Add profile-specific insights to each phase
    if (timeline.phases) {
      timeline.phases = timeline.phases.map((phase, index) => ({
        ...phase,
        profileInsights: this.getPhaseInsights(profile, index),
        specificOpportunities: this.getPhaseOpportunities(profile, index)
      }));
    }
    
    // Add risk factors based on profile
    timeline.riskFactors = this.identifyRiskFactors(profile);
    
    // Add competitive insights
    timeline.competitiveContext = this.getCompetitiveContext(profile);
    
    return timeline;
  }

  /**
   * Generate unique profile ID
   */
  static generateProfileId(companyName) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8); // 6 random characters
    const nameSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
    return `${nameSlug}-${timestamp}-${random}`;
  }

  /**
   * Map company size to standard format
   */
  static mapCompanySize(size) {
    const mapping = {
      '1-50 employees': 'startup',
      '51-200 employees': 'small',
      '201-1000 employees': 'medium',
      '1000+ employees': 'large'
    };
    return mapping[size] || 'medium';
  }

  /**
   * Calculate AI maturity level
   */
  static calculateAIMaturity(profile) {
    const score = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    if (score <= 3) return 'beginner';
    if (score <= 6) return 'emerging';
    if (score <= 8) return 'developing';
    return 'advanced';
  }

  /**
   * Extract primary business goals
   */
  static extractPrimaryGoals(profile) {
    const goals = [];
    if (profile.businessIssue?.revenueGrowth) goals.push('Increase Revenue');
    if (profile.businessIssue?.costReduction) goals.push('Reduce Operational Costs');
    if (profile.businessIssue?.customerExperience) goals.push('Improve Customer Experience');
    if (profile.businessIssue?.operationalEfficiency) goals.push('Automate Workflows');
    return goals;
  }

  /**
   * Estimate budget range based on profile
   */
  static estimateBudgetRange(profile) {
    const budget = profile.valueSellingFramework?.decisionMakers?.economicBuyer?.budget;
    if (budget) {
      return budget;
    }
    
    // Estimate based on company size and impact
    const impact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
    if (impact > 5000000) return '>5m';
    if (impact > 1000000) return '1m-5m';
    if (impact > 500000) return '500k-1m';
    if (impact > 100000) return '100k-500k';
    return '<100k';
  }

  /**
   * Extract timeframe from profile
   */
  static extractTimeframe(profile) {
    const timeline = profile.valueSellingFramework?.buyingProcess?.timeline;
    if (timeline) {
      const months = parseInt(timeline);
      if (months <= 3) return '3months';
      if (months <= 6) return '6months';
      if (months <= 12) return '1year';
      return '2years+';
    }
    return '1year'; // Default
  }

  /**
   * Get phase-specific insights based on profile
   */
  static getPhaseInsights(profile, phaseIndex) {
    const insights = {
      0: `Focus on ${profile.primaryBusinessIssue} while building foundation`,
      1: `Address ${profile.topProblem} with targeted automation`,
      2: `Scale successful pilots across ${profile.size} organization`,
      3: `Optimize for ${profile.successMetrics?.join(', ')} improvements`
    };
    
    return insights[phaseIndex] || 'Continue systematic AI adoption';
  }

  /**
   * Get phase-specific opportunities
   */
  static getPhaseOpportunities(profile, phaseIndex) {
    // Implementation for phase-specific opportunities
    return [];
  }

  /**
   * Identify risk factors from profile
   */
  static identifyRiskFactors(profile) {
    const risks = [];
    const aiReadiness = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    
    if (aiReadiness < 4) {
      risks.push({
        type: 'Technical Readiness',
        level: 'High',
        description: 'Low AI readiness score may slow implementation'
      });
    }
    
    if (profile.changeManagementCapability === 'Low') {
      risks.push({
        type: 'Change Management',
        level: 'Medium',
        description: 'Limited change management capability requires extra support'
      });
    }
    
    return risks;
  }

  /**
   * Get competitive context
   */
  static getCompetitiveContext(profile) {
    return {
      urgency: profile.competitivePressure ? 'High' : 'Medium',
      differentiators: profile.differentiationRequirements || [],
      marketPosition: profile.industry === 'Technology' ? 'Fast-moving' : 'Traditional'
    };
  }
} 