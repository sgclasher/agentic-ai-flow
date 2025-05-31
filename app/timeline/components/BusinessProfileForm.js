'use client';

import React, { useState } from 'react';
import useBusinessProfileStore from '../../store/useBusinessProfileStore';

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
  { value: 'advanced', label: 'Advanced', description: 'Widespread AI adoption' },
];

const techStackOptions = [
  'ServiceNow', 'Salesforce', 'Microsoft 365', 'Google Workspace', 
  'SAP', 'Oracle', 'AWS', 'Azure', 'Custom Solutions'
];

const goalOptions = [
  'Improve Customer Service', 'Reduce Operational Costs', 'Increase Revenue',
  'Enhance Data Analytics', 'Automate Workflows', 'Scale Operations',
  'Improve Decision Making', 'Competitive Advantage'
];

export default function BusinessProfileForm({ onSubmit }) {
  const { businessProfile, updateBusinessProfile } = useBusinessProfileStore();
  const [errors, setErrors] = useState({});
  
  const handleInputChange = (field, value) => {
    updateBusinessProfile({ [field]: value });
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const handleArrayToggle = (field, value) => {
    const currentArray = businessProfile[field] || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    
    updateBusinessProfile({ [field]: newArray });
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!businessProfile.companyName?.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    if (!businessProfile.industry) {
      newErrors.industry = 'Please select an industry';
    }
    if (!businessProfile.companySize) {
      newErrors.companySize = 'Please select company size';
    }
    if (!businessProfile.aiMaturityLevel) {
      newErrors.aiMaturityLevel = 'Please select AI maturity level';
    }
    if (!businessProfile.primaryGoals?.length) {
      newErrors.primaryGoals = 'Please select at least one goal';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit();
    }
  };
  
  return (
    <form className="business-profile-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Basic Information</h3>
        
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            type="text"
            id="companyName"
            value={businessProfile.companyName || ''}
            onChange={(e) => handleInputChange('companyName', e.target.value)}
            placeholder="Enter your company name"
            className={errors.companyName ? 'error' : ''}
          />
          {errors.companyName && <span className="error-message">{errors.companyName}</span>}
        </div>
        
        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <select
            id="industry"
            value={businessProfile.industry || ''}
            onChange={(e) => handleInputChange('industry', e.target.value)}
            className={errors.industry ? 'error' : ''}
          >
            <option value="">Select your industry</option>
            {industries.map(ind => (
              <option key={ind} value={ind}>{ind}</option>
            ))}
          </select>
          {errors.industry && <span className="error-message">{errors.industry}</span>}
        </div>
        
        <div className="form-group">
          <label>Company Size *</label>
          <div className="radio-group">
            {companySizes.map(size => (
              <label key={size.value} className="radio-label">
                <input
                  type="radio"
                  name="companySize"
                  value={size.value}
                  checked={businessProfile.companySize === size.value}
                  onChange={(e) => handleInputChange('companySize', e.target.value)}
                />
                <span>{size.label}</span>
              </label>
            ))}
          </div>
          {errors.companySize && <span className="error-message">{errors.companySize}</span>}
        </div>
      </div>
      
      <div className="form-section">
        <h3>Technology & AI Readiness</h3>
        
        <div className="form-group">
          <label>Current AI Maturity Level *</label>
          <div className="maturity-options">
            {maturityLevels.map(level => (
              <label 
                key={level.value} 
                className={`maturity-option ${businessProfile.aiMaturityLevel === level.value ? 'selected' : ''}`}
              >
                <input
                  type="radio"
                  name="aiMaturityLevel"
                  value={level.value}
                  checked={businessProfile.aiMaturityLevel === level.value}
                  onChange={(e) => handleInputChange('aiMaturityLevel', e.target.value)}
                />
                <div className="maturity-content">
                  <h4>{level.label}</h4>
                  <p>{level.description}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.aiMaturityLevel && <span className="error-message">{errors.aiMaturityLevel}</span>}
        </div>
        
        <div className="form-group">
          <label>Current Technology Stack</label>
          <div className="checkbox-group">
            {techStackOptions.map(tech => (
              <label key={tech} className="checkbox-label">
                <input
                  type="checkbox"
                  checked={businessProfile.currentTechStack?.includes(tech) || false}
                  onChange={() => handleArrayToggle('currentTechStack', tech)}
                />
                <span>{tech}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      
      <div className="form-section">
        <h3>Goals & Timeline</h3>
        
        <div className="form-group">
          <label>Primary Goals *</label>
          <div className="goal-options">
            {goalOptions.map(goal => (
              <label 
                key={goal} 
                className={`goal-option ${businessProfile.primaryGoals?.includes(goal) ? 'selected' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={businessProfile.primaryGoals?.includes(goal) || false}
                  onChange={() => handleArrayToggle('primaryGoals', goal)}
                />
                <span>{goal}</span>
              </label>
            ))}
          </div>
          {errors.primaryGoals && <span className="error-message">{errors.primaryGoals}</span>}
        </div>
        
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="budget">Estimated Budget Range</label>
            <select
              id="budget"
              value={businessProfile.budget || ''}
              onChange={(e) => handleInputChange('budget', e.target.value)}
            >
              <option value="">Select budget range</option>
              <option value="<50k">Less than $50,000</option>
              <option value="50k-150k">$50,000 - $150,000</option>
              <option value="150k-500k">$150,000 - $500,000</option>
              <option value="500k+">$500,000+</option>
            </select>
          </div>
          
          <div className="form-group">
            <label htmlFor="timeframe">Implementation Timeframe</label>
            <select
              id="timeframe"
              value={businessProfile.timeframe || ''}
              onChange={(e) => handleInputChange('timeframe', e.target.value)}
            >
              <option value="">Select timeframe</option>
              <option value="3months">3 months</option>
              <option value="6months">6 months</option>
              <option value="1year">1 year</option>
              <option value="2years+">2+ years</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="form-actions">
        <button type="submit" className="btn btn-primary btn-large">
          Generate AI Timeline
        </button>
      </div>
    </form>
  );
} 