# Agentic AI Flow Visualizer

A Next.js application for visualizing ServiceNow agentic AI data as interactive flow diagrams. This tool transforms structured data from ServiceNow's agentic AI platform into an interactive, collapsible node graph that helps users understand the relationships between use cases, triggers, agents, and tools.

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

## Key Components

### FlowVisualizer.js
The main component responsible for rendering the flow diagram. It manages node and edge states, handles layout changes, and provides controls for manipulating the visualization.

### Node Components
Custom React Flow node components for different entity types:
- **UseCaseNode**: Represents a use case in the agentic system
- **TriggerNode**: Represents a trigger in the agentic system
- **AgentNode**: Represents an agent in the agentic system
- **ToolNode**: Represents a tool in the agentic system

Each node type has specific styling and can be collapsed/expanded to show/hide child nodes.

### transformAgenticData.js
Utility that transforms raw ServiceNow agentic AI data into the nodes and edges required by React Flow. It parses the hierarchy of use cases, triggers, agents, and tools to create a properly structured graph.

### layoutGraph.js
Provides the `applyDagreLayout` function which organizes nodes using the Dagre library, supporting both left-to-right and top-to-bottom layouts.

## Data Flow

1. **Data Upload**: User uploads a JSON file containing ServiceNow agentic AI data
2. **Data Transformation**: The data is transformed into React Flow nodes and edges
3. **Initial Layout**: The nodes are arranged using Dagre layout algorithm
4. **Interaction**: User can interact with the diagram - expanding/collapsing nodes, changing layout, etc.
5. **State Updates**: Node visibility changes trigger layout recalculations

## Node Collapse Behavior

Nodes have two aspects of collapsibility:
- **Child Node Visibility**: When a node is collapsed, its child nodes are hidden from the view, but the node content itself remains visible
- **Visual Indication**: A collapsed node shows a message indicating that children are hidden

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

## Browser Compatibility

The application works best in modern browsers (Chrome, Firefox, Safari, Edge).
