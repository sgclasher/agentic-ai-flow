'use client';

/**
 * Client Profile Management Service
 * 
 * Handles CRUD operations for client profiles stored as structured markdown files.
 * Integrates with AI services for timeline generation and opportunity analysis.
 */

import { markdownService } from './markdownService';

export class ProfileService {
  /**
   * Create a new client profile
   * @param {Object} profileData - Raw form data
   * @returns {Promise<Object>} Created profile with ID
   */
  static async createProfile(profileData) {
    try {
      // Generate unique ID
      const profileId = this.generateProfileId(profileData.companyName);
      
      // Convert form data to structured markdown
      const markdown = markdownService.generateMarkdown(profileData);
      
      // Store profile (in real implementation, this would save to backend/filesystem)
      const profile = {
        id: profileId,
        ...profileData,
        markdown,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };
      
      await this.saveProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Generate AI timeline from profile data
   * @param {Object} profile - Client profile
   * @returns {Promise<Object>} Timeline data
   */
  static async generateTimelineFromProfile(profile) {
    try {
      // Extract business profile data for timeline service
      const businessProfile = this.extractBusinessProfile(profile);
      
      // Determine scenario type based on profile characteristics
      const scenarioType = this.determineScenarioType(profile);
      
      // Use existing timeline service with enhanced context
      const { TimelineService } = await import('./timelineService');
      const timeline = await TimelineService.generateTimeline(businessProfile, scenarioType);
      
      // Enhance timeline with profile-specific insights
      return this.enhanceTimelineWithProfile(timeline, profile);
    } catch (error) {
      console.error('Error generating timeline from profile:', error);
      throw error;
    }
  }

  /**
   * Extract business profile data from client profile
   */
  static extractBusinessProfile(profile) {
    return {
      companyName: profile.companyName,
      industry: profile.industry,
      companySize: this.mapCompanySize(profile.size),
      aiMaturityLevel: this.calculateAIMaturity(profile),
      primaryGoals: this.extractPrimaryGoals(profile),
      currentTechStack: profile.currentTechnology || [],
      budget: this.estimateBudgetRange(profile),
      timeframe: this.extractTimeframe(profile)
    };
  }

  /**
   * Estimate budget range based on profile
   */
  static estimateBudgetRange(profile) {
    const budget = profile.valueSellingFramework?.decisionMakers?.economicBuyer?.budget;
    if (budget) {
      return budget;
    }
    
    // Estimate based on company size and impact
    const impact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
    if (impact > 5000000) return '>5m';
    if (impact > 1000000) return '1m-5m';
    if (impact > 500000) return '500k-1m';
    if (impact > 100000) return '100k-500k';
    return '<100k';
  }

  /**
   * Extract timeframe from profile
   */
  static extractTimeframe(profile) {
    const timeline = profile.valueSellingFramework?.buyingProcess?.timeline;
    if (timeline) {
      const months = parseInt(timeline);
      if (months <= 3) return '3months';
      if (months <= 6) return '6months';
      if (months <= 12) return '1year';
      return '2years+';
    }
    return '1year'; // Default
  }

  /**
   * Determine AI adoption scenario based on profile characteristics
   */
  static determineScenarioType(profile) {
    const aiReadiness = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    const decisionTimeline = profile.decisionTimeline || 12;
    const riskTolerance = profile.riskTolerance || 'medium';
    
    if (aiReadiness >= 8 && decisionTimeline <= 6 && riskTolerance === 'high') {
      return 'aggressive';
    } else if (aiReadiness <= 4 || decisionTimeline >= 18 || riskTolerance === 'low') {
      return 'conservative';
    }
    return 'balanced';
  }

  /**
   * Generate opportunity recommendations based on profile
   */
  static async generateOpportunityRecommendations(profile) {
    // Analyze profile data to suggest AI/automation opportunities
    const opportunities = [];
    
    // Finance opportunities
    if (profile.problems?.finance?.manualInvoiceProcessing) {
      opportunities.push({
        department: 'Finance',
        title: 'Automated Invoice Processing',
        description: 'AI-powered invoice recognition and approval workflows',
        impact: this.calculateFinanceImpact(profile),
        effort: 'Medium',
        timeline: '3-4 months',
        priority: 'High'
      });
    }
    
    // HR opportunities
    if (profile.problems?.hr?.manualResumeScreening) {
      opportunities.push({
        department: 'HR',
        title: 'AI Resume Screening',
        description: 'Automated candidate screening and ranking',
        impact: this.calculateHRImpact(profile),
        effort: 'Low',
        timeline: '1-2 months',
        priority: 'Medium'
      });
    }
    
    // Customer Service opportunities
    if (profile.problems?.customerService?.responseTime) {
      opportunities.push({
        department: 'Customer Service',
        title: 'AI Chatbot & Routing',
        description: 'Intelligent ticket routing and automated responses',
        impact: this.calculateServiceImpact(profile),
        effort: 'Medium',
        timeline: '2-3 months',
        priority: 'High'
      });
    }
    
    return opportunities.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Enhanced timeline with profile-specific context
   */
  static enhanceTimelineWithProfile(timeline, profile) {
    // Add profile-specific insights to each phase
    if (timeline.phases) {
      timeline.phases = timeline.phases.map((phase, index) => ({
        ...phase,
        profileInsights: this.getPhaseInsights(profile, index),
        specificOpportunities: this.getPhaseOpportunities(profile, index)
      }));
    }
    
    // Add risk factors based on profile
    timeline.riskFactors = this.identifyRiskFactors(profile);
    
    // Add competitive insights
    timeline.competitiveContext = this.getCompetitiveContext(profile);
    
    return timeline;
  }

  /**
   * Get phase-specific insights based on profile
   */
  static getPhaseInsights(profile, phaseIndex) {
    const insights = {
      0: `Focus on ${profile.primaryBusinessIssue} while building foundation`,
      1: `Address ${profile.topProblem} with targeted automation`,
      2: `Scale successful pilots across ${profile.size} organization`,
      3: `Optimize for ${profile.successMetrics?.join(', ')} improvements`
    };
    
    return insights[phaseIndex] || 'Continue systematic AI adoption';
  }

  /**
   * Calculate impact methods
   */
  static calculateFinanceImpact(profile) {
    const laborCosts = profile.valueSellingFramework?.impact?.laborCosts || 0;
    const errorCosts = profile.valueSellingFramework?.impact?.errorCosts || 0;
    // Estimate 30% reduction in finance labor and 80% reduction in errors
    return Math.round((laborCosts * 0.3) + (errorCosts * 0.8));
  }

  static calculateHRImpact(profile) {
    const employeeCount = parseInt(profile.employeeCount) || 100;
    // Estimate savings based on hiring volume
    return Math.round(employeeCount * 1000); // $1000 per employee per year in hiring efficiency
  }

  static calculateServiceImpact(profile) {
    const totalImpact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
    // Customer service typically represents 20-30% of operational impact
    return Math.round(totalImpact * 0.25);
  }

  /**
   * Utility methods
   */
  static generateProfileId(companyName) {
    const timestamp = Date.now().toString(36);
    const nameSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
    return `${nameSlug}-${timestamp}`;
  }

  static mapCompanySize(size) {
    const mapping = {
      '1-50 employees': 'startup',
      '51-200 employees': 'small',
      '201-1000 employees': 'medium',
      '1000+ employees': 'large'
    };
    return mapping[size] || 'medium';
  }

  static calculateAIMaturity(profile) {
    const score = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    if (score <= 3) return 'beginner';
    if (score <= 6) return 'emerging';
    if (score <= 8) return 'developing';
    return 'advanced';
  }

  static extractPrimaryGoals(profile) {
    const goals = [];
    if (profile.businessIssue?.revenueGrowth) goals.push('Increase Revenue');
    if (profile.businessIssue?.costReduction) goals.push('Reduce Operational Costs');
    if (profile.businessIssue?.customerExperience) goals.push('Improve Customer Experience');
    if (profile.businessIssue?.operationalEfficiency) goals.push('Automate Workflows');
    return goals;
  }

  static async saveProfile(profile) {
    // In production, this would save to your backend/database
    // For now, store in localStorage
    const profiles = JSON.parse(localStorage.getItem('clientProfiles') || '[]');
    profiles.push(profile);
    localStorage.setItem('clientProfiles', JSON.stringify(profiles));
  }

  static async getProfiles() {
    // In production, fetch from backend
    return JSON.parse(localStorage.getItem('clientProfiles') || '[]');
  }

  static async getProfile(id) {
    const profiles = await this.getProfiles();
    return profiles.find(p => p.id === id);
  }

  static identifyRiskFactors(profile) {
    const risks = [];
    const aiReadiness = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    
    if (aiReadiness < 4) {
      risks.push({
        type: 'Technical Readiness',
        level: 'High',
        description: 'Low AI readiness score may slow implementation'
      });
    }
    
    if (profile.changeManagementCapability === 'Low') {
      risks.push({
        type: 'Change Management',
        level: 'Medium',
        description: 'Limited change management capability requires extra support'
      });
    }
    
    return risks;
  }

  static getCompetitiveContext(profile) {
    return {
      urgency: profile.competitivePressure ? 'High' : 'Medium',
      differentiators: profile.differentiationRequirements || [],
      marketPosition: profile.industry === 'Technology' ? 'Fast-moving' : 'Traditional'
    };
  }
} 