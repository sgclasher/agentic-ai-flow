'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useBusinessProfileStore from '../store/useBusinessProfileStore';
import { ProfileService } from '../services/profileService';
import TimelineSidebar from './components/TimelineSidebar';
import TimelineContent from './components/TimelineContent';
import MetricsWidget from './components/MetricsWidget';

import './timeline.css';
import { MapPin, Building, Rocket, TrendingUp, Zap, Target } from 'lucide-react';

export default function TimelinePage() {
  const { 
    businessProfile,
    timelineData,
    isGenerating,
    generateTimeline,
    hasValidProfile,
    theme,
    toggleTheme
  } = useBusinessProfileStore();
  
  const searchParams = useSearchParams();
  const profileIdFromUrl = searchParams.get('profileId');
  
  const [activeSection, setActiveSection] = useState('current-state');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoadingProfileAndTimeline, setIsLoadingProfileAndTimeline] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  
  // Generate timeline sections based on business journey
  const timelineSections = timelineData ? [
    {
      id: 'current-state',
      year: 'Today',
      title: 'Current State',
      subtitle: 'Where you are now',
      icon: <MapPin size={24} />
    },
    {
      id: 'phase-1',
      year: 'Q1-Q2',
      title: 'Foundation',
      subtitle: 'Building AI capabilities',
      icon: <Building size={24} />
    },
    {
      id: 'phase-2',
      year: 'Q3-Q4',
      title: 'Implementation',
      subtitle: 'Deploying solutions',
      icon: <Rocket size={24} />
    },
    {
      id: 'phase-3',
      year: 'Year 2',
      title: 'Expansion',
      subtitle: 'Scaling operations',
      icon: <TrendingUp size={24} />
    },
    {
      id: 'phase-4',
      year: 'Year 3',
      title: 'Optimization',
      subtitle: 'Maximizing value',
      icon: <Zap size={24} />
    },
    {
      id: 'future-state',
      year: 'Year 5',
      title: 'Future State',
      subtitle: 'Vision realized',
      icon: <Target size={24} />
    }
  ] : [];
  
  // Effect to set initialization state
  useEffect(() => {
    setIsInitializing(false);
  }, []);

  // Effect to initialize timeline from profile ID
  useEffect(() => {
    const initializeTimeline = async () => {
      if (profileIdFromUrl) {
        setIsLoadingProfileAndTimeline(true);
        try {
          const loadedProfile = await ProfileService.getProfile(profileIdFromUrl);
          if (loadedProfile) {
            await generateTimeline(loadedProfile);
          } else {
            console.warn(`Profile with ID ${profileIdFromUrl} not found.`);
          }
        } catch (error) {
          console.error("Error loading profile for timeline:", error);
        } finally {
          setIsLoadingProfileAndTimeline(false);
        }
      }
    };

    if (!isInitializing) {
      initializeTimeline();
    }
  }, [profileIdFromUrl, generateTimeline, isInitializing]);
  
  // Changed to useLayoutEffect for scroll handling to sync with paint
  useLayoutEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current || !timelineSections.length) return;

      const scrollTop = contentRef.current.scrollTop;
      const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const viewportHeight = contentRef.current.clientHeight;

      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(100, progress || 0)));

      let newActiveSection = null;
      let maxVisibleArea = 0;

      // Check if we're at the very bottom
      const bottomScrollBuffer = 20; 
      if (scrollTop + viewportHeight >= scrollHeight - bottomScrollBuffer) {
        newActiveSection = timelineSections.length > 0 ? timelineSections[timelineSections.length - 1].id : null;
      } else {
        // Find the section with the most visible area in the viewport
        for (let i = 0; i < timelineSections.length; i++) {
          const sectionId = timelineSections[i].id;
          const element = sectionRefs.current[sectionId];
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;
            
            // Calculate how much of this section is visible in the viewport
            const visibleTop = Math.max(elementTop, scrollTop);
            const visibleBottom = Math.min(elementBottom, scrollTop + viewportHeight);
            const visibleArea = Math.max(0, visibleBottom - visibleTop);
            
            // If this section has more visible area than any previous section, make it active
            if (visibleArea > maxVisibleArea) {
              maxVisibleArea = visibleArea;
              newActiveSection = sectionId;
            }
          }
        }
        
        // Fallback: if no section has significant visible area, use proximity to viewport center
        if (!newActiveSection || maxVisibleArea < 50) {
          const viewportCenter = scrollTop + viewportHeight / 2;
          let minDistance = Infinity;
          
          for (let i = 0; i < timelineSections.length; i++) {
            const sectionId = timelineSections[i].id;
            const element = sectionRefs.current[sectionId];
            if (element) {
              const elementCenter = element.offsetTop + element.offsetHeight / 2;
              const distance = Math.abs(viewportCenter - elementCenter);
              
              if (distance < minDistance) {
                minDistance = distance;
                newActiveSection = sectionId;
              }
            }
          }
        }
      }

      if (newActiveSection && newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }
    };

    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check on mount/update
    }

    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [timelineData, activeSection, timelineSections]);
  
  const handleSectionClick = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      setActiveSection(sectionId); // Set active state immediately
      contentRef.current.scrollTo({
        top: element.offsetTop - 50, // Keep a small offset from the top
        behavior: 'smooth'
      });
    }
  };
  

  
  if (profileIdFromUrl && isLoadingProfileAndTimeline) {
    return (
      <div className="timeline-container">
        <div className="timeline-empty" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
          <div className="loading-spinner"></div>
          <p style={{marginTop: '20px', fontSize: '1.2rem'}}>Loading Profile and Timeline...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="timeline-container" data-timeline-theme={theme}>
      {/* Left Sidebar - Timeline Navigation */}
      <TimelineSidebar 
        sections={timelineSections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        theme={theme}
        onThemeToggle={toggleTheme}
      />
      
      {/* Main Content Area */}
      <div className="timeline-main" ref={contentRef}>
        {isInitializing ? (
          // Show loading state while determining if we have a profile ID
          <div className="timeline-empty">
            <div className="loading-spinner"></div>
            <h2>Loading...</h2>
          </div>
        ) : timelineData && !isLoadingProfileAndTimeline ? (
          // Show the actual timeline
          <TimelineContent 
            sections={timelineSections}
            timelineData={timelineData}
            sectionRefs={sectionRefs}
            businessProfile={businessProfile}
          />
        ) : profileIdFromUrl ? (
          // Show loading state when we have a profile ID but no timeline yet
          <div className="timeline-empty">
            <div className="loading-spinner"></div>
            <h2>Loading Your AI Timeline</h2>
            <p>Generating personalized roadmap from your profile...</p>
          </div>
        ) : isGenerating ? (
          // Show loading state when generating timeline from existing profile
          <div className="timeline-empty">
            <div className="loading-spinner"></div>
            <h2>Generating AI Timeline</h2>
            <p>Creating your personalized transformation roadmap...</p>
          </div>
        ) : (
          // Show welcome message only when no profile ID and not generating
          <div className="timeline-empty">
            <h2>Welcome to Your AI Transformation Timeline</h2>
            <p>Create a client profile first to generate a personalized AI transformation roadmap.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="btn-primary"
                onClick={() => window.location.href = '/profiles'}
              >
                Create Client Profile
              </button>
              {hasValidProfile() && (
                <button 
                  className="btn-secondary"
                  onClick={() => generateTimeline()}
                  disabled={isGenerating}
                >
                  Generate Timeline from Current Profile
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Right Sidebar - Metrics Widget */}
      {timelineData && !isLoadingProfileAndTimeline && (
        <MetricsWidget 
          activeSection={activeSection}
          timelineData={timelineData}
          scrollProgress={scrollProgress}
        />
      )}

    </div>
  );
} 