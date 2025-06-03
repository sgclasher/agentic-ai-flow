/**
 * AI Service Tests
 * 
 * Tests for the main AI service orchestrator that provides the unified interface
 * for AI operations across the application. Follows patterns from ProfileService.
 */

import { AIService } from '../aiService';
import { BaseProvider } from '../providers/baseProvider';

// Mock provider implementations for testing
class MockOpenAIProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      name: 'openai',
      apiKey: 'mock-openai-key',
      ...config
    });
  }

  async _makeRequest(messages, options = {}) {
    return {
      content: 'OpenAI mock response',
      tokens: { prompt: 15, completion: 25, total: 40 },
      model: 'gpt-4',
      provider: 'openai'
    };
  }
}

class MockAnthropicProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      name: 'anthropic',
      apiKey: 'mock-anthropic-key',
      ...config
    });
  }

  async _makeRequest(messages, options = {}) {
    return {
      content: 'Anthropic mock response',
      tokens: { prompt: 12, completion: 20, total: 32 },
      model: 'claude-3-5-sonnet',
      provider: 'anthropic'
    };
  }
}

class MockFailingProvider extends BaseProvider {
  constructor(config = {}) {
    super({
      name: 'failing',
      apiKey: 'mock-failing-key',
      ...config
    });
  }

  async _makeRequest() {
    throw new Error('Provider unavailable');
  }
}

// Mock Supabase for testing
const mockSupabase = {
  from: jest.fn(() => ({
    insert: jest.fn(() => ({
      select: jest.fn().mockResolvedValue({ data: [{ id: 'conv-123' }], error: null })
    })),
    select: jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ data: [], error: null })
    })),
    update: jest.fn(() => ({
      eq: jest.fn().mockResolvedValue({ data: [{}], error: null })
    }))
  }))
};

// Mock the supabaseService
jest.mock('../../supabaseService', () => ({
  supabaseService: {
    getClient: () => mockSupabase,
    AIConversationDB: {
      createConversation: jest.fn().mockResolvedValue({ id: 'conv-123' }),
      updateConversation: jest.fn().mockResolvedValue({}),
      getConversations: jest.fn().mockResolvedValue([])
    }
  }
}));

describe('AIService', () => {
  let aiService;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    localStorage.clear();
    
    // Create fresh AI service instance
    aiService = new AIService();
  });

  describe('Initialization', () => {
    it('should initialize with default configuration', () => {
      expect(aiService).toBeInstanceOf(AIService);
      expect(aiService.providers).toEqual({});
      expect(aiService.config.defaultProvider).toBe('openai');
      expect(aiService.config.fallbackEnabled).toBe(true);
    });

    it('should initialize with custom configuration', () => {
      const customConfig = {
        defaultProvider: 'anthropic',
        fallbackEnabled: false,
        maxRetries: 5
      };
      
      const customService = new AIService(customConfig);
      
      expect(customService.config.defaultProvider).toBe('anthropic');
      expect(customService.config.fallbackEnabled).toBe(false);
      expect(customService.config.maxRetries).toBe(5);
    });
  });

  describe('Provider Management', () => {
    it('should register a new provider', () => {
      const mockProvider = new MockOpenAIProvider();
      
      aiService.registerProvider('openai', mockProvider);
      
      expect(aiService.providers.openai).toBe(mockProvider);
    });

    it('should throw error when registering invalid provider', () => {
      expect(() => {
        aiService.registerProvider('invalid', {});
      }).toThrow('Provider must extend BaseProvider');
    });

    it('should get available providers', () => {
      const openaiProvider = new MockOpenAIProvider();
      const anthropicProvider = new MockAnthropicProvider();
      
      aiService.registerProvider('openai', openaiProvider);
      aiService.registerProvider('anthropic', anthropicProvider);
      
      const providers = aiService.getAvailableProviders();
      
      expect(providers).toEqual(['openai', 'anthropic']);
    });

    it('should check if provider is available', () => {
      const mockProvider = new MockOpenAIProvider();
      aiService.registerProvider('openai', mockProvider);
      
      expect(aiService.isProviderAvailable('openai')).toBe(true);
      expect(aiService.isProviderAvailable('anthropic')).toBe(false);
    });

    it('should get provider instance', () => {
      const mockProvider = new MockOpenAIProvider();
      aiService.registerProvider('openai', mockProvider);
      
      const provider = aiService.getProvider('openai');
      
      expect(provider).toBe(mockProvider);
    });

    it('should return null for non-existent provider', () => {
      const provider = aiService.getProvider('non-existent');
      
      expect(provider).toBeNull();
    });
  });

  describe('Configuration Management', () => {
    it('should update configuration', () => {
      const newConfig = {
        defaultProvider: 'anthropic',
        fallbackEnabled: false
      };
      
      aiService.updateConfig(newConfig);
      
      expect(aiService.config.defaultProvider).toBe('anthropic');
      expect(aiService.config.fallbackEnabled).toBe(false);
    });

    it('should validate configuration', () => {
      expect(() => {
        aiService.updateConfig({ defaultProvider: null });
      }).toThrow('defaultProvider must be a string');
    });

    it('should get current configuration', () => {
      const config = aiService.getConfig();
      
      expect(config).toHaveProperty('defaultProvider');
      expect(config).toHaveProperty('fallbackEnabled');
      expect(config).toHaveProperty('maxRetries');
    });
  });

  describe('AI Generation', () => {
    beforeEach(() => {
      // Register providers for testing
      aiService.registerProvider('openai', new MockOpenAIProvider());
      aiService.registerProvider('anthropic', new MockAnthropicProvider());
    });

    it('should generate completion with default provider', async () => {
      const messages = [
        { role: 'user', content: 'Hello, AI!' }
      ];
      
      const result = await aiService.generateCompletion(messages);
      
      expect(result.content).toBe('OpenAI mock response');
      expect(result.provider).toBe('openai');
      expect(result.conversationId).toBeDefined();
    });

    it('should generate completion with specified provider', async () => {
      const messages = [
        { role: 'user', content: 'Hello, Claude!' }
      ];
      
      const result = await aiService.generateCompletion(messages, {
        provider: 'anthropic'
      });
      
      expect(result.content).toBe('Anthropic mock response');
      expect(result.provider).toBe('anthropic');
    });

    it('should handle provider fallback on failure', async () => {
      // Register failing provider as default
      aiService.registerProvider('failing', new MockFailingProvider());
      aiService.updateConfig({ defaultProvider: 'failing' });
      
      const messages = [
        { role: 'user', content: 'Test fallback' }
      ];
      
      const result = await aiService.generateCompletion(messages);
      
      // Should fallback to available provider
      expect(result.content).toBe('OpenAI mock response');
      expect(result.provider).toBe('openai');
      expect(result.usedFallback).toBe(true);
    });

    it('should throw error when no providers available', async () => {
      const emptyService = new AIService();
      const messages = [{ role: 'user', content: 'Test' }];
      
      await expect(emptyService.generateCompletion(messages))
        .rejects.toThrow('No AI providers available');
    });

    it('should validate input messages', async () => {
      const invalidMessages = [
        { content: 'Missing role' }
      ];
      
      await expect(aiService.generateCompletion(invalidMessages))
        .rejects.toThrow('Invalid message format');
    });

    it('should handle empty messages array', async () => {
      await expect(aiService.generateCompletion([]))
        .rejects.toThrow('Messages array cannot be empty');
    });

    it('should merge custom options', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      const options = {
        temperature: 0.8,
        maxTokens: 1000,
        provider: 'openai'
      };
      
      const result = await aiService.generateCompletion(messages, options);
      
      expect(result).toBeDefined();
      expect(result.provider).toBe('openai');
    });
  });

  describe('Error Handling', () => {
    beforeEach(() => {
      aiService.registerProvider('openai', new MockOpenAIProvider());
      aiService.registerProvider('failing', new MockFailingProvider());
    });

    it('should handle provider-specific errors', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      
      await expect(aiService.generateCompletion(messages, { provider: 'failing' }))
        .rejects.toThrow('Provider unavailable');
    });

    it('should gracefully handle Supabase errors', async () => {
      // Mock Supabase error
      mockSupabase.from.mockReturnValueOnce({
        insert: jest.fn(() => ({
          select: jest.fn().mockResolvedValue({ data: null, error: { message: 'DB error' } })
        }))
      });
      
      const messages = [{ role: 'user', content: 'Test' }];
      
      // Should still complete successfully with localStorage fallback
      const result = await aiService.generateCompletion(messages);
      
      expect(result.content).toBeDefined();
    });

    it('should sanitize sensitive information in errors', async () => {
      // This test would be expanded with real provider that exposes API keys
      const messages = [{ role: 'user', content: 'Test' }];
      
      try {
        await aiService.generateCompletion(messages, { provider: 'failing' });
      } catch (error) {
        expect(error.message).not.toContain('mock-failing-key');
      }
    });
  });

  describe('Usage Tracking', () => {
    beforeEach(() => {
      aiService.registerProvider('openai', new MockOpenAIProvider());
      aiService.registerProvider('anthropic', new MockAnthropicProvider());
    });

    it('should track usage across providers', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      
      await aiService.generateCompletion(messages, { provider: 'openai' });
      await aiService.generateCompletion(messages, { provider: 'anthropic' });
      
      const stats = aiService.getUsageStats();
      
      expect(stats.totalRequests).toBe(2);
      expect(stats.totalTokens).toBeGreaterThan(0);
      expect(stats.providerStats).toHaveProperty('openai');
      expect(stats.providerStats).toHaveProperty('anthropic');
    });

    it('should reset usage statistics', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      await aiService.generateCompletion(messages);
      
      aiService.resetUsageStats();
      
      const stats = aiService.getUsageStats();
      expect(stats.totalRequests).toBe(0);
      expect(stats.totalTokens).toBe(0);
    });

    it('should get provider-specific usage', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      await aiService.generateCompletion(messages, { provider: 'openai' });
      
      const openaiStats = aiService.getProviderUsage('openai');
      
      expect(openaiStats.totalRequests).toBe(1);
      expect(openaiStats.totalTokens).toBe(40);
    });
  });

  describe('Conversation Management', () => {
    beforeEach(() => {
      aiService.registerProvider('openai', new MockOpenAIProvider());
    });

    it('should create conversation with profile context', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      const profileId = 'profile-123';
      
      const result = await aiService.generateCompletion(messages, { profileId });
      
      expect(result.conversationId).toBeDefined();
      expect(result.profileId).toBe(profileId);
    });

    it('should continue existing conversation', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      const conversationId = 'conv-123';
      
      const result = await aiService.generateCompletion(messages, { conversationId });
      
      expect(result.conversationId).toBe(conversationId);
    });

    it('should get conversation history', async () => {
      const conversations = await aiService.getConversationHistory('profile-123');
      
      expect(Array.isArray(conversations)).toBe(true);
    });
  });

  describe('Provider Health Monitoring', () => {
    beforeEach(() => {
      aiService.registerProvider('openai', new MockOpenAIProvider());
      aiService.registerProvider('failing', new MockFailingProvider());
    });

    it('should check provider health', async () => {
      const health = await aiService.checkProviderHealth('openai');
      
      expect(health).toHaveProperty('provider', 'openai');
      expect(health).toHaveProperty('status');
      expect(health).toHaveProperty('responseTime');
    });

    it('should detect unhealthy providers', async () => {
      const health = await aiService.checkProviderHealth('failing');
      
      expect(health.status).toBe('unhealthy');
      expect(health.error).toBeDefined();
    });

    it('should get all provider health status', async () => {
      const healthReport = await aiService.getProvidersHealth();
      
      expect(healthReport).toHaveProperty('openai');
      expect(healthReport).toHaveProperty('failing');
      expect(healthReport.openai.status).toBe('healthy');
      expect(healthReport.failing.status).toBe('unhealthy');
    });
  });

  describe('Cache Integration', () => {
    beforeEach(() => {
      aiService.registerProvider('openai', new MockOpenAIProvider());
    });

    it('should return cached responses when available', async () => {
      const messages = [{ role: 'user', content: 'Cacheable test' }];
      
      // First call
      const result1 = await aiService.generateCompletion(messages, { 
        useCache: true,
        cacheKey: 'test-key'
      });
      
      // Second call should use cache (mock would need cache implementation)
      const result2 = await aiService.generateCompletion(messages, { 
        useCache: true,
        cacheKey: 'test-key'
      });
      
      expect(result1.content).toBeDefined();
      expect(result2.content).toBeDefined();
    });

    it('should handle cache misses gracefully', async () => {
      const messages = [{ role: 'user', content: 'No cache test' }];
      
      const result = await aiService.generateCompletion(messages, { 
        useCache: true 
      });
      
      expect(result.content).toBeDefined();
      expect(result.fromCache).toBeFalsy();
    });
  });

  describe('Backward Compatibility', () => {
    beforeEach(() => {
      aiService.registerProvider('openai', new MockOpenAIProvider());
    });

    it('should maintain compatibility with existing API', async () => {
      // Test the interface that existing code expects
      const messages = [{ role: 'user', content: 'Compatibility test' }];
      
      const result = await aiService.generateCompletion(messages);
      
      // Verify expected return structure
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('provider');
    });

    it('should handle legacy options format', async () => {
      const messages = [{ role: 'user', content: 'Legacy test' }];
      
      // Test with old-style options
      const result = await aiService.generateCompletion(messages, {
        temperature: 0.7,
        max_tokens: 1000  // Old snake_case format
      });
      
      expect(result.content).toBeDefined();
    });
  });
}); 