'use client';

import React, { useState } from 'react';

// Helper for trend icons
const TrendIcon = ({ type }) => {
  switch (type) {
    case 'positive':
      return <span style={{ color: 'var(--timeline-accent-green)', marginRight: '4px' }}>▲</span>;
    case 'negative':
      return <span style={{ color: 'var(--timeline-accent-red)', marginRight: '4px' }}>▼</span>;
    default:
      return null;
  }
};

export default function MetricsWidget({ activeSection, timelineData, scrollProgress }) {
  const [isMinimized, setIsMinimized] = useState(false);
  
  if (!timelineData) return null;
  
  // Get current phase data based on activeSection
  const getCurrentPhase = () => {
    switch(activeSection) {
      case 'current-state':
        return { title: 'Current State', ...(timelineData.currentState || {}) };
      case 'phase-1':
        return { title: 'Foundation', ...(timelineData.phases?.[0] || {}) };
      case 'phase-2':
        return { title: 'Implementation', ...(timelineData.phases?.[1] || {}) };
      case 'phase-3':
        return { title: 'Expansion', ...(timelineData.phases?.[2] || {}) };
      case 'phase-4':
        return { title: 'Optimization', ...(timelineData.phases?.[3] || {}) };
      case 'future-state':
        return { title: 'Future State', ...(timelineData.futureState || {}) };
      default:
        return { title: 'Current State', ...(timelineData.currentState || {}) };
    }
  };
  
  const currentPhase = getCurrentPhase();
  
  // Calculate journey metrics based on activeSection
  const getJourneyProgress = () => {
    const sectionOrder = ['current-state', 'phase-1', 'phase-2', 'phase-3', 'phase-4', 'future-state'];
    const currentIndex = sectionOrder.indexOf(activeSection);
    return currentIndex !== -1 ? ((currentIndex + 1) / sectionOrder.length) * 100 : 0;
  };
  
  const journeyProgress = getJourneyProgress();
  
  // Get dynamic metrics based on current section
  const getDynamicMetrics = () => {
    switch(activeSection) {
      case 'current-state':
        return [
          { label: 'AI Readiness', value: '25%', trend: { text: 'baseline', type: 'neutral' } },
          { label: 'Manual Processes', value: '85%', trend: { text: 'baseline', type: 'neutral' } },
          { label: 'Data Utilization', value: '15%', trend: { text: 'baseline', type: 'neutral' } }
        ];
      case 'phase-1':
        return [
          { label: 'AI Readiness', value: '45%', trend: { text: '+20%', type: 'positive' } },
          { label: 'Automation Level', value: '25%', trend: { text: 'new', type: 'neutral' } },
          { label: 'Team Trained', value: '30%', trend: { text: 'new', type: 'neutral' } }
        ];
      case 'phase-2':
        return [
          { label: 'AI Readiness', value: '65%', trend: { text: '+40%', type: 'positive' } },
          { label: 'Automation Level', value: '45%', trend: { text: '+20%', type: 'positive' } },
          { label: 'ROI Achieved', value: '75%', trend: { text: 'new', type: 'neutral' } }
        ];
      case 'phase-3':
        return [
          { label: 'AI Integration', value: '80%', trend: { text: '+55%', type: 'positive' } },
          { label: 'Efficiency Gain', value: '60%', trend: { text: 'new', type: 'positive' } },
          { label: 'Revenue Impact', value: '+25%', trend: { text: '+25%', type: 'positive' } }
        ];
      case 'phase-4':
        return [
          { label: 'AI Maturity', value: '90%', trend: { text: '+65%', type: 'positive' } },
          { label: 'Cost Reduction', value: '40%', trend: { text: 'new', type: 'positive' } },
          { label: 'Innovation Rate', value: '3x', trend: { text: 'new', type: 'positive' } }
        ];
      case 'future-state':
        return [
          { label: 'AI Leadership', value: '95%', trend: { text: 'achieved', type: 'positive' } },
          { label: 'Market Position', value: 'Top 10%', trend: { text: 'achieved', type: 'positive' } },
          { label: 'Total ROI', value: '425%', trend: { text: 'achieved', type: 'positive' } }
        ];
      default:
        return [];
    }
  };
  
  const getProgressRing = (value) => {
    const validValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, Math.min(100, value)) : 0;
    const radius = 38; // Slightly smaller radius for a tighter look
    const strokeWidth = 7; // Slightly thinner stroke
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validValue / 100) * circumference;
    
    return (
      <svg className="progress-ring" width="90" height="90"> {/* Adjusted size */}
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="var(--timeline-border-secondary)" /* Using CSS var for track */
          strokeWidth={strokeWidth}
        />
        <circle
          cx="45"
          cy="45"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round" /* Rounded line cap */
          transform="rotate(-90 45 45)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--timeline-accent-blue)" />
            <stop offset="100%" stopColor="var(--timeline-accent-green)" />
          </linearGradient>
        </defs>
        <text x="45" y="45" textAnchor="middle" dy="0.3em" className="progress-text">
          {`${Math.round(validValue)}%`}
        </text>
      </svg>
    );
  };
  
  const metrics = getDynamicMetrics();
  
  return (
    <div className={`metrics-widget ${isMinimized ? 'minimized' : ''}`}>
      <div className="widget-header">
        <div className="widget-header-content">
          <h3>AI Journey Progress</h3>
          <button 
            className="widget-toggle"
            onClick={() => setIsMinimized(!isMinimized)}
            aria-label={isMinimized ? 'Expand widget' : 'Minimize widget'}
          >
            {isMinimized ? '◀' : '▶'}
          </button>
        </div>
        {!isMinimized && (
          <div className="journey-progress">
            {getProgressRing(scrollProgress || 0)}
            <p className="progress-label">Journey Completion</p>
          </div>
        )}
      </div>
      
      {!isMinimized && (
        <>
          <div className="widget-metrics">
            <h4>{currentPhase.title} Metrics</h4>
            {metrics.map((metric, index) => (
              <div key={index} className="metric-item">
                <div className="metric-header">
                  <span className="metric-label">{metric.label}</span>
                  {metric.trend && (
                    <span className={`metric-trend ${metric.trend.type || 'neutral'}`}>
                      <TrendIcon type={metric.trend.type} />
                      {metric.trend.text}
                    </span>
                  )}
                </div>
                <div className="metric-value">{metric.value}</div>
              </div>
            ))}
          </div>
          
          <div className="widget-footer">
            <div className="widget-insight">
              <h4>Key Insight</h4>
              <p>{currentPhase.outcomes?.[0]?.description || currentPhase.description || 'Your AI transformation journey is progressing well.'}</p>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 