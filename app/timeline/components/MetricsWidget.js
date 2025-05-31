'use client';

import React, { useMemo } from 'react';

export default function MetricsWidget({ activeSection, timelineData, scrollProgress }) {
  // Calculate dynamic metrics based on current section
  const metrics = useMemo(() => {
    if (!timelineData) return null;
    
    // Define metrics for each section
    const sectionMetrics = {
      'current-state': {
        title: 'Current Baseline',
        metrics: [
          { label: 'AI Readiness', value: '35%', trend: null },
          { label: 'Automation Level', value: '15%', trend: null },
          { label: 'Digital Maturity', value: '42%', trend: null },
          { label: 'Annual IT Spend', value: '$2.5M', trend: null }
        ]
      },
      'phase-1': {
        title: 'Foundation Metrics',
        metrics: [
          { label: 'AI Readiness', value: '55%', trend: '+20%' },
          { label: 'Team Training', value: '80%', trend: 'new' },
          { label: 'Infrastructure', value: '65%', trend: '+50%' },
          { label: 'Investment', value: '$500K', trend: null }
        ]
      },
      'phase-2': {
        title: 'Implementation Impact',
        metrics: [
          { label: 'Automation Level', value: '45%', trend: '+30%' },
          { label: 'Process Efficiency', value: '62%', trend: '+47%' },
          { label: 'Cost Savings', value: '$350K', trend: 'new' },
          { label: 'ROI', value: '125%', trend: null }
        ]
      },
      'phase-3': {
        title: 'Expansion Results',
        metrics: [
          { label: 'AI Coverage', value: '75%', trend: '+30%' },
          { label: 'Revenue Impact', value: '+18%', trend: 'new' },
          { label: 'Customer Satisfaction', value: '92%', trend: '+15%' },
          { label: 'Annual Savings', value: '$1.2M', trend: '+240%' }
        ]
      },
      'phase-4': {
        title: 'Optimization Gains',
        metrics: [
          { label: 'AI Maturity', value: '85%', trend: '+50%' },
          { label: 'Operational Excellence', value: '88%', trend: '+46%' },
          { label: 'Innovation Index', value: '9.2/10', trend: 'new' },
          { label: 'Market Position', value: 'Top 10%', trend: 'new' }
        ]
      },
      'future-state': {
        title: 'Future State Vision',
        metrics: [
          { label: 'Full AI Integration', value: '95%', trend: '+60%' },
          { label: 'Revenue Growth', value: '+45%', trend: null },
          { label: 'Cost Reduction', value: '-35%', trend: null },
          { label: 'Total ROI', value: '425%', trend: null }
        ]
      }
    };
    
    return sectionMetrics[activeSection] || sectionMetrics['current-state'];
  }, [activeSection, timelineData]);
  
  const getProgressRing = (value) => {
    // Ensure value is a valid number between 0 and 100
    const validValue = typeof value === 'number' && !isNaN(value) ? Math.max(0, Math.min(100, value)) : 0;
    
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (validValue / 100) * circumference;
    
    return (
      <svg width="100" height="100" className="progress-ring">
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#e5e7eb"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#3498db"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dashoffset 0.5s ease' }}
        />
        <text x="50" y="50" textAnchor="middle" dy="0.3em" className="progress-text">
          {Math.round(validValue)}%
        </text>
      </svg>
    );
  };
  
  if (!metrics) return null;
  
  return (
    <aside className="metrics-widget">
      <div className="widget-header">
        <h3>{metrics.title}</h3>
        <div className="journey-progress">
          {getProgressRing(scrollProgress)}
          <p className="progress-label">Journey Progress</p>
        </div>
      </div>
      
      <div className="widget-metrics">
        {metrics.metrics.map((metric, index) => (
          <div key={index} className="metric-item">
            <div className="metric-header">
              <span className="metric-label">{metric.label}</span>
              {metric.trend && (
                <span className={`metric-trend ${metric.trend === 'new' ? 'new' : 'change'}`}>
                  {metric.trend === 'new' ? 'NEW' : metric.trend}
                </span>
              )}
            </div>
            <div className="metric-value">{metric.value}</div>
          </div>
        ))}
      </div>
      
      <div className="widget-footer">
        <div className="widget-insight">
          <h4>Insight</h4>
          <p>
            {activeSection === 'current-state' && "Starting your AI transformation journey. Focus on building a strong foundation."}
            {activeSection === 'phase-1' && "Foundation phase shows significant readiness improvements. Team adoption is key."}
            {activeSection === 'phase-2' && "Implementation delivering strong ROI. Process automation showing immediate benefits."}
            {activeSection === 'phase-3' && "Expansion phase demonstrating scalable growth. Customer satisfaction rising rapidly."}
            {activeSection === 'phase-4' && "Optimization achieving operational excellence. Innovation becoming a core competency."}
            {activeSection === 'future-state' && "Vision realized: AI-driven organization with industry-leading performance."}
          </p>
        </div>
      </div>
    </aside>
  );
} 