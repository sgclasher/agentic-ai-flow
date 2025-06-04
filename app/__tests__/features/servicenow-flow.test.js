/**
 * ServiceNow Flow Visualization Feature Tests
 * Tests the complete user journey for connecting and visualizing flows
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useAgenticStore } from '../../store/useAgenticStore';

// Mock the store module
jest.mock('../../store/useAgenticStore', () => ({
  useAgenticStore: jest.fn()
}));

// Mock components to avoid complex setup
jest.mock('../../components/FlowVisualizer', () => ({
  __esModule: true,
  default: function MockFlowVisualizer({ onReady }) {
    React.useEffect(() => {
      if (onReady) {
        onReady({
          expandAllNodes: jest.fn(),
          collapseAllNodes: jest.fn(),
          resetView: jest.fn()
        });
      }
    }, [onReady]);
    
    return (
      <div data-testid="flow-visualizer">
        <div>Mock Flow Visualizer</div>
        <button data-testid="expand-node">Expand Node</button>
        <button data-testid="collapse-node">Collapse Node</button>
      </div>
    );
  }
}));

jest.mock('../../components/ServiceNowConnector', () => ({
  __esModule: true,
  default: function MockServiceNowConnector({ onConnect }) {
    return (
      <div data-testid="servicenow-connector">
        <button onClick={() => onConnect({ instanceUrl: 'test.service-now.com' })}>
          Connect to ServiceNow
        </button>
      </div>
    );
  }
}));

// Import after mocks
import HomePage from '../../page';

describe('ServiceNow Flow Visualization Feature', () => {
  let mockStore;
  
  beforeEach(() => {
    // Reset mock store
    mockStore = {
      agenticData: null,
      setAgenticData: jest.fn(),
      setServiceNowUrl: jest.fn(),
      isLoading: false,
      error: null,
      clearError: jest.fn(),
      resetData: jest.fn(),
      refreshData: jest.fn()
    };
    
    useAgenticStore.mockImplementation((selector) => 
      selector ? selector(mockStore) : mockStore
    );
  });

  it('should connect to ServiceNow instance and display flow', async () => {
    // 1. Render without data (shows connector)
    const { rerender } = render(<HomePage />);
    
    expect(screen.getByTestId('servicenow-connector')).toBeInTheDocument();
    expect(screen.getByText('ServiceNow Agentic AI Flow Visualizer')).toBeInTheDocument();
    
    // 2. Click connect button
    fireEvent.click(screen.getByText('Connect to ServiceNow'));
    
    // 3. Simulate successful connection with data
    mockStore.agenticData = {
      useCases: [
        { id: '1', label: 'Test Use Case', description: 'Test Description' }
      ],
      triggers: [],
      agents: [],
      tools: []
    };
    
    rerender(<HomePage />);
    
    // 4. Verify flow visualizer is displayed
    await waitFor(() => {
      expect(screen.getByTestId('flow-visualizer')).toBeInTheDocument();
    });
  });

  it('should handle node expand/collapse operations', async () => {
    // Setup with data
    mockStore.agenticData = {
      useCases: [{ id: '1', label: 'Test Use Case' }],
      triggers: [],
      agents: [],
      tools: []
    };
    
    render(<HomePage />);
    
    // Verify controls are present
    expect(screen.getByText('Expand All')).toBeInTheDocument();
    expect(screen.getByText('Collapse All')).toBeInTheDocument();
    
    // Test expand all
    fireEvent.click(screen.getByText('Expand All'));
    
    // Test collapse all
    fireEvent.click(screen.getByText('Collapse All'));
    
    // Test reset view
    fireEvent.click(screen.getByText('Reset View'));
  });

  it('should handle layout direction changes', async () => {
    mockStore.agenticData = {
      useCases: [{ id: '1', label: 'Test Use Case' }],
      triggers: [],
      agents: [],
      tools: []
    };
    
    render(<HomePage />);
    
    // Check for layout toggle (if implemented)
    const layoutButton = screen.queryByRole('button', { name: /layout/i });
    if (layoutButton) {
      fireEvent.click(layoutButton);
      // Would verify layout change here
    }
  });

  it('should handle errors gracefully', async () => {
    // Setup with error
    mockStore.error = 'Failed to connect to ServiceNow';
    
    render(<HomePage />);
    
    // Verify error is displayed
    expect(screen.getByText(/Failed to connect/i)).toBeInTheDocument();
    
    // Verify dismiss button works
    const dismissButton = screen.getByText('✕');
    fireEvent.click(dismissButton);
    
    expect(mockStore.clearError).toHaveBeenCalled();
  });

  it('should refresh data when requested', async () => {
    mockStore.agenticData = {
      useCases: [{ id: '1', label: 'Test Use Case' }],
      triggers: [],
      agents: [],
      tools: []
    };
    
    render(<HomePage />);
    
    // Find and click refresh button
    const refreshButton = screen.getByText('Refresh');
    fireEvent.click(refreshButton);
    
    expect(mockStore.refreshData).toHaveBeenCalled();
  });
}); 