(Files content cropped to 300k characters, download full ingest to see more)
================================================
FILE: README.md
================================================
# Agentic AI Flow Visualizer & Business AI Advisory Platform

**🤖 AI Assistant Context:** This is a comprehensive business AI advisory platform built with Next.js, featuring ServiceNow agentic AI flow visualization, interactive AI transformation timelines, and client profile management with Value Selling Framework. The platform serves as a sophisticated lead-generation tool for AI advisory services, combining technical visualization capabilities with comprehensive business intelligence collection and strategic planning tools. Core technologies: Next.js 15, React 19, ReactFlow, Zustand, Dagre. Design inspired by ai-2027.com with modern dark themes and floating UI elements.

**🎯 Current State:** Fully functional three-feature platform with ServiceNow visualization, AI transformation timeline, and comprehensive client profile management system. Recent major additions include ProfileWizard with 8-step Value Selling Framework, structured markdown profile storage, realistic demo data system, and automatic timeline generation from client profiles. Architecture includes robust service layers (ProfileService, MarkdownService, DemoDataService) and comprehensive business intelligence capture. Ready for production testing and client demos.

**🚀 Next Steps:** Comprehensive testing strategy implementation using TDD, lead capture integration, industry-specific templates, export capabilities, and multi-platform connectors (Salesforce, Microsoft). Focus on converting profile users into advisory clients through sophisticated business intelligence and automated timeline generation.

## Project Overview

A Next.js application that serves three primary functions:

1. **ServiceNow Agentic AI Visualizer**: Transform ServiceNow agentic AI data into interactive flow diagrams
2. **AI Transformation Timeline**: Business advisory tool that generates personalized AI adoption roadmaps  
3. **Client Profile Management**: Comprehensive business intelligence system using Value Selling Framework to create client "digital twins"

The platform positions itself as a sophisticated lead-generation tool for AI advisory services, providing immediate value while capturing comprehensive business intelligence and converting prospects into advisory clients.

## Core Features

### 🔄 **ServiceNow Flow Visualization**
- **Interactive Node Graph**: Drag, zoom, and pan through complex AI workflows
- **Hierarchical Exploration**: Expand/collapse nodes to explore use cases → agents → tools
- **Dynamic Layouts**: Toggle between horizontal (LR) and vertical (TB) orientations
- **Real-time Collaboration**: Multiple layout options and live data refresh
- **Secure Integration**: Direct connection to ServiceNow instances with credential management

### 📈 **AI Transformation Timeline** (New Major Feature)
- **Business Profile Collection**: Multi-step form capturing company details, AI maturity, goals
- **Interactive Timeline**: Scroll-based journey through 6 transformation phases
- **Floating Metrics Widget**: Real-time KPIs that update based on scroll position (ai-2027.com inspired)
- **Dynamic Content Generation**: Personalized roadmaps based on industry and company size
- **ROI Projections**: Detailed investment and return calculations
- **Mobile-Responsive Design**: Optimized for all device types

### 👥 **Client Profile Management** (New Major Feature)
- **ProfileWizard**: 8-step guided form implementing Value Selling Framework methodology
- **Business Intelligence Capture**: Company overview, strategic issues, quantified impact analysis
- **Value Selling Framework**: Business Issues → Problems → Impact → Solution → Decision → AI Assessment
- **Structured Markdown Storage**: Prevents AI hallucinations while maintaining human readability
- **Demo Data System**: 4 realistic industry profiles (Technology, Manufacturing, Healthcare, Finance)
- **Automatic Timeline Generation**: Client profiles automatically populate personalized AI roadmaps
- **Opportunity Assessment**: AI readiness scoring and automation opportunity identification

### 🎨 **Design System (ai-2027.com Inspired)**
- **Dark Theme**: Modern #0a0e27 background with gradient accents
- **Floating UI Elements**: Metrics widget positioned absolutely with backdrop blur
- **Smooth Animations**: Scroll-based progress indicators and smooth transitions
- **Responsive Layout**: 2-column design with floating widget on desktop, stacked on mobile
- **Visual Storytelling**: Phase-based progression with icons and visual hierarchy

## Architecture Overview

### **Application Structure**
```
agentic-ai-flow/
├── app/
│   ├── components/                 # Core visualization components
│   │   ├── FlowVisualizer.js      # Main ServiceNow flow renderer
│   │   ├── ServiceNowConnector.js # Authentication and data fetching
│   │   └── nodes/                 # Custom node types
│   │       ├── AgentNode.js       # AI agent visualization
│   │       ├── ToolNode.js        # Tool/integration nodes
│   │       ├── TriggerNode.js     # Event trigger nodes
│   │       └── UseCaseNode.js     # Business use case nodes
│   ├── profiles/                  # Client Profile Management (NEW)
│   │   ├── page.js               # Profile dashboard & management
│   │   └── components/           
│   │       └── ProfileWizard.js  # 8-step Value Selling Framework form
│   ├── timeline/                  # AI Timeline feature
│   │   ├── page.js               # Main timeline page
│   │   ├── timeline.css          # Complete timeline styling
│   │   └── components/           
│   │       ├── BusinessProfileModal.js    # Multi-step business form
│   │       ├── TimelineSidebar.js        # Left navigation
│   │       ├── TimelineContent.js        # Main scrollable content
│   │       ├── MetricsWidget.js          # Floating metrics (ai-2027 style)
│   │       └── ...
│   ├── services/                  # Business Logic Layer (NEW)
│   │   ├── profileService.js     # Profile CRUD, timeline integration
│   │   ├── markdownService.js    # Structured markdown conversion
│   │   ├── demoDataService.js    # Realistic demo profile data
│   │   └── timelineService.js    # Timeline generation business logic
│   ├── api/                      # API Routes
│   │   ├── servicenow/           # ServiceNow integration
│   │   │   ├── fetch-agentic-data/ # Data retrieval
│   │   │   └── get-credentials/    # Credential management
│   │   └── timeline/             # Timeline API (NEW)
│   │       └── generate/         # Profile-to-timeline generation
│   ├── store/                    # State management
│   │   ├── useAgenticStore.js    # ServiceNow data & flow state
│   │   └── useBusinessProfileStore.js # Timeline data & business profiles
│   └── utils/                    # Utility functions
│       ├── layoutGraph.js        # Dagre layout engine
│       ├── transformAgenticData.js # Data transformation
│       ├── nodeUtils.js          # Node utilities & URL generation
│       └── validation.js         # Input validation & security (NEW)
└── public/images/               # Static assets
```

### **Key Technical Decisions**

#### **Layout Evolution**
- **Before**: 3-column fixed layout (sidebar | content | widget)
- **After**: 2-column with floating widget (sidebar | content + floating widget)
- **Benefits**: More content space, modern UI, ai-2027.com aesthetic

#### **Service Layer Architecture** (NEW)
- **ProfileService**: Profile CRUD operations, AI timeline integration, opportunity analysis
- **MarkdownService**: Converts profile data to/from structured markdown (prevents AI hallucinations)
- **DemoDataService**: Provides 4 realistic industry profiles for testing and demonstrations
- **TimelineService**: Business logic for generating AI adoption roadmaps from profile data
- **Separation of Concerns**: Business logic separated from UI components and state management

#### **State Management Strategy**
- **useAgenticStore**: ServiceNow data, connection details, flow visualization state
- **useBusinessProfileStore**: Business profiles, timeline data, scenario planning
- **Local Storage**: Client profiles persisted locally (ready for backend integration)
- **Separation of Concerns**: Clear boundaries between visualization, advisory, and profile features

#### **Component Architecture**
- **Floating Metrics Widget**: `position: fixed` with backdrop blur and responsive behavior
- **Scroll-Spy Navigation**: Timeline sidebar updates based on scroll position
- **Dynamic Content Generation**: Timeline phases generated based on business profile
- **Error Boundary Implementation**: Robust error handling throughout

## Recent Major Improvements

### **🎨 UI/UX Overhaul (ai-2027.com Inspired)**
- **Refined Dark Theme & Visual Language:** Implemented an updated dark theme with a sophisticated color palette, consistent spacing system, and typography for a premium enterprise aesthetic across the AI Transformation Timeline.
- **Modernized Timeline Navigation:** Overhauled the `TimelineSidebar` with icon-less navigation dots, a dynamic progress bar precisely connected to the active section, and improved visual hierarchy.
- **Polished Metrics Visualization:** Enhanced the floating `MetricsWidget` with a crisper progress ring, clearer trend indicators, and refined styling to align with the premium design.
- **Streamlined User Experience:** Improved page loading logic for the timeline, ensuring smoother transitions and more intentional display of profile forms.
- **Responsive Breakpoints**: Optimized for 1400px, 1200px, and 768px breakpoints
- **Smooth Animations**: Enhanced scroll interactions and component transitions

### **👥 Client Profile Management System** (NEW)
- **ProfileWizard Implementation**: 8-step guided form with Value Selling Framework
- **Service Layer Architecture**: Robust business logic separation (ProfileService, MarkdownService, DemoDataService)
- **Demo Data System**: 4 complete industry profiles (TechFlow Solutions, PrecisionParts Manufacturing, Regional Medical Center, Community Trust Bank)
- **Structured Markdown Storage**: Data integrity and AI hallucination prevention
- **Automatic Timeline Integration**: Profile data automatically populates AI roadmaps
- **Security Enhancements**: Input validation, rate limiting, and secure data handling

### **🔧 Technical Enhancements**
- **MetricsWidget Bug Fixes**: Resolved `TypeError` with phase title mapping
- **Improved Error Handling**: Added optional chaining and fallback values throughout
- **Performance Optimizations**: Minimized re-renders and optimized component updates
- **Code Organization**: Modular component structure with clear separation of concerns
- **Validation Layer**: Comprehensive input validation and sanitization across all forms

### **📊 Timeline Feature Completion**
- **6-Phase Journey**: Current State → Foundation → Implementation → Expansion → Optimization → Future State
- **Business Profile Integration**: Company size, industry, AI maturity level collection
- **ROI Calculations**: Investment projections from $250K to $3M+ with 425% total ROI
- **Dynamic Metrics**: Real-time KPIs that change based on current timeline section

## Data Flow & Integration

### **ServiceNow Integration**
1. **Secure Authentication**: API routes proxy all ServiceNow requests
2. **Data Transformation**: Convert ServiceNow JSON to React Flow nodes/edges
3. **Visual Rendering**: Dagre layout algorithm positions nodes intelligently
4. **Interactive Features**: Node expansion/collapse with real-time layout updates

### **Timeline Generation**
1. **Profile Collection**: Multi-step modal captures business requirements
2. **Data Processing**: Generate phase-specific initiatives, technologies, outcomes
3. **Visual Presentation**: Scroll-based journey with floating metrics
4. **Lead Capture**: Ready for contact form integration and follow-up

### **Profile Integration** (NEW)
1. **Value Selling Framework Collection**: 8-step ProfileWizard captures comprehensive business intelligence
2. **Structured Data Storage**: MarkdownService converts to structured format preventing AI hallucinations
3. **Opportunity Analysis**: ProfileService identifies automation opportunities and calculates ROI
4. **Automatic Timeline Generation**: Profile data automatically populates personalized AI roadmaps
5. **Demo Data Ready**: DemoDataService provides realistic testing scenarios across 4 industries

## Getting Started

### **Prerequisites**
- Node.js 18+
- ServiceNow instance with Agentic AI framework (for visualization features)
- Modern browser (Chrome, Firefox, Safari, Edge)

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd agentic-ai-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Usage Options**

#### **Option 1: ServiceNow Visualization**
1. Navigate to `http://localhost:3000`
2. Enter ServiceNow instance details
3. Connect and explore agentic AI flows
4. Use layout controls and node interactions

#### **Option 2: AI Timeline Planning**
1. Click "AI Timeline" button or go to `/timeline`
2. Complete business profile form
3. Generate personalized AI transformation roadmap
4. Explore phases and metrics

#### **Option 3: Client Profile Management** (NEW)
1. Click "Client Profiles" button or go to `/profiles`
2. Create new profile or load demo data (4 industry scenarios available)
3. Complete 8-step Value Selling Framework assessment
4. Generate automatic AI timeline from profile data
5. View comprehensive business intelligence and opportunity analysis

## Business Model & Lead Generation

### **Current Positioning**
- **Free Value-First Tool**: Timeline and profile assessment provide immediate business value
- **Comprehensive Lead Qualification**: Value Selling Framework captures detailed business intelligence
- **Client Digital Twins**: Structured markdown profiles create comprehensive client understanding
- **Advisory Upsell**: Natural progression from assessment to consulting engagement
- **Market Positioning**: Bridges technical capability with sophisticated business strategy and sales methodology

### **Ready for Integration**
- **Contact Forms**: Add lead capture at timeline completion
- **Email Marketing**: Integrate with SendGrid, Mailchimp for nurture campaigns
- **CRM Integration**: Connect to Salesforce, HubSpot for lead management
- **Analytics**: Google Analytics ready for user behavior tracking

## Next Development Priorities

### **🎯 Immediate (1-2 weeks)**
1. **Comprehensive Testing Strategy**: TDD implementation for ProfileService, DemoDataService, MarkdownService
2. **Lead Capture Integration**: Contact forms and email collection from profile assessments
3. **Export Capabilities**: PDF generation for timeline roadmaps and profile summaries
4. **Analytics Implementation**: User engagement and conversion tracking across all three features

### **🚀 Short-term (1-2 months)**
1. **Industry Templates**: Pre-built timelines for healthcare, finance, manufacturing
2. **Enhanced ROI Calculator**: More sophisticated financial modeling
3. **Multi-scenario Planning**: Conservative vs. aggressive vs. innovative paths

### **🌟 Long-term (3-6 months)**
1. **Multi-platform Connectors**: Salesforce, Microsoft 365, Azure integration
2. **AI-Powered Recommendations**: Smart suggestions based on industry patterns
3. **Digital Twin Capabilities**: Business process mapping and optimization

## Technical Considerations

### **Performance**
- React Flow optimized for large datasets
- Zustand for minimal re-renders
- CSS optimizations for smooth animations
- Mobile-responsive design patterns

### **Security**
- Server-side credential handling
- API route proxy layer
- No client-side authentication exposure
- Secure data transformation pipeline

### **Scalability**
- Modular component architecture
- Extensible state management
- Clear separation between visualization and advisory features
- Ready for multi-tenant deployment

## Development Guidelines

### **Code Standards**
- Functional components with hooks
- Consistent naming conventions
- Modular 200-line component limit
- Comprehensive error handling
- JSDoc for complex functions

### **Testing Strategy**
- Unit tests for utility functions
- Integration tests for API routes
- Component tests for user interactions
- E2E tests for critical flows

### **Deployment Considerations**
- Next.js optimized build
- Environment variable management
- CDN-ready static assets
- Production monitoring ready

---

**📞 Ready for Business Development**: The platform successfully combines technical demonstration, strategic planning tools, and comprehensive business intelligence collection, providing a sophisticated foundation for AI consulting lead generation and client engagement. With the addition of the Value Selling Framework-based profile system, the platform now captures the depth of business intelligence needed for high-value advisory relationships while providing immediate value through automated timeline generation and opportunity analysis.

**🧪 Testing Status**: Comprehensive test suite implemented with 45 tests passing (ProfileService: 25, MarkdownService: 20). TDD approach established for future development. See TESTING_GUIDE.md for complete testing documentation and working with AI assistants.



================================================
FILE: CLIENT_PROFILE_SYSTEM.md
================================================
# Client Profile Management System

## Overview

The Client Profile Management System is a comprehensive solution for capturing business intelligence through guided forms and storing it as structured markdown files. This system helps consultants create detailed client "digital twins" using the Value Selling Framework, with the markdown profiles later parsed by AI to suggest automation opportunities and generate strategic recommendations.

## Key Features

### ✅ **Anti-Hallucination Design**
- **Structured Markdown Storage**: All client data is stored in a standardized markdown format that prevents AI hallucinations
- **Guided Data Capture**: Step-by-step wizard ensures consistent, complete data collection
- **Validation & Parsing**: Built-in validation ensures data integrity and parseability

### ✅ **Value Selling Framework Implementation**
- **Complete Sales Methodology**: Implements all 6 stages of the Value Selling Framework
- **Business Issue Identification**: Captures C-level strategic priorities and concerns
- **Problem/Challenge Mapping**: Department-specific operational issues with quantified impact
- **Root Cause Analysis**: Systematic identification of underlying causes
- **Impact Quantification**: Hard and soft cost calculations with automatic totaling
- **Solution Requirements**: Capability mapping and differentiation requirements
- **Decision Process Mapping**: Stakeholder identification and buying process documentation

### ✅ **AI/Automation Assessment**
- **Technology Landscape**: Current ERP, CRM, collaboration tools assessment
- **AI Readiness Scoring**: 5-criteria scoring system (0-10 total)
- **Opportunity Prioritization**: Structured opportunity assessment with impact/effort matrix
- **Quick Wins Identification**: 0-6 month implementation opportunities

### ✅ **Comprehensive Testing**
- **60% Test Coverage Threshold**: Branch, function, line, and statement coverage
- **Component Testing**: React Testing Library integration tests
- **Service Testing**: Complete ProfileService and MarkdownService test suites
- **TDD Methodology**: Tests written first, code implemented to pass

## System Architecture

```
Client Profile System
├── Frontend Components
│   ├── ProfileWizard (9-step guided form)
│   ├── ProfileViewer (markdown preview)
│   └── ProfileManager (CRUD operations)
├── Services Layer
│   ├── ProfileService (business logic)
│   ├── MarkdownService (parsing/generation)
│   └── TimelineService (AI integration)
├── Data Storage
│   ├── Structured JSON (form data)
│   └── Markdown Files (client profiles)
└── Testing Infrastructure
    ├── Unit Tests (services)
    ├── Integration Tests (components)
    └── E2E Tests (user flows)
```

## Profile Structure

### 1. Company Overview
- Company name, industry, size
- Annual revenue, employee count
- Primary location

### 2. Value Selling Framework

#### Business Issue (Strategic Level)
- Revenue Growth Pressure
- Cost Reduction Mandate  
- Operational Efficiency
- Customer Experience
- Digital Transformation
- Regulatory Compliance
- Competitive Pressure

#### Problems/Challenges (Operational Level)
**Finance Department:**
- Manual invoice processing timelines
- Error rates in financial processes
- Month-end close duration

**HR Department:**
- Employee onboarding timelines
- Manual resume screening
- Employee turnover rates

**IT Department:**
- Ticket resolution times
- Manual intervention requirements
- System provisioning duration

**Customer Service:**
- Response times
- First contact resolution rates
- Customer satisfaction scores

**Operations:**
- Process cycle times
- Manual process percentages
- Quality/error rates

#### Root Cause Analysis
- Legacy systems with poor integration
- Manual, paper-based processes
- Lack of real-time data visibility
- Insufficient automation
- Skills gap in technology
- Siloed departments

#### Impact Quantification
**Hard Costs (Annual):**
- Labor costs from manual processes
- Error correction costs
- System downtime costs
- Compliance penalties/risk
- **Auto-calculated total**

**Soft Costs:**
- Employee frustration/turnover impact
- Customer satisfaction decline
- Competitive disadvantage
- Missed opportunities/growth

#### Solution Requirements
**Capabilities Needed:**
- Automate document processing
- Streamline approval workflows
- Provide real-time dashboards
- Integrate disconnected systems
- Enable self-service capabilities
- Improve data accuracy
- Reduce manual handoffs

**Differentiation Requirements:**
- Industry-specific expertise
- Rapid implementation (< 6 months)
- No-code/low-code platform
- Strong integration capabilities
- Proven ROI in similar companies
- Comprehensive support/training

**Value/ROI Expectations:**
- Target cost reduction
- Target efficiency improvement
- Expected payback period
- Target ROI percentage
- Time to first value

**Success Metrics:**
- Process cycle time reduction
- Error rate improvement
- Cost per transaction reduction
- Employee productivity increase
- Customer satisfaction improvement
- Revenue impact

#### Decision Process
**Key Decision Makers:**
- Economic Buyer (name, title, budget authority)
- Technical Buyer (name, title)
- Champion (name, title)
- Influencers

**Buying Process:**
- Decision timeline
- Budget cycle
- Evaluation criteria
- Other requirements

**Risks of Inaction:**
- Continued cost escalation (annual)
- Employee attrition risk
- 3-year cost of inaction
- Competitive disadvantage
- Customer satisfaction decline
- Regulatory compliance risk

### 3. AI/Automation Opportunity Assessment

#### Current Technology Landscape
- Primary ERP system
- CRM system
- Collaboration tools
- Integration maturity level
- Data quality assessment
- Current automation description

#### AI Readiness Score (0-10)
- Data availability and quality (0-2)
- System integration capability (0-2)
- Technical team readiness (0-2)
- Leadership support (0-2)
- Change management capability (0-2)

#### Top AI Opportunities (Prioritized)
For each opportunity:
- Name and description
- Department
- Specific process
- Current state
- Proposed AI solution
- Estimated annual impact ($)
- Implementation effort (Low/Medium/High)
- Timeline
- Priority score (1-10)

#### Quick Wins (0-6 months)
- Opportunity name
- Estimated impact ($)
- Implementation timeline

## Usage Guide

### For Consultants

#### Creating a New Client Profile
1. Navigate to `/profiles`
2. Click "Create New Profile"
3. Complete the 9-step wizard:
   - Company Overview
   - Business Issue
   - Problems/Challenges
   - Root Cause
   - Impact
   - Solution
   - Decision
   - AI Assessment
   - Summary

#### Best Practices
- **Be Specific**: Use actual numbers and timeframes when possible
- **Quantify Everything**: Always try to attach dollar amounts and percentages
- **Document Sources**: Note where information came from in the notes section
- **Regular Updates**: Revisit profiles as new information becomes available
- **Stakeholder Validation**: Review completed profiles with client stakeholders

### For AI Systems

#### Reading Client Profiles
```javascript
import { markdownService } from './services/markdownService';

// Parse existing markdown profile
const profileData = markdownService.parseMarkdown(markdownContent);

// Access structured data
const companyName = profileData.companyName;
const businessIssues = profileData.valueSellingFramework.businessIssues;
const aiOpportunities = profileData.aiOpportunityAssessment.opportunities;
```

#### Generating Recommendations
The structured markdown format enables AI systems to:
- Identify automation opportunities based on manual processes
- Calculate ROI based on quantified impacts
- Suggest implementation priorities based on effort/impact scores
- Generate proposal content using stakeholder information
- Create timeline recommendations based on decision timelines

## Technical Implementation

### Core Components

#### ProfileWizard.js
Multi-step form component with:
- 9 guided steps
- Form validation
- Data persistence
- Progress tracking
- Navigation controls
- Auto-save functionality

#### MarkdownService.js
Service for markdown operations:
- `generateMarkdown()` - Convert form data to structured markdown
- `parseMarkdown()` - Parse markdown back to structured data
- `extractSection()` - Extract specific sections
- `sanitizeString()` - Clean data for markdown format

#### ProfileService.js
Business logic service:
- `createProfile()` - Create new profiles
- `updateProfile()` - Update existing profiles  
- `generateTimelineFromProfile()` - AI integration
- `calculateAIMaturity()` - Readiness scoring
- `identifyRiskFactors()` - Risk assessment

### Testing Strategy

#### Unit Tests
- **ProfileService**: 25 tests covering all business logic
- **MarkdownService**: 20 tests covering parsing/generation
- **Utility Functions**: Data validation and transformation

#### Integration Tests
- **API Routes**: Profile creation and retrieval
- **Service Integration**: Cross-service communication
- **Data Flow**: End-to-end data processing

#### Component Tests  
- **ProfileWizard**: User interactions and form validation
- **Form Steps**: Individual step functionality
- **Navigation**: Step transitions and data persistence

### Data Flow

```
User Input → ProfileWizard → ProfileService → MarkdownService → Storage
     ↓              ↓              ↓              ↓              ↓
Form Validation → Business Logic → Markdown Gen → File System → Retrieval
     ↓              ↓              ↓              ↓              ↓
Error Handling → Data Transform → Parsing → AI Processing → Recommendations
```

## Example Generated Markdown

```markdown
# Client Profile: Acme Manufacturing Corp

## Company Overview
- **Company Name**: Acme Manufacturing Corp
- **Industry**: Manufacturing
- **Size**: Mid-Market (500-5K)
- **Annual Revenue**: $50,000,000
- **Employee Count**: 1,200
- **Primary Location**: Chicago, IL

---

## Value Selling Framework

### 1. Business Issue
**High-level strategic priority or C-level concern:**
- [x] Cost Reduction Mandate
- [x] Operational Efficiency
- [x] Digital Transformation

**Details**: CEO mandate to reduce operational costs by 15% while improving quality and customer satisfaction.

### 2. Problems / Challenges
**Specific operational issues identified:**

#### Finance Department
- [x] Manual invoice processing taking 5-7 days
- [x] 12% error rate in financial processes
- [x] Month-end close takes 8 days

#### Operations
- [x] Process cycle time: 14 days
- [x] 65% manual processes
- [x] Quality issues: 8% error rate

**Additional Challenges**: Lack of real-time visibility into production status and inventory levels.

### 3. Root Cause
**Why do these challenges exist?**
- [x] Legacy systems with poor integration
- [x] Manual, paper-based processes
- [x] Lack of real-time data visibility
- [x] Insufficient automation

**Details**: 15-year-old ERP system with limited integration capabilities and heavy reliance on spreadsheets and manual data entry.

### 4. Impact
**Quantified effects:**

#### Hard Costs (Annual)
- Labor costs from manual processes: $1,200,000
- Error correction costs: $180,000
- System downtime costs: $75,000
- Compliance penalties/risk: $25,000
- **Total Hard Costs**: $1,480,000

#### Soft Costs
- Employee frustration/turnover impact: High
- Customer satisfaction decline: Medium
- Competitive disadvantage: High
- Missed opportunities/growth: High

### 5. Solution
**Capabilities needed to solve these challenges:**
- [x] Automate document processing
- [x] Streamline approval workflows
- [x] Provide real-time dashboards
- [x] Integrate disconnected systems
- [x] Improve data accuracy

**Differentiation Requirements:**
- [x] Industry-specific expertise
- [x] Rapid implementation (< 6 months)
- [x] Strong integration capabilities
- [x] Proven ROI in similar companies

**Value / ROI Expectations:**
- Target cost reduction: 25% or $370K annually
- Target efficiency improvement: 40%
- Expected payback period: 18 months
- Target ROI: 300%
- Time to first value: 4 months

**Success Metrics:**
- [x] Process cycle time reduction
- [x] Error rate improvement
- [x] Cost per transaction reduction
- [x] Employee productivity increase

**Specific Targets**: Reduce processing time from 14 days to 3 days, decrease error rate from 8% to 2%, increase throughput by 40%.

### 6. Decision
**Decision makers and buying process:**

#### Key Decision Makers
**Economic Buyer**: Sarah Chen (CEO) - Budget Authority: $2,000,000
**Technical Buyer**: Mike Rodriguez (CTO)
**Champion**: Lisa Park (VP Operations)
**Influencers**: Head of Customer Success, Engineering Manager

#### Buying Process
- **Decision timeline**: 8 months
- **Budget cycle**: Q1 planning cycle
- **Evaluation criteria**:
  - Technical fit
  - Cost/ROI
  - Vendor reputation
  - Implementation timeline
  - Support quality

#### Risks of Inaction
- **Continued cost escalation**: $1,480,000 annually
- **Employee attrition risk**: High
- **Estimated cost of inaction (3 years)**: $4,440,000
- **Competitive disadvantage**: Losing market share to more agile competitors
- **Customer satisfaction decline**: Risk of losing key accounts due to delivery delays
- **Regulatory compliance risk**: Increasing audit findings and potential penalties

---

## AI/Automation Opportunity Assessment

### Current Technology Landscape
- **Primary ERP**: Legacy system (15 years old)
- **CRM System**: Salesforce
- **Collaboration Tools**: Microsoft Teams, email
- **Integration Maturity**: Basic
- **Data Quality**: Fair
- **Current Automation**: Basic email notifications, some Excel macros

### AI Readiness Score
- **Data availability and quality**: 1/2
- **System integration capability**: 1/2
- **Technical team readiness**: 2/2
- **Leadership support**: 2/2
- **Change management capability**: 1/2

**Total AI Readiness Score: 7/10**

### Top AI Opportunities (Prioritized)

#### 1. Invoice Processing Automation
- **Department**: Finance
- **Process**: Accounts Payable processing
- **Current State**: Manual data entry from paper/PDF invoices
- **AI Solution**: OCR + machine learning for automated invoice processing
- **Estimated Impact**: $180,000
- **Implementation Effort**: Medium
- **Timeline**: 3 months
- **Priority Score**: 9/10

#### 2. Production Planning Optimization
- **Department**: Operations  
- **Process**: Production scheduling
- **Current State**: Manual scheduling using spreadsheets
- **AI Solution**: AI-powered demand forecasting and production optimization
- **Estimated Impact**: $240,000
- **Implementation Effort**: High
- **Timeline**: 6 months
- **Priority Score**: 8/10

### Quick Wins (0-6 months)
1. **Automated invoice routing** - Impact: $25,000 - Timeline: 1 month
2. **Inventory alerts automation** - Impact: $15,000 - Timeline: 2 months
3. **Order status notifications** - Impact: $10,000 - Timeline: 1 month

---

## Summary & Next Steps

### Executive Summary
**Current State**: Manufacturing company with $1.48M in annual waste due to manual processes, legacy systems, and operational inefficiencies.

**Recommended Approach**: Phased automation implementation starting with high-impact, low-effort opportunities in finance and operations.

**Expected Value**: 
- Total 3-year benefit: $3,600,000
- Investment required: $800,000
- Net ROI: 350%
- Payback period: 18 months

### Immediate Next Steps
1. [ ] Schedule technical architecture review - Mike Rodriguez - March 15
2. [ ] Prepare detailed ROI analysis - Finance Team - March 22  
3. [ ] Vendor evaluation kickoff - Lisa Park - April 1

### Notes & Additional Context
Strong executive sponsorship with CEO mandate driving urgency. Technical team is capable but needs external expertise for implementation. Budget approved in Q1 cycle with flexibility for additional investment if ROI is proven.

---

*Profile created on: March 1, 2024*
*Last updated: March 1, 2024*  
*Created by: John Smith, Senior Consultant*
```

## Future Enhancements

### Planned Features
- **AI Integration**: Automated opportunity identification from profile data
- **Competitive Analysis**: Industry benchmarking and comparison
- **ROI Calculator**: Dynamic financial modeling
- **Proposal Generator**: Automated proposal creation from profiles
- **Pipeline Management**: Sales opportunity tracking
- **Team Collaboration**: Multi-user editing and commenting

### API Integration Opportunities
- **CRM Integration**: Sync with Salesforce, HubSpot
- **Financial Tools**: Connect with budgeting and forecasting systems
- **Industry Data**: Market research and benchmarking APIs
- **AI Services**: Enhanced opportunity identification and recommendations

## Conclusion

The Client Profile Management System provides a comprehensive, structured approach to capturing and leveraging client business intelligence. By combining the proven Value Selling Framework with modern AI capabilities and rigorous testing practices, it enables consultants to create detailed "digital twins" of their clients while maintaining data integrity and preventing AI hallucinations.

The system's markdown-based storage format ensures that client profiles remain parseable and actionable for AI systems while providing a human-readable format for consultants and stakeholders. 


================================================
FILE: next.config.js
================================================
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = nextConfig; 


================================================
FILE: package.json
================================================
{
  "name": "agentic-ai-flow",
  "version": "1.0.0",
  "description": "A Next.js application for visualizing ServiceNow agentic AI data as interactive flow diagrams",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "clean": "rm -rf .next out",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "jest --ci --coverage --maxWorkers=2"
  },
  "keywords": [
    "servicenow",
    "agentic-ai",
    "flow-visualization",
    "react-flow",
    "next.js"
  ],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "dagre": "^0.8.5",
    "lucide-react": "^0.511.0",
    "nanoid": "^5.1.5",
    "next": "^15.2.4",
    "react": "^19.1.0",
    "react-dom": "^19.1.0",
    "reactflow": "^11.11.4",
    "zustand": "^5.0.3"
  },
  "devDependencies": {
    "@next/swc-win32-x64-msvc": "^15.4.0",
    "@swc/core": "^1.11.29",
    "@swc/jest": "^0.2.38",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/jest": "^29.5.14",
    "babel-jest": "^30.0.0-beta.3",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^30.0.0-beta.3"
  }
}



================================================
FILE: project-summary.md
================================================
Directory structure:
└── sgclasher-agentic-ai-flow/
    ├── README.md
    ├── CLIENT_PROFILE_SYSTEM.md
    ├── TESTING_GUIDE.md
    ├── TESTING_WORKFLOW.md
    ├── app/
    │   ├── layout.js
    │   ├── page.js
    │   ├── api/
    │   │   ├── servicenow/
    │   │   │   ├── route.js
    │   │   │   ├── fetch-agentic-data/
    │   │   │   │   └── route.js
    │   │   │   └── get-credentials/
    │   │   │       └── route.js
    │   │   └── timeline/
    │   │       └── generate/
    │   │           └── route.js
    │   ├── components/
    │   │   ├── FlowVisualizer.js
    │   │   ├── NodeIcons.js
    │   │   ├── ServiceNowConnector.js
    │   │   ├── flow/
    │   │   │   └── FlowCanvas.js
    │   │   └── nodes/
    │   │       ├── AgentNode.js
    │   │       ├── ToolNode.js
    │   │       ├── TriggerNode.js
    │   │       └── UseCaseNode.js
    │   ├── hooks/
    │   │   ├── useFlowData.js
    │   │   └── useFlowLayout.js
    │   ├── profiles/
    │   │   ├── page.js
    │   │   ├── [id]/
    │   │   │   └── page.js
    │   │   └── components/
    │   │       └── ProfileWizard.js
    │   ├── services/
    │   │   ├── demoDataService.js
    │   │   ├── markdownService.js
    │   │   ├── profileService.js
    │   │   └── timelineService.js
    │   ├── store/
    │   │   ├── useAgenticStore.js
    │   │   └── useBusinessProfileStore.js
    │   ├── timeline/
    │   │   ├── README.md
    │   │   ├── layout.js
    │   │   ├── page.js
    │   │   └── components/
    │   │       ├── BusinessProfileForm.js
    │   │       ├── BusinessProfileModal.js
    │   │       ├── MetricsCards.js
    │   │       ├── MetricsWidget.js
    │   │       ├── ScenarioSelector.js
    │   │       ├── TimelineContent.js
    │   │       ├── TimelineHeader.js
    │   │       ├── TimelineSidebar.js
    │   │       └── TimelineVisualization.js
    │   └── utils/
    │       ├── layoutGraph.js
    │       ├── nodeUtils.js
    │       ├── transformAgenticData.js
    │       └── validation.js
    └── public/

================================================
FILE: README.md
================================================
# Agentic AI Flow Visualizer & Business AI Advisory Platform

**🤖 AI Assistant Context:** This is a comprehensive business AI advisory platform built with Next.js, featuring ServiceNow agentic AI flow visualization, interactive AI transformation timelines, and client profile management with Value Selling Framework. The platform serves as a sophisticated lead-generation tool for AI advisory services, combining technical visualization capabilities with comprehensive business intelligence collection and strategic planning tools. Core technologies: Next.js 15, React 19, ReactFlow, Zustand, Dagre. Design inspired by ai-2027.com with modern dark themes and floating UI elements.

**🎯 Current State:** Fully functional three-feature platform with ServiceNow visualization, AI transformation timeline, and comprehensive client profile management system. Recent major additions include ProfileWizard with 8-step Value Selling Framework, structured markdown profile storage, realistic demo data system, and automatic timeline generation from client profiles. Architecture includes robust service layers (ProfileService, MarkdownService, DemoDataService) and comprehensive business intelligence capture. Ready for production testing and client demos.

**🚀 Next Steps:** Comprehensive testing strategy implementation using TDD, lead capture integration, industry-specific templates, export capabilities, and multi-platform connectors (Salesforce, Microsoft). Focus on converting profile users into advisory clients through sophisticated business intelligence and automated timeline generation.

## Project Overview

A Next.js application that serves three primary functions:

1. **ServiceNow Agentic AI Visualizer**: Transform ServiceNow agentic AI data into interactive flow diagrams
2. **AI Transformation Timeline**: Business advisory tool that generates personalized AI adoption roadmaps  
3. **Client Profile Management**: Comprehensive business intelligence system using Value Selling Framework to create client "digital twins"

The platform positions itself as a sophisticated lead-generation tool for AI advisory services, providing immediate value while capturing comprehensive business intelligence and converting prospects into advisory clients.

## Core Features

### 🔄 **ServiceNow Flow Visualization**
- **Interactive Node Graph**: Drag, zoom, and pan through complex AI workflows
- **Hierarchical Exploration**: Expand/collapse nodes to explore use cases → agents → tools
- **Dynamic Layouts**: Toggle between horizontal (LR) and vertical (TB) orientations
- **Real-time Collaboration**: Multiple layout options and live data refresh
- **Secure Integration**: Direct connection to ServiceNow instances with credential management

### 📈 **AI Transformation Timeline** (New Major Feature)
- **Business Profile Collection**: Multi-step form capturing company details, AI maturity, goals
- **Interactive Timeline**: Scroll-based journey through 6 transformation phases
- **Floating Metrics Widget**: Real-time KPIs that update based on scroll position (ai-2027.com inspired)
- **Dynamic Content Generation**: Personalized roadmaps based on industry and company size
- **ROI Projections**: Detailed investment and return calculations
- **Mobile-Responsive Design**: Optimized for all device types

### 👥 **Client Profile Management** (New Major Feature)
- **ProfileWizard**: 8-step guided form implementing Value Selling Framework methodology
- **Business Intelligence Capture**: Company overview, strategic issues, quantified impact analysis
- **Value Selling Framework**: Business Issues → Problems → Impact → Solution → Decision → AI Assessment
- **Structured Markdown Storage**: Prevents AI hallucinations while maintaining human readability
- **Demo Data System**: 4 realistic industry profiles (Technology, Manufacturing, Healthcare, Finance)
- **Automatic Timeline Generation**: Client profiles automatically populate personalized AI roadmaps
- **Opportunity Assessment**: AI readiness scoring and automation opportunity identification

### 🎨 **Design System (ai-2027.com Inspired)**
- **Dark Theme**: Modern #0a0e27 background with gradient accents
- **Floating UI Elements**: Metrics widget positioned absolutely with backdrop blur
- **Smooth Animations**: Scroll-based progress indicators and smooth transitions
- **Responsive Layout**: 2-column design with floating widget on desktop, stacked on mobile
- **Visual Storytelling**: Phase-based progression with icons and visual hierarchy

## Architecture Overview

### **Application Structure**
```
agentic-ai-flow/
├── app/
│   ├── components/                 # Core visualization components
│   │   ├── FlowVisualizer.js      # Main ServiceNow flow renderer
│   │   ├── ServiceNowConnector.js # Authentication and data fetching
│   │   └── nodes/                 # Custom node types
│   │       ├── AgentNode.js       # AI agent visualization
│   │       ├── ToolNode.js        # Tool/integration nodes
│   │       ├── TriggerNode.js     # Event trigger nodes
│   │       └── UseCaseNode.js     # Business use case nodes
│   ├── profiles/                  # Client Profile Management (NEW)
│   │   ├── page.js               # Profile dashboard & management
│   │   └── components/           
│   │       └── ProfileWizard.js  # 8-step Value Selling Framework form
│   ├── timeline/                  # AI Timeline feature
│   │   ├── page.js               # Main timeline page
│   │   ├── timeline.css          # Complete timeline styling
│   │   └── components/           
│   │       ├── BusinessProfileModal.js    # Multi-step business form
│   │       ├── TimelineSidebar.js        # Left navigation
│   │       ├── TimelineContent.js        # Main scrollable content
│   │       ├── MetricsWidget.js          # Floating metrics (ai-2027 style)
│   │       └── ...
│   ├── services/                  # Business Logic Layer (NEW)
│   │   ├── profileService.js     # Profile CRUD, timeline integration
│   │   ├── markdownService.js    # Structured markdown conversion
│   │   ├── demoDataService.js    # Realistic demo profile data
│   │   └── timelineService.js    # Timeline generation business logic
│   ├── api/                      # API Routes
│   │   ├── servicenow/           # ServiceNow integration
│   │   │   ├── fetch-agentic-data/ # Data retrieval
│   │   │   └── get-credentials/    # Credential management
│   │   └── timeline/             # Timeline API (NEW)
│   │       └── generate/         # Profile-to-timeline generation
│   ├── store/                    # State management
│   │   ├── useAgenticStore.js    # ServiceNow data & flow state
│   │   └── useBusinessProfileStore.js # Timeline data & business profiles
│   └── utils/                    # Utility functions
│       ├── layoutGraph.js        # Dagre layout engine
│       ├── transformAgenticData.js # Data transformation
│       ├── nodeUtils.js          # Node utilities & URL generation
│       └── validation.js         # Input validation & security (NEW)
└── public/images/               # Static assets
```

### **Key Technical Decisions**

#### **Layout Evolution**
- **Before**: 3-column fixed layout (sidebar | content | widget)
- **After**: 2-column with floating widget (sidebar | content + floating widget)
- **Benefits**: More content space, modern UI, ai-2027.com aesthetic

#### **Service Layer Architecture** (NEW)
- **ProfileService**: Profile CRUD operations, AI timeline integration, opportunity analysis
- **MarkdownService**: Converts profile data to/from structured markdown (prevents AI hallucinations)
- **DemoDataService**: Provides 4 realistic industry profiles for testing and demonstrations
- **TimelineService**: Business logic for generating AI adoption roadmaps from profile data
- **Separation of Concerns**: Business logic separated from UI components and state management

#### **State Management Strategy**
- **useAgenticStore**: ServiceNow data, connection details, flow visualization state
- **useBusinessProfileStore**: Business profiles, timeline data, scenario planning
- **Local Storage**: Client profiles persisted locally (ready for backend integration)
- **Separation of Concerns**: Clear boundaries between visualization, advisory, and profile features

#### **Component Architecture**
- **Floating Metrics Widget**: `position: fixed` with backdrop blur and responsive behavior
- **Scroll-Spy Navigation**: Timeline sidebar updates based on scroll position
- **Dynamic Content Generation**: Timeline phases generated based on business profile
- **Error Boundary Implementation**: Robust error handling throughout

## Recent Major Improvements

### **🎨 UI/UX Overhaul (ai-2027.com Inspired)**
- **Floating Metrics Widget**: Replaced fixed 3-column layout with modern floating design
- **Dark Theme Consistency**: Unified #0a0e27 background across all timeline components
- **Responsive Breakpoints**: Optimized for 1400px, 1200px, and 768px breakpoints
- **Smooth Animations**: Enhanced scroll interactions and component transitions

### **👥 Client Profile Management System** (NEW)
- **ProfileWizard Implementation**: 8-step guided form with Value Selling Framework
- **Service Layer Architecture**: Robust business logic separation (ProfileService, MarkdownService, DemoDataService)
- **Demo Data System**: 4 complete industry profiles (TechFlow Solutions, PrecisionParts Manufacturing, Regional Medical Center, Community Trust Bank)
- **Structured Markdown Storage**: Data integrity and AI hallucination prevention
- **Automatic Timeline Integration**: Profile data automatically populates AI roadmaps
- **Security Enhancements**: Input validation, rate limiting, and secure data handling

### **🔧 Technical Enhancements**
- **MetricsWidget Bug Fixes**: Resolved `TypeError` with phase title mapping
- **Improved Error Handling**: Added optional chaining and fallback values throughout
- **Performance Optimizations**: Minimized re-renders and optimized component updates
- **Code Organization**: Modular component structure with clear separation of concerns
- **Validation Layer**: Comprehensive input validation and sanitization across all forms

### **📊 Timeline Feature Completion**
- **6-Phase Journey**: Current State → Foundation → Implementation → Expansion → Optimization → Future State
- **Business Profile Integration**: Company size, industry, AI maturity level collection
- **ROI Calculations**: Investment projections from $250K to $3M+ with 425% total ROI
- **Dynamic Metrics**: Real-time KPIs that change based on current timeline section

## Data Flow & Integration

### **ServiceNow Integration**
1. **Secure Authentication**: API routes proxy all ServiceNow requests
2. **Data Transformation**: Convert ServiceNow JSON to React Flow nodes/edges
3. **Visual Rendering**: Dagre layout algorithm positions nodes intelligently
4. **Interactive Features**: Node expansion/collapse with real-time layout updates

### **Timeline Generation**
1. **Profile Collection**: Multi-step modal captures business requirements
2. **Data Processing**: Generate phase-specific initiatives, technologies, outcomes
3. **Visual Presentation**: Scroll-based journey with floating metrics
4. **Lead Capture**: Ready for contact form integration and follow-up

### **Profile Integration** (NEW)
1. **Value Selling Framework Collection**: 8-step ProfileWizard captures comprehensive business intelligence
2. **Structured Data Storage**: MarkdownService converts to structured format preventing AI hallucinations
3. **Opportunity Analysis**: ProfileService identifies automation opportunities and calculates ROI
4. **Automatic Timeline Generation**: Profile data automatically populates personalized AI roadmaps
5. **Demo Data Ready**: DemoDataService provides realistic testing scenarios across 4 industries

## Getting Started

### **Prerequisites**
- Node.js 18+
- ServiceNow instance with Agentic AI framework (for visualization features)
- Modern browser (Chrome, Firefox, Safari, Edge)

### **Installation**
```bash
# Clone the repository
git clone <repository-url>
cd agentic-ai-flow

# Install dependencies
npm install

# Start development server
npm run dev
```

### **Usage Options**

#### **Option 1: ServiceNow Visualization**
1. Navigate to `http://localhost:3000`
2. Enter ServiceNow instance details
3. Connect and explore agentic AI flows
4. Use layout controls and node interactions

#### **Option 2: AI Timeline Planning**
1. Click "AI Timeline" button or go to `/timeline`
2. Complete business profile form
3. Generate personalized AI transformation roadmap
4. Explore phases and metrics

#### **Option 3: Client Profile Management** (NEW)
1. Click "Client Profiles" button or go to `/profiles`
2. Create new profile or load demo data (4 industry scenarios available)
3. Complete 8-step Value Selling Framework assessment
4. Generate automatic AI timeline from profile data
5. View comprehensive business intelligence and opportunity analysis

## Business Model & Lead Generation

### **Current Positioning**
- **Free Value-First Tool**: Timeline and profile assessment provide immediate business value
- **Comprehensive Lead Qualification**: Value Selling Framework captures detailed business intelligence
- **Client Digital Twins**: Structured markdown profiles create comprehensive client understanding
- **Advisory Upsell**: Natural progression from assessment to consulting engagement
- **Market Positioning**: Bridges technical capability with sophisticated business strategy and sales methodology

### **Ready for Integration**
- **Contact Forms**: Add lead capture at timeline completion
- **Email Marketing**: Integrate with SendGrid, Mailchimp for nurture campaigns
- **CRM Integration**: Connect to Salesforce, HubSpot for lead management
- **Analytics**: Google Analytics ready for user behavior tracking

## Next Development Priorities

### **🎯 Immediate (1-2 weeks)**
1. **Comprehensive Testing Strategy**: TDD implementation for ProfileService, DemoDataService, MarkdownService
2. **Lead Capture Integration**: Contact forms and email collection from profile assessments
3. **Export Capabilities**: PDF generation for timeline roadmaps and profile summaries
4. **Analytics Implementation**: User engagement and conversion tracking across all three features

### **🚀 Short-term (1-2 months)**
1. **Industry Templates**: Pre-built timelines for healthcare, finance, manufacturing
2. **Enhanced ROI Calculator**: More sophisticated financial modeling
3. **Multi-scenario Planning**: Conservative vs. aggressive vs. innovative paths

### **🌟 Long-term (3-6 months)**
1. **Multi-platform Connectors**: Salesforce, Microsoft 365, Azure integration
2. **AI-Powered Recommendations**: Smart suggestions based on industry patterns
3. **Digital Twin Capabilities**: Business process mapping and optimization

## Technical Considerations

### **Performance**
- React Flow optimized for large datasets
- Zustand for minimal re-renders
- CSS optimizations for smooth animations
- Mobile-responsive design patterns

### **Security**
- Server-side credential handling
- API route proxy layer
- No client-side authentication exposure
- Secure data transformation pipeline

### **Scalability**
- Modular component architecture
- Extensible state management
- Clear separation between visualization and advisory features
- Ready for multi-tenant deployment

## Development Guidelines

### **Code Standards**
- Functional components with hooks
- Consistent naming conventions
- Modular 200-line component limit
- Comprehensive error handling
- JSDoc for complex functions

### **Testing Strategy**
- Unit tests for utility functions
- Integration tests for API routes
- Component tests for user interactions
- E2E tests for critical flows

### **Deployment Considerations**
- Next.js optimized build
- Environment variable management
- CDN-ready static assets
- Production monitoring ready

---

**📞 Ready for Business Development**: The platform successfully combines technical demonstration, strategic planning tools, and comprehensive business intelligence collection, providing a sophisticated foundation for AI consulting lead generation and client engagement. With the addition of the Value Selling Framework-based profile system, the platform now captures the depth of business intelligence needed for high-value advisory relationships while providing immediate value through automated timeline generation and opportunity analysis.

**🧪 Testing Status**: Comprehensive test suite implemented with 45 tests passing (ProfileService: 25, MarkdownService: 20). TDD approach established for future development. See TESTING_GUIDE.md for complete testing documentation and working with AI assistants.



================================================
FILE: CLIENT_PROFILE_SYSTEM.md
================================================
# Client Profile Management System

## Overview

The Client Profile Management System is a comprehensive solution for capturing business intelligence through guided forms and storing it as structured markdown files. This system helps consultants create detailed client "digital twins" using the Value Selling Framework, with the markdown profiles later parsed by AI to suggest automation opportunities and generate strategic recommendations.

## Key Features

### ✅ **Anti-Hallucination Design**
- **Structured Markdown Storage**: All client data is stored in a standardized markdown format that prevents AI hallucinations
- **Guided Data Capture**: Step-by-step wizard ensures consistent, complete data collection
- **Validation & Parsing**: Built-in validation ensures data integrity and parseability

### ✅ **Value Selling Framework Implementation**
- **Complete Sales Methodology**: Implements all 6 stages of the Value Selling Framework
- **Business Issue Identification**: Captures C-level strategic priorities and concerns
- **Problem/Challenge Mapping**: Department-specific operational issues with quantified impact
- **Root Cause Analysis**: Systematic identification of underlying causes
- **Impact Quantification**: Hard and soft cost calculations with automatic totaling
- **Solution Requirements**: Capability mapping and differentiation requirements
- **Decision Process Mapping**: Stakeholder identification and buying process documentation

### ✅ **AI/Automation Assessment**
- **Technology Landscape**: Current ERP, CRM, collaboration tools assessment
- **AI Readiness Scoring**: 5-criteria scoring system (0-10 total)
- **Opportunity Prioritization**: Structured opportunity assessment with impact/effort matrix
- **Quick Wins Identification**: 0-6 month implementation opportunities

### ✅ **Comprehensive Testing**
- **60% Test Coverage Threshold**: Branch, function, line, and statement coverage
- **Component Testing**: React Testing Library integration tests
- **Service Testing**: Complete ProfileService and MarkdownService test suites
- **TDD Methodology**: Tests written first, code implemented to pass

## System Architecture

```
Client Profile System
├── Frontend Components
│   ├── ProfileWizard (9-step guided form)
│   ├── ProfileViewer (markdown preview)
│   └── ProfileManager (CRUD operations)
├── Services Layer
│   ├── ProfileService (business logic)
│   ├── MarkdownService (parsing/generation)
│   └── TimelineService (AI integration)
├── Data Storage
│   ├── Structured JSON (form data)
│   └── Markdown Files (client profiles)
└── Testing Infrastructure
    ├── Unit Tests (services)
    ├── Integration Tests (components)
    └── E2E Tests (user flows)
```

## Profile Structure

### 1. Company Overview
- Company name, industry, size
- Annual revenue, employee count
- Primary location

### 2. Value Selling Framework

#### Business Issue (Strategic Level)
- Revenue Growth Pressure
- Cost Reduction Mandate  
- Operational Efficiency
- Customer Experience
- Digital Transformation
- Regulatory Compliance
- Competitive Pressure

#### Problems/Challenges (Operational Level)
**Finance Department:**
- Manual invoice processing timelines
- Error rates in financial processes
- Month-end close duration

**HR Department:**
- Employee onboarding timelines
- Manual resume screening
- Employee turnover rates

**IT Department:**
- Ticket resolution times
- Manual intervention requirements
- System provisioning duration

**Customer Service:**
- Response times
- First contact resolution rates
- Customer satisfaction scores

**Operations:**
- Process cycle times
- Manual process percentages
- Quality/error rates

#### Root Cause Analysis
- Legacy systems with poor integration
- Manual, paper-based processes
- Lack of real-time data visibility
- Insufficient automation
- Skills gap in technology
- Siloed departments

#### Impact Quantification
**Hard Costs (Annual):**
- Labor costs from manual processes
- Error correction costs
- System downtime costs
- Compliance penalties/risk
- **Auto-calculated total**

**Soft Costs:**
- Employee frustration/turnover impact
- Customer satisfaction decline
- Competitive disadvantage
- Missed opportunities/growth

#### Solution Requirements
**Capabilities Needed:**
- Automate document processing
- Streamline approval workflows
- Provide real-time dashboards
- Integrate disconnected systems
- Enable self-service capabilities
- Improve data accuracy
- Reduce manual handoffs

**Differentiation Requirements:**
- Industry-specific expertise
- Rapid implementation (< 6 months)
- No-code/low-code platform
- Strong integration capabilities
- Proven ROI in similar companies
- Comprehensive support/training

**Value/ROI Expectations:**
- Target cost reduction
- Target efficiency improvement
- Expected payback period
- Target ROI percentage
- Time to first value

**Success Metrics:**
- Process cycle time reduction
- Error rate improvement
- Cost per transaction reduction
- Employee productivity increase
- Customer satisfaction improvement
- Revenue impact

#### Decision Process
**Key Decision Makers:**
- Economic Buyer (name, title, budget authority)
- Technical Buyer (name, title)
- Champion (name, title)
- Influencers

**Buying Process:**
- Decision timeline
- Budget cycle
- Evaluation criteria
- Other requirements

**Risks of Inaction:**
- Continued cost escalation (annual)
- Employee attrition risk
- 3-year cost of inaction
- Competitive disadvantage
- Customer satisfaction decline
- Regulatory compliance risk

### 3. AI/Automation Opportunity Assessment

#### Current Technology Landscape
- Primary ERP system
- CRM system
- Collaboration tools
- Integration maturity level
- Data quality assessment
- Current automation description

#### AI Readiness Score (0-10)
- Data availability and quality (0-2)
- System integration capability (0-2)
- Technical team readiness (0-2)
- Leadership support (0-2)
- Change management capability (0-2)

#### Top AI Opportunities (Prioritized)
For each opportunity:
- Name and description
- Department
- Specific process
- Current state
- Proposed AI solution
- Estimated annual impact ($)
- Implementation effort (Low/Medium/High)
- Timeline
- Priority score (1-10)

#### Quick Wins (0-6 months)
- Opportunity name
- Estimated impact ($)
- Implementation timeline

## Usage Guide

### For Consultants

#### Creating a New Client Profile
1. Navigate to `/profiles`
2. Click "Create New Profile"
3. Complete the 9-step wizard:
   - Company Overview
   - Business Issue
   - Problems/Challenges
   - Root Cause
   - Impact
   - Solution
   - Decision
   - AI Assessment
   - Summary

#### Best Practices
- **Be Specific**: Use actual numbers and timeframes when possible
- **Quantify Everything**: Always try to attach dollar amounts and percentages
- **Document Sources**: Note where information came from in the notes section
- **Regular Updates**: Revisit profiles as new information becomes available
- **Stakeholder Validation**: Review completed profiles with client stakeholders

### For AI Systems

#### Reading Client Profiles
```javascript
import { markdownService } from './services/markdownService';

// Parse existing markdown profile
const profileData = markdownService.parseMarkdown(markdownContent);

// Access structured data
const companyName = profileData.companyName;
const businessIssues = profileData.valueSellingFramework.businessIssues;
const aiOpportunities = profileData.aiOpportunityAssessment.opportunities;
```

#### Generating Recommendations
The structured markdown format enables AI systems to:
- Identify automation opportunities based on manual processes
- Calculate ROI based on quantified impacts
- Suggest implementation priorities based on effort/impact scores
- Generate proposal content using stakeholder information
- Create timeline recommendations based on decision timelines

## Technical Implementation

### Core Components

#### ProfileWizard.js
Multi-step form component with:
- 9 guided steps
- Form validation
- Data persistence
- Progress tracking
- Navigation controls
- Auto-save functionality

#### MarkdownService.js
Service for markdown operations:
- `generateMarkdown()` - Convert form data to structured markdown
- `parseMarkdown()` - Parse markdown back to structured data
- `extractSection()` - Extract specific sections
- `sanitizeString()` - Clean data for markdown format

#### ProfileService.js
Business logic service:
- `createProfile()` - Create new profiles
- `updateProfile()` - Update existing profiles  
- `generateTimelineFromProfile()` - AI integration
- `calculateAIMaturity()` - Readiness scoring
- `identifyRiskFactors()` - Risk assessment

### Testing Strategy

#### Unit Tests
- **ProfileService**: 25 tests covering all business logic
- **MarkdownService**: 20 tests covering parsing/generation
- **Utility Functions**: Data validation and transformation

#### Integration Tests
- **API Routes**: Profile creation and retrieval
- **Service Integration**: Cross-service communication
- **Data Flow**: End-to-end data processing

#### Component Tests  
- **ProfileWizard**: User interactions and form validation
- **Form Steps**: Individual step functionality
- **Navigation**: Step transitions and data persistence

### Data Flow

```
User Input → ProfileWizard → ProfileService → MarkdownService → Storage
     ↓              ↓              ↓              ↓              ↓
Form Validation → Business Logic → Markdown Gen → File System → Retrieval
     ↓              ↓              ↓              ↓              ↓
Error Handling → Data Transform → Parsing → AI Processing → Recommendations
```

## Example Generated Markdown

```markdown
# Client Profile: Acme Manufacturing Corp

## Company Overview
- **Company Name**: Acme Manufacturing Corp
- **Industry**: Manufacturing
- **Size**: Mid-Market (500-5K)
- **Annual Revenue**: $50,000,000
- **Employee Count**: 1,200
- **Primary Location**: Chicago, IL

---

## Value Selling Framework

### 1. Business Issue
**High-level strategic priority or C-level concern:**
- [x] Cost Reduction Mandate
- [x] Operational Efficiency
- [x] Digital Transformation

**Details**: CEO mandate to reduce operational costs by 15% while improving quality and customer satisfaction.

### 2. Problems / Challenges
**Specific operational issues identified:**

#### Finance Department
- [x] Manual invoice processing taking 5-7 days
- [x] 12% error rate in financial processes
- [x] Month-end close takes 8 days

#### Operations
- [x] Process cycle time: 14 days
- [x] 65% manual processes
- [x] Quality issues: 8% error rate

**Additional Challenges**: Lack of real-time visibility into production status and inventory levels.

### 3. Root Cause
**Why do these challenges exist?**
- [x] Legacy systems with poor integration
- [x] Manual, paper-based processes
- [x] Lack of real-time data visibility
- [x] Insufficient automation

**Details**: 15-year-old ERP system with limited integration capabilities and heavy reliance on spreadsheets and manual data entry.

### 4. Impact
**Quantified effects:**

#### Hard Costs (Annual)
- Labor costs from manual processes: $1,200,000
- Error correction costs: $180,000
- System downtime costs: $75,000
- Compliance penalties/risk: $25,000
- **Total Hard Costs**: $1,480,000

#### Soft Costs
- Employee frustration/turnover impact: High
- Customer satisfaction decline: Medium
- Competitive disadvantage: High
- Missed opportunities/growth: High

### 5. Solution
**Capabilities needed to solve these challenges:**
- [x] Automate document processing
- [x] Streamline approval workflows
- [x] Provide real-time dashboards
- [x] Integrate disconnected systems
- [x] Improve data accuracy

**Differentiation Requirements:**
- [x] Industry-specific expertise
- [x] Rapid implementation (< 6 months)
- [x] Strong integration capabilities
- [x] Proven ROI in similar companies

**Value / ROI Expectations:**
- Target cost reduction: 25% or $370K annually
- Target efficiency improvement: 40%
- Expected payback period: 18 months
- Target ROI: 300%
- Time to first value: 4 months

**Success Metrics:**
- [x] Process cycle time reduction
- [x] Error rate improvement
- [x] Cost per transaction reduction
- [x] Employee productivity increase

**Specific Targets**: Reduce processing time from 14 days to 3 days, decrease error rate from 8% to 2%, increase throughput by 40%.

### 6. Decision
**Decision makers and buying process:**

#### Key Decision Makers
**Economic Buyer**: Sarah Chen (CEO) - Budget Authority: $2,000,000
**Technical Buyer**: Mike Rodriguez (CTO)
**Champion**: Lisa Park (VP Operations)
**Influencers**: Head of Customer Success, Engineering Manager

#### Buying Process
- **Decision timeline**: 8 months
- **Budget cycle**: Q1 planning cycle
- **Evaluation criteria**:
  - Technical fit
  - Cost/ROI
  - Vendor reputation
  - Implementation timeline
  - Support quality

#### Risks of Inaction
- **Continued cost escalation**: $1,480,000 annually
- **Employee attrition risk**: High
- **Estimated cost of inaction (3 years)**: $4,440,000
- **Competitive disadvantage**: Losing market share to more agile competitors
- **Customer satisfaction decline**: Risk of losing key accounts due to delivery delays
- **Regulatory compliance risk**: Increasing audit findings and potential penalties

---

## AI/Automation Opportunity Assessment

### Current Technology Landscape
- **Primary ERP**: Legacy system (15 years old)
- **CRM System**: Salesforce
- **Collaboration Tools**: Microsoft Teams, email
- **Integration Maturity**: Basic
- **Data Quality**: Fair
- **Current Automation**: Basic email notifications, some Excel macros

### AI Readiness Score
- **Data availability and quality**: 1/2
- **System integration capability**: 1/2
- **Technical team readiness**: 2/2
- **Leadership support**: 2/2
- **Change management capability**: 1/2

**Total AI Readiness Score: 7/10**

### Top AI Opportunities (Prioritized)

#### 1. Invoice Processing Automation
- **Department**: Finance
- **Process**: Accounts Payable processing
- **Current State**: Manual data entry from paper/PDF invoices
- **AI Solution**: OCR + machine learning for automated invoice processing
- **Estimated Impact**: $180,000
- **Implementation Effort**: Medium
- **Timeline**: 3 months
- **Priority Score**: 9/10

#### 2. Production Planning Optimization
- **Department**: Operations  
- **Process**: Production scheduling
- **Current State**: Manual scheduling using spreadsheets
- **AI Solution**: AI-powered demand forecasting and production optimization
- **Estimated Impact**: $240,000
- **Implementation Effort**: High
- **Timeline**: 6 months
- **Priority Score**: 8/10

### Quick Wins (0-6 months)
1. **Automated invoice routing** - Impact: $25,000 - Timeline: 1 month
2. **Inventory alerts automation** - Impact: $15,000 - Timeline: 2 months
3. **Order status notifications** - Impact: $10,000 - Timeline: 1 month

---

## Summary & Next Steps

### Executive Summary
**Current State**: Manufacturing company with $1.48M in annual waste due to manual processes, legacy systems, and operational inefficiencies.

**Recommended Approach**: Phased automation implementation starting with high-impact, low-effort opportunities in finance and operations.

**Expected Value**: 
- Total 3-year benefit: $3,600,000
- Investment required: $800,000
- Net ROI: 350%
- Payback period: 18 months

### Immediate Next Steps
1. [ ] Schedule technical architecture review - Mike Rodriguez - March 15
2. [ ] Prepare detailed ROI analysis - Finance Team - March 22  
3. [ ] Vendor evaluation kickoff - Lisa Park - April 1

### Notes & Additional Context
Strong executive sponsorship with CEO mandate driving urgency. Technical team is capable but needs external expertise for implementation. Budget approved in Q1 cycle with flexibility for additional investment if ROI is proven.

---

*Profile created on: March 1, 2024*
*Last updated: March 1, 2024*  
*Created by: John Smith, Senior Consultant*
```

## Future Enhancements

### Planned Features
- **AI Integration**: Automated opportunity identification from profile data
- **Competitive Analysis**: Industry benchmarking and comparison
- **ROI Calculator**: Dynamic financial modeling
- **Proposal Generator**: Automated proposal creation from profiles
- **Pipeline Management**: Sales opportunity tracking
- **Team Collaboration**: Multi-user editing and commenting

### API Integration Opportunities
- **CRM Integration**: Sync with Salesforce, HubSpot
- **Financial Tools**: Connect with budgeting and forecasting systems
- **Industry Data**: Market research and benchmarking APIs
- **AI Services**: Enhanced opportunity identification and recommendations

## Conclusion

The Client Profile Management System provides a comprehensive, structured approach to capturing and leveraging client business intelligence. By combining the proven Value Selling Framework with modern AI capabilities and rigorous testing practices, it enables consultants to create detailed "digital twins" of their clients while maintaining data integrity and preventing AI hallucinations.

The system's markdown-based storage format ensures that client profiles remain parseable and actionable for AI systems while providing a human-readable format for consultants and stakeholders. 


================================================
FILE: TESTING_GUIDE.md
================================================
# Testing Guide for Agentic AI Flow Visualizer

## Overview
This guide explains how tests work in this project and how to effectively work with AI assistants (like Claude) to maintain and expand the test suite.

## Table of Contents
1. [Testing Infrastructure](#testing-infrastructure)
2. [Running Tests](#running-tests)
3. [Understanding Test Structure](#understanding-test-structure)
4. [Working with AI Assistants](#working-with-ai-assistants)
5. [Test-Driven Development (TDD) Workflow](#test-driven-development-tdd-workflow)
6. [Debugging Failed Tests](#debugging-failed-tests)
7. [Best Practices](#best-practices)

## Testing Infrastructure

### Test Framework
- **Jest**: JavaScript testing framework
- **React Testing Library**: For testing React components
- **jest-dom**: Custom Jest matchers for DOM assertions

### Key Configuration Files
- `jest.config.js`: Main Jest configuration
- `jest.setup.js`: Test environment setup and global mocks
- `package.json`: Test scripts

### Test File Locations
Tests are organized alongside the code they test:
```
app/
├── services/
│   ├── profileService.js
│   ├── markdownService.js
│   └── __tests__/
│       ├── profileService.test.js
│       └── markdownService.test.js
├── components/
│   └── __tests__/
└── utils/
    └── __tests__/
```

## Running Tests

### Basic Commands
```bash
# Run all tests
npm test

# Run tests in watch mode (re-runs on file changes)
npm run test:watch

# Run tests for a specific file
npm test profileService.test.js

# Run tests with coverage report
npm run test:coverage

# Run tests in CI mode
npm run test:ci
```

### Understanding Test Output
- ✅ Green checks indicate passing tests
- ❌ Red X's indicate failing tests
- Console warnings/errors during tests are often expected (testing error cases)

## Understanding Test Structure

### Anatomy of a Test File
```javascript
// Import the module to test
import { ProfileService } from '../profileService';

// Mock dependencies
jest.mock('../markdownService', () => ({
  markdownService: {
    generateMarkdown: jest.fn()
  }
}));

// Test suite
describe('ProfileService', () => {
  // Setup before each test
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  // Nested test suite for a specific method
  describe('createProfile', () => {
    // Individual test case
    it('should create a profile with unique ID', async () => {
      // Arrange - set up test data
      const mockData = { companyName: 'Test Corp' };
      
      // Act - perform the action
      const result = await ProfileService.createProfile(mockData);
      
      // Assert - verify the outcome
      expect(result.companyName).toBe('Test Corp');
      expect(result.id).toBeTruthy();
    });
  });
});
```

### Common Jest Matchers
```javascript
// Equality
expect(value).toBe(expected)          // Strict equality (===)
expect(value).toEqual(expected)       // Deep equality

// Truthiness
expect(value).toBeTruthy()
expect(value).toBeFalsy()
expect(value).toBeNull()
expect(value).toBeUndefined()

// Numbers
expect(value).toBeGreaterThan(3)
expect(value).toBeLessThanOrEqual(4.5)

// Strings
expect(string).toMatch(/pattern/)
expect(string).toContain('substring')

// Arrays
expect(array).toContain(item)
expect(array).toHaveLength(3)

// Objects
expect(object).toHaveProperty('key', 'value')
expect(object).toMatchObject({ subset: 'of properties' })

// Exceptions
expect(() => throwingFunction()).toThrow()
expect(() => throwingFunction()).toThrow('error message')
```

## Working with AI Assistants

### Providing Context to AI
When starting a new conversation with an AI assistant who doesn't have context:

1. **Reference this guide**:
   ```
   "I'm working on the Agentic AI Flow Visualizer project. 
   Please check the TESTING_GUIDE.md file for context on our testing approach."
   ```

2. **Share relevant files**:
   - The test file you're working on
   - The implementation file being tested
   - Related service/utility files
   - jest.config.js if configuration is relevant

3. **Describe the current state**:
   ```
   "We have 45 tests passing (25 for ProfileService, 20 for MarkdownService).
   I need help adding tests for the FlowService."
   ```

### Effective Prompts for Test Development

#### For Writing New Tests:
```
"I need to add tests for the FlowService.generateFlow() method.
It takes a profile object and returns flow data.
Please create comprehensive tests covering:
1. Happy path with valid data
2. Edge cases (empty data, missing fields)
3. Error scenarios
Follow the existing test patterns in profileService.test.js"
```

#### For Debugging Failed Tests:
```
"The test 'should parse company overview section' is failing.
Expected: { companyName: 'Test Corp', industry: 'Healthcare' }
Received: { companyName: 'Test Corp' }

The parseCompanyOverview method uses extractSection to get markdown content.
Help me debug why other fields aren't being extracted."
```

#### For Refactoring Tests:
```
"Our ProfileService tests have repetitive setup code.
Can you help refactor using a factory function or test utilities
while maintaining the same test coverage?"
```

### Key Information to Share

1. **Test Dependencies**: Which services/utilities are mocked
2. **Test Data Structure**: Shape of objects being tested
3. **Business Logic**: What the code should do
4. **Error Messages**: Exact test failure output
5. **Recent Changes**: What was modified that might affect tests

## Test-Driven Development (TDD) Workflow

### 1. Write the Test First
```javascript
it('should calculate ROI based on profile impact', () => {
  const profile = {
    valueSellingFramework: {
      impact: { totalAnnualImpact: 1000000 }
    }
  };
  
  const roi = ProfileService.calculateROI(profile);
  
  expect(roi).toBe(300); // 300% ROI expectation
});
```

### 2. Run Test (Expect Failure)
```bash
npm test profileService.test.js
# Test fails: calculateROI is not a function
```

### 3. Implement Minimal Code
```javascript
static calculateROI(profile) {
  const impact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
  return Math.round((impact / 333333) * 100); // Simple calculation
}
```

### 4. Run Test Again (Should Pass)
```bash
npm test profileService.test.js
# Test passes!
```

### 5. Refactor if Needed
Improve implementation while keeping tests green.

## Debugging Failed Tests

### Common Issues and Solutions

1. **Regex Pattern Issues**
   ```javascript
   // Debug regex by creating test script
   const testRegex = () => {
     const pattern = /your-pattern/;
     const testString = "your test string";
     console.log(pattern.test(testString));
   };
   ```

2. **Async/Await Issues**
   ```javascript
   // Always use async/await for async tests
   it('should handle async operations', async () => {
     const result = await asyncFunction();
     expect(result).toBe(expected);
   });
   ```

3. **Mock Not Working**
   ```javascript
   // Ensure mocks are cleared between tests
   beforeEach(() => {
     jest.clearAllMocks();
   });
   ```

4. **State Pollution Between Tests**
   ```javascript
   // Clear shared state
   beforeEach(() => {
     localStorage.clear();
     // Reset any module-level variables
   });
   ```

### Debug Techniques

1. **Add Console Logs**
   ```javascript
   it('should extract data', () => {
     const input = "test data";
     console.log('Input:', input);
     
     const result = extractData(input);
     console.log('Result:', result);
     
     expect(result).toBe(expected);
   });
   ```

2. **Use Jest's Inline Snapshots**
   ```javascript
   expect(complexObject).toMatchInlineSnapshot();
   // Jest will fill in the snapshot on first run
   ```

3. **Focus on Single Test**
   ```javascript
   it.only('should focus on this test', () => {
     // Only this test runs
   });
   ```

4. **Skip Problematic Tests Temporarily**
   ```javascript
   it.skip('should skip this test', () => {
     // This test won't run
   });
   ```

## Best Practices

### 1. Test Organization
- Group related tests using `describe` blocks
- Use descriptive test names that explain what and why
- Follow the Arrange-Act-Assert pattern

### 2. Test Data
- Use factories or builders for complex test data
- Keep test data minimal but realistic
- Don't share mutable test data between tests

### 3. Mocking
- Mock external dependencies (APIs, databases)
- Don't mock the thing you're testing
- Use `jest.fn()` for function mocks
- Clear mocks between tests

### 4. Assertions
- Test one thing per test
- Use specific matchers (toBe vs toEqual)
- Test both positive and negative cases
- Include edge cases

### 5. Performance
- Keep tests fast (mock slow operations)
- Use `beforeAll` for expensive setup
- Parallelize independent tests

### 6. Maintenance
- Update tests when requirements change
- Remove obsolete tests
- Refactor tests along with code
- Keep test coverage above thresholds

## Coverage Thresholds

Current thresholds (in jest.config.js):
- Branches: 60%
- Functions: 60%
- Lines: 60%
- Statements: 60%

Run `npm run test:coverage` to see current coverage.

## Component Testing (Next Steps)

For React components, use React Testing Library:

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileCard } from '../ProfileCard';

describe('ProfileCard', () => {
  it('should display company name', () => {
    const profile = { companyName: 'Test Corp' };
    
    render(<ProfileCard profile={profile} />);
    
    expect(screen.getByText('Test Corp')).toBeInTheDocument();
  });
  
  it('should handle click events', () => {
    const handleClick = jest.fn();
    
    render(<ProfileCard onClick={handleClick} />);
    
    fireEvent.click(screen.getByRole('button'));
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

## Integration Testing (Future)

For testing multiple services together:

```javascript
describe('Profile to Timeline Integration', () => {
  it('should generate timeline from profile', async () => {
    // Create profile
    const profile = await ProfileService.createProfile(mockData);
    
    // Generate timeline
    const timeline = await TimelineService.generateFromProfile(profile);
    
    // Verify integration
    expect(timeline.companyName).toBe(profile.companyName);
    expect(timeline.phases).toHaveLength(4);
  });
});
```

## E2E Testing (Future)

Consider Playwright or Cypress for end-to-end tests:

```javascript
describe('Profile Creation Flow', () => {
  it('should create profile through UI', async () => {
    await page.goto('/profiles');
    await page.click('button:has-text("New Profile")');
    await page.fill('#companyName', 'Test Corp');
    await page.click('button:has-text("Save")');
    
    await expect(page).toHaveURL('/profiles/test-corp-*');
  });
});
```

## Troubleshooting

### Common Error Messages

1. **"Cannot find module"**
   - Check import paths
   - Verify module aliases in jest.config.js

2. **"Timeout - Async callback was not invoked"**
   - Add `async/await` to test
   - Increase timeout: `jest.setTimeout(10000)`

3. **"Invalid hook call"**
   - Hooks can only be called in React components
   - Mock hooks or use React Testing Library

4. **"ReferenceError: window is not defined"**
   - Add mock to jest.setup.js
   - Use jsdom environment

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [TDD Guide](https://martinfowler.com/bliki/TestDrivenDevelopment.html)

---

Remember: Tests are living documentation. They should clearly communicate what the code does and why it matters. 


================================================
FILE: TESTING_WORKFLOW.md
================================================
# Testing Workflow for Agentic AI Flow Visualizer

## Quick Summary

✅ **All tests are now working!** 45 tests passing (25 ProfileService, 20 MarkdownService)

## How Our Tests Work

### Testing Infrastructure
- **Jest**: Testing framework configured with Next.js
- **React Testing Library**: For component testing (future)
- **Coverage thresholds**: 60% for all metrics (currently not met, needs more tests)

### Test Structure
```
app/services/__tests__/
├── profileService.test.js    # 25 tests for ProfileService
└── markdownService.test.js   # 20 tests for MarkdownService
```

### Running Tests
```bash
npm test                # Run all tests
npm run test:watch      # Watch mode for development
npm run test:coverage   # Run with coverage report
```

## Working with AI Assistants on Tests

### When Starting a New Chat

1. **Share Context**:
   - "I have a Next.js app with Jest tests"
   - "Check TESTING_GUIDE.md and TESTING_WORKFLOW.md for test setup"
   - "We have 45 passing tests for ProfileService and MarkdownService"
   - "Using Windows with SWC binary issues resolved"

2. **Common Tasks to Request**:
   - "Add tests for [ServiceName]"
   - "Debug failing test [test name]"
   - "Improve test coverage for [module]"
   - "Add component tests using React Testing Library"

### Debugging Test Issues

#### Windows SWC Binary Issue (Resolved)
If you encounter SWC binary loading errors:
```bash
npm install --save-dev @next/swc-win32-x64-msvc
```

Our solution: We installed the Windows-specific SWC binary and configured babel-jest as a fallback.

#### Common Test Patterns

**Service Tests**:
```javascript
describe('ServiceName', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });
  
  it('should do something', async () => {
    // Arrange
    const input = { data: 'test' };
    
    // Act
    const result = await Service.method(input);
    
    // Assert
    expect(result).toEqual(expected);
  });
});
```

**Mocking Dependencies**:
```javascript
jest.mock('../otherService', () => ({
  otherService: {
    method: jest.fn()
  }
}));
```

### Test Coverage Strategy

Current coverage is low (12.77%) because we only have tests for 2 services. Priority areas for new tests:

1. **Utils** (0% coverage):
   - `transformAgenticData.js` - Critical for flow visualization
   - `validation.js` - Important for security
   - `layoutGraph.js` - Core layout logic

2. **Hooks** (0% coverage):
   - `useFlowData.js`
   - `useFlowLayout.js`

3. **Components** (0% coverage):
   - Start with simple components like `NodeIcons.js`
   - Move to complex ones like `FlowVisualizer.js`

### Practical Tips for AI Assistants

1. **Start Simple**: Begin with utility functions before tackling components
2. **Mock External Dependencies**: Always mock API calls, localStorage, etc.
3. **Test Business Logic**: Focus on testing logic, not implementation details
4. **Use Existing Patterns**: Follow patterns from existing test files

### Example Prompts for AI Assistants

1. **Adding New Tests**:
   ```
   "Please add tests for the transformAgenticData utility function. 
   It transforms ServiceNow data into React Flow nodes. 
   Follow the pattern in profileService.test.js"
   ```

2. **Debugging Failed Tests**:
   ```
   "This test is failing with [error message]. 
   The test expects X but receives Y. 
   Here's the implementation and test code..."
   ```

3. **Improving Coverage**:
   ```
   "Current coverage is 12.77%. 
   Please add tests for validation.js focusing on:
   - validateInstanceUrl
   - validateBusinessProfile
   - checkRateLimit"
   ```

### Key Insights from Our Testing Journey

1. **Regex Issues**: The `extractSection` regex needed the 'm' flag removed to work correctly
2. **Nested Properties**: Use optional chaining for nested data access (e.g., `profile.aiOpportunityAssessment?.aiReadinessScore`)
3. **Mock Carefully**: Ensure mocks match the actual implementation's behavior
4. **Debug Scripts**: Create temporary debug scripts to understand complex issues

### Next Steps for Testing

1. **Immediate** (Next PR):
   - Add tests for `transformAgenticData.js`
   - Add tests for `validation.js`
   - Target 30% coverage

2. **Short-term**:
   - Add component tests with React Testing Library
   - Test Zustand stores
   - Target 60% coverage

3. **Long-term**:
   - Add E2E tests with Playwright
   - Integration tests for API routes
   - Target 80% coverage

### Troubleshooting Checklist

- [ ] SWC binary installed? (`@next/swc-win32-x64-msvc`)
- [ ] Jest cache cleared? (`jest --clearCache`)
- [ ] Node modules fresh? (`rm -rf node_modules && npm install`)
- [ ] Mocks properly cleared between tests?
- [ ] Using correct Node version? (18+)

### Resources

- **Project Docs**: `TESTING_GUIDE.md` (comprehensive guide)
- **Jest Config**: `jest.config.js` (current setup)
- **Test Examples**: `app/services/__tests__/` (working patterns)

---

Remember: Tests are documentation. Write them clearly so future developers (and AI assistants) understand the intended behavior. 


================================================
FILE: app/layout.js
================================================
import { Inter } from 'next/font/google';
import './globals.css';

// Initialize the Inter font with the weights we need
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata = {
  title: 'Agentic AI Flow Visualizer',
  description: 'Visualize ServiceNow agentic AI flow data as interactive flow diagrams',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className={inter.className}>{children}</body>
    </html>
  );
} 


================================================
FILE: app/page.js
================================================
'use client';

import React, { useState, useRef } from 'react';
import useAgenticStore from './store/useAgenticStore';
import ServiceNowConnector from './components/ServiceNowConnector';
import FlowVisualizer from './components/FlowVisualizer';
import { ReactFlowProvider } from 'reactflow';

export default function Home() {
  const agenticData = useAgenticStore((state) => state.agenticData);
  const clearAgenticData = useAgenticStore((state) => state.clearAgenticData);
  const refreshData = useAgenticStore((state) => state.refreshData);
  const resetData = useAgenticStore((state) => state.resetData);
  const [error, setError] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showDebug, setShowDebug] = useState(false);
  
  // Refs for flow control methods
  const flowVisualizerRef = useRef({
    expandAllNodes: () => {},
    collapseAllNodes: () => {},
  });

  // Simple error boundary implementation
  const handleError = (error) => {
    console.error("Error in flow visualization:", error);
    setError(error.message || "An error occurred displaying the flow diagram");
  };

  // Handle refresh button click
  const handleRefresh = async () => {
    try {
      setIsRefreshing(true);
      await refreshData();
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Error refreshing data:", err);
      setError(err.message || "Failed to refresh data from ServiceNow");
    } finally {
      setIsRefreshing(false);
    }
  };
  
  // Flow control handlers
  const handleExpandAll = () => {
    flowVisualizerRef.current.expandAllNodes();
  };
  
  const handleCollapseAll = () => {
    flowVisualizerRef.current.collapseAllNodes();
  };
  
  const handleResetFlow = () => {
    resetData();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-0" style={{ 
      backgroundColor: '#f5f5f5', 
      minHeight: '100vh',
      width: '100vw',
      margin: 0,
      padding: 0,
      overflow: 'hidden'
    }}>
      {agenticData && (
        <header className="app-header">
          <div className="header-top">
            <div className="logo-and-title">
              <h1 className="app-title">Agentic AI Flow Manager</h1>
              <div className="logo-wrapper">
                <img
                  src="/images/nowgenticLogo.svg"
                  alt="NOWGENTIC Logo"
                  height={30}
                  width={120}
                />
              </div>
            </div>
            <div className="header-actions">
              <button 
                onClick={() => window.location.href = '/profiles'}
                className="btn btn-primary"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
                Client Profiles
              </button>
              <button 
                onClick={() => window.location.href = '/timeline'}
                className="btn btn-success"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="2" x2="12" y2="22"></line>
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                </svg>
                AI Timeline
              </button>
              <button 
                onClick={clearAgenticData}
                className="btn btn-secondary"
              >
                <span>Disconnect</span>
              </button>
              <button 
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="btn btn-primary"
              >
                {isRefreshing ? 'Refreshing...' : 'Refresh Data'} 
              </button>
              <button 
                onClick={() => setShowDebug(!showDebug)}
                className="btn btn-secondary btn-icon"
                aria-label="Toggle debug info"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                  <path d="M12 16v.01"></path>
                  <path d="M12 8v4"></path>
                </svg>
              </button>
            </div>
          </div>
          
          {showDebug && (
            <div className="debug-info">
              <details open>
                <summary>Debug Information</summary>
                <pre>
                  {JSON.stringify({
                    dataPresent: !!agenticData,
                    useCases: agenticData?.use_cases?.length || 0,
                    firstUseCase: agenticData?.use_cases?.[0]?.name || 'None'
                  }, null, 2)}
                </pre>
              </details>
            </div>
          )}
          
          <div className="header-tabs">
            <div className="button-group">
              <button 
                className="btn btn-neutral"
                onClick={handleCollapseAll}
              >
                Collapse All
              </button>
              <button 
                className="btn btn-neutral"
                onClick={handleExpandAll}
              >
                Expand All
              </button>
            </div>
            <button 
              className="btn btn-danger"
              onClick={handleResetFlow}
            >
              Reset Flow
            </button>
          </div>
        </header>
      )}
      
      <div className={`flex-1 w-full ${agenticData ? 'mt-0' : 'mt-8'}`}>
        {!agenticData ? (
          <div className="flex flex-col items-center justify-center h-full p-4">
            <ServiceNowConnector />
          </div>
        ) : error ? (
          <div className="text-red-600 p-4 border border-red-300 rounded bg-red-50 mb-4 m-4">
            <h3 className="font-bold">Error Displaying Flow</h3>
            <p>{error}</p>
            <button 
              onClick={clearAgenticData}
              className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div style={{ height: 'calc(100vh - 120px)', width: '100%', position: 'relative' }}>
            <ReactFlowProvider>
              <FlowVisualizer 
                onError={handleError} 
                ref={flowVisualizerRef}
              />
            </ReactFlowProvider>
          </div>
        )}
      </div>
    </main>
  );
} 


================================================
FILE: app/api/servicenow/route.js
================================================
// Next.js API route to proxy requests to ServiceNow
// This avoids CORS issues by making server-to-server requests

import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    const { 
      instanceUrl, 
      username, 
      password, 
      tableName, 
      fields = [], 
      scope = '',
      query = ''
    } = body;

    // Validate required parameters
    if (!instanceUrl || !username || !password || !tableName) {
      return NextResponse.json(
        { error: 'Missing required parameters: instanceUrl, username, password, tableName' },
        { status: 400 }
      );
    }

    // Construct the ServiceNow API URL
    let url = `${instanceUrl}/api/now/table/${tableName}?`;
    
    // Add query parameters if provided
    const queryParams = [];
    
    if (scope) {
      queryParams.push(`sysparm_query=sys_scope=${scope}${query ? '^' + query : ''}`);
    } else if (query) {
      queryParams.push(`sysparm_query=${query}`);
    }
    
    if (fields.length > 0) {
      queryParams.push(`sysparm_fields=${fields.join(',')}`);
    }
    
    queryParams.push('sysparm_display_value=false');
    queryParams.push('sysparm_exclude_reference_link=true');
    
    url += queryParams.join('&');
    
    console.log(`Proxying request to: ${url}`);
    
    // Make the authenticated request to ServiceNow
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    // Check if the response was successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`ServiceNow Error (${response.status}): ${errorText}`);
      return NextResponse.json(
        { 
          error: `ServiceNow request failed with status ${response.status}`,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Parse and return the ServiceNow response
    const data = await response.json();
    return NextResponse.json(data);
    
  } catch (error) {
    console.error('Error in ServiceNow proxy API route:', error);
    return NextResponse.json(
      { error: 'Internal server error', message: error.message },
      { status: 500 }
    );
  }
} 


================================================
FILE: app/api/servicenow/fetch-agentic-data/route.js
================================================
// Specialized API route to fetch all ServiceNow agentic AI data in one go

import { NextResponse } from 'next/server';
import { validateInstanceUrl, validateScopeId, checkRateLimit } from '../../../utils/validation';

// Helper to safely get nested properties
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};

export async function POST(request) {
  try {
    // Rate limiting (basic implementation)
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitCheck = checkRateLimit(clientIP, 20, 60000); // 20 requests per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': rateLimitCheck.retryAfter.toString() } }
      );
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { instanceUrl, scopeId } = body;

    // Validate instanceUrl
    const urlValidation = validateInstanceUrl(instanceUrl);
    if (!urlValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid instance URL: ${urlValidation.error}` },
        { status: 400 }
      );
    }

    // Validate scopeId
    const scopeValidation = validateScopeId(scopeId);
    if (!scopeValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid scope ID: ${scopeValidation.error}` },
        { status: 400 }
      );
    }

    // Get credentials from environment variables (server-side only)
    const username = process.env.SERVICENOW_USERNAME;
    const password = process.env.SERVICENOW_PASSWORD;

    // Validate server-side credentials
    if (!username || !password) {
      console.error('Server configuration error: ServiceNow credentials not found in environment variables');
      return NextResponse.json(
        { error: 'Server configuration error: Authentication credentials not configured' },
        { status: 500 }
      );
    }

    // Use validated and sanitized values
    const formattedUrl = urlValidation.sanitized;
    const sanitizedScopeId = scopeValidation.sanitized;

    // Create authorization header using server-side credentials
    const authHeader = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;

    // Use the new scripted REST API endpoint with sanitized scope ID
    const apiUrl = `${formattedUrl}/api/x_nowge_rfx_ai/ai_relationship_explorer/relationships?app_scope_id=${sanitizedScopeId}`;
    
    console.log(`Fetching from: ${apiUrl}`);
    
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to fetch data from scripted REST API: ${response.status} ${response.statusText}. Details: ${errorText}`);
    }

    // Get the response data
    const data = await response.json();
    
    // Add debug logging
    console.log('API Response Structure:', JSON.stringify(data, null, 2));
    
    // Check if the data is nested in an x_nowge_rfx_ai object
    if (data.x_nowge_rfx_ai && data.x_nowge_rfx_ai.use_cases) {
      // Return the data with use_cases directly at the top level
      return NextResponse.json({ use_cases: data.x_nowge_rfx_ai.use_cases });
    } else if (data.result && data.result.use_cases) {
      // If it's under a result property, extract it
      return NextResponse.json({ use_cases: data.result.use_cases });
    } else if (data.use_cases) {
      // Data already has use_cases at the top level
      return NextResponse.json(data);
    } else {
      // If we can't find use_cases in the expected places, return what we have
      // and let the error handling catch it
      console.error('Could not find use_cases in the API response:', data);
      return NextResponse.json(data);
    }

  } catch (error) {
    console.error('Error in fetch-agentic-data API route:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch or process ServiceNow data' },
      { status: 500 }
    );
  }
} 


================================================
FILE: app/api/servicenow/get-credentials/route.js
================================================
export async function GET() {
  // Only return non-sensitive connection details
  // Credentials should be handled server-side only
  return Response.json({
    instanceUrl: process.env.SERVICENOW_INSTANCE_URL || '',
    // Remove username and password from client exposure
    scopeId: process.env.SERVICENOW_SCOPE_ID || ''
  });
} 


================================================
FILE: app/api/timeline/generate/route.js
================================================
import { NextResponse } from 'next/server';
import { validateBusinessProfile, validateScenarioType, checkRateLimit } from '../../../utils/validation';
import { TimelineService } from '../../../services/timelineService';

export async function POST(request) {
  try {
    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitCheck = checkRateLimit(`timeline-${clientIP}`, 5, 60000); // 5 timeline generations per minute
    if (!rateLimitCheck.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded', retryAfter: rateLimitCheck.retryAfter },
        { status: 429, headers: { 'Retry-After': rateLimitCheck.retryAfter.toString() } }
      );
    }

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid JSON in request body' },
        { status: 400 }
      );
    }

    const { businessProfile, scenarioType } = body;

    // Validate business profile
    const profileValidation = validateBusinessProfile(businessProfile);
    if (!profileValidation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid business profile', 
          details: profileValidation.errors 
        },
        { status: 400 }
      );
    }

    // Validate scenario type
    const scenarioValidation = validateScenarioType(scenarioType);
    if (!scenarioValidation.isValid) {
      return NextResponse.json(
        { error: `Invalid scenario type: ${scenarioValidation.error}` },
        { status: 400 }
      );
    }

    // Generate timeline using the service
    try {
      const timelineData = await TimelineService.generateTimeline(
        profileValidation.sanitized,
        scenarioValidation.sanitized
      );

      return NextResponse.json({
        success: true,
        timeline: timelineData,
        generatedAt: new Date().toISOString()
      });

    } catch (serviceError) {
      console.error('Timeline generation service error:', serviceError);
      return NextResponse.json(
        { error: 'Failed to generate timeline', details: serviceError.message },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Timeline API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 


================================================
FILE: app/components/FlowVisualizer.js
================================================
'use client';

import React, { useState, useCallback, forwardRef, useImperativeHandle } from 'react';
import { useNodesState, useEdgesState } from 'reactflow';
import 'reactflow/dist/style.css';

import useAgenticStore from '../store/useAgenticStore';
import { useFlowLayout } from '../hooks/useFlowLayout';
import { useFlowData } from '../hooks/useFlowData';
import FlowCanvas from './flow/FlowCanvas';

const FlowVisualizer = forwardRef(({ onError, layoutDirection: externalLayoutDirection, autoFitOnChange: externalAutoFitOnChange }, ref) => {
  const { agenticData, isLoading, error } = useAgenticStore();
  
  // Debug logging
  console.log('FlowVisualizer rendering with agenticData:', agenticData);
  console.log('Is any data present?', agenticData && Object.keys(agenticData).length > 0);
  console.log('Are there use_cases?', agenticData?.use_cases?.length);
  
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  
  // Use our custom hooks for layout and data management
  const {
    layoutDirection,
    autoFitEnabled,
    lastUpdate,
    setAutoFitEnabled,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    handleLayoutChange
  } = useFlowLayout(nodes, setNodes, edges, setEdges);
  
  // Load and transform data
  useFlowData(agenticData, layoutDirection, setNodes, setEdges, onError);
  
  // Expose methods to parent component via ref
  useImperativeHandle(ref, () => ({
    expandAllNodes,
    collapseAllNodes
  }));

  // Handle node clicks
  const onNodeClick = useCallback((event, node) => {
    setSelectedNode(node);
  }, []);

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'row',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0 
    }}>
      {!agenticData ? (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: '#666', fontSize: '1.1rem' }}>
            <p>No data available. Please connect to ServiceNow to visualize agentic AI flows.</p>
          </div>
        </div>
      ) : (
        <FlowCanvas
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          selectedNode={selectedNode}
          lastUpdate={lastUpdate}
          layoutDirection={layoutDirection}
          toggleNodeExpansion={toggleNodeExpansion}
        />
      )}
    </div>
  );
});

FlowVisualizer.displayName = 'FlowVisualizer';

export default FlowVisualizer; 


================================================
FILE: app/components/NodeIcons.js
================================================
'use client';

import React from 'react';

/**
 * External link icon to open a node in ServiceNow
 */
export const ExternalLinkIcon = () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="14" 
    height="14" 
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="external-link-icon"
  >
    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
    <polyline points="15 3 21 3 21 9"></polyline>
    <line x1="10" y1="14" x2="21" y2="3"></line>
  </svg>
);

/**
 * Component that renders the node header buttons (expand/collapse and external link)
 */
export function NodeHeaderButtons({ 
  id, 
  isCollapsed, 
  hasChildren, 
  onToggle, 
  canNavigate, 
  onExternalLinkClick 
}) {
  return (
    <div className="node-header-buttons">
      {canNavigate && (
        <button 
          className="node-external-link"
          onClick={onExternalLinkClick}
          onMouseDown={(e) => e.stopPropagation()}
          title="Open in ServiceNow"
        >
          <ExternalLinkIcon />
        </button>
      )}
      
      {hasChildren && (
        <button 
          className="expand-button"
          onClick={() => onToggle && onToggle(id)}
          onMouseDown={(e) => e.stopPropagation()}
          title={isCollapsed ? "Show child nodes" : "Hide child nodes"}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      )}
    </div>
  );
} 


================================================
FILE: app/components/ServiceNowConnector.js
================================================
'use client';

import React, { useState, useEffect } from 'react';
import useAgenticStore from '../store/useAgenticStore';
import Image from 'next/image';

// Helper to safely get nested properties
const get = (obj, path, defaultValue = undefined) => {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
};

export default function ServiceNowConnector() {
  // Fetch non-sensitive connection details from API on mount
  const [instanceUrl, setInstanceUrl] = useState('');
  const [scopeId, setScopeId] = useState('');

  useEffect(() => {
    fetch('/api/servicenow/get-credentials')
      .then(res => res.json())
      .then(data => {
        setInstanceUrl(data.instanceUrl || '');
        setScopeId(data.scopeId || '');
      })
      .catch(() => {
        // fallback to empty/defaults if fetch fails
      });
  }, []);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const setAgenticData = useAgenticStore((state) => state.setAgenticData);
  const setConnectionDetails = useAgenticStore((state) => state.setConnectionDetails);

  const handleFetchData = async () => {
    setIsLoading(true);
    setError(null);
    console.log('Fetching data using server-side credentials...');

    if (!instanceUrl || !scopeId) {
      setError('Instance URL and Scope ID are required.');
      setIsLoading(false);
      return;
    }

    try {
      // Format the instance URL
      let formattedUrl = instanceUrl.trim();
      if (!formattedUrl.startsWith('https://') && !formattedUrl.startsWith('http://')) {
        formattedUrl = 'https://' + formattedUrl;
      }
      if (formattedUrl.endsWith('/')) {
        formattedUrl = formattedUrl.slice(0, -1);
      }

      // Store connection details for refresh operations (no sensitive data)
      const connectionDetails = {
        instanceUrl: formattedUrl,
        scopeId
      };
      
      console.log('Setting connection details with instance URL:', formattedUrl);

      // Use our API route to fetch all the data at once
      // Credentials are handled server-side via environment variables
      const response = await fetch('/api/servicenow/fetch-agentic-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionDetails),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to fetch data from ServiceNow';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If parsing JSON fails, use the status text
          errorMessage = `${errorMessage}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      // Process the response
      const data = await response.json();
      console.log('Data fetched successfully:', data);

      // Store connection details (for refresh) and then update the store with the data
      setConnectionDetails(connectionDetails);
      setAgenticData(data);

    } catch (err) {
      console.error('Error fetching or processing ServiceNow data:', err);
      setError(err.message || 'An unknown error occurred while fetching data.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '1.5rem' }}>
          {/* Cube icon at the top */}
          <div className="cube-icon" style={{ backgroundColor: '#2196f3', width: '56px', height: '56px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" width="32" height="32">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" stroke="white" fill="none" strokeWidth="1"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12" stroke="white" strokeWidth="1"></line>
            </svg>
          </div>
          
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 0.5rem 0', fontWeight: '600' }}>Agentic AI Visualizer</h2>
          
          <div className="login-branding" style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
            <div className="nowgentic-logo">
              {/* Using the SVG file from public directory with correct filename */}
              <img 
                src="/images/nowgenticLogo.svg" 
                alt="NOWGENTIC Logo" 
                width={120} 
                height={30} 
                style={{ display: 'block' }}
              />
            </div>
          </div>
          
          <p className="login-subtitle" style={{ fontSize: '0.9rem', color: '#666', margin: '0' }}>
            Connect to your ServiceNow instance to visualize Agentic AI flows
          </p>
        </div>
        
        <div className="login-form" style={{ padding: '0 1.5rem' }}>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label htmlFor="instanceUrl" style={{ display: 'flex', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                <line x1="8" y1="21" x2="16" y2="21"></line>
                <line x1="12" y1="17" x2="12" y2="21"></line>
              </svg>
              Instance URL
            </label>
            <input
              type="text"
              id="instanceUrl"
              value={instanceUrl}
              onChange={(e) => setInstanceUrl(e.target.value)}
              placeholder="your-instance.service-now.com"
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem', color: '#444' }}
            />
          </div>
          
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label htmlFor="scopeId" style={{ display: 'flex', alignItems: 'center', fontWeight: '500', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              Application Scope Sys ID
            </label>
            <input
              type="text"
              id="scopeId"
              value={scopeId}
              onChange={(e) => setScopeId(e.target.value)}
              placeholder="Enter the sys_id of the target scope"
              readOnly
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.9rem', color: '#444' }}
            />
          </div>
          
          <div style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '0.85rem', color: '#666', margin: '0', display: 'flex', alignItems: 'center' }}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 6v6l4 2"></path>
              </svg>
              <strong>Secure Connection:</strong> Authentication is handled server-side using environment variables.
            </p>
          </div>
        </div>
        
        {error && (
          <div className="login-error" style={{ margin: '0 1.5rem 1.5rem', padding: '0.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px', display: 'flex', alignItems: 'center' }}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            {error}
          </div>
        )}
        
        <button
          onClick={handleFetchData}
          disabled={isLoading}
          className="login-button"
          style={{ 
            width: 'calc(100% - 3rem)', 
            margin: '0 1.5rem 1.5rem',
            padding: '0.75rem 1rem',
            backgroundColor: '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          {isLoading ? (
            <>
              <svg className="spinner" viewBox="0 0 50 50" style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem', animation: 'spin 1s linear infinite' }}>
                <circle className="path" cx="25" cy="25" r="20" fill="none" stroke="white" strokeWidth="5"></circle>
              </svg>
              Connecting...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}>
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
              Connect & Visualize
            </>
          )}
        </button>
        
        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Or explore our client intelligence tools:
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => window.location.href = '/profiles'}
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#3498db',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              Client Profiles
            </button>
            <button
              type="button"
              onClick={() => window.location.href = '/timeline'}
              className="btn btn-secondary"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#10b981',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              AI Timeline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


================================================
FILE: app/components/flow/FlowCanvas.js
================================================
'use client';

import React, { useCallback, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  Panel,
  addEdge
} from 'reactflow';

import UseCaseNode from '../nodes/UseCaseNode';
import TriggerNode from '../nodes/TriggerNode';
import AgentNode from '../nodes/AgentNode';
import ToolNode from '../nodes/ToolNode';

// Define node types outside of the component to avoid recreation on each render
const nodeTypes = {
  useCaseNode: UseCaseNode,
  triggerNode: TriggerNode,
  agentNode: AgentNode,
  toolNode: ToolNode,
};

export default function FlowCanvas({ 
  nodes, 
  edges, 
  onNodesChange, 
  onEdgesChange, 
  onNodeClick,
  selectedNode,
  lastUpdate,
  layoutDirection,
  toggleNodeExpansion
}) {
  
  // Add the required props to each node object
  const nodesWithProps = useMemo(() => {
    return nodes.map(node => ({
      ...node,
      data: {
        ...node.data,
        layoutDirection,
        onToggle: toggleNodeExpansion
      }
    }));
  }, [nodes, layoutDirection, toggleNodeExpansion]);

  // Handle edge connections
  const onConnect = useCallback(
    (params) => onEdgesChange((eds) => addEdge(params, eds)),
    [onEdgesChange]
  );

  return (
    <ReactFlow
      nodes={nodesWithProps}
      edges={edges.filter(edge => !edge.hidden)}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      nodeTypes={nodeTypes}
      fitView
      fitViewOptions={{
        padding: 0.6,
        includeHiddenNodes: false,
        duration: 800,
        minZoom: 0.3,
        maxZoom: 1.5
      }}
      minZoom={0.1}
      maxZoom={2}
      defaultViewport={{ zoom: 0.75, x: 0, y: 0 }}
      style={{ background: '#f8f8f8' }}
    >
      <Controls />
      <MiniMap />
      <Background variant="dots" gap={12} size={1} />
      

      
      {selectedNode && (
        <Panel position="bottom-right" className="details-panel">
          <div className="details-title">Selected: {selectedNode.data.label}</div>
          <div className="details-content">
            <div className="details-field">
              <span className="details-label">Type:</span>
              <span className="details-value">{selectedNode.data.type}</span>
            </div>
            <div className="details-field">
              <span className="details-label">Level:</span>
              <span className="details-value">{selectedNode.data.level}</span>
            </div>
            <div className="details-field">
              <span className="details-label">Children:</span>
              <span className="details-value">{selectedNode.data.childrenCount}</span>
            </div>
            <div className="details-field">
              <span className="details-label">Collapsed:</span>
              <span className="details-value">{selectedNode.data.isCollapsed ? 'Yes' : 'No'}</span>
            </div>
            {selectedNode.data.description && (
              <div className="details-field">
                <span className="details-label">Description:</span>
                <span className="details-value">{selectedNode.data.description}</span>
              </div>
            )}
            {selectedNode.data.role && (
              <div className="details-field">
                <span className="details-label">Role:</span>
                <span className="details-value">{selectedNode.data.role}</span>
              </div>
            )}
          </div>
        </Panel>
      )}
    </ReactFlow>
  );
} 


================================================
FILE: app/components/nodes/AgentNode.js
================================================
'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function AgentNode({ data, id }) {
  // Extract all props directly from the data object passed by FlowVisualizer
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, role, details
  } = data || {}; // Access data directly
  
  // Get ServiceNow URL from store
  const serviceNowUrl = useAgenticStore(state => state.serviceNowUrl);
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', id);
    }
  }, [id, onToggle]);

  // Handle external link click
  const handleExternalLinkClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('AgentNode external link clicked:', {
      serviceNowUrl,
      details,
      sys_id: details?.sys_id,
      hasDetails: !!details,
    });
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'agent', details?.sys_id);
    
    console.log('Generated URL:', url);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id]);
  
  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node agent-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header">
        <div className="header-content">
          <div className="node-type">AGENT</div>
          <div className="node-title">{label}</div>
        </div>
        
        <div className="node-header-buttons">
          {canNavigate && (
            <button 
              className="node-external-link"
              onClick={handleExternalLinkClick}
              onMouseDown={(e) => e.stopPropagation()}
              title="Open in ServiceNow"
            >
              <ExternalLinkIcon />
            </button>
          )}
          
          {hasChildren && (
            <button 
              className="expand-button"
              onClick={handleToggle}
              onMouseDown={(e) => e.stopPropagation()}
              title={isCollapsed ? "Show child nodes" : "Hide child nodes"}
            >
              {isCollapsed ? '+' : '−'}
            </button>
          )}
        </div>
      </div>
      <div className="node-content">
        {description && (
          <div className="node-description">{description}</div>
        )}
        {role && (
          <div className="node-field">
            <span className="field-label">Role:</span> {role}
          </div>
        )}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(AgentNode); 


================================================
FILE: app/components/nodes/ToolNode.js
================================================
'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function ToolNode({ data, id }) {
  // Extract all props directly from the data object passed by FlowVisualizer
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, toolType, details
  } = data || {}; // Access data directly
  
  // Get ServiceNow URL from store
  const serviceNowUrl = useAgenticStore(state => state.serviceNowUrl);
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;
  
  // Toggle collapse state
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', id);
    }
  }, [id, onToggle]);
  
  // Handle external link click
  const handleExternalLinkClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('ToolNode external link clicked:', {
      serviceNowUrl,
      details,
      sys_id: details?.sys_id,
      toolType,
      hasDetails: !!details,
    });
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'tool', details?.sys_id, toolType);
    
    console.log('Generated URL:', url);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id, toolType]);

  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node tool-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header">
        <div className="header-content">
          <div className="node-type">TOOL</div>
          <div className="node-title">{label}</div>
        </div>
        
        <div className="node-header-buttons">
          {canNavigate && (
            <button 
              className="node-external-link"
              onClick={handleExternalLinkClick}
              onMouseDown={(e) => e.stopPropagation()}
              title="Open in ServiceNow"
            >
              <ExternalLinkIcon />
            </button>
          )}
          
          {hasChildren && (
            <button 
              className="expand-button"
              onClick={handleToggle}
              onMouseDown={(e) => e.stopPropagation()}
              title={isCollapsed ? "Show child nodes" : "Hide child nodes"}
            >
              {isCollapsed ? '+' : '−'}
            </button>
          )}
        </div>
      </div>
      <div className="node-content">
        {description && (
          <div className="node-description">{description}</div>
        )}
        {toolType && (
          <div className="node-field">
            <span className="field-label">Type:</span> {toolType}
          </div>
        )}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ToolNode); 


================================================
FILE: app/components/nodes/TriggerNode.js
================================================
'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { ExternalLinkIcon, generateServiceNowUrl } from '../../utils/nodeUtils';

function TriggerNode({ data, id }) { 
  // Extract all props directly from the data object passed by FlowVisualizer
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, condition, details
  } = data || {}; // Access data directly
  
  // Get ServiceNow URL from store
  const serviceNowUrl = useAgenticStore(state => state.serviceNowUrl);
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state (keep for potential future use, though Triggers don't have children now)
  const handleToggle = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    console.log('Toggle clicked for trigger node:', id, 'Current collapsed state:', isCollapsed);
    if (typeof onToggle === 'function') {
      onToggle(id);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', id);
    }
  }, [id, onToggle, isCollapsed]);
  
  // Handle external link click
  const handleExternalLinkClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('TriggerNode external link clicked:', {
      serviceNowUrl,
      details,
      sys_id: details?.sys_id,
      hasDetails: !!details,
    });
    
    // Generate URL using the utility function
    const url = generateServiceNowUrl(serviceNowUrl, 'trigger', details?.sys_id);
    
    console.log('Generated URL:', url);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id]);
  
  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node trigger-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      {/* Header now only contains the type */}
      <div className="node-header">
        <div className="node-type">TRIGGER</div>
        
        <div className="node-header-buttons">
          {canNavigate && (
            <button 
              className="node-external-link"
              onClick={handleExternalLinkClick}
              onMouseDown={(e) => e.stopPropagation()}
              title="Open in ServiceNow"
            >
              <ExternalLinkIcon />
            </button>
          )}
          
          {/* Keep expand button logic if needed */}
          {hasChildren && (
            <button 
              className="expand-button" 
              onClick={handleToggle}
              onMouseDown={(e) => e.stopPropagation()}
              title={isCollapsed ? "Show child nodes" : "Hide child nodes"}
            >
              {isCollapsed ? '+' : '−'}
            </button>
          )}
        </div>
      </div>

      {/* Content area holds the objective (label) and description */}
      <div className="node-content">
        {/* Display the objective (label) as main body text */}
        {label && (
          <div className="trigger-objective-body">{label}</div>
        )}
        {/* Display condition if present */}
        {condition && (
          <div className="node-condition">
            <div className="condition-label">Condition:</div>
            <div className="condition-value">{condition}</div>
          </div>
        )}
        {/* Display description below objective if present */}
        {description && (
          <div className="node-description">{description}</div>
        )}
        {/* Children info (though likely unused for triggers) */}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(TriggerNode); 


================================================
FILE: app/components/nodes/UseCaseNode.js
================================================
'use client';

import { memo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import useAgenticStore from '../../store/useAgenticStore';
import { NodeHeaderButtons } from '../NodeIcons';

function UseCaseNode({ data, id }) {
  // Extract all props directly from the data object
  const { 
    layoutDirection, onToggle, isCollapsed, label, childrenCount, 
    description, details
  } = data || {}; // Access data directly
  
  // Get ServiceNow URL from store
  const serviceNowUrl = useAgenticStore(state => state.serviceNowUrl);
  
  // Determine handle positions based on layout direction
  const targetPosition = layoutDirection === 'TB' ? Position.Top : Position.Left;
  const sourcePosition = layoutDirection === 'TB' ? Position.Bottom : Position.Right;

  // Toggle collapse state
  const handleToggle = useCallback((nodeId) => {
    console.log('Toggle clicked for use case node:', nodeId, 'Current collapsed state:', isCollapsed);
    
    // Call the parent's toggle function if available
    if (typeof onToggle === 'function') {
      onToggle(nodeId);
    } else {
      console.warn('onToggle prop is not a function or is missing for node:', nodeId);
    }
  }, [onToggle, isCollapsed]);

  // Handle external link click
  const handleExternalLinkClick = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();
    
    console.log('UseCaseNode external link clicked:', {
      serviceNowUrl,
      details,
      sys_id: details?.sys_id,
      hasDetails: !!details,
    });
    
    // Generate URL for the ServiceNow use case
    const url = serviceNowUrl && details?.sys_id ? 
      `${serviceNowUrl}/now/agent-studio/usecase-guided-setup/${details.sys_id}/params/step/details` : 
      null;
    
    console.log('Generated URL:', url);
    
    if (url) {
      // Open link in new tab
      window.open(url, '_blank', 'noopener,noreferrer');
    } else {
      console.warn('Cannot navigate: ServiceNow URL or sys_id missing');
    }
  }, [serviceNowUrl, details?.sys_id]);

  // Only show the toggle button if this node has children
  const hasChildren = childrenCount > 0;
  
  // Only show external link if we have a ServiceNow URL and sys_id
  const canNavigate = Boolean(serviceNowUrl && details?.sys_id);

  return (
    <div className="node use-case-node"
         onClick={(e) => e.stopPropagation()}>
      <Handle type="target" position={targetPosition} />
      <Handle type="source" position={sourcePosition} />
      
      <div className="node-header use-case-header">
        <div className="header-content">
          <div className="node-type">USE CASE</div>
          <div className="node-title">{label}</div>
        </div>
        
        <NodeHeaderButtons 
          id={id}
          isCollapsed={isCollapsed}
          hasChildren={hasChildren}
          onToggle={handleToggle}
          canNavigate={canNavigate}
          onExternalLinkClick={handleExternalLinkClick}
        />
      </div>
      <div className="node-content">
        {description && (
          <div className="node-description">{description}</div>
        )}
        {hasChildren && (
          <div className="node-children-info">
            {childrenCount} child node{childrenCount !== 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(UseCaseNode); 


================================================
FILE: app/hooks/useFlowData.js
================================================
'use client';

import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { transformAgenticData } from '../utils/transformAgenticData';
import { applyDagreLayout } from '../utils/layoutGraph';

export function useFlowData(agenticData, layoutDirection, setNodes, setEdges, onError) {
  const reactFlowInstance = useReactFlow();

  // Load nodes and edges when agenticData changes
  useEffect(() => {
    if (agenticData) {
      try {
        // Get raw nodes and edges without layout applied
        const { nodes: rawNodes, edges: rawEdges } = transformAgenticData(agenticData);
        
        // Check if we got valid data back
        if (!rawNodes.length && !rawEdges.length) {
          throw new Error('Unable to transform the data into a valid flow diagram');
        }
        
        console.log(`Successfully transformed data: ${rawNodes.length} nodes, ${rawEdges.length} edges`);
        
        // Create a map to identify parent-child relationships
        const childrenMap = {};
        rawNodes.forEach(node => {
          if (node.data.parentId) {
            if (!childrenMap[node.data.parentId]) {
              childrenMap[node.data.parentId] = [];
            }
            childrenMap[node.data.parentId].push(node.id);
          }
        });
        
        // Set initial collapse/hidden states
        const initializedNodes = rawNodes.map(node => {
          const nodeChildren = childrenMap[node.id] || [];
          const hasChildren = nodeChildren.length > 0;
          
          if (node.data.level === 0) {
            return {
              ...node,
              data: { ...node.data, isCollapsed: true, childrenCount: nodeChildren.length },
              hidden: false // Top-level nodes are visible
            };
          } else {
            return {
              ...node,
              data: { ...node.data, isCollapsed: hasChildren, childrenCount: nodeChildren.length },
              hidden: true // Child nodes are hidden initially
            };
          }
        });
        
        // --- Apply Initial Layout --- 
        // Filter for initially visible nodes (top-level use cases)
        const visibleNodesInitial = initializedNodes.filter(node => !node.hidden);
        const visibleNodeIdsInitial = new Set(visibleNodesInitial.map(node => node.id));
        
        // Filter edges to include only those connecting visible nodes
        const visibleEdgesInitial = rawEdges.filter(edge => 
          visibleNodeIdsInitial.has(edge.source) && visibleNodeIdsInitial.has(edge.target)
        );

        // Apply layout only to visible nodes/edges
        const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
          visibleNodesInitial,
          visibleEdgesInitial,
          {
            direction: layoutDirection,
            nodeSeparation: 200,
            rankSeparation: 300,
          }
        );
        
        // Merge layout positions back into the *full* initializedNodes array
        const finalNodes = initializedNodes.map(node => {
          const layoutedNode = layoutedNodes.find(n => n.id === node.id);
          if (layoutedNode) {
            // Apply layout position only if the node was part of the layout
            return { ...node, position: layoutedNode.position };
          }
          // Keep original position (likely 0,0) for hidden nodes
          return node; 
        });

        // Set the final state for nodes and edges
        setNodes(finalNodes);
        setEdges(rawEdges); 
        
        // Trigger fitView after layout is applied
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance?.fitView?.({
              padding: 0.6,
              includeHiddenNodes: false,
              duration: 800,
              minZoom: 0.3,
              maxZoom: 1.5
            });
          }, 400);
        });
      } catch (error) {
        console.error("Error processing agentic data:", error);
        if (onError) {
          onError(error);
        }
      }
    }
  }, [agenticData, layoutDirection, setNodes, setEdges, reactFlowInstance, onError]);
} 


================================================
FILE: app/hooks/useFlowLayout.js
================================================
'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { applyDagreLayout } from '../utils/layoutGraph';

export function useFlowLayout(nodes, setNodes, edges, setEdges) {
  const [layoutDirection, setLayoutDirection] = useState('LR');
  const [autoFitEnabled, setAutoFitEnabled] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('');
  const reactFlowInstance = useReactFlow();
  
  // Track node collapse changes to prevent infinite layout re-rendering
  const lastCollapseStateRef = useRef({});
  const isLayoutNecessaryRef = useRef(false);

  // Helper function to recursively update visibility of all descendants
  const updateDescendantVisibility = useCallback((nodes, parentId, hidden) => {
    // Find all immediate children of the parent
    const children = nodes.filter(node => node.data.parentId === parentId);
    
    children.forEach(child => {
      // Find the child in the nodes array
      const childIndex = nodes.findIndex(n => n.id === child.id);
      if (childIndex !== -1) {
        // Check if this child has its own children
        const grandChildren = nodes.filter(n => n.data.parentId === child.id);
        const hasGrandChildren = grandChildren.length > 0;
        
        // Update this child's visibility
        nodes[childIndex] = {
          ...nodes[childIndex],
          hidden: hidden,
          data: {
            ...nodes[childIndex].data,
            // If this node has children and is being hidden, ensure it's set to collapsed state
            isCollapsed: hasGrandChildren ? true : nodes[childIndex].data.isCollapsed
          }
        };
        
        // Recursively update this child's descendants
        updateDescendantVisibility(nodes, child.id, hidden);
      }
    });
    
    return nodes;
  }, []);

  // Toggle node expansion/collapse
  const toggleNodeExpansion = useCallback((nodeId) => {
    console.log(`Toggle expansion for node: ${nodeId}`);
    
    setNodes(currentNodes => {
      const nodeIndex = currentNodes.findIndex(n => n.id === nodeId);
      if (nodeIndex === -1) {
        console.error(`Node with id ${nodeId} not found`);
        return currentNodes;
      }

      const node = currentNodes[nodeIndex];
      const isCollapsed = !node.data.isCollapsed;
      
      console.log(`Setting node ${nodeId} collapsed state to: ${isCollapsed}`);
      
      // First update the node's collapse state
      const updatedNodes = [...currentNodes];
      updatedNodes[nodeIndex] = {
        ...node,
        data: {
          ...node.data,
          isCollapsed
        }
      };
      
      // Find immediate children of this node
      const childNodes = currentNodes.filter(n => n.data.parentId === nodeId);
      const hasChildren = childNodes.length > 0;
      
      if (hasChildren) {
        console.log(`Node ${nodeId} has ${childNodes.length} children, updating their visibility`);
        
        // Update visibility of all child nodes based on collapse state
        childNodes.forEach(childNode => {
          const childIndex = updatedNodes.findIndex(n => n.id === childNode.id);
          if (childIndex !== -1) {
            // Check if this child has its own children
            const grandChildren = currentNodes.filter(n => n.data.parentId === childNode.id);
            const hasGrandChildren = grandChildren.length > 0;
            
            updatedNodes[childIndex] = {
              ...updatedNodes[childIndex],
              hidden: isCollapsed, // Hide child if parent is collapsed
              data: {
                ...updatedNodes[childIndex].data,
                // If this child has children, ensure it's set to collapsed state when becoming visible
                isCollapsed: hasGrandChildren ? true : updatedNodes[childIndex].data.isCollapsed
              }
            };
            
            // If we're collapsing, also collapse any grandchildren
            if (isCollapsed) {
              // Recursively hide all descendants
              updateDescendantVisibility(updatedNodes, childNode.id, true);
            }
          }
        });
        
        setLastUpdate(`${nodeId} ${isCollapsed ? 'collapsed' : 'expanded'} at ${new Date().toLocaleTimeString()}`);
        isLayoutNecessaryRef.current = true;
        
        // Get visible node IDs after update
        const visibleNodeIds = new Set(
          updatedNodes
            .filter(node => !node.hidden)
            .map(node => node.id)
        );
        
        // Update edges visibility
        setEdges(currentEdges => 
          currentEdges.map(edge => ({
            ...edge,
            hidden: !(visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
          }))
        );
        
        // Only fit view if autoFitEnabled is enabled
        if (autoFitEnabled) {
          window.requestAnimationFrame(() => {
            setTimeout(() => {
              reactFlowInstance.fitView({
                padding: 0.6,
                includeHiddenNodes: false,
                duration: 800,
                minZoom: 0.3,
                maxZoom: 1.5
              });
            }, 400);
          });
        }
      }
      
      return updatedNodes;
    });
  }, [setNodes, setEdges, reactFlowInstance, updateDescendantVisibility, autoFitEnabled]);

  // Expand all nodes
  const expandAllNodes = useCallback(() => {
    setLastUpdate(`Expanding all nodes: ${new Date().toLocaleTimeString()}`);
    
    setNodes(nodes => {
      // Mark all nodes as expanded and visible
      const expandedNodes = nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          isCollapsed: false
        },
        hidden: false
      }));
      
      // Show all edges
      setEdges(currentEdges => 
        currentEdges.map(edge => ({ ...edge, hidden: false }))
      );
      
      // Force layout update
      isLayoutNecessaryRef.current = true;
      
      if (autoFitEnabled) {
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance.fitView({
              padding: 0.3,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 1.5
            });
          }, 300);
        });
      }
      
      return expandedNodes;
    });
  }, [setNodes, setEdges, reactFlowInstance, autoFitEnabled]);

  // Collapse all nodes to show only use cases
  const collapseAllNodes = useCallback(() => {
    setLastUpdate(`Collapsing to show only top-level nodes: ${new Date().toLocaleTimeString()}`);
    
    setNodes(nodes => {
      const updatedNodes = nodes.map(node => {
        // Top level nodes (use cases) - expanded
        if (node.data.level === 0) {
          return {
            ...node,
            data: {
              ...node.data,
              isCollapsed: true
            },
            hidden: false
          };
        }
        // All other nodes - hidden
        return {
          ...node,
          data: {
            ...node.data,
            isCollapsed: true
          },
          hidden: true
        };
      });
      
      // Get visible node IDs after collapse
      const visibleNodeIds = new Set(
        updatedNodes
          .filter(node => !node.hidden)
          .map(node => node.id)
      );
      
      // Update edges visibility in the next tick
      setTimeout(() => {
        setEdges(currentEdges => 
          currentEdges.map(edge => ({
            ...edge,
            hidden: !(visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target))
          }))
        );
      }, 0);
      
      // Force layout update
      isLayoutNecessaryRef.current = true;
      
      if (autoFitEnabled) {
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance.fitView({
              padding: 0.3,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 1.5
            });
          }, 300);
        });
      }
      
      return updatedNodes;
    });
  }, [setNodes, setEdges, reactFlowInstance, autoFitEnabled]);

  // Apply layout when needed
  useEffect(() => {
    if (nodes.length === 0 || edges.length === 0) return;
    
    // Check if any collapse states have changed
    let hasCollapseStateChanged = false;
    const currentCollapseState = {};
    const changedNodeIds = [];
    
    nodes.forEach(node => {
      if (node.data && node.data.isCollapsed !== undefined) {
        currentCollapseState[node.id] = node.data.isCollapsed;
        if (lastCollapseStateRef.current[node.id] !== node.data.isCollapsed) {
          hasCollapseStateChanged = true;
          changedNodeIds.push(node.id);
        }
      }
    });
    
    // Only re-layout if collapse state changed or layout was requested
    if (hasCollapseStateChanged || isLayoutNecessaryRef.current) {
      const updateType = hasCollapseStateChanged ? 
        `Node(s) ${changedNodeIds.join(', ')} toggled` : 
        'Layout direction changed';
      
      setLastUpdate(`${updateType} - applying layout: ${new Date().toLocaleTimeString()}`);
      lastCollapseStateRef.current = {...currentCollapseState};
      isLayoutNecessaryRef.current = false;
      
      // Filter visible nodes for the layout
      const visibleNodes = nodes.filter(node => !node.hidden);
      const visibleNodeIds = new Set(visibleNodes.map(node => node.id));
      
      // Update edge visibility based on connected nodes
      const updatedEdges = edges.map(edge => {
        if (visibleNodeIds.has(edge.source) && visibleNodeIds.has(edge.target)) {
          return { ...edge, hidden: false };
        } else {
          return { ...edge, hidden: true };
        }
      });
      
      // Apply layout with visible nodes and edges
      const { nodes: layoutedNodes, edges: layoutedEdges } = applyDagreLayout(
        visibleNodes,
        updatedEdges,
        {
          direction: layoutDirection,
          nodeSeparation: 200,
          rankSeparation: 300,
        }
      );

      // Merge the new positions into the original nodes array
      const mergedNodes = nodes.map(node => {
        const layoutedNode = layoutedNodes.find(n => n.id === node.id);
        if (layoutedNode) {
          return {
            ...node,
            position: layoutedNode.position
          };
        }
        return node;
      });

      setNodes(mergedNodes);
      setEdges(layoutedEdges);

      // Only fit view if autoFitEnabled is enabled
      if (autoFitEnabled) {
        window.requestAnimationFrame(() => {
          setTimeout(() => {
            reactFlowInstance.fitView({ 
              padding: 0.6,
              includeHiddenNodes: false,
              duration: 800,
              minZoom: 0.3,
              maxZoom: 1.5
            });
          }, 400);
        });
      }
    }
  }, [nodes, edges, layoutDirection, setNodes, setEdges, reactFlowInstance, autoFitEnabled]);

  // Handle layout direction change
  const handleLayoutChange = useCallback((direction) => {
    setLayoutDirection(direction);
    isLayoutNecessaryRef.current = true;
    setLastUpdate(`Layout direction changed to ${direction}: ${new Date().toLocaleTimeString()}`);
  }, []);

  return {
    layoutDirection,
    autoFitEnabled,
    lastUpdate,
    setAutoFitEnabled,
    toggleNodeExpansion,
    expandAllNodes,
    collapseAllNodes,
    handleLayoutChange
  };
} 


================================================
FILE: app/profiles/page.js
================================================
'use client';

import React, { useState, useEffect } from 'react';
import { ProfileService } from '../services/profileService';
import { demoDataService } from '../services/demoDataService';
import ProfileWizard from './components/ProfileWizard';

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState([]);
  const [showWizard, setShowWizard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const profileList = await ProfileService.getProfiles();
      setProfiles(profileList);
    } catch (error) {
      console.error('Error loading profiles:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateProfile = () => {
    setShowWizard(true);
  };

  const loadDemoProfiles = async () => {
    try {
      const demoProfiles = demoDataService.getDemoProfiles();
      
      // Convert demo data to saved profiles
      for (const demoData of demoProfiles) {
        const profile = await ProfileService.createProfile(demoData);
        setProfiles(prev => [...prev, profile]);
      }
    } catch (error) {
      console.error('Error loading demo profiles:', error);
    }
  };

  const handleWizardComplete = (profile) => {
    setProfiles(prev => [...prev, profile]);
    setShowWizard(false);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
  };

  const handleViewProfile = (profileId) => {
    window.location.href = `/profiles/${profileId}`;
  };

  const handleGenerateTimeline = async (profile) => {
    try {
      // Navigate to timeline with profile context
      window.location.href = `/timeline?profileId=${profile.id}`;
    } catch (error) {
      console.error('Error generating timeline:', error);
    }
  };

  if (showWizard) {
    return (
      <ProfileWizard
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    );
  }

  return (
    <div className="profiles-page">
      <div className="profiles-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={() => window.location.href = '/'}
            aria-label="Back to Flow Visualizer"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div className="header-title-section">
            <h1 className="profiles-title">Client Profiles</h1>
            <p className="profiles-subtitle">Manage your client intelligence and AI transformation roadmaps</p>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-primary"
              onClick={handleCreateProfile}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14"></path>
                <path d="M5 12h14"></path>
              </svg>
              New Profile
            </button>
          </div>
        </div>
      </div>

      <div className="profiles-content">
        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading profiles...</p>
          </div>
        ) : profiles.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h2>No Client Profiles Yet</h2>
            <p>Create your first client profile to start building comprehensive business intelligence and AI transformation roadmaps.</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                className="btn btn-primary btn-large"
                onClick={handleCreateProfile}
              >
                Create Your First Profile
              </button>
              <button 
                className="btn btn-secondary btn-large"
                onClick={loadDemoProfiles}
              >
                📊 Load Demo Profiles
              </button>
            </div>
          </div>
        ) : (
          <div className="profiles-grid">
            {profiles.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onView={() => handleViewProfile(profile.id)}
                onGenerateTimeline={() => handleGenerateTimeline(profile)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileCard({ profile, onView, onGenerateTimeline }) {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      'Technology': '💻',
      'Healthcare': '🏥',
      'Finance': '🏦',
      'Manufacturing': '🏭',
      'Retail': '🛍️',
      'Education': '🎓',
      'Real Estate': '🏢',
      'Transportation': '🚛',
      'Energy': '⚡',
      'Other': '🏪'
    };
    return icons[industry] || '🏪';
  };

  const getSizeLabel = (size) => {
    const labels = {
      '1-50 employees': 'Startup',
      '51-200 employees': 'Small',
      '201-1000 employees': 'Medium',
      '1000+ employees': 'Enterprise'
    };
    return labels[size] || size;
  };

  return (
    <div className="profile-card">
      <div className="profile-card-header">
        <div className="profile-icon">
          {getIndustryIcon(profile.industry)}
        </div>
        <div className="profile-meta">
          <h3 className="profile-name">{profile.companyName}</h3>
          <div className="profile-tags">
            <span className="tag industry-tag">{profile.industry}</span>
            <span className="tag size-tag">{getSizeLabel(profile.size)}</span>
          </div>
        </div>
      </div>

      <div className="profile-card-content">
        <div className="profile-stats">
          <div className="stat">
            <span className="stat-label">Created</span>
            <span className="stat-value">{formatDate(profile.createdAt)}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Status</span>
            <span className={`stat-value status-${profile.status}`}>
              {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
            </span>
          </div>
        </div>

        {profile.valueSellingFramework?.businessIssues?.length > 0 && (
          <div className="profile-issues">
            <span className="issues-label">Key Issues:</span>
            <div className="issues-list">
              {profile.valueSellingFramework.businessIssues.slice(0, 2).map((issue, index) => (
                <span key={index} className="issue-tag">{issue}</span>
              ))}
              {profile.valueSellingFramework.businessIssues.length > 2 && (
                <span className="issue-tag more">+{profile.valueSellingFramework.businessIssues.length - 2} more</span>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="profile-card-actions">
        <button 
          className="btn btn-secondary btn-small"
          onClick={onView}
        >
          View Details
        </button>
        <button 
          className="btn btn-primary btn-small"
          onClick={onGenerateTimeline}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="2" x2="12" y2="22"></line>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
          AI Timeline
        </button>
      </div>
    </div>
  );
} 


================================================
FILE: app/profiles/[id]/page.js
================================================
'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ProfileService } from '../../services/profileService';
import { markdownService } from '../../services/markdownService';
import '../profile-detail.css';

export default function ProfileDetailPage() {
  const params = useParams();
  const profileId = params.id;
  
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    loadProfile();
  }, [profileId]);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const profileData = await ProfileService.getProfile(profileId);
      
      if (!profileData) {
        setError('Profile not found');
        return;
      }
      
      setProfile(profileData);
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTimeline = () => {
    window.location.href = `/timeline?profileId=${profileId}`;
  };

  const handleEdit = () => {
    // For now, redirect to profiles page
    // In the future, this could open the wizard in edit mode
    window.location.href = '/profiles';
  };

  const handleBack = () => {
    window.location.href = '/profiles';
  };

  if (isLoading) {
    return (
      <div className="profile-detail-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-detail-page">
        <div className="error-container">
          <h2>Error</h2>
          <p>{error}</p>
          <button className="btn btn-primary" onClick={handleBack}>
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-detail-page">
        <div className="error-container">
          <h2>Profile Not Found</h2>
          <p>The requested profile could not be found.</p>
          <button className="btn btn-primary" onClick={handleBack}>
            Back to Profiles
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getIndustryIcon = (industry) => {
    const icons = {
      'Technology': '💻',
      'Healthcare': '🏥',
      'Finance': '🏦',
      'Manufacturing': '🏭',
      'Retail': '🛍️',
      'Education': '🎓',
      'Real Estate': '🏢',
      'Transportation': '🚛',
      'Energy': '⚡',
      'Other': '🏪'
    };
    return icons[industry] || '🏪';
  };

  return (
    <div className="profile-detail-page">
      {/* Header */}
      <div className="profile-detail-header">
        <div className="header-content">
          <button 
            className="back-button"
            onClick={handleBack}
            aria-label="Back to Profiles"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5"></path>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
          </button>
          
          <div className="header-title-section">
            <div className="company-header">
              <div className="company-icon">
                {getIndustryIcon(profile.industry)}
              </div>
              <div>
                <h1 className="company-name">{profile.companyName}</h1>
                <div className="company-meta">
                  <span className="industry-tag">{profile.industry}</span>
                  <span className="size-tag">{profile.size}</span>
                  <span className="status-tag status-{profile.status}">{profile.status}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="header-actions">
            <button 
              className="btn btn-secondary"
              onClick={handleEdit}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
            <button 
              className="btn btn-primary"
              onClick={handleGenerateTimeline}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="2" x2="12" y2="22"></line>
                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
              </svg>
              Generate AI Timeline
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="profile-detail-nav">
        <button 
          className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={`nav-tab ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Analysis
        </button>
        <button 
          className={`nav-tab ${activeTab === 'opportunities' ? 'active' : ''}`}
          onClick={() => setActiveTab('opportunities')}
        >
          AI Opportunities
        </button>
        <button 
          className={`nav-tab ${activeTab === 'markdown' ? 'active' : ''}`}
          onClick={() => setActiveTab('markdown')}
        >
          Markdown
        </button>
      </div>

      {/* Content */}
      <div className="profile-detail-content">
        {activeTab === 'overview' && (
          <ProfileOverviewTab profile={profile} />
        )}
        
        {activeTab === 'analysis' && (
          <ProfileAnalysisTab profile={profile} />
        )}
        
        {activeTab === 'opportunities' && (
          <ProfileOpportunitiesTab profile={profile} />
        )}
        
        {activeTab === 'markdown' && (
          <ProfileMarkdownTab profile={profile} />
        )}
      </div>

      {/* Footer Info */}
      <div className="profile-detail-footer">
        <div className="footer-content">
          <div className="footer-info">
            <span>Created: {formatDate(profile.createdAt)}</span>
            <span>Updated: {formatDate(profile.updatedAt)}</span>
            <span>ID: {profile.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tab Components
function ProfileOverviewTab({ profile }) {
  return (
    <div className="tab-content overview-tab">
      <div className="overview-grid">
        {/* Company Information */}
        <div className="info-card">
          <h3>Company Information</h3>
          <div className="info-grid">
            <div className="info-item">
              <label>Company Name</label>
              <span>{profile.companyName}</span>
            </div>
            <div className="info-item">
              <label>Industry</label>
              <span>{profile.industry}</span>
            </div>
            <div className="info-item">
              <label>Size</label>
              <span>{profile.size}</span>
            </div>
            <div className="info-item">
              <label>Annual Revenue</label>
              <span>{profile.annualRevenue ? `$${profile.annualRevenue}` : 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Employee Count</label>
              <span>{profile.employeeCount || 'Not specified'}</span>
            </div>
            <div className="info-item">
              <label>Location</label>
              <span>{profile.primaryLocation || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Business Issues */}
        {profile.valueSellingFramework?.businessIssues?.length > 0 && (
          <div className="info-card">
            <h3>Key Business Issues</h3>
            <div className="tags-list">
              {profile.valueSellingFramework.businessIssues.map((issue, index) => (
                <span key={index} className="tag business-issue-tag">{issue}</span>
              ))}
            </div>
            {profile.valueSellingFramework.businessIssueDetails && (
              <div className="details-text">
                <p>{profile.valueSellingFramework.businessIssueDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* Impact Summary */}
        {profile.valueSellingFramework?.impact && (
          <div className="info-card">
            <h3>Impact Analysis</h3>
            <div className="metrics-grid">
              {profile.valueSellingFramework.impact.totalAnnualImpact && (
                <div className="metric-item">
                  <label>Total Annual Impact</label>
                  <span className="metric-value">${parseInt(profile.valueSellingFramework.impact.totalAnnualImpact).toLocaleString()}</span>
                </div>
              )}
              {profile.valueSellingFramework.impact.laborCosts && (
                <div className="metric-item">
                  <label>Labor Costs</label>
                  <span className="metric-value">${parseInt(profile.valueSellingFramework.impact.laborCosts).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AI Readiness */}
        {profile.aiOpportunityAssessment && (
          <div className="info-card">
            <h3>AI Readiness</h3>
            <div className="ai-readiness-display">
              <div className="readiness-score">
                <span className="score-value">{profile.aiOpportunityAssessment.aiReadinessScore || profile.aiReadinessScore || 'N/A'}</span>
                <span className="score-label">/ 10</span>
              </div>
              {profile.aiOpportunityAssessment.currentTechnology && (
                <div className="tech-stack">
                  <label>Current Technology</label>
                  <div className="tech-items">
                    {Object.entries(profile.aiOpportunityAssessment.currentTechnology).map(([key, value]) => (
                      value && (
                        <div key={key} className="tech-item">
                          <span className="tech-label">{key}:</span>
                          <span className="tech-value">{value}</span>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileAnalysisTab({ profile }) {
  return (
    <div className="tab-content analysis-tab">
      <div className="analysis-sections">
        {/* Decision Makers */}
        {profile.valueSellingFramework?.decisionMakers && (
          <div className="analysis-card">
            <h3>Decision Makers</h3>
            <div className="decision-makers-grid">
              {profile.valueSellingFramework.decisionMakers.economicBuyer?.name && (
                <div className="decision-maker">
                  <h4>Economic Buyer</h4>
                  <p><strong>{profile.valueSellingFramework.decisionMakers.economicBuyer.name}</strong></p>
                  <p>{profile.valueSellingFramework.decisionMakers.economicBuyer.title}</p>
                  {profile.valueSellingFramework.decisionMakers.economicBuyer.budget && (
                    <p>Budget: ${parseInt(profile.valueSellingFramework.decisionMakers.economicBuyer.budget).toLocaleString()}</p>
                  )}
                </div>
              )}
              
              {profile.valueSellingFramework.decisionMakers.technicalBuyer?.name && (
                <div className="decision-maker">
                  <h4>Technical Buyer</h4>
                  <p><strong>{profile.valueSellingFramework.decisionMakers.technicalBuyer.name}</strong></p>
                  <p>{profile.valueSellingFramework.decisionMakers.technicalBuyer.title}</p>
                </div>
              )}
              
              {profile.valueSellingFramework.decisionMakers.champion?.name && (
                <div className="decision-maker">
                  <h4>Champion</h4>
                  <p><strong>{profile.valueSellingFramework.decisionMakers.champion.name}</strong></p>
                  <p>{profile.valueSellingFramework.decisionMakers.champion.title}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Solution Requirements */}
        {profile.valueSellingFramework?.solutionCapabilities?.length > 0 && (
          <div className="analysis-card">
            <h3>Solution Requirements</h3>
            <div className="capabilities-list">
              {profile.valueSellingFramework.solutionCapabilities.map((capability, index) => (
                <div key={index} className="capability-item">
                  <span className="capability-icon">✓</span>
                  <span>{capability}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ROI Expectations */}
        {profile.valueSellingFramework?.roiExpectations && (
          <div className="analysis-card">
            <h3>ROI Expectations</h3>
            <div className="roi-grid">
              {Object.entries(profile.valueSellingFramework.roiExpectations).map(([key, value]) => (
                value && (
                  <div key={key} className="roi-item">
                    <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <span>{value}</span>
                  </div>
                )
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProfileOpportunitiesTab({ profile }) {
  const opportunities = profile.aiOpportunityAssessment?.opportunities || [];
  const quickWins = profile.aiOpportunityAssessment?.quickWins || [];

  return (
    <div className="tab-content opportunities-tab">
      {opportunities.length > 0 && (
        <div className="opportunities-section">
          <h3>AI Opportunities</h3>
          <div className="opportunities-grid">
            {opportunities.map((opportunity, index) => (
              <div key={index} className="opportunity-card">
                <div className="opportunity-header">
                  <h4>{opportunity.name}</h4>
                  <span className="priority-badge priority-{opportunity.priorityScore > 7 ? 'high' : opportunity.priorityScore > 4 ? 'medium' : 'low'}">
                    Priority: {opportunity.priorityScore}/10
                  </span>
                </div>
                <div className="opportunity-details">
                  <p><strong>Department:</strong> {opportunity.department}</p>
                  <p><strong>Process:</strong> {opportunity.process}</p>
                  <p><strong>Current State:</strong> {opportunity.currentState}</p>
                  <p><strong>AI Solution:</strong> {opportunity.aiSolution}</p>
                  <p><strong>Estimated Impact:</strong> ${parseInt(opportunity.estimatedImpact || 0).toLocaleString()}</p>
                  <p><strong>Timeline:</strong> {opportunity.timeline}</p>
                  <p><strong>Effort:</strong> {opportunity.implementationEffort}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {quickWins.length > 0 && (
        <div className="quick-wins-section">
          <h3>Quick Wins (0-6 months)</h3>
          <div className="quick-wins-grid">
            {quickWins.map((quickWin, index) => (
              <div key={index} className="quick-win-card">
                <h4>{quickWin.name}</h4>
                <div className="quick-win-details">
                  <span className="impact">${parseInt(quickWin.impact || 0).toLocaleString()} impact</span>
                  <span className="timeline">{quickWin.timeline}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {opportunities.length === 0 && quickWins.length === 0 && (
        <div className="empty-opportunities">
          <p>No AI opportunities identified yet. Complete the AI assessment section to generate recommendations.</p>
        </div>
      )}
    </div>
  );
}

function ProfileMarkdownTab({ profile }) {
  const markdown = profile.markdown || markdownService.generateMarkdown(profile);

  return (
    <div className="tab-content markdown-tab">
      <div className="markdown-container">
        <div className="markdown-header">
          <h3>Profile Markdown</h3>
          <button 
            className="btn btn-secondary btn-small"
            onClick={() => navigator.clipboard.writeText(markdown)}
          >
            Copy to Clipboard
          </button>
        </div>
        <pre className="markdown-content">
          {markdown}
        </pre>
      </div>
    </div>
  );
} 


================================================
FILE: app/profiles/components/ProfileWizard.js
================================================
'use client';

import React, { useState } from 'react';
import { ProfileService } from '../../services/profileService';
import { markdownService } from '../../services/markdownService';
import { demoDataService } from '../../services/demoDataService';

const WIZARD_STEPS = [
  { id: 'company', title: 'Company Overview', icon: '🏢' },
  { id: 'business-issue', title: 'Business Issue', icon: '🎯' },
  { id: 'problems', title: 'Problems & Challenges', icon: '⚠️' },
  { id: 'impact', title: 'Impact Analysis', icon: '💰' },
  { id: 'solution', title: 'Solution Requirements', icon: '🔧' },
  { id: 'decision', title: 'Decision Process', icon: '👥' },
  { id: 'ai-assessment', title: 'AI Opportunities', icon: '🤖' },
  { id: 'summary', title: 'Summary & Next Steps', icon: '📋' }
];

export default function ProfileWizard({ onComplete, onCancel, initialData }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [profileData, setProfileData] = useState(initialData || {
    companyName: '',
    industry: '',
    size: '',
    annualRevenue: '',
    employeeCount: '',
    primaryLocation: '',
    valueSellingFramework: {
      businessIssues: [],
      problems: {
        finance: {},
        hr: {},
        it: {},
        customerService: {},
        operations: {}
      },
      impact: {},
      solutionCapabilities: [],
      decisionMakers: {},
      buyingProcess: {},
      risksOfInaction: {}
    },
    aiOpportunityAssessment: {
      currentTechnology: {},
      aiReadinessScore: 5,
      opportunities: [],
      quickWins: [],
      strategicInitiatives: [],
      futureOpportunities: []
    },
    summary: {
      nextSteps: []
    }
  });
  
  const [isGeneratingTimeline, setIsGeneratingTimeline] = useState(false);
  const [showMarkdownPreview, setShowMarkdownPreview] = useState(false);

  const updateProfileData = (path, value) => {
    setProfileData(prev => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const handleArrayToggle = (path, value) => {
    const currentArray = getNestedValue(profileData, path) || [];
    const newArray = currentArray.includes(value)
      ? currentArray.filter(item => item !== value)
      : [...currentArray, value];
    updateProfileData(path, newArray);
  };

  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Company Overview
        return profileData.companyName && profileData.industry && profileData.size;
      case 1: // Business Issue
        return getNestedValue(profileData, 'valueSellingFramework.businessIssues')?.length > 0;
      case 2: // Problems
        return true; // Optional step
      case 3: // Impact
        return getNestedValue(profileData, 'valueSellingFramework.impact.totalAnnualImpact');
      case 4: // Solution
        return getNestedValue(profileData, 'valueSellingFramework.solutionCapabilities')?.length > 0;
      case 5: // Decision
        return getNestedValue(profileData, 'valueSellingFramework.decisionMakers.economicBuyer.name');
      case 6: // AI Assessment
        return profileData.aiOpportunityAssessment?.aiReadinessScore;
      case 7: // Summary
        return true;
      default:
        return false;
    }
  };

  const handleComplete = async () => {
    try {
      const profile = await ProfileService.createProfile(profileData);
      onComplete(profile);
    } catch (error) {
      console.error('Error creating profile:', error);
    }
  };

  const generateTimelineFromProfile = async () => {
    try {
      setIsGeneratingTimeline(true);
      const timeline = await ProfileService.generateTimelineFromProfile(profileData);
      
      // Navigate to timeline page with profile data
      window.location.href = `/profiles/${profileData.id || 'new'}/timeline`;
    } catch (error) {
      console.error('Error generating timeline:', error);
    } finally {
      setIsGeneratingTimeline(false);
    }
  };

  const loadDemoData = (demoType) => {
    const demoProfile = demoDataService.getDemoProfile(demoType);
    setProfileData(demoProfile);
    setCurrentStep(0); // Reset to first step to see the data
  };

  const renderCurrentStep = () => {
    const currentStepId = WIZARD_STEPS[currentStep].id;

    switch (currentStepId) {
      case 'company':
        return <CompanyOverviewStep data={profileData} updateData={updateProfileData} />;
      case 'business-issue':
        return <BusinessIssueStep data={profileData} updateData={updateProfileData} onToggle={handleArrayToggle} />;
      case 'problems':
        return <ProblemsStep data={profileData} updateData={updateProfileData} />;
      case 'impact':
        return <ImpactStep data={profileData} updateData={updateProfileData} />;
      case 'solution':
        return <SolutionStep data={profileData} updateData={updateProfileData} onToggle={handleArrayToggle} />;
      case 'decision':
        return <DecisionStep data={profileData} updateData={updateProfileData} />;
      case 'ai-assessment':
        return <AIAssessmentStep data={profileData} updateData={updateProfileData} />;
      case 'summary':
        return <SummaryStep data={profileData} updateData={updateProfileData} onGenerateTimeline={generateTimelineFromProfile} isGenerating={isGeneratingTimeline} />;
      default:
        return null;
    }
  };

  const markdownPreview = showMarkdownPreview ? markdownService.generateMarkdown(profileData) : '';

  return (
    <div className="profile-wizard">
      <div className="wizard-header">
        <h1>Create Client Profile</h1>
        <div className="wizard-progress">
          <div className="progress-steps">
            {WIZARD_STEPS.map((step, index) => (
              <div 
                key={step.id}
                className={`progress-step ${index <= currentStep ? 'active' : ''} ${index === currentStep ? 'current' : ''}`}
              >
                <div className="step-icon">{step.icon}</div>
                <span className="step-title">{step.title}</span>
              </div>
            ))}
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentStep + 1) / WIZARD_STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      <div className="wizard-content">
        <div className="wizard-main">
          {renderCurrentStep()}
        </div>

        {showMarkdownPreview && (
          <div className="wizard-sidebar">
            <div className="markdown-preview">
              <h3>Markdown Preview</h3>
              <pre className="markdown-content">{markdownPreview}</pre>
            </div>
          </div>
        )}
      </div>

      <div className="wizard-actions">
        <div className="left-actions">
          <button 
            type="button" 
            className="btn-secondary btn-small"
            onClick={() => setShowMarkdownPreview(!showMarkdownPreview)}
          >
            {showMarkdownPreview ? 'Hide Preview' : 'Show Markdown'}
          </button>
          
          <div className="demo-data-dropdown">
            <select 
              onChange={(e) => e.target.value && loadDemoData(e.target.value)}
              className="btn-secondary btn-small"
              style={{ cursor: 'pointer' }}
            >
              <option value="">Load Demo Data</option>
              <option value="tech-startup">TechFlow Solutions (SaaS)</option>
              <option value="manufacturing">PrecisionParts Manufacturing</option>
              <option value="healthcare">Regional Medical Center</option>
              <option value="finance">Community Trust Bank</option>
            </select>
          </div>
        </div>

        <div className="main-actions">
          <button 
            type="button" 
            className="btn-secondary"
            onClick={currentStep === 0 ? onCancel : () => setCurrentStep(currentStep - 1)}
          >
            {currentStep === 0 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < WIZARD_STEPS.length - 1 ? (
            <button 
              type="button" 
              className="btn-primary"
              disabled={!canProceedToNext()}
              onClick={() => setCurrentStep(currentStep + 1)}
            >
              Next
            </button>
          ) : (
            <button 
              type="button" 
              className="btn-success"
              onClick={handleComplete}
            >
              Create Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// Step Components
function CompanyOverviewStep({ data, updateData }) {
  const industries = [
    'Technology', 'Healthcare', 'Finance', 'Manufacturing', 'Retail',
    'Education', 'Real Estate', 'Transportation', 'Energy', 'Other'
  ];

  const companySizes = [
    '1-50 employees',
    '51-200 employees',
    '201-1000 employees',
    '1000+ employees'
  ];

  return (
    <div className="wizard-step">
      <h2>Company Overview</h2>
      <p>Let's start with basic information about your client.</p>

      <div className="form-grid">
        <div className="form-group">
          <label htmlFor="companyName">Company Name *</label>
          <input
            id="companyName"
            type="text"
            value={data.companyName || ''}
            onChange={(e) => updateData('companyName', e.target.value)}
            placeholder="Enter company name"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="industry">Industry *</label>
          <select
            id="industry"
            value={data.industry || ''}
            onChange={(e) => updateData('industry', e.target.value)}
            required
          >
            <option value="">Select industry</option>
            {industries.map(industry => (
              <option key={industry} value={industry}>{industry}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Company Size *</label>
          <div className="radio-group">
            {companySizes.map(size => (
              <label key={size} className="radio-label">
                <input
                  type="radio"
                  name="companySize"
                  value={size}
                  checked={data.size === size}
                  onChange={(e) => updateData('size', e.target.value)}
                />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="annualRevenue">Annual Revenue</label>
          <input
            id="annualRevenue"
            type="text"
            value={data.annualRevenue || ''}
            onChange={(e) => updateData('annualRevenue', e.target.value)}
            placeholder="e.g., 50M, 1.2B"
          />
        </div>

        <div className="form-group">
          <label htmlFor="employeeCount">Employee Count</label>
          <input
            id="employeeCount"
            type="number"
            value={data.employeeCount || ''}
            onChange={(e) => updateData('employeeCount', e.target.value)}
            placeholder="Number of employees"
          />
        </div>

        <div className="form-group">
          <label htmlFor="primaryLocation">Primary Location</label>
          <input
            id="primaryLocation"
            type="text"
            value={data.primaryLocation || ''}
            onChange={(e) => updateData('primaryLocation', e.target.value)}
            placeholder="City, State/Country"
          />
        </div>
      </div>
    </div>
  );
}

function BusinessIssueStep({ data, updateData, onToggle }) {
  const businessIssues = [
    'Revenue Growth Pressure',
    'Cost Reduction Mandate',
    'Operational Efficiency', 
    'Customer Experience',
    'Digital Transformation',
    'Regulatory Compliance',
    'Competitive Pressure'
  ];

  const selectedIssues = data.valueSellingFramework?.businessIssues || [];

  return (
    <div className="wizard-step">
      <h2>Business Issue</h2>
      <p>What are the high-level strategic priorities or C-level concerns?</p>

      <div className="checkbox-grid">
        {businessIssues.map(issue => (
          <label key={issue} className={`checkbox-card ${selectedIssues.includes(issue) ? 'selected' : ''}`}>
            <input
              type="checkbox"
              checked={selectedIssues.includes(issue)}
              onChange={() => onToggle('valueSellingFramework.businessIssues', issue)}
            />
            <span className="checkbox-text">{issue}</span>
          </label>
        ))}
      </div>

      <div className="form-group">
        <label htmlFor="businessIssueOther">Other (specify)</label>
        <input
          id="businessIssueOther"
          type="text"
          value={data.valueSellingFramework?.businessIssueOther || ''}
          onChange={(e) => updateData('valueSellingFramework.businessIssueOther', e.target.value)}
          placeholder="Describe other business issues"
        />
      </div>

      <div className="form-group">
        <label htmlFor="businessIssueDetails">Details</label>
        <textarea
          id="businessIssueDetails"
          value={data.valueSellingFramework?.businessIssueDetails || ''}
          onChange={(e) => updateData('valueSellingFramework.businessIssueDetails', e.target.value)}
          placeholder="Describe the main business issue in detail"
          rows={4}
        />
      </div>
    </div>
  );
}

function SummaryStep({ data, updateData, onGenerateTimeline, isGenerating }) {
  return (
    <div className="wizard-step">
      <h2>Summary & Next Steps</h2>
      <p>Review your client profile and define next steps.</p>

      <div className="form-group">
        <label htmlFor="currentState">Current State Summary</label>
        <textarea
          id="currentState"
          value={data.summary?.currentState || ''}
          onChange={(e) => updateData('summary.currentState', e.target.value)}
          placeholder="Brief description of key challenges and costs"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="recommendedApproach">Recommended Approach</label>
        <textarea
          id="recommendedApproach"
          value={data.summary?.recommendedApproach || ''}
          onChange={(e) => updateData('summary.recommendedApproach', e.target.value)}
          placeholder="High-level strategy recommendation"
          rows={3}
        />
      </div>

      <div className="form-group">
        <label htmlFor="notes">Notes & Additional Context</label>
        <textarea
          id="notes"
          value={data.summary?.notes || ''}
          onChange={(e) => updateData('summary.notes', e.target.value)}
          placeholder="Additional observations, quotes from stakeholders, competitive insights, etc."
          rows={4}
        />
      </div>

      <div className="action-buttons">
        <button 
          type="button"
          className="btn-timeline"
          onClick={onGenerateTimeline}
          disabled={isGenerating}
        >
          {isGenerating ? 'Generating...' : '🚀 Generate AI Timeline'}
        </button>
      </div>
    </div>
  );
}

function ProblemsStep({ data, updateData }) {
  const departmentalProblems = {
    finance: [
      'Manual invoice processing taking [X] days',
      '[X]% error rate in financial processes',
      'Month-end close takes [X] days'
    ],
    hr: [
      'Employee onboarding takes [X] days',
      'Manual resume screening',
      '[X]% employee turnover rate'
    ],
    it: [
      'Average ticket resolution: [X] hours',
      '[X]% of tickets require manual intervention',
      'System provisioning takes [X] hours'
    ],
    customerService: [
      'Average response time: [X] hours',
      '[X]% first contact resolution rate',
      'Customer satisfaction score: [X]/10'
    ],
    operations: [
      'Process cycle time: [X] days',
      '[X]% manual processes',
      'Quality issues: [X]% error rate'
    ]
  };

  const handleProblemToggle = (department, problem) => {
    const currentProblems = data.valueSellingFramework?.problems?.[department] || {};
    const updated = { ...currentProblems, [problem]: !currentProblems[problem] };
    updateData(`valueSellingFramework.problems.${department}`, updated);
  };

  const handleOtherProblem = (department, value) => {
    updateData(`valueSellingFramework.problems.${department}.other`, value);
  };

  return (
    <div className="wizard-step">
      <h2>Problems & Challenges</h2>
      <p>Identify specific operational issues by department.</p>
      
      {Object.entries(departmentalProblems).map(([department, problems]) => (
        <div key={department} className="department-section">
          <h3>{department.charAt(0).toUpperCase() + department.slice(1)} Department</h3>
          <div className="checkbox-grid">
            {problems.map(problem => (
              <label key={problem} className={`checkbox-card ${
                data.valueSellingFramework?.problems?.[department]?.[problem] ? 'selected' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={data.valueSellingFramework?.problems?.[department]?.[problem] || false}
                  onChange={() => handleProblemToggle(department, problem)}
                />
                <span className="checkbox-text">{problem}</span>
              </label>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor={`${department}Other`}>Other (specify)</label>
            <input
              id={`${department}Other`}
              type="text"
              value={data.valueSellingFramework?.problems?.[department]?.other || ''}
              onChange={(e) => handleOtherProblem(department, e.target.value)}
              placeholder="Describe other issues"
            />
          </div>
        </div>
      ))}
      
      <div className="form-group">
        <label htmlFor="additionalChallenges">Additional Challenges</label>
        <textarea
          id="additionalChallenges"
          value={data.valueSellingFramework?.additionalChallenges || ''}
          onChange={(e) => updateData('valueSellingFramework.additionalChallenges', e.target.value)}
          placeholder="Describe other operational challenges"
          rows={4}
        />
      </div>

      <div className="form-section">
        <h3>Root Cause Analysis</h3>
        <p>Why do these challenges exist?</p>
        
        {['Legacy systems with poor integration', 'Manual, paper-based processes', 'Lack of real-time data visibility', 'Insufficient automation', 'Skills gap in technology', 'Siloed departments'].map(cause => (
          <label key={cause} className={`checkbox-card ${
            data.valueSellingFramework?.rootCauses?.includes(cause) ? 'selected' : ''
          }`}>
            <input
              type="checkbox"
              checked={data.valueSellingFramework?.rootCauses?.includes(cause) || false}
              onChange={() => {
                const current = data.valueSellingFramework?.rootCauses || [];
                const updated = current.includes(cause) 
                  ? current.filter(c => c !== cause)
                  : [...current, cause];
                updateData('valueSellingFramework.rootCauses', updated);
              }}
            />
            <span className="checkbox-text">{cause}</span>
          </label>
        ))}
        
        <div className="form-group">
          <label htmlFor="rootCauseOther">Other Root Cause</label>
          <input
            id="rootCauseOther"
            type="text"
            value={data.valueSellingFramework?.rootCauseOther || ''}
            onChange={(e) => updateData('valueSellingFramework.rootCauseOther', e.target.value)}
            placeholder="Specify other root causes"
          />
        </div>

        <div className="form-group">
          <label htmlFor="rootCauseDetails">Root Cause Details</label>
          <textarea
            id="rootCauseDetails"
            value={data.valueSellingFramework?.rootCauseDetails || ''}
            onChange={(e) => updateData('valueSellingFramework.rootCauseDetails', e.target.value)}
            placeholder="Describe the root causes in detail"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function ImpactStep({ data, updateData }) {
  return (
    <div className="wizard-step">
      <h2>Impact Analysis</h2>
      <p>Quantify the cost of current challenges.</p>
      
      <div className="form-section">
        <h3>Hard Costs (Annual)</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="laborCosts">Labor costs from manual processes ($)</label>
            <input
              id="laborCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.laborCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.laborCosts', e.target.value)}
              placeholder="450000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="errorCosts">Error correction costs ($)</label>
            <input
              id="errorCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.errorCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.errorCosts', e.target.value)}
              placeholder="75000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="downtimeCosts">System downtime costs ($)</label>
            <input
              id="downtimeCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.downtimeCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.downtimeCosts', e.target.value)}
              placeholder="120000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="complianceCosts">Compliance penalties/risk ($)</label>
            <input
              id="complianceCosts"
              type="number"
              value={data.valueSellingFramework?.impact?.complianceCosts || ''}
              onChange={(e) => updateData('valueSellingFramework.impact.complianceCosts', e.target.value)}
              placeholder="25000"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Soft Costs</h3>
        <div className="form-grid">
          {[
            { key: 'employeeImpact', label: 'Employee frustration/turnover impact' },
            { key: 'customerImpact', label: 'Customer satisfaction impact' },
            { key: 'competitiveImpact', label: 'Competitive disadvantage' },
            { key: 'reputationRisk', label: 'Brand/reputation risk' }
          ].map(({ key, label }) => (
            <div key={key} className="form-group">
              <label>{label}</label>
              <select
                value={data.valueSellingFramework?.impact?.[key] || ''}
                onChange={(e) => updateData(`valueSellingFramework.impact.${key}`, e.target.value)}
              >
                <option value="">Select impact level</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
          ))}
        </div>
      </div>
      
      <div className="form-group">
        <label htmlFor="totalAnnualImpact">Total Estimated Annual Impact ($) *</label>
        <input
          id="totalAnnualImpact"
          type="number"
          value={data.valueSellingFramework?.impact?.totalAnnualImpact || ''}
          onChange={(e) => updateData('valueSellingFramework.impact.totalAnnualImpact', e.target.value)}
          placeholder="850000"
          required
        />
      </div>
    </div>
  );
}

function SolutionStep({ data, updateData, onToggle }) {
  const capabilities = [
    'Automate document processing',
    'Streamline approval workflows', 
    'Provide real-time dashboards',
    'Integrate disconnected systems',
    'Enable self-service capabilities',
    'Improve data accuracy',
    'Reduce manual handoffs'
  ];

  const differentiationRequirements = [
    'Industry-specific expertise',
    'Rapid implementation (< 6 months)',
    'No-code/low-code platform',
    'Strong integration capabilities',
    'Proven ROI in similar companies',
    'Comprehensive support/training'
  ];

  const selectedCapabilities = data.valueSellingFramework?.solutionCapabilities || [];
  const selectedDifferentiators = data.valueSellingFramework?.differentiationRequirements || [];

  return (
    <div className="wizard-step">
      <h2>Solution Requirements</h2>
      <p>What capabilities are needed to solve these challenges?</p>

      <div className="form-section">
        <h3>Solution Capabilities Needed</h3>
        <div className="checkbox-grid">
          {capabilities.map(capability => (
            <label key={capability} className={`checkbox-card ${selectedCapabilities.includes(capability) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={selectedCapabilities.includes(capability)}
                onChange={() => onToggle('valueSellingFramework.solutionCapabilities', capability)}
              />
              <span className="checkbox-text">{capability}</span>
            </label>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="solutionCapabilitiesOther">Other capabilities needed</label>
          <input
            id="solutionCapabilitiesOther"
            type="text"
            value={data.valueSellingFramework?.solutionCapabilitiesOther || ''}
            onChange={(e) => updateData('valueSellingFramework.solutionCapabilitiesOther', e.target.value)}
            placeholder="Specify other capabilities"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Differentiation Requirements</h3>
        <p>What makes a solution uniquely qualified?</p>
        <div className="checkbox-grid">
          {differentiationRequirements.map(requirement => (
            <label key={requirement} className={`checkbox-card ${selectedDifferentiators.includes(requirement) ? 'selected' : ''}`}>
              <input
                type="checkbox"
                checked={selectedDifferentiators.includes(requirement)}
                onChange={() => onToggle('valueSellingFramework.differentiationRequirements', requirement)}
              />
              <span className="checkbox-text">{requirement}</span>
            </label>
          ))}
        </div>
        <div className="form-group">
          <label htmlFor="differentiationOther">Other differentiators</label>
          <input
            id="differentiationOther"
            type="text"
            value={data.valueSellingFramework?.differentiationOther || ''}
            onChange={(e) => updateData('valueSellingFramework.differentiationOther', e.target.value)}
            placeholder="Specify other differentiation requirements"
          />
        </div>
      </div>

      <div className="form-section">
        <h3>Value / ROI Expectations</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="costReduction">Target cost reduction</label>
            <input
              id="costReduction"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.costReduction || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.costReduction', e.target.value)}
              placeholder="25% or $500K"
            />
          </div>
          <div className="form-group">
            <label htmlFor="efficiencyImprovement">Target efficiency improvement</label>
            <input
              id="efficiencyImprovement"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.efficiencyImprovement || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.efficiencyImprovement', e.target.value)}
              placeholder="40%"
            />
          </div>
          <div className="form-group">
            <label htmlFor="paybackPeriod">Expected payback period</label>
            <input
              id="paybackPeriod"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.paybackPeriod || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.paybackPeriod', e.target.value)}
              placeholder="12 months"
            />
          </div>
          <div className="form-group">
            <label htmlFor="targetROI">Target ROI</label>
            <input
              id="targetROI"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.targetROI || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.targetROI', e.target.value)}
              placeholder="300%"
            />
          </div>
          <div className="form-group">
            <label htmlFor="timeToFirstValue">Time to first value</label>
            <input
              id="timeToFirstValue"
              type="text"
              value={data.valueSellingFramework?.roiExpectations?.timeToFirstValue || ''}
              onChange={(e) => updateData('valueSellingFramework.roiExpectations.timeToFirstValue', e.target.value)}
              placeholder="3 months"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Success Metrics</h3>
        <p>How will success be measured?</p>
        {['Process cycle time reduction', 'Error rate improvement', 'Cost per transaction reduction', 'Employee productivity increase', 'Customer satisfaction improvement', 'Revenue impact'].map(metric => (
          <label key={metric} className={`checkbox-card ${
            data.valueSellingFramework?.successMetrics?.includes(metric) ? 'selected' : ''
          }`}>
            <input
              type="checkbox"
              checked={data.valueSellingFramework?.successMetrics?.includes(metric) || false}
              onChange={() => onToggle('valueSellingFramework.successMetrics', metric)}
            />
            <span className="checkbox-text">{metric}</span>
          </label>
        ))}
        <div className="form-group">
          <label htmlFor="successMetricsTargets">Specific targets</label>
          <textarea
            id="successMetricsTargets"
            value={data.valueSellingFramework?.successMetricsTargets || ''}
            onChange={(e) => updateData('valueSellingFramework.successMetricsTargets', e.target.value)}
            placeholder="Detail the numerical targets (e.g., Reduce processing time from 5 days to 1 day)"
            rows={3}
          />
        </div>
      </div>
    </div>
  );
}

function DecisionStep({ data, updateData }) {
  const evaluationCriteria = [
    'Technical fit',
    'Cost/ROI',
    'Vendor reputation',
    'Implementation timeline',
    'Support quality'
  ];

  return (
    <div className="wizard-step">
      <h2>Decision Process</h2>
      <p>Who are the key stakeholders and decision makers?</p>
      
      <div className="form-section">
        <h3>Key Decision Makers</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="economicBuyerName">Economic Buyer Name *</label>
            <input
              id="economicBuyerName"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.economicBuyer?.name || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.economicBuyer.name', e.target.value)}
              placeholder="Sarah Chen"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="economicBuyerTitle">Economic Buyer Title</label>
            <input
              id="economicBuyerTitle"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.economicBuyer?.title || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.economicBuyer.title', e.target.value)}
              placeholder="CEO"
            />
          </div>

          <div className="form-group">
            <label htmlFor="economicBuyerBudget">Budget Authority ($)</label>
            <input
              id="economicBuyerBudget"
              type="number"
              value={data.valueSellingFramework?.decisionMakers?.economicBuyer?.budget || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.economicBuyer.budget', e.target.value)}
              placeholder="1000000"
            />
          </div>

          <div className="form-group">
            <label htmlFor="technicalBuyerName">Technical Buyer Name</label>
            <input
              id="technicalBuyerName"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.technicalBuyer?.name || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.technicalBuyer.name', e.target.value)}
              placeholder="Mike Rodriguez"
            />
          </div>

          <div className="form-group">
            <label htmlFor="technicalBuyerTitle">Technical Buyer Title</label>
            <input
              id="technicalBuyerTitle"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.technicalBuyer?.title || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.technicalBuyer.title', e.target.value)}
              placeholder="CTO"
            />
          </div>

          <div className="form-group">
            <label htmlFor="championName">Champion Name</label>
            <input
              id="championName"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.champion?.name || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.champion.name', e.target.value)}
              placeholder="Lisa Park"
            />
          </div>

          <div className="form-group">
            <label htmlFor="championTitle">Champion Title</label>
            <input
              id="championTitle"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.champion?.title || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.champion.title', e.target.value)}
              placeholder="VP Operations"
            />
          </div>

          <div className="form-group">
            <label htmlFor="influencers">Influencers</label>
            <input
              id="influencers"
              type="text"
              value={data.valueSellingFramework?.decisionMakers?.influencers || ''}
              onChange={(e) => updateData('valueSellingFramework.decisionMakers.influencers', e.target.value)}
              placeholder="Head of Customer Success, Engineering Manager"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Buying Process</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="timeline">Decision timeline</label>
            <input
              id="timeline"
              type="text"
              value={data.valueSellingFramework?.buyingProcess?.timeline || ''}
              onChange={(e) => updateData('valueSellingFramework.buyingProcess.timeline', e.target.value)}
              placeholder="6 months"
            />
          </div>

          <div className="form-group">
            <label htmlFor="budgetCycle">Budget cycle</label>
            <input
              id="budgetCycle"
              type="text"
              value={data.valueSellingFramework?.buyingProcess?.budgetCycle || ''}
              onChange={(e) => updateData('valueSellingFramework.buyingProcess.budgetCycle', e.target.value)}
              placeholder="Q1 planning cycle"
            />
          </div>
        </div>

        <div className="form-group">
          <label>Evaluation criteria</label>
          <div className="checkbox-grid">
            {evaluationCriteria.map(criteria => (
              <label key={criteria} className={`checkbox-card ${
                data.valueSellingFramework?.buyingProcess?.evaluationCriteria?.includes(criteria) ? 'selected' : ''
              }`}>
                <input
                  type="checkbox"
                  checked={data.valueSellingFramework?.buyingProcess?.evaluationCriteria?.includes(criteria) || false}
                  onChange={() => {
                    const current = data.valueSellingFramework?.buyingProcess?.evaluationCriteria || [];
                    const updated = current.includes(criteria) 
                      ? current.filter(c => c !== criteria)
                      : [...current, criteria];
                    updateData('valueSellingFramework.buyingProcess.evaluationCriteria', updated);
                  }}
                />
                <span className="checkbox-text">{criteria}</span>
              </label>
            ))}
          </div>
          <div className="form-group">
            <label htmlFor="evaluationOther">Other evaluation criteria</label>
            <input
              id="evaluationOther"
              type="text"
              value={data.valueSellingFramework?.buyingProcess?.evaluationOther || ''}
              onChange={(e) => updateData('valueSellingFramework.buyingProcess.evaluationOther', e.target.value)}
              placeholder="Specify other criteria"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Risks of Inaction</h3>
        <p>Consequences of doing nothing:</p>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="costEscalation">Continued cost escalation (annually) ($)</label>
            <input
              id="costEscalation"
              type="number"
              value={data.valueSellingFramework?.risksOfInaction?.costEscalation || ''}
              onChange={(e) => updateData('valueSellingFramework.risksOfInaction.costEscalation', e.target.value)}
              placeholder="1200000"
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="employeeAttrition">Employee attrition risk</label>
            <select
              id="employeeAttrition"
              value={data.valueSellingFramework?.risksOfInaction?.employeeAttrition || ''}
              onChange={(e) => updateData('valueSellingFramework.risksOfInaction.employeeAttrition', e.target.value)}
            >
              <option value="">Select risk level</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="threeYearCost">Estimated cost of inaction (3 years) ($)</label>
            <input
              id="threeYearCost"
              type="number"
              value={data.valueSellingFramework?.risksOfInaction?.threeYearCost || ''}
              onChange={(e) => updateData('valueSellingFramework.risksOfInaction.threeYearCost', e.target.value)}
              placeholder="3600000"
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="competitiveDisadvantage">Competitive disadvantage</label>
          <textarea
            id="competitiveDisadvantage"
            value={data.valueSellingFramework?.risksOfInaction?.competitiveDisadvantage || ''}
            onChange={(e) => updateData('valueSellingFramework.risksOfInaction.competitiveDisadvantage', e.target.value)}
            placeholder="Describe the competitive impact of inaction"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="customerSatisfaction">Customer satisfaction decline</label>
          <textarea
            id="customerSatisfaction"
            value={data.valueSellingFramework?.risksOfInaction?.customerSatisfaction || ''}
            onChange={(e) => updateData('valueSellingFramework.risksOfInaction.customerSatisfaction', e.target.value)}
            placeholder="Describe the customer impact"
            rows={2}
          />
        </div>

        <div className="form-group">
          <label htmlFor="complianceRisk">Regulatory compliance risk</label>
          <textarea
            id="complianceRisk"
            value={data.valueSellingFramework?.risksOfInaction?.complianceRisk || ''}
            onChange={(e) => updateData('valueSellingFramework.risksOfInaction.complianceRisk', e.target.value)}
            placeholder="Describe compliance risks"
            rows={2}
          />
        </div>
      </div>
    </div>
  );
}

function AIAssessmentStep({ data, updateData }) {
  const handleOpportunityUpdate = (index, field, value) => {
    const opportunities = [...(data.aiOpportunityAssessment?.opportunities || [])];
    if (!opportunities[index]) {
      opportunities[index] = {};
    }
    opportunities[index][field] = value;
    updateData('aiOpportunityAssessment.opportunities', opportunities);
  };

  const addOpportunity = () => {
    const opportunities = [...(data.aiOpportunityAssessment?.opportunities || [])];
    opportunities.push({
      name: '',
      department: '',
      process: '',
      currentState: '',
      aiSolution: '',
      estimatedImpact: '',
      implementationEffort: 'Medium',
      timeline: '',
      priorityScore: 5
    });
    updateData('aiOpportunityAssessment.opportunities', opportunities);
  };

  const removeOpportunity = (index) => {
    const opportunities = [...(data.aiOpportunityAssessment?.opportunities || [])];
    opportunities.splice(index, 1);
    updateData('aiOpportunityAssessment.opportunities', opportunities);
  };

  const updateQuickWin = (index, field, value) => {
    const quickWins = [...(data.aiOpportunityAssessment?.quickWins || [])];
    if (!quickWins[index]) quickWins[index] = {};
    quickWins[index][field] = value;
    updateData('aiOpportunityAssessment.quickWins', quickWins);
  };

  const addQuickWin = () => {
    const quickWins = [...(data.aiOpportunityAssessment?.quickWins || [])];
    quickWins.push({ name: '', impact: '', timeline: '' });
    updateData('aiOpportunityAssessment.quickWins', quickWins);
  };

  return (
    <div className="wizard-step">
      <h2>AI/Automation Opportunity Assessment</h2>
      <p>Evaluate current technology landscape and identify AI opportunities.</p>
      
      <div className="form-section">
        <h3>Current Technology Landscape</h3>
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="primaryERP">Primary ERP</label>
            <input
              id="primaryERP"
              type="text"
              value={data.aiOpportunityAssessment?.currentTechnology?.erp || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.erp', e.target.value)}
              placeholder="SAP, Oracle, NetSuite, etc."
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="crmSystem">CRM System</label>
            <input
              id="crmSystem"
              type="text"
              value={data.aiOpportunityAssessment?.currentTechnology?.crm || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.crm', e.target.value)}
              placeholder="Salesforce, HubSpot, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="collaborationTools">Collaboration Tools</label>
            <input
              id="collaborationTools"
              type="text"
              value={data.aiOpportunityAssessment?.currentTechnology?.collaboration || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.collaboration', e.target.value)}
              placeholder="Slack, Teams, Zoom, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="integrationMaturity">Integration Maturity</label>
            <select
              id="integrationMaturity"
              value={data.aiOpportunityAssessment?.currentTechnology?.integrationMaturity || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.integrationMaturity', e.target.value)}
            >
              <option value="">Select maturity level</option>
              <option value="Basic">Basic</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dataQuality">Data Quality</label>
            <select
              id="dataQuality"
              value={data.aiOpportunityAssessment?.currentTechnology?.dataQuality || ''}
              onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.dataQuality', e.target.value)}
            >
              <option value="">Select quality level</option>
              <option value="Poor">Poor</option>
              <option value="Fair">Fair</option>
              <option value="Good">Good</option>
              <option value="Excellent">Excellent</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="currentAutomation">Current Automation</label>
          <textarea
            id="currentAutomation"
            value={data.aiOpportunityAssessment?.currentTechnology?.automation || ''}
            onChange={(e) => updateData('aiOpportunityAssessment.currentTechnology.automation', e.target.value)}
            placeholder="Describe existing automation tools and processes"
            rows={3}
          />
        </div>
      </div>

      <div className="form-section">
        <h3>AI Readiness Score</h3>
        <div className="ai-readiness-scoring">
          <div className="scoring-criteria">
            {[
              { key: 'dataQuality', label: 'Data availability and quality', max: 2 },
              { key: 'integration', label: 'System integration capability', max: 2 },
              { key: 'technicalTeam', label: 'Technical team readiness', max: 2 },
              { key: 'leadership', label: 'Leadership support', max: 2 },
              { key: 'changeManagement', label: 'Change management capability', max: 2 }
            ].map(({ key, label, max }) => (
              <div key={key} className="scoring-item">
                <label>{label}</label>
                <div className="score-input">
                  <input
                    type="range"
                    min="0"
                    max={max}
                    value={data.aiOpportunityAssessment?.readinessScoring?.[key] || 0}
                    onChange={(e) => updateData(`aiOpportunityAssessment.readinessScoring.${key}`, parseInt(e.target.value))}
                  />
                  <span className="score-value">
                    {data.aiOpportunityAssessment?.readinessScoring?.[key] || 0}/{max}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <div className="total-score">
            <strong>Total AI Readiness Score: {
              Object.values(data.aiOpportunityAssessment?.readinessScoring || {}).reduce((sum, score) => sum + (score || 0), 0)
            }/10</strong>
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Top AI Opportunities (Prioritized)</h3>
        {(data.aiOpportunityAssessment?.opportunities || []).map((opportunity, index) => (
          <div key={index} className="opportunity-card">
            <div className="opportunity-header">
              <h4>Opportunity {index + 1}</h4>
              <button type="button" onClick={() => removeOpportunity(index)} className="btn-danger btn-small">Remove</button>
            </div>
            <div className="form-grid">
              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  value={opportunity.name || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'name', e.target.value)}
                  placeholder="e.g., Invoice Processing Automation"
                />
              </div>
              <div className="form-group">
                <label>Department</label>
                <select
                  value={opportunity.department || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'department', e.target.value)}
                >
                  <option value="">Select department</option>
                  <option value="Finance">Finance</option>
                  <option value="HR">HR</option>
                  <option value="IT">IT</option>
                  <option value="Customer Service">Customer Service</option>
                  <option value="Operations">Operations</option>
                  <option value="Sales">Sales</option>
                  <option value="Marketing">Marketing</option>
                </select>
              </div>
              <div className="form-group">
                <label>Process</label>
                <input
                  type="text"
                  value={opportunity.process || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'process', e.target.value)}
                  placeholder="Specific process to automate"
                />
              </div>
              <div className="form-group">
                <label>Current State</label>
                <input
                  type="text"
                  value={opportunity.currentState || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'currentState', e.target.value)}
                  placeholder="How it works today"
                />
              </div>
              <div className="form-group">
                <label>AI Solution</label>
                <input
                  type="text"
                  value={opportunity.aiSolution || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'aiSolution', e.target.value)}
                  placeholder="What AI would do"
                />
              </div>
              <div className="form-group">
                <label>Estimated Impact ($)</label>
                <input
                  type="number"
                  value={opportunity.estimatedImpact || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'estimatedImpact', e.target.value)}
                  placeholder="Annual savings/benefit"
                />
              </div>
              <div className="form-group">
                <label>Implementation Effort</label>
                <select
                  value={opportunity.implementationEffort || 'Medium'}
                  onChange={(e) => handleOpportunityUpdate(index, 'implementationEffort', e.target.value)}
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input
                  type="text"
                  value={opportunity.timeline || ''}
                  onChange={(e) => handleOpportunityUpdate(index, 'timeline', e.target.value)}
                  placeholder="e.g., 3 months"
                />
              </div>
              <div className="form-group">
                <label>Priority Score (1-10)</label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={opportunity.priorityScore || 5}
                  onChange={(e) => handleOpportunityUpdate(index, 'priorityScore', parseInt(e.target.value))}
                />
                <div className="score-display">{opportunity.priorityScore || 5}/10</div>
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addOpportunity} className="btn-secondary">Add Opportunity</button>
      </div>

      <div className="form-section">
        <h3>Quick Wins (0-6 months)</h3>
        {(data.aiOpportunityAssessment?.quickWins || []).map((quickWin, index) => (
          <div key={index} className="quick-win-item">
            <div className="form-grid">
              <div className="form-group">
                <label>Opportunity name</label>
                <input
                  type="text"
                  value={quickWin.name || ''}
                  onChange={(e) => updateQuickWin(index, 'name', e.target.value)}
                  placeholder="e.g., Automated ticket routing"
                />
              </div>
              <div className="form-group">
                <label>Impact ($)</label>
                <input
                  type="number"
                  value={quickWin.impact || ''}
                  onChange={(e) => updateQuickWin(index, 'impact', e.target.value)}
                  placeholder="50000"
                />
              </div>
              <div className="form-group">
                <label>Timeline</label>
                <input
                  type="text"
                  value={quickWin.timeline || ''}
                  onChange={(e) => updateQuickWin(index, 'timeline', e.target.value)}
                  placeholder="1 month"
                />
              </div>
            </div>
          </div>
        ))}
        <button type="button" onClick={addQuickWin} className="btn-secondary btn-small">Add Quick Win</button>
      </div>
    </div>
  );
}

// Add custom styles for the enhanced form elements
const styles = `
  .ai-readiness-scoring {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 1rem;
    margin: 1rem 0;
  }

  .scoring-criteria {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .scoring-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.5rem;
    background: white;
    border-radius: 4px;
    border: 1px solid #e0e0e0;
  }

  .scoring-item label {
    flex: 1;
    font-weight: 500;
    margin: 0;
  }

  .score-input {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-width: 120px;
  }

  .score-input input[type="range"] {
    flex: 1;
    min-width: 80px;
  }

  .score-value {
    font-weight: bold;
    color: #2563eb;
    min-width: 30px;
    text-align: center;
  }

  .total-score {
    text-align: center;
    margin-top: 1rem;
    padding: 0.75rem;
    background: #e0f2fe;
    border-radius: 6px;
    color: #0277bd;
    font-size: 1.1rem;
  }

  .opportunity-card {
    border: 1px solid #e0e0e0;
    border-radius: 8px;
    padding: 1.5rem;
    margin: 1rem 0;
    background: #fafafa;
  }

  .opportunity-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid #e0e0e0;
  }

  .opportunity-header h4 {
    margin: 0;
    color: #1565c0;
  }

  .btn-danger {
    background: #ef4444;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.25rem 0.75rem;
    font-size: 0.875rem;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .btn-danger:hover {
    background: #dc2626;
  }

  .btn-small {
    padding: 0.25rem 0.5rem;
    font-size: 0.8rem;
  }

  .btn-secondary {
    background: #6b7280;
    color: white;
    border: none;
    border-radius: 4px;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: background-color 0.2s;
    margin: 0.5rem 0;
  }

  .btn-secondary:hover {
    background: #4b5563;
  }

  .quick-win-item {
    background: #f0f9ff;
    border: 1px solid #bfdbfe;
    border-radius: 6px;
    padding: 1rem;
    margin: 0.5rem 0;
  }

  .score-display {
    text-align: center;
    font-weight: bold;
    color: #2563eb;
    margin-top: 0.25rem;
  }

  .checkbox-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 0.5rem;
    margin: 1rem 0;
  }

  .checkbox-card {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem;
    border: 1px solid #e0e0e0;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s;
    background: white;
  }

  .checkbox-card:hover {
    border-color: #2563eb;
    background: #f8fafc;
  }

  .checkbox-card.selected {
    border-color: #2563eb;
    background: #eff6ff;
  }

  .checkbox-card input[type="checkbox"] {
    margin: 0;
  }

  .checkbox-text {
    flex: 1;
    font-size: 0.9rem;
  }

  .form-section {
    margin: 2rem 0;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
    background: #fafafa;
  }

  .form-section h3 {
    margin-top: 0;
    color: #1f2937;
    border-bottom: 2px solid #e5e7eb;
    padding-bottom: 0.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin: 1rem 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .form-group label {
    font-weight: 500;
    color: #374151;
    margin-bottom: 0.25rem;
  }

  .form-group input,
  .form-group select,
  .form-group textarea {
    padding: 0.5rem;
    border: 1px solid #d1d5db;
    border-radius: 4px;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus,
  .form-group textarea:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  @media (max-width: 768px) {
    .form-grid {
      grid-template-columns: 1fr;
    }
    
    .checkbox-grid {
      grid-template-columns: 1fr;
    }
    
    .opportunity-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
} 


================================================
FILE: app/services/demoDataService.js
================================================
'use client';

/**
 * Demo Data Service
 * 
 * Provides realistic sample client profiles for testing and demonstration.
 * Based on common enterprise scenarios and Value Selling Framework patterns.
 */

export const demoDataService = {
  /**
   * Get a collection of demo profiles
   * @returns {Array} Array of demo profile objects
   */
  getDemoProfiles() {
    return [
      this.getTechStartupProfile(),
      this.getManufacturingProfile(), 
      this.getHealthcareProfile(),
      this.getFinanceProfile()
    ];
  },

  /**
   * Get a specific demo profile by type
   * @param {string} type - Type of demo profile
   * @returns {Object} Demo profile data
   */
  getDemoProfile(type = 'tech-startup') {
    const profiles = {
      'tech-startup': this.getTechStartupProfile(),
      'manufacturing': this.getManufacturingProfile(),
      'healthcare': this.getHealthcareProfile(),
      'finance': this.getFinanceProfile()
    };
    return profiles[type] || profiles['tech-startup'];
  },

  /**
   * Technology startup profile
   */
  getTechStartupProfile() {
    return {
      companyName: 'TechFlow Solutions',
      industry: 'Technology',
      size: '51-200 employees',
      annualRevenue: '15M',
      employeeCount: '120',
      primaryLocation: 'Austin, Texas',
      valueSellingFramework: {
        businessIssues: [
          'Revenue Growth Pressure',
          'Operational Efficiency',
          'Customer Experience'
        ],
        businessIssueOther: 'Scaling challenges with rapid growth',
        businessIssueDetails: 'Fast-growing SaaS company struggling with manual processes that worked at 50 employees but are breaking down at 120+. Customer support response times increasing, sales processes inconsistent, and engineering productivity declining due to operational overhead.',
        problems: {
          finance: {
            'Manual invoice processing taking [X] days': true,
            '[X]% error rate in financial processes': true
          },
          hr: {
            'Employee onboarding takes [X] days': true,
            'Manual resume screening': true
          },
          it: {
            'Average ticket resolution: [X] hours': true,
            'System provisioning takes [X] hours': true
          },
          customerService: {
            'Average response time: [X] hours': true,
            '[X]% first contact resolution rate': true
          },
          operations: {
            '[X]% manual processes': true
          }
        },
        additionalChallenges: 'Integration hell with 15+ different tools, lack of real-time visibility into customer health, manual reporting taking 2 days per week',
        rootCauses: [
          'Manual, paper-based processes',
          'Lack of real-time data visibility',
          'Insufficient automation',
          'Siloed departments'
        ],
        rootCauseDetails: 'Grew too fast to implement proper systems. Started with spreadsheets and manual processes that became embedded in culture. Each department chose their own tools without integration strategy.',
        impact: {
          laborCosts: '450000',
          errorCosts: '75000',
          downtimeCosts: '120000',
          complianceCosts: '25000',
          totalHardCosts: '670000',
          employeeImpact: 'High',
          customerImpact: 'Medium',
          competitiveImpact: 'High',
          reputationRisk: 'Medium',
          totalAnnualImpact: '850000'
        },
        solutionCapabilities: [
          'Automate document processing',
          'Streamline approval workflows',
          'Provide real-time dashboards',
          'Integrate disconnected systems',
          'Enable self-service capabilities'
        ],
        differentiationRequirements: [
          'Rapid implementation (< 6 months)',
          'No-code/low-code platform',
          'Strong integration capabilities',
          'Proven ROI in similar companies'
        ],
        roiExpectations: {
          costReduction: '30%',
          efficiencyImprovement: '40%',
          paybackPeriod: '8 months',
          targetROI: '300%',
          timeToFirstValue: '3 months'
        },
        successMetrics: [
          'Process cycle time reduction',
          'Employee productivity increase',
          'Customer satisfaction improvement'
        ],
        successMetricsTargets: 'Reduce support response time from 4 hours to 1 hour, increase sales cycle speed by 25%, reduce onboarding time from 2 weeks to 3 days',
        decisionMakers: {
          economicBuyer: {
            name: 'Sarah Chen',
            title: 'CEO',
            budget: '500000'
          },
          technicalBuyer: {
            name: 'Mike Rodriguez',
            title: 'CTO'
          },
          champion: {
            name: 'Lisa Park',
            title: 'VP Operations'
          },
          influencers: 'Head of Customer Success, Engineering Manager, Finance Director'
        },
        buyingProcess: {
          timeline: '4 months',
          budgetCycle: 'Q1 planning cycle',
          evaluationCriteria: [
            'Technical fit',
            'Implementation timeline',
            'Cost/ROI'
          ]
        },
        risksOfInaction: {
          costEscalation: '1200000',
          competitiveDisadvantage: 'Losing deals to faster competitors, customer churn increasing',
          employeeAttrition: 'High',
          customerSatisfaction: 'Support tickets up 40%, NPS declining',
          complianceRisk: 'SOC2 audit findings due to manual processes',
          threeYearCost: '3600000'
        }
      },
      aiOpportunityAssessment: {
        currentTechnology: {
          erp: 'QuickBooks + custom spreadsheets',
          crm: 'HubSpot',
          collaboration: 'Slack, Notion, Zoom',
          automation: 'Zapier for basic integrations',
          integrationMaturity: 'Basic',
          dataQuality: 'Fair'
        },
        aiReadinessScore: 6,
        readinessScoring: {
          dataQuality: 1,
          integration: 1,
          technicalTeam: 2,
          leadership: 2,
          changeManagement: 1
        },
        opportunities: [
          {
            name: 'Customer Support Automation',
            department: 'Customer Success',
            process: 'Ticket routing and initial response',
            currentState: 'Manual ticket assignment, 4-hour response time',
            aiSolution: 'AI-powered ticket classification and auto-responses',
            estimatedImpact: '180000',
            implementationEffort: 'Medium',
            timeline: '3 months',
            priorityScore: '9'
          },
          {
            name: 'Sales Lead Scoring',
            department: 'Sales',
            process: 'Lead qualification and prioritization',
            currentState: 'Manual review of all inbound leads',
            aiSolution: 'ML-based lead scoring and routing',
            estimatedImpact: '240000',
            implementationEffort: 'Low',
            timeline: '2 months',
            priorityScore: '8'
          }
        ],
        quickWins: [
          { name: 'Automated ticket routing', impact: '50000', timeline: '1 month' },
          { name: 'Invoice processing automation', impact: '75000', timeline: '2 months' },
          { name: 'Employee onboarding workflows', impact: '30000', timeline: '6 weeks' }
        ],
        strategicInitiatives: [
          { name: 'Predictive customer health scoring', impact: '200000', timeline: '6 months' },
          { name: 'Automated financial reporting', impact: '120000', timeline: '9 months' }
        ],
        futureOpportunities: [
          { name: 'AI-powered product recommendations', impact: '500000', timeline: '18 months' },
          { name: 'Predictive maintenance for infrastructure', impact: '150000', timeline: '24 months' }
        ]
      },
      summary: {
        currentState: 'Fast-growing SaaS company with $15M revenue experiencing scaling pains. Manual processes causing 4-hour support response times, 2-week onboarding cycles, and declining productivity. Total annual impact: $850K.',
        recommendedApproach: 'Phased AI implementation starting with customer support automation and sales lead scoring. Focus on integration platform to unify 15+ disparate systems. Target 40% efficiency improvement within 8 months.',
        expectedValue: {
          threeYearBenefit: '2400000',
          investment: '800000',
          netROI: '300%',
          paybackPeriod: '8 months'
        },
        nextSteps: [
          { action: 'Technical architecture review with CTO', owner: 'Mike Rodriguez', date: '2 weeks' },
          { action: 'ROI validation workshop', owner: 'Lisa Park', date: '3 weeks' },
          { action: 'Pilot project scope definition', owner: 'Sarah Chen', date: '1 month' }
        ],
        notes: 'Strong technical team, CEO is former engineer (technical buyer). Main concern is implementation speed - need to show quick wins. Competitive evaluation against 3 other vendors. Decision by end of Q1.'
      }
    };
  },

  /**
   * Manufacturing company profile
   */
  getManufacturingProfile() {
    return {
      companyName: 'PrecisionParts Manufacturing',
      industry: 'Manufacturing',
      size: '201-1000 employees',
      annualRevenue: '85M',
      employeeCount: '450',
      primaryLocation: 'Cleveland, Ohio',
      valueSellingFramework: {
        businessIssues: [
          'Cost Reduction Mandate',
          'Operational Efficiency',
          'Regulatory Compliance'
        ],
        businessIssueDetails: 'Traditional manufacturer facing pressure from low-cost overseas competitors. Need 25% cost reduction while maintaining quality. Current ERP system from 2010 cannot handle modern analytics needs.',
        impact: {
          totalAnnualImpact: '2400000'
        }
        // ... truncated for brevity, but would include full profile
      },
      summary: {
        currentState: 'Traditional manufacturer with aging systems, manual quality processes, and 15% waste rate. Losing contracts to lower-cost competitors.',
        recommendedApproach: 'AI-powered predictive maintenance, quality control automation, and supply chain optimization.'
      }
    };
  },

  /**
   * Healthcare organization profile  
   */
  getHealthcareProfile() {
    return {
      companyName: 'Regional Medical Center',
      industry: 'Healthcare',
      size: '1000+ employees',
      annualRevenue: '320M',
      employeeCount: '2100',
      primaryLocation: 'Phoenix, Arizona',
      valueSellingFramework: {
        businessIssues: [
          'Operational Efficiency',
          'Regulatory Compliance',
          'Customer Experience'
        ],
        businessIssueDetails: 'Regional hospital system struggling with nurse burnout, patient wait times, and regulatory compliance costs. Need to improve patient outcomes while reducing operational costs.',
        impact: {
          totalAnnualImpact: '5200000'
        }
      },
      summary: {
        currentState: '500-bed hospital system with 45-minute average wait times, 18% nurse turnover, and $5.2M compliance burden.',
        recommendedApproach: 'Clinical workflow automation, predictive patient risk scoring, and intelligent resource scheduling.'
      }
    };
  },

  /**
   * Financial services profile
   */
  getFinanceProfile() {
    return {
      companyName: 'Community Trust Bank',
      industry: 'Finance',
      size: '201-1000 employees', 
      annualRevenue: '180M',
      employeeCount: '380',
      primaryLocation: 'Charlotte, North Carolina',
      valueSellingFramework: {
        businessIssues: [
          'Regulatory Compliance',
          'Competitive Pressure',
          'Customer Experience'
        ],
        businessIssueDetails: 'Regional bank losing customers to fintech apps and digital-first competitors. Loan approval process takes 3 weeks vs 24 hours for online lenders. High compliance costs.',
        impact: {
          totalAnnualImpact: '3100000'
        }
      },
      summary: {
        currentState: 'Regional bank with 15 branches, 3-week loan processing, and declining market share to digital competitors.',
        recommendedApproach: 'Automated risk assessment, digital customer onboarding, and real-time fraud detection.'
      }
    };
  }
}; 


================================================
FILE: app/services/markdownService.js
================================================
'use client';

/**
 * Markdown Service for Client Profiles
 * 
 * Converts structured profile data to/from markdown format.
 * This prevents AI hallucinations by maintaining structured, parseable format.
 */

export const markdownService = {
  /**
   * Generate structured markdown from profile data
   * @param {Object} profileData - Structured profile data from forms
   * @returns {string} Formatted markdown content
   */
  generateMarkdown(profileData) {
    const sections = [
      this.generateHeader(profileData),
      this.generateCompanyOverview(profileData),
      this.generateValueSellingFramework(profileData),
      this.generateAIOpportunityAssessment(profileData),
      this.generateSummary(profileData)
    ];

    return sections.filter(section => section).join('\n\n---\n\n');
  },

  /**
   * Parse markdown back to structured data
   * @param {string} markdown - Markdown content
   * @returns {Object} Structured profile data
   */
  parseMarkdown(markdown) {
    try {
      const data = {};
      
      // Extract company name from header
      const nameMatch = markdown.match(/^# Client Profile: (.+)$/m);
      if (nameMatch) {
        data.companyName = nameMatch[1];
      } else {
        throw new Error('Invalid markdown format: missing client profile header');
      }
      
      // Parse company overview section
      data.companyOverview = this.parseCompanyOverview(markdown);
      
      // Parse value selling framework
      // data.valueSellingFramework = this.parseValueSellingFramework(markdown);
      
      // Parse AI opportunities
      // data.aiOpportunities = this.parseAIOpportunities(markdown);
      
      return data;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      throw error;
    }
  },

  generateHeader(data) {
    return `# Client Profile: ${data.companyName || '[Client Name]'}`;
  },

  generateCompanyOverview(data) {
    return `## Company Overview
- **Company Name**: ${data.companyName || '[Enter company name]'}
- **Industry**: ${data.industry || '[Enter industry]'}
- **Size**: ${data.size || '[Small (50-500) / Mid-Market (500-5K) / Enterprise (5K+)]'}
- **Annual Revenue**: $${data.annualRevenue || '[Enter amount]'}
- **Employee Count**: ${data.employeeCount || '[Enter number]'}
- **Primary Location**: ${data.primaryLocation || '[Enter location]'}

---`;
  },

  generateValueSellingFramework(data) {
    const framework = data.valueSellingFramework || {};
    let content = '## Value Selling Framework\n\n';

    // 1. Business Issue
    content += '### 1. Business Issue\n';
    content += '**High-level strategic priority or C-level concern:**\n';
    
    if (framework.businessIssues?.length > 0) {
      framework.businessIssues.forEach(issue => {
        content += `- [x] ${issue}\n`;
      });
    }
    
    if (framework.businessIssuesOther) {
      content += `- [x] Other: ${framework.businessIssuesOther}\n`;
    }
    
    if (framework.businessIssueDetails) {
      content += `\n**Details**: ${framework.businessIssueDetails}\n`;
    }

    // 2. Problems / Challenges
    content += '\n### 2. Problems / Challenges\n';
    content += '**Specific operational issues identified:**\n\n';

    // Department-specific problems
    const departments = [
      { key: 'finance', name: 'Finance Department' },
      { key: 'hr', name: 'HR Department' },
      { key: 'it', name: 'IT Department' },
      { key: 'customerService', name: 'Customer Service' },
      { key: 'operations', name: 'Operations' }
    ];

    departments.forEach(dept => {
      const problems = framework.departmentalProblems?.[dept.key] || [];
      if (problems.length > 0) {
        content += `#### ${dept.name}\n`;
        problems.forEach(problem => {
          content += `- [x] ${problem}\n`;
        });
        content += '\n';
      }
    });

    if (framework.additionalChallenges) {
      content += `**Additional Challenges**: ${framework.additionalChallenges}\n`;
    }

    // 3. Root Cause
    content += '\n### 3. Root Cause\n';
    content += '**Why do these challenges exist?**\n';
    
    if (framework.rootCauses?.length > 0) {
      framework.rootCauses.forEach(cause => {
        content += `- [x] ${cause}\n`;
      });
    }
    
    if (framework.rootCausesOther) {
      content += `- [x] Other: ${framework.rootCausesOther}\n`;
    }
    
    if (framework.rootCauseDetails) {
      content += `\n**Details**: ${framework.rootCauseDetails}\n`;
    }

    // 4. Impact
    content += '\n### 4. Impact\n';
    content += '**Quantified effects:**\n\n';
    
    content += '#### Hard Costs (Annual)\n';
    const hardCosts = framework.hardCosts || {};
    content += `- Labor costs from manual processes: $${hardCosts.laborCosts || '[Amount]'}\n`;
    content += `- Error correction costs: $${hardCosts.errorCosts || '[Amount]'}\n`;
    content += `- System downtime costs: $${hardCosts.downtimeCosts || '[Amount]'}\n`;
    content += `- Compliance penalties/risk: $${hardCosts.complianceCosts || '[Amount]'}\n`;
    
    const totalHardCosts = Object.values(hardCosts).reduce((sum, cost) => {
      const num = parseFloat(cost) || 0;
      return sum + num;
    }, 0);
    
    content += `- **Total Hard Costs**: $${totalHardCosts > 0 ? totalHardCosts.toLocaleString() : '[Sum]'}\n\n`;
    
    content += '#### Soft Costs\n';
    const softCosts = framework.softCosts || {};
    content += `- Employee frustration/turnover impact: ${softCosts.employeeFrustration || '[High/Medium/Low]'}\n`;
    content += `- Customer satisfaction decline: ${softCosts.customerSatisfaction || '[High/Medium/Low]'}\n`;
    content += `- Competitive disadvantage: ${softCosts.competitiveDisadvantage || '[High/Medium/Low]'}\n`;
    content += `- Missed opportunities/growth: ${softCosts.missedOpportunities || '[High/Medium/Low]'}\n`;

    // 5. Solution
    content += '\n### 5. Solution\n';
    content += '**Capabilities needed to solve these challenges:**\n';
    
    if (framework.solutionCapabilities?.length > 0) {
      framework.solutionCapabilities.forEach(capability => {
        content += `- [x] ${capability}\n`;
      });
    }
    
    if (framework.solutionCapabilitiesOther) {
      content += `- [x] Other: ${framework.solutionCapabilitiesOther}\n`;
    }

    content += '\n**Differentiation Requirements:**\n';
    if (framework.differentiationRequirements?.length > 0) {
      framework.differentiationRequirements.forEach(requirement => {
        content += `- [x] ${requirement}\n`;
      });
    }
    
    if (framework.differentiationOther) {
      content += `- [x] Other: ${framework.differentiationOther}\n`;
    }

    // Value/ROI Expectations
    content += '\n**Value / ROI Expectations:**\n';
    const roiExpectations = framework.roiExpectations || {};
    if (roiExpectations.costReduction) content += `- Target cost reduction: ${roiExpectations.costReduction}\n`;
    if (roiExpectations.efficiencyImprovement) content += `- Target efficiency improvement: ${roiExpectations.efficiencyImprovement}\n`;
    if (roiExpectations.paybackPeriod) content += `- Expected payback period: ${roiExpectations.paybackPeriod}\n`;
    if (roiExpectations.targetROI) content += `- Target ROI: ${roiExpectations.targetROI}\n`;
    if (roiExpectations.timeToFirstValue) content += `- Time to first value: ${roiExpectations.timeToFirstValue}\n`;

    // Success Metrics
    content += '\n**Success Metrics:**\n';
    if (framework.successMetrics?.length > 0) {
      framework.successMetrics.forEach(metric => {
        content += `- [x] ${metric}\n`;
      });
    }
    
    if (framework.successMetricsTargets) {
      content += `\n**Specific Targets**: ${framework.successMetricsTargets}\n`;
    }

    // 6. Decision
    content += '\n### 6. Decision\n';
    content += '**Decision makers and buying process:**\n\n';
    
    const decisionMakers = framework.decisionMakers || {};
    
    content += '#### Key Decision Makers\n';
    if (decisionMakers.economicBuyer?.name) {
      content += `**Economic Buyer**: ${decisionMakers.economicBuyer.name}`;
      if (decisionMakers.economicBuyer.title) content += ` (${decisionMakers.economicBuyer.title})`;
      if (decisionMakers.economicBuyer.budget) content += ` - Budget Authority: $${parseInt(decisionMakers.economicBuyer.budget).toLocaleString()}`;
      content += '\n';
    }
    
    if (decisionMakers.technicalBuyer?.name) {
      content += `**Technical Buyer**: ${decisionMakers.technicalBuyer.name}`;
      if (decisionMakers.technicalBuyer.title) content += ` (${decisionMakers.technicalBuyer.title})`;
      content += '\n';
    }
    
    if (decisionMakers.champion?.name) {
      content += `**Champion**: ${decisionMakers.champion.name}`;
      if (decisionMakers.champion.title) content += ` (${decisionMakers.champion.title})`;
      content += '\n';
    }
    
    if (decisionMakers.influencers) {
      content += `**Influencers**: ${decisionMakers.influencers}\n`;
    }

    content += '\n#### Buying Process\n';
    const buyingProcess = framework.buyingProcess || {};
    if (buyingProcess.timeline) content += `- **Decision timeline**: ${buyingProcess.timeline}\n`;
    if (buyingProcess.budgetCycle) content += `- **Budget cycle**: ${buyingProcess.budgetCycle}\n`;
    
    if (buyingProcess.evaluationCriteria?.length > 0) {
      content += '- **Evaluation criteria**:\n';
      buyingProcess.evaluationCriteria.forEach(criteria => {
        content += `  - ${criteria}\n`;
      });
    }
    
    if (buyingProcess.evaluationOther) {
      content += `  - ${buyingProcess.evaluationOther}\n`;
    }

    // Risks of Inaction
    content += '\n#### Risks of Inaction\n';
    const risksOfInaction = framework.risksOfInaction || {};
    if (risksOfInaction.costEscalation) {
      content += `- **Continued cost escalation**: $${parseInt(risksOfInaction.costEscalation).toLocaleString()} annually\n`;
    }
    if (risksOfInaction.employeeAttrition) {
      content += `- **Employee attrition risk**: ${risksOfInaction.employeeAttrition}\n`;
    }
    if (risksOfInaction.threeYearCost) {
      content += `- **Estimated cost of inaction (3 years)**: $${parseInt(risksOfInaction.threeYearCost).toLocaleString()}\n`;
    }
    if (risksOfInaction.competitiveDisadvantage) {
      content += `- **Competitive disadvantage**: ${risksOfInaction.competitiveDisadvantage}\n`;
    }
    if (risksOfInaction.customerSatisfaction) {
      content += `- **Customer satisfaction decline**: ${risksOfInaction.customerSatisfaction}\n`;
    }
    if (risksOfInaction.complianceRisk) {
      content += `- **Regulatory compliance risk**: ${risksOfInaction.complianceRisk}\n`;
    }

    return content;
  },

  generateAIOpportunityAssessment(data) {
    const assessment = data.aiOpportunityAssessment || {};
    let content = '## AI/Automation Opportunity Assessment\n\n';

    // Current Technology Landscape
    content += '### Current Technology Landscape\n';
    const currentTech = assessment.currentTechnology || {};
    content += `- **Primary ERP**: ${currentTech.erp || '[Not specified]'}\n`;
    content += `- **CRM System**: ${currentTech.crm || '[Not specified]'}\n`;
    content += `- **Collaboration Tools**: ${currentTech.collaboration || '[Not specified]'}\n`;
    content += `- **Integration Maturity**: ${currentTech.integrationMaturity || '[Not assessed]'}\n`;
    content += `- **Data Quality**: ${currentTech.dataQuality || '[Not assessed]'}\n`;
    
    if (currentTech.automation) {
      content += `- **Current Automation**: ${currentTech.automation}\n`;
    }

    // AI Readiness Score
    content += '\n### AI Readiness Score\n';
    const readinessScoring = assessment.readinessScoring || {};
    const criteriaLabels = {
      dataQuality: 'Data availability and quality',
      integration: 'System integration capability',
      technicalTeam: 'Technical team readiness',
      leadership: 'Leadership support',
      changeManagement: 'Change management capability'
    };

    Object.entries(criteriaLabels).forEach(([key, label]) => {
      const score = readinessScoring[key] || 0;
      const max = 2;
      content += `- **${label}**: ${score}/${max}\n`;
    });

    const totalScore = Object.values(readinessScoring).reduce((sum, score) => sum + (score || 0), 0);
    content += `\n**Total AI Readiness Score: ${totalScore}/10**\n`;

    // Top AI Opportunities
    content += '\n### Top AI Opportunities (Prioritized)\n';
    const opportunities = assessment.opportunities || [];
    
    if (opportunities.length > 0) {
      opportunities
        .sort((a, b) => (b.priorityScore || 0) - (a.priorityScore || 0))
        .forEach((opportunity, index) => {
          content += `\n#### ${index + 1}. ${opportunity.name || 'Unnamed Opportunity'}\n`;
          content += `- **Department**: ${opportunity.department || 'Not specified'}\n`;
          content += `- **Process**: ${opportunity.process || 'Not specified'}\n`;
          content += `- **Current State**: ${opportunity.currentState || 'Not described'}\n`;
          content += `- **AI Solution**: ${opportunity.aiSolution || 'Not specified'}\n`;
          content += `- **Estimated Impact**: $${opportunity.estimatedImpact ? parseInt(opportunity.estimatedImpact).toLocaleString() : '[Not quantified]'}\n`;
          content += `- **Implementation Effort**: ${opportunity.implementationEffort || 'Medium'}\n`;
          content += `- **Timeline**: ${opportunity.timeline || 'Not specified'}\n`;
          content += `- **Priority Score**: ${opportunity.priorityScore || 5}/10\n`;
        });
    } else {
      content += 'No specific opportunities identified yet.\n';
    }

    // Quick Wins
    content += '\n### Quick Wins (0-6 months)\n';
    const quickWins = assessment.quickWins || [];
    
    if (quickWins.length > 0) {
      quickWins.forEach((quickWin, index) => {
        content += `${index + 1}. **${quickWin.name || 'Unnamed Quick Win'}**\n`;
        content += `   - Impact: $${quickWin.impact ? parseInt(quickWin.impact).toLocaleString() : '[Not quantified]'}\n`;
        content += `   - Timeline: ${quickWin.timeline || 'Not specified'}\n`;
      });
    } else {
      content += 'No quick wins identified yet.\n';
    }

    return content;
  },

  generateSummary(data) {
    const summary = data.summary || {};
    
    return `## Summary & Next Steps

### Executive Summary
**Current State**: ${summary.currentState || '[Brief description of key challenges and costs]'}

**Recommended Approach**: ${summary.recommendedApproach || '[High-level strategy recommendation]'}

**Expected Value**: 
- Total 3-year benefit: $${summary.expectedValue?.threeYearBenefit || '[Amount]'}
- Investment required: $${summary.expectedValue?.investment || '[Amount]'}
- Net ROI: ${summary.expectedValue?.netROI || '[X]%'}
- Payback period: ${summary.expectedValue?.paybackPeriod || '[X] months'}

### Immediate Next Steps
${this.generateNextSteps(summary.nextSteps)}

### Notes & Additional Context
${summary.notes || '[Free text area for additional observations, quotes from stakeholders, competitive insights, etc.]'}

---`;
  },

  generateFooter(data) {
    const now = new Date().toLocaleDateString();
    return `*Profile created on: ${now}*
*Last updated: ${now}*
*Created by: ${data.createdBy || '[Consultant name]'}*`;
  },

  // Helper methods
  generateCheckboxList(items, selectedItems = []) {
    return items.map(item => {
      const checked = selectedItems.includes(item) ? 'x' : ' ';
      return `- [${checked}] ${item}`;
    }).join('\n');
  },

  generateDepartmentProblems(department, problems = {}) {
    const templates = {
      finance: [
        'Manual invoice processing taking [X] days',
        '[X]% error rate in financial processes',
        'Month-end close takes [X] days'
      ],
      hr: [
        'Employee onboarding takes [X] days',
        'Manual resume screening',
        '[X]% employee turnover rate'
      ],
      it: [
        'Average ticket resolution: [X] hours',
        '[X]% of tickets require manual intervention',
        'System provisioning takes [X] hours'
      ],
      customerService: [
        'Average response time: [X] hours',
        '[X]% first contact resolution rate',
        'Customer satisfaction score: [X]/10'
      ],
      operations: [
        'Process cycle time: [X] days',
        '[X]% manual processes',
        'Quality issues: [X]% error rate'
      ]
    };

    const items = templates[department] || [];
    
    if (items.length === 0) {
      return '- [ ] Other: [Specify]';
    }
    
    return items.map(item => {
      const checked = problems[item] ? 'x' : ' ';
      return `- [${checked}] ${item}`;
    }).join('\n') + '\n- [ ] Other: [Specify]';
  },

  generateAIOpportunities(opportunities = []) {
    if (!opportunities.length) {
      return `#### Opportunity 1: [Name]
- **Department**: [Department]
- **Process**: [Specific process to automate]
- **Current State**: [How it works today]
- **AI Solution**: [What AI would do]
- **Estimated Impact**: $[Annual savings/benefit]
- **Implementation Effort**: [Low/Medium/High]
- **Timeline**: [X] months
- **Priority Score**: [X]/10`;
    }

    return opportunities.map((opp, index) => `#### Opportunity ${index + 1}: ${opp.name || '[Name]'}
- **Department**: ${opp.department || '[Department]'}
- **Process**: ${opp.process || '[Specific process to automate]'}
- **Current State**: ${opp.currentState || '[How it works today]'}
- **AI Solution**: ${opp.aiSolution || '[What AI would do]'}
- **Estimated Impact**: $${opp.estimatedImpact || '[Annual savings/benefit]'}
- **Implementation Effort**: ${opp.implementationEffort || '[Low/Medium/High]'}
- **Timeline**: ${opp.timeline || '[X] months'}
- **Priority Score**: ${opp.priorityScore || '[X]'}/10`).join('\n\n');
  },

  generateOpportunitiesList(opportunities = []) {
    if (!opportunities.length) {
      return '1. [Opportunity name] - $[Impact] - [Timeline]\n2. [Opportunity name] - $[Impact] - [Timeline]\n3. [Opportunity name] - $[Impact] - [Timeline]';
    }

    return opportunities.map((opp, index) => 
      `${index + 1}. ${opp.name || '[Opportunity name]'} - $${opp.impact || '[Impact]'} - ${opp.timeline || '[Timeline]'}`
    ).join('\n');
  },

  generateNextSteps(steps = []) {
    if (!steps.length) {
      return '1. [ ] [Specific action item with owner and date]\n2. [ ] [Specific action item with owner and date]\n3. [ ] [Specific action item with owner and date]';
    }

    return steps.map((step, index) => 
      `${index + 1}. [ ] ${step.action || '[Specific action item]'} - ${step.owner || '[Owner]'} - ${step.date || '[Date]'}`
    ).join('\n');
  },

  // Parsing methods for markdown to data conversion
  parseCompanyOverview(markdown) {
    const section = this.extractSection(markdown, '## Company Overview');
    const data = {};
    
    const patterns = {
      companyName: /\*\*Company Name\*\*:\s*(.+)/,
      industry: /\*\*Industry\*\*:\s*(.+)/,
      size: /\*\*Size\*\*:\s*(.+)/,
      annualRevenue: /\*\*Annual Revenue\*\*:\s*\$(.+)/,
      employeeCount: /\*\*Employee Count\*\*:\s*(.+)/,
      primaryLocation: /\*\*Primary Location\*\*:\s*(.+)/
    };

    Object.entries(patterns).forEach(([key, pattern]) => {
      const match = section.match(pattern);
      if (match) data[key] = match[1].trim();
    });

    return data;
  },

  extractSection(markdown, heading) {
    // Escape special regex characters in the heading
    const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    // Match the heading and capture content until the next heading of same or higher level or end of string
    // Note: Don't use 'm' flag as it makes $ match end of line instead of end of string
    const regex = new RegExp(`${escapedHeading}\\n([\\s\\S]*?)(?=\\n##|$)`);
    const match = markdown.match(regex);
    return match ? match[1].trim() : '';
  }
}; 


================================================
FILE: app/services/profileService.js
================================================
'use client';

/**
 * Client Profile Management Service
 * 
 * Handles CRUD operations for client profiles stored as structured markdown files.
 * Integrates with AI services for timeline generation and opportunity analysis.
 */

import { markdownService } from './markdownService';

export class ProfileService {
  /**
   * Create a new client profile
   * @param {Object} profileData - Raw form data
   * @returns {Promise<Object>} Created profile with ID
   */
  static async createProfile(profileData) {
    try {
      // Generate unique ID
      const profileId = this.generateProfileId(profileData.companyName);
      
      // Convert form data to structured markdown
      const markdown = markdownService.generateMarkdown(profileData);
      
      // Store profile (in real implementation, this would save to backend/filesystem)
      const profile = {
        id: profileId,
        ...profileData,
        markdown,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };
      
      await this.saveProfile(profile);
      return profile;
    } catch (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
  }

  /**
   * Generate AI timeline from profile data
   * @param {Object} profile - Client profile
   * @returns {Promise<Object>} Timeline data
   */
  static async generateTimelineFromProfile(profile) {
    try {
      // Extract business profile data for timeline service
      const businessProfile = this.extractBusinessProfile(profile);
      
      // Determine scenario type based on profile characteristics
      const scenarioType = this.determineScenarioType(profile);
      
      // Use existing timeline service with enhanced context
      const { TimelineService } = await import('./timelineService');
      const timeline = await TimelineService.generateTimeline(businessProfile, scenarioType);
      
      // Enhance timeline with profile-specific insights
      return this.enhanceTimelineWithProfile(timeline, profile);
    } catch (error) {
      console.error('Error generating timeline from profile:', error);
      throw error;
    }
  }

  /**
   * Extract business profile data from client profile
   */
  static extractBusinessProfile(profile) {
    return {
      companyName: profile.companyName,
      industry: profile.industry,
      companySize: this.mapCompanySize(profile.size),
      aiMaturityLevel: this.calculateAIMaturity(profile),
      primaryGoals: this.extractPrimaryGoals(profile),
      currentTechStack: profile.currentTechnology || [],
      budget: this.estimateBudgetRange(profile),
      timeframe: this.extractTimeframe(profile)
    };
  }

  /**
   * Estimate budget range based on profile
   */
  static estimateBudgetRange(profile) {
    const budget = profile.valueSellingFramework?.decisionMakers?.economicBuyer?.budget;
    if (budget) {
      return budget;
    }
    
    // Estimate based on company size and impact
    const impact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
    if (impact > 5000000) return '>5m';
    if (impact > 1000000) return '1m-5m';
    if (impact > 500000) return '500k-1m';
    if (impact > 100000) return '100k-500k';
    return '<100k';
  }

  /**
   * Extract timeframe from profile
   */
  static extractTimeframe(profile) {
    const timeline = profile.valueSellingFramework?.buyingProcess?.timeline;
    if (timeline) {
      const months = parseInt(timeline);
      if (months <= 3) return '3months';
      if (months <= 6) return '6months';
      if (months <= 12) return '1year';
      return '2years+';
    }
    return '1year'; // Default
  }

  /**
   * Determine AI adoption scenario based on profile characteristics
   */
  static determineScenarioType(profile) {
    const aiReadiness = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    const decisionTimeline = profile.decisionTimeline || 12;
    const riskTolerance = profile.riskTolerance || 'medium';
    
    if (aiReadiness >= 8 && decisionTimeline <= 6 && riskTolerance === 'high') {
      return 'aggressive';
    } else if (aiReadiness <= 4 || decisionTimeline >= 18 || riskTolerance === 'low') {
      return 'conservative';
    }
    return 'balanced';
  }

  /**
   * Generate opportunity recommendations based on profile
   */
  static async generateOpportunityRecommendations(profile) {
    // Analyze profile data to suggest AI/automation opportunities
    const opportunities = [];
    
    // Finance opportunities
    if (profile.problems?.finance?.manualInvoiceProcessing) {
      opportunities.push({
        department: 'Finance',
        title: 'Automated Invoice Processing',
        description: 'AI-powered invoice recognition and approval workflows',
        impact: this.calculateFinanceImpact(profile),
        effort: 'Medium',
        timeline: '3-4 months',
        priority: 'High'
      });
    }
    
    // HR opportunities
    if (profile.problems?.hr?.manualResumeScreening) {
      opportunities.push({
        department: 'HR',
        title: 'AI Resume Screening',
        description: 'Automated candidate screening and ranking',
        impact: this.calculateHRImpact(profile),
        effort: 'Low',
        timeline: '1-2 months',
        priority: 'Medium'
      });
    }
    
    // Customer Service opportunities
    if (profile.problems?.customerService?.responseTime) {
      opportunities.push({
        department: 'Customer Service',
        title: 'AI Chatbot & Routing',
        description: 'Intelligent ticket routing and automated responses',
        impact: this.calculateServiceImpact(profile),
        effort: 'Medium',
        timeline: '2-3 months',
        priority: 'High'
      });
    }
    
    return opportunities.sort((a, b) => {
      const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }

  /**
   * Enhanced timeline with profile-specific context
   */
  static enhanceTimelineWithProfile(timeline, profile) {
    // Add profile-specific insights to each phase
    if (timeline.phases) {
      timeline.phases = timeline.phases.map((phase, index) => ({
        ...phase,
        profileInsights: this.getPhaseInsights(profile, index),
        specificOpportunities: this.getPhaseOpportunities(profile, index)
      }));
    }
    
    // Add risk factors based on profile
    timeline.riskFactors = this.identifyRiskFactors(profile);
    
    // Add competitive insights
    timeline.competitiveContext = this.getCompetitiveContext(profile);
    
    return timeline;
  }

  /**
   * Get phase-specific insights based on profile
   */
  static getPhaseInsights(profile, phaseIndex) {
    const insights = {
      0: `Focus on ${profile.primaryBusinessIssue} while building foundation`,
      1: `Address ${profile.topProblem} with targeted automation`,
      2: `Scale successful pilots across ${profile.size} organization`,
      3: `Optimize for ${profile.successMetrics?.join(', ')} improvements`
    };
    
    return insights[phaseIndex] || 'Continue systematic AI adoption';
  }

  /**
   * Calculate impact methods
   */
  static calculateFinanceImpact(profile) {
    const laborCosts = profile.valueSellingFramework?.impact?.laborCosts || 0;
    const errorCosts = profile.valueSellingFramework?.impact?.errorCosts || 0;
    // Estimate 30% reduction in finance labor and 80% reduction in errors
    return Math.round((laborCosts * 0.3) + (errorCosts * 0.8));
  }

  static calculateHRImpact(profile) {
    const employeeCount = parseInt(profile.employeeCount) || 100;
    // Estimate savings based on hiring volume
    return Math.round(employeeCount * 1000); // $1000 per employee per year in hiring efficiency
  }

  static calculateServiceImpact(profile) {
    const totalImpact = profile.valueSellingFramework?.impact?.totalAnnualImpact || 0;
    // Customer service typically represents 20-30% of operational impact
    return Math.round(totalImpact * 0.25);
  }

  /**
   * Utility methods
   */
  static generateProfileId(companyName) {
    const timestamp = Date.now().toString(36);
    const nameSlug = companyName.toLowerCase().replace(/[^a-z0-9]/g, '-').substring(0, 20);
    return `${nameSlug}-${timestamp}`;
  }

  static mapCompanySize(size) {
    const mapping = {
      '1-50 employees': 'startup',
      '51-200 employees': 'small',
      '201-1000 employees': 'medium',
      '1000+ employees': 'large'
    };
    return mapping[size] || 'medium';
  }

  static calculateAIMaturity(profile) {
    const score = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    if (score <= 3) return 'beginner';
    if (score <= 6) return 'emerging';
    if (score <= 8) return 'developing';
    return 'advanced';
  }

  static extractPrimaryGoals(profile) {
    const goals = [];
    if (profile.businessIssue?.revenueGrowth) goals.push('Increase Revenue');
    if (profile.businessIssue?.costReduction) goals.push('Reduce Operational Costs');
    if (profile.businessIssue?.customerExperience) goals.push('Improve Customer Experience');
    if (profile.businessIssue?.operationalEfficiency) goals.push('Automate Workflows');
    return goals;
  }

  static async saveProfile(profile) {
    // In production, this would save to your backend/database
    // For now, store in localStorage
    const profiles = JSON.parse(localStorage.getItem('clientProfiles') || '[]');
    profiles.push(profile);
    localStorage.setItem('clientProfiles', JSON.stringify(profiles));
  }

  static async getProfiles() {
    // In production, fetch from backend
    return JSON.parse(localStorage.getItem('clientProfiles') || '[]');
  }

  static async getProfile(id) {
    const profiles = await this.getProfiles();
    return profiles.find(p => p.id === id);
  }

  static identifyRiskFactors(profile) {
    const risks = [];
    const aiReadiness = profile.aiOpportunityAssessment?.aiReadinessScore || profile.aiReadinessScore || 5;
    
    if (aiReadiness < 4) {
      risks.push({
        type: 'Technical Readiness',
        level: 'High',
        description: 'Low AI readiness score may slow implementation'
      });
    }
    
    if (profile.changeManagementCapability === 'Low') {
      risks.push({
        type: 'Change Management',
        level: 'Medium',
        description: 'Limited change management capability requires extra support'
      });
    }
    
    return risks;
  }

  static getCompetitiveContext(profile) {
    return {
      urgency: profile.competitivePressure ? 'High' : 'Medium',
      differentiators: profile.differentiationRequirements || [],
      marketPosition: profile.industry === 'Technology' ? 'Fast-moving' : 'Traditional'
    };
  }
} 


================================================
FILE: app/services/timelineService.js
================================================
'use client';

/**
 * Timeline Generation Service
 * 
 * This service handles the generation of AI transformation timelines based on
 * business profiles. Currently uses rule-based generation, ready for AI integration.
 */

export class TimelineService {
  /**
   * Generate a comprehensive AI transformation timeline
   * @param {Object} businessProfile - Company profile data
   * @param {string} scenarioType - 'conservative', 'balanced', or 'aggressive'
   * @returns {Promise<Object>} Generated timeline data
   */
  static async generateTimeline(businessProfile, scenarioType = 'balanced') {
    // Simulate API processing time
    await new Promise(resolve => setTimeout(resolve, 1500));

    const timeline = {
      currentState: this.generateCurrentState(businessProfile),
      phases: this.generatePhases(businessProfile, scenarioType),
      futureState: this.generateFutureState(businessProfile, scenarioType),
      summary: this.generateSummary(businessProfile, scenarioType)
    };

    return timeline;
  }

  /**
   * Generate current state analysis
   */
  static generateCurrentState(profile) {
    const maturityDescriptions = {
      beginner: 'early stages of digital transformation with minimal AI adoption',
      emerging: 'beginning to explore AI opportunities with some basic automation',
      developing: 'actively implementing AI solutions across several business areas',
      advanced: 'sophisticated AI capabilities with widespread organizational adoption'
    };

    const industryFocus = {
      Technology: 'software development and product innovation',
      Healthcare: 'patient care and operational efficiency',
      Finance: 'risk management and customer experience',
      Manufacturing: 'supply chain optimization and quality control',
      Retail: 'customer personalization and inventory management',
      Education: 'learning outcomes and administrative efficiency'
    };

    return {
      description: `As a ${profile.companySize} company in the ${profile.industry} industry, you're at the ${profile.aiMaturityLevel} stage of AI adoption. Your organization is in the ${maturityDescriptions[profile.aiMaturityLevel] || 'transitional phase'}, with primary focus on ${industryFocus[profile.industry] || 'operational excellence'}.`,
      initiatives: [
        {
          title: 'AI Readiness Assessment',
          description: 'Comprehensive evaluation of current systems, processes, and capabilities',
          impact: 'Establishes baseline for AI transformation journey'
        },
        {
          title: 'Stakeholder Alignment',
          description: 'Executive buy-in and cross-functional team formation',
          impact: 'Creates organizational momentum for change'
        },
        {
          title: 'Quick Wins Identification',
          description: 'Identify high-impact, low-risk AI opportunities',
          impact: 'Builds confidence and demonstrates ROI potential'
        }
      ],
      technologies: this.getCurrentTechStack(profile),
      outcomes: this.getCurrentStateMetrics(profile)
    };
  }

  /**
   * Generate transformation phases
   */
  static generatePhases(profile, scenarioType) {
    const phases = [];
    const companySize = profile.companySize;
    const industry = profile.industry;

    // Phase 1 - Foundation (6 months)
    phases.push({
      description: 'Establish the foundational infrastructure and capabilities for AI transformation. Focus on data consolidation, team development, and pilot implementations.',
      highlights: this.getPhaseHighlights(1, companySize, scenarioType),
      initiatives: this.getPhaseInitiatives(1, industry, companySize),
      technologies: this.getPhaseTechnologies(1, scenarioType),
      outcomes: this.getPhaseOutcomes(1, companySize, scenarioType)
    });

    // Phase 2 - Implementation (6-12 months)
    phases.push({
      description: 'Deploy AI solutions across core business processes. Scale successful pilots and introduce advanced analytics capabilities.',
      highlights: this.getPhaseHighlights(2, companySize, scenarioType),
      initiatives: this.getPhaseInitiatives(2, industry, companySize),
      technologies: this.getPhaseTechnologies(2, scenarioType),
      outcomes: this.getPhaseOutcomes(2, companySize, scenarioType)
    });

    // Phase 3 - Expansion (12-18 months)
    phases.push({
      description: 'Expand AI capabilities across the enterprise. Integrate advanced AI into customer-facing and mission-critical operations.',
      highlights: this.getPhaseHighlights(3, companySize, scenarioType),
      initiatives: this.getPhaseInitiatives(3, industry, companySize),
      technologies: this.getPhaseTechnologies(3, scenarioType),
      outcomes: this.getPhaseOutcomes(3, companySize, scenarioType)
    });

    // Phase 4 - Optimization (18-36 months)
    phases.push({
      description: 'Optimize and refine AI systems for maximum value. Focus on advanced AI, automation, and emerging technologies.',
      highlights: this.getPhaseHighlights(4, companySize, scenarioType),
      initiatives: this.getPhaseInitiatives(4, industry, companySize),
      technologies: this.getPhaseTechnologies(4, scenarioType),
      outcomes: this.getPhaseOutcomes(4, companySize, scenarioType)
    });

    return phases;
  }

  /**
   * Generate future state vision
   */
  static generateFutureState(profile, scenarioType) {
    const industryLeadership = {
      Technology: 'driving innovation in AI-powered software solutions',
      Healthcare: 'revolutionizing patient care through intelligent healthcare systems',
      Finance: 'leading in AI-driven financial services and risk management',
      Manufacturing: 'pioneering smart manufacturing and autonomous operations',
      Retail: 'defining the future of personalized customer experiences',
      Education: 'transforming learning through adaptive AI technologies'
    };

    return {
      description: `Your organization will be an AI-native enterprise, ${industryLeadership[profile.industry] || 'leading in AI innovation'}. Every aspect of operations will be enhanced by AI, creating unprecedented efficiency, innovation, and competitive advantage.`,
      highlights: [
        { label: 'AI Integration', value: scenarioType === 'aggressive' ? '95%' : scenarioType === 'balanced' ? '85%' : '75%' },
        { label: 'Revenue Impact', value: scenarioType === 'aggressive' ? '+55%' : scenarioType === 'balanced' ? '+35%' : '+25%' },
        { label: 'Cost Reduction', value: scenarioType === 'aggressive' ? '45%' : scenarioType === 'balanced' ? '35%' : '25%' },
        { label: 'Innovation Score', value: scenarioType === 'aggressive' ? '9.8/10' : scenarioType === 'balanced' ? '8.5/10' : '7.8/10' }
      ],
      initiatives: [
        {
          title: 'AI-First Organization',
          description: 'Every employee empowered with AI tools and capabilities',
          impact: 'Industry-leading productivity and innovation culture'
        },
        {
          title: 'Ecosystem Leadership',
          description: 'Driving industry standards and AI best practices',
          impact: 'Market influence and thought leadership position'
        }
      ],
      technologies: ['AGI-ready Infrastructure', 'Quantum Computing', 'Neural Interfaces', 'Autonomous Systems'],
      outcomes: this.getFutureStateOutcomes(profile, scenarioType)
    };
  }

  /**
   * Generate project summary
   */
  static generateSummary(profile, scenarioType) {
    const investmentRanges = {
      conservative: { min: 2.5, max: 5.0 },
      balanced: { min: 4.5, max: 8.5 },
      aggressive: { min: 7.0, max: 15.0 }
    };

    const roiMultipliers = {
      conservative: 285,
      balanced: 425,
      aggressive: 650
    };

    const investment = investmentRanges[scenarioType];
    const roi = roiMultipliers[scenarioType];

    return {
      totalInvestment: `$${investment.min}M - $${investment.max}M`,
      expectedROI: `${roi}%`,
      timeToValue: scenarioType === 'aggressive' ? '3 months' : scenarioType === 'balanced' ? '6 months' : '9 months',
      riskLevel: scenarioType === 'aggressive' ? 'Moderate-High' : scenarioType === 'balanced' ? 'Balanced' : 'Low-Moderate'
    };
  }

  // Helper methods for generating phase-specific content
  static getPhaseHighlights(phase, companySize, scenarioType) {
    const durations = {
      conservativ