/**
 * Base AI Provider
 * 
 * Abstract base class that defines the unified interface for all AI providers.
 * Provides common functionality for error handling, retry logic, usage tracking,
 * and request validation.
 */

export class BaseProvider {
  constructor(config = {}) {
    // Validate required configuration
    this.validateRequiredConfig(config);
    
    // Set provider configuration with defaults
    this.config = {
      timeout: 30000,        // 30 seconds
      maxRetries: 3,         // Maximum retry attempts
      retryDelay: 1000,      // Base delay between retries (ms)
      maxTokens: 4000,       // Default max tokens
      temperature: 0.7,      // Default temperature
      ...config
    };
    
    // Provider identification
    this.name = config.name;
    
    // Usage tracking
    this.usageStats = {
      totalRequests: 0,
      totalTokens: 0,
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalCost: 0
    };
    
    // Validate full configuration
    this.validateConfig(this.config);
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
      
      // Merge options with defaults
      const finalOptions = {
        temperature: this.config.temperature,
        maxTokens: this.config.maxTokens,
        ...options
      };
      
      // Make request with retry logic
      const response = await this.makeRequestWithRetry(messages, finalOptions);
      
      // Track usage
      this.trackUsage(response);
      
      return response;
      
    } catch (error) {
      // Sanitize error messages to remove API keys
      const sanitizedError = this.sanitizeError(error);
      throw sanitizedError;
    }
  }

  /**
   * Make request with retry logic
   * @param {Array} messages - Message array
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Response object
   */
  async makeRequestWithRetry(messages, options) {
    let lastError;
    
    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const response = await this._makeRequest(messages, options);
        
        // Validate response format
        this.validateResponse(response);
        
        return response;
        
      } catch (error) {
        lastError = error;
        
        // Don't retry on validation errors or client errors (4xx)
        if (this.isNonRetryableError(error)) {
          throw error;
        }
        
        // Don't retry on final attempt
        if (attempt === this.config.maxRetries) {
          const maxRetriesError = new Error(`Max retries exceeded: ${error.message}`);
          maxRetriesError.originalError = error;
          throw maxRetriesError;
        }
        
        // Wait before retrying with exponential backoff
        const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
        await this.sleep(delay);
      }
    }
    
    throw lastError;
  }

  /**
   * Abstract method - must be implemented by concrete providers
   * @param {Array} messages - Message array
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Raw provider response
   */
  async _makeRequest(messages, options) {
    throw new Error('_makeRequest must be implemented by provider');
  }

  /**
   * Validate required configuration parameters
   * @param {Object} config - Configuration object
   */
  validateRequiredConfig(config) {
    if (!config.name) {
      throw new Error('Provider name is required');
    }
    
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
  }

  /**
   * Validate full configuration
   * @param {Object} config - Configuration object
   */
  validateConfig(config) {
    // Validate baseUrl format if provided
    if (config.baseUrl) {
      try {
        new URL(config.baseUrl);
      } catch (error) {
        throw new Error('Invalid baseUrl format');
      }
    }
    
    // Validate timeout
    if (config.timeout && config.timeout <= 0) {
      throw new Error('Timeout must be positive');
    }
    
    // Validate temperature range
    if (config.temperature && (config.temperature < 0 || config.temperature > 2)) {
      throw new Error('Temperature must be between 0 and 2');
    }
    
    // Validate maxTokens
    if (config.maxTokens && config.maxTokens <= 0) {
      throw new Error('maxTokens must be positive');
    }
  }

  /**
   * Validate message array structure
   * @param {Array} messages - Array of message objects
   */
  validateMessages(messages) {
    if (!Array.isArray(messages)) {
      throw new Error('Messages must be an array');
    }
    
    const validRoles = ['system', 'user', 'assistant'];
    
    for (const message of messages) {
      if (!message.role) {
        throw new Error('Invalid message format: missing role');
      }
      
      if (!validRoles.includes(message.role)) {
        throw new Error(`Invalid message role: ${message.role}`);
      }
      
      if (!message.content) {
        throw new Error('Message content is required');
      }
      
      if (typeof message.content !== 'string') {
        throw new Error('Message content must be a string');
      }
    }
  }

  /**
   * Validate response object structure
   * @param {Object} response - Response from provider
   */
  validateResponse(response) {
    if (!response) {
      throw new Error('Provider returned null/undefined response');
    }
    
    if (!response.content) {
      throw new Error('Provider response missing content');
    }
    
    if (!response.tokens) {
      throw new Error('Provider response missing token information');
    }
    
    if (!response.model) {
      throw new Error('Provider response missing model information');
    }
    
    if (!response.provider) {
      throw new Error('Provider response missing provider information');
    }
  }

  /**
   * Check if error should not be retried
   * @param {Error} error - Error object
   * @returns {boolean} True if error should not be retried
   */
  isNonRetryableError(error) {
    // Don't retry validation errors
    if (error.message.includes('Invalid message') || 
        error.message.includes('validation') ||
        error.message.includes('format')) {
      return true;
    }
    
    // Don't retry client errors (4xx) except rate limiting (429)
    if (error.status >= 400 && error.status < 500 && error.status !== 429) {
      return true;
    }
    
    return false;
  }

  /**
   * Sanitize error messages to remove sensitive information
   * @param {Error} error - Original error
   * @returns {Error} Sanitized error
   */
  sanitizeError(error) {
    let message = error.message;
    
    // Remove API key from error messages
    if (this.config.apiKey) {
      const regex = new RegExp(this.config.apiKey, 'g');
      message = message.replace(regex, '[REDACTED]');
    }
    
    // Create new error with sanitized message
    const sanitizedError = new Error(message);
    sanitizedError.name = error.name;
    sanitizedError.status = error.status;
    sanitizedError.originalError = error;
    
    return sanitizedError;
  }

  /**
   * Track usage statistics
   * @param {Object} response - Provider response
   */
  trackUsage(response) {
    if (response.tokens) {
      this.usageStats.totalRequests++;
      this.usageStats.totalTokens += response.tokens.total || 0;
      this.usageStats.totalPromptTokens += response.tokens.prompt || 0;
      this.usageStats.totalCompletionTokens += response.tokens.completion || 0;
      
      // Calculate cost based on provider pricing
      const cost = this.calculateCost(response.tokens, response.model);
      this.usageStats.totalCost += cost;
    }
  }

  /**
   * Calculate cost for tokens used
   * @param {Object} tokens - Token usage object
   * @param {String} model - Model used
   * @returns {number} Cost in USD
   */
  calculateCost(tokens, model) {
    // Default pricing - should be overridden by specific providers
    const defaultPricing = {
      prompt: 0.0015 / 1000,    // $0.0015 per 1K tokens
      completion: 0.002 / 1000  // $0.002 per 1K tokens
    };
    
    const promptCost = (tokens.prompt || 0) * defaultPricing.prompt;
    const completionCost = (tokens.completion || 0) * defaultPricing.completion;
    
    return promptCost + completionCost;
  }

  /**
   * Get current usage statistics
   * @returns {Object} Usage stats object
   */
  getUsageStats() {
    return { ...this.usageStats };
  }

  /**
   * Reset usage statistics
   */
  resetUsageStats() {
    this.usageStats = {
      totalRequests: 0,
      totalTokens: 0,
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalCost: 0
    };
  }

  /**
   * Sleep utility for retry delays
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise} Promise that resolves after delay
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get provider information
   * @returns {Object} Provider info
   */
  getProviderInfo() {
    return {
      name: this.name,
      config: {
        timeout: this.config.timeout,
        maxRetries: this.config.maxRetries,
        retryDelay: this.config.retryDelay,
        maxTokens: this.config.maxTokens,
        temperature: this.config.temperature
        // Don't expose API key or other sensitive data
      },
      usageStats: this.getUsageStats()
    };
  }
} 