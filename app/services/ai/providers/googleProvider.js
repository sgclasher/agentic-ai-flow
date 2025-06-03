/**
 * Google Provider
 * 
 * Concrete implementation of the AI provider interface for Google Gemini models.
 * Handles Google AI API calls, model management, cost calculation, and multimodal features.
 */

import { BaseProvider } from './baseProvider';

export class GoogleProvider extends BaseProvider {
  constructor(config = {}) {
    const defaultConfig = {
      name: 'google',
      baseUrl: 'https://generativelanguage.googleapis.com/v1beta',
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      maxTokens: 4000,
      timeout: 30000,
      ...config
    };

    super(defaultConfig);

    // Google Gemini model configurations (May 2025)
    this.modelConfigs = {
      // Gemini 2.5 Pro - Latest and most capable (March 2025)
      'gemini-2.5-pro': {
        name: 'gemini-2.5-pro-exp-03-25',
        maxTokens: 64000,
        inputCost: 1.25,         // per 1M tokens (≤200K context)
        inputCostHigh: 2.50,     // per 1M tokens (>200K context)
        outputCost: 10.00,       // per 1M tokens (≤200K context)
        outputCostHigh: 15.00,   // per 1M tokens (>200K context)
        contextWindow: 200000,
        supportsVision: true,
        supportsAudio: true,
        supportsVideo: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'premium'
      },

      // Gemini 2.0 Flash - Current production model
      'gemini-2.0-flash': {
        name: 'gemini-2.0-flash-exp-02-05',
        maxTokens: 32000,
        inputCost: 0.10,         // per 1M tokens (text/image/video)
        audioCost: 0.70,         // per 1M tokens (audio)
        outputCost: 0.40,        // per 1M tokens
        contextWindow: 1000000,  // 1M tokens
        supportsVision: true,
        supportsAudio: true,
        supportsVideo: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      'gemini-2.0-flash-lite': {
        name: 'gemini-2.0-flash-lite',
        maxTokens: 16000,
        inputCost: 0.075,        // per 1M tokens
        outputCost: 0.30,        // per 1M tokens
        contextWindow: 1000000,
        supportsVision: true,
        supportsAudio: true,
        supportsVideo: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'budget'
      },

      // Gemini 1.5 Pro - Stable production model
      'gemini-1.5-pro': {
        name: 'gemini-1.5-pro-002',
        maxTokens: 32000,
        inputCost: 1.25,         // per 1M tokens (≤128K context)
        inputCostHigh: 2.50,     // per 1M tokens (>128K context)
        outputCost: 5.00,        // per 1M tokens (≤128K context)
        outputCostHigh: 10.00,   // per 1M tokens (>128K context)
        contextWindow: 2000000,  // 2M tokens
        supportsVision: true,
        supportsAudio: true,
        supportsVideo: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'standard'
      },

      // Gemini 1.5 Flash - Fast and efficient
      'gemini-1.5-flash': {
        name: 'gemini-1.5-flash-002',
        maxTokens: 16000,
        inputCost: 0.075,        // per 1M tokens (≤128K context)
        inputCostHigh: 0.15,     // per 1M tokens (>128K context)
        outputCost: 0.30,        // per 1M tokens (≤128K context)
        outputCostHigh: 0.60,    // per 1M tokens (>128K context)
        contextWindow: 1000000,
        supportsVision: true,
        supportsAudio: true,
        supportsVideo: true,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'budget'
      },

      'gemini-1.5-flash-8b': {
        name: 'gemini-1.5-flash-8b-002',
        maxTokens: 8000,
        inputCost: 0.0375,       // per 1M tokens (≤128K context)
        inputCostHigh: 0.075,    // per 1M tokens (>128K context)
        outputCost: 0.15,        // per 1M tokens (≤128K context)
        outputCostHigh: 0.30,    // per 1M tokens (>128K context)
        contextWindow: 1000000,
        supportsVision: true,
        supportsAudio: false,
        supportsVideo: false,
        supportsFunctions: true,
        supportsTools: true,
        tier: 'budget'
      }
    };
  }

  /**
   * Get available Google models
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
   * Calculate cost for Google models with context-aware pricing
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
    const audioTokens = tokens.audio || 0;

    // Determine if we're in high-cost tier based on context length
    const contextThreshold = model.includes('2.5') ? 200000 : 128000;
    const isHighContext = options.contextLength > contextThreshold;

    // Calculate input costs
    let inputCost;
    if (audioTokens > 0 && modelConfig.audioCost) {
      // Audio has separate pricing
      inputCost = (inputTokens * modelConfig.inputCost + audioTokens * modelConfig.audioCost) / 1000000;
    } else {
      // Regular text/image/video input
      const rate = isHighContext && modelConfig.inputCostHigh ? 
        modelConfig.inputCostHigh : modelConfig.inputCost;
      inputCost = inputTokens * rate / 1000000;
    }

    // Calculate output costs
    const outputRate = isHighContext && modelConfig.outputCostHigh ? 
      modelConfig.outputCostHigh : modelConfig.outputCost;
    const outputCost = outputTokens * outputRate / 1000000;

    const totalCost = inputCost + outputCost;

    return Math.round(totalCost * 1000000) / 1000000;
  }

  /**
   * Make the actual request to Google AI API
   * @param {Array} messages - Messages array
   * @param {Object} options - Request options
   * @returns {Promise<Object>} Parsed response
   */
  async _makeRequest(messages, options = {}) {
    try {
      const requestBody = this.formatRequest(messages, options);
      const modelName = options.model || this.config.model;
      const modelConfig = this.modelConfigs[modelName];
      
      const url = `${this.config.baseUrl}/models/${modelConfig.name}:generateContent`;
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': this.config.apiKey,
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
      return this.parseResponse(data, modelName);
      
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
   * Format request for Google AI API
   * @param {Array} messages - Messages array
   * @param {Object} options - Request options
   * @returns {Object} Formatted request body
   */
  formatRequest(messages, options = {}) {
    // Convert messages to Google's format
    const contents = messages.map(message => {
      const parts = [];
      
      if (typeof message.content === 'string') {
        parts.push({ text: message.content });
      } else if (Array.isArray(message.content)) {
        // Handle multimodal content
        for (const part of message.content) {
          if (part.type === 'text') {
            parts.push({ text: part.text });
          } else if (part.type === 'image') {
            parts.push({
              inlineData: {
                mimeType: part.mimeType || 'image/jpeg',
                data: part.data
              }
            });
          }
        }
      }

      return {
        role: message.role === 'assistant' ? 'model' : 'user',
        parts
      };
    });

    const requestBody = {
      contents,
      generationConfig: {
        temperature: options.temperature ?? this.config.temperature,
        maxOutputTokens: options.maxTokens || this.config.maxTokens,
        candidateCount: 1
      }
    };

    // Optional parameters
    if (options.topP !== undefined) {
      requestBody.generationConfig.topP = options.topP;
    }

    if (options.topK !== undefined) {
      requestBody.generationConfig.topK = options.topK;
    }

    if (options.stop) {
      requestBody.generationConfig.stopSequences = Array.isArray(options.stop) ? 
        options.stop : [options.stop];
    }

    // Tools support
    if (options.tools) {
      requestBody.tools = options.tools;
    }

    // Safety settings (optional)
    if (options.safetySettings) {
      requestBody.safetySettings = options.safetySettings;
    }

    return requestBody;
  }

  /**
   * Parse Google AI API response
   * @param {Object} data - Raw API response
   * @param {string} model - Model name
   * @returns {Object} Parsed response
   */
  parseResponse(data, model) {
    if (!data.candidates || !Array.isArray(data.candidates) || data.candidates.length === 0) {
      throw new Error('Invalid response format: missing candidates');
    }

    const candidate = data.candidates[0];
    if (!candidate.content || !candidate.content.parts) {
      throw new Error('Invalid response format: missing content parts');
    }

    // Extract text content
    const content = candidate.content.parts
      .filter(part => part.text)
      .map(part => part.text)
      .join('');

    const result = {
      content,
      model,
      provider: 'google',
      tokens: {
        prompt: data.usageMetadata?.promptTokenCount || 0,
        completion: data.usageMetadata?.candidatesTokenCount || 0,
        total: data.usageMetadata?.totalTokenCount || 0
      },
      finishReason: candidate.finishReason,
      id: `google-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };

    // Handle function calls
    const functionCalls = candidate.content.parts.filter(part => part.functionCall);
    if (functionCalls.length > 0) {
      result.toolCalls = functionCalls.map(part => ({
        id: `call_${Math.random().toString(36).substr(2, 9)}`,
        type: 'function',
        function: {
          name: part.functionCall.name,
          arguments: part.functionCall.args
        }
      }));
    }

    return result;
  }

  /**
   * Handle streaming response from Google AI
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
              
              if (parsed.candidates?.[0]?.content?.parts) {
                const textParts = parsed.candidates[0].content.parts
                  .filter(part => part.text)
                  .map(part => part.text);
                content += textParts.join('');
              }

              if (parsed.usageMetadata) {
                totalTokens = parsed.usageMetadata.totalTokenCount || 0;
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
      provider: 'google',
      tokens: {
        prompt: 0,
        completion: 0,
        total: totalTokens
      },
      streamed: true,
      finishReason: 'STOP'
    };
  }

  /**
   * Handle API errors from Google AI
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
        errorType = errorData.error.code || errorType;
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
   * Validate Google-specific message format
   * @param {Array} messages - Messages to validate
   * @throws {Error} If validation fails
   */
  validateMessages(messages) {
    super.validateMessages(messages);

    const validRoles = ['user', 'assistant', 'system'];
    
    for (const message of messages) {
      if (!validRoles.includes(message.role)) {
        throw new Error(`Invalid role '${message.role}'. Must be one of: ${validRoles.join(', ')}`);
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
   * Get multimodal capabilities
   * @param {string} model - Model name
   * @returns {Object} Multimodal capabilities
   */
  getMultimodalCapabilities(model) {
    const config = this.modelConfigs[model];
    if (!config) return null;

    return {
      supportsVision: config.supportsVision || false,
      supportsAudio: config.supportsAudio || false,
      supportsVideo: config.supportsVideo || false,
      contextWindow: config.contextWindow
    };
  }

  /**
   * Get recommended model based on requirements
   * @param {Object} requirements - Requirements object
   * @returns {string} Recommended model name
   */
  getRecommendedModel(requirements = {}) {
    const {
      needsVision = false,
      needsAudio = false,
      needsVideo = false,
      contextLength = 0,
      budget = 'standard'
    } = requirements;

    let candidates = Object.entries(this.modelConfigs);

    // Filter by requirements
    candidates = candidates.filter(([_, config]) => {
      if (needsVision && !config.supportsVision) return false;
      if (needsAudio && !config.supportsAudio) return false;
      if (needsVideo && !config.supportsVideo) return false;
      if (contextLength > config.contextWindow) return false;
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

    return candidates.length > 0 ? candidates[0][0] : 'gemini-2.0-flash';
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
      inputCostHighPer1M: config.inputCostHigh,
      outputCostPer1M: config.outputCost,
      outputCostHighPer1M: config.outputCostHigh,
      audioCostPer1M: config.audioCost,
      currency: 'USD',
      hasContextBasedPricing: !!(config.inputCostHigh || config.outputCostHigh)
    };
  }
} 