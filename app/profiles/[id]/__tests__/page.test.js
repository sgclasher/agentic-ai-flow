import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileDetailPage from '../page';
import { ProfileService } from '../../../services/profileService';
import { markdownService } from '../../../services/markdownService';

// Mock the services
jest.mock('../../../services/profileService', () => ({
  ProfileService: {
    getProfile: jest.fn(),
  },
}));

jest.mock('../../../services/markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn(() => 'Generated markdown content'),
  },
}));

// Mock Next.js useParams
const mockParams = { id: 'test-profile-id' };
jest.mock('next/navigation', () => ({
  useParams: () => mockParams,
}));

// Mock window.location
delete window.location;
window.location = { href: '' };

// Mock clipboard API
Object.assign(navigator, {
  clipboard: {
    writeText: jest.fn(() => Promise.resolve()),
  },
});

describe('ProfileDetailPage', () => {
  const mockProfile = {
    id: 'test-profile-id',
    companyName: 'Test Corp',
    industry: 'Technology',
    size: 'Mid-Market',
    annualRevenue: '50000000',
    employeeCount: '1500',
    primaryLocation: 'San Francisco, CA',
    status: 'active',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-15T00:00:00.000Z',
    valueSellingFramework: {
      businessIssues: ['Digital Transformation', 'Operational Efficiency'],
      businessIssueDetails: 'Company needs to modernize their systems',
      impact: {
        totalAnnualImpact: '2500000',
        laborCosts: '1000000',
      },
      decisionMakers: {
        economicBuyer: {
          name: 'John Smith',
          title: 'CEO',
          budget: '5000000',
        },
        technicalBuyer: {
          name: 'Jane Doe',
          title: 'CTO',
        },
        champion: {
          name: 'Bob Johnson',
          title: 'VP Operations',
        },
      },
      solutionCapabilities: [
        'Automate document processing',
        'Streamline approval workflows',
      ],
      roiExpectations: {
        paybackPeriod: '18 months',
        expectedRoi: '300%',
      },
    },
    aiOpportunityAssessment: {
      aiReadinessScore: 7,
      currentTechnology: {
        crm: 'Salesforce',
        erp: 'SAP',
        cloudPlatform: 'AWS',
      },
      opportunities: [
        {
          name: 'Automated Invoice Processing',
          department: 'Finance',
          process: 'Invoice Processing',
          currentState: 'Manual review of all invoices',
          aiSolution: 'OCR + ML for automatic data extraction',
          estimatedImpact: '500000',
          timeline: '6 months',
          implementationEffort: 'Medium',
          priorityScore: 8,
        },
      ],
      quickWins: [
        {
          name: 'Chatbot for HR FAQs',
          impact: '100000',
          timeline: '3 months',
        },
      ],
    },
    markdown: 'Custom markdown content',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    ProfileService.getProfile.mockResolvedValue(mockProfile);
  });

  describe('Loading State', () => {
    test('shows loading spinner while fetching profile', async () => {
      // Make the promise not resolve immediately
      let resolvePromise;
      const promise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
      ProfileService.getProfile.mockReturnValue(promise);

      render(<ProfileDetailPage />);

      expect(screen.getByText('Loading profile...')).toBeInTheDocument();
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument(); // loading spinner

      // Resolve the promise
      resolvePromise(mockProfile);
      await waitFor(() => {
        expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    test('shows error message when profile not found', async () => {
      ProfileService.getProfile.mockResolvedValue(null);

      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Profile Not Found')).toBeInTheDocument();
        expect(screen.getByText('The requested profile could not be found.')).toBeInTheDocument();
        expect(screen.getByText('Back to Profiles')).toBeInTheDocument();
      });
    });

    test('shows error message when service throws error', async () => {
      ProfileService.getProfile.mockRejectedValue(new Error('Network error'));

      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
        expect(screen.getByText('Back to Profiles')).toBeInTheDocument();
      });
    });

    test('back button navigates to profiles page', async () => {
      ProfileService.getProfile.mockResolvedValue(null);

      render(<ProfileDetailPage />);

      await waitFor(() => {
        const backButton = screen.getByText('Back to Profiles');
        fireEvent.click(backButton);
        expect(window.location.href).toBe('/profiles');
      });
    });
  });

  describe('Profile Header', () => {
    test('displays company information correctly', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Test Corp')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('Mid-Market')).toBeInTheDocument();
        expect(screen.getByText('active')).toBeInTheDocument();
      });
    });

    test('displays industry icon', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('💻')).toBeInTheDocument(); // Technology icon
      });
    });

    test('edit button navigates to profiles page', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        const editButton = screen.getByText('Edit Profile');
        fireEvent.click(editButton);
        expect(window.location.href).toBe('/profiles');
      });
    });

    test('generate timeline button navigates with profile ID', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        const timelineButton = screen.getByText('Generate AI Timeline');
        fireEvent.click(timelineButton);
        expect(window.location.href).toBe('/timeline?profileId=test-profile-id');
      });
    });
  });

  describe('Navigation Tabs', () => {
    test('shows all navigation tabs', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Overview')).toBeInTheDocument();
        expect(screen.getByText('Analysis')).toBeInTheDocument();
        expect(screen.getByText('AI Opportunities')).toBeInTheDocument();
        expect(screen.getByText('Markdown')).toBeInTheDocument();
      });
    });

    test('overview tab is active by default', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        const overviewTab = screen.getByText('Overview');
        expect(overviewTab).toHaveClass('active');
      });
    });

    test('can switch between tabs', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Overview')).toHaveClass('active');
      });

      // Click Analysis tab
      const analysisTab = screen.getByText('Analysis');
      await user.click(analysisTab);

      expect(analysisTab).toHaveClass('active');
      expect(screen.getByText('Overview')).not.toHaveClass('active');
    });
  });

  describe('Overview Tab', () => {
    test('displays company information', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Company Information')).toBeInTheDocument();
        expect(screen.getByText('Test Corp')).toBeInTheDocument();
        expect(screen.getByText('Technology')).toBeInTheDocument();
        expect(screen.getByText('$50,000,000')).toBeInTheDocument();
        expect(screen.getByText('1500')).toBeInTheDocument();
        expect(screen.getByText('San Francisco, CA')).toBeInTheDocument();
      });
    });

    test('displays business issues', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Key Business Issues')).toBeInTheDocument();
        expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
        expect(screen.getByText('Operational Efficiency')).toBeInTheDocument();
        expect(screen.getByText('Company needs to modernize their systems')).toBeInTheDocument();
      });
    });

    test('displays impact analysis', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('Impact Analysis')).toBeInTheDocument();
        expect(screen.getByText('$2,500,000')).toBeInTheDocument();
        expect(screen.getByText('$1,000,000')).toBeInTheDocument();
      });
    });

    test('displays AI readiness score', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText('AI Readiness')).toBeInTheDocument();
        expect(screen.getByText('7')).toBeInTheDocument();
        expect(screen.getByText('/ 10')).toBeInTheDocument();
        expect(screen.getByText('Salesforce')).toBeInTheDocument();
        expect(screen.getByText('SAP')).toBeInTheDocument();
        expect(screen.getByText('AWS')).toBeInTheDocument();
      });
    });
  });

  describe('Analysis Tab', () => {
    test('displays decision makers information', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to Analysis tab
      const analysisTab = screen.getByText('Analysis');
      await user.click(analysisTab);

      await waitFor(() => {
        expect(screen.getByText('Decision Makers')).toBeInTheDocument();
        expect(screen.getByText('Economic Buyer')).toBeInTheDocument();
        expect(screen.getByText('John Smith')).toBeInTheDocument();
        expect(screen.getByText('CEO')).toBeInTheDocument();
        expect(screen.getByText('Budget: $5,000,000')).toBeInTheDocument();

        expect(screen.getByText('Technical Buyer')).toBeInTheDocument();
        expect(screen.getByText('Jane Doe')).toBeInTheDocument();
        expect(screen.getByText('CTO')).toBeInTheDocument();

        expect(screen.getByText('Champion')).toBeInTheDocument();
        expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
        expect(screen.getByText('VP Operations')).toBeInTheDocument();
      });
    });

    test('displays solution requirements', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to Analysis tab
      const analysisTab = screen.getByText('Analysis');
      await user.click(analysisTab);

      await waitFor(() => {
        expect(screen.getByText('Solution Requirements')).toBeInTheDocument();
        expect(screen.getByText('Automate document processing')).toBeInTheDocument();
        expect(screen.getByText('Streamline approval workflows')).toBeInTheDocument();
      });
    });

    test('displays ROI expectations', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to Analysis tab
      const analysisTab = screen.getByText('Analysis');
      await user.click(analysisTab);

      await waitFor(() => {
        expect(screen.getByText('ROI Expectations')).toBeInTheDocument();
        expect(screen.getByText('18 months')).toBeInTheDocument();
        expect(screen.getByText('300%')).toBeInTheDocument();
      });
    });
  });

  describe('AI Opportunities Tab', () => {
    test('displays AI opportunities', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to AI Opportunities tab
      const opportunitiesTab = screen.getByText('AI Opportunities');
      await user.click(opportunitiesTab);

      await waitFor(() => {
        expect(screen.getByText('AI Opportunities')).toBeInTheDocument();
        expect(screen.getByText('Automated Invoice Processing')).toBeInTheDocument();
        expect(screen.getByText('Finance')).toBeInTheDocument();
        expect(screen.getByText('Invoice Processing')).toBeInTheDocument();
        expect(screen.getByText('OCR + ML for automatic data extraction')).toBeInTheDocument();
        expect(screen.getByText('$500,000')).toBeInTheDocument();
        expect(screen.getByText('Priority: 8/10')).toBeInTheDocument();
      });
    });

    test('displays quick wins', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to AI Opportunities tab
      const opportunitiesTab = screen.getByText('AI Opportunities');
      await user.click(opportunitiesTab);

      await waitFor(() => {
        expect(screen.getByText('Quick Wins (0-6 months)')).toBeInTheDocument();
        expect(screen.getByText('Chatbot for HR FAQs')).toBeInTheDocument();
        expect(screen.getByText('$100,000 impact')).toBeInTheDocument();
        expect(screen.getByText('3 months')).toBeInTheDocument();
      });
    });

    test('shows empty state when no opportunities exist', async () => {
      const profileWithoutOpportunities = {
        ...mockProfile,
        aiOpportunityAssessment: {
          ...mockProfile.aiOpportunityAssessment,
          opportunities: [],
          quickWins: [],
        },
      };
      ProfileService.getProfile.mockResolvedValue(profileWithoutOpportunities);

      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to AI Opportunities tab
      const opportunitiesTab = screen.getByText('AI Opportunities');
      await user.click(opportunitiesTab);

      await waitFor(() => {
        expect(screen.getByText('No AI opportunities identified yet. Complete the AI assessment section to generate recommendations.')).toBeInTheDocument();
      });
    });
  });

  describe('Markdown Tab', () => {
    test('displays markdown content', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to Markdown tab
      const markdownTab = screen.getByText('Markdown');
      await user.click(markdownTab);

      await waitFor(() => {
        expect(screen.getByText('Profile Markdown')).toBeInTheDocument();
        expect(screen.getByText('Copy to Clipboard')).toBeInTheDocument();
        expect(screen.getByText('Custom markdown content')).toBeInTheDocument();
      });
    });

    test('generates markdown when not available in profile', async () => {
      const profileWithoutMarkdown = {
        ...mockProfile,
        markdown: undefined,
      };
      ProfileService.getProfile.mockResolvedValue(profileWithoutMarkdown);

      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to Markdown tab
      const markdownTab = screen.getByText('Markdown');
      await user.click(markdownTab);

      await waitFor(() => {
        expect(markdownService.generateMarkdown).toHaveBeenCalledWith(profileWithoutMarkdown);
        expect(screen.getByText('Generated markdown content')).toBeInTheDocument();
      });
    });

    test('copy to clipboard button works', async () => {
      const user = userEvent.setup();
      render(<ProfileDetailPage />);

      // Switch to Markdown tab
      const markdownTab = screen.getByText('Markdown');
      await user.click(markdownTab);

      await waitFor(() => {
        const copyButton = screen.getByText('Copy to Clipboard');
        fireEvent.click(copyButton);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Custom markdown content');
      });
    });
  });

  describe('Footer', () => {
    test('displays profile metadata', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(screen.getByText(/Created:/)).toBeInTheDocument();
        expect(screen.getByText(/Updated:/)).toBeInTheDocument();
        expect(screen.getByText('ID: test-profile-id')).toBeInTheDocument();
      });
    });
  });

  describe('Service Integration', () => {
    test('calls ProfileService.getProfile with correct ID', async () => {
      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(ProfileService.getProfile).toHaveBeenCalledWith('test-profile-id');
      });
    });

    test('handles different profile ID from params', async () => {
      // Mock different profile ID
      const originalParams = mockParams.id;
      mockParams.id = 'different-profile-id';

      render(<ProfileDetailPage />);

      await waitFor(() => {
        expect(ProfileService.getProfile).toHaveBeenCalledWith('different-profile-id');
      });

      // Restore original ID
      mockParams.id = originalParams;
    });
  });
}); 