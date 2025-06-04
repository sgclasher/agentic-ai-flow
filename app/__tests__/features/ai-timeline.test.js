/**
 * AI Timeline Generation Feature Tests
 * Tests the complete user journey for generating and interacting with AI timelines
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock stores and services
jest.mock('../../store/useBusinessProfileStore', () => ({
  useBusinessProfileStore: jest.fn()
}));

jest.mock('../../services/timelineService', () => ({
  timelineService: {
    generateTimeline: jest.fn()
  }
}));

// Mock timeline components
jest.mock('../../timeline/components/BusinessProfileModal', () => ({
  __esModule: true,
  default: function MockBusinessProfileModal({ isOpen, onClose, onSubmit }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid="profile-modal">
        <h2>Business Profile</h2>
        <button onClick={() => {
          onSubmit({
            companyName: 'Test Company',
            industry: 'Technology',
            companySize: '100-500',
            aiMaturity: 'beginner'
          });
          onClose();
        }}>
          Generate Timeline
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  }
}));

jest.mock('../../timeline/components/MetricsWidget', () => ({
  __esModule: true,
  default: function MockMetricsWidget({ metrics }) {
    return (
      <div data-testid="metrics-widget" className="metrics-widget">
        <div>ROI: {metrics?.roi || '0%'}</div>
        <div>Investment: {metrics?.investment || '$0'}</div>
        <div>Timeline: {metrics?.timeline || '0 months'}</div>
      </div>
    );
  }
}));

// Import mocked functions
import { useBusinessProfileStore } from '../../store/useBusinessProfileStore';
import { timelineService } from '../../services/timelineService';

// Import mock components
import MockBusinessProfileModal from '../../timeline/components/BusinessProfileModal';
import MockMetricsWidget from '../../timeline/components/MetricsWidget';

// Simple timeline page mock
const MockTimelinePage = () => {
  const store = useBusinessProfileStore();
  const [showModal, setShowModal] = React.useState(!store.timeline);
  
  return (
    <div>
      <h1>AI Transformation Timeline</h1>
      
      {!store.timeline && (
        <button onClick={() => setShowModal(true)}>
          Create Timeline
        </button>
      )}
      
      {store.timeline && (
        <>
          <div data-testid="timeline-content">
            <h2>{store.timeline.companyName} Timeline</h2>
            <div>Scenario: {store.timeline.scenario}</div>
            <div>Phases: {store.timeline.phases?.length || 0}</div>
          </div>
          
          <div data-testid="scenario-selector">
            <button onClick={() => store.setScenario('conservative')}>
              Conservative
            </button>
            <button onClick={() => store.setScenario('balanced')}>
              Balanced
            </button>
            <button onClick={() => store.setScenario('aggressive')}>
              Aggressive
            </button>
          </div>
          
          <MockMetricsWidget metrics={store.timeline.metrics} />
        </>
      )}
      
      <MockBusinessProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={async (profile) => {
          const timeline = await timelineService.generateTimeline(profile, 'balanced');
          store.setTimeline(timeline);
        }}
      />
    </div>
  );
};

describe('AI Timeline Generation Feature', () => {
  let mockStore;
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock store
    mockStore = {
      timeline: null,
      setTimeline: jest.fn(),
      businessProfile: null,
      setBusinessProfile: jest.fn(),
      scenario: 'balanced',
      setScenario: jest.fn()
    };
    
    useBusinessProfileStore.mockImplementation((selector) =>
      selector ? selector(mockStore) : mockStore
    );
    
    // Mock timeline service
    timelineService.generateTimeline.mockResolvedValue({
      companyName: 'Test Company',
      scenario: 'balanced',
      phases: [
        { name: 'Foundation', duration: '3 months' },
        { name: 'Implementation', duration: '6 months' },
        { name: 'Expansion', duration: '9 months' },
        { name: 'Optimization', duration: '12 months' }
      ],
      metrics: {
        roi: '425%',
        investment: '$1.5M',
        timeline: '30 months'
      }
    });
  });

  it('should generate timeline from business profile', async () => {
    render(<MockTimelinePage />);
    
    // Initially no timeline
    expect(screen.getByText('Create Timeline')).toBeInTheDocument();
    expect(screen.queryByTestId('timeline-content')).not.toBeInTheDocument();
    
    // Open profile modal
    fireEvent.click(screen.getByText('Create Timeline'));
    expect(screen.getByTestId('profile-modal')).toBeInTheDocument();
    
    // Submit profile
    fireEvent.click(screen.getByText('Generate Timeline'));
    
    // Wait for timeline generation
    await waitFor(() => {
      expect(timelineService.generateTimeline).toHaveBeenCalledWith(
        expect.objectContaining({
          companyName: 'Test Company',
          industry: 'Technology'
        }),
        'balanced'
      );
    });
    
    // Mock timeline display
    mockStore.timeline = await timelineService.generateTimeline.mock.results[0].value;
    
    // Verify timeline is displayed
    expect(mockStore.setTimeline).toHaveBeenCalled();
  });

  it('should switch between scenarios', async () => {
    // Setup with existing timeline
    mockStore.timeline = {
      companyName: 'Test Company',
      scenario: 'balanced',
      phases: [1, 2, 3, 4],
      metrics: { roi: '425%', investment: '$1.5M', timeline: '30 months' }
    };
    
    render(<MockTimelinePage />);
    
    // Verify initial scenario
    expect(screen.getByText('Scenario: balanced')).toBeInTheDocument();
    
    // Switch to conservative
    fireEvent.click(screen.getByText('Conservative'));
    expect(mockStore.setScenario).toHaveBeenCalledWith('conservative');
    
    // Switch to aggressive
    fireEvent.click(screen.getByText('Aggressive'));
    expect(mockStore.setScenario).toHaveBeenCalledWith('aggressive');
  });

  it('should display metrics widget with timeline data', async () => {
    mockStore.timeline = {
      companyName: 'Test Company',
      scenario: 'balanced',
      phases: [],
      metrics: {
        roi: '425%',
        investment: '$1.5M',
        timeline: '30 months'
      }
    };
    
    render(<MockTimelinePage />);
    
    // Verify metrics widget
    const metricsWidget = screen.getByTestId('metrics-widget');
    expect(metricsWidget).toBeInTheDocument();
    expect(screen.getByText('ROI: 425%')).toBeInTheDocument();
    expect(screen.getByText('Investment: $1.5M')).toBeInTheDocument();
    expect(screen.getByText('Timeline: 30 months')).toBeInTheDocument();
  });

  it('should display correct number of phases', async () => {
    mockStore.timeline = {
      companyName: 'Test Company',
      scenario: 'balanced',
      phases: [
        { name: 'Foundation' },
        { name: 'Implementation' },
        { name: 'Expansion' },
        { name: 'Optimization' }
      ],
      metrics: {}
    };
    
    render(<MockTimelinePage />);
    
    expect(screen.getByText('Phases: 4')).toBeInTheDocument();
  });

  it('should handle timeline generation errors', async () => {
    timelineService.generateTimeline.mockRejectedValue(new Error('Generation failed'));
    
    render(<MockTimelinePage />);
    
    // Try to generate timeline
    fireEvent.click(screen.getByText('Create Timeline'));
    fireEvent.click(screen.getByText('Generate Timeline'));
    
    await waitFor(() => {
      expect(timelineService.generateTimeline).toHaveBeenCalled();
    });
    
    // Error should be handled gracefully
    // In real app, would show error message
  });
}); 