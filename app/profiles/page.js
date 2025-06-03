'use client';

import React, { useState, useEffect } from 'react';
import { ProfileService } from '../services/profileService';
import { demoDataService } from '../services/demoDataService';
import ProfileWizard from './components/ProfileWizard';
import { ArrowLeft, Plus, Users, BarChart, Building2, Briefcase, GraduationCap, Home, Truck, Zap, Store, TrendingUp, Eye, FileText } from 'lucide-react';

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
            <ArrowLeft size={20} />
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
              <Plus size={18} />
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
            <Users size={48} className="empty-icon-lucide" />
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
                <BarChart size={20} style={{ marginRight: '0.5rem' }} /> Load Demo Profiles
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
    switch (industry) {
      case 'Technology': return <Briefcase size={24} />;
      case 'Healthcare': return <Building2 size={24} />;
      case 'Finance': return <BarChart size={24} />;
      case 'Manufacturing': return <Building2 size={24} />;
      case 'Retail': return <Store size={24} />;
      case 'Education': return <GraduationCap size={24} />;
      case 'Real Estate': return <Home size={24} />;
      case 'Transportation': return <Truck size={24} />;
      case 'Energy': return <Zap size={24} />;
      default: return <Store size={24} />;
    }
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
          <Eye size={16} style={{ marginRight: '0.25rem' }} />
          View Details
        </button>
        <button 
          className="btn btn-primary btn-small"
          onClick={onGenerateTimeline}
        >
          <TrendingUp size={16} style={{ marginRight: '0.25rem' }} />
          AI Timeline
        </button>
      </div>
    </div>
  );
} 