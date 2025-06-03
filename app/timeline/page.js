'use client';

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import useBusinessProfileStore from '../store/useBusinessProfileStore';
import { ProfileService } from '../services/profileService';
import TimelineSidebar from './components/TimelineSidebar';
import TimelineContent from './components/TimelineContent';
import MetricsWidget from './components/MetricsWidget';
import BusinessProfileModal from './components/BusinessProfileModal';
import './timeline.css';

export default function TimelinePage() {
  const { 
    businessProfile,
    timelineData,
    isGenerating,
    generateTimeline,
    hasValidProfile
  } = useBusinessProfileStore();
  
  const searchParams = useSearchParams();
  const profileIdFromUrl = searchParams.get('profileId');
  
  const [activeSection, setActiveSection] = useState('current-state');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isLoadingProfileAndTimeline, setIsLoadingProfileAndTimeline] = useState(false);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  
  // Define timelineSections before hooks that might use its length or content
  const timelineSections = timelineData ? [
    {
      id: 'current-state',
      year: 'Today',
      title: 'Current State',
      subtitle: 'Where you are now',
      icon: '📍'
    },
    {
      id: 'phase-1',
      year: 'Q1-Q2',
      title: 'Foundation',
      subtitle: 'Building AI capabilities',
      icon: '🏗️'
    },
    {
      id: 'phase-2',
      year: 'Q3-Q4',
      title: 'Implementation',
      subtitle: 'Deploying solutions',
      icon: '🚀'
    },
    {
      id: 'phase-3',
      year: 'Year 2',
      title: 'Expansion',
      subtitle: 'Scaling operations',
      icon: '📈'
    },
    {
      id: 'phase-4',
      year: 'Year 3',
      title: 'Optimization',
      subtitle: 'Maximizing value',
      icon: '⚡'
    },
    {
      id: 'future-state',
      year: 'Year 4',
      title: 'Future State',
      subtitle: 'Vision realized',
      icon: '🎯'
    }
  ] : [];
  
  // Effect to initialize timeline or show modal
  useEffect(() => {
    const initializeTimeline = async () => {
      if (profileIdFromUrl) {
        setIsLoadingProfileAndTimeline(true);
        try {
          const loadedProfile = await ProfileService.getProfile(profileIdFromUrl);
          if (loadedProfile) {
            await generateTimeline(loadedProfile);
            setShowProfileModal(false);
          } else {
            console.warn(`Profile with ID ${profileIdFromUrl} not found. Opening modal.`);
            setShowProfileModal(true);
          }
        } catch (error) {
          console.error("Error loading profile for timeline:", error);
          setShowProfileModal(true);
        } finally {
          setIsLoadingProfileAndTimeline(false);
        }
      } else {
        if (!hasValidProfile() || !timelineData) {
          setShowProfileModal(true);
        } else {
          setShowProfileModal(false);
        }
      }
    };

    initializeTimeline();
  }, [profileIdFromUrl, generateTimeline, hasValidProfile, timelineData]);
  
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
      const scrollThreshold = 50; // How many pixels from top to consider a section active

      const bottomScrollBuffer = 20; 
      if (scrollTop + viewportHeight >= scrollHeight - bottomScrollBuffer) {
        newActiveSection = timelineSections.length > 0 ? timelineSections[timelineSections.length - 1].id : null;
      } else {
        // Iterate from top to bottom to find the first section whose top part is visible
        for (let i = 0; i < timelineSections.length; i++) {
          const sectionId = timelineSections[i].id;
          const element = sectionRefs.current[sectionId];
          if (element) {
            const elementTop = element.offsetTop;
            const elementBottom = elementTop + element.offsetHeight;

            // A section is active if its top is near the viewport top, or if it's the first section visible
            if (scrollTop + scrollThreshold >= elementTop && scrollTop + scrollThreshold < elementBottom) {
              newActiveSection = sectionId;
              break; 
            }
            // Special case for the first section when scrolling up towards it
            if (i === 0 && scrollTop < elementTop + scrollThreshold) {
               newActiveSection = sectionId;
               break;
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
  
  const handleProfileSubmit = async (profile) => {
    setIsLoadingProfileAndTimeline(true);
    await generateTimeline(profile);
    setShowProfileModal(false);
    setIsLoadingProfileAndTimeline(false);
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
    <div className="timeline-container">
      {/* Left Sidebar - Timeline Navigation */}
      <TimelineSidebar 
        sections={timelineSections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
      />
      
      {/* Main Content Area */}
      <div className="timeline-main" ref={contentRef}>
        {timelineData && !isLoadingProfileAndTimeline ? (
          <TimelineContent 
            sections={timelineSections}
            timelineData={timelineData}
            sectionRefs={sectionRefs}
            businessProfile={businessProfile}
          />
        ) : (!profileIdFromUrl && !showProfileModal && !isGenerating && !isLoadingProfileAndTimeline) ? (
          <div className="timeline-empty">
            <h2>Welcome to Your AI Transformation Timeline</h2>
            <p>Please complete your business profile to generate a personalized roadmap.</p>
            <button 
              className="btn-primary"
              onClick={() => setShowProfileModal(true)}
              disabled={isGenerating}
            >
              Get Started
            </button>
          </div>
        ) : null}
      </div>
      
      {/* Right Sidebar - Metrics Widget */}
      {timelineData && !isLoadingProfileAndTimeline && (
        <MetricsWidget 
          activeSection={activeSection}
          timelineData={timelineData}
          scrollProgress={scrollProgress}
        />
      )}
      
      {/* Business Profile Modal */}
      {showProfileModal && (
        <BusinessProfileModal
          onClose={() => {
            setShowProfileModal(false);
          }}
          onSubmit={handleProfileSubmit}
          isGenerating={isGenerating}
          initialData={businessProfile}
        />
      )}
    </div>
  );
} 