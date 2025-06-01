'use client';

import React, { useState, useEffect } from 'react';
import { ProfileService } from '../services/profileService';
import { demoDataService } from '../services/demoDataService';
import ProfileWizard from './components/ProfileWizard';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const profileList = await ProfileService.getProfiles();
      setProfiles(profileList);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = () => {
    setShowWizard(true);
  };

  const loadDemoProfiles = async () => {
    try {
      const demoProfiles = demoDataService.getDemoProfiles();
      
      // Convert demo data to saved profiles
      for (const demoData of demoProfiles) {
        const profile = await ProfileService.createProfile(demoData);
        setProfiles(prev => [...prev, profile]);
      }
    } catch (error) {
      console.error('Error loading demo profiles:', error);
    }
  };

  const handleWizardComplete = (profile) => {
    setProfiles(prev => [...prev, profile]);
    setShowWizard(false);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
  };

  const handleViewProfile = (profileId) => {
    window.location.href = `/profiles/${profileId}`;
  };

  const handleGenerateTimeline = async (profile) => {
    try {
      // Navigate to timeline with profile context
      window.location.href = `/timeline?profileId=${profile.id}`;
    } catch (error) {
      console.error('Error generating timeline:', error);
    }
  };

  if (showWizard) {
    return (
      <ProfileWizard
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    );
  }

  return (
    <div className="profiles-page">
      <div className="profiles-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => window.location.href = '/'}
            aria-label="Back to Flow Visualizer"
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
            <h1 className="profiles-title">Client Profiles</h1>
            <p className="profiles-subtitle">Manage your client intelligence and AI transformation roadmaps</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleCreateProfile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              New Profile
            </button>
          </div>
        </div>
      </div>

      <div className="profiles-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h2>No Client Profiles Yet</h2>
            <p>Create your first client profile to start building comprehensive business intelligence and AI transformation roadmaps.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleCreateProfile}
              >
                Create Your First Profile
              </button>
              <button 
                className="btn btn-secondary btn-large"
                onClick={loadDemoProfiles}
              >
                📊 Load Demo Profiles
              </button>
            </div>
          </div>
        ) : (
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onView={() => handleViewProfile(profile.id)}
                onGenerateTimeline={() => handleGenerateTimeline(profile)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ profile, onView, onGenerateTimeline }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
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

  const getSizeLabel = (size) => {
    const labels = {
      '1-50 employees': 'Startup',
      '51-200 employees': 'Small',
      '201-1000 employees': 'Medium',
      '1000+ employees': 'Enterprise'
    };
    return labels[size] || size;
  };

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-icon">
          {getIndustryIcon(profile.industry)}
        </div>
        <div className="profile-meta">
          <h3 className="profile-name">{profile.companyName}</h3>
          <div className="profile-tags">
            <span className="tag industry-tag">{profile.industry}</span>
            <span className="tag size-tag">{getSizeLabel(profile.size)}</span>
          </div>
        </div>
      </div>

      <div className="profile-card-content">
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-label">Created</span>
            <span className="stat-value">{formatDate(profile.createdAt)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Status</span>
            <span className={`stat-value status-${profile.status}`}>
              {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
            </span>
          </div>
        </div>

        {profile.valueSellingFramework?.businessIssues?.length > 0 && (
          <div className="profile-issues">
            <span className="issues-label">Key Issues:</span>
            <div className="issues-list">
              {profile.valueSellingFramework.businessIssues.slice(0, 2).map((issue, index) => (
                <span key={index} className="issue-tag">{issue}</span>
              ))}
              {profile.valueSellingFramework.businessIssues.length > 2 && (
                <span className="issue-tag more">+{profile.valueSellingFramework.businessIssues.length - 2} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="profile-card-actions">
        <button 
          className="btn btn-secondary btn-small"
          onClick={onView}
        >
          View Details
        </button>
        <button 
          className="btn btn-primary btn-small"
          onClick={onGenerateTimeline}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          AI Timeline
        </button>
      </div>
    </div>
  );
} 