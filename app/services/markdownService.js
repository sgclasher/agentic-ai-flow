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
    const sections = [];
    
    sections.push(this.generateHeader(profileData));
    sections.push(this.generateCompanyOverview(profileData));
    sections.push(this.generateValueSellingFramework(profileData));
    sections.push(this.generateAIOpportunityAssessment(profileData));
    sections.push(this.generateSummary(profileData));
    sections.push(this.generateFooter(profileData));
    
    return sections.join('\n\n');
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
      if (nameMatch) data.companyName = nameMatch[1];
      
      // Parse company overview section
      data.companyOverview = this.parseCompanyOverview(markdown);
      
      // Parse value selling framework
      data.valueSellingFramework = this.parseValueSellingFramework(markdown);
      
      // Parse AI opportunities
      data.aiOpportunities = this.parseAIOpportunities(markdown);
      
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
    const vs = data.valueSellingFramework || {};
    
    return `## Value Selling Framework

### 1. Business Issue
**High-level strategic priority or C-level concern:**
${this.generateCheckboxList([
  'Revenue Growth Pressure',
  'Cost Reduction Mandate', 
  'Operational Efficiency',
  'Customer Experience',
  'Digital Transformation',
  'Regulatory Compliance',
  'Competitive Pressure'
], vs.businessIssues)}
- [ ] Other: ${vs.businessIssueOther || '[Specify]'}

**Details**: ${vs.businessIssueDetails || '[Describe the main business issue]'}

### 2. Problems / Challenges
**Specific operational issues identified:**

#### Finance Department
${this.generateDepartmentProblems('finance', vs.problems?.finance)}

#### HR Department  
${this.generateDepartmentProblems('hr', vs.problems?.hr)}

#### IT Department
${this.generateDepartmentProblems('it', vs.problems?.it)}

#### Customer Service
${this.generateDepartmentProblems('customerService', vs.problems?.customerService)}

#### Operations
${this.generateDepartmentProblems('operations', vs.problems?.operations)}

**Additional Challenges**: ${vs.additionalChallenges || '[Free text for other issues]'}

### 3. Root Cause
**Why do these challenges exist?**
${this.generateCheckboxList([
  'Legacy systems with poor integration',
  'Manual, paper-based processes',
  'Lack of real-time data visibility',
  'Insufficient automation',
  'Skills gap in technology',
  'Siloed departments'
], vs.rootCauses)}
- [ ] Other: ${vs.rootCauseOther || '[Specify]'}

**Details**: ${vs.rootCauseDetails || '[Describe root causes]'}

### 4. Impact
**Quantified effects:**

#### Hard Costs (Annual)
- Labor costs from manual processes: $${vs.impact?.laborCosts || '[Amount]'}
- Error correction costs: $${vs.impact?.errorCosts || '[Amount]'}
- System downtime costs: $${vs.impact?.downtimeCosts || '[Amount]'}
- Compliance penalties/risk: $${vs.impact?.complianceCosts || '[Amount]'}
- **Total Hard Costs**: $${vs.impact?.totalHardCosts || '[Sum]'}

#### Soft Costs
- Employee frustration/turnover impact: ${vs.impact?.employeeImpact || '[High/Medium/Low]'}
- Customer satisfaction impact: ${vs.impact?.customerImpact || '[High/Medium/Low]'}
- Competitive disadvantage: ${vs.impact?.competitiveImpact || '[High/Medium/Low]'}
- Brand/reputation risk: ${vs.impact?.reputationRisk || '[High/Medium/Low]'}

**Total Estimated Annual Impact**: $${vs.impact?.totalAnnualImpact || '[Amount]'}

### 5. Solution Capabilities Needed
**What the solution must do:**
${this.generateCheckboxList([
  'Automate document processing',
  'Streamline approval workflows',
  'Provide real-time dashboards',
  'Integrate disconnected systems',
  'Enable self-service capabilities',
  'Improve data accuracy',
  'Reduce manual handoffs'
], vs.solutionCapabilities)}
- [ ] Other: ${vs.solutionCapabilitiesOther || '[Specify]'}

### 6. Differentiation Requirements
**What makes a solution uniquely qualified:**
${this.generateCheckboxList([
  'Industry-specific expertise',
  'Rapid implementation (< 6 months)',
  'No-code/low-code platform',
  'Strong integration capabilities',
  'Proven ROI in similar companies',
  'Comprehensive support/training'
], vs.differentiationRequirements)}
- [ ] Other: ${vs.differentiationOther || '[Specify]'}

### 7. Value / ROI Expectations
**Expected benefits:**
- Target cost reduction: ${vs.roiExpectations?.costReduction || '[X]% or $[Amount]'}
- Target efficiency improvement: ${vs.roiExpectations?.efficiencyImprovement || '[X]%'}
- Expected payback period: ${vs.roiExpectations?.paybackPeriod || '[X] months'}
- Target ROI: ${vs.roiExpectations?.targetROI || '[X]%'}
- Time to first value: ${vs.roiExpectations?.timeToFirstValue || '[X] months'}

### 8. Success Metrics
**How success will be measured:**
${this.generateCheckboxList([
  'Process cycle time reduction',
  'Error rate improvement',
  'Cost per transaction reduction',
  'Employee productivity increase',
  'Customer satisfaction improvement',
  'Revenue impact'
], vs.successMetrics)}
- [ ] Other: ${vs.successMetricsOther || '[Specify]'}

**Specific targets**: ${vs.successMetricsTargets || '[Detail the numerical targets]'}

### 9. Decision Criteria & Process
#### Key Decision Makers
- **Economic Buyer**: ${vs.decisionMakers?.economicBuyer?.name || '[Name]'}, ${vs.decisionMakers?.economicBuyer?.title || '[Title]'} - Budget authority: $${vs.decisionMakers?.economicBuyer?.budget || '[Amount]'}
- **Technical Buyer**: ${vs.decisionMakers?.technicalBuyer?.name || '[Name]'}, ${vs.decisionMakers?.technicalBuyer?.title || '[Title]'} - Technical evaluation lead
- **Champion**: ${vs.decisionMakers?.champion?.name || '[Name]'}, ${vs.decisionMakers?.champion?.title || '[Title]'} - Internal advocate
- **Influencers**: ${vs.decisionMakers?.influencers || '[Names, Titles]'} - Input into decision

#### Buying Process
- Decision timeline: ${vs.buyingProcess?.timeline || '[X] months'}
- Budget cycle: ${vs.buyingProcess?.budgetCycle || '[When budget decisions are made]'}
- Evaluation criteria:
${this.generateCheckboxList([
  'Technical fit',
  'Cost/ROI',
  'Vendor reputation',
  'Implementation timeline',
  'Support quality'
], vs.buyingProcess?.evaluationCriteria)}
  - [ ] Other: ${vs.buyingProcess?.evaluationOther || '[Specify]'}

### 10. Risks of Inaction
**Consequences of doing nothing:**
- Continued cost escalation: $${vs.risksOfInaction?.costEscalation || '[Amount]'} annually
- Competitive disadvantage: ${vs.risksOfInaction?.competitiveDisadvantage || '[Describe impact]'}
- Employee attrition risk: ${vs.risksOfInaction?.employeeAttrition || '[High/Medium/Low]'}
- Customer satisfaction decline: ${vs.risksOfInaction?.customerSatisfaction || '[Describe impact]'}
- Regulatory compliance risk: ${vs.risksOfInaction?.complianceRisk || '[Describe impact]'}
- **Estimated cost of inaction (3 years)**: $${vs.risksOfInaction?.threeYearCost || '[Amount]'}

---`;
  },

  generateAIOpportunityAssessment(data) {
    const ai = data.aiOpportunityAssessment || {};
    
    return `## AI/Automation Opportunity Assessment

### Current Technology Landscape
- **Primary ERP**: ${ai.currentTechnology?.erp || '[System name and version]'}
- **CRM System**: ${ai.currentTechnology?.crm || '[System name]'}
- **Collaboration Tools**: ${ai.currentTechnology?.collaboration || '[Tools used]'}
- **Current Automation**: ${ai.currentTechnology?.automation || '[Describe existing automation]'}
- **Integration Maturity**: ${ai.currentTechnology?.integrationMaturity || '[Basic/Intermediate/Advanced]'}
- **Data Quality**: ${ai.currentTechnology?.dataQuality || '[Poor/Fair/Good/Excellent]'}

### AI Readiness Score: ${ai.aiReadinessScore || '[X]'}/10
**Scoring Criteria:**
- Data availability and quality: ${ai.readinessScoring?.dataQuality || '[X]'}/2
- System integration capability: ${ai.readinessScoring?.integration || '[X]'}/2  
- Technical team readiness: ${ai.readinessScoring?.technicalTeam || '[X]'}/2
- Leadership support: ${ai.readinessScoring?.leadership || '[X]'}/2
- Change management capability: ${ai.readinessScoring?.changeManagement || '[X]'}/2

### Top AI Opportunities (Prioritized)
${this.generateAIOpportunities(ai.opportunities)}

### Quick Wins (0-6 months)
${this.generateOpportunitiesList(ai.quickWins)}

### Strategic Initiatives (6-18 months)
${this.generateOpportunitiesList(ai.strategicInitiatives)}

### Future Opportunities (18+ months)
${this.generateOpportunitiesList(ai.futureOpportunities)}

---`;
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
      companyName: /\*\*Company Name\*\*: (.+)/,
      industry: /\*\*Industry\*\*: (.+)/,
      size: /\*\*Size\*\*: (.+)/,
      annualRevenue: /\*\*Annual Revenue\*\*: \$(.+)/,
      employeeCount: /\*\*Employee Count\*\*: (.+)/,
      primaryLocation: /\*\*Primary Location\*\*: (.+)/
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = section.match(pattern);
      if (match) data[key] = match[1].trim();
    });

    return data;
  },

  extractSection(markdown, heading) {
    const regex = new RegExp(`${heading}([\\s\\S]*?)(?=^##|$)`, 'm');
    const match = markdown.match(regex);
    return match ? match[1] : '';
  }
}; 