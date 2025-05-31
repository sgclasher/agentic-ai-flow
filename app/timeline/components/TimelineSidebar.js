'use client';

import React from 'react';

export default function TimelineSidebar({ sections, activeSection, onSectionClick, scrollProgress }) {
  return (
    <aside className="timeline-sidebar">
      <div className="timeline-sidebar-header">
        <h3>Your AI Journey</h3>
        <div className="timeline-progress">
          <div 
            className="timeline-progress-bar"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>
      </div>
      
      <nav className="timeline-nav">
        {sections.map((section, index) => (
          <button
            key={section.id}
            className={`timeline-nav-item ${activeSection === section.id ? 'active' : ''}`}
            onClick={() => onSectionClick(section.id)}
          >
            <div className="timeline-nav-dot">
              <span className="timeline-nav-icon">{section.icon}</span>
            </div>
            <div className="timeline-nav-content">
              <div className="timeline-nav-year">{section.year}</div>
              <div className="timeline-nav-title">{section.title}</div>
              <div className="timeline-nav-subtitle">{section.subtitle}</div>
            </div>
          </button>
        ))}
      </nav>
      
      <div className="timeline-sidebar-footer">
        <button 
          className="btn-secondary"
          onClick={() => window.location.href = '/'}
        >
          ← Back to Flow Visualizer
        </button>
      </div>
    </aside>
  );
} 