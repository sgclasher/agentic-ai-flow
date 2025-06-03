/**
 * OpenAI Provider
 * 
 * Concrete implementation of the AI provider interface for OpenAI GPT models.
 * Handles OpenAI-specific API calls, model management, cost calculation, and features
 * like function calling and streaming.
 */

import { BaseProvider } from './baseProvider';

export class OpenAIProvider extends BaseProvider {
  constructor(config = {}) {
    const defaultConfig = {
      name: 'openai',
      baseUrl: 'https://api.openai.com/v1',
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000,
      timeout: 30000,
      ...config
    };

    super(defaultConfig);

    // OpenAI-specific model configurations
    this.modelConfigs = {
      // GPT-4.5 - Largest and most capable model (Feb 2025)
      'gpt-4.5-preview': {
        name: 'gpt-4.5-preview',
        maxTokens: 32768,
        inputCost: 75.00,        // per 1M tokens
        outputCost: 150.00,      // per 1M tokens
        cachedInputCost: 37.50,  // 50% discount for cached input
        contextWindow: 128000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'premium'
      },

      // GPT-4.1 - Latest production model (April 2025)
      'gpt-4.1': {
        name: 'gpt-4.1',
        maxTokens: 32768,
        inputCost: 2.00,         // per 1M tokens
        outputCost: 8.00,        // per 1M tokens
        cachedInputCost: 0.50,   // 75% discount for cached input
        contextWindow: 1000000,  // 1M tokens
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      // GPT-4o - Current primary model
      'gpt-4o': {
        name: 'gpt-4o',
        maxTokens: 32768,
        inputCost: 2.50,         // per 1M tokens
        outputCost: 10.00,       // per 1M tokens
        cachedInputCost: 1.25,   // 50% discount for cached input
        contextWindow: 128000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      // GPT-4o mini - Cost-effective option
      'gpt-4o-mini': {
        name: 'gpt-4o-mini',
        maxTokens: 16384,
        inputCost: 0.15,         // per 1M tokens
        outputCost: 0.60,        // per 1M tokens
        cachedInputCost: 0.075,  // 50% discount for cached input
        contextWindow: 128000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'budget'
      },

      // o3 - Advanced reasoning model
      'o3': {
        name: 'o3',
        maxTokens: 32768,
        inputCost: 60.00,        // per 1M tokens
        outputCost: 240.00,      // per 1M tokens
        cachedInputCost: 30.00,  // 50% discount for cached input
        contextWindow: 200000,
        supportsVision: false,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'reasoning',
        isReasoningModel: true
      },

      // o3-mini - Cost-effective reasoning model
      'o3-mini': {
        name: 'o3-mini',
        maxTokens: 32768,
        inputCost: 1.10,         // per 1M tokens
        outputCost: 4.40,        // per 1M tokens
        cachedInputCost: 0.55,   // 50% discount for cached input
        contextWindow: 200000,
        supportsVision: false,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'reasoning',
        isReasoningModel: true
      },

      // o1 - Previous generation reasoning model
      'o1': {
        name: 'o1',
        maxTokens: 32768,
        inputCost: 15.00,        // per 1M tokens
        outputCost: 60.00,       // per 1M tokens
        cachedInputCost: 7.50,   // 50% discount for cached input
        contextWindow: 200000,
        supportsVision: false,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'reasoning',
        isReasoningModel: true
      },

      // Legacy models (deprecated but may still be used)
      'gpt-4-turbo': {
        name: 'gpt-4-turbo',
        maxTokens: 4096,
        inputCost: 10.00,        // per 1M tokens
        outputCost: 30.00,       // per 1M tokens
        contextWindow: 128000,
        supportsVision: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'legacy',
        deprecated: true
      },

      'gpt-3.5-turbo': {
        name: 'gpt-3.5-turbo',
        maxTokens: 4096,
        inputCost: 0.50,         // per 1M tokens
        outputCost: 1.50,        // per 1M tokens
        contextWindow: 16385,
        supportsVision: false,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'legacy',
        deprecated: true
      }
    };
  }

  /**
   * Get available OpenAI models
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
   * Calculate cost for OpenAI models
   * @param {Object} tokens - Token usage object
   * @param {string} model - Model name
   * @param {Object} options - Cost calculation options
   * @returns {number} Cost in USD
   */
  calculateCost(tokens, model, options = {}) {
    if (!tokens || !model) return 0;

    const modelConfig = this.modelConfigs[model];
    if (!modelConfig) return 0;

    // Handle cached input pricing (available for newer models)
    const inputTokens = tokens.prompt || 0;
    const cachedInputTokens = tokens.cachedPrompt || 0;
    const outputTokens = tokens.completion || 0;

    // Calculate input cost (regular + cached)
    const regularInputCost = inputTokens * modelConfig.inputCost / 1000000; // per 1M tokens
    const cachedInputCost = cachedInputTokens * (modelConfig.cachedInputCost || modelConfig.inputCost) / 1000000;
    
    // Calculate output cost
    const outputCost = outputTokens * modelConfig.outputCost / 1000000; // per 1M tokens

    // Apply batch discount if specified (typically 50% for OpenAI)
    const batchDiscount = options.batchMode ? 0.5 : 1.0;

    const totalCost = (regularInputCost + cachedInputCost + outputCost) * batchDiscount;

    // Round to 6 decimal places to avoid floating point precision issues
    return Math.round(totalCost * 1000000) / 1000000;
  }

  /**
   * Make the actual request to OpenAI API
   * @param {Array} messages - Messages array
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Parsed response
   */
  async _makeRequest(messages, options = {}) {
    try {
      const requestBody = this.formatRequest(messages, options);
      
      const response = await fetch(`${this.config.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
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
      // If it's already a handled API error, re-throw it
      if (error.status) {
        throw error;
      }
      
      // Handle network errors, timeouts, etc.
      const networkError = new Error(error.message);
      networkError.name = 'NetworkError';
      networkError.originalError = error;
      throw networkError;
    }
  }

  /**
   * Format request for OpenAI API
   * @param {Array} messages - Messages array
   * @param {Object} options - Request options
   * @returns {Object} Formatted request body
   */
  formatRequest(messages, options = {}) {
    const requestBody = {
      model: options.model || this.config.model,
      messages: messages,
      temperature: options.temperature ?? this.config.temperature,
      max_tokens: options.maxTokens || this.config.maxTokens,
      stream: options.stream || false
    };

    // Optional parameters
    if (options.topP !== undefined) {
      requestBody.top_p = options.topP;
    }
    
    if (options.frequencyPenalty !== undefined) {
      requestBody.frequency_penalty = options.frequencyPenalty;
    }
    
    if (options.presencePenalty !== undefined) {
      requestBody.presence_penalty = options.presencePenalty;
    }

    if (options.stop) {
      requestBody.stop = options.stop;
    }

    // Function calling support
    if (options.functions) {
      requestBody.functions = options.functions;
      if (options.functionCall) {
        requestBody.function_call = options.functionCall;
      }
    }

    // Tools support (newer API)
    if (options.tools) {
      requestBody.tools = options.tools;
      if (options.toolChoice) {
        requestBody.tool_choice = options.toolChoice;
      }
    }

    // Response format (for JSON mode)
    if (options.responseFormat) {
      requestBody.response_format = options.responseFormat;
    }

    // Seed for reproducible outputs
    if (options.seed !== undefined) {
      requestBody.seed = options.seed;
    }

    return requestBody;
  }

  /**
   * Parse OpenAI API response
   * @param {Object} data - Raw API response
   * @returns {Object} Parsed response
   */
  parseResponse(data) {
    if (!data.choices || !Array.isArray(data.choices) || data.choices.length === 0) {
      throw new Error('Invalid response format: missing choices');
    }

    const choice = data.choices[0];
    const message = choice.message;

    if (!message) {
      throw new Error('Invalid response format: missing message');
    }

    const result = {
      content: message.content || '',
      model: data.model,
      provider: 'openai',
      tokens: {
        prompt: data.usage?.prompt_tokens || 0,
        completion: data.usage?.completion_tokens || 0,
        total: data.usage?.total_tokens || 0
      },
      finishReason: choice.finish_reason,
      id: data.id
    };

    // Handle function calls (legacy format)
    if (message.function_call) {
      result.functionCall = {
        name: message.function_call.name,
        arguments: JSON.parse(message.function_call.arguments || '{}')
      };
    }

    // Handle tool calls (newer format)
    if (message.tool_calls && message.tool_calls.length > 0) {
      result.toolCalls = message.tool_calls.map(toolCall => ({
        id: toolCall.id,
        type: toolCall.type,
        function: {
          name: toolCall.function.name,
          arguments: JSON.parse(toolCall.function.arguments || '{}')
        }
      }));
    }

    return result;
  }

  /**
   * Handle streaming response from OpenAI
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
              const delta = parsed.choices?.[0]?.delta;
              
              if (delta?.content) {
                content += delta.content;
              }

              // Track token usage if available
              if (parsed.usage) {
                totalTokens = parsed.usage.total_tokens || 0;
              }
            } catch (parseError) {
              // Skip malformed JSON chunks
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
      provider: 'openai',
      tokens: {
        prompt: 0, // Not available in streaming
        completion: 0, // Not available in streaming
        total: totalTokens
      },
      streamed: true,
      finishReason: 'stop'
    };
  }

  /**
   * Handle API errors from OpenAI
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
      // If we can't parse the error response, use the status text
      errorMessage = response.statusText || errorMessage;
    }

    // Map OpenAI error types to our standardized errors
    const error = new Error(errorMessage);
    error.status = response.status;
    error.type = errorType;

    // Set specific error properties based on status
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
      case 404:
        error.name = 'NotFoundError';
        break;
      case 429:
        error.name = 'RateLimitError';
        // Parse retry-after header if available
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
   * Validate OpenAI-specific message format
   * @param {Array} messages - Messages to validate
   * @throws {Error} If validation fails
   */
  validateMessages(messages) {
    // Call parent validation first
    super.validateMessages(messages);

    // OpenAI-specific validation
    const validRoles = ['system', 'user', 'assistant', 'function', 'tool'];

    for (const message of messages) {
      if (!validRoles.includes(message.role)) {
        throw new Error(`Invalid role '${message.role}'. Must be one of: ${validRoles.join(', ')}`);
      }

      // Validate function messages have name
      if (message.role === 'function' && !message.name) {
        throw new Error('Function messages must have a name');
      }

      // Validate tool messages have tool_call_id
      if (message.role === 'tool' && !message.tool_call_id) {
        throw new Error('Tool messages must have a tool_call_id');
      }
    }
  }

  /**
   * Check token limits for OpenAI models
   * @param {Array} messages - Messages array
   * @param {string} model - Model name
   * @returns {Object} Token analysis
   */
  analyzeTokenUsage(messages, model) {
    const modelConfig = this.getModelInfo(model);
    if (!modelConfig) {
      return { valid: false, reason: 'Unknown model' };
    }

    // Rough estimation: ~4 characters per token
    const estimatedTokens = JSON.stringify(messages).length / 4;
    const contextWindow = modelConfig.contextWindow;

    return {
      valid: estimatedTokens < contextWindow * 0.8, // Leave room for response
      estimatedTokens: Math.round(estimatedTokens),
      contextWindow,
      reason: estimatedTokens >= contextWindow * 0.8 ? 'Messages too long for context window' : null
    };
  }

  /**
   * Get model-specific configuration
   * @param {string} model - Model name
   * @returns {Object} Model configuration
   */
  getModelConfig(model) {
    return this.modelConfigs[model] || this.modelConfigs[this.config.model];
  }

  /**
   * Create embeddings using OpenAI's embedding models
   * @param {string|Array} input - Text to embed
   * @param {Object} options - Embedding options
   * @returns {Promise<Object>} Embedding response
   */
  async createEmbeddings(input, options = {}) {
    const requestBody = {
      input: Array.isArray(input) ? input : [input],
      model: options.model || 'text-embedding-ada-002',
      encoding_format: options.encodingFormat || 'float'
    };

    const response = await fetch(`${this.config.baseUrl}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'User-Agent': 'agentic-ai-flow/1.0.0'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.config.timeout)
    });

    if (!response.ok) {
      await this.handleAPIError(response);
    }

    const data = await response.json();
    
    return {
      embeddings: data.data.map(item => item.embedding),
      model: data.model,
      usage: {
        promptTokens: data.usage.prompt_tokens,
        totalTokens: data.usage.total_tokens
      }
    };
  }

  /**
   * Moderate content using OpenAI's moderation endpoint
   * @param {string} input - Content to moderate
   * @returns {Promise<Object>} Moderation response
   */
  async moderateContent(input) {
    const requestBody = {
      input: input
    };

    const response = await fetch(`${this.config.baseUrl}/moderations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.apiKey}`,
        'User-Agent': 'agentic-ai-flow/1.0.0'
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.config.timeout)
    });

    if (!response.ok) {
      await this.handleAPIError(response);
    }

    const data = await response.json();
    const result = data.results[0];

    return {
      flagged: result.flagged,
      categories: result.categories,
      categoryScores: result.category_scores
    };
  }

  /**
   * Get models by tier (premium, standard, budget, reasoning, legacy)
   * @param {string} tier - Model tier to filter by
   * @returns {string[]} Array of model names in the specified tier
   */
  getModelsByTier(tier) {
    return Object.entries(this.modelConfigs)
      .filter(([_, config]) => config.tier === tier)
      .map(([name, _]) => name);
  }

  /**
   * Get reasoning models
   * @returns {string[]} Array of reasoning model names
   */
  getReasoningModels() {
    return Object.entries(this.modelConfigs)
      .filter(([_, config]) => config.isReasoningModel)
      .map(([name, _]) => name);
  }

  /**
   * Get non-deprecated models
   * @returns {string[]} Array of current model names
   */
  getCurrentModels() {
    return Object.entries(this.modelConfigs)
      .filter(([_, config]) => !config.deprecated)
      .map(([name, _]) => name);
  }

  /**
   * Get cost-effective model recommendation based on requirements
   * @param {Object} requirements - Requirements object
   * @returns {string} Recommended model name
   */
  getRecommendedModel(requirements = {}) {
    const {
      needsVision = false,
      needsReasoning = false,
      contextLength = 0,
      budget = 'standard',
      allowDeprecated = false
    } = requirements;

    let candidates = Object.entries(this.modelConfigs);

    // Filter out deprecated models unless explicitly allowed
    if (!allowDeprecated) {
      candidates = candidates.filter(([_, config]) => !config.deprecated);
    }

    // Filter by requirements
    candidates = candidates.filter(([_, config]) => {
      if (needsVision && !config.supportsVision) return false;
      if (needsReasoning && !config.isReasoningModel) return false;
      if (contextLength > config.contextWindow) return false;
      return true;
    });

    // Sort by cost-effectiveness based on budget preference
    candidates.sort(([nameA, configA], [nameB, configB]) => {
      if (budget === 'budget') {
        // For budget, prioritize lower input cost
        return configA.inputCost - configB.inputCost;
      } else if (budget === 'premium') {
        // For premium, prioritize capability (higher cost usually means more capable)
        return configB.inputCost - configA.inputCost;
      } else {
        // For standard, balance cost and capability
        const costA = configA.inputCost + configA.outputCost;
        const costB = configB.inputCost + configB.outputCost;
        return costA - costB;
      }
    });

    return candidates.length > 0 ? candidates[0][0] : 'gpt-4o';
  }

  /**
   * Estimate costs for different models
   * @param {Object} usage - Expected usage pattern
   * @returns {Object} Cost estimates by model
   */
  estimateCosts(usage = {}) {
    const {
      inputTokensPerMonth = 1000000,   // 1M tokens
      outputTokensPerMonth = 250000,   // 250K tokens
      cachedInputRatio = 0.0           // Percentage of input that can be cached
    } = usage;

    const estimates = {};
    const currentModels = this.getCurrentModels();

    for (const model of currentModels) {
      const config = this.modelConfigs[model];
      const regularInput = inputTokensPerMonth * (1 - cachedInputRatio);
      const cachedInput = inputTokensPerMonth * cachedInputRatio;

      const monthlyCost = this.calculateCost({
        prompt: regularInput,
        cachedPrompt: cachedInput,
        completion: outputTokensPerMonth
      }, model);

      estimates[model] = {
        monthlyCost,
        inputCostPer1M: config.inputCost,
        outputCostPer1M: config.outputCost,
        tier: config.tier,
        contextWindow: config.contextWindow
      };
    }

    return estimates;
  }

  /**
   * Check if model supports specific features
   * @param {string} model - Model name
   * @returns {Object} Feature support information
   */
  getModelFeatures(model) {
    const config = this.modelConfigs[model];
    if (!config) return null;

    return {
      supportsVision: config.supportsVision || false,
      supportsFunctions: config.supportsFunctions || false,
      supportsTools: config.supportsTools || false,
      isReasoningModel: config.isReasoningModel || false,
      contextWindow: config.contextWindow,
      maxTokens: config.maxTokens,
      tier: config.tier,
      deprecated: config.deprecated || false
    };
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
      cachedInputCostPer1M: config.cachedInputCost,
      hasCachedPricing: !!config.cachedInputCost,
      currency: 'USD'
    };
  }
} 