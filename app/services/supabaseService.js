'use client';

import { createClient } from '@supabase/supabase-js';

/**
 * Supabase Service Layer
 * 
 * Core service for all database operations, authentication, and real-time features.
 * Implements the foundation for AI-native, enterprise-ready architecture.
 */

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only check environment variables in non-test environments
if (!supabaseUrl || !supabaseAnonKey) {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error(
      'Missing Supabase environment variables. Please check your .env.local file.'
    );
  }
}

// Create Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

/**
 * Database service for client profiles
 */
export class ProfileDB {
  /**
   * Create a new client profile
   */
  static async create(profileData, userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .insert([
          {
            user_id: userId,
            company_name: profileData.companyName,
            industry: profileData.industry,
            size: profileData.size,
            data: profileData,
            markdown: profileData.markdown,
            status: 'draft',
            created_by: userId,
            updated_by: userId
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Get all profiles for a user
   */
  static async getAll(userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching profiles:', error);
      throw error;
    }
  }

  /**
   * Get a specific profile by ID
   */
  static async getById(profileId, userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', profileId)
        .eq('user_id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  /**
   * Update a profile
   */
  static async update(profileId, profileData, userId) {
    try {
      // First, create a version entry for audit trail
      const currentProfile = await this.getById(profileId, userId);
      if (currentProfile) {
        await ProfileVersionDB.create(profileId, currentProfile, userId);
      }

      // Update the profile
      const { data, error } = await supabase
        .from('profiles')
        .update({
          company_name: profileData.companyName,
          industry: profileData.industry,
          size: profileData.size,
          data: profileData,
          markdown: profileData.markdown,
          updated_at: new Date().toISOString(),
          updated_by: userId
        })
        .eq('id', profileId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  /**
   * Delete a profile (soft delete)
   */
  static async delete(profileId, userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ status: 'deleted' })
        .eq('id', profileId)
        .eq('user_id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error deleting profile:', error);
      throw error;
    }
  }

  /**
   * Search profiles by company name or industry
   */
  static async search(searchTerm, userId) {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .or(`company_name.ilike.%${searchTerm}%,industry.ilike.%${searchTerm}%`)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error searching profiles:', error);
      throw error;
    }
  }
}

/**
 * Database service for profile versions (audit trail)
 */
export class ProfileVersionDB {
  /**
   * Create a version entry
   */
  static async create(profileId, profileData, userId) {
    try {
      // Get the current version number
      const { data: versions } = await supabase
        .from('profile_versions')
        .select('version_number')
        .eq('profile_id', profileId)
        .order('version_number', { ascending: false })
        .limit(1);

      const nextVersion = (versions?.[0]?.version_number || 0) + 1;

      const { data, error } = await supabase
        .from('profile_versions')
        .insert([
          {
            profile_id: profileId,
            version_number: nextVersion,
            data: profileData.data || profileData,
            changes: `Version ${nextVersion} created`,
            created_by: userId
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating profile version:', error);
      throw error;
    }
  }

  /**
   * Get version history for a profile
   */
  static async getHistory(profileId, userId) {
    try {
      const { data, error } = await supabase
        .from('profile_versions')
        .select('*')
        .eq('profile_id', profileId)
        .order('version_number', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching profile history:', error);
      throw error;
    }
  }
}

/**
 * Database service for AI conversations and usage tracking
 */
export class AIConversationDB {
  /**
   * Log an AI conversation
   */
  static async create(conversationData) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .insert([conversationData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging AI conversation:', error);
      throw error;
    }
  }

  /**
   * Get AI usage statistics for a profile
   */
  static async getUsageStats(profileId) {
    try {
      const { data, error } = await supabase
        .from('ai_conversations')
        .select('provider, tokens_used, cost_usd, conversation_type')
        .eq('profile_id', profileId);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching AI usage stats:', error);
      throw error;
    }
  }
}

/**
 * Database service for timelines
 */
export class TimelineDB {
  /**
   * Create a timeline
   */
  static async create(timelineData, userId) {
    try {
      console.log('TimelineDB.create called with:', {
        profile_id: timelineData.profile_id,
        scenario_type: timelineData.scenario_type,
        userId: userId,
        dataKeys: Object.keys(timelineData.data || {})
      });

      // Only include fields that exist in the database schema
      const { data, error } = await supabase
        .from('timelines')
        .insert([
          {
            profile_id: timelineData.profile_id,
            scenario_type: timelineData.scenario_type,
            data: timelineData.data,
            generated_by: timelineData.generated_by,
            cost_usd: timelineData.cost_usd || null,
            created_by: userId
          }
        ])
        .select()
        .single();

      if (error) {
        console.error('Supabase timeline creation error:', error);
        throw error;
      }
      
      console.log('Timeline created successfully in Supabase:', data.id);
      return data;
    } catch (error) {
      console.error('Error creating timeline in Supabase:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        error: error
      });
      throw error;
    }
  }

  /**
   * Get timelines for a profile
   */
  static async getByProfile(profileId) {
    try {
      const { data, error } = await supabase
        .from('timelines')
        .select('*')
        .eq('profile_id', profileId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching timelines:', error);
      throw error;
    }
  }
}

/**
 * Authentication helper functions
 */
export class AuthService {
  /**
   * Get current user
   */
  static async getCurrentUser() {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  }

  /**
   * Sign in with email and password
   */
  static async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    }
  }

  /**
   * Sign up with email and password
   */
  static async signUp(email, password, metadata = {}) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      });
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error signing up:', error);
      throw error;
    }
  }

  /**
   * Sign out
   */
  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  }

  /**
   * Listen to auth state changes
   */
  static onAuthStateChange(callback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

/**
 * Audit logging service
 */
export class AuditService {
  /**
   * Log an action
   */
  static async log(action, resourceType, resourceId, oldData = null, newData = null) {
    try {
      const user = await AuthService.getCurrentUser();
      
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([
          {
            user_id: user?.id,
            action,
            resource_type: resourceType,
            resource_id: resourceId,
            old_data: oldData,
            new_data: newData,
            ip_address: null, // Will be set by RLS policy if needed
            user_agent: navigator?.userAgent
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error logging audit entry:', error);
      // Don't throw - audit logging should be non-blocking
    }
  }
}

/**
 * Feature flags service
 */
export class FeatureService {
  /**
   * Check if a feature is enabled for the current user
   */
  static async isEnabled(featureName) {
    try {
      const user = await AuthService.getCurrentUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from('user_features')
        .select('enabled, features(enabled)')
        .eq('user_id', user.id)
        .eq('features.feature_name', featureName)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      
      // Check user-specific setting first, then global feature setting
      return data?.enabled ?? data?.features?.enabled ?? false;
    } catch (error) {
      console.error('Error checking feature flag:', error);
      return false;
    }
  }

  /**
   * Enable a feature for a user
   */
  static async enableForUser(featureName, userId) {
    try {
      const { data, error } = await supabase
        .from('user_features')
        .upsert([
          {
            user_id: userId,
            feature_id: featureName,
            enabled: true
          }
        ])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error enabling feature for user:', error);
      throw error;
    }
  }
}

/**
 * Real-time subscriptions
 */
export class RealtimeService {
  /**
   * Subscribe to profile changes
   */
  static subscribeToProfiles(userId, callback) {
    return supabase
      .channel('profiles')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'profiles',
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Subscribe to timeline changes
   */
  static subscribeToTimelines(profileId, callback) {
    return supabase
      .channel('timelines')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'timelines',
          filter: `profile_id=eq.${profileId}`
        },
        callback
      )
      .subscribe();
  }

  /**
   * Unsubscribe from a channel
   */
  static unsubscribe(subscription) {
    return supabase.removeChannel(subscription);
  }
}

// Export the main client for direct use when needed
export default supabase; 