'use client';

import React, { useState, useCallback } from 'react';
import useBusinessProfileStore from '../../store/useBusinessProfileStore';

export default function TimelineVisualization({ events, recommendations }) {
  const { expandedSections, toggleSection, expandAllSections, collapseAllSections } = useBusinessProfileStore();
  const [hoveredEvent, setHoveredEvent] = useState(null);
  
  const getEventIcon = (type) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'implementation': return '🔧';
      case 'expansion': return '📈';
      case 'transformation': return '🚀';
      default: return '📍';
    }
  };
  
  const getEventColor = (type) => {
    switch (type) {
      case 'milestone': return '#3498db';
      case 'implementation': return '#10b981';
      case 'expansion': return '#f39c12';
      case 'transformation': return '#ef4444';
      default: return '#6b7280';
    }
  };
  
  const handleEventClick = useCallback((eventId) => {
    toggleSection(eventId);
  }, [toggleSection]);
  
  return (
    <div className="timeline-visualization">
      <div className="timeline-controls">
        <button 
          className="btn btn-secondary btn-small"
          onClick={expandAllSections}
        >
          Expand All
        </button>
        <button 
          className="btn btn-secondary btn-small"
          onClick={collapseAllSections}
        >
          Collapse All
        </button>
      </div>
      
      <div className="timeline-container">
        <div className="timeline-line" />
        
        {events.map((event, index) => {
          const isExpanded = expandedSections[event.id] || false;
          const isHovered = hoveredEvent === event.id;
          
          return (
            <div 
              key={event.id}
              className={`timeline-event ${isExpanded ? 'expanded' : ''} ${isHovered ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredEvent(event.id)}
              onMouseLeave={() => setHoveredEvent(null)}
            >
              <div className="event-date">
                <span>{event.date}</span>
              </div>
              
              <div 
                className="event-marker"
                style={{ 
                  '--event-color': getEventColor(event.type),
                  transform: isHovered ? 'scale(1.2)' : 'scale(1)',
                }}
              >
                <span className="event-icon">{getEventIcon(event.type)}</span>
              </div>
              
              <div className="event-content">
                <div 
                  className="event-header"
                  onClick={() => handleEventClick(event.id)}
                >
                  <h3>{event.title}</h3>
                  <button 
                    className="expand-toggle"
                    aria-label={isExpanded ? 'Collapse' : 'Expand'}
                  >
                    {isExpanded ? '−' : '+'}
                  </button>
                </div>
                
                <p className="event-description">{event.description}</p>
                
                {isExpanded && event.details && (
                  <div className="event-details">
                    {event.details.activities && (
                      <div className="detail-section">
                        <h4>Key Activities</h4>
                        <ul>
                          {event.details.activities.map((activity, i) => (
                            <li key={i}>{activity}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {event.details.agents && (
                      <div className="detail-section">
                        <h4>AI Agents</h4>
                        <div className="agents-list">
                          {event.details.agents.map((agent, i) => (
                            <div key={i} className="agent-card">
                              <h5>{agent.name}</h5>
                              <p>{agent.description}</p>
                              <span className="impact">{agent.impact}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {event.details.departments && (
                      <div className="detail-section">
                        <h4>Departments Involved</h4>
                        <div className="department-tags">
                          {event.details.departments.map((dept, i) => (
                            <span key={i} className="tag">{dept}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {event.details.deliverables && (
                      <div className="detail-section">
                        <h4>Deliverables</h4>
                        <ul>
                          {event.details.deliverables.map((deliverable, i) => (
                            <li key={i}>{deliverable}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {event.details.investment && (
                      <div className="detail-metric">
                        <span className="metric-label">Investment Required:</span>
                        <span className="metric-value">{event.details.investment}</span>
                      </div>
                    )}
                    
                    {event.details.timeline && (
                      <div className="detail-metric">
                        <span className="metric-label">Timeline:</span>
                        <span className="metric-value">{event.details.timeline}</span>
                      </div>
                    )}
                    
                    {event.details.expectedOutcomes && (
                      <div className="detail-section">
                        <h4>Expected Outcomes</h4>
                        <div className="outcomes-grid">
                          {Object.entries(event.details.expectedOutcomes).map(([key, value]) => (
                            <div key={key} className="outcome">
                              <span className="outcome-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                              <span className="outcome-value">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {recommendations && recommendations.length > 0 && (
        <div className="recommendations-section">
          <h3>Key Recommendations</h3>
          <div className="recommendations-list">
            {recommendations.map((rec, index) => (
              <div key={index} className="recommendation">
                <span className="rec-number">{index + 1}</span>
                <p>{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 