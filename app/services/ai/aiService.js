/**
 * AI Service
 * 
 * Main AI service orchestrator that provides a unified interface for AI operations.
 * Follows patterns from ProfileService with Supabase integration and localStorage fallback.
 * Handles provider management, failover, usage tracking, and conversation management.
 */

import { BaseProvider } from './providers/baseProvider';

// Dynamic import to handle Supabase dependency gracefully
let supabaseService = null;

export class AIService {
  constructor(config = {}) {
    // Service configuration with defaults
    this.config = {
      defaultProvider: 'openai',
      fallbackEnabled: true,
      maxRetries: 3,
      cacheEnabled: true,
      cacheTTL: 3600000, // 1 hour in milliseconds
      healthCheckInterval: 300000, // 5 minutes
      ...config
    };
    
    // Validate configuration
    this.validateConfig(this.config);
    
    // Provider registry
    this.providers = {};
    
    // Usage tracking across all providers
    this.globalUsageStats = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      providerStats: {}
    };
    
    // Simple in-memory cache (could be enhanced with Redis in production)
    this.cache = new Map();
    
    // Health status tracking
    this.providerHealth = {};
    
    // Initialize Supabase service
    this.initializeSupabase();
  }

  /**
   * Initialize Supabase service with graceful fallback
   */
  async initializeSupabase() {
    try {
      const { supabaseService: sbService } = await import('../supabaseService');
      supabaseService = sbService;
    } catch (error) {
      console.warn('Supabase service not available, using localStorage fallback:', error.message);
    }
  }

  /**
   * Validate service configuration
   * @param {Object} config - Configuration object
   */
  validateConfig(config) {
    if (config.defaultProvider !== undefined && typeof config.defaultProvider !== 'string') {
      throw new Error('defaultProvider must be a string');
    }
    
    if (config.maxRetries !== undefined && (!Number.isInteger(config.maxRetries) || config.maxRetries < 0)) {
      throw new Error('maxRetries must be a non-negative integer');
    }
    
    if (config.cacheTTL !== undefined && (!Number.isInteger(config.cacheTTL) || config.cacheTTL < 0)) {
      throw new Error('cacheTTL must be a non-negative integer');
    }
  }

  /**
   * Register an AI provider
   * @param {string} name - Provider name
   * @param {BaseProvider} provider - Provider instance
   */
  registerProvider(name, provider) {
    if (!(provider instanceof BaseProvider)) {
      throw new Error('Provider must extend BaseProvider');
    }
    
    this.providers[name] = provider;
    this.globalUsageStats.providerStats[name] = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0
    };
    
    console.log(`AI Provider '${name}' registered successfully`);
  }

  /**
   * Get available provider names
   * @returns {string[]} Array of provider names
   */
  getAvailableProviders() {
    return Object.keys(this.providers);
  }

  /**
   * Check if a provider is available
   * @param {string} name - Provider name
   * @returns {boolean} True if provider is available
   */
  isProviderAvailable(name) {
    return name in this.providers;
  }

  /**
   * Get a provider instance
   * @param {string} name - Provider name
   * @returns {BaseProvider|null} Provider instance or null
   */
  getProvider(name) {
    return this.providers[name] || null;
  }

  /**
   * Update service configuration
   * @param {Object} newConfig - New configuration values
   */
  updateConfig(newConfig) {
    this.validateConfig(newConfig);
    this.config = { ...this.config, ...newConfig };
  }

  /**
   * Get current configuration
   * @returns {Object} Current configuration
   */
  getConfig() {
    return { ...this.config };
  }

  /**
   * Generate AI completion - main interface method
   * @param {Array} messages - Array of message objects
   * @param {Object} options - Generation options
   * @returns {Promise<Object>} Response object with content, tokens, etc.
   */
  async generateCompletion(messages, options = {}) {
    try {
      // Validate input
      this.validateMessages(messages);
      
      if (!messages || messages.length === 0) {
        throw new Error('Messages array cannot be empty');
      }
      
      // Handle legacy options format (max_tokens -> maxTokens)
      const normalizedOptions = this.normalizeOptions(options);
      
      // Check cache first if enabled
      if (normalizedOptions.useCache) {
        const cachedResponse = this.getCachedResponse(messages, normalizedOptions);
        if (cachedResponse) {
          return { ...cachedResponse, fromCache: true };
        }
      }
      
      // Determine provider to use
      const providerName = normalizedOptions.provider || this.config.defaultProvider;
      
      let response;
      let usedFallback = false;
      
      try {
        response = await this.callProvider(providerName, messages, normalizedOptions);
      } catch (error) {
        // Try fallback if enabled and original provider failed
        if (this.config.fallbackEnabled && !normalizedOptions.provider) {
          const fallbackProvider = this.findFallbackProvider(providerName);
          if (fallbackProvider) {
            console.warn(`Primary provider '${providerName}' failed, falling back to '${fallbackProvider}'`);
            response = await this.callProvider(fallbackProvider, messages, normalizedOptions);
            usedFallback = true;
          } else {
            throw error;
          }
        } else {
          throw error;
        }
      }
      
      // Add conversation management
      const conversationData = await this.manageConversation(messages, response, normalizedOptions);
      
      // Update global usage stats
      this.updateGlobalUsageStats(response);
      
      // Cache response if enabled
      if (normalizedOptions.useCache) {
        this.cacheResponse(messages, normalizedOptions, response);
      }
      
      // Return enhanced response
      return {
        ...response,
        conversationId: conversationData.conversationId,
        profileId: normalizedOptions.profileId,
        usedFallback,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  /**
   * Call a specific provider with error handling
   * @param {string} providerName - Provider name
   * @param {Array} messages - Messages array
   * @param {Object} options - Options object
   * @returns {Promise<Object>} Provider response
   */
  async callProvider(providerName, messages, options) {
    const provider = this.getProvider(providerName);
    
    if (!provider) {
      if (Object.keys(this.providers).length === 0) {
        throw new Error('No AI providers available');
      }
      throw new Error(`Provider '${providerName}' not found`);
    }
    
    const startTime = Date.now();
    
    try {
      const response = await provider.generateCompletion(messages, options);
      
      // Update health status
      this.updateProviderHealth(providerName, {
        status: 'healthy',
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString()
      });
      
      return response;
      
    } catch (error) {
      // Update health status
      this.updateProviderHealth(providerName, {
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString()
      });
      
      throw error;
    }
  }

  /**
   * Find an available fallback provider
   * @param {string} excludeProvider - Provider to exclude
   * @returns {string|null} Fallback provider name or null
   */
  findFallbackProvider(excludeProvider) {
    const availableProviders = this.getAvailableProviders().filter(name => name !== excludeProvider);
    
    // Prefer healthy providers
    const healthyProviders = availableProviders.filter(name => 
      this.providerHealth[name]?.status === 'healthy'
    );
    
    if (healthyProviders.length > 0) {
      return healthyProviders[0];
    }
    
    // Fall back to any available provider
    return availableProviders[0] || null;
  }

  /**
   * Manage conversation creation and updates
   * @param {Array} messages - Messages array
   * @param {Object} response - AI response
   * @param {Object} options - Options object
   * @returns {Promise<Object>} Conversation data
   */
  async manageConversation(messages, response, options) {
    const conversationData = {
      conversationId: options.conversationId || this.generateConversationId(),
      profileId: options.profileId || null,
      messages,
      response,
      provider: response.provider,
      tokens: response.tokens,
      cost: this.calculateResponseCost(response),
      timestamp: new Date().toISOString()
    };
    
    try {
      // Try Supabase first
      if (supabaseService?.AIConversationDB) {
        if (options.conversationId) {
          // Update existing conversation
          await supabaseService.AIConversationDB.updateConversation(
            options.conversationId,
            {
              output_data: response,
              tokens_used: response.tokens?.total || 0,
              cost_usd: conversationData.cost,
              updated_at: new Date().toISOString()
            }
          );
        } else {
          // Create new conversation
          const dbConversation = await supabaseService.AIConversationDB.createConversation({
            profile_id: options.profileId,
            provider: response.provider,
            conversation_type: options.conversationType || 'completion',
            input_data: { messages },
            output_data: response,
            tokens_used: response.tokens?.total || 0,
            cost_usd: conversationData.cost,
            duration_ms: response.duration || 0
          });
          
          conversationData.conversationId = dbConversation.id;
        }
      }
    } catch (error) {
      console.warn('Failed to save conversation to Supabase, using localStorage:', error.message);
    }
    
    // Always save to localStorage as backup
    this.saveConversationToLocalStorage(conversationData);
    
    return conversationData;
  }

  /**
   * Get conversation history for a profile
   * @param {string} profileId - Profile ID
   * @returns {Promise<Array>} Array of conversations
   */
  async getConversationHistory(profileId) {
    try {
      // Try Supabase first
      if (supabaseService?.AIConversationDB) {
        const conversations = await supabaseService.AIConversationDB.getConversations({
          profile_id: profileId
        });
        return conversations;
      }
    } catch (error) {
      console.warn('Failed to fetch conversations from Supabase, using localStorage:', error.message);
    }
    
    // Fallback to localStorage
    return this.getConversationsFromLocalStorage(profileId);
  }

  /**
   * Check provider health
   * @param {string} providerName - Provider name
   * @returns {Promise<Object>} Health status
   */
  async checkProviderHealth(providerName) {
    const provider = this.getProvider(providerName);
    
    if (!provider) {
      return {
        provider: providerName,
        status: 'not_found',
        error: 'Provider not registered'
      };
    }
    
    const startTime = Date.now();
    
    try {
      // Test with simple health check message
      const testMessages = [{ role: 'user', content: 'Health check' }];
      await provider.generateCompletion(testMessages, { maxTokens: 10 });
      
      const responseTime = Date.now() - startTime;
      
      const healthStatus = {
        provider: providerName,
        status: 'healthy',
        responseTime,
        lastCheck: new Date().toISOString()
      };
      
      this.updateProviderHealth(providerName, healthStatus);
      return healthStatus;
      
    } catch (error) {
      const healthStatus = {
        provider: providerName,
        status: 'unhealthy',
        error: error.message,
        responseTime: Date.now() - startTime,
        lastCheck: new Date().toISOString()
      };
      
      this.updateProviderHealth(providerName, healthStatus);
      return healthStatus;
    }
  }

  /**
   * Get health status for all providers
   * @returns {Promise<Object>} Health report for all providers
   */
  async getProvidersHealth() {
    const healthReport = {};
    
    for (const providerName of this.getAvailableProviders()) {
      healthReport[providerName] = await this.checkProviderHealth(providerName);
    }
    
    return healthReport;
  }

  /**
   * Get usage statistics
   * @returns {Object} Usage statistics
   */
  getUsageStats() {
    return {
      ...this.globalUsageStats,
      providers: Object.keys(this.providers).reduce((acc, name) => {
        const provider = this.providers[name];
        acc[name] = provider.getUsageStats();
        return acc;
      }, {})
    };
  }

  /**
   * Get usage statistics for a specific provider
   * @param {string} providerName - Provider name
   * @returns {Object} Provider usage statistics
   */
  getProviderUsage(providerName) {
    const provider = this.getProvider(providerName);
    return provider ? provider.getUsageStats() : null;
  }

  /**
   * Reset usage statistics
   */
  resetUsageStats() {
    this.globalUsageStats = {
      totalRequests: 0,
      totalTokens: 0,
      totalCost: 0,
      providerStats: Object.keys(this.providers).reduce((acc, name) => {
        acc[name] = {
          totalRequests: 0,
          totalTokens: 0,
          totalCost: 0
        };
        return acc;
      }, {})
    };
    
    // Reset individual provider stats
    Object.values(this.providers).forEach(provider => {
      provider.resetUsageStats();
    });
  }

  // Helper methods

  /**
   * Validate messages array
   * @param {Array} messages - Messages to validate
   */
  validateMessages(messages) {
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }
    
    for (const message of messages) {
      if (!message.role || !message.content) {
        throw new Error('Invalid message format: missing role or content');
      }
    }
  }

  /**
   * Normalize options format (handle legacy formats)
   * @param {Object} options - Raw options
   * @returns {Object} Normalized options
   */
  normalizeOptions(options) {
    const normalized = { ...options };
    
    // Convert snake_case to camelCase for backward compatibility
    if (options.max_tokens) {
      normalized.maxTokens = options.max_tokens;
      delete normalized.max_tokens;
    }
    
    return normalized;
  }

  /**
   * Generate conversation ID
   * @returns {string} Unique conversation ID
   */
  generateConversationId() {
    return `conv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate response cost
   * @param {Object} response - AI response
   * @returns {number} Cost in USD
   */
  calculateResponseCost(response) {
    if (!response.tokens) return 0;
    
    const provider = this.getProvider(response.provider);
    return provider ? provider.calculateCost(response.tokens, response.model) : 0;
  }

  /**
   * Update global usage statistics
   * @param {Object} response - AI response
   */
  updateGlobalUsageStats(response) {
    this.globalUsageStats.totalRequests++;
    
    if (response.tokens) {
      this.globalUsageStats.totalTokens += response.tokens.total || 0;
      this.globalUsageStats.totalCost += this.calculateResponseCost(response);
    }
    
    const providerStats = this.globalUsageStats.providerStats[response.provider];
    if (providerStats) {
      providerStats.totalRequests++;
      providerStats.totalTokens += response.tokens?.total || 0;
      providerStats.totalCost += this.calculateResponseCost(response);
    }
  }

  /**
   * Update provider health status
   * @param {string} providerName - Provider name
   * @param {Object} healthData - Health data
   */
  updateProviderHealth(providerName, healthData) {
    this.providerHealth[providerName] = healthData;
  }

  /**
   * Cache management methods
   */
  generateCacheKey(messages, options) {
    if (options.cacheKey) return options.cacheKey;
    
    const key = JSON.stringify({
      messages,
      provider: options.provider,
      temperature: options.temperature,
      maxTokens: options.maxTokens
    });
    
    return `ai_cache_${this.hashString(key)}`;
  }

  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  getCachedResponse(messages, options) {
    if (!this.config.cacheEnabled) return null;
    
    const cacheKey = this.generateCacheKey(messages, options);
    const cached = this.cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
      return cached.response;
    }
    
    return null;
  }

  cacheResponse(messages, options, response) {
    if (!this.config.cacheEnabled) return;
    
    const cacheKey = this.generateCacheKey(messages, options);
    this.cache.set(cacheKey, {
      response,
      timestamp: Date.now()
    });
  }

  /**
   * LocalStorage fallback methods
   */
  saveConversationToLocalStorage(conversationData) {
    try {
      const key = `ai_conversations_${conversationData.profileId || 'global'}`;
      const existing = JSON.parse(localStorage.getItem(key) || '[]');
      existing.push(conversationData);
      
      // Keep only last 100 conversations per profile
      if (existing.length > 100) {
        existing.splice(0, existing.length - 100);
      }
      
      localStorage.setItem(key, JSON.stringify(existing));
    } catch (error) {
      console.warn('Failed to save conversation to localStorage:', error);
    }
  }

  getConversationsFromLocalStorage(profileId) {
    try {
      const key = `ai_conversations_${profileId || 'global'}`;
      return JSON.parse(localStorage.getItem(key) || '[]');
    } catch (error) {
      console.warn('Failed to load conversations from localStorage:', error);
      return [];
    }
  }
} 