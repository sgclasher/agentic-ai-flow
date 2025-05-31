'use client';

import React from 'react';

const scenarios = [
  {
    id: 'conservative',
    label: 'Conservative',
    description: 'Lower risk, proven technologies',
    icon: '🛡️',
    color: '#10b981',
  },
  {
    id: 'balanced',
    label: 'Balanced',
    description: 'Moderate pace, balanced approach',
    icon: '⚖️',
    color: '#3498db',
  },
  {
    id: 'aggressive',
    label: 'Aggressive',
    description: 'Fast adoption, cutting-edge tech',
    icon: '🚀',
    color: '#ef4444',
  },
];

export default function ScenarioSelector({ currentScenario, onScenarioChange }) {
  return (
    <div className="scenario-selector">
      <h3>Choose Your AI Adoption Scenario</h3>
      <div className="scenario-options">
        {scenarios.map(scenario => (
          <button
            key={scenario.id}
            className={`scenario-option ${currentScenario === scenario.id ? 'active' : ''}`}
            onClick={() => onScenarioChange(scenario.id)}
            style={{
              '--scenario-color': scenario.color,
            }}
          >
            <div className="scenario-icon">{scenario.icon}</div>
            <h4>{scenario.label}</h4>
            <p>{scenario.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
} 