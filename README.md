# Agentic AI Flow Visualizer

**🤖 AI Assistant Context:** This is an Agentic AI Flow Visualizer built with Next.js that connects to ServiceNow to visualize AI workflows. The project is expanding into a comprehensive business AI advisory platform with digital twin capabilities. Key focus areas: React Flow visualizations, ServiceNow integration, business process automation, and AI-powered insights. Current tech stack: Next.js 15, React 19, ReactFlow, Zustand, Dagre. Follow React/JavaScript best practices, prioritize modular components, and maintain security-first approach for ServiceNow connections.

**🎯 Vision:** Evolving from a ServiceNow visualization tool into a free lead-generation platform for AI advisory services, featuring business digital twins, agentic workflow recommendations, and multi-platform blueprints (ServiceNow, Salesforce, etc.).

A Next.js application for visualizing ServiceNow agentic AI data as interactive flow diagrams. This tool transforms structured JSON data from ServiceNow's agentic AI platform into an interactive, collapsible node graph that helps users understand the relationships between use cases, triggers, agents, and tools.

## Purpose

The Agentic AI Flow Visualizer was designed to provide a clear visual representation of complex agentic AI systems, making it easier to:

- Understand the hierarchical structure of agentic AI components
- Visualize relationships between different elements in the system
- Explore complex architectures through interactive node expansion/collapse
- Present architecture diagrams in both horizontal and vertical layouts

## Features

- **Interactive Visualization**: Drag, zoom, and pan to explore the flow diagram
- **Collapsible Nodes**: Expand/collapse nodes to show or hide child elements
- **Layout Options**: Toggle between horizontal (LR) and vertical (TB) layouts
- **Node Types**: Distinct styling for different node types (Use Cases, Triggers, Agents, Tools)
- **ServiceNow Integration**: Connect directly to ServiceNow instances using secure credentials
- **Detailed Information**: View detailed node information by clicking on nodes
- **Expand/Collapse All**: Options to expand or collapse all nodes at once
- **Customizable Layouts**: Arrange nodes automatically based on hierarchy
- **Sequence Numbering**: Displays use cases in operational order
- **Interactive Flow Visualization**: 
  - Drag and drop nodes for custom layouts
  - Zoom and pan controls
  - Responsive design
- **Architecture Modes**:
  - Toggle between horizontal and vertical flow orientations
  - Real-time layout switching
- **Node Types**:
  - Triggers (API, Schedule, User Events)
  - Agents (with customizable AI capabilities)
  - Tools (various integrations)
  - Use Cases (business outcomes)
- **Dynamic Styling**: Visual feedback for connections and node interactions
- **Export Capabilities**: Download workflows as images
- **AI Transformation Timeline**: Interactive business AI advisory tool
  - Three-column layout inspired by ai-2027.com
  - Dynamic metrics that update based on scroll position
  - Personalized AI adoption roadmap
  - ROI projections and phase-based planning
  - Mobile-responsive design

## AI Timeline Feature

The AI Timeline is a comprehensive business planning tool that helps organizations visualize their AI transformation journey. Access it via the "AI Timeline" button in the header or directly at `/timeline`.

### Key Components:
- **Business Profile Form**: Multi-step wizard to capture company information
- **Interactive Timeline**: Scroll-based navigation from current state to future vision
- **Dynamic Metrics Widget**: Real-time KPIs that change as you progress through phases
- **Phase-based Planning**: Foundation → Implementation → Expansion → Optimization → Future State

### Timeline Sections:
1. **Current State Analysis**: Baseline assessment of AI readiness
2. **Foundation Phase (Q1-Q2)**: Building core capabilities and infrastructure
3. **Implementation Phase (Q3-Q4)**: Deploying initial AI solutions
4. **Expansion Phase (Year 2)**: Scaling across the enterprise
5. **Optimization Phase (Year 3)**: Refining and maximizing value
- **Component-based UI**: Each node type has its own React component
- **Data Transformation Layer**: Utilities to convert ServiceNow data to React Flow format
- **Automatic Layout Engine**: Uses Dagre for intelligent node positioning
- **State Management**: Uses Zustand for application state
- **Secure API Layer**: Next.js API routes provide secure proxying to ServiceNow

## ServiceNow Integration

The application connects securely to ServiceNow to retrieve agentic AI data:

1. **Authentication Flow**:
   - The application uses a dedicated service account with limited permissions
   - Credentials are securely passed through the Next.js API route
   - Basic authentication is used with proper encoding

2. **Data Access Layer**:
   - A scripted REST API on the ServiceNow side encapsulates data access logic
   - The API endpoint (`/api/x_nowge_rfx_ai/ai_relationship_explorer/relationships`) returns pre-formatted data
   - This approach follows the principle of least privilege - no admin access required

3. **Data Transformation**:
   - The Next.js API route normalizes the data structure to match visualization requirements
   - The FlowVisualizer component transforms the data into React Flow nodes and edges
   - The Dagre layout algorithm intelligently positions nodes based on relationships

## File Structure

```
agentic-ai-flow/
├── app/                   # Next.js app directory
│   ├── components/        # React components
│   │   ├── FlowVisualizer.js      # Main visualization component
│   │   ├── NodeIcons.js           # Icon components for nodes
│   │   ├── ServiceNowConnector.js # ServiceNow integration component
│   │   └── nodes/                 # Custom node components
│   │       ├── AgentNode.js       # Agent node component
│   │       ├── ToolNode.js        # Tool node component
│   │       ├── TriggerNode.js     # Trigger node component
│   │       └── UseCaseNode.js     # Use Case node component
│   ├── api/                # Next.js API routes
│   │   └── servicenow/               # ServiceNow API endpoints
│   │       ├── fetch-agentic-data/   # API route for fetching data
│   │       └── get-credentials/      # API route for credential management
│   ├── globals.css        # Global styles
│   ├── layout.js          # Root layout component
│   ├── page.js            # Main page component
│   ├── store/             # State management
│   │   └── useAgenticStore.js    # Zustand store for agentic data
│   └── utils/             # Utility functions
│       ├── layoutGraph.js        # Graph layout utilities
│       └── transformAgenticData.js # Data transformation utilities
├── public/               # Static assets
├── next.config.js        # Next.js configuration
└── package.json          # Project dependencies
```

## Core Components Explained

### FlowVisualizer.js
The main component responsible for rendering the flow diagram. It handles:
- Initialization of React Flow with custom node and edge types
- State management for nodes and edges
- Layout direction toggling (horizontal/vertical)
- Node expansion/collapse functionality
- Updating node visibility based on collapse state
- Applying the Dagre layout to visible nodes
- UI controls for layout manipulation

Key functions:
- `toggleNodeExpansion`: Toggles the expansion state of a node
- `updateChildNodesVisibility`: Updates visibility of child nodes
- `applyLayout`: Re-applies the layout algorithm after node visibility changes

### ServiceNowConnector.js
Handles the connection to ServiceNow instances:
- Provides a form UI for connection credentials
- Makes POST requests to the Next.js API route
- Securely passes credentials for authentication
- Stores connection details in the app state
- Displays connection status and errors
- Initiates data fetching process

### API Routes
The application uses Next.js API routes to securely proxy requests to ServiceNow:
- `/api/servicenow/fetch-agentic-data`: Handles authentication and data retrieval
- `/api/servicenow/get-credentials`: Manages credential validation

The API route layer:
- Keeps credentials secure (server-side only)
- Normalizes data structure for the frontend
- Handles error states and status codes
- Follows security best practices

### transformAgenticData.js
The core data transformation utility that:
- Parses ServiceNow agentic AI JSON data
- Creates React Flow nodes with appropriate data and styling
- Establishes parent-child relationships as edges
- Adds interactive properties like collapse/expand functionality
- Sorts use cases by name (which can include sequence numbers)
- Maps data fields to appropriate node properties

### layoutGraph.js
Provides intelligent node positioning using Dagre:
- `applyDagreLayout`: Organizes nodes in either horizontal or vertical layouts
- Sets node dimensions and spacing
- Processes only visible nodes
- Returns positioned nodes and edges ready for React Flow rendering

## Data Flow

1. **Data Source**: Data originates from ServiceNow's agentic AI platform
2. **Retrieval**: The data is accessed through direct ServiceNow API integration using the ServiceNowConnector
3. **Processing**:
   - Raw data is normalized by the API route if necessary
   - `transformAgenticData.js` converts normalized data to React Flow format
   - Node hierarchies and relationships are established
   - Default collapse states are applied
4. **Visualization**:
   - FlowVisualizer initializes React Flow with the processed data
   - `layoutGraph.js` positions the nodes based on relationships
   - React Flow renders the interactive diagram
5. **User Interaction**:
   - User can expand/collapse nodes to explore the hierarchy
   - Clicking nodes reveals detailed information
   - Layout can be toggled between horizontal and vertical

## Security Considerations

The application implements several security best practices:
- Uses a dedicated service account with limited permissions
- Credentials are never exposed to the client
- API route proxies requests to ServiceNow, keeping authentication server-side
- Basic authentication headers are properly encoded
- ServiceNow's script include pattern encapsulates data access logic
- Follows principle of least privilege

## AI Assistant Development Guide

### **Development Philosophy**
- **Modular First**: Break large components into focused, single-responsibility pieces
- **Security by Design**: Always validate inputs, secure API calls, never expose credentials
- **User Experience**: Prioritize intuitive interfaces and progressive disclosure
- **Performance**: Minimize re-renders, optimize large data visualizations
- **Accessibility**: Ensure keyboard navigation and screen reader compatibility

### **Code Standards**
- Use functional components with hooks (no class components)
- Implement proper TypeScript types when adding TS files
- Follow consistent naming: `camelCase` for variables/functions, `PascalCase` for components
- Keep components under 200 lines; extract hooks for complex logic
- Add JSDoc comments for complex functions
- Use descriptive variable names that explain intent

### **State Management Patterns**
- **Global State**: Use Zustand for cross-component data (see `useAgenticStore.js`)
- **Local State**: Use `useState` for component-specific state
- **Server State**: Implement proper loading/error states for API calls
- **Form State**: Consider React Hook Form for complex forms

### **Component Architecture Guidelines**
- **Container/Presentation**: Separate data logic from UI rendering
- **Custom Hooks**: Extract reusable logic into custom hooks
- **Prop Drilling**: Avoid more than 2 levels; use context or state management
- **Event Handling**: Use `useCallback` for event handlers passed to children

### **Performance Optimization**
- Use `React.memo` for expensive re-renders
- Implement `useMemo` for expensive calculations
- Use `useCallback` for stable function references
- Lazy load large components with `React.lazy`
- Optimize React Flow with `nodesDraggable={false}` when appropriate

### **ServiceNow Integration Best Practices**
- Always use API routes as proxy layer (never direct client connections)
- Implement proper error handling and user feedback
- Use connection pooling for multiple API calls
- Validate ServiceNow response structure before processing
- Handle authentication failures gracefully

### **React Flow Specific Guidelines**
- Use custom node components for different data types
- Implement proper node memorization to prevent unnecessary re-renders
- Handle large datasets with virtualization if needed
- Use `fitView()` appropriately for user experience
- Implement proper edge routing for complex layouts

### **Future Feature Considerations**
- **Digital Twin Builder**: Form-based business profile creation
- **Agentic Workflow Generator**: AI-powered workflow recommendations
- **Multi-platform Support**: Salesforce, Microsoft, etc. integrations
- **ROI Calculator**: Business impact measurement tools
- **Template Library**: Pre-built workflow templates
- **Collaboration Features**: Team sharing and commenting

### **Common Pitfalls to Avoid**
- Don't mutate state directly (use spread operators or state setters)
- Avoid inline object creation in JSX (causes unnecessary re-renders)
- Don't use array indices as keys for dynamic lists
- Avoid large useEffect dependency arrays
- Don't forget to cleanup subscriptions and timers
- Avoid deeply nested conditional rendering in JSX

### **Testing Strategy**
- Unit tests for utility functions (transformAgenticData, layoutGraph)
- Integration tests for API routes
- Component tests for user interactions
- E2E tests for critical user flows (ServiceNow connection, visualization)
- Mock ServiceNow API responses for consistent testing

### **Quick Development Commands**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Check code style
npm run lint:fix     # Auto-fix linting issues
npm run clean        # Clean build artifacts
```

### **Environment Setup**
- Node.js 18+ required
- ServiceNow instance with Agentic AI framework for testing
- Use `.env.local` for local development secrets (never commit!)
- Consider Docker for consistent development environments

## Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to the project directory
cd agentic-ai-flow

# Install dependencies
npm install

# Start the development server
npm run dev
```

## Usage

1. Start the application using `npm run dev`
2. Navigate to the application in your browser (default: http://localhost:3000)
3. Connect to ServiceNow:
   - Enter instance URL, username, password, and scope ID
   - Click "Connect & Visualize"
4. Interact with the diagram:
   - Click on nodes to view details
   - Use the +/- buttons to expand/collapse nodes
   - Use the layout buttons to switch between horizontal and vertical layouts

## ServiceNow Configuration

To integrate with ServiceNow, you'll need:
1. A ServiceNow instance with the Agentic AI framework installed
2. A user account with access to the agentic AI tables
3. A scripted REST API configured to return the agentic AI relationship data
4. The sys_id of the scope containing your agentic AI configurations

The scripted REST API should:
- Accept a scope ID parameter
- Return a structured JSON response with use cases, triggers, agents and tools
- Be accessible via basic authentication

## Technologies Used

- **Next.js**: React framework for the application
- **React Flow**: Library for rendering node-based graphs
- **Dagre**: Graph layout engine for organizing nodes
- **Zustand**: State management library
- **CSS Modules**: For component styling

## React Flow Implementation Notes

- Custom node types are defined outside component bodies to prevent React warnings
- Node and edge types are passed to React Flow via the `nodeTypes` and `edgeTypes` props
- Nodes use the React Flow `Handle` component for connecting edges
- Position and layout are managed via the Dagre algorithm

## Known Considerations

- Node labels with excessive length may need adjustments for optimal display
- Complex hierarchies with many nodes may require scrolling or zooming
- For best performance, limit extremely large datasets

## Browser Compatibility

The application works best in modern browsers (Chrome, Firefox, Safari, Edge).

## Recent Improvements

### **Code Cleanup (Latest)**
The codebase has been recently cleaned up to improve maintainability and performance:

- **Removed Dead Code**: Eliminated unused FileUploader component and sample-data API
- **Eliminated Duplicates**: Removed duplicate UseCaseNode.js and unnecessary ReactFlowProvider wrapper  
- **Enhanced Security**: Improved .gitignore with comprehensive exclusions for environment files, logs, and build artifacts
- **Optimized CSS**: Removed unused styles related to removed components
- **Better Documentation**: Enhanced package.json with proper metadata, keywords, and improved scripts
- **Streamlined Architecture**: Simplified component imports and reduced unnecessary abstractions

### **Performance Optimizations**
- Removed redundant wrapper components that caused extra re-renders
- Cleaned up unused CSS rules that impacted bundle size
- Simplified import paths for better tree-shaking
- Enhanced component modularity for better maintainability
