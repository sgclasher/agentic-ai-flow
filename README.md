# Agentic AI Flow Visualizer

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
- **File Upload**: Upload ServiceNow agentic AI data files to visualize
- **Detailed Information**: View detailed node information by clicking on nodes
- **Expand/Collapse All**: Options to expand or collapse all nodes at once
- **Customizable Layouts**: Arrange nodes automatically based on hierarchy
- **Sequence Numbering**: Displays use cases in operational order
- **Secure ServiceNow Integration**: Connect directly to ServiceNow instances using secure credentials

## Architecture Overview

The application is built using Next.js with React Flow for the visualization. It follows a modular component structure with:

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
│   │   ├── FileUploader.js        # File upload component
│   │   ├── FlowVisualizer.js      # Main visualization component
│   │   ├── NodeIcons.js           # Icon components for nodes
│   │   ├── ServiceNowConnector.js # ServiceNow integration component
│   │   ├── ReactFlowProvider.js   # React Flow context provider
│   │   ├── nodes/                 # Custom node components
│   │   │   ├── AgentNode.js       # Agent node component
│   │   │   ├── ToolNode.js        # Tool node component
│   │   │   ├── TriggerNode.js     # Trigger node component
│   │   │   └── UseCaseNode.js     # Use Case node component
│   ├── api/                # Next.js API routes
│   │   ├── servicenow/               # ServiceNow API endpoints
│   │   │   └── fetch-agentic-data/   # API route for fetching data
│   │   ├── sample-data/              # Sample data endpoints
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
- `/api/sample-data`: Provides sample data for testing without ServiceNow

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
2. **Retrieval**: The data is accessed through:
   - Direct ServiceNow API integration using the ServiceNowConnector
   - File upload using the FileUploader component
   - Sample data loaded from the API routes
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
   - Or upload a ServiceNow agentic AI data file
4. Interact with the diagram:
   - Click on nodes to view details
   - Use the +/- buttons to expand/collapse nodes
   - Use the layout buttons to switch between horizontal and vertical layouts
   - Use the Expand All/Collapse All buttons to show or hide all nodes

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
