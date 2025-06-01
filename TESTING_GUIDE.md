# Testing Guide for Agentic AI Flow Visualizer

## Overview
This guide explains how tests work in this project and how to effectively work with AI assistants (like Claude) to maintain and expand the test suite.

## Table of Contents
1. [Testing Infrastructure](#testing-infrastructure)
2. [Running Tests](#running-tests)
3. [Understanding Test Structure](#understanding-test-structure)
4. [Working with AI Assistants](#working-with-ai-assistants)
5. [Test-Driven Development (TDD) Workflow](#test-driven-development-tdd-workflow)
6. [Debugging Failed Tests](#debugging-failed-tests)
7. [Best Practices](#best-practices)

## Testing Infrastructure

### Test Framework
- **Jest**: JavaScript testing framework
- **React Testing Library**: For testing React components
- **jest-dom**: Custom Jest matchers for DOM assertions

### Key Configuration Files
- `jest.config.js`: Main Jest configuration
- `jest.setup.js`: Test environment setup and global mocks
- `package.json`: Test scripts

### Test File Locations
Tests are organized alongside the code they test:
```
app/
├── services/
│   ├── profileService.js
│   ├── markdownService.js
│   └── __tests__/
│       ├── profileService.test.js
│       └── markdownService.test.js
├── components/
│   └── __tests__/
└── utils/
    └── __tests__/
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests for a specific file
npm test profileService.test.js

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Understanding Test Output
- ✅ Green checks indicate passing tests
- ❌ Red X's indicate failing tests
- Console warnings/errors during tests are often expected (testing error cases)

## Understanding Test Structure

### Anatomy of a Test File
```javascript
// Import the module to test
import { ProfileService } from '../profileService';

// Mock dependencies
jest.mock('../markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn()
  }
}));

// Test suite
describe('ProfileService', () => {
  // Setup before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  // Nested test suite for a specific method
  describe('createProfile', () => {
    // Individual test case
    it('should create a profile with unique ID', async () => {
      // Arrange - set up test data
      const mockData = { companyName: 'Test Corp' };
      
      // Act - perform the action
      const result = await ProfileService.createProfile(mockData);
      
      // Assert - verify the outcome
      expect(result.companyName).toBe('Test Corp');
      expect(result.id).toBeTruthy();
    });
  });
});
```

### Common Jest Matchers
```javascript
// Equality
expect(value).toBe(expected)          // Strict equality (===)
expect(value).toEqual(expected)       // Deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThanOrEqual(4.5)

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objects
expect(object).toHaveProperty('key', 'value')
expect(object).toMatchObject({ subset: 'of properties' })

// Exceptions
expect(() => throwingFunction()).toThrow()
expect(() => throwingFunction()).toThrow('error message')
```

## Working with AI Assistants

### Providing Context to AI
When starting a new conversation with an AI assistant who doesn't have context:

1. **Reference this guide**:
   ```
   "I'm working on the Agentic AI Flow Visualizer project. 
   Please check the TESTING_GUIDE.md file for context on our testing approach."
   ```

2. **Share relevant files**:
   - The test file you're working on
   - The implementation file being tested
   - Related service/utility files
   - jest.config.js if configuration is relevant

3. **Describe the current state**:
   ```
   "We have 45 tests passing (25 for ProfileService, 20 for MarkdownService).
   I need help adding tests for the FlowService."
   ```

### Effective Prompts for Test Development

#### For Writing New Tests:
```
"I need to add tests for the FlowService.generateFlow() method.
It takes a profile object and returns flow data.
Please create comprehensive tests covering:
1. Happy path with valid data
2. Edge cases (empty data, missing fields)
3. Error scenarios
Follow the existing test patterns in profileService.test.js"
```

#### For Debugging Failed Tests:
```
"The test 'should parse company overview section' is failing.
Expected: { companyName: 'Test Corp', industry: 'Healthcare' }
Received: { companyName: 'Test Corp' }

The parseCompanyOverview method uses extractSection to get markdown content.
Help me debug why other fields aren't being extracted."
```

#### For Refactoring Tests:
```
"Our ProfileService tests have repetitive setup code.
Can you help refactor using a factory function or test utilities
while maintaining the same test coverage?"
```

### Key Information to Share

1. **Test Dependencies**: Which services/utilities are mocked
2. **Test Data Structure**: Shape of objects being tested
3. **Business Logic**: What the code should do
4. **Error Messages**: Exact test failure output
5. **Recent Changes**: What was modified that might affect tests

## Test-Driven Development (TDD) Workflow

### 1. Write the Test First
```javascript
it('should calculate ROI based on profile impact', () => {
  const profile = {
    valueSellingFramework: {
      impact: { totalAnnualImpact: 1000000 }
    }
  };
  
  const roi = ProfileService.calculateROI(profile);
  
  expect(roi).toBe(300); // 300% ROI expectation
});
```

### 2. Run Test (Expect Failure)
```bash
npm test profileService.test.js
# Test fails: calculateROI is not a function
```

### 3. Implement Minimal Code
```javascript
static calculateROI(profile) {
  const impact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
  return Math.round((impact / 333333) * 100); // Simple calculation
}
```

### 4. Run Test Again (Should Pass)
```bash
npm test profileService.test.js
# Test passes!
```

### 5. Refactor if Needed
Improve implementation while keeping tests green.

## Debugging Failed Tests

### Common Issues and Solutions

1. **Regex Pattern Issues**
   ```javascript
   // Debug regex by creating test script
   const testRegex = () => {
     const pattern = /your-pattern/;
     const testString = "your test string";
     console.log(pattern.test(testString));
   };
   ```

2. **Async/Await Issues**
   ```javascript
   // Always use async/await for async tests
   it('should handle async operations', async () => {
     const result = await asyncFunction();
     expect(result).toBe(expected);
   });
   ```

3. **Mock Not Working**
   ```javascript
   // Ensure mocks are cleared between tests
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

4. **State Pollution Between Tests**
   ```javascript
   // Clear shared state
   beforeEach(() => {
     localStorage.clear();
     // Reset any module-level variables
   });
   ```

### Debug Techniques

1. **Add Console Logs**
   ```javascript
   it('should extract data', () => {
     const input = "test data";
     console.log('Input:', input);
     
     const result = extractData(input);
     console.log('Result:', result);
     
     expect(result).toBe(expected);
   });
   ```

2. **Use Jest's Inline Snapshots**
   ```javascript
   expect(complexObject).toMatchInlineSnapshot();
   // Jest will fill in the snapshot on first run
   ```

3. **Focus on Single Test**
   ```javascript
   it.only('should focus on this test', () => {
     // Only this test runs
   });
   ```

4. **Skip Problematic Tests Temporarily**
   ```javascript
   it.skip('should skip this test', () => {
     // This test won't run
   });
   ```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain what and why
- Follow the Arrange-Act-Assert pattern

### 2. Test Data
- Use factories or builders for complex test data
- Keep test data minimal but realistic
- Don't share mutable test data between tests

### 3. Mocking
- Mock external dependencies (APIs, databases)
- Don't mock the thing you're testing
- Use `jest.fn()` for function mocks
- Clear mocks between tests

### 4. Assertions
- Test one thing per test
- Use specific matchers (toBe vs toEqual)
- Test both positive and negative cases
- Include edge cases

### 5. Performance
- Keep tests fast (mock slow operations)
- Use `beforeAll` for expensive setup
- Parallelize independent tests

### 6. Maintenance
- Update tests when requirements change
- Remove obsolete tests
- Refactor tests along with code
- Keep test coverage above thresholds

## Coverage Thresholds

Current thresholds (in jest.config.js):
- Branches: 60%
- Functions: 60%
- Lines: 60%
- Statements: 60%

Run `npm run test:coverage` to see current coverage.

## Component Testing (Next Steps)

For React components, use React Testing Library:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from '../ProfileCard';

describe('ProfileCard', () => {
  it('should display company name', () => {
    const profile = { companyName: 'Test Corp' };
    
    render(<ProfileCard profile={profile} />);
    
    expect(screen.getByText('Test Corp')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const handleClick = jest.fn();
    
    render(<ProfileCard onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Integration Testing (Future)

For testing multiple services together:

```javascript
describe('Profile to Timeline Integration', () => {
  it('should generate timeline from profile', async () => {
    // Create profile
    const profile = await ProfileService.createProfile(mockData);
    
    // Generate timeline
    const timeline = await TimelineService.generateFromProfile(profile);
    
    // Verify integration
    expect(timeline.companyName).toBe(profile.companyName);
    expect(timeline.phases).toHaveLength(4);
  });
});
```

## E2E Testing (Future)

Consider Playwright or Cypress for end-to-end tests:

```javascript
describe('Profile Creation Flow', () => {
  it('should create profile through UI', async () => {
    await page.goto('/profiles');
    await page.click('button:has-text("New Profile")');
    await page.fill('#companyName', 'Test Corp');
    await page.click('button:has-text("Save")');
    
    await expect(page).toHaveURL('/profiles/test-corp-*');
  });
});
```

## Troubleshooting

### Common Error Messages

1. **"Cannot find module"**
   - Check import paths
   - Verify module aliases in jest.config.js

2. **"Timeout - Async callback was not invoked"**
   - Add `async/await` to test
   - Increase timeout: `jest.setTimeout(10000)`

3. **"Invalid hook call"**
   - Hooks can only be called in React components
   - Mock hooks or use React Testing Library

4. **"ReferenceError: window is not defined"**
   - Add mock to jest.setup.js
   - Use jsdom environment

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TDD Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

Remember: Tests are living documentation. They should clearly communicate what the code does and why it matters. 