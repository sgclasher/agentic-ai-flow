'use client';

import React, { useState, useEffect, useRef } from 'react';
import useBusinessProfileStore from '../store/useBusinessProfileStore';
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
  
  const [activeSection, setActiveSection] = useState('current-state');
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const contentRef = useRef(null);
  const sectionRefs = useRef({});
  
  // Check if we need to show the profile modal
  useEffect(() => {
    if (!hasValidProfile() || !timelineData) {
      setShowProfileModal(true);
    }
  }, [hasValidProfile, timelineData]);
  
  // Handle scroll spy to update active section
  useEffect(() => {
    const handleScroll = () => {
      if (!contentRef.current) return;
      
      const scrollTop = contentRef.current.scrollTop;
      const scrollHeight = contentRef.current.scrollHeight - contentRef.current.clientHeight;
      const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
      setScrollProgress(Math.max(0, Math.min(100, progress || 0)));
      
      // Find active section based on scroll position
      const sections = Object.entries(sectionRefs.current);
      for (let i = sections.length - 1; i >= 0; i--) {
        const [id, element] = sections[i];
        if (element && element.offsetTop <= scrollTop + 100) {
          setActiveSection(id);
          break;
        }
      }
    };
    
    const contentElement = contentRef.current;
    if (contentElement) {
      contentElement.addEventListener('scroll', handleScroll);
      handleScroll(); // Initial check
    }
    
    return () => {
      if (contentElement) {
        contentElement.removeEventListener('scroll', handleScroll);
      }
    };
  }, [timelineData]);
  
  const handleSectionClick = (sectionId) => {
    const element = sectionRefs.current[sectionId];
    if (element && contentRef.current) {
      contentRef.current.scrollTo({
        top: element.offsetTop - 50,
        behavior: 'smooth'
      });
    }
  };
  
  const handleProfileSubmit = async (profile) => {
    await generateTimeline(profile);
    setShowProfileModal(false);
  };
  
  // Generate timeline sections based on business journey
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
      year: 'Year 5',
      title: 'Future State',
      subtitle: 'Vision realized',
      icon: '🎯'
    }
  ] : [];
  
  return (
    <div className="timeline-container">
      {/* Left Sidebar - Timeline Navigation */}
      <TimelineSidebar 
        sections={timelineSections}
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        scrollProgress={scrollProgress}
      />
      
      {/* Main Content Area */}
      <div className="timeline-main" ref={contentRef}>
        {timelineData ? (
          <TimelineContent 
            sections={timelineSections}
            timelineData={timelineData}
            sectionRefs={sectionRefs}
            businessProfile={businessProfile}
          />
        ) : (
          <div className="timeline-empty">
            <h2>Welcome to Your AI Transformation Timeline</h2>
            <p>Complete your business profile to generate a personalized roadmap</p>
            <button 
              className="btn-primary"
              onClick={() => setShowProfileModal(true)}
            >
              Get Started
            </button>
          </div>
        )}
      </div>
      
      {/* Right Sidebar - Metrics Widget */}
      <MetricsWidget 
        activeSection={activeSection}
        timelineData={timelineData}
        scrollProgress={scrollProgress}
      />
      
      {/* Business Profile Modal */}
      {showProfileModal && (
        <BusinessProfileModal
          onClose={() => setShowProfileModal(false)}
          onSubmit={handleProfileSubmit}
          isGenerating={isGenerating}
          initialData={businessProfile}
        />
      )}
    </div>
  );
} 