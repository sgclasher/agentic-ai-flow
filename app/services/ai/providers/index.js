/**
 * AI Providers Index
 * 
 * Central export for all AI providers and utilities for easy registration.
 * Updated for May 2025 with latest models and providers.
 */

import { OpenAIProvider } from './openaiProvider';
import { AnthropicProvider } from './anthropicProvider';
import { GoogleProvider } from './googleProvider';
import { BaseProvider } from './baseProvider';

// Export all providers
export {
  BaseProvider,
  OpenAIProvider,
  AnthropicProvider,
  GoogleProvider
};

/**
 * Create and configure all available providers
 * @param {Object} configs - Configuration object with provider configs
 * @returns {Object} Configured provider instances
 */
export function createProviders(configs = {}) {
  const providers = {};

  // Create OpenAI provider if config provided
  if (configs.openai?.apiKey) {
    providers.openai = new OpenAIProvider({
      apiKey: configs.openai.apiKey,
      model: configs.openai.model || 'gpt-4o', // Default to current production model
      ...configs.openai
    });
  }

  // Create Anthropic provider if config provided
  if (configs.anthropic?.apiKey) {
    providers.anthropic = new AnthropicProvider({
      apiKey: configs.anthropic.apiKey,
      model: configs.anthropic.model || 'claude-3.7-sonnet', // Default to current production model
      ...configs.anthropic
    });
  }

  // Create Google provider if config provided
  if (configs.google?.apiKey) {
    providers.google = new GoogleProvider({
      apiKey: configs.google.apiKey,
      model: configs.google.model || 'gemini-2.0-flash', // Default to current production model
      ...configs.google
    });
  }

  return providers;
}

/**
 * Register all configured providers with an AI service
 * @param {AIService} aiService - AI service instance
 * @param {Object} configs - Provider configurations
 * @returns {Array} Array of registered provider names
 */
export function registerAllProviders(aiService, configs = {}) {
  const providers = createProviders(configs);
  const registeredProviders = [];

  for (const [name, provider] of Object.entries(providers)) {
    try {
      aiService.registerProvider(name, provider);
      registeredProviders.push(name);
      console.log(`✓ Registered AI provider: ${name}`);
    } catch (error) {
      console.error(`✗ Failed to register AI provider '${name}':`, error.message);
    }
  }

  return registeredProviders;
}

/**
 * Get recommended provider and model based on requirements
 * @param {Object} requirements - Requirements object
 * @returns {Object} Recommendation with provider and model
 */
export function getRecommendedProviderAndModel(requirements = {}) {
  const {
    budget = 'standard',
    needsVision = false,
    needsAudio = false,
    needsVideo = false,
    needsReasoning = false,
    contextLength = 0,
    expectedVolume = 'medium', // low, medium, high
    preferredProvider = null
  } = requirements;

  // Budget-conscious recommendations
  if (budget === 'budget') {
    if (needsVision) {
      return { provider: 'google', model: 'gemini-1.5-flash-8b' };
    }
    return { provider: 'openai', model: 'gpt-4o-mini' };
  }

  // Premium performance recommendations
  if (budget === 'premium') {
    if (needsReasoning) {
      return { provider: 'openai', model: 'o3' };
    }
    if (needsVideo || needsAudio) {
      return { provider: 'google', model: 'gemini-2.5-pro' };
    }
    return { provider: 'openai', model: 'gpt-4.5-preview' };
  }

  // Standard balanced recommendations
  if (contextLength > 500000) {
    return { provider: 'google', model: 'gemini-1.5-pro' };
  }
  
  if (needsReasoning) {
    return { provider: 'openai', model: 'o3-mini' };
  }
  
  if (needsVision || needsVideo || needsAudio) {
    return { provider: 'google', model: 'gemini-2.0-flash' };
  }
  
  // General purpose recommendations by provider preference
  if (preferredProvider === 'anthropic') {
    return { provider: 'anthropic', model: 'claude-4-sonnet' };
  }
  
  if (preferredProvider === 'google') {
    return { provider: 'google', model: 'gemini-2.0-flash' };
  }
  
  // Default to OpenAI GPT-4o for balanced performance
  return { provider: 'openai', model: 'gpt-4o' };
}

/**
 * Get cost estimates for common usage patterns across providers
 * @param {Object} usage - Usage pattern
 * @returns {Object} Cost estimates by provider
 */
export function getCostEstimates(usage = {}) {
  const {
    inputTokensPerMonth = 1000000,   // 1M tokens
    outputTokensPerMonth = 250000,   // 250K tokens
    cachedInputRatio = 0.0           // Percentage of input that can be cached
  } = usage;

  const estimates = {};

  // Mock provider instances for cost calculation
  const mockProviders = {
    openai: new OpenAIProvider({ apiKey: 'mock' }),
    anthropic: new AnthropicProvider({ apiKey: 'mock' }),
    google: new GoogleProvider({ apiKey: 'mock' })
  };

  for (const [providerName, provider] of Object.entries(mockProviders)) {
    try {
      estimates[providerName] = provider.estimateCosts({
        inputTokensPerMonth,
        outputTokensPerMonth,
        cachedInputRatio
      });
    } catch (error) {
      console.warn(`Failed to get cost estimates for ${providerName}:`, error.message);
    }
  }

  return estimates;
}

/**
 * Default configurations for different use cases
 */
export const DEFAULT_CONFIGS = {
  // Budget-friendly setup
  budget: {
    openai: {
      model: 'gpt-4o-mini',
      temperature: 0.7,
      maxTokens: 2000
    },
    google: {
      model: 'gemini-1.5-flash-8b',
      temperature: 0.7,
      maxTokens: 2000
    },
    anthropic: {
      model: 'claude-3.5-haiku',
      temperature: 0.7,
      maxTokens: 2000
    }
  },

  // Balanced performance
  standard: {
    openai: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000
    },
    google: {
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      maxTokens: 4000
    },
    anthropic: {
      model: 'claude-3.7-sonnet',
      temperature: 0.7,
      maxTokens: 4000
    }
  },

  // High performance
  premium: {
    openai: {
      model: 'gpt-4.5-preview',
      temperature: 0.7,
      maxTokens: 8000
    },
    google: {
      model: 'gemini-2.5-pro',
      temperature: 0.7,
      maxTokens: 8000
    },
    anthropic: {
      model: 'claude-4-opus',
      temperature: 0.7,
      maxTokens: 8000
    }
  },

  // Reasoning-focused
  reasoning: {
    openai: {
      model: 'o3-mini',
      temperature: 0.3,
      maxTokens: 4000
    }
  },

  // Multimodal-focused
  multimodal: {
    google: {
      model: 'gemini-2.0-flash',
      temperature: 0.7,
      maxTokens: 4000
    },
    openai: {
      model: 'gpt-4o',
      temperature: 0.7,
      maxTokens: 4000
    }
  }
};

/**
 * Get configuration for a specific tier
 * @param {string} tier - Configuration tier (budget, standard, premium, etc.)
 * @returns {Object} Configuration object
 */
export function getConfigForTier(tier = 'standard') {
  return DEFAULT_CONFIGS[tier] || DEFAULT_CONFIGS.standard;
} 