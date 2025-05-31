'use client';

import React, { useState } from 'react';

const industries = [
  'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail', 
  'Education', 'Real Estate', 'Transportation', 'Energy', 'Other'
];

const companySizes = [
  { value: 'startup', label: '1-50 employees' },
  { value: 'small', label: '51-200 employees' },
  { value: 'medium', label: '201-1000 employees' },
  { value: 'large', label: '1000+ employees' },
];

const maturityLevels = [
  { value: 'beginner', label: 'Just Starting', description: 'Little to no AI/automation' },
  { value: 'emerging', label: 'Emerging', description: 'Some basic automation' },
  { value: 'developing', label: 'Developing', description: 'Several AI initiatives' },
  { value: 'advanced', label: 'Advanced', description: 'Mature AI adoption' },
];

const primaryGoals = [
  'Cost Reduction',
  'Revenue Growth',
  'Customer Experience',
  'Operational Efficiency',
  'Innovation',
  'Risk Management',
  'Employee Productivity',
  'Data-Driven Insights'
];

export default function BusinessProfileModal({ onClose, onSubmit, isGenerating, initialData }) {
  const [formData, setFormData] = useState({
    companyName: initialData?.companyName || '',
    industry: initialData?.industry || '',
    companySize: initialData?.companySize || '',
    aiMaturityLevel: initialData?.aiMaturityLevel || '',
    primaryGoals: initialData?.primaryGoals || [],
    currentChallenges: initialData?.currentChallenges || '',
    budget: initialData?.budget || '',
    timeframe: initialData?.timeframe || '3-years'
  });
  
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleGoalToggle = (goal) => {
    setFormData(prev => ({
      ...prev,
      primaryGoals: prev.primaryGoals.includes(goal)
        ? prev.primaryGoals.filter(g => g !== goal)
        : [...prev.primaryGoals, goal]
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.companyName && formData.industry && formData.companySize;
      case 2:
        return formData.aiMaturityLevel && formData.primaryGoals.length > 0;
      case 3:
        return formData.budget && formData.timeframe;
      default:
        return false;
    }
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Build Your AI Transformation Timeline</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="modal-progress">
          <div className="progress-steps">
            {[1, 2, 3].map(step => (
              <div 
                key={step} 
                className={`progress-step ${currentStep >= step ? 'active' : ''}`}
              >
                <div className="step-number">{step}</div>
                <div className="step-label">
                  {step === 1 && 'Company Info'}
                  {step === 2 && 'AI Readiness'}
                  {step === 3 && 'Planning'}
                </div>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          {currentStep === 1 && (
            <div className="form-step">
              <h3>Tell us about your company</h3>
              
              <div className="form-group">
                <label htmlFor="companyName">Company Name</label>
                <input
                  id="companyName"
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Enter your company name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="industry">Industry</label>
                <select
                  id="industry"
                  value={formData.industry}
                  onChange={(e) => handleChange('industry', e.target.value)}
                  required
                >
                  <option value="">Select your industry</option>
                  {industries.map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
              
              <div className="form-group">
                <label>Company Size</label>
                <div className="radio-group">
                  {companySizes.map(size => (
                    <label key={size.value} className="radio-label">
                      <input
                        type="radio"
                        name="companySize"
                        value={size.value}
                        checked={formData.companySize === size.value}
                        onChange={(e) => handleChange('companySize', e.target.value)}
                      />
                      <span className="radio-text">{size.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          {currentStep === 2 && (
            <div className="form-step">
              <h3>Assess your AI readiness</h3>
              
              <div className="form-group">
                <label>Current AI Maturity Level</label>
                <div className="maturity-grid">
                  {maturityLevels.map(level => (
                    <button
                      key={level.value}
                      type="button"
                      className={`maturity-option ${formData.aiMaturityLevel === level.value ? 'selected' : ''}`}
                      onClick={() => handleChange('aiMaturityLevel', level.value)}
                    >
                      <div className="maturity-label">{level.label}</div>
                      <div className="maturity-description">{level.description}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label>Primary Goals (Select all that apply)</label>
                <div className="goals-grid">
                  {primaryGoals.map(goal => (
                    <button
                      key={goal}
                      type="button"
                      className={`goal-option ${formData.primaryGoals.includes(goal) ? 'selected' : ''}`}
                      onClick={() => handleGoalToggle(goal)}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="currentChallenges">Current Challenges (Optional)</label>
                <textarea
                  id="currentChallenges"
                  value={formData.currentChallenges}
                  onChange={(e) => handleChange('currentChallenges', e.target.value)}
                  placeholder="Describe any specific challenges or pain points..."
                  rows={3}
                />
              </div>
            </div>
          )}
          
          {currentStep === 3 && (
            <div className="form-step">
              <h3>Set your transformation parameters</h3>
              
              <div className="form-group">
                <label htmlFor="budget">Annual AI Investment Budget</label>
                <select
                  id="budget"
                  value={formData.budget}
                  onChange={(e) => handleChange('budget', e.target.value)}
                  required
                >
                  <option value="">Select budget range</option>
                  <option value="<100k">Less than $100,000</option>
                  <option value="100k-500k">$100,000 - $500,000</option>
                  <option value="500k-1m">$500,000 - $1 million</option>
                  <option value="1m-5m">$1 million - $5 million</option>
                  <option value=">5m">More than $5 million</option>
                </select>
              </div>
              
              <div className="form-group">
                <label>Transformation Timeframe</label>
                <div className="timeframe-options">
                  {['1-year', '3-years', '5-years'].map(tf => (
                    <button
                      key={tf}
                      type="button"
                      className={`timeframe-option ${formData.timeframe === tf ? 'selected' : ''}`}
                      onClick={() => handleChange('timeframe', tf)}
                    >
                      <div className="timeframe-label">{tf.replace('-', ' ')}</div>
                      <div className="timeframe-description">
                        {tf === '1-year' && 'Quick wins focus'}
                        {tf === '3-years' && 'Balanced approach'}
                        {tf === '5-years' && 'Full transformation'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div className="modal-actions">
            {currentStep > 1 && (
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setCurrentStep(currentStep - 1)}
              >
                Back
              </button>
            )}
            
            {currentStep < totalSteps ? (
              <button
                type="button"
                className="btn-primary"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={!canProceed()}
              >
                Continue
              </button>
            ) : (
              <button
                type="submit"
                className="btn-primary"
                disabled={!canProceed() || isGenerating}
              >
                {isGenerating ? 'Generating Timeline...' : 'Generate Timeline'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
} 