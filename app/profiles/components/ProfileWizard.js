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
  const departmentalProblems = {
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

  const handleProblemToggle = (department, problem) => {
    const currentProblems = data.valueSellingFramework?.problems?.[department] || {};
    const updated = { ...currentProblems, [problem]: !currentProblems[problem] };
    updateData(`valueSellingFramework.problems.${department}`, updated);
  };

  const handleOtherProblem = (department, value) => {
    updateData(`valueSellingFramework.problems.${department}.other`, value);
  };

  return (
    <div className="wizard-step">
      <h2>Problems & Challenges</h2>
      <p>Identify specific operational issues by department.</p>
      
      {Object.entries(departmentalProblems).map(([department, problems]) => (
        <div key={department} className="department-section">
          <h3>{department.charAt(0).toUpperCase() + department.slice(1)} Department</h3>
          <div className="checkbox-grid">
            {problems.map(problem => (
              <label key={problem} className={`checkbox-card ${
                data.valueSellingFramework?.problems?.[department]?.[problem] ? 'selected' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={data.valueSellingFramework?.problems?.[department]?.[problem] || false}
                  onChange={() => handleProblemToggle(department, problem)}
                />
                <span className="checkbox-text">{problem}</span>
              </label>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor={`${department}Other`}>Other (specify)</label>
            <input
              id={`${department}Other`}
              type="text"
              value={data.valueSellingFramework?.problems?.[department]?.other || ''}
              onChange={(e) => handleOtherProblem(department, e.target.value)}
              placeholder="Describe other issues"
            />
          </div>
        </div>
      ))}
      
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

      <div className="form-section">
        <h3>Root Cause Analysis</h3>
        <p>Why do these challenges exist?</p>
        
        {['Legacy systems with poor integration', 'Manual, paper-based processes', 'Lack of real-time data visibility', 'Insufficient automation', 'Skills gap in technology', 'Siloed departments'].map(cause => (
          <label key={cause} className={`checkbox-card ${
            data.valueSellingFramework?.rootCauses?.includes(cause) ? 'selected' : ''
          }`}>
            <input
              type="checkbox"
              checked={data.valueSellingFramework?.rootCauses?.includes(cause) || false}
              onChange={() => {
                const current = data.valueSellingFramework?.rootCauses || [];
                const updated = current.includes(cause) 
                  ? current.filter(c => c !== cause)
                  : [...current, cause];
                updateData('valueSellingFramework.rootCauses', updated);
              }}
            />
            <span className="checkbox-text">{cause}</span>
          </label>
        ))}
        
        <div className="form-group">
          <label htmlFor="rootCauseOther">Other Root Cause</label>
          <input
            id="rootCauseOther"
            type="text"
            value={data.valueSellingFramework?.rootCauseOther || ''}
            onChange={(e) => updateData('valueSellingFramework.rootCauseOther', e.target.value)}
            placeholder="Specify other root causes"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rootCauseDetails">Root Cause Details</label>
          <textarea
            id="rootCauseDetails"
            value={data.valueSellingFramework?.rootCauseDetails || ''}
            onChange={(e) => updateData('valueSellingFramework.rootCauseDetails', e.target.value)}
            placeholder="Describe the root causes in detail"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function ImpactStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>Impact Analysis</h2>
      <p>Quantify the cost of current challenges.</p>
      
      <div className="form-section">
        <h3>Hard Costs (Annual)</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="laborCosts">Labor costs from manual processes ($)</label>
            <input
              id="laborCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.laborCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.laborCosts', e.target.value)}
              placeholder="450000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="errorCosts">Error correction costs ($)</label>
            <input
              id="errorCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.errorCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.errorCosts', e.target.value)}
              placeholder="75000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="downtimeCosts">System downtime costs ($)</label>
            <input
              id="downtimeCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.downtimeCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.downtimeCosts', e.target.value)}
              placeholder="120000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="complianceCosts">Compliance penalties/risk ($)</label>
            <input
              id="complianceCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.complianceCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.complianceCosts', e.target.value)}
              placeholder="25000"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Soft Costs</h3>
        <div className="form-grid">
          {[
            { key: 'employeeImpact', label: 'Employee frustration/turnover impact' },
            { key: 'customerImpact', label: 'Customer satisfaction impact' },
            { key: 'competitiveImpact', label: 'Competitive disadvantage' },
            { key: 'reputationRisk', label: 'Brand/reputation risk' }
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label}</label>
              <select
                value={data.valueSellingFramework?.impact?.[key] || ''}
                onChange={(e) => updateData(`valueSellingFramework.impact.${key}`, e.target.value)}
              >
                <option value="">Select impact level</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="totalAnnualImpact">Total Estimated Annual Impact ($) *</label>
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
  );
}

function SolutionStep({ data, updateData, onToggle }) {
  const capabilities = [
    'Automate document processing',
    'Streamline approval workflows', 
    'Provide real-time dashboards',
    'Integrate disconnected systems',
    'Enable self-service capabilities',
    'Improve data accuracy',
    'Reduce manual handoffs'
  ];

  const differentiationRequirements = [
    'Industry-specific expertise',
    'Rapid implementation (< 6 months)',
    'No-code/low-code platform',
    'Strong integration capabilities',
    'Proven ROI in similar companies',
    'Comprehensive support/training'
  ];

  const selectedCapabilities = data.valueSellingFramework?.solutionCapabilities || [];
  const selectedDifferentiators = data.valueSellingFramework?.differentiationRequirements || [];

  return (
    <div className="wizard-step">
      <h2>Solution Requirements</h2>
      <p>What capabilities are needed to solve these challenges?</p>

      <div className="form-section">
        <h3>Solution Capabilities Needed</h3>
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
        <div className="form-group">
          <label htmlFor="solutionCapabilitiesOther">Other capabilities needed</label>
          <input
            id="solutionCapabilitiesOther"
            type="text"
            value={data.valueSellingFramework?.solutionCapabilitiesOther || ''}
            onChange={(e) => updateData('valueSellingFramework.solutionCapabilitiesOther', e.target.value)}
            placeholder="Specify other capabilities"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Differentiation Requirements</h3>
        <p>What makes a solution uniquely qualified?</p>
        <div className="checkbox-grid">
          {differentiationRequirements.map(requirement => (
            <label key={requirement} className={`checkbox-card ${selectedDifferentiators.includes(requirement) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={selectedDifferentiators.includes(requirement)}
                onChange={() => onToggle('valueSellingFramework.differentiationRequirements', requirement)}
              />
              <span className="checkbox-text">{requirement}</span>
            </label>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="differentiationOther">Other differentiators</label>
          <input
            id="differentiationOther"
            type="text"
            value={data.valueSellingFramework?.differentiationOther || ''}
            onChange={(e) => updateData('valueSellingFramework.differentiationOther', e.target.value)}
            placeholder="Specify other differentiation requirements"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Value / ROI Expectations</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="costReduction">Target cost reduction</label>
            <input
              id="costReduction"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.costReduction || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.costReduction', e.target.value)}
              placeholder="25% or $500K"
            />
          </div>
          <div className="form-group">
            <label htmlFor="efficiencyImprovement">Target efficiency improvement</label>
            <input
              id="efficiencyImprovement"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.efficiencyImprovement || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.efficiencyImprovement', e.target.value)}
              placeholder="40%"
            />
          </div>
          <div className="form-group">
            <label htmlFor="paybackPeriod">Expected payback period</label>
            <input
              id="paybackPeriod"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.paybackPeriod || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.paybackPeriod', e.target.value)}
              placeholder="12 months"
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetROI">Target ROI</label>
            <input
              id="targetROI"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.targetROI || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.targetROI', e.target.value)}
              placeholder="300%"
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeToFirstValue">Time to first value</label>
            <input
              id="timeToFirstValue"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.timeToFirstValue || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.timeToFirstValue', e.target.value)}
              placeholder="3 months"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Success Metrics</h3>
        <p>How will success be measured?</p>
        {['Process cycle time reduction', 'Error rate improvement', 'Cost per transaction reduction', 'Employee productivity increase', 'Customer satisfaction improvement', 'Revenue impact'].map(metric => (
          <label key={metric} className={`checkbox-card ${
            data.valueSellingFramework?.successMetrics?.includes(metric) ? 'selected' : ''
          }`}>
            <input
              type="checkbox"
              checked={data.valueSellingFramework?.successMetrics?.includes(metric) || false}
              onChange={() => onToggle('valueSellingFramework.successMetrics', metric)}
            />
            <span className="checkbox-text">{metric}</span>
          </label>
        ))}
        <div className="form-group">
          <label htmlFor="successMetricsTargets">Specific targets</label>
          <textarea
            id="successMetricsTargets"
            value={data.valueSellingFramework?.successMetricsTargets || ''}
            onChange={(e) => updateData('valueSellingFramework.successMetricsTargets', e.target.value)}
            placeholder="Detail the numerical targets (e.g., Reduce processing time from 5 days to 1 day)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function DecisionStep({ data, updateData }) {
  const evaluationCriteria = [
    'Technical fit',
    'Cost/ROI',
    'Vendor reputation',
    'Implementation timeline',
    'Support quality'
  ];

  return (
    <div className="wizard-step">
      <h2>Decision Process</h2>
      <p>Who are the key stakeholders and decision makers?</p>
      
      <div className="form-section">
        <h3>Key Decision Makers</h3>
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

          <div className="form-group">
            <label htmlFor="economicBuyerBudget">Budget Authority ($)</label>
            <input
              id="economicBuyerBudget"
              type="number"
              value={data.valueSellingFramework?.decisionMakers?.economicBuyer?.budget || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.economicBuyer.budget', e.target.value)}
              placeholder="1000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="technicalBuyerName">Technical Buyer Name</label>
            <input
              id="technicalBuyerName"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.technicalBuyer?.name || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.technicalBuyer.name', e.target.value)}
              placeholder="Mike Rodriguez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="technicalBuyerTitle">Technical Buyer Title</label>
            <input
              id="technicalBuyerTitle"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.technicalBuyer?.title || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.technicalBuyer.title', e.target.value)}
              placeholder="CTO"
            />
          </div>

          <div className="form-group">
            <label htmlFor="championName">Champion Name</label>
            <input
              id="championName"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.champion?.name || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.champion.name', e.target.value)}
              placeholder="Lisa Park"
            />
          </div>

          <div className="form-group">
            <label htmlFor="championTitle">Champion Title</label>
            <input
              id="championTitle"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.champion?.title || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.champion.title', e.target.value)}
              placeholder="VP Operations"
            />
          </div>

          <div className="form-group">
            <label htmlFor="influencers">Influencers</label>
            <input
              id="influencers"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.influencers || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.influencers', e.target.value)}
              placeholder="Head of Customer Success, Engineering Manager"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Buying Process</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="timeline">Decision timeline</label>
            <input
              id="timeline"
              type="text"
              value={data.valueSellingFramework?.buyingProcess?.timeline || ''}
              onChange={(e) => updateData('valueSellingFramework.buyingProcess.timeline', e.target.value)}
              placeholder="6 months"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budgetCycle">Budget cycle</label>
            <input
              id="budgetCycle"
              type="text"
              value={data.valueSellingFramework?.buyingProcess?.budgetCycle || ''}
              onChange={(e) => updateData('valueSellingFramework.buyingProcess.budgetCycle', e.target.value)}
              placeholder="Q1 planning cycle"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Evaluation criteria</label>
          <div className="checkbox-grid">
            {evaluationCriteria.map(criteria => (
              <label key={criteria} className={`checkbox-card ${
                data.valueSellingFramework?.buyingProcess?.evaluationCriteria?.includes(criteria) ? 'selected' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={data.valueSellingFramework?.buyingProcess?.evaluationCriteria?.includes(criteria) || false}
                  onChange={() => {
                    const current = data.valueSellingFramework?.buyingProcess?.evaluationCriteria || [];
                    const updated = current.includes(criteria) 
                      ? current.filter(c => c !== criteria)
                      : [...current, criteria];
                    updateData('valueSellingFramework.buyingProcess.evaluationCriteria', updated);
                  }}
                />
                <span className="checkbox-text">{criteria}</span>
              </label>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor="evaluationOther">Other evaluation criteria</label>
            <input
              id="evaluationOther"
              type="text"
              value={data.valueSellingFramework?.buyingProcess?.evaluationOther || ''}
              onChange={(e) => updateData('valueSellingFramework.buyingProcess.evaluationOther', e.target.value)}
              placeholder="Specify other criteria"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Risks of Inaction</h3>
        <p>Consequences of doing nothing:</p>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="costEscalation">Continued cost escalation (annually) ($)</label>
            <input
              id="costEscalation"
              type="number"
              value={data.valueSellingFramework?.risksOfInaction?.costEscalation || ''}
              onChange={(e) => updateData('valueSellingFramework.risksOfInaction.costEscalation', e.target.value)}
              placeholder="1200000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="employeeAttrition">Employee attrition risk</label>
            <select
              id="employeeAttrition"
              value={data.valueSellingFramework?.risksOfInaction?.employeeAttrition || ''}
              onChange={(e) => updateData('valueSellingFramework.risksOfInaction.employeeAttrition', e.target.value)}
            >
              <option value="">Select risk level</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="threeYearCost">Estimated cost of inaction (3 years) ($)</label>
            <input
              id="threeYearCost"
              type="number"
              value={data.valueSellingFramework?.risksOfInaction?.threeYearCost || ''}
              onChange={(e) => updateData('valueSellingFramework.risksOfInaction.threeYearCost', e.target.value)}
              placeholder="3600000"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="competitiveDisadvantage">Competitive disadvantage</label>
          <textarea
            id="competitiveDisadvantage"
            value={data.valueSellingFramework?.risksOfInaction?.competitiveDisadvantage || ''}
            onChange={(e) => updateData('valueSellingFramework.risksOfInaction.competitiveDisadvantage', e.target.value)}
            placeholder="Describe the competitive impact of inaction"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerSatisfaction">Customer satisfaction decline</label>
          <textarea
            id="customerSatisfaction"
            value={data.valueSellingFramework?.risksOfInaction?.customerSatisfaction || ''}
            onChange={(e) => updateData('valueSellingFramework.risksOfInaction.customerSatisfaction', e.target.value)}
            placeholder="Describe the customer impact"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="complianceRisk">Regulatory compliance risk</label>
          <textarea
            id="complianceRisk"
            value={data.valueSellingFramework?.risksOfInaction?.complianceRisk || ''}
            onChange={(e) => updateData('valueSellingFramework.risksOfInaction.complianceRisk', e.target.value)}
            placeholder="Describe compliance risks"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}

function AIAssessmentStep({ data, updateData }) {
  const handleOpportunityUpdate = (index, field, value) => {
    const opportunities = [...(data.aiOpportunityAssessment?.opportunities || [])];
    if (!opportunities[index]) {
      opportunities[index] = {};
    }
    opportunities[index][field] = value;
    updateData('aiOpportunityAssessment.opportunities', opportunities);
  };

  const addOpportunity = () => {
    const opportunities = [...(data.aiOpportunityAssessment?.opportunities || [])];
    opportunities.push({
      name: '',
      department: '',
      process: '',
      currentState: '',
      aiSolution: '',
      estimatedImpact: '',
      implementationEffort: 'Medium',
      timeline: '',
      priorityScore: 5
    });
    updateData('aiOpportunityAssessment.opportunities', opportunities);
  };

  const removeOpportunity = (index) => {
    const opportunities = [...(data.aiOpportunityAssessment?.opportunities || [])];
    opportunities.splice(index, 1);
    updateData('aiOpportunityAssessment.opportunities', opportunities);
  };

  const updateQuickWin = (index, field, value) => {
    const quickWins = [...(data.aiOpportunityAssessment?.quickWins || [])];
    if (!quickWins[index]) quickWins[index] = {};
    quickWins[index][field] = value;
    updateData('aiOpportunityAssessment.quickWins', quickWins);
  };

  const addQuickWin = () => {
    const quickWins = [...(data.aiOpportunityAssessment?.quickWins || [])];
    quickWins.push({ name: '', impact: '', timeline: '' });
    updateData('aiOpportunityAssessment.quickWins', quickWins);
  };

  return (
    <div className="wizard-step">
      <h2>AI/Automation Opportunity Assessment</h2>
      <p>Evaluate current technology landscape and identify AI opportunities.</p>
      
      <div className="form-section">
        <h3>Current Technology Landscape</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="primaryERP">Primary ERP</label>
            <input
              id="primaryERP"
              type="text"
              value={data.aiOpportunityAssessment?.currentTechnology?.erp || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.erp', e.target.value)}
              placeholder="SAP, Oracle, NetSuite, etc."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="crmSystem">CRM System</label>
            <input
              id="crmSystem"
              type="text"
              value={data.aiOpportunityAssessment?.currentTechnology?.crm || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.crm', e.target.value)}
              placeholder="Salesforce, HubSpot, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="collaborationTools">Collaboration Tools</label>
            <input
              id="collaborationTools"
              type="text"
              value={data.aiOpportunityAssessment?.currentTechnology?.collaboration || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.collaboration', e.target.value)}
              placeholder="Slack, Teams, Zoom, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="integrationMaturity">Integration Maturity</label>
            <select
              id="integrationMaturity"
              value={data.aiOpportunityAssessment?.currentTechnology?.integrationMaturity || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.integrationMaturity', e.target.value)}
            >
              <option value="">Select maturity level</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dataQuality">Data Quality</label>
            <select
              id="dataQuality"
              value={data.aiOpportunityAssessment?.currentTechnology?.dataQuality || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.dataQuality', e.target.value)}
            >
              <option value="">Select quality level</option>
              <option value="Poor">Poor</option>
              <option value="Fair">Fair</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="currentAutomation">Current Automation</label>
          <textarea
            id="currentAutomation"
            value={data.aiOpportunityAssessment?.currentTechnology?.automation || ''}
            onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.automation', e.target.value)}
            placeholder="Describe existing automation tools and processes"
            rows={3}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>AI Readiness Score</h3>
        <div className="ai-readiness-scoring">
          <div className="scoring-criteria">
            {[
              { key: 'dataQuality', label: 'Data availability and quality', max: 2 },
              { key: 'integration', label: 'System integration capability', max: 2 },
              { key: 'technicalTeam', label: 'Technical team readiness', max: 2 },
              { key: 'leadership', label: 'Leadership support', max: 2 },
              { key: 'changeManagement', label: 'Change management capability', max: 2 }
            ].map(({ key, label, max }) => (
              <div key={key} className="scoring-item">
                <label>{label}</label>
                <div className="score-input">
                  <input
                    type="range"
                    min="0"
                    max={max}
                    value={data.aiOpportunityAssessment?.readinessScoring?.[key] || 0}
                    onChange={(e) => updateData(`aiOpportunityAssessment.readinessScoring.${key}`, parseInt(e.target.value))}
                  />
                  <span className="score-value">
                    {data.aiOpportunityAssessment?.readinessScoring?.[key] || 0}/{max}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="total-score">
            <strong>Total AI Readiness Score: {
              Object.values(data.aiOpportunityAssessment?.readinessScoring || {}).reduce((sum, score) => sum + (score || 0), 0)
            }/10</strong>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Top AI Opportunities (Prioritized)</h3>
        {(data.aiOpportunityAssessment?.opportunities || []).map((opportunity, index) => (
          <div key={index} className="opportunity-card">
            <div className="opportunity-header">
              <h4>Opportunity {index + 1}</h4>
              <button type="button" onClick={() => removeOpportunity(index)} className="btn-danger btn-small">Remove</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={opportunity.name || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'name', e.target.value)}
                  placeholder="e.g., Invoice Processing Automation"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  value={opportunity.department || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'department', e.target.value)}
                >
                  <option value="">Select department</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Process</label>
                <input
                  type="text"
                  value={opportunity.process || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'process', e.target.value)}
                  placeholder="Specific process to automate"
                />
              </div>
              <div className="form-group">
                <label>Current State</label>
                <input
                  type="text"
                  value={opportunity.currentState || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'currentState', e.target.value)}
                  placeholder="How it works today"
                />
              </div>
              <div className="form-group">
                <label>AI Solution</label>
                <input
                  type="text"
                  value={opportunity.aiSolution || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'aiSolution', e.target.value)}
                  placeholder="What AI would do"
                />
              </div>
              <div className="form-group">
                <label>Estimated Impact ($)</label>
                <input
                  type="number"
                  value={opportunity.estimatedImpact || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'estimatedImpact', e.target.value)}
                  placeholder="Annual savings/benefit"
                />
              </div>
              <div className="form-group">
                <label>Implementation Effort</label>
                <select
                  value={opportunity.implementationEffort || 'Medium'}
                  onChange={(e) => handleOpportunityUpdate(index, 'implementationEffort', e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input
                  type="text"
                  value={opportunity.timeline || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'timeline', e.target.value)}
                  placeholder="e.g., 3 months"
                />
              </div>
              <div className="form-group">
                <label>Priority Score (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={opportunity.priorityScore || 5}
                  onChange={(e) => handleOpportunityUpdate(index, 'priorityScore', parseInt(e.target.value))}
                />
                <div className="score-display">{opportunity.priorityScore || 5}/10</div>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addOpportunity} className="btn-secondary">Add Opportunity</button>
      </div>

      <div className="form-section">
        <h3>Quick Wins (0-6 months)</h3>
        {(data.aiOpportunityAssessment?.quickWins || []).map((quickWin, index) => (
          <div key={index} className="quick-win-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Opportunity name</label>
                <input
                  type="text"
                  value={quickWin.name || ''}
                  onChange={(e) => updateQuickWin(index, 'name', e.target.value)}
                  placeholder="e.g., Automated ticket routing"
                />
              </div>
              <div className="form-group">
                <label>Impact ($)</label>
                <input
                  type="number"
                  value={quickWin.impact || ''}
                  onChange={(e) => updateQuickWin(index, 'impact', e.target.value)}
                  placeholder="50000"
                />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input
                  type="text"
                  value={quickWin.timeline || ''}
                  onChange={(e) => updateQuickWin(index, 'timeline', e.target.value)}
                  placeholder="1 month"
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuickWin} className="btn-secondary btn-small">Add Quick Win</button>
      </div>
    </div>
  );
}

// Add custom styles for the enhanced form elements
const styles = `
  .ai-readiness-scoring {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
  }

  .scoring-criteria {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .scoring-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .scoring-item label {
    flex: 1;
    font-weight: 500;
    margin: 0;
  }

  .score-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
  }

  .score-input input[type="range"] {
    flex: 1;
    min-width: 80px;
  }

  .score-value {
    font-weight: bold;
    color: #2563eb;
    min-width: 30px;
    text-align: center;
  }

  .total-score {
    text-align: center;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #e0f2fe;
    border-radius: 6px;
    color: #0277bd;
    font-size: 1.1rem;
  }

  .opportunity-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1rem 0;
    background: #fafafa;
  }

  .opportunity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .opportunity-header h4 {
    margin: 0;
    color: #1565c0;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 0.5rem 0;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .quick-win-item {
    background: #f0f9ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 1rem;
    margin: 0.5rem 0;
  }

  .score-display {
    text-align: center;
    font-weight: bold;
    color: #2563eb;
    margin-top: 0.25rem;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .checkbox-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }

  .checkbox-card:hover {
    border-color: #2563eb;
    background: #f8fafc;
  }

  .checkbox-card.selected {
    border-color: #2563eb;
    background: #eff6ff;
  }

  .checkbox-card input[type="checkbox"] {
    margin: 0;
  }

  .checkbox-text {
    flex: 1;
    font-size: 0.9rem;
  }

  .form-section {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fafafa;
  }

  .form-section h3 {
    margin-top: 0;
    color: #1f2937;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-group label {
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .checkbox-grid {
      grid-template-columns: 1fr;
    }
    
    .opportunity-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 