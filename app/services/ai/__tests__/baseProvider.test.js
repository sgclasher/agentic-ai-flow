/**
 * Base AI Provider Tests
 * 
 * Tests for the abstract base provider class that defines the unified interface
 * for all AI providers (OpenAI, Anthropic, Google, etc.)
 */

import { BaseProvider } from '../providers/baseProvider';

// Mock implementation for testing abstract class
class TestProvider extends BaseProvider {
  constructor(config = {}) {
    const defaultConfig = {
      name: 'test-provider',
      apiKey: 'test-key',
      baseUrl: 'https://api.test.com',
      ...config
    };
    
    super(defaultConfig);
  }

  async _makeRequest(messages, options = {}) {
    // Mock implementation for testing
    return {
      content: 'Test response',
      tokens: { prompt: 10, completion: 15, total: 25 },
      model: 'test-model',
      provider: 'test-provider'
    };
  }
}

describe('BaseProvider', () => {
  let provider;

  beforeEach(() => {
    // Clear any existing state
    jest.clearAllMocks();
    
    // Create fresh provider instance
    provider = new TestProvider();
  });

  describe('Constructor', () => {
    it('should create provider with required configuration', () => {
      const config = {
        name: 'test-provider',
        apiKey: 'test-api-key',
        baseUrl: 'https://api.test.com'
      };
      
      const testProvider = new TestProvider(config);
      
      expect(testProvider.name).toBe('test-provider');
      expect(testProvider.config.apiKey).toBe('test-api-key');
      expect(testProvider.config.baseUrl).toBe('https://api.test.com');
    });

    it('should throw error if name is missing', () => {
      expect(() => {
        class TestProviderNoName extends BaseProvider {
          async _makeRequest() { return {}; }
        }
        new TestProviderNoName({ apiKey: 'key' });
      }).toThrow('Provider name is required');
    });

    it('should throw error if apiKey is missing', () => {
      expect(() => {
        class TestProviderNoKey extends BaseProvider {
          async _makeRequest() { return {}; }
        }
        new TestProviderNoKey({ name: 'test' });
      }).toThrow('API key is required');
    });

    it('should set default configuration values', () => {
      const testProvider = new TestProvider({
        name: 'test',
        apiKey: 'key'
      });
      
      expect(testProvider.config.timeout).toBe(30000);
      expect(testProvider.config.maxRetries).toBe(3);
      expect(testProvider.config.retryDelay).toBe(1000);
    });
  });

  describe('generateCompletion', () => {
    it('should generate completion with valid input', async () => {
      const messages = [
        { role: 'user', content: 'Hello, AI!' }
      ];
      
      const result = await provider.generateCompletion(messages);
      
      expect(result).toHaveProperty('content');
      expect(result).toHaveProperty('tokens');
      expect(result).toHaveProperty('model');
      expect(result).toHaveProperty('provider');
      expect(result.content).toBe('Test response');
      expect(result.tokens.total).toBe(25);
    });

    it('should validate message format', async () => {
      const invalidMessages = [
        { content: 'Missing role' }
      ];
      
      await expect(provider.generateCompletion(invalidMessages))
        .rejects.toThrow('Invalid message format');
    });

    it('should handle empty messages array', async () => {
      await expect(provider.generateCompletion([]))
        .rejects.toThrow('Messages array cannot be empty');
    });

    it('should apply default options', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      
      const result = await provider.generateCompletion(messages);
      
      // Should use default temperature, maxTokens, etc.
      expect(result).toBeDefined();
    });

    it('should merge custom options with defaults', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      const customOptions = {
        temperature: 0.8,
        maxTokens: 1000
      };
      
      const result = await provider.generateCompletion(messages, customOptions);
      
      expect(result).toBeDefined();
    });
  });

  describe('Error Handling', () => {
    it('should handle network errors with retry', async () => {
      // Mock provider that fails first attempts
      class FailingProvider extends BaseProvider {
        constructor() {
          super({ name: 'failing', apiKey: 'key' });
          this.attemptCount = 0;
        }

        async _makeRequest(messages, options) {
          this.attemptCount++;
          if (this.attemptCount < 3) {
            throw new Error('Network error');
          }
          return {
            content: 'Success after retry',
            tokens: { prompt: 10, completion: 15, total: 25 },
            model: 'test-model',
            provider: 'failing'
          };
        }
      }

      const failingProvider = new FailingProvider();
      const messages = [{ role: 'user', content: 'Test' }];
      
      const result = await failingProvider.generateCompletion(messages);
      
      expect(result.content).toBe('Success after retry');
      expect(failingProvider.attemptCount).toBe(3);
    });

    it('should fail after max retries exceeded', async () => {
      class AlwaysFailingProvider extends BaseProvider {
        constructor() {
          super({ name: 'always-failing', apiKey: 'key', maxRetries: 2 });
        }

        async _makeRequest() {
          throw new Error('Persistent network error');
        }
      }

      const alwaysFailingProvider = new AlwaysFailingProvider();
      const messages = [{ role: 'user', content: 'Test' }];
      
      await expect(alwaysFailingProvider.generateCompletion(messages))
        .rejects.toThrow('Max retries exceeded');
    });

    it('should handle rate limiting errors', async () => {
      class RateLimitedProvider extends BaseProvider {
        constructor() {
          super({ name: 'rate-limited', apiKey: 'key' });
        }

        async _makeRequest() {
          const error = new Error('Rate limit exceeded');
          error.status = 429;
          throw error;
        }
      }

      const rateLimitedProvider = new RateLimitedProvider();
      const messages = [{ role: 'user', content: 'Test' }];
      
      await expect(rateLimitedProvider.generateCompletion(messages))
        .rejects.toThrow('Rate limit exceeded');
    });

    it('should sanitize API key in error messages', async () => {
      class ErrorProvider extends BaseProvider {
        constructor() {
          super({ name: 'error', apiKey: 'secret-key-12345' });
        }

        async _makeRequest() {
          throw new Error('API call failed with key: secret-key-12345');
        }
      }

      const errorProvider = new ErrorProvider();
      const messages = [{ role: 'user', content: 'Test' }];
      
      try {
        await errorProvider.generateCompletion(messages);
      } catch (error) {
        expect(error.message).not.toContain('secret-key-12345');
        expect(error.message).toContain('[REDACTED]');
      }
    });
  });

  describe('Usage Tracking', () => {
    it('should track token usage', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      
      const result = await provider.generateCompletion(messages);
      
      expect(provider.getUsageStats()).toEqual({
        totalRequests: 1,
        totalTokens: 25,
        totalPromptTokens: 10,
        totalCompletionTokens: 15,
        totalCost: expect.any(Number)
      });
    });

    it('should accumulate usage across multiple requests', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      
      await provider.generateCompletion(messages);
      await provider.generateCompletion(messages);
      
      const stats = provider.getUsageStats();
      expect(stats.totalRequests).toBe(2);
      expect(stats.totalTokens).toBe(50);
    });

    it('should reset usage stats', async () => {
      const messages = [{ role: 'user', content: 'Test' }];
      await provider.generateCompletion(messages);
      
      provider.resetUsageStats();
      
      expect(provider.getUsageStats()).toEqual({
        totalRequests: 0,
        totalTokens: 0,
        totalPromptTokens: 0,
        totalCompletionTokens: 0,
        totalCost: 0
      });
    });
  });

  describe('Configuration Validation', () => {
    it('should validate provider configuration', () => {
      expect(() => {
        provider.validateConfig({
          name: 'test',
          apiKey: 'key',
          baseUrl: 'invalid-url'
        });
      }).toThrow('Invalid baseUrl format');
    });

    it('should accept valid configuration', () => {
      expect(() => {
        provider.validateConfig({
          name: 'test',
          apiKey: 'key',
          baseUrl: 'https://api.test.com'
        });
      }).not.toThrow();
    });

    it('should validate timeout ranges', () => {
      expect(() => {
        provider.validateConfig({
          name: 'test',
          apiKey: 'key',
          timeout: -1000
        });
      }).toThrow('Timeout must be positive');
    });
  });

  describe('Abstract Methods', () => {
    it('should throw error if _makeRequest is not implemented', async () => {
      class IncompleteProvider extends BaseProvider {
        constructor() {
          super({ name: 'incomplete', apiKey: 'key' });
        }
        // Missing _makeRequest implementation
      }

      const incompleteProvider = new IncompleteProvider();
      const messages = [{ role: 'user', content: 'Test' }];
      
      await expect(incompleteProvider.generateCompletion(messages))
        .rejects.toThrow('_makeRequest must be implemented by provider');
    });
  });

  describe('Request Validation', () => {
    it('should validate message structure', () => {
      const validMessages = [
        { role: 'system', content: 'You are a helpful assistant' },
        { role: 'user', content: 'Hello' },
        { role: 'assistant', content: 'Hi there!' }
      ];
      
      expect(() => provider.validateMessages(validMessages)).not.toThrow();
    });

    it('should reject invalid message roles', () => {
      const invalidMessages = [
        { role: 'invalid', content: 'Test' }
      ];
      
      expect(() => provider.validateMessages(invalidMessages))
        .toThrow('Invalid message role');
    });

    it('should reject messages without content', () => {
      const invalidMessages = [
        { role: 'user' }
      ];
      
      expect(() => provider.validateMessages(invalidMessages))
        .toThrow('Message content is required');
    });
  });
}); 