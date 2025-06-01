'use client';

import React, { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import { markdownService } from '../../services/markdownService';
import { demoDataService } from '../../services/demoDataService';

const WIZARD_STEPS = [
  { id: 'company', title: 'Company Overview', icon: '🏢' },
  { id: 'business-issue', title: 'Business Issue', icon: '🎯' },
  { id: 'problems', title: 'Problems & Challenges', icon: '⚠️' },
  { id: 'impact', title: 'Impact Analysis', icon: '💰' },
  { id: 'solution', title: 'Solution Requirements', icon: '🔧' },
  { id: 'decision', title: 'Decision Process', icon: '👥' },
  { id: 'ai-assessment', title: 'AI Opportunities', icon: '🤖' },
  { id: 'summary', title: 'Summary & Next Steps', icon: '📋' }
];

export default function ProfileWizard({ onComplete, onCancel, initialData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState(initialData || {
    companyName: '',
    industry: '',
    size: '',
    annualRevenue: '',
    employeeCount: '',
    primaryLocation: '',
    valueSellingFramework: {
      businessIssues: [],
      problems: {
        finance: {},
        hr: {},
        it: {},
        customerService: {},
        operations: {}
      },
      impact: {},
      solutionCapabilities: [],
      decisionMakers: {},
      buyingProcess: {},
      risksOfInaction: {}
    },
    aiOpportunityAssessment: {
      currentTechnology: {},
      aiReadinessScore: 5,
      opportunities: [],
      quickWins: [],
      strategicInitiatives: [],
      futureOpportunities: []
    },
    summary: {
      nextSteps: []
    }
  });
  
  const [isGeneratingTimeline, setIsGeneratingTimeline] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const updateProfileData = (path, value) => {
    setProfileData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayToggle = (path, value) => {
    const currentArray = getNestedValue(profileData, path) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateProfileData(path, newArray);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Company Overview
        return profileData.companyName && profileData.industry && profileData.size;
      case 1: // Business Issue
        return getNestedValue(profileData, 'valueSellingFramework.businessIssues')?.length > 0;
      case 2: // Problems
        return true; // Optional step
      case 3: // Impact
        return getNestedValue(profileData, 'valueSellingFramework.impact.totalAnnualImpact');
      case 4: // Solution
        return getNestedValue(profileData, 'valueSellingFramework.solutionCapabilities')?.length > 0;
      case 5: // Decision
        return getNestedValue(profileData, 'valueSellingFramework.decisionMakers.economicBuyer.name');
      case 6: // AI Assessment
        return profileData.aiOpportunityAssessment?.aiReadinessScore;
      case 7: // Summary
        return true;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    try {
      const profile = await ProfileService.createProfile(profileData);
      onComplete(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const generateTimelineFromProfile = async () => {
    try {
      setIsGeneratingTimeline(true);
      const timeline = await ProfileService.generateTimelineFromProfile(profileData);
      
      // Navigate to timeline page with profile data
      window.location.href = `/profiles/${profileData.id || 'new'}/timeline`;
    } catch (error) {
      console.error('Error generating timeline:', error);
    } finally {
      setIsGeneratingTimeline(false);
    }
  };

  const loadDemoData = (demoType) => {
    const demoProfile = demoDataService.getDemoProfile(demoType);
    setProfileData(demoProfile);
    setCurrentStep(0); // Reset to first step to see the data
  };

  const renderCurrentStep = () => {
    const currentStepId = WIZARD_STEPS[currentStep].id;

    switch (currentStepId) {
      case 'company':
        return <CompanyOverviewStep data={profileData} updateData={updateProfileData} />;
      case 'business-issue':
        return <BusinessIssueStep data={profileData} updateData={updateProfileData} onToggle={handleArrayToggle} />;
      case 'problems':
        return <ProblemsStep data={profileData} updateData={updateProfileData} />;
      case 'impact':
        return <ImpactStep data={profileData} updateData={updateProfileData} />;
      case 'solution':
        return <SolutionStep data={profileData} updateData={updateProfileData} onToggle={handleArrayToggle} />;
      case 'decision':
        return <DecisionStep data={profileData} updateData={updateProfileData} />;
      case 'ai-assessment':
        return <AIAssessmentStep data={profileData} updateData={updateProfileData} />;
      case 'summary':
        return <SummaryStep data={profileData} updateData={updateProfileData} onGenerateTimeline={generateTimelineFromProfile} isGenerating={isGeneratingTimeline} />;
      default:
        return null;
    }
  };

  const markdownPreview = showMarkdownPreview ? markdownService.generateMarkdown(profileData) : '';

  return (
    <div className="profile-wizard">
      <div className="wizard-header">
        <h1>Create Client Profile</h1>
        <div className="wizard-progress">
          <div className="progress-steps">
            {WIZARD_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="wizard-content">
        <div className="wizard-main">
          {renderCurrentStep()}
        </div>

        {showMarkdownPreview && (
          <div className="wizard-sidebar">
            <div className="markdown-preview">
              <h3>Markdown Preview</h3>
              <pre className="markdown-content">{markdownPreview}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        <div className="left-actions">
          <button 
            type="button" 
            className="btn-secondary btn-small"
            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
          >
            {showMarkdownPreview ? 'Hide Preview' : 'Show Markdown'}
          </button>
          
          <div className="demo-data-dropdown">
            <select 
              onChange={(e) => e.target.value && loadDemoData(e.target.value)}
              className="btn-secondary btn-small"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Load Demo Data</option>
              <option value="tech-startup">TechFlow Solutions (SaaS)</option>
              <option value="manufacturing">PrecisionParts Manufacturing</option>
              <option value="healthcare">Regional Medical Center</option>
              <option value="finance">Community Trust Bank</option>
            </select>
          </div>
        </div>

        <div className="main-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={currentStep === 0 ? onCancel : () => setCurrentStep(currentStep - 1)}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < WIZARD_STEPS.length - 1 ? (
            <button 
              type="button" 
              className="btn-primary"
              disabled={!canProceedToNext()}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-success"
              onClick={handleComplete}
            >
              Create Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function CompanyOverviewStep({ data, updateData }) {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Transportation', 'Energy', 'Other'
  ];

  const companySizes = [
    '1-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees'
  ];

  return (
    <div className="wizard-step">
      <h2>Company Overview</h2>
      <p>Let's start with basic information about your client.</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            id="companyName"
            type="text"
            value={data.companyName || ''}
            onChange={(e) => updateData('companyName', e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <select
            id="industry"
            value={data.industry || ''}
            onChange={(e) => updateData('industry', e.target.value)}
            required
          >
            <option value="">Select industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Company Size *</label>
          <div className="radio-group">
            {companySizes.map(size => (
              <label key={size} className="radio-label">
                <input
                  type="radio"
                  name="companySize"
                  value={size}
                  checked={data.size === size}
                  onChange={(e) => updateData('size', e.target.value)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="annualRevenue">Annual Revenue</label>
          <input
            id="annualRevenue"
            type="text"
            value={data.annualRevenue || ''}
            onChange={(e) => updateData('annualRevenue', e.target.value)}
            placeholder="e.g., 50M, 1.2B"
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeCount">Employee Count</label>
          <input
            id="employeeCount"
            type="number"
            value={data.employeeCount || ''}
            onChange={(e) => updateData('employeeCount', e.target.value)}
            placeholder="Number of employees"
          />
        </div>

        <div className="form-group">
          <label htmlFor="primaryLocation">Primary Location</label>
          <input
            id="primaryLocation"
            type="text"
            value={data.primaryLocation || ''}
            onChange={(e) => updateData('primaryLocation', e.target.value)}
            placeholder="City, State/Country"
          />
        </div>
      </div>
    </div>
  );
}

function BusinessIssueStep({ data, updateData, onToggle }) {
  const businessIssues = [
    'Revenue Growth Pressure',
    'Cost Reduction Mandate',
    'Operational Efficiency', 
    'Customer Experience',
    'Digital Transformation',
    'Regulatory Compliance',
    'Competitive Pressure'
  ];

  const selectedIssues = data.valueSellingFramework?.businessIssues || [];

  return (
    <div className="wizard-step">
      <h2>Business Issue</h2>
      <p>What are the high-level strategic priorities or C-level concerns?</p>

      <div className="checkbox-grid">
        {businessIssues.map(issue => (
          <label key={issue} className={`checkbox-card ${selectedIssues.includes(issue) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={selectedIssues.includes(issue)}
              onChange={() => onToggle('valueSellingFramework.businessIssues', issue)}
            />
            <span className="checkbox-text">{issue}</span>
          </label>
        ))}
      </div>

      <div className="form-group">
        <label htmlFor="businessIssueOther">Other (specify)</label>
        <input
          id="businessIssueOther"
          type="text"
          value={data.valueSellingFramework?.businessIssueOther || ''}
          onChange={(e) => updateData('valueSellingFramework.businessIssueOther', e.target.value)}
          placeholder="Describe other business issues"
        />
      </div>

      <div className="form-group">
        <label htmlFor="businessIssueDetails">Details</label>
        <textarea
          id="businessIssueDetails"
          value={data.valueSellingFramework?.businessIssueDetails || ''}
          onChange={(e) => updateData('valueSellingFramework.businessIssueDetails', e.target.value)}
          placeholder="Describe the main business issue in detail"
          rows={4}
        />
      </div>
    </div>
  );
}

function SummaryStep({ data, updateData, onGenerateTimeline, isGenerating }) {
  return (
    <div className="wizard-step">
      <h2>Summary & Next Steps</h2>
      <p>Review your client profile and define next steps.</p>

      <div className="form-group">
        <label htmlFor="currentState">Current State Summary</label>
        <textarea
          id="currentState"
          value={data.summary?.currentState || ''}
          onChange={(e) => updateData('summary.currentState', e.target.value)}
          placeholder="Brief description of key challenges and costs"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="recommendedApproach">Recommended Approach</label>
        <textarea
          id="recommendedApproach"
          value={data.summary?.recommendedApproach || ''}
          onChange={(e) => updateData('summary.recommendedApproach', e.target.value)}
          placeholder="High-level strategy recommendation"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes & Additional Context</label>
        <textarea
          id="notes"
          value={data.summary?.notes || ''}
          onChange={(e) => updateData('summary.notes', e.target.value)}
          placeholder="Additional observations, quotes from stakeholders, competitive insights, etc."
          rows={4}
        />
      </div>

      <div className="action-buttons">
        <button 
          type="button"
          className="btn-timeline"
          onClick={onGenerateTimeline}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : '🚀 Generate AI Timeline'}
        </button>
      </div>
    </div>
  );
}

function ProblemsStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>Problems & Challenges</h2>
      <p>Identify specific operational issues by department.</p>
      
      <div className="form-group">
        <label htmlFor="additionalChallenges">Additional Challenges</label>
        <textarea
          id="additionalChallenges"
          value={data.valueSellingFramework?.additionalChallenges || ''}
          onChange={(e) => updateData('valueSellingFramework.additionalChallenges', e.target.value)}
          placeholder="Describe other operational challenges"
          rows={4}
        />
      </div>
    </div>
  );
}

function ImpactStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>Impact Analysis</h2>
      <p>Quantify the cost of current challenges.</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="laborCosts">Annual Labor Costs ($)</label>
          <input
            id="laborCosts"
            type="number"
            value={data.valueSellingFramework?.impact?.laborCosts || ''}
            onChange={(e) => updateData('valueSellingFramework.impact.laborCosts', e.target.value)}
            placeholder="450000"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="totalAnnualImpact">Total Annual Impact ($) *</label>
          <input
            id="totalAnnualImpact"
            type="number"
            value={data.valueSellingFramework?.impact?.totalAnnualImpact || ''}
            onChange={(e) => updateData('valueSellingFramework.impact.totalAnnualImpact', e.target.value)}
            placeholder="850000"
            required
          />
        </div>
      </div>
    </div>
  );
}

function SolutionStep({ data, updateData, onToggle }) {
  const capabilities = [
    'Automate document processing',
    'Streamline approval workflows', 
    'Provide real-time dashboards',
    'Integrate disconnected systems',
    'Enable self-service capabilities'
  ];

  const selectedCapabilities = data.valueSellingFramework?.solutionCapabilities || [];

  return (
    <div className="wizard-step">
      <h2>Solution Requirements</h2>
      <p>What capabilities are needed to solve these challenges?</p>

      <div className="checkbox-grid">
        {capabilities.map(capability => (
          <label key={capability} className={`checkbox-card ${selectedCapabilities.includes(capability) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={selectedCapabilities.includes(capability)}
              onChange={() => onToggle('valueSellingFramework.solutionCapabilities', capability)}
            />
            <span className="checkbox-text">{capability}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

function DecisionStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>Decision Process</h2>
      <p>Who are the key stakeholders and decision makers?</p>
      
      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="economicBuyerName">Economic Buyer Name *</label>
          <input
            id="economicBuyerName"
            type="text"
            value={data.valueSellingFramework?.decisionMakers?.economicBuyer?.name || ''}
            onChange={(e) => updateData('valueSellingFramework.decisionMakers.economicBuyer.name', e.target.value)}
            placeholder="Sarah Chen"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="economicBuyerTitle">Economic Buyer Title</label>
          <input
            id="economicBuyerTitle"
            type="text"
            value={data.valueSellingFramework?.decisionMakers?.economicBuyer?.title || ''}
            onChange={(e) => updateData('valueSellingFramework.decisionMakers.economicBuyer.title', e.target.value)}
            placeholder="CEO"
          />
        </div>
      </div>
    </div>
  );
}

function AIAssessmentStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>AI Opportunity Assessment</h2>
      <p>Evaluate AI readiness and identify opportunities.</p>
      
      <div className="form-group">
        <label htmlFor="aiReadinessScore">AI Readiness Score (1-10) *</label>
        <input
          id="aiReadinessScore"
          type="range"
          min="1"
          max="10"
          value={data.aiOpportunityAssessment?.aiReadinessScore || 5}
          onChange={(e) => updateData('aiOpportunityAssessment.aiReadinessScore', parseInt(e.target.value))}
        />
        <div style={{ textAlign: 'center', marginTop: '0.5rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
          {data.aiOpportunityAssessment?.aiReadinessScore || 5}/10
        </div>
      </div>
    </div>
  );
} 