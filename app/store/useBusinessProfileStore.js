'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useBusinessProfileStore = create(
  persist(
    (set, get) => ({
      // Business profile information
      businessProfile: {
        companyName: '',
        industry: '',
        companySize: '',
        currentTechStack: [],
        aiMaturityLevel: '',
        primaryGoals: [],
        budget: '',
        timeframe: '',
      },
      
      // Timeline settings
      scenarioType: 'balanced', // 'conservative', 'balanced', 'aggressive'
      selectedYear: new Date().getFullYear(),
      expandedSections: {}, // Track which timeline sections are expanded
      
      // Generated timeline data
      timelineData: null,
      isGenerating: false,
      
      // Actions
      setBusinessProfile: (profile) => 
        set({ businessProfile: { ...get().businessProfile, ...profile } }),
      
      setScenarioType: (type) => set({ scenarioType: type }),
      
      setSelectedYear: (year) => set({ selectedYear: year }),
      
      toggleSection: (sectionId) => 
        set((state) => ({
          expandedSections: {
            ...state.expandedSections,
            [sectionId]: !state.expandedSections[sectionId]
          }
        })),
      
      expandAllSections: () => {
        const sections = ['current-state', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'future-state'];
        const expanded = {};
        sections.forEach(section => { expanded[section] = true; });
        set({ expandedSections: expanded });
      },
      
      collapseAllSections: () => set({ expandedSections: {} }),
      
      hasValidProfile: () => {
        const { businessProfile } = get();
        return businessProfile.companyName && 
               businessProfile.industry && 
               businessProfile.companySize &&
               businessProfile.aiMaturityLevel &&
               businessProfile.primaryGoals.length > 0;
      },
      
      generateTimeline: async (profile) => {
        set({ isGenerating: true });
        
        // If profile is provided, update it first
        if (profile) {
          set({ businessProfile: profile });
        }
        
        const { businessProfile, scenarioType } = get();
        
        try {
          // Simulate API call with realistic data generation
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const timelineData = {
            currentState: {
              description: `As a ${businessProfile.companySize} company in the ${businessProfile.industry} industry, you're at the ${businessProfile.aiMaturityLevel} stage of AI adoption. Your current tech infrastructure provides a foundation for transformation, with opportunities to enhance automation and data-driven decision making.`,
              initiatives: [
                {
                  title: 'AI Readiness Assessment',
                  description: 'Comprehensive evaluation of current systems and processes',
                  impact: 'Baseline established for transformation journey'
                },
                {
                  title: 'Team Skill Gap Analysis',
                  description: 'Identify training needs and hiring requirements',
                  impact: 'Clear roadmap for capability building'
                }
              ],
              technologies: ['Current ERP', 'Basic Analytics', 'Manual Processes'],
              outcomes: [
                { metric: 'Process Automation', value: '15%', description: 'Current automation level' },
                { metric: 'Data Utilization', value: '25%', description: 'Percentage of data actively used' }
              ]
            },
            phases: [
              {
                // Phase 1 - Foundation
                description: 'Build the foundational infrastructure and capabilities needed for AI transformation. Focus on data consolidation, team training, and pilot projects.',
                highlights: [
                  { label: 'Duration', value: '6 months' },
                  { label: 'Investment', value: '$250K-500K' },
                  { label: 'Focus Areas', value: '3-5 processes' }
                ],
                initiatives: [
                  {
                    title: 'Data Infrastructure Modernization',
                    description: 'Implement cloud data platform and establish data governance',
                    impact: '60% improvement in data accessibility'
                  },
                  {
                    title: 'AI Center of Excellence',
                    description: 'Establish dedicated team and governance framework',
                    impact: 'Structured approach to AI adoption'
                  },
                  {
                    title: 'Pilot Automation Projects',
                    description: 'Launch 3-5 high-impact automation initiatives',
                    impact: '30% efficiency gain in targeted processes'
                  }
                ],
                technologies: ['Cloud Platform', 'Data Lakes', 'RPA Tools', 'ML Frameworks'],
                outcomes: [
                  { metric: 'Data Quality', value: '85%', description: 'Improved from 45%' },
                  { metric: 'Team Readiness', value: '70%', description: 'AI-skilled resources' },
                  { metric: 'Process Efficiency', value: '+25%', description: 'In pilot areas' }
                ]
              },
              {
                // Phase 2 - Implementation
                description: 'Deploy AI solutions across key business processes. Scale successful pilots and introduce advanced analytics capabilities.',
                highlights: [
                  { label: 'Duration', value: '6 months' },
                  { label: 'Investment', value: '$500K-1M' },
                  { label: 'Coverage', value: '40% of operations' }
                ],
                initiatives: [
                  {
                    title: 'Intelligent Process Automation',
                    description: 'Deploy AI-powered automation across customer service and operations',
                    impact: '45% reduction in processing time'
                  },
                  {
                    title: 'Predictive Analytics Platform',
                    description: 'Implement forecasting and optimization models',
                    impact: '30% improvement in forecast accuracy'
                  },
                  {
                    title: 'AI-Powered Customer Insights',
                    description: 'Deploy sentiment analysis and personalization engines',
                    impact: '25% increase in customer satisfaction'
                  }
                ],
                technologies: ['AutoML', 'NLP Services', 'Computer Vision', 'Edge AI'],
                outcomes: [
                  { metric: 'Automation Rate', value: '45%', description: 'Up from 15%' },
                  { metric: 'Cost Savings', value: '$750K', description: 'Annual run rate' },
                  { metric: 'Decision Speed', value: '3x faster', description: 'Data-driven decisions' }
                ]
              },
              {
                // Phase 3 - Expansion
                description: 'Expand AI capabilities across the enterprise. Integrate advanced AI into core business processes and customer experiences.',
                highlights: [
                  { label: 'Duration', value: '12 months' },
                  { label: 'Investment', value: '$1M-2.5M' },
                  { label: 'Coverage', value: '75% of operations' }
                ],
                initiatives: [
                  {
                    title: 'Enterprise AI Platform',
                    description: 'Unified AI/ML platform serving all business units',
                    impact: 'Democratized AI access across organization'
                  },
                  {
                    title: 'Autonomous Operations',
                    description: 'Self-optimizing systems for supply chain and logistics',
                    impact: '50% reduction in operational overhead'
                  },
                  {
                    title: 'AI Product Innovation',
                    description: 'Embed AI into products and services',
                    impact: 'New revenue streams worth $5M+'
                  }
                ],
                technologies: ['MLOps Platform', 'Conversational AI', 'Digital Twins', 'Quantum-ready'],
                outcomes: [
                  { metric: 'Revenue Growth', value: '+22%', description: 'AI-driven growth' },
                  { metric: 'Operating Margin', value: '+8%', description: 'Efficiency gains' },
                  { metric: 'Innovation Index', value: '8.5/10', description: 'Industry benchmark' }
                ]
              },
              {
                // Phase 4 - Optimization
                description: 'Optimize and refine AI systems for maximum value. Focus on continuous improvement and emerging technologies.',
                highlights: [
                  { label: 'Duration', value: '12 months' },
                  { label: 'Investment', value: '$1.5M-3M' },
                  { label: 'Coverage', value: '90% of operations' }
                ],
                initiatives: [
                  {
                    title: 'Adaptive AI Systems',
                    description: 'Self-learning systems that continuously improve',
                    impact: 'Minimal human intervention required'
                  },
                  {
                    title: 'AI Ethics & Governance',
                    description: 'Robust frameworks for responsible AI',
                    impact: 'Industry-leading trust and compliance'
                  },
                  {
                    title: 'Next-Gen Technologies',
                    description: 'Explore quantum computing and advanced AI',
                    impact: 'Competitive advantage through innovation'
                  }
                ],
                technologies: ['Adaptive ML', 'Explainable AI', 'Federated Learning', 'Neuromorphic Computing'],
                outcomes: [
                  { metric: 'AI Maturity', value: '90%', description: 'Industry leader' },
                  { metric: 'ROI', value: '425%', description: 'Cumulative return' },
                  { metric: 'Market Position', value: 'Top 5%', description: 'In AI adoption' }
                ]
              }
            ],
            futureState: {
              description: `By year 5, your organization will be a fully AI-enabled enterprise, leading in the ${businessProfile.industry} industry. AI will be seamlessly integrated into every aspect of operations, driving innovation, efficiency, and customer value.`,
              highlights: [
                { label: 'AI Integration', value: '95%' },
                { label: 'Revenue Impact', value: '+45%' },
                { label: 'Cost Reduction', value: '-35%' },
                { label: 'Innovation Score', value: '9.5/10' }
              ],
              initiatives: [
                {
                  title: 'AI-First Culture',
                  description: 'Every employee empowered with AI tools',
                  impact: 'Industry-leading productivity and innovation'
                },
                {
                  title: 'Ecosystem Leadership',
                  description: 'Drive industry standards and partnerships',
                  impact: 'Thought leadership and market influence'
                }
              ],
              technologies: ['AGI-ready Infrastructure', 'Quantum AI', 'Bio-inspired Computing', 'Conscious AI'],
              outcomes: [
                { metric: 'Valuation Multiple', value: '2.5x', description: 'Premium for AI leadership' },
                { metric: 'Talent Attraction', value: 'Top 1%', description: 'Best AI talent globally' },
                { metric: 'Sustainability', value: '100%', description: 'Carbon neutral via AI optimization' }
              ]
            },
            summary: {
              totalInvestment: '$4.5M - $8.5M',
              expectedROI: '425%',
              timeToValue: '6 months',
              riskLevel: scenarioType === 'conservative' ? 'Low' : scenarioType === 'aggressive' ? 'Moderate' : 'Balanced'
            }
          };
          
          set({ timelineData, isGenerating: false });
        } catch (error) {
          console.error('Error generating timeline:', error);
          set({ isGenerating: false });
        }
      },
      
      clearTimeline: () => set({ timelineData: null, expandedSections: {} }),
    }),
    {
      name: 'business-profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Mock timeline generator - will be replaced with actual AI-powered generation
async function generateMockTimeline(profile, scenarioType) {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const currentYear = new Date().getFullYear();
  const timelineEvents = [];
  
  // Generate events based on company size and scenario
  const baseEvents = [
    {
      id: 'assessment',
      date: `Q1 ${currentYear}`,
      title: 'Current State Assessment',
      type: 'milestone',
      description: `Comprehensive analysis of ${profile.companyName || 'your organization'}'s digital infrastructure and AI readiness.`,
      details: {
        activities: [
          'Technology stack audit',
          'Process automation opportunities identification',
          'Team skills assessment',
          'Data infrastructure review',
        ],
        deliverables: [
          'AI Readiness Report',
          'Opportunity Matrix',
          'Implementation Roadmap',
        ],
        estimatedROI: '15-20% efficiency gains identified',
      }
    },
    {
      id: 'pilot',
      date: `Q2 ${currentYear}`,
      title: 'Pilot Agentic Workflows',
      type: 'implementation',
      description: 'Launch initial AI agents for high-impact, low-risk processes.',
      details: {
        agents: [
          {
            name: 'Customer Service Agent',
            description: 'Handles 80% of routine inquiries',
            impact: '30% reduction in response time',
          },
          {
            name: 'Data Processing Agent',
            description: 'Automates report generation',
            impact: '5 hours saved per week',
          }
        ],
        investment: '$50,000 - $150,000',
        timeline: '8-12 weeks',
      }
    },
    {
      id: 'expansion',
      date: `Q3-Q4 ${currentYear}`,
      title: 'Scale AI Operations',
      type: 'expansion',
      description: 'Expand agentic AI across departments based on pilot success.',
      details: {
        departments: ['Sales', 'Marketing', 'Operations', 'Finance'],
        newCapabilities: [
          'Predictive analytics',
          'Automated workflow orchestration',
          'Real-time decision support',
        ],
        expectedOutcomes: {
          efficiency: '+40%',
          costSavings: '$500K annually',
          customerSatisfaction: '+25 NPS',
        }
      }
    }
  ];
  
  // Adjust timeline based on scenario type
  if (scenarioType === 'aggressive') {
    // Compress timeline and add more ambitious goals
    baseEvents.forEach(event => {
      event.accelerated = true;
    });
  } else if (scenarioType === 'conservative') {
    // Extend timeline and focus on risk mitigation
    baseEvents.forEach(event => {
      event.riskMitigation = true;
    });
  }
  
  return {
    events: baseEvents,
    summary: {
      totalInvestment: '$200K - $500K',
      expectedROI: '250-400%',
      timeToValue: '3-6 months',
      riskLevel: scenarioType === 'aggressive' ? 'Medium-High' : 'Low-Medium',
    },
    recommendations: [
      'Start with customer-facing processes for quick wins',
      'Invest in data infrastructure early',
      'Plan for change management and training',
    ],
  };
}

export default useBusinessProfileStore; 