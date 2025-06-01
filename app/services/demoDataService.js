'use client';

/**
 * Demo Data Service
 * 
 * Provides realistic sample client profiles for testing and demonstration.
 * Based on common enterprise scenarios and Value Selling Framework patterns.
 */

export const demoDataService = {
  /**
   * Get a collection of demo profiles
   * @returns {Array} Array of demo profile objects
   */
  getDemoProfiles() {
    return [
      this.getTechStartupProfile(),
      this.getManufacturingProfile(), 
      this.getHealthcareProfile(),
      this.getFinanceProfile()
    ];
  },

  /**
   * Get a specific demo profile by type
   * @param {string} type - Type of demo profile
   * @returns {Object} Demo profile data
   */
  getDemoProfile(type = 'tech-startup') {
    const profiles = {
      'tech-startup': this.getTechStartupProfile(),
      'manufacturing': this.getManufacturingProfile(),
      'healthcare': this.getHealthcareProfile(),
      'finance': this.getFinanceProfile()
    };
    return profiles[type] || profiles['tech-startup'];
  },

  /**
   * Technology startup profile
   */
  getTechStartupProfile() {
    return {
      companyName: 'TechFlow Solutions',
      industry: 'Technology',
      size: '51-200 employees',
      annualRevenue: '15M',
      employeeCount: '120',
      primaryLocation: 'Austin, Texas',
      valueSellingFramework: {
        businessIssues: [
          'Revenue Growth Pressure',
          'Operational Efficiency',
          'Customer Experience'
        ],
        businessIssueOther: 'Scaling challenges with rapid growth',
        businessIssueDetails: 'Fast-growing SaaS company struggling with manual processes that worked at 50 employees but are breaking down at 120+. Customer support response times increasing, sales processes inconsistent, and engineering productivity declining due to operational overhead.',
        problems: {
          finance: {
            'Manual invoice processing taking [X] days': true,
            '[X]% error rate in financial processes': true
          },
          hr: {
            'Employee onboarding takes [X] days': true,
            'Manual resume screening': true
          },
          it: {
            'Average ticket resolution: [X] hours': true,
            'System provisioning takes [X] hours': true
          },
          customerService: {
            'Average response time: [X] hours': true,
            '[X]% first contact resolution rate': true
          },
          operations: {
            '[X]% manual processes': true
          }
        },
        additionalChallenges: 'Integration hell with 15+ different tools, lack of real-time visibility into customer health, manual reporting taking 2 days per week',
        rootCauses: [
          'Manual, paper-based processes',
          'Lack of real-time data visibility',
          'Insufficient automation',
          'Siloed departments'
        ],
        rootCauseDetails: 'Grew too fast to implement proper systems. Started with spreadsheets and manual processes that became embedded in culture. Each department chose their own tools without integration strategy.',
        impact: {
          laborCosts: '450000',
          errorCosts: '75000',
          downtimeCosts: '120000',
          complianceCosts: '25000',
          totalHardCosts: '670000',
          employeeImpact: 'High',
          customerImpact: 'Medium',
          competitiveImpact: 'High',
          reputationRisk: 'Medium',
          totalAnnualImpact: '850000'
        },
        solutionCapabilities: [
          'Automate document processing',
          'Streamline approval workflows',
          'Provide real-time dashboards',
          'Integrate disconnected systems',
          'Enable self-service capabilities'
        ],
        differentiationRequirements: [
          'Rapid implementation (< 6 months)',
          'No-code/low-code platform',
          'Strong integration capabilities',
          'Proven ROI in similar companies'
        ],
        roiExpectations: {
          costReduction: '30%',
          efficiencyImprovement: '40%',
          paybackPeriod: '8 months',
          targetROI: '300%',
          timeToFirstValue: '3 months'
        },
        successMetrics: [
          'Process cycle time reduction',
          'Employee productivity increase',
          'Customer satisfaction improvement'
        ],
        successMetricsTargets: 'Reduce support response time from 4 hours to 1 hour, increase sales cycle speed by 25%, reduce onboarding time from 2 weeks to 3 days',
        decisionMakers: {
          economicBuyer: {
            name: 'Sarah Chen',
            title: 'CEO',
            budget: '500000'
          },
          technicalBuyer: {
            name: 'Mike Rodriguez',
            title: 'CTO'
          },
          champion: {
            name: 'Lisa Park',
            title: 'VP Operations'
          },
          influencers: 'Head of Customer Success, Engineering Manager, Finance Director'
        },
        buyingProcess: {
          timeline: '4 months',
          budgetCycle: 'Q1 planning cycle',
          evaluationCriteria: [
            'Technical fit',
            'Implementation timeline',
            'Cost/ROI'
          ]
        },
        risksOfInaction: {
          costEscalation: '1200000',
          competitiveDisadvantage: 'Losing deals to faster competitors, customer churn increasing',
          employeeAttrition: 'High',
          customerSatisfaction: 'Support tickets up 40%, NPS declining',
          complianceRisk: 'SOC2 audit findings due to manual processes',
          threeYearCost: '3600000'
        }
      },
      aiOpportunityAssessment: {
        currentTechnology: {
          erp: 'QuickBooks + custom spreadsheets',
          crm: 'HubSpot',
          collaboration: 'Slack, Notion, Zoom',
          automation: 'Zapier for basic integrations',
          integrationMaturity: 'Basic',
          dataQuality: 'Fair'
        },
        aiReadinessScore: 6,
        readinessScoring: {
          dataQuality: 1,
          integration: 1,
          technicalTeam: 2,
          leadership: 2,
          changeManagement: 1
        },
        opportunities: [
          {
            name: 'Customer Support Automation',
            department: 'Customer Success',
            process: 'Ticket routing and initial response',
            currentState: 'Manual ticket assignment, 4-hour response time',
            aiSolution: 'AI-powered ticket classification and auto-responses',
            estimatedImpact: '180000',
            implementationEffort: 'Medium',
            timeline: '3 months',
            priorityScore: '9'
          },
          {
            name: 'Sales Lead Scoring',
            department: 'Sales',
            process: 'Lead qualification and prioritization',
            currentState: 'Manual review of all inbound leads',
            aiSolution: 'ML-based lead scoring and routing',
            estimatedImpact: '240000',
            implementationEffort: 'Low',
            timeline: '2 months',
            priorityScore: '8'
          }
        ],
        quickWins: [
          { name: 'Automated ticket routing', impact: '50000', timeline: '1 month' },
          { name: 'Invoice processing automation', impact: '75000', timeline: '2 months' },
          { name: 'Employee onboarding workflows', impact: '30000', timeline: '6 weeks' }
        ],
        strategicInitiatives: [
          { name: 'Predictive customer health scoring', impact: '200000', timeline: '6 months' },
          { name: 'Automated financial reporting', impact: '120000', timeline: '9 months' }
        ],
        futureOpportunities: [
          { name: 'AI-powered product recommendations', impact: '500000', timeline: '18 months' },
          { name: 'Predictive maintenance for infrastructure', impact: '150000', timeline: '24 months' }
        ]
      },
      summary: {
        currentState: 'Fast-growing SaaS company with $15M revenue experiencing scaling pains. Manual processes causing 4-hour support response times, 2-week onboarding cycles, and declining productivity. Total annual impact: $850K.',
        recommendedApproach: 'Phased AI implementation starting with customer support automation and sales lead scoring. Focus on integration platform to unify 15+ disparate systems. Target 40% efficiency improvement within 8 months.',
        expectedValue: {
          threeYearBenefit: '2400000',
          investment: '800000',
          netROI: '300%',
          paybackPeriod: '8 months'
        },
        nextSteps: [
          { action: 'Technical architecture review with CTO', owner: 'Mike Rodriguez', date: '2 weeks' },
          { action: 'ROI validation workshop', owner: 'Lisa Park', date: '3 weeks' },
          { action: 'Pilot project scope definition', owner: 'Sarah Chen', date: '1 month' }
        ],
        notes: 'Strong technical team, CEO is former engineer (technical buyer). Main concern is implementation speed - need to show quick wins. Competitive evaluation against 3 other vendors. Decision by end of Q1.'
      }
    };
  },

  /**
   * Manufacturing company profile
   */
  getManufacturingProfile() {
    return {
      companyName: 'PrecisionParts Manufacturing',
      industry: 'Manufacturing',
      size: '201-1000 employees',
      annualRevenue: '85M',
      employeeCount: '450',
      primaryLocation: 'Cleveland, Ohio',
      valueSellingFramework: {
        businessIssues: [
          'Cost Reduction Mandate',
          'Operational Efficiency',
          'Regulatory Compliance'
        ],
        businessIssueDetails: 'Traditional manufacturer facing pressure from low-cost overseas competitors. Need 25% cost reduction while maintaining quality. Current ERP system from 2010 cannot handle modern analytics needs.',
        impact: {
          totalAnnualImpact: '2400000'
        }
        // ... truncated for brevity, but would include full profile
      },
      summary: {
        currentState: 'Traditional manufacturer with aging systems, manual quality processes, and 15% waste rate. Losing contracts to lower-cost competitors.',
        recommendedApproach: 'AI-powered predictive maintenance, quality control automation, and supply chain optimization.'
      }
    };
  },

  /**
   * Healthcare organization profile  
   */
  getHealthcareProfile() {
    return {
      companyName: 'Regional Medical Center',
      industry: 'Healthcare',
      size: '1000+ employees',
      annualRevenue: '320M',
      employeeCount: '2100',
      primaryLocation: 'Phoenix, Arizona',
      valueSellingFramework: {
        businessIssues: [
          'Operational Efficiency',
          'Regulatory Compliance',
          'Customer Experience'
        ],
        businessIssueDetails: 'Regional hospital system struggling with nurse burnout, patient wait times, and regulatory compliance costs. Need to improve patient outcomes while reducing operational costs.',
        impact: {
          totalAnnualImpact: '5200000'
        }
      },
      summary: {
        currentState: '500-bed hospital system with 45-minute average wait times, 18% nurse turnover, and $5.2M compliance burden.',
        recommendedApproach: 'Clinical workflow automation, predictive patient risk scoring, and intelligent resource scheduling.'
      }
    };
  },

  /**
   * Financial services profile
   */
  getFinanceProfile() {
    return {
      companyName: 'Community Trust Bank',
      industry: 'Finance',
      size: '201-1000 employees', 
      annualRevenue: '180M',
      employeeCount: '380',
      primaryLocation: 'Charlotte, North Carolina',
      valueSellingFramework: {
        businessIssues: [
          'Regulatory Compliance',
          'Competitive Pressure',
          'Customer Experience'
        ],
        businessIssueDetails: 'Regional bank losing customers to fintech apps and digital-first competitors. Loan approval process takes 3 weeks vs 24 hours for online lenders. High compliance costs.',
        impact: {
          totalAnnualImpact: '3100000'
        }
      },
      summary: {
        currentState: 'Regional bank with 15 branches, 3-week loan processing, and declining market share to digital competitors.',
        recommendedApproach: 'Automated risk assessment, digital customer onboarding, and real-time fraud detection.'
      }
    };
  }
}; 