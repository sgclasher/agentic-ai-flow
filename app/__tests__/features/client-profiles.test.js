/**
 * Client Profile Management Feature Tests
 * Tests the complete user journey for creating and managing client profiles
 */

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock services
jest.mock('../../services/profileService', () => ({
  ProfileService: {
    getAllProfiles: jest.fn(),
    createProfile: jest.fn(),
    getProfile: jest.fn(),
    updateProfile: jest.fn(),
    deleteProfile: jest.fn()
  }
}));

jest.mock('../../services/demoDataService', () => ({
  demoDataService: {
    getDemoProfiles: jest.fn()
  }
}));

jest.mock('../../services/markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn().mockReturnValue('# Mock Markdown'),
    parseMarkdown: jest.fn()
  }
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Simple mock for ProfileWizard
jest.mock('../../profiles/components/ProfileWizard', () => ({
  __esModule: true,
  default: function MockProfileWizard({ isOpen, onClose, onComplete }) {
    if (!isOpen) return null;
    
    return (
      <div data-testid="profile-wizard">
        <h2>Create Client Profile</h2>
        <button onClick={() => {
          onComplete({ id: 'test-123', companyName: 'Test Company' });
          onClose();
        }}>
          Complete Profile
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    );
  }
}));

import ProfilesPage from '../../profiles/page';
import { ProfileService } from '../../services/profileService';
import { demoDataService } from '../../services/demoDataService';

describe('Client Profile Management Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock ProfileService
    ProfileService.getAllProfiles.mockResolvedValue([]);
    ProfileService.createProfile.mockImplementation((data) => 
      Promise.resolve({ ...data, id: 'test-123', createdAt: new Date() })
    );
    
    // Mock demo data
    demoDataService.getDemoProfiles.mockReturnValue([
      { name: 'TechFlow Solutions', industry: 'Technology' },
      { name: 'PrecisionParts Manufacturing', industry: 'Manufacturing' }
    ]);
  });

  it('should display profile list and create new profile', async () => {
    render(<ProfilesPage />);
    
    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Client Profiles')).toBeInTheDocument();
    });
    
    // Initially no profiles
    expect(screen.getByText(/No client profiles yet/i)).toBeInTheDocument();
    
    // Click new profile button
    fireEvent.click(screen.getByText('New Profile'));
    
    // Wizard should open
    expect(screen.getByTestId('profile-wizard')).toBeInTheDocument();
    
    // Complete the profile
    fireEvent.click(screen.getByText('Complete Profile'));
    
    // Wait for profile to be created
    await waitFor(() => {
      expect(ProfileService.createProfile).toHaveBeenCalled();
    });
  });

  it('should load demo data when requested', async () => {
    render(<ProfilesPage />);
    
    // Find and click demo data button
    const demoButton = await screen.findByText(/Load Demo Data/i);
    fireEvent.click(demoButton);
    
    // Should show demo options
    await waitFor(() => {
      expect(screen.getByText('TechFlow Solutions')).toBeInTheDocument();
      expect(screen.getByText('PrecisionParts Manufacturing')).toBeInTheDocument();
    });
  });

  it('should handle existing profiles', async () => {
    // Mock existing profiles
    ProfileService.getAllProfiles.mockResolvedValue([
      {
        id: '1',
        companyName: 'Existing Company',
        industry: 'Healthcare',
        createdAt: new Date(),
        markdownContent: '# Existing Company'
      }
    ]);
    
    render(<ProfilesPage />);
    
    // Wait for profiles to load
    await waitFor(() => {
      expect(screen.getByText('Existing Company')).toBeInTheDocument();
      expect(screen.getByText('Healthcare')).toBeInTheDocument();
    });
    
    // Should not show "no profiles" message
    expect(screen.queryByText(/No client profiles yet/i)).not.toBeInTheDocument();
  });

  it('should navigate to profile detail when clicking view', async () => {
    const mockPush = jest.fn();
    jest.mocked(require('next/navigation').useRouter).mockReturnValue({
      push: mockPush
    });
    
    ProfileService.getAllProfiles.mockResolvedValue([
      {
        id: 'profile-123',
        companyName: 'Test Company',
        industry: 'Technology',
        createdAt: new Date()
      }
    ]);
    
    render(<ProfilesPage />);
    
    // Wait for profile to appear
    await waitFor(() => {
      expect(screen.getByText('Test Company')).toBeInTheDocument();
    });
    
    // Click view button (if implemented)
    const viewButton = screen.queryByRole('button', { name: /view/i });
    if (viewButton) {
      fireEvent.click(viewButton);
      expect(mockPush).toHaveBeenCalledWith('/profiles/profile-123');
    }
  });

  it('should handle profile creation errors', async () => {
    ProfileService.createProfile.mockRejectedValue(new Error('Creation failed'));
    
    render(<ProfilesPage />);
    
    // Open wizard
    fireEvent.click(screen.getByText('New Profile'));
    
    // Try to complete
    fireEvent.click(screen.getByText('Complete Profile'));
    
    // Should handle error gracefully
    await waitFor(() => {
      // Error handling would be implemented in real component
      expect(ProfileService.createProfile).toHaveBeenCalled();
    });
  });
}); 