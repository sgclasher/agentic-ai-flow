# Testing Workflow for Agentic AI Flow Visualizer

## Quick Summary

✅ **All tests are now working!** 45 tests passing (25 ProfileService, 20 MarkdownService)

## How Our Tests Work

### Testing Infrastructure
- **Jest**: Testing framework configured with Next.js
- **React Testing Library**: For component testing (future)
- **Coverage thresholds**: 60% for all metrics (currently not met, needs more tests)

### Test Structure
```
app/services/__tests__/
├── profileService.test.js    # 25 tests for ProfileService
└── markdownService.test.js   # 20 tests for MarkdownService
```

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode for development
npm run test:coverage   # Run with coverage report
```

## Working with AI Assistants on Tests

### When Starting a New Chat

1. **Share Context**:
   - "I have a Next.js app with Jest tests"
   - "Check TESTING_GUIDE.md and TESTING_WORKFLOW.md for test setup"
   - "We have 45 passing tests for ProfileService and MarkdownService"
   - "Using Windows with SWC binary issues resolved"

2. **Common Tasks to Request**:
   - "Add tests for [ServiceName]"
   - "Debug failing test [test name]"
   - "Improve test coverage for [module]"
   - "Add component tests using React Testing Library"

### Debugging Test Issues

#### Windows SWC Binary Issue (Resolved)
If you encounter SWC binary loading errors:
```bash
npm install --save-dev @next/swc-win32-x64-msvc
```

Our solution: We installed the Windows-specific SWC binary and configured babel-jest as a fallback.

#### Common Test Patterns

**Service Tests**:
```javascript
describe('ServiceName', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  it('should do something', async () => {
    // Arrange
    const input = { data: 'test' };
    
    // Act
    const result = await Service.method(input);
    
    // Assert
    expect(result).toEqual(expected);
  });
});
```

**Mocking Dependencies**:
```javascript
jest.mock('../otherService', () => ({
  otherService: {
    method: jest.fn()
  }
}));
```

### Test Coverage Strategy

Current coverage is low (12.77%) because we only have tests for 2 services. Priority areas for new tests:

1. **Utils** (0% coverage):
   - `transformAgenticData.js` - Critical for flow visualization
   - `validation.js` - Important for security
   - `layoutGraph.js` - Core layout logic

2. **Hooks** (0% coverage):
   - `useFlowData.js`
   - `useFlowLayout.js`

3. **Components** (0% coverage):
   - Start with simple components like `NodeIcons.js`
   - Move to complex ones like `FlowVisualizer.js`

### Practical Tips for AI Assistants

1. **Start Simple**: Begin with utility functions before tackling components
2. **Mock External Dependencies**: Always mock API calls, localStorage, etc.
3. **Test Business Logic**: Focus on testing logic, not implementation details
4. **Use Existing Patterns**: Follow patterns from existing test files

### Example Prompts for AI Assistants

1. **Adding New Tests**:
   ```
   "Please add tests for the transformAgenticData utility function. 
   It transforms ServiceNow data into React Flow nodes. 
   Follow the pattern in profileService.test.js"
   ```

2. **Debugging Failed Tests**:
   ```
   "This test is failing with [error message]. 
   The test expects X but receives Y. 
   Here's the implementation and test code..."
   ```

3. **Improving Coverage**:
   ```
   "Current coverage is 12.77%. 
   Please add tests for validation.js focusing on:
   - validateInstanceUrl
   - validateBusinessProfile
   - checkRateLimit"
   ```

### Key Insights from Our Testing Journey

1. **Regex Issues**: The `extractSection` regex needed the 'm' flag removed to work correctly
2. **Nested Properties**: Use optional chaining for nested data access (e.g., `profile.aiOpportunityAssessment?.aiReadinessScore`)
3. **Mock Carefully**: Ensure mocks match the actual implementation's behavior
4. **Debug Scripts**: Create temporary debug scripts to understand complex issues

### Next Steps for Testing

1. **Immediate** (Next PR):
   - Add tests for `transformAgenticData.js`
   - Add tests for `validation.js`
   - Target 30% coverage

2. **Short-term**:
   - Add component tests with React Testing Library
   - Test Zustand stores
   - Target 60% coverage

3. **Long-term**:
   - Add E2E tests with Playwright
   - Integration tests for API routes
   - Target 80% coverage

### Troubleshooting Checklist

- [ ] SWC binary installed? (`@next/swc-win32-x64-msvc`)
- [ ] Jest cache cleared? (`jest --clearCache`)
- [ ] Node modules fresh? (`rm -rf node_modules && npm install`)
- [ ] Mocks properly cleared between tests?
- [ ] Using correct Node version? (18+)

### Resources

- **Project Docs**: `TESTING_GUIDE.md` (comprehensive guide)
- **Jest Config**: `jest.config.js` (current setup)
- **Test Examples**: `app/services/__tests__/` (working patterns)

---

Remember: Tests are documentation. Write them clearly so future developers (and AI assistants) understand the intended behavior. 