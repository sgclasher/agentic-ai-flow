/**
 * Anthropic Provider
 * 
 * Concrete implementation of the AI provider interface for Anthropic Claude models.
 * Handles Anthropic-specific API calls, model management, cost calculation, and features.
 */

import { BaseProvider } from './baseProvider';

export class AnthropicProvider extends BaseProvider {
  constructor(config = {}) {
    const defaultConfig = {
      name: 'anthropic',
      baseUrl: 'https://api.anthropic.com/v1',
      model: 'claude-3.7-sonnet',
      temperature: 0.7,
      maxTokens: 4000,
      timeout: 30000,
      ...config
    };

    super(defaultConfig);

    // Anthropic-specific model configurations (May 2025)
    this.modelConfigs = {
      // Claude 4 - Latest generation (May 2025)
      'claude-4-opus': {
        name: 'claude-4-opus-20250522',
        maxTokens: 64000,
        inputCost: 15.00,        // per 1M tokens
        outputCost: 75.00,       // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'premium'
      },

      'claude-4-sonnet': {
        name: 'claude-4-sonnet-20250522',
        maxTokens: 32000,
        inputCost: 3.00,         // per 1M tokens
        outputCost: 15.00,       // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      // Claude 3.7 - Current production model
      'claude-3.7-sonnet': {
        name: 'claude-3-7-sonnet-20250219',
        maxTokens: 64000,
        inputCost: 3.00,         // per 1M tokens
        outputCost: 15.00,       // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      // Claude 3.5 models
      'claude-3.5-sonnet': {
        name: 'claude-3-5-sonnet-20241022',
        maxTokens: 8000,
        inputCost: 3.00,         // per 1M tokens
        outputCost: 15.00,       // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      'claude-3.5-haiku': {
        name: 'claude-3-5-haiku-20241022',
        maxTokens: 8000,
        inputCost: 0.80,         // per 1M tokens
        outputCost: 4.00,        // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'budget'
      },

      // Claude 3 models (legacy but still supported)
      'claude-3-opus': {
        name: 'claude-3-opus-20240229',
        maxTokens: 4000,
        inputCost: 15.00,        // per 1M tokens
        outputCost: 75.00,       // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'legacy'
      },

      'claude-3-haiku': {
        name: 'claude-3-haiku-20240307',
        maxTokens: 4000,
        inputCost: 0.25,         // per 1M tokens
        outputCost: 1.25,        // per 1M tokens
        contextWindow: 200000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'legacy'
      }
    };
  }

  /**
   * Get available Anthropic models
   * @returns {string[]} Array of model names
   */
  getAvailableModels() {
    return Object.keys(this.modelConfigs);
  }

  /**
   * Check if a model is available
   * @param {string} model - Model name
   * @returns {boolean} True if model is available
   */
  isModelAvailable(model) {
    return model in this.modelConfigs;
  }

  /**
   * Get model information
   * @param {string} model - Model name
   * @returns {Object|null} Model configuration or null
   */
  getModelInfo(model) {
    return this.modelConfigs[model] || null;
  }

  /**
   * Calculate cost for Anthropic models
   * @param {Object} tokens - Token usage object
   * @param {string} model - Model name
   * @param {Object} options - Cost calculation options
   * @returns {number} Cost in USD
   */
  calculateCost(tokens, model, options = {}) {
    if (!tokens || !model) return 0;

    const modelConfig = this.modelConfigs[model];
    if (!modelConfig) return 0;

    const inputTokens = tokens.prompt || 0;
    const outputTokens = tokens.completion || 0;

    // Calculate costs (per 1M tokens)
    const inputCost = inputTokens * modelConfig.inputCost / 1000000;
    const outputCost = outputTokens * modelConfig.outputCost / 1000000;

    // Apply prompt caching discount if available (up to 90% for cache hits)
    const cacheDiscount = options.promptCaching ? 0.1 : 1.0; // 90% discount for cached
    const batchDiscount = options.batchMode ? 0.5 : 1.0; // 50% discount for batch

    const totalCost = (inputCost * cacheDiscount + outputCost) * batchDiscount;

    return Math.round(totalCost * 1000000) / 1000000;
  }

  /**
   * Make the actual request to Anthropic API
   * @param {Array} messages - Messages array
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Parsed response
   */
  async _makeRequest(messages, options = {}) {
    try {
      const requestBody = this.formatRequest(messages, options);
      
      const response = await fetch(`${this.config.baseUrl}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.config.apiKey,
          'anthropic-version': '2023-06-01',
          'User-Agent': 'agentic-ai-flow/1.0.0'
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(this.config.timeout)
      });

      if (!response.ok) {
        await this.handleAPIError(response);
      }

      // Handle streaming responses
      if (options.stream) {
        return await this.handleStreamingResponse(response);
      }

      // Handle regular responses
      const data = await response.json();
      return this.parseResponse(data);
      
    } catch (error) {
      if (error.status) {
        throw error;
      }
      
      const networkError = new Error(error.message);
      networkError.name = 'NetworkError';
      networkError.originalError = error;
      throw networkError;
    }
  }

  /**
   * Format request for Anthropic API
   * @param {Array} messages - Messages array
   * @param {Object} options - Request options
   * @returns {Object} Formatted request body
   */
  formatRequest(messages, options = {}) {
    // Anthropic requires system messages to be separate
    const systemMessage = messages.find(m => m.role === 'system');
    const conversationMessages = messages.filter(m => m.role !== 'system');

    const requestBody = {
      model: options.model || this.config.model,
      messages: conversationMessages,
      max_tokens: options.maxTokens || this.config.maxTokens,
      temperature: options.temperature ?? this.config.temperature,
      stream: options.stream || false
    };

    // Add system message if present
    if (systemMessage) {
      requestBody.system = systemMessage.content;
    }

    // Optional parameters
    if (options.topP !== undefined) {
      requestBody.top_p = options.topP;
    }

    if (options.topK !== undefined) {
      requestBody.top_k = options.topK;
    }

    if (options.stop) {
      requestBody.stop_sequences = Array.isArray(options.stop) ? options.stop : [options.stop];
    }

    // Tools support
    if (options.tools) {
      requestBody.tools = options.tools;
      if (options.toolChoice) {
        requestBody.tool_choice = options.toolChoice;
      }
    }

    return requestBody;
  }

  /**
   * Parse Anthropic API response
   * @param {Object} data - Raw API response
   * @returns {Object} Parsed response
   */
  parseResponse(data) {
    if (!data.content || !Array.isArray(data.content) || data.content.length === 0) {
      throw new Error('Invalid response format: missing content');
    }

    const content = data.content
      .filter(block => block.type === 'text')
      .map(block => block.text)
      .join('');

    const result = {
      content,
      model: data.model,
      provider: 'anthropic',
      tokens: {
        prompt: data.usage?.input_tokens || 0,
        completion: data.usage?.output_tokens || 0,
        total: (data.usage?.input_tokens || 0) + (data.usage?.output_tokens || 0)
      },
      finishReason: data.stop_reason,
      id: data.id
    };

    // Handle tool use
    const toolUse = data.content.find(block => block.type === 'tool_use');
    if (toolUse) {
      result.toolCalls = [{
        id: toolUse.id,
        type: 'function',
        function: {
          name: toolUse.name,
          arguments: toolUse.input
        }
      }];
    }

    return result;
  }

  /**
   * Handle streaming response from Anthropic
   * @param {Response} response - Fetch response object
   * @returns {Promise<Object>} Parsed streaming response
   */
  async handleStreamingResponse(response) {
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let content = '';
    let totalTokens = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            
            if (data === '[DONE]') {
              break;
            }

            try {
              const parsed = JSON.parse(data);
              
              if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
                content += parsed.delta.text;
              }

              if (parsed.type === 'message_delta' && parsed.usage) {
                totalTokens = parsed.usage.output_tokens || 0;
              }
            } catch (parseError) {
              continue;
            }
          }
        }
      }
    } finally {
      reader.releaseLock();
    }

    return {
      content,
      model: this.config.model,
      provider: 'anthropic',
      tokens: {
        prompt: 0,
        completion: totalTokens,
        total: totalTokens
      },
      streamed: true,
      finishReason: 'end_turn'
    };
  }

  /**
   * Handle API errors from Anthropic
   * @param {Response} response - Failed response
   * @throws {Error} Formatted error
   */
  async handleAPIError(response) {
    let errorMessage = `HTTP ${response.status}`;
    let errorType = 'unknown_error';

    try {
      const errorData = await response.json();
      if (errorData.error) {
        errorMessage = errorData.error.message || errorMessage;
        errorType = errorData.error.type || errorType;
      }
    } catch (parseError) {
      errorMessage = response.statusText || errorMessage;
    }

    const error = new Error(errorMessage);
    error.status = response.status;
    error.type = errorType;

    switch (response.status) {
      case 400:
        error.name = 'InvalidRequestError';
        break;
      case 401:
        error.name = 'AuthenticationError';
        break;
      case 403:
        error.name = 'PermissionError';
        break;
      case 429:
        error.name = 'RateLimitError';
        const retryAfter = response.headers.get('retry-after');
        if (retryAfter) {
          error.retryAfter = parseInt(retryAfter);
        }
        break;
      case 500:
      case 502:
      case 503:
      case 504:
        error.name = 'ServerError';
        break;
      default:
        error.name = 'APIError';
    }

    throw error;
  }

  /**
   * Validate Anthropic-specific message format
   * @param {Array} messages - Messages to validate
   * @throws {Error} If validation fails
   */
  validateMessages(messages) {
    super.validateMessages(messages);

    const validRoles = ['system', 'user', 'assistant'];
    
    for (const message of messages) {
      if (!validRoles.includes(message.role)) {
        throw new Error(`Invalid role '${message.role}'. Must be one of: ${validRoles.join(', ')}`);
      }
    }

    // Ensure no consecutive messages from the same role (except system)
    for (let i = 1; i < messages.length; i++) {
      const current = messages[i];
      const previous = messages[i - 1];
      
      if (current.role !== 'system' && previous.role !== 'system' && 
          current.role === previous.role) {
        throw new Error('Consecutive messages from the same role are not allowed');
      }
    }
  }

  /**
   * Get models by tier
   * @param {string} tier - Model tier
   * @returns {string[]} Array of model names
   */
  getModelsByTier(tier) {
    return Object.entries(this.modelConfigs)
      .filter(([_, config]) => config.tier === tier)
      .map(([name, _]) => name);
  }

  /**
   * Get recommended model based on requirements
   * @param {Object} requirements - Requirements object
   * @returns {string} Recommended model name
   */
  getRecommendedModel(requirements = {}) {
    const {
      needsVision = false,
      contextLength = 0,
      budget = 'standard',
      maxTokensNeeded = 4000
    } = requirements;

    let candidates = Object.entries(this.modelConfigs);

    // Filter by requirements
    candidates = candidates.filter(([_, config]) => {
      if (needsVision && !config.supportsVision) return false;
      if (contextLength > config.contextWindow) return false;
      if (maxTokensNeeded > config.maxTokens) return false;
      return true;
    });

    // Sort by cost-effectiveness
    candidates.sort(([nameA, configA], [nameB, configB]) => {
      if (budget === 'budget') {
        return configA.inputCost - configB.inputCost;
      } else if (budget === 'premium') {
        return configB.inputCost - configA.inputCost;
      } else {
        const costA = configA.inputCost + configA.outputCost;
        const costB = configB.inputCost + configB.outputCost;
        return costA - costB;
      }
    });

    return candidates.length > 0 ? candidates[0][0] : 'claude-3.7-sonnet';
  }

  /**
   * Get model pricing information
   * @param {string} model - Model name
   * @returns {Object} Pricing information
   */
  getModelPricing(model) {
    const config = this.modelConfigs[model];
    if (!config) return null;

    return {
      inputCostPer1M: config.inputCost,
      outputCostPer1M: config.outputCost,
      currency: 'USD',
      supportsCaching: true,
      cachingDiscount: 0.9 // 90% discount
    };
  }
} 