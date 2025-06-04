# Agentic AI Flow Visualizer & Business AI Advisory Platform

**🤖 AI Assistant Context:** This is a comprehensive business AI advisory platform built with Next.js, featuring ServiceNow agentic AI flow visualization, interactive AI transformation timelines, and client profile management with Value Selling Framework. The platform serves as a sophisticated business intelligence tool combining technical visualization capabilities with comprehensive data collection and strategic planning tools. Core technologies: Next.js 15, React 19, ReactFlow, Zustand, Dagre. Design inspired by ai-2027.com with modern dark themes and floating UI elements.

**🎯 Current State:** Fully functional three-feature platform with ServiceNow visualization, AI transformation timeline, and comprehensive client profile management system. Recent major additions include ProfileWizard with 8-step Value Selling Framework, structured markdown profile storage, realistic demo data system, and automatic timeline generation from client profiles. Architecture includes robust service layers (ProfileService, MarkdownService, DemoDataService) and comprehensive business intelligence capture. Ready for production deployment and enterprise use.

**🚀 Next Steps:** Authentication system with Supabase integration, cloud database migration, AI-powered timeline generation using ChatGPT 4o, PDF export capabilities, and multi-platform connectors. Focus on creating a scalable, secure platform for enterprise business intelligence and AI transformation planning.

## Project Overview

A Next.js application that serves three primary functions:

1. **ServiceNow Agentic AI Visualizer**: Transform ServiceNow agentic AI data into interactive flow diagrams
2. **AI Transformation Timeline**: Business advisory tool that generates personalized AI adoption roadmaps  
3. **Client Profile Management**: Comprehensive business intelligence system using Value Selling Framework to create client "digital twins"

The platform positions itself as a sophisticated enterprise tool for AI transformation planning, providing immediate value through visualization and analysis while capturing comprehensive business intelligence for strategic decision-making.

## Core Features

### 🔄 **ServiceNow Flow Visualization**
- **Interactive Node Graph**: Drag, zoom, and pan through complex AI workflows
- **Hierarchical Exploration**: Expand/collapse nodes to explore use cases → agents → tools
- **Dynamic Layouts**: Toggle between horizontal (LR) and vertical (TB) orientations
- **Real-time Collaboration**: Multiple layout options and live data refresh
- **Secure Integration**: Direct connection to ServiceNow instances with credential management

### 📈 **AI Transformation Timeline**
- **Business Profile Collection**: Multi-step form capturing company details, AI maturity, goals
- **Interactive Timeline**: Scroll-based journey through 6 transformation phases
- **Floating Metrics Widget**: Real-time KPIs that update based on scroll position (ai-2027.com inspired)
- **Dynamic Content Generation**: Personalized roadmaps based on industry and company size
- **ROI Projections**: Detailed investment and return calculations
- **Mobile-Responsive Design**: Optimized for all device types

### 👥 **Client Profile Management**
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

### **Quick Testing**
```bash
# Run quick smoke tests (3 seconds)
npm run test:smoke

# Run all tests
npm test
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

#### **Option 3: Client Profile Management**
1. Click "Client Profiles" button or go to `/profiles`
2. Create new profile or load demo data (4 industry scenarios available)
3. Complete 8-step Value Selling Framework assessment
4. Generate automatic AI timeline from profile data
5. View comprehensive business intelligence and opportunity analysis

## Business Value & Enterprise Use Cases

### **Current Positioning**
- **Enterprise Business Intelligence Tool**: Comprehensive platform for AI transformation planning
- **Digital Twin Creation**: Structured markdown profiles create comprehensive business understanding
- **Strategic Planning**: Natural progression from assessment to implementation roadmap
- **Market Positioning**: Bridges technical capability with sophisticated business strategy

### **Enterprise Integration Ready**
- **Authentication**: Supabase Auth integration planned for secure multi-user access
- **Database**: Migration from localStorage to Supabase for enterprise-grade persistence
- **AI Integration**: ChatGPT 4o integration for intelligent timeline generation
- **Export Capabilities**: PDF generation for executive reporting

## Technical Stack

### **Frontend**
- Next.js 15 with App Router
- React 19 with functional components
- ReactFlow for interactive diagrams
- Zustand for state management
- Lucide React for icons

### **Visualization**
- Dagre.js for automatic graph layout
- Custom node types with expand/collapse
- Responsive design with mobile support

### **Data Management**
- Structured markdown for profile storage
- localStorage (migrating to Supabase)
- Demo data service with 4 industry profiles

### **Development**
- TypeScript-ready architecture
- Jest testing framework
- ESLint for code quality
- GitHub Actions for CI/CD

## Testing

The project uses a pragmatic MVP testing approach:

```bash
npm run test:smoke    # Quick 3-second verification
npm test             # Full test suite
npm run test:watch   # Development mode
```

See `MVP_TESTING_SUMMARY.md` for complete testing strategy.

## Contributing

1. Run `npm run test:smoke` before committing
2. Follow existing code patterns
3. Update documentation for new features
4. Test manually using the checklist in `app/__tests__/features/manual-test-checklist.md`

## Development Guidelines

- Functional components with hooks
- 200-line component limit
- Comprehensive error handling
- Clear separation of concerns between visualization, advisory, and profile features

---

**📞 Ready for Enterprise Deployment**: The platform successfully combines technical demonstration, strategic planning tools, and comprehensive business intelligence collection, providing a sophisticated foundation for enterprise AI transformation planning. With the addition of the Value Selling Framework-based profile system, the platform now captures the depth of business intelligence needed for strategic decision-making while providing immediate value through automated timeline generation and opportunity analysis.

**🧪 Testing Status**: Simple MVP testing approach with 9 passing smoke tests. See `MVP_TESTING_SUMMARY.md` for details.
