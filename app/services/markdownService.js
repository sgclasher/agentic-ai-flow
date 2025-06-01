'use client';

/**
 * Markdown Service for Client Profiles
 * 
 * Converts structured profile data to/from markdown format.
 * This prevents AI hallucinations by maintaining structured, parseable format.
 */

export const markdownService = {
  /**
   * Generate structured markdown from profile data
   * @param {Object} profileData - Structured profile data from forms
   * @returns {string} Formatted markdown content
   */
  generateMarkdown(profileData) {
    const sections = [
      this.generateHeader(profileData),
      this.generateCompanyOverview(profileData),
      this.generateValueSellingFramework(profileData),
      this.generateAIOpportunityAssessment(profileData),
      this.generateSummary(profileData)
    ];

    return sections.filter(section => section).join('\n\n---\n\n');
  },

  /**
   * Parse markdown back to structured data
   * @param {string} markdown - Markdown content
   * @returns {Object} Structured profile data
   */
  parseMarkdown(markdown) {
    try {
      const data = {};
      
      // Extract company name from header
      const nameMatch = markdown.match(/^# Client Profile: (.+)$/m);
      if (nameMatch) {
        data.companyName = nameMatch[1];
      } else {
        throw new Error('Invalid markdown format: missing client profile header');
      }
      
      // Parse company overview section
      data.companyOverview = this.parseCompanyOverview(markdown);
      
      // Parse value selling framework
      // data.valueSellingFramework = this.parseValueSellingFramework(markdown);
      
      // Parse AI opportunities
      // data.aiOpportunities = this.parseAIOpportunities(markdown);
      
      return data;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      throw error;
    }
  },

  generateHeader(data) {
    return `# Client Profile: ${data.companyName || '[Client Name]'}`;
  },

  generateCompanyOverview(data) {
    return `## Company Overview
- **Company Name**: ${data.companyName || '[Enter company name]'}
- **Industry**: ${data.industry || '[Enter industry]'}
- **Size**: ${data.size || '[Small (50-500) / Mid-Market (500-5K) / Enterprise (5K+)]'}
- **Annual Revenue**: $${data.annualRevenue || '[Enter amount]'}
- **Employee Count**: ${data.employeeCount || '[Enter number]'}
- **Primary Location**: ${data.primaryLocation || '[Enter location]'}

---`;
  },

  generateValueSellingFramework(data) {
    const framework = data.valueSellingFramework || {};
    let content = '## Value Selling Framework\n\n';

    // 1. Business Issue
    content += '### 1. Business Issue\n';
    content += '**High-level strategic priority or C-level concern:**\n';
    
    if (framework.businessIssues?.length > 0) {
      framework.businessIssues.forEach(issue => {
        content += `- [x] ${issue}\n`;
      });
    }
    
    if (framework.businessIssuesOther) {
      content += `- [x] Other: ${framework.businessIssuesOther}\n`;
    }
    
    if (framework.businessIssueDetails) {
      content += `\n**Details**: ${framework.businessIssueDetails}\n`;
    }

    // 2. Problems / Challenges
    content += '\n### 2. Problems / Challenges\n';
    content += '**Specific operational issues identified:**\n\n';

    // Department-specific problems
    const departments = [
      { key: 'finance', name: 'Finance Department' },
      { key: 'hr', name: 'HR Department' },
      { key: 'it', name: 'IT Department' },
      { key: 'customerService', name: 'Customer Service' },
      { key: 'operations', name: 'Operations' }
    ];

    departments.forEach(dept => {
      const problems = framework.departmentalProblems?.[dept.key] || [];
      if (problems.length > 0) {
        content += `#### ${dept.name}\n`;
        problems.forEach(problem => {
          content += `- [x] ${problem}\n`;
        });
        content += '\n';
      }
    });

    if (framework.additionalChallenges) {
      content += `**Additional Challenges**: ${framework.additionalChallenges}\n`;
    }

    // 3. Root Cause
    content += '\n### 3. Root Cause\n';
    content += '**Why do these challenges exist?**\n';
    
    if (framework.rootCauses?.length > 0) {
      framework.rootCauses.forEach(cause => {
        content += `- [x] ${cause}\n`;
      });
    }
    
    if (framework.rootCausesOther) {
      content += `- [x] Other: ${framework.rootCausesOther}\n`;
    }
    
    if (framework.rootCauseDetails) {
      content += `\n**Details**: ${framework.rootCauseDetails}\n`;
    }

    // 4. Impact
    content += '\n### 4. Impact\n';
    content += '**Quantified effects:**\n\n';
    
    content += '#### Hard Costs (Annual)\n';
    const hardCosts = framework.hardCosts || {};
    content += `- Labor costs from manual processes: $${hardCosts.laborCosts || '[Amount]'}\n`;
    content += `- Error correction costs: $${hardCosts.errorCosts || '[Amount]'}\n`;
    content += `- System downtime costs: $${hardCosts.downtimeCosts || '[Amount]'}\n`;
    content += `- Compliance penalties/risk: $${hardCosts.complianceCosts || '[Amount]'}\n`;
    
    const totalHardCosts = Object.values(hardCosts).reduce((sum, cost) => {
      const num = parseFloat(cost) || 0;
      return sum + num;
    }, 0);
    
    content += `- **Total Hard Costs**: $${totalHardCosts > 0 ? totalHardCosts.toLocaleString() : '[Sum]'}\n\n`;
    
    content += '#### Soft Costs\n';
    const softCosts = framework.softCosts || {};
    content += `- Employee frustration/turnover impact: ${softCosts.employeeFrustration || '[High/Medium/Low]'}\n`;
    content += `- Customer satisfaction decline: ${softCosts.customerSatisfaction || '[High/Medium/Low]'}\n`;
    content += `- Competitive disadvantage: ${softCosts.competitiveDisadvantage || '[High/Medium/Low]'}\n`;
    content += `- Missed opportunities/growth: ${softCosts.missedOpportunities || '[High/Medium/Low]'}\n`;

    // 5. Solution
    content += '\n### 5. Solution\n';
    content += '**Capabilities needed to solve these challenges:**\n';
    
    if (framework.solutionCapabilities?.length > 0) {
      framework.solutionCapabilities.forEach(capability => {
        content += `- [x] ${capability}\n`;
      });
    }
    
    if (framework.solutionCapabilitiesOther) {
      content += `- [x] Other: ${framework.solutionCapabilitiesOther}\n`;
    }

    content += '\n**Differentiation Requirements:**\n';
    if (framework.differentiationRequirements?.length > 0) {
      framework.differentiationRequirements.forEach(requirement => {
        content += `- [x] ${requirement}\n`;
      });
    }
    
    if (framework.differentiationOther) {
      content += `- [x] Other: ${framework.differentiationOther}\n`;
    }

    // Value/ROI Expectations
    content += '\n**Value / ROI Expectations:**\n';
    const roiExpectations = framework.roiExpectations || {};
    if (roiExpectations.costReduction) content += `- Target cost reduction: ${roiExpectations.costReduction}\n`;
    if (roiExpectations.efficiencyImprovement) content += `- Target efficiency improvement: ${roiExpectations.efficiencyImprovement}\n`;
    if (roiExpectations.paybackPeriod) content += `- Expected payback period: ${roiExpectations.paybackPeriod}\n`;
    if (roiExpectations.targetROI) content += `- Target ROI: ${roiExpectations.targetROI}\n`;
    if (roiExpectations.timeToFirstValue) content += `- Time to first value: ${roiExpectations.timeToFirstValue}\n`;

    // Success Metrics
    content += '\n**Success Metrics:**\n';
    if (framework.successMetrics?.length > 0) {
      framework.successMetrics.forEach(metric => {
        content += `- [x] ${metric}\n`;
      });
    }
    
    if (framework.successMetricsTargets) {
      content += `\n**Specific Targets**: ${framework.successMetricsTargets}\n`;
    }

    // 6. Decision
    content += '\n### 6. Decision\n';
    content += '**Decision makers and buying process:**\n\n';
    
    const decisionMakers = framework.decisionMakers || {};
    
    content += '#### Key Decision Makers\n';
    if (decisionMakers.economicBuyer?.name) {
      content += `**Economic Buyer**: ${decisionMakers.economicBuyer.name}`;
      if (decisionMakers.economicBuyer.title) content += ` (${decisionMakers.economicBuyer.title})`;
      if (decisionMakers.economicBuyer.budget) content += ` - Budget Authority: $${parseInt(decisionMakers.economicBuyer.budget).toLocaleString()}`;
      content += '\n';
    }
    
    if (decisionMakers.technicalBuyer?.name) {
      content += `**Technical Buyer**: ${decisionMakers.technicalBuyer.name}`;
      if (decisionMakers.technicalBuyer.title) content += ` (${decisionMakers.technicalBuyer.title})`;
      content += '\n';
    }
    
    if (decisionMakers.champion?.name) {
      content += `**Champion**: ${decisionMakers.champion.name}`;
      if (decisionMakers.champion.title) content += ` (${decisionMakers.champion.title})`;
      content += '\n';
    }
    
    if (decisionMakers.influencers) {
      content += `**Influencers**: ${decisionMakers.influencers}\n`;
    }

    content += '\n#### Buying Process\n';
    const buyingProcess = framework.buyingProcess || {};
    if (buyingProcess.timeline) content += `- **Decision timeline**: ${buyingProcess.timeline}\n`;
    if (buyingProcess.budgetCycle) content += `- **Budget cycle**: ${buyingProcess.budgetCycle}\n`;
    
    if (buyingProcess.evaluationCriteria?.length > 0) {
      content += '- **Evaluation criteria**:\n';
      buyingProcess.evaluationCriteria.forEach(criteria => {
        content += `  - ${criteria}\n`;
      });
    }
    
    if (buyingProcess.evaluationOther) {
      content += `  - ${buyingProcess.evaluationOther}\n`;
    }

    // Risks of Inaction
    content += '\n#### Risks of Inaction\n';
    const risksOfInaction = framework.risksOfInaction || {};
    if (risksOfInaction.costEscalation) {
      content += `- **Continued cost escalation**: $${parseInt(risksOfInaction.costEscalation).toLocaleString()} annually\n`;
    }
    if (risksOfInaction.employeeAttrition) {
      content += `- **Employee attrition risk**: ${risksOfInaction.employeeAttrition}\n`;
    }
    if (risksOfInaction.threeYearCost) {
      content += `- **Estimated cost of inaction (3 years)**: $${parseInt(risksOfInaction.threeYearCost).toLocaleString()}\n`;
    }
    if (risksOfInaction.competitiveDisadvantage) {
      content += `- **Competitive disadvantage**: ${risksOfInaction.competitiveDisadvantage}\n`;
    }
    if (risksOfInaction.customerSatisfaction) {
      content += `- **Customer satisfaction decline**: ${risksOfInaction.customerSatisfaction}\n`;
    }
    if (risksOfInaction.complianceRisk) {
      content += `- **Regulatory compliance risk**: ${risksOfInaction.complianceRisk}\n`;
    }

    return content;
  },

  generateAIOpportunityAssessment(data) {
    const assessment = data.aiOpportunityAssessment || {};
    let content = '## AI/Automation Opportunity Assessment\n\n';

    // Current Technology Landscape
    content += '### Current Technology Landscape\n';
    const currentTech = assessment.currentTechnology || {};
    content += `- **Primary ERP**: ${currentTech.erp || '[Not specified]'}\n`;
    content += `- **CRM System**: ${currentTech.crm || '[Not specified]'}\n`;
    content += `- **Collaboration Tools**: ${currentTech.collaboration || '[Not specified]'}\n`;
    content += `- **Integration Maturity**: ${currentTech.integrationMaturity || '[Not assessed]'}\n`;
    content += `- **Data Quality**: ${currentTech.dataQuality || '[Not assessed]'}\n`;
    
    if (currentTech.automation) {
      content += `- **Current Automation**: ${currentTech.automation}\n`;
    }

    // AI Readiness Score
    content += '\n### AI Readiness Score\n';
    const readinessScoring = assessment.readinessScoring || {};
    const criteriaLabels = {
      dataQuality: 'Data availability and quality',
      integration: 'System integration capability',
      technicalTeam: 'Technical team readiness',
      leadership: 'Leadership support',
      changeManagement: 'Change management capability'
    };

    Object.entries(criteriaLabels).forEach(([key, label]) => {
      const score = readinessScoring[key] || 0;
      const max = 2;
      content += `- **${label}**: ${score}/${max}\n`;
    });

    const totalScore = Object.values(readinessScoring).reduce((sum, score) => sum + (score || 0), 0);
    content += `\n**Total AI Readiness Score: ${totalScore}/10**\n`;

    // Top AI Opportunities
    content += '\n### Top AI Opportunities (Prioritized)\n';
    const opportunities = assessment.opportunities || [];
    
    if (opportunities.length > 0) {
      opportunities
        .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
        .forEach((opportunity, index) => {
          content += `\n#### ${index + 1}. ${opportunity.name || 'Unnamed Opportunity'}\n`;
          content += `- **Department**: ${opportunity.department || 'Not specified'}\n`;
          content += `- **Process**: ${opportunity.process || 'Not specified'}\n`;
          content += `- **Current State**: ${opportunity.currentState || 'Not described'}\n`;
          content += `- **AI Solution**: ${opportunity.aiSolution || 'Not specified'}\n`;
          content += `- **Estimated Impact**: $${opportunity.estimatedImpact ? parseInt(opportunity.estimatedImpact).toLocaleString() : '[Not quantified]'}\n`;
          content += `- **Implementation Effort**: ${opportunity.implementationEffort || 'Medium'}\n`;
          content += `- **Timeline**: ${opportunity.timeline || 'Not specified'}\n`;
          content += `- **Priority Score**: ${opportunity.priorityScore || 5}/10\n`;
        });
    } else {
      content += 'No specific opportunities identified yet.\n';
    }

    // Quick Wins
    content += '\n### Quick Wins (0-6 months)\n';
    const quickWins = assessment.quickWins || [];
    
    if (quickWins.length > 0) {
      quickWins.forEach((quickWin, index) => {
        content += `${index + 1}. **${quickWin.name || 'Unnamed Quick Win'}**\n`;
        content += `   - Impact: $${quickWin.impact ? parseInt(quickWin.impact).toLocaleString() : '[Not quantified]'}\n`;
        content += `   - Timeline: ${quickWin.timeline || 'Not specified'}\n`;
      });
    } else {
      content += 'No quick wins identified yet.\n';
    }

    return content;
  },

  generateSummary(data) {
    const summary = data.summary || {};
    
    return `## Summary & Next Steps

### Executive Summary
**Current State**: ${summary.currentState || '[Brief description of key challenges and costs]'}

**Recommended Approach**: ${summary.recommendedApproach || '[High-level strategy recommendation]'}

**Expected Value**: 
- Total 3-year benefit: $${summary.expectedValue?.threeYearBenefit || '[Amount]'}
- Investment required: $${summary.expectedValue?.investment || '[Amount]'}
- Net ROI: ${summary.expectedValue?.netROI || '[X]%'}
- Payback period: ${summary.expectedValue?.paybackPeriod || '[X] months'}

### Immediate Next Steps
${this.generateNextSteps(summary.nextSteps)}

### Notes & Additional Context
${summary.notes || '[Free text area for additional observations, quotes from stakeholders, competitive insights, etc.]'}

---`;
  },

  generateFooter(data) {
    const now = new Date().toLocaleDateString();
    return `*Profile created on: ${now}*
*Last updated: ${now}*
*Created by: ${data.createdBy || '[Consultant name]'}*`;
  },

  // Helper methods
  generateCheckboxList(items, selectedItems = []) {
    return items.map(item => {
      const checked = selectedItems.includes(item) ? 'x' : ' ';
      return `- [${checked}] ${item}`;
    }).join('\n');
  },

  generateDepartmentProblems(department, problems = {}) {
    const templates = {
      finance: [
        'Manual invoice processing taking [X] days',
        '[X]% error rate in financial processes',
        'Month-end close takes [X] days'
      ],
      hr: [
        'Employee onboarding takes [X] days',
        'Manual resume screening',
        '[X]% employee turnover rate'
      ],
      it: [
        'Average ticket resolution: [X] hours',
        '[X]% of tickets require manual intervention',
        'System provisioning takes [X] hours'
      ],
      customerService: [
        'Average response time: [X] hours',
        '[X]% first contact resolution rate',
        'Customer satisfaction score: [X]/10'
      ],
      operations: [
        'Process cycle time: [X] days',
        '[X]% manual processes',
        'Quality issues: [X]% error rate'
      ]
    };

    const items = templates[department] || [];
    
    if (items.length === 0) {
      return '- [ ] Other: [Specify]';
    }
    
    return items.map(item => {
      const checked = problems[item] ? 'x' : ' ';
      return `- [${checked}] ${item}`;
    }).join('\n') + '\n- [ ] Other: [Specify]';
  },

  generateAIOpportunities(opportunities = []) {
    if (!opportunities.length) {
      return `#### Opportunity 1: [Name]
- **Department**: [Department]
- **Process**: [Specific process to automate]
- **Current State**: [How it works today]
- **AI Solution**: [What AI would do]
- **Estimated Impact**: $[Annual savings/benefit]
- **Implementation Effort**: [Low/Medium/High]
- **Timeline**: [X] months
- **Priority Score**: [X]/10`;
    }

    return opportunities.map((opp, index) => `#### Opportunity ${index + 1}: ${opp.name || '[Name]'}
- **Department**: ${opp.department || '[Department]'}
- **Process**: ${opp.process || '[Specific process to automate]'}
- **Current State**: ${opp.currentState || '[How it works today]'}
- **AI Solution**: ${opp.aiSolution || '[What AI would do]'}
- **Estimated Impact**: $${opp.estimatedImpact || '[Annual savings/benefit]'}
- **Implementation Effort**: ${opp.implementationEffort || '[Low/Medium/High]'}
- **Timeline**: ${opp.timeline || '[X] months'}
- **Priority Score**: ${opp.priorityScore || '[X]'}/10`).join('\n\n');
  },

  generateOpportunitiesList(opportunities = []) {
    if (!opportunities.length) {
      return '1. [Opportunity name] - $[Impact] - [Timeline]\n2. [Opportunity name] - $[Impact] - [Timeline]\n3. [Opportunity name] - $[Impact] - [Timeline]';
    }

    return opportunities.map((opp, index) => 
      `${index + 1}. ${opp.name || '[Opportunity name]'} - $${opp.impact || '[Impact]'} - ${opp.timeline || '[Timeline]'}`
    ).join('\n');
  },

  generateNextSteps(steps = []) {
    if (!steps.length) {
      return '1. [ ] [Specific action item with owner and date]\n2. [ ] [Specific action item with owner and date]\n3. [ ] [Specific action item with owner and date]';
    }

    return steps.map((step, index) => 
      `${index + 1}. [ ] ${step.action || '[Specific action item]'} - ${step.owner || '[Owner]'} - ${step.date || '[Date]'}`
    ).join('\n');
  },

  // Parsing methods for markdown to data conversion
  parseCompanyOverview(markdown) {
    const section = this.extractSection(markdown, '## Company Overview');
    const data = {};
    
    const patterns = {
      companyName: /\*\*Company Name\*\*:\s*(.+)/,
      industry: /\*\*Industry\*\*:\s*(.+)/,
      size: /\*\*Size\*\*:\s*(.+)/,
      annualRevenue: /\*\*Annual Revenue\*\*:\s*\$(.+)/,
      employeeCount: /\*\*Employee Count\*\*:\s*(.+)/,
      primaryLocation: /\*\*Primary Location\*\*:\s*(.+)/
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = section.match(pattern);
      if (match) data[key] = match[1].trim();
    });

    return data;
  },

  extractSection(markdown, heading) {
    // Escape special regex characters in the heading
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the heading and capture content until the next heading of same or higher level or end of string
    // Note: Don't use 'm' flag as it makes $ match end of line instead of end of string
    const regex = new RegExp(`${escapedHeading}\\n([\\s\\S]*?)(?=\\n##|$)`);
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  }
}; 