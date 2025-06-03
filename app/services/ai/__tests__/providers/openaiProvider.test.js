/**
 * OpenAI Provider Tests
 * 
 * Tests for the OpenAI implementation of the AI provider interface.
 * Covers OpenAI-specific functionality, model handling, and API integration.
 */

import { OpenAIProvider } from '../../providers/openaiProvider';

// Mock fetch for testing
global.fetch = jest.fn();

describe('OpenAIProvider', () => {
  let provider;

  beforeEach(() => {
    jest.clearAllMocks();
    provider = new OpenAIProvider({
      apiKey: 'sk-test-key-12345'
    });
  });

  describe('Initialization', () => {
    it('should initialize with required configuration', () => {
      expect(provider.config.name).toBe('openai');
      expect(provider.config.apiKey).toBe('sk-test-key-12345');
      expect(provider.config.baseUrl).toBe('https://api.openai.com/v1');
    });

    it('should initialize with custom configuration', () => {
      const customProvider = new OpenAIProvider({
        apiKey: 'sk-custom-key',
        baseUrl: 'https://custom.api.com',
        model: 'gpt-4-turbo',
        temperature: 0.8
      });

      expect(customProvider.config.baseUrl).toBe('https://custom.api.com');
      expect(customProvider.config.model).toBe('gpt-4-turbo');
      expect(customProvider.config.temperature).toBe(0.8);
    });

    it('should set default model and options', () => {
      expect(provider.config.model).toBe('gpt-4o');
      expect(provider.config.temperature).toBe(0.7);
      expect(provider.config.maxTokens).toBe(4000);
    });

    it('should throw error if API key is missing', () => {
      expect(() => {
        new OpenAIProvider({});
      }).toThrow('API key is required');
    });
  });

  describe('Model Management', () => {
    it('should get available models', () => {
      const models = provider.getAvailableModels();
      
      expect(models).toContain('gpt-4.5-preview');
      expect(models).toContain('gpt-4.1');
      expect(models).toContain('gpt-4o');
      expect(models).toContain('gpt-4o-mini');
      expect(models).toContain('gpt-4-turbo');
      expect(models).toContain('gpt-3.5-turbo');
      expect(Array.isArray(models)).toBe(true);
    });

    it('should validate model availability', () => {
      expect(provider.isModelAvailable('gpt-4o')).toBe(true);
      expect(provider.isModelAvailable('gpt-4.1')).toBe(true);
      expect(provider.isModelAvailable('gpt-5')).toBe(false);
      expect(provider.isModelAvailable('invalid-model')).toBe(false);
    });

    it('should get model information', () => {
      const modelInfo = provider.getModelInfo('gpt-4o');
      
      expect(modelInfo).toHaveProperty('name', 'gpt-4o');
      expect(modelInfo).toHaveProperty('maxTokens');
      expect(modelInfo).toHaveProperty('inputCost');
      expect(modelInfo).toHaveProperty('outputCost');
    });

    it('should return null for unknown model info', () => {
      const modelInfo = provider.getModelInfo('unknown-model');
      expect(modelInfo).toBeNull();
    });
  });

  describe('API Requests', () => {
    it('should make successful completion request', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'Hello! How can I help you today?'
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 9,
          completion_tokens: 12,
          total_tokens: 21
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const messages = [
        { role: 'user', content: 'Hello, AI!' }
      ];

      const result = await provider.generateCompletion(messages);

      expect(result.content).toBe('Hello! How can I help you today?');
      expect(result.model).toBe('gpt-4');
      expect(result.provider).toBe('openai');
      expect(result.tokens).toEqual({
        prompt: 9,
        completion: 12,
        total: 21
      });
    });

    it('should handle API key validation', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({
          error: {
            message: 'Invalid API key provided',
            type: 'invalid_request_error'
          }
        })
      });

      const messages = [{ role: 'user', content: 'Test' }];

      await expect(provider.generateCompletion(messages))
        .rejects.toThrow('Invalid API key provided');
    });

    it('should handle rate limiting', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 429,
        json: () => Promise.resolve({
          error: {
            message: 'Rate limit exceeded',
            type: 'rate_limit_exceeded'
          }
        })
      });

      const messages = [{ role: 'user', content: 'Test' }];

      await expect(provider.generateCompletion(messages))
        .rejects.toThrow('Rate limit exceeded');
    });

    it('should handle server errors', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({
          error: {
            message: 'Internal server error',
            type: 'server_error'
          }
        })
      });

      const messages = [{ role: 'user', content: 'Test' }];

      await expect(provider.generateCompletion(messages))
        .rejects.toThrow('Internal server error');
    });

    it('should handle network errors', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'));

      const messages = [{ role: 'user', content: 'Test' }];

      await expect(provider.generateCompletion(messages))
        .rejects.toThrow('Network error');
    });
  });

  describe('Request Formatting', () => {
         it('should format messages correctly', async () => {
       const mockResponse = {
         id: 'chatcmpl-123',
         model: 'gpt-4',
         choices: [{ message: { content: 'Response' }, finish_reason: 'stop' }],
         usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
       };

       fetch.mockResolvedValueOnce({
         ok: true,
         json: () => Promise.resolve(mockResponse)
       });

      const messages = [
        { role: 'system', content: 'You are a helpful assistant.' },
        { role: 'user', content: 'Hello!' },
        { role: 'assistant', content: 'Hi there!' },
        { role: 'user', content: 'How are you?' }
      ];

      await provider.generateCompletion(messages);

      const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
      
      expect(requestBody.messages).toEqual(messages);
      expect(requestBody.model).toBe('gpt-4o');
    });

         it('should include custom options in request', async () => {
       const mockResponse = {
         id: 'chatcmpl-123',
         model: 'gpt-3.5-turbo',
         choices: [{ message: { content: 'Response' }, finish_reason: 'stop' }],
         usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
       };

       fetch.mockResolvedValueOnce({
         ok: true,
         json: () => Promise.resolve(mockResponse)
       });

      const messages = [{ role: 'user', content: 'Test' }];
      const options = {
        model: 'gpt-3.5-turbo',
        temperature: 0.8,
        maxTokens: 100,
        topP: 0.9,
        frequencyPenalty: 0.1,
        presencePenalty: 0.1
      };

      await provider.generateCompletion(messages, options);

      const requestBody = JSON.parse(fetch.mock.calls[0][1].body);
      
      expect(requestBody.model).toBe('gpt-3.5-turbo');
      expect(requestBody.temperature).toBe(0.8);
      expect(requestBody.max_tokens).toBe(100);
      expect(requestBody.top_p).toBe(0.9);
      expect(requestBody.frequency_penalty).toBe(0.1);
      expect(requestBody.presence_penalty).toBe(0.1);
    });

         it('should handle function calling', async () => {
       const mockResponse = {
         id: 'chatcmpl-123',
         model: 'gpt-4',
         choices: [{
           message: {
             content: null,
             function_call: {
               name: 'get_weather',
               arguments: '{"location": "New York"}'
             }
           },
           finish_reason: 'function_call'
         }],
         usage: { prompt_tokens: 20, completion_tokens: 10, total_tokens: 30 }
       };

       fetch.mockResolvedValueOnce({
         ok: true,
         json: () => Promise.resolve(mockResponse)
       });

      const messages = [{ role: 'user', content: 'What\'s the weather in New York?' }];
      const options = {
        functions: [{
          name: 'get_weather',
          description: 'Get weather information',
          parameters: {
            type: 'object',
            properties: {
              location: { type: 'string' }
            }
          }
        }]
      };

      const result = await provider.generateCompletion(messages, options);

      expect(result.functionCall).toEqual({
        name: 'get_weather',
        arguments: { location: 'New York' }
      });
    });
  });

  describe('Cost Calculation', () => {
    it('should calculate cost for GPT-4o', () => {
      const tokens = { prompt: 1000, completion: 500 };
      const cost = provider.calculateCost(tokens, 'gpt-4o');

      // GPT-4o: $2.50 per 1M input, $10 per 1M output
      // (1000 * 2.50 + 500 * 10) / 1000000 = 0.00000775
      expect(cost).toBeCloseTo(0.0075, 4);
    });

    it('should calculate cost for GPT-3.5-turbo', () => {
      const tokens = { prompt: 1000, completion: 500 };
      const cost = provider.calculateCost(tokens, 'gpt-3.5-turbo');

      // GPT-3.5-turbo: $0.50 per 1M input, $1.50 per 1M output  
      // (1000 * 0.50 + 500 * 1.50) / 1000000 = 0.00000125
      expect(cost).toBeCloseTo(0.00125, 5);
    });

    it('should return 0 for unknown models', () => {
      const tokens = { prompt: 1000, completion: 500 };
      const cost = provider.calculateCost(tokens, 'unknown-model');

      expect(cost).toBe(0);
    });

    it('should handle cached input pricing', () => {
      const tokens = { prompt: 1000, cachedPrompt: 500, completion: 500 };
      const cost = provider.calculateCost(tokens, 'gpt-4.1');

      // Should calculate with cached input discount
      expect(cost).toBeGreaterThan(0);
    });

    it('should handle missing token data', () => {
      const cost = provider.calculateCost(null, 'gpt-4o');
      expect(cost).toBe(0);
    });
  });

  describe('Response Parsing', () => {
    it('should parse standard completion response', async () => {
      const mockResponse = {
        id: 'chatcmpl-123',
        object: 'chat.completion',
        created: 1677652288,
        model: 'gpt-4',
        choices: [{
          index: 0,
          message: {
            role: 'assistant',
            content: 'This is a test response.'
          },
          finish_reason: 'stop'
        }],
        usage: {
          prompt_tokens: 15,
          completion_tokens: 8,
          total_tokens: 23
        }
      };

      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      });

      const messages = [{ role: 'user', content: 'Test message' }];
      const result = await provider.generateCompletion(messages);

      expect(result).toEqual({
        content: 'This is a test response.',
        model: 'gpt-4',
        provider: 'openai',
        tokens: {
          prompt: 15,
          completion: 8,
          total: 23
        },
        finishReason: 'stop',
        id: 'chatcmpl-123'
      });
    });

    it('should handle streaming responses', async () => {
      // Mock streaming response
      const mockResponse = {
        ok: true,
        body: {
          getReader: () => ({
            read: jest.fn()
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n')
              })
              .mockResolvedValueOnce({
                done: false,
                value: new TextEncoder().encode('data: {"choices":[{"delta":{"content":" world"}}]}\n\n')
              })
              .mockResolvedValueOnce({
                done: true
              })
          })
        }
      };

      fetch.mockResolvedValueOnce(mockResponse);

      const messages = [{ role: 'user', content: 'Test streaming' }];
      const options = { stream: true };

      const result = await provider.generateCompletion(messages, options);

      expect(result.content).toBe('Hello world');
      expect(result.streamed).toBe(true);
    });
  });

  describe('Error Handling', () => {
    it('should sanitize API keys in error messages', async () => {
      fetch.mockRejectedValueOnce(new Error('API key sk-test-key-12345 is invalid'));

      const messages = [{ role: 'user', content: 'Test' }];

      try {
        await provider.generateCompletion(messages);
      } catch (error) {
        expect(error.message).not.toContain('sk-test-key-12345');
        expect(error.message).toContain('[REDACTED]');
      }
    });

    it('should handle malformed API responses', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve({ invalid: 'response' })
      });

      const messages = [{ role: 'user', content: 'Test' }];

      await expect(provider.generateCompletion(messages))
        .rejects.toThrow('Invalid response format');
    });

         it('should handle empty response content', async () => {
       const mockResponse = {
         id: 'chatcmpl-123',
         model: 'gpt-4',
         choices: [{ message: { content: '' }, finish_reason: 'stop' }],
         usage: { prompt_tokens: 10, completion_tokens: 0, total_tokens: 10 }
       };

       fetch.mockResolvedValueOnce({
         ok: true,
         json: () => Promise.resolve(mockResponse)
       });

      const messages = [{ role: 'user', content: 'Test' }];
      const result = await provider.generateCompletion(messages);

      expect(result.content).toBe('');
      expect(result.tokens.completion).toBe(0);
    });
  });

  describe('Integration Tests', () => {
    it('should work with the BaseProvider interface', () => {
      expect(provider.config.name).toBe('openai');
      expect(typeof provider.generateCompletion).toBe('function');
      expect(typeof provider.getUsageStats).toBe('function');
      expect(typeof provider.resetUsageStats).toBe('function');
    });

         it('should track usage across multiple requests', async () => {
       const mockResponse = {
         id: 'chatcmpl-123',
         model: 'gpt-4',
         choices: [{ message: { content: 'Response' }, finish_reason: 'stop' }],
         usage: { prompt_tokens: 10, completion_tokens: 5, total_tokens: 15 }
       };

       fetch.mockResolvedValue({
         ok: true,
         json: () => Promise.resolve(mockResponse)
       });

      const messages = [{ role: 'user', content: 'Test' }];

      await provider.generateCompletion(messages);
      await provider.generateCompletion(messages);

      const usage = provider.getUsageStats();
      
      expect(usage.totalRequests).toBe(2);
      expect(usage.totalTokens).toBe(30);
    });

    it('should validate message format before sending', async () => {
      const invalidMessages = [
        { content: 'Missing role' }
      ];

      await expect(provider.generateCompletion(invalidMessages))
        .rejects.toThrow('Invalid message format');
    });
  });
}); 