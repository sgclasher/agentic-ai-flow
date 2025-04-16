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

## Architecture Overview

The application is built using Next.js with React Flow for the visualization. It follows a modular component structure with:

- **Component-based UI**: Each node type has its own React component
- **Data Transformation Layer**: Utilities to convert ServiceNow data to React Flow format
- **Automatic Layout Engine**: Uses Dagre for intelligent node positioning
- **State Management**: Uses Zustand for application state

## File Structure

```
agentic-ai-flow/
├── app/                   # Next.js app directory
│   ├── components/        # React components
│   │   ├── FileUploader.js        # File upload component
│   │   ├── FlowVisualizer.js      # Main visualization component
│   │   ├── nodes/                 # Custom node components
│   │   │   ├── AgentNode.js       # Agent node component
│   │   │   ├── ToolNode.js        # Tool node component
│   │   │   ├── TriggerNode.js     # Trigger node component
│   │   │   └── UseCaseNode.js     # Use Case node component
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

### Node Components
Custom React Flow node components for different entity types, each sharing:
- A common structure with header and content sections
- Collapse/expand functionality via a toggle button
- Dynamic handle positioning based on layout direction
- Customized styling for each node type

Specific node components:
- **UseCaseNode.js**: Represents use cases with sequence information
- **TriggerNode.js**: Represents triggers with objective information
- **AgentNode.js**: Represents agents with role and description fields
- **ToolNode.js**: Represents tools with capability details

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

## Component Interaction Flow

1. **Data Entry**: User uploads JSON via `FileUploader` or loads sample data
2. **Data Processing**:
   - `transformAgenticData.js` converts the JSON to React Flow format
   - Node hierarchies and relationships are established
   - Default collapse states are applied
3. **Visualization**:
   - `FlowVisualizer` renders the initial graph
   - `layoutGraph.js` positions the nodes
   - React Flow renders the interactive diagram
4. **User Interaction**:
   - Node collapse/expand triggers child visibility updates
   - Layout changes trigger repositioning of all nodes
   - Node selection shows additional information

## Node Collapse Behavior

Nodes implement a custom collapsibility system:
- Each node has an `isCollapsed` state property
- When collapsed, child nodes are hidden but the node itself remains visible
- Toggle buttons (`+`/`−`) control this state
- Parent nodes track child counts and show indicators
- The `FlowVisualizer` component maintains a mapping of which nodes should be visible

## CSS Architecture

The styling system uses:
- Global CSS with class-based styling
- Distinct visual styling for each node type
- Responsive sizing for node contents
- Vertical stacking layout for header contents (node type and title)
- Collapsible content areas

Key style features:
- Header/content separation within nodes
- Dynamic margins and padding
- Consistent UI elements across node types
- Responsive text sizing

## Data Format Requirements

The application expects ServiceNow agentic AI data in JSON format with:
- A hierarchical structure of use cases, triggers, agents, and tools
- Name and description fields for nodes
- Objective information for triggers
- Role information for agents

For operational sequencing, use cases should be named with a prefix number (e.g., "1. First Use Case").

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
3. Upload a ServiceNow agentic AI data file using the file uploader
4. Interact with the diagram:
   - Click on nodes to view details
   - Use the +/- buttons to expand/collapse nodes
   - Use the layout buttons to switch between horizontal and vertical layouts
   - Use the Expand All/Collapse All buttons to show or hide all nodes

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
