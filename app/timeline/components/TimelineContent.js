'use client';

import React, { useRef, useEffect } from 'react';

export default function TimelineContent({ sections, timelineData, sectionRefs, businessProfile }) {
  const registerRef = (id, element) => {
    if (element) {
      sectionRefs.current[id] = element;
    }
  };
  
  const getSectionContent = (sectionId) => {
    // Map section IDs to timeline data
    const contentMap = {
      'current-state': {
        title: 'Current State Analysis',
        content: timelineData.currentState,
        highlights: [
          { label: 'AI Maturity', value: businessProfile.aiMaturityLevel },
          { label: 'Industry', value: businessProfile.industry },
          { label: 'Company Size', value: businessProfile.companySize }
        ]
      },
      'phase-1': {
        title: 'Foundation Phase',
        content: timelineData.phases[0],
        highlights: timelineData.phases[0]?.highlights || []
      },
      'phase-2': {
        title: 'Implementation Phase',
        content: timelineData.phases[1],
        highlights: timelineData.phases[1]?.highlights || []
      },
      'phase-3': {
        title: 'Expansion Phase',
        content: timelineData.phases[2],
        highlights: timelineData.phases[2]?.highlights || []
      },
      'phase-4': {
        title: 'Optimization Phase',
        content: timelineData.phases[3],
        highlights: timelineData.phases[3]?.highlights || []
      },
      'future-state': {
        title: 'Future State Vision',
        content: timelineData.futureState,
        highlights: timelineData.futureState?.highlights || []
      }
    };
    
    return contentMap[sectionId] || {};
  };
  
  return (
    <div className="timeline-content">
      {sections.map((section) => {
        const sectionData = getSectionContent(section.id);
        
        return (
          <section 
            key={section.id}
            id={section.id}
            ref={(el) => registerRef(section.id, el)}
            className="timeline-section"
          >
            <div className="section-header">
              <div className="section-icon">{section.icon}</div>
              <div className="section-meta">
                <div className="section-year">{section.year}</div>
                <h2 className="section-title">{sectionData.title}</h2>
              </div>
            </div>
            
            <div className="section-body">
              {sectionData.content && (
                <>
                  <div className="section-description">
                    <p>{sectionData.content.description}</p>
                  </div>
                  
                  {sectionData.highlights && sectionData.highlights.length > 0 && (
                    <div className="section-highlights">
                      <h3>Key Highlights</h3>
                      <div className="highlights-grid">
                        {sectionData.highlights.map((highlight, index) => (
                          <div key={index} className="highlight-card">
                            <div className="highlight-label">{highlight.label}</div>
                            <div className="highlight-value">{highlight.value}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {sectionData.content.initiatives && (
                    <div className="section-initiatives">
                      <h3>Key Initiatives</h3>
                      <ul className="initiatives-list">
                        {sectionData.content.initiatives.map((initiative, index) => (
                          <li key={index} className="initiative-item">
                            <div className="initiative-title">{initiative.title}</div>
                            <div className="initiative-description">{initiative.description}</div>
                            {initiative.impact && (
                              <div className="initiative-impact">
                                <span className="impact-label">Impact:</span> {initiative.impact}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {sectionData.content.technologies && (
                    <div className="section-technologies">
                      <h3>Technologies & Tools</h3>
                      <div className="tech-tags">
                        {sectionData.content.technologies.map((tech, index) => (
                          <span key={index} className="tech-tag">{tech}</span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {sectionData.content.outcomes && (
                    <div className="section-outcomes">
                      <h3>Expected Outcomes</h3>
                      <div className="outcomes-grid">
                        {sectionData.content.outcomes.map((outcome, index) => (
                          <div key={index} className="outcome-card">
                            <div className="outcome-metric">{outcome.metric}</div>
                            <div className="outcome-value">{outcome.value}</div>
                            <div className="outcome-description">{outcome.description}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
} 