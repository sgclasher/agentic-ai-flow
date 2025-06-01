import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProfileWizard from '../ProfileWizard';

// Mock the markdownService
jest.mock('../../../services/markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn(() => 'Generated markdown content'),
  },
}));

// Mock the profileService  
jest.mock('../../../services/profileService', () => ({
  profileService: {
    createProfile: jest.fn(() => Promise.resolve({ id: 'test-profile-id' })),
  },
}));

describe('ProfileWizard Enhanced Functionality', () => {
  let mockOnComplete;

  beforeEach(() => {
    mockOnComplete = jest.fn();
    jest.clearAllMocks();
  });

  describe('Company Overview Step', () => {
    test('renders all required company overview fields', () => {
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/industry/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/company size/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/annual revenue/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/employee count/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/primary location/i)).toBeInTheDocument();
    });

    test('validates required fields before proceeding', async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      expect(screen.getByText(/company name is required/i)).toBeInTheDocument();
    });

    test('allows proceeding with valid company data', async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      await user.selectOptions(screen.getByLabelText(/company size/i), 'Mid-Market');
      
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);
      
      expect(screen.getByText(/business issue/i)).toBeInTheDocument();
    });
  });

  describe('Business Issue Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Navigate to Business Issue step
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      await user.click(screen.getByRole('button', { name: /next/i }));
    });

    test('renders business issue checkboxes', () => {
      expect(screen.getByText(/revenue growth pressure/i)).toBeInTheDocument();
      expect(screen.getByText(/cost reduction mandate/i)).toBeInTheDocument();
      expect(screen.getByText(/operational efficiency/i)).toBeInTheDocument();
      expect(screen.getByText(/digital transformation/i)).toBeInTheDocument();
    });

    test('allows selecting multiple business issues', async () => {
      const user = userEvent.setup();
      
      const revenueGrowth = screen.getByLabelText(/revenue growth pressure/i);
      const costReduction = screen.getByLabelText(/cost reduction mandate/i);
      
      await user.click(revenueGrowth);
      await user.click(costReduction);
      
      expect(revenueGrowth).toBeChecked();
      expect(costReduction).toBeChecked();
    });

    test('allows entering custom business issue', async () => {
      const user = userEvent.setup();
      
      const otherInput = screen.getByPlaceholderText(/specify other business issue/i);
      await user.type(otherInput, 'Custom business challenge');
      
      expect(otherInput).toHaveValue('Custom business challenge');
    });
  });

  describe('Problems/Challenges Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Navigate to Problems step
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      await user.click(screen.getByRole('button', { name: /next/i }));
      await user.click(screen.getByRole('button', { name: /next/i }));
    });

    test('renders department-specific problem sections', () => {
      expect(screen.getByText(/finance department/i)).toBeInTheDocument();
      expect(screen.getByText(/hr department/i)).toBeInTheDocument();
      expect(screen.getByText(/it department/i)).toBeInTheDocument();
      expect(screen.getByText(/customer service/i)).toBeInTheDocument();
      expect(screen.getByText(/operations/i)).toBeInTheDocument();
    });

    test('allows selecting departmental problems', async () => {
      const user = userEvent.setup();
      
      const financeProblems = screen.getAllByRole('checkbox');
      const firstProblem = financeProblems[0];
      
      await user.click(firstProblem);
      expect(firstProblem).toBeChecked();
    });

    test('allows entering additional challenges', async () => {
      const user = userEvent.setup();
      
      const additionalChallenges = screen.getByPlaceholderText(/describe additional challenges/i);
      await user.type(additionalChallenges, 'Additional challenge description');
      
      expect(additionalChallenges).toHaveValue('Additional challenge description');
    });
  });

  describe('Impact Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Navigate to Impact step
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      await user.click(screen.getByRole('button', { name: /next/i })); // Business Issue
      await user.click(screen.getByRole('button', { name: /next/i })); // Problems
      await user.click(screen.getByRole('button', { name: /next/i })); // Root Cause
      await user.click(screen.getByRole('button', { name: /next/i })); // Impact
    });

    test('renders hard costs input fields', () => {
      expect(screen.getByLabelText(/labor costs/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/error correction costs/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/system downtime costs/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/compliance penalties/i)).toBeInTheDocument();
    });

    test('renders soft costs selection fields', () => {
      expect(screen.getByLabelText(/employee frustration/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/customer satisfaction decline/i)).toBeInTheDocument();
    });

    test('calculates total hard costs automatically', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/labor costs/i), '100000');
      await user.type(screen.getByLabelText(/error correction costs/i), '50000');
      
      expect(screen.getByText(/total hard costs: \$150,000/i)).toBeInTheDocument();
    });
  });

  describe('Solution Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Navigate to Solution step - simplified for testing
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      for (let i = 0; i < 5; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
      }
    });

    test('renders solution capabilities section', () => {
      expect(screen.getByText(/solution capabilities needed/i)).toBeInTheDocument();
      expect(screen.getByText(/automate document processing/i)).toBeInTheDocument();
      expect(screen.getByText(/streamline approval workflows/i)).toBeInTheDocument();
    });

    test('renders differentiation requirements', () => {
      expect(screen.getByText(/differentiation requirements/i)).toBeInTheDocument();
      expect(screen.getByText(/industry-specific expertise/i)).toBeInTheDocument();
      expect(screen.getByText(/rapid implementation/i)).toBeInTheDocument();
    });

    test('renders ROI expectations fields', () => {
      expect(screen.getByLabelText(/target cost reduction/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target efficiency improvement/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expected payback period/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/target roi/i)).toBeInTheDocument();
    });

    test('renders success metrics section', () => {
      expect(screen.getByText(/success metrics/i)).toBeInTheDocument();
      expect(screen.getByText(/process cycle time reduction/i)).toBeInTheDocument();
      expect(screen.getByText(/error rate improvement/i)).toBeInTheDocument();
    });
  });

  describe('Decision Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Navigate to Decision step
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      for (let i = 0; i < 6; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
      }
    });

    test('renders decision makers fields', () => {
      expect(screen.getByLabelText(/economic buyer name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/economic buyer title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/budget authority/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/technical buyer name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/champion name/i)).toBeInTheDocument();
    });

    test('renders buying process section', () => {
      expect(screen.getByLabelText(/decision timeline/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/budget cycle/i)).toBeInTheDocument();
      expect(screen.getByText(/evaluation criteria/i)).toBeInTheDocument();
    });

    test('renders risks of inaction section', () => {
      expect(screen.getByText(/risks of inaction/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/continued cost escalation/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/employee attrition risk/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/estimated cost of inaction/i)).toBeInTheDocument();
    });

    test('allows entering decision maker information', async () => {
      const user = userEvent.setup();
      
      await user.type(screen.getByLabelText(/economic buyer name/i), 'Sarah Chen');
      await user.type(screen.getByLabelText(/economic buyer title/i), 'CEO');
      await user.type(screen.getByLabelText(/budget authority/i), '1000000');
      
      expect(screen.getByDisplayValue('Sarah Chen')).toBeInTheDocument();
      expect(screen.getByDisplayValue('CEO')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1000000')).toBeInTheDocument();
    });
  });

  describe('AI Assessment Step', () => {
    beforeEach(async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Navigate to AI Assessment step
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      for (let i = 0; i < 7; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
      }
    });

    test('renders technology landscape section', () => {
      expect(screen.getByText(/current technology landscape/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/primary erp/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/crm system/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/collaboration tools/i)).toBeInTheDocument();
    });

    test('renders AI readiness scoring section', () => {
      expect(screen.getByText(/ai readiness score/i)).toBeInTheDocument();
      expect(screen.getByText(/data availability and quality/i)).toBeInTheDocument();
      expect(screen.getByText(/system integration capability/i)).toBeInTheDocument();
      expect(screen.getByText(/technical team readiness/i)).toBeInTheDocument();
    });

    test('calculates total AI readiness score', () => {
      const rangeInputs = screen.getAllByRole('slider');
      expect(rangeInputs.length).toBeGreaterThan(0);
      expect(screen.getByText(/total ai readiness score: 0\/10/i)).toBeInTheDocument();
    });

    test('allows adding AI opportunities', async () => {
      const user = userEvent.setup();
      
      const addOpportunityButton = screen.getByRole('button', { name: /add opportunity/i });
      await user.click(addOpportunityButton);
      
      expect(screen.getByText(/opportunity 1/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/invoice processing automation/i)).toBeInTheDocument();
    });

    test('allows adding quick wins', async () => {
      const user = userEvent.setup();
      
      const addQuickWinButton = screen.getByRole('button', { name: /add quick win/i });
      await user.click(addQuickWinButton);
      
      expect(screen.getByPlaceholderText(/automated ticket routing/i)).toBeInTheDocument();
    });
  });

  describe('Profile Completion', () => {
    test('completes profile creation successfully', async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Fill out minimal required data
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      
      // Navigate through all steps
      for (let i = 0; i < 8; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
      }
      
      // Complete the profile
      const completeButton = screen.getByRole('button', { name: /create profile/i });
      await user.click(completeButton);
      
      await waitFor(() => {
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });

    test('generates markdown with comprehensive data', async () => {
      const { markdownService } = require('../../../services/markdownService');
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      // Fill comprehensive data
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      // Select business issues
      await user.click(screen.getByLabelText(/revenue growth pressure/i));
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      // Navigate through remaining steps and complete
      for (let i = 0; i < 6; i++) {
        await user.click(screen.getByRole('button', { name: /next/i }));
      }
      
      const completeButton = screen.getByRole('button', { name: /create profile/i });
      await user.click(completeButton);
      
      await waitFor(() => {
        expect(markdownService.generateMarkdown).toHaveBeenCalled();
        expect(mockOnComplete).toHaveBeenCalled();
      });
    });
  });

  describe('Navigation and UX', () => {
    test('allows navigation backward through steps', async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      await user.type(screen.getByLabelText(/company name/i), 'Test Corp');
      await user.click(screen.getByRole('button', { name: /next/i }));
      
      expect(screen.getByText(/business issue/i)).toBeInTheDocument();
      
      const backButton = screen.getByRole('button', { name: /back/i });
      await user.click(backButton);
      
      expect(screen.getByLabelText(/company name/i)).toBeInTheDocument();
    });

    test('displays progress indicator', () => {
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      expect(screen.getByText(/step 1 of 9/i)).toBeInTheDocument();
    });

    test('preserves form data when navigating between steps', async () => {
      const user = userEvent.setup();
      render(<ProfileWizard onComplete={mockOnComplete} />);
      
      const companyNameInput = screen.getByLabelText(/company name/i);
      await user.type(companyNameInput, 'Test Corp');
      
      await user.click(screen.getByRole('button', { name: /next/i }));
      await user.click(screen.getByRole('button', { name: /back/i }));
      
      expect(screen.getByDisplayValue('Test Corp')).toBeInTheDocument();
    });
  });
}); 