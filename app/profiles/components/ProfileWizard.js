'use client';

import React, { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import { markdownService } from '../../services/markdownService';
import { DemoDataService } from '../../services/demoDataService';

const WIZARD_STEPS = [
  { id: 'company', title: 'Company Info', icon: '🏢' },
  { id: 'challenge', title: 'Main Challenge', icon: '🎯' },
  { id: 'goals', title: 'Goals & Next Steps', icon: '🚀' }
];

export default function ProfileWizard({ onComplete, onCancel, initialData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState(initialData || {
    companyName: '',
    industry: '',
    size: '',
    annualRevenue: '',
    primaryLocation: '',
    mainChallenge: '',
    businessGoals: '',
    currentSituation: '',
    timeline: '6 months',
    budget: '',
    notes: ''
  });
  
  const [isGeneratingTimeline, setIsGeneratingTimeline] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const updateProfileData = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Company Info
        return profileData.companyName && profileData.industry && profileData.size;
      case 1: // Challenge
        return profileData.mainChallenge;
      case 2: // Goals
        return profileData.businessGoals;
      default:
        return false;
    }
  };

  // Convert simple form data to complex structure expected by ProfileService
  const convertToComplexStructure = (simpleData) => {
    return {
      companyName: simpleData.companyName,
      industry: simpleData.industry,
      size: simpleData.size,
      annualRevenue: simpleData.annualRevenue || 'Not specified',
      employeeCount: simpleData.size.includes('1-50') ? '25' : 
                    simpleData.size.includes('51-200') ? '125' : 
                    simpleData.size.includes('201-1000') ? '500' : '1000+',
      primaryLocation: simpleData.primaryLocation || 'Not specified',
      valueSellingFramework: {
        businessIssues: ['Operational Efficiency'], // Default
        businessIssueDetails: simpleData.mainChallenge,
        problems: {
          operations: {
            selectedProblems: ['Manual processes'],
            otherProblems: simpleData.mainChallenge
          }
        },
        impact: {
          totalAnnualImpact: 500000, // Default reasonable estimate
          laborCosts: 300000,
          inefficiencyDescription: simpleData.mainChallenge
        },
        solutionCapabilities: ['Automate processes', 'Improve efficiency'],
        decisionMakers: {
          economicBuyer: {
            name: 'Decision Maker',
            title: 'Executive'
          }
        },
        buyingProcess: {
          timeline: simpleData.timeline,
          budget: simpleData.budget
        }
      },
      aiOpportunityAssessment: {
        currentTechnology: {
          level: 'Basic'
        },
        aiReadinessScore: 6,
        opportunities: [{
          title: 'Process Automation',
          description: `Automate manual processes related to: ${simpleData.mainChallenge}`,
          impact: 'High',
          effort: 'Medium',
          timeline: simpleData.timeline || '6 months'
        }],
        quickWins: [{
          title: 'Initial Assessment',
          description: 'Conduct detailed process analysis',
          timeframe: '2-4 weeks'
        }]
      },
      summary: {
        currentState: simpleData.currentSituation || simpleData.mainChallenge,
        recommendedApproach: simpleData.businessGoals,
        notes: simpleData.notes
      }
    };
  };

  const handleComplete = async () => {
    try {
      const complexProfile = convertToComplexStructure(profileData);
      console.log('Creating profile with data:', complexProfile);
      const profile = await ProfileService.createProfile(complexProfile);
      console.log('Profile created successfully:', profile);
      onComplete(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
      alert('Error creating profile: ' + error.message);
    }
  };

  const generateTimelineFromProfile = async () => {
    try {
      setIsGeneratingTimeline(true);
      
      // Create the profile 
      const complexProfile = convertToComplexStructure(profileData);
      const profile = await ProfileService.createProfile(complexProfile);
      
      // Complete the wizard
      onComplete(profile);
      
      // Just go back to profiles page - they can click the AI Timeline button there
      alert('Profile created successfully! Click the "AI Timeline" button on your profile card to generate the timeline.');
      
    } catch (error) {
      console.error('Error:', error);
      alert('Error creating profile: ' + error.message);
    } finally {
      setIsGeneratingTimeline(false);
    }
  };

  const loadDemoData = (demoType) => {
    const demoProfile = DemoDataService.getDemoProfile(demoType);
    // Convert complex demo data to simple format
    setProfileData({
      companyName: demoProfile.companyName,
      industry: demoProfile.industry,
      size: demoProfile.size,
      annualRevenue: demoProfile.annualRevenue,
      primaryLocation: demoProfile.primaryLocation,
      mainChallenge: demoProfile.valueSellingFramework?.businessIssueDetails || 'Manual processes causing inefficiencies',
      businessGoals: demoProfile.summary?.recommendedApproach || 'Improve operational efficiency through automation',
      currentSituation: demoProfile.summary?.currentState || 'Current manual processes are time-consuming',
      timeline: demoProfile.valueSellingFramework?.buyingProcess?.timeline || '6 months',
      budget: demoProfile.valueSellingFramework?.buyingProcess?.budget || 'Not specified',
      notes: demoProfile.summary?.notes || ''
    });
    setCurrentStep(0);
  };

  const renderCurrentStep = () => {
    const currentStepId = WIZARD_STEPS[currentStep].id;

    switch (currentStepId) {
      case 'company':
        return <CompanyStep data={profileData} updateData={updateProfileData} />;
      case 'challenge':
        return <ChallengeStep data={profileData} updateData={updateProfileData} />;
      case 'goals':
        return <GoalsStep data={profileData} updateData={updateProfileData} onGenerateTimeline={generateTimelineFromProfile} isGenerating={isGeneratingTimeline} />;
      default:
        return null;
    }
  };

  const markdownPreview = showMarkdownPreview ? markdownService.generateMarkdown(convertToComplexStructure(profileData)) : '';

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
            {showMarkdownPreview ? 'Hide Preview' : 'Show Preview'}
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

// Simplified Step Components
function CompanyStep({ data, updateData }) {
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
      <h2>Company Information</h2>
      <p>Let's start with some basic information about your client.</p>

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
          <label htmlFor="annualRevenue">Annual Revenue (Optional)</label>
          <input
            id="annualRevenue"
            type="text"
            value={data.annualRevenue || ''}
            onChange={(e) => updateData('annualRevenue', e.target.value)}
            placeholder="e.g., $50M, $1.2B"
          />
        </div>

        <div className="form-group">
          <label htmlFor="primaryLocation">Location (Optional)</label>
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

function ChallengeStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>Main Business Challenge</h2>
      <p>What's the primary challenge or pain point this company is facing?</p>

      <div className="form-group">
        <label htmlFor="mainChallenge">Primary Challenge *</label>
        <textarea
          id="mainChallenge"
          value={data.mainChallenge || ''}
          onChange={(e) => updateData('mainChallenge', e.target.value)}
          placeholder="Describe the main business challenge or inefficiency..."
          rows={4}
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="currentSituation">Current Situation (Optional)</label>
        <textarea
          id="currentSituation"
          value={data.currentSituation || ''}
          onChange={(e) => updateData('currentSituation', e.target.value)}
          placeholder="Describe how things currently work and why it's problematic..."
          rows={3}
        />
      </div>
    </div>
  );
}

function GoalsStep({ data, updateData, onGenerateTimeline, isGenerating }) {
  return (
    <div className="wizard-step">
      <h2>Goals & Next Steps</h2>
      <p>What does the company want to achieve and what's their timeline?</p>

      <div className="form-group">
        <label htmlFor="businessGoals">Business Goals *</label>
        <textarea
          id="businessGoals"
          value={data.businessGoals || ''}
          onChange={(e) => updateData('businessGoals', e.target.value)}
          placeholder="What do they want to achieve? What would success look like?"
          rows={4}
          required
        />
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="timeline">Timeline</label>
          <select
            id="timeline"
            value={data.timeline || ''}
            onChange={(e) => updateData('timeline', e.target.value)}
          >
            <option value="3 months">3 months</option>
            <option value="6 months">6 months</option>
            <option value="12 months">12 months</option>
            <option value="18+ months">18+ months</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="budget">Budget Range (Optional)</label>
          <input
            id="budget"
            type="text"
            value={data.budget || ''}
            onChange={(e) => updateData('budget', e.target.value)}
            placeholder="e.g., $100K-500K"
          />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="notes">Additional Notes (Optional)</label>
        <textarea
          id="notes"
          value={data.notes || ''}
          onChange={(e) => updateData('notes', e.target.value)}
          placeholder="Any other important details, stakeholder info, competitive insights, etc."
          rows={3}
        />
      </div>

      <div className="action-buttons">
        <button 
          type="button"
          className="btn-timeline"
          onClick={onGenerateTimeline}
          disabled={isGenerating}
        >
          {isGenerating ? 'Creating Profile...' : '✅ Create Profile & Continue'}
        </button>
      </div>
    </div>
  );
} 