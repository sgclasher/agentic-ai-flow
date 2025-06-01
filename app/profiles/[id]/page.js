'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProfileService } from '../../services/profileService';
import { markdownService } from '../../services/markdownService';
import '../profile-detail.css';

export default function ProfileDetailPage() {
  const params = useParams();
  const profileId = params.id;
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await ProfileService.getProfile(profileId);
      
      if (!profileData) {
        setError('Profile not found');
        return;
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTimeline = () => {
    window.location.href = `/timeline?profileId=${profileId}`;
  };

  const handleEdit = () => {
    // For now, redirect to profiles page
    // In the future, this could open the wizard in edit mode
    window.location.href = '/profiles';
  };

  const handleBack = () => {
    window.location.href = '/profiles';
  };

  if (isLoading) {
    return (
      <div className="profile-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-detail-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-detail-page">
        <div className="error-container">
          <h2>Profile Not Found</h2>
          <p>The requested profile could not be found.</p>
          <button className="btn btn-primary" onClick={handleBack}>
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      'Technology': '💻',
      'Healthcare': '🏥',
      'Finance': '🏦',
      'Manufacturing': '🏭',
      'Retail': '🛍️',
      'Education': '🎓',
      'Real Estate': '🏢',
      'Transportation': '🚛',
      'Energy': '⚡',
      'Other': '🏪'
    };
    return icons[industry] || '🏪';
  };

  return (
    <div className="profile-detail-page">
      {/* Header */}
      <div className="profile-detail-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={handleBack}
            aria-label="Back to Profiles"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div className="header-title-section">
            <div className="company-header">
              <div className="company-icon">
                {getIndustryIcon(profile.industry)}
              </div>
              <div>
                <h1 className="company-name">{profile.companyName}</h1>
                <div className="company-meta">
                  <span className="industry-tag">{profile.industry}</span>
                  <span className="size-tag">{profile.size}</span>
                  <span className="status-tag status-{profile.status}">{profile.status}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleGenerateTimeline}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Generate AI Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-detail-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
        <button 
          className={`nav-tab ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          AI Opportunities
        </button>
        <button 
          className={`nav-tab ${activeTab === 'markdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('markdown')}
        >
          Markdown
        </button>
      </div>

      {/* Content */}
      <div className="profile-detail-content">
        {activeTab === 'overview' && (
          <ProfileOverviewTab profile={profile} />
        )}
        
        {activeTab === 'analysis' && (
          <ProfileAnalysisTab profile={profile} />
        )}
        
        {activeTab === 'opportunities' && (
          <ProfileOpportunitiesTab profile={profile} />
        )}
        
        {activeTab === 'markdown' && (
          <ProfileMarkdownTab profile={profile} />
        )}
      </div>

      {/* Footer Info */}
      <div className="profile-detail-footer">
        <div className="footer-content">
          <div className="footer-info">
            <span>Created: {formatDate(profile.createdAt)}</span>
            <span>Updated: {formatDate(profile.updatedAt)}</span>
            <span>ID: {profile.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function ProfileOverviewTab({ profile }) {
  return (
    <div className="tab-content overview-tab">
      <div className="overview-grid">
        {/* Company Information */}
        <div className="info-card">
          <h3>Company Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Company Name</label>
              <span>{profile.companyName}</span>
            </div>
            <div className="info-item">
              <label>Industry</label>
              <span>{profile.industry}</span>
            </div>
            <div className="info-item">
              <label>Size</label>
              <span>{profile.size}</span>
            </div>
            <div className="info-item">
              <label>Annual Revenue</label>
              <span>{profile.annualRevenue ? `$${profile.annualRevenue}` : 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Employee Count</label>
              <span>{profile.employeeCount || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Location</label>
              <span>{profile.primaryLocation || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Business Issues */}
        {profile.valueSellingFramework?.businessIssues?.length > 0 && (
          <div className="info-card">
            <h3>Key Business Issues</h3>
            <div className="tags-list">
              {profile.valueSellingFramework.businessIssues.map((issue, index) => (
                <span key={index} className="tag business-issue-tag">{issue}</span>
              ))}
            </div>
            {profile.valueSellingFramework.businessIssueDetails && (
              <div className="details-text">
                <p>{profile.valueSellingFramework.businessIssueDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* Impact Summary */}
        {profile.valueSellingFramework?.impact && (
          <div className="info-card">
            <h3>Impact Analysis</h3>
            <div className="metrics-grid">
              {profile.valueSellingFramework.impact.totalAnnualImpact && (
                <div className="metric-item">
                  <label>Total Annual Impact</label>
                  <span className="metric-value">${parseInt(profile.valueSellingFramework.impact.totalAnnualImpact).toLocaleString()}</span>
                </div>
              )}
              {profile.valueSellingFramework.impact.laborCosts && (
                <div className="metric-item">
                  <label>Labor Costs</label>
                  <span className="metric-value">${parseInt(profile.valueSellingFramework.impact.laborCosts).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Readiness */}
        {profile.aiOpportunityAssessment && (
          <div className="info-card">
            <h3>AI Readiness</h3>
            <div className="ai-readiness-display">
              <div className="readiness-score">
                <span className="score-value">{profile.aiOpportunityAssessment.aiReadinessScore || profile.aiReadinessScore || 'N/A'}</span>
                <span className="score-label">/ 10</span>
              </div>
              {profile.aiOpportunityAssessment.currentTechnology && (
                <div className="tech-stack">
                  <label>Current Technology</label>
                  <div className="tech-items">
                    {Object.entries(profile.aiOpportunityAssessment.currentTechnology).map(([key, value]) => (
                      value && (
                        <div key={key} className="tech-item">
                          <span className="tech-label">{key}:</span>
                          <span className="tech-value">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileAnalysisTab({ profile }) {
  return (
    <div className="tab-content analysis-tab">
      <div className="analysis-sections">
        {/* Decision Makers */}
        {profile.valueSellingFramework?.decisionMakers && (
          <div className="analysis-card">
            <h3>Decision Makers</h3>
            <div className="decision-makers-grid">
              {profile.valueSellingFramework.decisionMakers.economicBuyer?.name && (
                <div className="decision-maker">
                  <h4>Economic Buyer</h4>
                  <p><strong>{profile.valueSellingFramework.decisionMakers.economicBuyer.name}</strong></p>
                  <p>{profile.valueSellingFramework.decisionMakers.economicBuyer.title}</p>
                  {profile.valueSellingFramework.decisionMakers.economicBuyer.budget && (
                    <p>Budget: ${parseInt(profile.valueSellingFramework.decisionMakers.economicBuyer.budget).toLocaleString()}</p>
                  )}
                </div>
              )}
              
              {profile.valueSellingFramework.decisionMakers.technicalBuyer?.name && (
                <div className="decision-maker">
                  <h4>Technical Buyer</h4>
                  <p><strong>{profile.valueSellingFramework.decisionMakers.technicalBuyer.name}</strong></p>
                  <p>{profile.valueSellingFramework.decisionMakers.technicalBuyer.title}</p>
                </div>
              )}
              
              {profile.valueSellingFramework.decisionMakers.champion?.name && (
                <div className="decision-maker">
                  <h4>Champion</h4>
                  <p><strong>{profile.valueSellingFramework.decisionMakers.champion.name}</strong></p>
                  <p>{profile.valueSellingFramework.decisionMakers.champion.title}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Solution Requirements */}
        {profile.valueSellingFramework?.solutionCapabilities?.length > 0 && (
          <div className="analysis-card">
            <h3>Solution Requirements</h3>
            <div className="capabilities-list">
              {profile.valueSellingFramework.solutionCapabilities.map((capability, index) => (
                <div key={index} className="capability-item">
                  <span className="capability-icon">✓</span>
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROI Expectations */}
        {profile.valueSellingFramework?.roiExpectations && (
          <div className="analysis-card">
            <h3>ROI Expectations</h3>
            <div className="roi-grid">
              {Object.entries(profile.valueSellingFramework.roiExpectations).map(([key, value]) => (
                value && (
                  <div key={key} className="roi-item">
                    <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <span>{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileOpportunitiesTab({ profile }) {
  const opportunities = profile.aiOpportunityAssessment?.opportunities || [];
  const quickWins = profile.aiOpportunityAssessment?.quickWins || [];

  return (
    <div className="tab-content opportunities-tab">
      {opportunities.length > 0 && (
        <div className="opportunities-section">
          <h3>AI Opportunities</h3>
          <div className="opportunities-grid">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="opportunity-card">
                <div className="opportunity-header">
                  <h4>{opportunity.name}</h4>
                  <span className="priority-badge priority-{opportunity.priorityScore > 7 ? 'high' : opportunity.priorityScore > 4 ? 'medium' : 'low'}">
                    Priority: {opportunity.priorityScore}/10
                  </span>
                </div>
                <div className="opportunity-details">
                  <p><strong>Department:</strong> {opportunity.department}</p>
                  <p><strong>Process:</strong> {opportunity.process}</p>
                  <p><strong>Current State:</strong> {opportunity.currentState}</p>
                  <p><strong>AI Solution:</strong> {opportunity.aiSolution}</p>
                  <p><strong>Estimated Impact:</strong> ${parseInt(opportunity.estimatedImpact || 0).toLocaleString()}</p>
                  <p><strong>Timeline:</strong> {opportunity.timeline}</p>
                  <p><strong>Effort:</strong> {opportunity.implementationEffort}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {quickWins.length > 0 && (
        <div className="quick-wins-section">
          <h3>Quick Wins (0-6 months)</h3>
          <div className="quick-wins-grid">
            {quickWins.map((quickWin, index) => (
              <div key={index} className="quick-win-card">
                <h4>{quickWin.name}</h4>
                <div className="quick-win-details">
                  <span className="impact">${parseInt(quickWin.impact || 0).toLocaleString()} impact</span>
                  <span className="timeline">{quickWin.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {opportunities.length === 0 && quickWins.length === 0 && (
        <div className="empty-opportunities">
          <p>No AI opportunities identified yet. Complete the AI assessment section to generate recommendations.</p>
        </div>
      )}
    </div>
  );
}

function ProfileMarkdownTab({ profile }) {
  const markdown = profile.markdown || markdownService.generateMarkdown(profile);

  return (
    <div className="tab-content markdown-tab">
      <div className="markdown-container">
        <div className="markdown-header">
          <h3>Profile Markdown</h3>
          <button 
            className="btn btn-secondary btn-small"
            onClick={() => navigator.clipboard.writeText(markdown)}
          >
            Copy to Clipboard
          </button>
        </div>
        <pre className="markdown-content">
          {markdown}
        </pre>
      </div>
    </div>
  );
} 