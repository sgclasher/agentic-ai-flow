'use client';

import React, { useState } from 'react';

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
          { label: 'AI Readiness', value: '25%', trend: 'baseline' },
          { label: 'Manual Processes', value: '85%', trend: 'baseline' },
          { label: 'Data Utilization', value: '15%', trend: 'baseline' }
        ];
      case 'phase-1':
        return [
          { label: 'AI Readiness', value: '45%', trend: '+20%' },
          { label: 'Automation Level', value: '25%', trend: 'new' },
          { label: 'Team Trained', value: '30%', trend: 'new' }
        ];
      case 'phase-2':
        return [
          { label: 'AI Readiness', value: '65%', trend: '+40%' },
          { label: 'Automation Level', value: '45%', trend: '+20%' },
          { label: 'ROI Achieved', value: '75%', trend: 'new' }
        ];
      case 'phase-3':
        return [
          { label: 'AI Integration', value: '80%', trend: '+55%' },
          { label: 'Efficiency Gain', value: '60%', trend: 'new' },
          { label: 'Revenue Impact', value: '+25%', trend: 'new' }
        ];
      case 'phase-4':
        return [
          { label: 'AI Maturity', value: '90%', trend: '+65%' },
          { label: 'Cost Reduction', value: '40%', trend: 'new' },
          { label: 'Innovation Rate', value: '3x', trend: 'new' }
        ];
      case 'future-state':
        return [
          { label: 'AI Leadership', value: '95%', trend: 'achieved' },
          { label: 'Market Position', value: 'Top 10%', trend: 'achieved' },
          { label: 'Total ROI', value: '425%', trend: 'achieved' }
        ];
      default:
        return [];
    }
  };
  
  const getProgressRing = (value) => {
    // Ensure value is a valid number between 0 and 100
    const validValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, Math.min(100, value)) : 0;
    
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validValue / 100) * circumference;
    
    return (
      <svg className="progress-ring" width="100" height="100">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3498db" />
            <stop offset="100%" stopColor="#2ecc71" />
          </linearGradient>
        </defs>
        <text x="50" y="50" textAnchor="middle" dy="0.3em" className="progress-text">
          {Math.round(validValue)}%
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
                  {metric.trend && metric.trend !== 'baseline' && (
                    <span className={`metric-trend ${
                      metric.trend === 'new' ? 'new' : 
                      metric.trend === 'achieved' ? 'achieved' : 'change'
                    }`}>
                      {metric.trend}
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