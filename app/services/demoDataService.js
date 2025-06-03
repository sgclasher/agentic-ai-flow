'use client';

/**
 * Enhanced Demo Data Service with Supabase Integration
 * 
 * Provides realistic demo profiles and data for the AI advisory platform.
 * Features Supabase integration with localStorage fallback and industry-specific
 * templates for comprehensive demonstration capabilities.
 * 
 * Key Features:
 * - Supabase integration with demo data storage
 * - Industry-specific demo profile templates
 * - Demo mode toggle with session management
 * - Realistic relationship data between profiles, timelines, and AI conversations
 * - Data seeding capabilities for development/demo environments
 * - Export/import demo configurations
 */

import { 
  ProfileDB, 
  TimelineDB, 
  AuthService, 
  AuditService,
  AIConversationDB,
  FeatureService
} from './supabaseService';
import { ProfileService } from './profileService';
import { TimelineService } from './timelineService';

export class DemoDataService {
  // Demo configuration
  static DEMO_CONFIG = {
    enableSupabase: true,
    fallbackToLocalStorage: true,
    demoMode: false,
    autoGenerateTimelines: true,
    industryTemplates: [
      'technology', 'healthcare', 'finance', 'manufacturing', 
      'retail', 'education', 'government', 'consulting'
    ]
  };

  // Demo data cache
  static demoCache = new Map();

  /**
   * Initialize demo environment with sample data
   * @param {Object} options - Initialization options
   * @returns {Promise<boolean>} Success status
   */
  static async initializeDemoData(options = {}) {
    try {
      const {
        clearExisting = false,
        industries = this.DEMO_CONFIG.industryTemplates,
        profileCount = 12,
        generateTimelines = true
      } = options;

      console.log('Initializing demo data environment...');

      // Clear existing demo data if requested
      if (clearExisting) {
        await this.clearDemoData();
      }

      // Enable demo mode
      await this.enableDemoMode();

      // Generate demo profiles for each industry
      const demoProfiles = [];
      for (const industry of industries.slice(0, profileCount)) {
        const profile = await this.createDemoProfile(industry);
        if (profile) {
          demoProfiles.push(profile);
          
          // Generate timeline for each profile if enabled
          if (generateTimelines) {
            await this.generateDemoTimeline(profile);
          }
        }
      }

      // Create demo AI conversations
      await this.createDemoAIConversations(demoProfiles);

      // Cache demo data
      this.demoCache.set('profiles', demoProfiles);
      this.demoCache.set('initialized', true);

      console.log(`Demo data initialized: ${demoProfiles.length} profiles created`);
      return true;

    } catch (error) {
      console.error('Error initializing demo data:', error);
      return false;
    }
  }

  /**
   * Create a demo profile for a specific industry
   * @param {string} industry - Industry type
   * @returns {Promise<Object>} Created demo profile
   */
  static async createDemoProfile(industry) {
    try {
      const template = this.getIndustryTemplate(industry);
      const profileData = this.generateProfileData(template);

      // Create profile using ProfileService
      const profile = await ProfileService.createProfile(profileData);

      // Add demo metadata
      if (profile) {
        profile.isDemoData = true;
        profile.demoIndustry = industry;
        profile.createdAt = new Date().toISOString();
      }

      return profile;

    } catch (error) {
      console.warn(`Error creating demo profile for ${industry}:`, error);
      return null;
    }
  }

  /**
   * Generate demo timeline for a profile
   * @param {Object} profile - Profile to generate timeline for
   * @returns {Promise<Object>} Generated timeline
   */
  static async generateDemoTimeline(profile) {
    try {
      // Extract business profile data
      const businessProfile = ProfileService.extractBusinessProfile(profile);
      businessProfile.profileId = profile.id;

      // Generate timeline with random scenario
      const scenarios = ['conservative', 'balanced', 'aggressive'];
      const randomScenario = scenarios[Math.floor(Math.random() * scenarios.length)];

      const timeline = await TimelineService.generateTimeline(
        businessProfile, 
        randomScenario,
        { aiProvider: 'demo', isDemoData: true }
      );

      return timeline;

    } catch (error) {
      console.warn(`Error generating demo timeline for profile ${profile.id}:`, error);
      return null;
    }
  }

  /**
   * Create demo AI conversations
   * @param {Array} profiles - Demo profiles to create conversations for
   * @returns {Promise<Array>} Created conversations
   */
  static async createDemoAIConversations(profiles) {
    try {
      const conversations = [];
      const user = await AuthService.getCurrentUser();

      for (const profile of profiles.slice(0, 5)) { // Create conversations for first 5 profiles
        const conversation = {
          profile_id: profile.id,
          provider: 'demo-ai',
          conversation_type: 'consultation',
          input_data: {
            question: this.getDemoQuestion(profile.industry),
            context: profile.companyName
          },
          output_data: {
            response: this.getDemoResponse(profile.industry),
            recommendations: this.getDemoRecommendations(profile.industry)
          },
          tokens_used: Math.floor(Math.random() * 1000) + 500,
          cost_usd: (Math.random() * 0.05 + 0.01).toFixed(4),
          duration_ms: Math.floor(Math.random() * 5000) + 1000
        };

        if (this.DEMO_CONFIG.enableSupabase && user) {
          try {
            const created = await AIConversationDB.create(conversation, user.id);
            conversations.push(created);
          } catch (error) {
            console.warn('Failed to create demo conversation in Supabase:', error);
          }
        }
      }

      return conversations;

    } catch (error) {
      console.warn('Error creating demo AI conversations:', error);
      return [];
    }
  }

  /**
   * Get all demo profiles
   * @returns {Promise<Array>} Demo profiles
   */
  static async getDemoProfiles() {
    try {
      // Check cache first
      if (this.demoCache.has('profiles')) {
        return this.demoCache.get('profiles');
      }

      // Get profiles from ProfileService
      const allProfiles = await ProfileService.getProfiles();
      const demoProfiles = allProfiles.filter(profile => profile.isDemoData);

      // Cache the results
      this.demoCache.set('profiles', demoProfiles);
      
      return demoProfiles;

    } catch (error) {
      console.error('Error fetching demo profiles:', error);
      return [];
    }
  }

  /**
   * Enable demo mode
   * @returns {Promise<boolean>} Success status
   */
  static async enableDemoMode() {
    try {
      this.DEMO_CONFIG.demoMode = true;
      
      // Store in localStorage for persistence
      localStorage.setItem('demoMode', 'true');
      
      // Enable demo features if using Supabase
      if (this.DEMO_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            await FeatureService.enableUserFeature(user.id, 'demo_mode');
          }
        } catch (error) {
          console.warn('Could not enable demo mode in Supabase:', error);
        }
      }

      console.log('Demo mode enabled');
      return true;

    } catch (error) {
      console.error('Error enabling demo mode:', error);
      return false;
    }
  }

  /**
   * Disable demo mode
   * @returns {Promise<boolean>} Success status
   */
  static async disableDemoMode() {
    try {
      this.DEMO_CONFIG.demoMode = false;
      
      // Remove from localStorage
      localStorage.removeItem('demoMode');
      
      // Disable demo features if using Supabase
      if (this.DEMO_CONFIG.enableSupabase) {
        try {
          const user = await AuthService.getCurrentUser();
          if (user) {
            await FeatureService.disableUserFeature(user.id, 'demo_mode');
          }
        } catch (error) {
          console.warn('Could not disable demo mode in Supabase:', error);
        }
      }

      console.log('Demo mode disabled');
      return true;

    } catch (error) {
      console.error('Error disabling demo mode:', error);
      return false;
    }
  }

  /**
   * Check if demo mode is enabled
   * @returns {boolean} Demo mode status
   */
  static isDemoMode() {
    // Check localStorage first
    const localDemoMode = localStorage.getItem('demoMode') === 'true';
    return this.DEMO_CONFIG.demoMode || localDemoMode;
  }

  /**
   * Clear all demo data
   * @returns {Promise<boolean>} Success status
   */
  static async clearDemoData() {
    try {
      const demoProfiles = await this.getDemoProfiles();
      
      // Delete each demo profile (this will cascade to timelines and conversations)
      for (const profile of demoProfiles) {
        await ProfileService.deleteProfile(profile.id);
      }

      // Clear cache
      this.demoCache.clear();

      console.log(`Cleared ${demoProfiles.length} demo profiles`);
      return true;

    } catch (error) {
      console.error('Error clearing demo data:', error);
      return false;
    }
  }

  /**
   * Export demo configuration
   * @returns {Object} Demo configuration and data
   */
  static async exportDemoConfig() {
    try {
      const profiles = await this.getDemoProfiles();
      const config = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        demoConfig: this.DEMO_CONFIG,
        profileCount: profiles.length,
        industries: [...new Set(profiles.map(p => p.industry))],
        profiles: profiles.map(profile => ({
          industry: profile.industry,
          companyName: profile.companyName,
          size: profile.size,
          data: profile
        }))
      };

      return config;

    } catch (error) {
      console.error('Error exporting demo config:', error);
      return null;
    }
  }

  /**
   * Import demo configuration
   * @param {Object} config - Demo configuration to import
   * @returns {Promise<boolean>} Success status
   */
  static async importDemoConfig(config) {
    try {
      if (!config || config.version !== '1.0') {
        throw new Error('Invalid demo configuration format');
      }

      // Clear existing demo data
      await this.clearDemoData();

      // Import profiles
      const importedProfiles = [];
      for (const profileConfig of config.profiles) {
        const profile = await this.createDemoProfile(profileConfig.industry);
        if (profile) {
          importedProfiles.push(profile);
        }
      }

      console.log(`Imported ${importedProfiles.length} demo profiles`);
      return true;

    } catch (error) {
      console.error('Error importing demo config:', error);
      return false;
    }
  }

  // ============================================================================
  // INDUSTRY TEMPLATES
  // ============================================================================

  /**
   * Get industry-specific template
   * @param {string} industry - Industry type
   * @returns {Object} Industry template
   */
  static getIndustryTemplate(industry) {
    const templates = {
      technology: {
        companyNames: ['TechNova Solutions', 'CloudPeak Technologies', 'NextGen Systems'],
        sizes: ['51-200 employees', '201-1000 employees', '1000+ employees'],
        businessIssues: ['Revenue Growth Pressure', 'Competitive Differentiation', 'Operational Efficiency'],
        aiReadinessScores: [6, 7, 8, 9],
        technologies: ['Cloud Computing', 'Machine Learning', 'API Development'],
        budgetRanges: ['500k-1m', '1m-5m', '>5m']
      },
      healthcare: {
        companyNames: ['HealthFirst Medical', 'CarePoint Systems', 'MedTech Innovations'],
        sizes: ['201-1000 employees', '1000+ employees'],
        businessIssues: ['Regulatory Compliance', 'Patient Experience', 'Cost Reduction Mandate'],
        aiReadinessScores: [4, 5, 6, 7],
        technologies: ['Electronic Health Records', 'Telemedicine', 'Medical Imaging'],
        budgetRanges: ['100k-500k', '500k-1m', '1m-5m']
      },
      finance: {
        companyNames: ['Capital Dynamics', 'SecureBank Solutions', 'InvestPro Partners'],
        sizes: ['51-200 employees', '201-1000 employees', '1000+ employees'],
        businessIssues: ['Regulatory Compliance', 'Fraud Prevention', 'Customer Experience'],
        aiReadinessScores: [5, 6, 7, 8],
        technologies: ['Risk Management', 'Algorithmic Trading', 'Customer Analytics'],
        budgetRanges: ['500k-1m', '1m-5m', '>5m']
      },
      manufacturing: {
        companyNames: ['Precision Manufacturing', 'Industrial Dynamics', 'SmartFactory Solutions'],
        sizes: ['201-1000 employees', '1000+ employees'],
        businessIssues: ['Operational Efficiency', 'Quality Control', 'Supply Chain Optimization'],
        aiReadinessScores: [3, 4, 5, 6],
        technologies: ['IoT Sensors', 'Predictive Maintenance', 'Quality Control Systems'],
        budgetRanges: ['100k-500k', '500k-1m', '1m-5m']
      },
      retail: {
        companyNames: ['RetailMax Solutions', 'ShopSmart Technologies', 'CustomerFirst Retail'],
        sizes: ['51-200 employees', '201-1000 employees', '1000+ employees'],
        businessIssues: ['Customer Experience', 'Inventory Management', 'Revenue Growth Pressure'],
        aiReadinessScores: [4, 5, 6, 7],
        technologies: ['E-commerce Platform', 'Inventory Management', 'Customer Analytics'],
        budgetRanges: ['100k-500k', '500k-1m', '1m-5m']
      },
      education: {
        companyNames: ['EduTech Solutions', 'Learning Innovations', 'AcademicPlus Systems'],
        sizes: ['51-200 employees', '201-1000 employees'],
        businessIssues: ['Student Engagement', 'Administrative Efficiency', 'Cost Reduction Mandate'],
        aiReadinessScores: [3, 4, 5, 6],
        technologies: ['Learning Management System', 'Student Analytics', 'Virtual Classrooms'],
        budgetRanges: ['<100k', '100k-500k', '500k-1m']
      },
      government: {
        companyNames: ['CivicTech Solutions', 'GovCloud Systems', 'PublicService Technologies'],
        sizes: ['201-1000 employees', '1000+ employees'],
        businessIssues: ['Citizen Experience', 'Operational Efficiency', 'Transparency & Accountability'],
        aiReadinessScores: [2, 3, 4, 5],
        technologies: ['Citizen Portal', 'Document Management', 'Data Analytics'],
        budgetRanges: ['100k-500k', '500k-1m', '1m-5m']
      },
      consulting: {
        companyNames: ['Strategic Advisors', 'ConsultPro Solutions', 'Expert Partners'],
        sizes: ['1-50 employees', '51-200 employees', '201-1000 employees'],
        businessIssues: ['Service Delivery', 'Client Acquisition', 'Knowledge Management'],
        aiReadinessScores: [5, 6, 7, 8],
        technologies: ['Project Management', 'Knowledge Base', 'Client Analytics'],
        budgetRanges: ['<100k', '100k-500k', '500k-1m']
      }
    };

    return templates[industry] || templates.technology;
  }

  /**
   * Generate realistic profile data from template
   * @param {Object} template - Industry template
   * @returns {Object} Generated profile data
   */
  static generateProfileData(template) {
    const companyName = this.randomSelect(template.companyNames);
    const size = this.randomSelect(template.sizes);
    const aiReadinessScore = this.randomSelect(template.aiReadinessScores);
    const primaryBusinessIssue = this.randomSelect(template.businessIssues);
    const budgetRange = this.randomSelect(template.budgetRanges);

    return {
      companyName,
      industry: this.detectIndustryFromTemplate(template),
      size,
      annualRevenue: this.generateRevenueFromSize(size),
      valueSellingFramework: {
        businessIssues: [primaryBusinessIssue, ...this.randomSelect(template.businessIssues, 2)],
        impact: {
          totalAnnualImpact: this.generateImpactFromBudget(budgetRange)
        },
        decisionMakers: {
          economicBuyer: {
            name: this.generateExecutiveName(),
            title: this.generateExecutiveTitle(),
            budget: budgetRange
          },
          technicalBuyer: {
            name: this.generateTechnicalName(),
            title: 'CTO'
          }
        },
        buyingProcess: {
          timeline: this.generateTimeline(),
          stakeholders: 3 + Math.floor(Math.random() * 5)
        }
      },
      aiOpportunityAssessment: {
        aiReadinessScore,
        currentTechnology: this.randomSelect(template.technologies, 2),
        challenges: this.generateChallenges(primaryBusinessIssue),
        goals: this.generateGoals(primaryBusinessIssue)
      },
      changeManagementCapability: this.generateChangeManagement(aiReadinessScore),
      riskTolerance: this.generateRiskTolerance(aiReadinessScore),
      decisionTimeline: this.generateDecisionTimeline(size),
      primaryBusinessIssue,
      isDemoData: true
    };
  }

  // ============================================================================
  // HELPER METHODS
  // ============================================================================

  static randomSelect(array, count = 1) {
    if (count === 1) {
      return array[Math.floor(Math.random() * array.length)];
    }
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  static detectIndustryFromTemplate(template) {
    // Simple industry detection based on company names
    const companyName = template.companyNames[0].toLowerCase();
    if (companyName.includes('tech') || companyName.includes('cloud')) return 'Technology';
    if (companyName.includes('health') || companyName.includes('med')) return 'Healthcare';
    if (companyName.includes('bank') || companyName.includes('capital')) return 'Finance';
    if (companyName.includes('manufacturing') || companyName.includes('factory')) return 'Manufacturing';
    if (companyName.includes('retail') || companyName.includes('shop')) return 'Retail';
    if (companyName.includes('edu') || companyName.includes('academic')) return 'Education';
    if (companyName.includes('gov') || companyName.includes('civic')) return 'Government';
    if (companyName.includes('consult') || companyName.includes('advisor')) return 'Consulting';
    return 'Technology';
  }

  static generateRevenueFromSize(size) {
    const revenueMap = {
      '1-50 employees': ['<5M', '5M-15M'],
      '51-200 employees': ['15M-50M', '50M-100M'],
      '201-1000 employees': ['100M-500M', '500M-1B'],
      '1000+ employees': ['1B-5B', '>5B']
    };
    return this.randomSelect(revenueMap[size] || revenueMap['51-200 employees']);
  }

  static generateImpactFromBudget(budgetRange) {
    const impactMap = {
      '<100k': 250000 + Math.random() * 250000,
      '100k-500k': 500000 + Math.random() * 500000,
      '500k-1m': 1000000 + Math.random() * 1000000,
      '1m-5m': 2500000 + Math.random() * 2500000,
      '>5m': 5000000 + Math.random() * 5000000
    };
    return Math.round(impactMap[budgetRange] || impactMap['500k-1m']);
  }

  static generateExecutiveName() {
    const names = ['Sarah Chen', 'Michael Rodriguez', 'Jennifer Park', 'David Thompson', 'Lisa Wang', 'Robert Johnson'];
    return this.randomSelect(names);
  }

  static generateExecutiveTitle() {
    const titles = ['CEO', 'CFO', 'COO', 'VP of Operations', 'VP of Finance'];
    return this.randomSelect(titles);
  }

  static generateTechnicalName() {
    const names = ['Alex Kumar', 'Emily Foster', 'Marcus Johnson', 'Rachel Lee', 'James Wilson', 'Nina Patel'];
    return this.randomSelect(names);
  }

  static generateTimeline() {
    return 6 + Math.floor(Math.random() * 18); // 6-24 months
  }

  static generateChallenges(businessIssue) {
    const challengeMap = {
      'Revenue Growth Pressure': ['Limited market reach', 'Customer acquisition costs', 'Competitive pricing'],
      'Operational Efficiency': ['Manual processes', 'Resource allocation', 'System integration'],
      'Customer Experience': ['Response time', 'Service quality', 'Personalization'],
      'Cost Reduction Mandate': ['Overhead costs', 'Process automation', 'Resource optimization'],
      'Regulatory Compliance': ['Documentation burden', 'Audit preparation', 'Policy enforcement'],
      'Competitive Differentiation': ['Feature parity', 'Market positioning', 'Value proposition']
    };
    return challengeMap[businessIssue] || challengeMap['Operational Efficiency'];
  }

  static generateGoals(businessIssue) {
    const goalMap = {
      'Revenue Growth Pressure': ['Increase conversion rates', 'Expand market share', 'Improve sales efficiency'],
      'Operational Efficiency': ['Automate workflows', 'Reduce processing time', 'Optimize resources'],
      'Customer Experience': ['Improve satisfaction scores', 'Reduce response time', 'Enhance personalization'],
      'Cost Reduction Mandate': ['Reduce operational costs', 'Improve efficiency', 'Optimize spending'],
      'Regulatory Compliance': ['Ensure compliance', 'Reduce audit risks', 'Streamline reporting'],
      'Competitive Differentiation': ['Develop unique features', 'Improve market position', 'Create value']
    };
    return goalMap[businessIssue] || goalMap['Operational Efficiency'];
  }

  static generateChangeManagement(aiReadinessScore) {
    if (aiReadinessScore >= 7) return 'High';
    if (aiReadinessScore >= 5) return 'Medium';
    return 'Low';
  }

  static generateRiskTolerance(aiReadinessScore) {
    if (aiReadinessScore >= 8) return 'high';
    if (aiReadinessScore >= 5) return 'medium';
    return 'low';
  }

  static generateDecisionTimeline(size) {
    const timelineMap = {
      '1-50 employees': 3 + Math.floor(Math.random() * 6), // 3-9 months
      '51-200 employees': 6 + Math.floor(Math.random() * 6), // 6-12 months
      '201-1000 employees': 9 + Math.floor(Math.random() * 9), // 9-18 months
      '1000+ employees': 12 + Math.floor(Math.random() * 12) // 12-24 months
    };
    return timelineMap[size] || 6;
  }

  static getDemoQuestion(industry) {
    const questions = {
      Technology: "How can we leverage AI to improve our software development lifecycle?",
      Healthcare: "What AI solutions can help us improve patient outcomes and operational efficiency?",
      Finance: "How can AI help us with risk assessment and fraud detection?",
      Manufacturing: "What predictive maintenance solutions would work best for our production line?",
      Retail: "How can we use AI to personalize customer experiences and optimize inventory?",
      Education: "What AI tools can enhance student learning and administrative efficiency?",
      Government: "How can AI improve citizen services while maintaining privacy and transparency?",
      Consulting: "How can we use AI to deliver better insights and efficiency to our clients?"
    };
    return questions[industry] || questions.Technology;
  }

  static getDemoResponse(industry) {
    const responses = {
      Technology: "Based on your development workflow, I recommend implementing AI-powered code review and automated testing solutions.",
      Healthcare: "Consider AI solutions for medical imaging analysis, patient scheduling optimization, and predictive health analytics.",
      Finance: "Machine learning models for fraud detection and risk scoring would provide immediate value for your financial operations.",
      Manufacturing: "IoT sensors combined with predictive analytics can reduce downtime by 30% and optimize maintenance schedules.",
      Retail: "Recommendation engines and demand forecasting AI can increase sales by 15% and reduce inventory costs by 20%.",
      Education: "Adaptive learning platforms and automated grading systems can improve student outcomes and reduce administrative burden.",
      Government: "Citizen service chatbots and document processing automation can improve service delivery and reduce processing times.",
      Consulting: "AI-powered data analysis and report generation tools can increase your team's productivity and client value delivery."
    };
    return responses[industry] || responses.Technology;
  }

  static getDemoRecommendations(industry) {
    const recommendations = {
      Technology: ["Implement AI code review", "Automate testing workflows", "Use AI for bug prediction"],
      Healthcare: ["Deploy medical imaging AI", "Implement patient risk scoring", "Automate clinical documentation"],
      Finance: ["Deploy fraud detection ML", "Implement risk assessment AI", "Automate compliance monitoring"],
      Manufacturing: ["Install IoT sensors", "Implement predictive maintenance", "Optimize production scheduling"],
      Retail: ["Deploy recommendation engine", "Implement demand forecasting", "Automate inventory management"],
      Education: ["Implement adaptive learning", "Deploy automated grading", "Use AI for student analytics"],
      Government: ["Deploy citizen service bots", "Automate document processing", "Implement case management AI"],
      Consulting: ["Use AI for data analysis", "Automate report generation", "Implement client insight tools"]
    };
    return recommendations[industry] || recommendations.Technology;
  }
} 