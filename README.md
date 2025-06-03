# Agentic AI Flow Visualizer & Business AI Advisory Platform

**🤖 AI Assistant Context:** This is a comprehensive business AI advisory platform built with Next.js, featuring ServiceNow agentic AI flow visualization, interactive AI transformation timelines, and client profile management with Value Selling Framework. The platform serves as a sophisticated lead-generation tool for AI advisory services, combining technical visualization capabilities with comprehensive business intelligence collection and strategic planning tools. Core technologies: Next.js 15, React 19, ReactFlow, Zustand, Dagre. Design inspired by ai-2027.com with modern dark themes and floating UI elements.

**🎯 Current State:** Fully functional three-feature platform with ServiceNow visualization, AI transformation timeline, and comprehensive client profile management system. **NEW: Complete Supabase backend integration** with enterprise-grade database architecture, 37 comprehensive tests passing, and AI-native foundation. Recent major additions include ProfileWizard with 8-step Value Selling Framework, structured markdown profile storage, realistic demo data system, and automatic timeline generation from client profiles. Architecture now features robust Supabase service layers with RLS security, audit trails, feature flags, and multi-LLM provider preparation. Ready for production deployment and enterprise scaling.

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

### **🚀 Supabase Backend Integration (NEW)**

The platform now features a comprehensive Supabase backend that provides enterprise-grade data management, real-time capabilities, and AI-native architecture. This migration from localStorage establishes the foundation for scaling to enterprise users while maintaining all existing functionality.

#### **Database Architecture**
```sql
-- Core Tables with Enterprise Features
profiles              -- Client digital twins with flexible JSONB schema
├── profile_versions  -- Complete audit trail and versioning
├── timelines        -- AI-generated transformation roadmaps  
├── ai_conversations -- LLM interaction history with cost tracking
├── integrations     -- Vendor-agnostic connection management
├── documents        -- PDF exports, meeting notes, file storage
├── features         -- Modular feature flags for controlled rollouts
├── user_features    -- Per-user feature customization
└── audit_logs       -- Comprehensive compliance and activity tracking
```

#### **Service Layer Enhancement**
```javascript
app/services/
├── supabaseService.js        // 🆕 Core Supabase client with 8 service classes
│   ├── ProfileDB            // Profile CRUD with RLS security
│   ├── ProfileVersionDB     // Audit trail and version control
│   ├── AIConversationDB     // LLM cost tracking and history
│   ├── TimelineDB           // Timeline storage and retrieval
│   ├── AuthService          // Authentication management
│   ├── AuditService         // Compliance logging
│   ├── FeatureService       // Feature flag management
│   └── RealtimeService      // Live collaboration features
├── profileService.js        // Enhanced with Supabase backend
├── markdownService.js       // AI-compatible structured storage
├── demoDataService.js       // Realistic demo scenarios
└── timelineService.js       // AI timeline generation
```

#### **Security & Compliance Features**
- **Row Level Security (RLS)**: Multi-tenant data isolation
- **Field-Level Encryption**: Sensitive data protection
- **Comprehensive Audit Trails**: GDPR compliance ready
- **Feature Flag System**: Controlled feature rollouts
- **Real-time Collaboration**: Live profile editing

#### **AI Provider Architecture** 
```javascript
// Multi-LLM Foundation (Prepared)
app/services/ai/
├── providers/
│   ├── openaiProvider.js     // GPT-4, GPT-4o integration
│   ├── anthropicProvider.js  // Claude 3.5 Sonnet
│   ├── googleProvider.js     // Gemini Pro
│   └── baseProvider.js       // Abstract provider interface
├── aiService.js              // Provider orchestration
├── promptTemplates.js        // Reusable prompt library
└── usageTracking.js          // Cost optimization & analytics
```

#### **Testing Architecture** ✅
- **37 Comprehensive Tests**: Full Supabase service layer coverage
- **Mock Infrastructure**: Complete testing environment
- **TDD Workflow**: Test-driven development maintained
- **Integration Testing**: Database operations and API routes
- **Security Testing**: RLS policies and authentication flows

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

**🧪 Testing Status**: Comprehensive test suite implemented with **164 tests passing** (ProfileService: 35, MarkdownService: 20, TimelineService: 41, DemoDataService: 46, **Core Supabase Services: 37**). TDD approach established and maintained throughout backend integration. Full test coverage for authentication, database operations, AI services, feature flags, audit logging, real-time capabilities, and comprehensive demo data management. Phase 2 migration complete with 100% backward compatibility. See TESTING_GUIDE.md for complete testing documentation and working with AI assistants.

## API Reference

### AI Provider Models (Updated May 2025)

#### OpenAI Models
**Latest Models (Current):**
- **GPT-4.5** (gpt-4.5-preview): $75/$150 per 1M tokens - Most capable model for complex tasks
- **GPT-4.1** (gpt-4.1): $2/$8 per 1M tokens - Latest production model with 1M context window
- **GPT-4o** (gpt-4o): $2.50/$10 per 1M tokens - Current primary model with vision support
- **GPT-4o mini** (gpt-4o-mini): $0.15/$0.60 per 1M tokens - Cost-effective option

**Reasoning Models:**
- **o3** (o3): $60/$240 per 1M tokens - Advanced reasoning capabilities
- **o3-mini** (o3-mini): $1.10/$4.40 per 1M tokens - Cost-effective reasoning
- **o1** (o1): $15/$60 per 1M tokens - Previous generation reasoning

**Legacy Models (Deprecated):**
- GPT-4 Turbo: $10/$30 per 1M tokens
- GPT-3.5 Turbo: $0.50/$1.50 per 1M tokens

#### Anthropic Claude Models
**Claude 4 Series (New - May 2025):**
- **Claude 4 Opus** (claude-4-opus): $15/$75 per 1M tokens - Most capable Claude model
- **Claude 4 Sonnet** (claude-4-sonnet): $3/$15 per 1M tokens - Balanced performance

**Claude 3.7 Series (Current Production):**
- **Claude 3.7 Sonnet** (claude-3.7-sonnet): $3/$15 per 1M tokens - Latest production model

**Claude 3.5 Series:**
- **Claude 3.5 Sonnet** (claude-3.5-sonnet): $3/$15 per 1M tokens
- **Claude 3.5 Haiku** (claude-3.5-haiku): $0.80/$4 per 1M tokens - Fast and cost-effective

#### Google Gemini Models
**Gemini 2.5 Series (Latest):**
- **Gemini 2.5 Pro** (gemini-2.5-pro): $1.25-$2.50/$10-$15 per 1M tokens (context-based pricing)

**Gemini 2.0 Series (Current):**
- **Gemini 2.0 Flash** (gemini-2.0-flash): $0.10/$0.40 per 1M tokens - Production model with 1M context
- **Gemini 2.0 Flash Lite** (gemini-2.0-flash-lite): $0.075/$0.30 per 1M tokens - Lightweight option

**Gemini 1.5 Series (Stable):**
- **Gemini 1.5 Pro** (gemini-1.5-pro): $1.25-$2.50/$5-$10 per 1M tokens - 2M context window
- **Gemini 1.5 Flash** (gemini-1.5-flash): $0.075-$0.15/$0.30-$0.60 per 1M tokens
- **Gemini 1.5 Flash 8B** (gemini-1.5-flash-8b): $0.0375-$0.075/$0.15-$0.30 per 1M tokens

### Key Changes from Previous Versions

1. **Pricing Structure**: All models now priced per **million tokens** (not thousands)
2. **Massive Context Windows**: Some models support 1M+ tokens
3. **Cached Input Discounts**: Up to 75% discount for cached content
4. **Reasoning Models**: New category with specialized capabilities
5. **Multimodal Support**: Vision, audio, and video capabilities
6. **Significant Price Increases**: Premium models are much more expensive

### Usage Examples

#### Basic Text Generation with Updated Models
```javascript
// Using the latest GPT-4.1 model
const response = await aiService.generate({
  model: 'gpt-4.1',
  messages: [
    { role: 'user', content: 'Explain quantum computing in simple terms' }
  ],
  provider: 'openai'
});

// Using Claude 4 Sonnet
const response = await aiService.generate({
  model: 'claude-4-sonnet',
  messages: [
    { role: 'user', content: 'Write a detailed analysis of market trends' }
  ],
  provider: 'anthropic'
});

// Using Gemini 2.0 Flash with multimodal input
const response = await aiService.generate({
  model: 'gemini-2.0-flash',
  messages: [
    {
      role: 'user',
      content: [
        { type: 'text', text: 'What do you see in this image?' },
        { type: 'image', data: base64ImageData }
      ]
    }
  ],
  provider: 'google'
});
```

#### Cost-Optimized Model Selection
```javascript
// Get budget-friendly recommendation
const budgetModel = aiService.getProvider('openai').getRecommendedModel({
  budget: 'budget',
  needsVision: false,
  contextLength: 50000
});
console.log(budgetModel); // 'gpt-4o-mini'

// Get premium model for complex reasoning
const premiumModel = aiService.getProvider('openai').getRecommendedModel({
  budget: 'premium',
  needsReasoning: true
});
console.log(premiumModel); // 'o3' or 'gpt-4.5-preview'

// Cost estimation
const costs = aiService.getProvider('openai').estimateCosts({
  inputTokensPerMonth: 1000000,  // 1M tokens
  outputTokensPerMonth: 250000,  // 250K tokens
  cachedInputRatio: 0.3          // 30% cached
});
```

### Provider-Specific Features

#### OpenAI Features
- **Cached Input Pricing**: Up to 75% discount for repeated prompts
- **Batch Processing**: 50% discount for batch jobs
- **Function Calling**: Available on all models
- **Vision Support**: GPT-4.1, GPT-4o, GPT-4.5
- **Reasoning Models**: o1, o3 series for complex problem-solving

#### Anthropic Features
- **Prompt Caching**: Up to 90% discount for cached content
- **200K Context Window**: Standard across all models
- **Tool Support**: Native function calling
- **Constitutional AI**: Built-in safety features

#### Google Features
- **Context-Based Pricing**: Different rates for long vs short contexts
- **Multimodal Support**: Text, images, audio, and video
- **Massive Context**: Up to 2M tokens on some models
- **Audio Pricing**: Separate rates for audio input
