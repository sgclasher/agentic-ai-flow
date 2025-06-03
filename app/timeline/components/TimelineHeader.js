'use client';

import React from 'react';
import { ArrowLeft, Share2, Download } from 'lucide-react';

export default function TimelineHeader({ onBackClick }) {
  return (
    <header className="timeline-header">
      <div className="header-content">
        <button 
          className="back-button"
          onClick={onBackClick}
          aria-label="Back to Flow Visualizer"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="header-title-section">
          <h1 className="timeline-title">AI Transformation Timeline</h1>
          <p className="timeline-subtitle">Your personalized roadmap to AI-powered business operations</p>
        </div>
        
        <div className="header-actions">
          <button className="btn btn-secondary btn-icon" aria-label="Share timeline">
            <Share2 size={18} />
          </button>
          <button className="btn btn-primary">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>
    </header>
  );
} 