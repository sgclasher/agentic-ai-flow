import { markdownService } from '../markdownService';

describe('MarkdownService', () => {
  describe('generateMarkdown', () => {
    it('should generate complete markdown with all sections', () => {
      const profileData = {
        companyName: 'Test Corp',
        industry: 'Technology',
        size: '51-200 employees',
        annualRevenue: '10M',
        employeeCount: '150',
        primaryLocation: 'San Francisco, CA',
        valueSellingFramework: {
          businessIssues: ['Revenue Growth Pressure', 'Cost Reduction Mandate'],
          businessIssueOther: 'Custom issue',
          businessIssueDetails: 'Detailed description of issues',
          problems: {
            finance: {
              'Manual invoice processing taking [X] days': true
            }
          },
          impact: {
            totalAnnualImpact: '1000000'
          }
        },
        aiOpportunityAssessment: {
          aiReadinessScore: 7,
          opportunities: [{
            name: 'Invoice Automation',
            department: 'Finance',
            estimatedImpact: '250000'
          }]
        },
        summary: {
          currentState: 'Current challenges',
          recommendedApproach: 'Recommended solution'
        },
        createdBy: 'John Doe'
      };

      const markdown = markdownService.generateMarkdown(profileData);

      expect(markdown).toContain('# Client Profile: Test Corp');
      expect(markdown).toContain('## Company Overview');
      expect(markdown).toContain('- **Company Name**: Test Corp');
      expect(markdown).toContain('- **Industry**: Technology');
      expect(markdown).toContain('## Value Selling Framework');
      expect(markdown).toContain('- [x] Revenue Growth Pressure');
      expect(markdown).toContain('- [x] Cost Reduction Mandate');
      expect(markdown).toContain('## AI/Automation Opportunity Assessment');
      expect(markdown).toContain('### AI Readiness Score: 7/10');
      expect(markdown).toContain('*Created by: John Doe*');
    });

    it('should handle missing data gracefully', () => {
      const minimalData = {
        companyName: 'Minimal Corp'
      };

      const markdown = markdownService.generateMarkdown(minimalData);

      expect(markdown).toContain('# Client Profile: Minimal Corp');
      expect(markdown).toContain('[Enter industry]');
      expect(markdown).toContain('[Enter amount]');
      expect(markdown).not.toContain('undefined');
      expect(markdown).not.toContain('null');
    });
  });

  describe('generateCheckboxList', () => {
    it('should generate checkbox list with selected items marked', () => {
      const items = ['Option 1', 'Option 2', 'Option 3'];
      const selected = ['Option 1', 'Option 3'];

      const result = markdownService.generateCheckboxList(items, selected);

      expect(result).toBe('- [x] Option 1\n- [ ] Option 2\n- [x] Option 3');
    });

    it('should handle empty selected array', () => {
      const items = ['Option 1', 'Option 2'];
      
      const result = markdownService.generateCheckboxList(items, []);

      expect(result).toBe('- [ ] Option 1\n- [ ] Option 2');
    });

    it('should handle undefined selected array', () => {
      const items = ['Option 1', 'Option 2'];
      
      const result = markdownService.generateCheckboxList(items);

      expect(result).toBe('- [ ] Option 1\n- [ ] Option 2');
    });
  });

  describe('generateDepartmentProblems', () => {
    it('should generate finance department problems correctly', () => {
      const problems = {
        'Manual invoice processing taking [X] days': true,
        '[X]% error rate in financial processes': false
      };

      const result = markdownService.generateDepartmentProblems('finance', problems);

      expect(result).toContain('- [x] Manual invoice processing taking [X] days');
      expect(result).toContain('- [ ] [X]% error rate in financial processes');
      expect(result).toContain('- [ ] Other: [Specify]');
    });

    it('should handle unknown department', () => {
      const result = markdownService.generateDepartmentProblems('unknown', {});

      expect(result).toBe('- [ ] Other: [Specify]');
    });
  });

  describe('generateAIOpportunities', () => {
    it('should generate AI opportunities list', () => {
      const opportunities = [
        {
          name: 'Invoice Automation',
          department: 'Finance',
          process: 'Invoice processing',
          currentState: 'Manual entry',
          aiSolution: 'OCR and ML',
          estimatedImpact: '250000',
          implementationEffort: 'Medium',
          timeline: '3 months',
          priorityScore: '8'
        }
      ];

      const result = markdownService.generateAIOpportunities(opportunities);

      expect(result).toContain('#### Opportunity 1: Invoice Automation');
      expect(result).toContain('- **Department**: Finance');
      expect(result).toContain('- **Estimated Impact**: $250000');
      expect(result).toContain('- **Priority Score**: 8/10');
    });

    it('should provide template for empty opportunities', () => {
      const result = markdownService.generateAIOpportunities([]);

      expect(result).toContain('#### Opportunity 1: [Name]');
      expect(result).toContain('- **Department**: [Department]');
    });
  });

  describe('parseMarkdown', () => {
    it('should parse company name from markdown', () => {
      const markdown = `# Client Profile: Test Company

## Company Overview
- **Company Name**: Test Company
- **Industry**: Technology`;

      const result = markdownService.parseMarkdown(markdown);

      expect(result.companyName).toBe('Test Company');
    });

    it('should parse company overview section', () => {
      const markdown = `# Client Profile: Test Corp

## Company Overview
- **Company Name**: Test Corp
- **Industry**: Healthcare
- **Size**: 201-1000 employees
- **Annual Revenue**: $50M
- **Employee Count**: 500
- **Primary Location**: New York, NY`;

      const result = markdownService.parseMarkdown(markdown);

      expect(result.companyOverview).toEqual({
        companyName: 'Test Corp',
        industry: 'Healthcare',
        size: '201-1000 employees',
        annualRevenue: '50M',
        employeeCount: '500',
        primaryLocation: 'New York, NY'
      });
    });

    it('should handle parsing errors gracefully', () => {
      const invalidMarkdown = 'This is not valid markdown format';

      expect(() => {
        markdownService.parseMarkdown(invalidMarkdown);
      }).toThrow();
    });
  });

  describe('generateHeader', () => {
    it('should generate header with company name', () => {
      const data = { companyName: 'Acme Corp' };
      
      const result = markdownService.generateHeader(data);

      expect(result).toBe('# Client Profile: Acme Corp');
    });

    it('should handle missing company name', () => {
      const data = {};
      
      const result = markdownService.generateHeader(data);

      expect(result).toBe('# Client Profile: [Client Name]');
    });
  });

  describe('generateCompanyOverview', () => {
    it('should generate complete company overview', () => {
      const data = {
        companyName: 'Tech Co',
        industry: 'Technology',
        size: '1000+ employees',
        annualRevenue: '100M',
        employeeCount: '1500',
        primaryLocation: 'Austin, TX'
      };

      const result = markdownService.generateCompanyOverview(data);

      expect(result).toContain('## Company Overview');
      expect(result).toContain('- **Company Name**: Tech Co');
      expect(result).toContain('- **Industry**: Technology');
      expect(result).toContain('- **Size**: 1000+ employees');
      expect(result).toContain('- **Annual Revenue**: $100M');
      expect(result).toContain('- **Employee Count**: 1500');
      expect(result).toContain('- **Primary Location**: Austin, TX');
    });
  });

  describe('generateValueSellingFramework', () => {
    it('should generate complete value selling framework section', () => {
      const data = {
        valueSellingFramework: {
          businessIssues: ['Revenue Growth Pressure'],
          impact: {
            laborCosts: '500000',
            totalAnnualImpact: '1000000'
          },
          solutionCapabilities: ['Automate document processing'],
          successMetrics: ['Process cycle time reduction']
        }
      };

      const result = markdownService.generateValueSellingFramework(data);

      expect(result).toContain('## Value Selling Framework');
      expect(result).toContain('### 1. Business Issue');
      expect(result).toContain('- [x] Revenue Growth Pressure');
      expect(result).toContain('### 4. Impact');
      expect(result).toContain('Labor costs from manual processes: $500000');
      expect(result).toContain('**Total Estimated Annual Impact**: $1000000');
    });
  });

  describe('generateSummary', () => {
    it('should generate summary section', () => {
      const data = {
        summary: {
          currentState: 'Current challenges description',
          recommendedApproach: 'Recommended approach description',
          expectedValue: {
            threeYearBenefit: '3000000',
            investment: '1000000',
            netROI: '200',
            paybackPeriod: '12'
          },
          nextSteps: [
            { action: 'Initial assessment', owner: 'John Doe', date: '2024-01-15' }
          ],
          notes: 'Additional notes here'
        }
      };

      const result = markdownService.generateSummary(data);

      expect(result).toContain('## Summary & Next Steps');
      expect(result).toContain('**Current State**: Current challenges description');
      expect(result).toContain('**Recommended Approach**: Recommended approach description');
      expect(result).toContain('Total 3-year benefit: $3000000');
      expect(result).toContain('1. [ ] Initial assessment - John Doe - 2024-01-15');
      expect(result).toContain('Additional notes here');
    });
  });

  describe('extractSection', () => {
    it('should extract section content by heading', () => {
      const markdown = `# Title

## Section 1
Content of section 1

## Section 2
Content of section 2

## Section 3
Content of section 3`;

      const result = markdownService.extractSection(markdown, '## Section 2');

      expect(result.trim()).toBe('Content of section 2');
    });

    it('should return empty string if section not found', () => {
      const markdown = '# Title\n\n## Other Section\nContent';

      const result = markdownService.extractSection(markdown, '## Missing Section');

      expect(result).toBe('');
    });
  });

  describe('sanitizeString', () => {
    it('should handle null and undefined inputs', () => {
      const data = {
        companyName: null,
        industry: undefined
      };

      const markdown = markdownService.generateMarkdown(data);

      expect(markdown).toContain('[Client Name]');
      expect(markdown).toContain('[Enter industry]');
      expect(markdown).not.toContain('null');
      expect(markdown).not.toContain('undefined');
    });
  });
}); 