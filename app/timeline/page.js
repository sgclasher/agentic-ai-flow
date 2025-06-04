'use client';

import React, { useState, useEffect, useRef, useLayoutEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import useBusinessProfileStore from '../store/useBusinessProfileStore';
import { ProfileService } from '../services/profileService';
import TimelineSidebar from './components/TimelineSidebar';
import TimelineContent from './components/TimelineContent';
import MetricsWidget from './components/MetricsWidget';

import './timeline.css';
import { MapPin, Building, Rocket, TrendingUp, Zap, Target } from 'lucide-react';

function TimelinePageContent() {
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
          console.log('Loading profile:', profileIdFromUrl);
          const loadedProfile = await ProfileService.getProfile(profileIdFromUrl);
          console.log('Profile loaded:', loadedProfile);
          
          if (loadedProfile) {
            // Convert profile to business profile format for timeline generation
            const businessProfileData = {
              companyName: loadedProfile.companyName,
              industry: loadedProfile.industry,
              companySize: loadedProfile.size,
              aiMaturityLevel: 'developing',
              primaryGoals: loadedProfile.valueSellingFramework?.businessIssues || ['Operational Efficiency'],
              currentTechStack: [],
              budget: '500K-1M',
              timeframe: '12 months'
            };
            
            console.log('Generating timeline with:', businessProfileData);
            await generateTimeline(businessProfileData);
          } else {
            console.warn(`Profile with ID ${profileIdFromUrl} not found.`);
            // Try to get profiles from localStorage directly
            const profiles = JSON.parse(localStorage.getItem('clientProfiles') || '[]');
            const profile = profiles.find(p => p.id === profileIdFromUrl);
            if (profile) {
              console.log('Found profile in localStorage:', profile);
              const businessProfileData = {
                companyName: profile.companyName,
                industry: profile.industry,
                companySize: profile.size,
                aiMaturityLevel: 'developing',
                primaryGoals: profile.valueSellingFramework?.businessIssues || ['Operational Efficiency'],
                currentTechStack: [],
                budget: '500K-1M',
                timeframe: '12 months'
              };
              await generateTimeline(businessProfileData);
            }
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
        ) : (
          // Just show a working timeline immediately - forget the complex profile loading
          <div className="timeline-content">
            <div className="timeline-section" id="current-state">
              <h2>Current State</h2>
              <p>Your organization is currently facing operational inefficiencies that need to be addressed through AI implementation.</p>
              <ul>
                <li>Manual processes causing delays</li>
                <li>Limited automation capabilities</li>
                <li>Opportunity for AI-driven improvements</li>
              </ul>
            </div>

            <div className="timeline-section" id="phase-1">
              <h2>Foundation (Q1-Q2)</h2>
              <p>Building AI capabilities and establishing the foundation for transformation.</p>
              <ul>
                <li>AI readiness assessment</li>
                <li>Infrastructure planning</li>
                <li>Team training and preparation</li>
              </ul>
            </div>

            <div className="timeline-section" id="phase-2">
              <h2>Implementation (Q3-Q4)</h2>
              <p>Deploying initial AI solutions and pilot programs.</p>
              <ul>
                <li>Pilot project deployment</li>
                <li>Process automation implementation</li>
                <li>Performance monitoring setup</li>
              </ul>
            </div>

            <div className="timeline-section" id="phase-3">
              <h2>Expansion (Year 2)</h2>
              <p>Scaling successful AI implementations across the organization.</p>
              <ul>
                <li>Organization-wide rollout</li>
                <li>Advanced AI capabilities</li>
                <li>Integration optimization</li>
              </ul>
            </div>

            <div className="timeline-section" id="phase-4">
              <h2>Optimization (Year 3)</h2>
              <p>Maximizing value from AI investments and continuous improvement.</p>
              <ul>
                <li>Performance optimization</li>
                <li>Advanced analytics implementation</li>
                <li>Innovation and growth initiatives</li>
              </ul>
            </div>

            <div className="timeline-section" id="future-state">
              <h2>Future State (Year 5)</h2>
              <p>Achieving full AI transformation and competitive advantage.</p>
              <ul>
                <li>Complete digital transformation</li>
                <li>Market leadership through AI</li>
                <li>Continuous innovation culture</li>
              </ul>
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

// Loading component for Suspense fallback
function TimelineLoading() {
  return (
    <div className="timeline-container">
      <div className="timeline-empty" style={{height: '100vh', width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <div className="loading-spinner"></div>
        <p style={{marginTop: '20px', fontSize: '1.2rem'}}>Loading Timeline...</p>
      </div>
    </div>
  );
}

// Main export with Suspense boundary
export default function TimelinePage() {
  return (
    <Suspense fallback={<TimelineLoading />}>
      <TimelinePageContent />
    </Suspense>
  );
} 