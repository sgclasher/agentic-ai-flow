Directory structure:
└── sgclasher-agentic-ai-flow/
    ├── README.md
    ├── CLIENT_PROFILE_SYSTEM.md
    ├── jest.config.js
    ├── jest.setup.js
    ├── next.config.js
    ├── package.json
    ├── project-summary.md
    ├── test-parse-overview.js
    ├── test-regex.js
    ├── TESTING_GUIDE.md
    ├── TESTING_WORKFLOW.md
    ├── .cursorignore
    ├── .cursorrules
    ├── app/
    │   ├── globals.css
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
    │   │   ├── profile-detail.css
    │   │   ├── [id]/
    │   │   │   ├── page.js
    │   │   │   └── __tests__/
    │   │   │       └── page.test.js
    │   │   └── components/
    │   │       ├── ProfileWizard.js
    │   │       └── __tests__/
    │   │           └── ProfileWizard.test.js
    │   ├── services/
    │   │   ├── demoDataService.js
    │   │   ├── markdownService.js
    │   │   ├── profileService.js
    │   │   ├── timelineService.js
    │   │   └── __tests__/
    │   │       ├── markdownService.test.js
    │   │       └── profileService.test.js
    │   ├── store/
    │   │   ├── useAgenticStore.js
    │   │   └── useBusinessProfileStore.js
    │   ├── timeline/
    │   │   ├── README.md
    │   │   ├── layout.js
    │   │   ├── page.js
    │   │   ├── timeline.css
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
        └── images/


## `app/` Directory Contents:

This directory is the core of your Next.js application, following the App Router structure.

### Root Files in `app/`

  * **`layout.js`**:
      * **Purpose**: This is the **root layout** for the entire application. It defines the main HTML structure (\<html\>, \<body\> tags) that wraps all pages.
      * **Details**: It imports global CSS (`./globals.css`) and sets up the `Inter` font for consistent typography across the application. It also defines global metadata like the site title and description.
  * **`page.js`**:
      * **Purpose**: This is the **main landing page** of the application, specifically for the **ServiceNow Agentic AI Flow Visualizer** feature.
      * **Details**: It's a client component (`'use client'`) that manages the initial state for displaying the flow visualizer or the `ServiceNowConnector` if data isn't loaded. It uses the `useAgenticStore` for state related to ServiceNow data, handles data fetching/refreshing, error display, and provides top-level controls for the flow (expand/collapse all, reset).

### `app/api/` (API Routes)

This directory contains backend API endpoints that the frontend application consumes.

  * **`app/api/servicenow/route.js`**:
      * **Purpose**: A general-purpose **proxy API route** for making requests to a ServiceNow instance.
      * **Details**: It's designed to handle various requests to the ServiceNow Table API by taking parameters like instance URL, credentials (intended for server-to-server use, not client-side exposure), table name, fields, scope, and query. This helps avoid CORS issues.
  * **`app/api/servicenow/fetch-agentic-data/route.js`**:
      * **Purpose**: A **specialized API route** to fetch all the necessary data for the **ServiceNow agentic AI flow visualization** in a single, consolidated request.
      * **Details**: It securely uses server-side credentials (from environment variables) to connect to a specific scripted REST API endpoint (`/api/x_nowge_rfx_ai/ai_relationship_explorer/relationships`) on the ServiceNow instance. It includes input validation for `instanceUrl` and `scopeId`, and basic rate limiting.
  * **`app/api/servicenow/get-credentials/route.js`**:
      * **Purpose**: An API endpoint to provide **non-sensitive connection details** to the frontend.
      * **Details**: It returns the `instanceUrl` and `scopeId` (likely from environment variables) to the client, importantly *excluding* actual authentication credentials like username and password, which are handled server-side.
  * **`app/api/timeline/generate/route.js`**:
      * **Purpose**: The backend API endpoint responsible for **generating the AI Transformation Timeline**.
      * **Details**: It receives a `businessProfile` (client data) and `scenarioType` (e.g., conservative, balanced, aggressive) from the client, validates them using functions from `app/utils/validation.js`, and then calls the `TimelineService` to generate the actual timeline data. It also implements basic rate limiting.

### `app/components/` (UI Components)

This directory houses reusable React components that make up the user interface.

  * **`app/components/FlowVisualizer.js`**:
      * **Purpose**: The main React component for **rendering and managing the interactive AI flow diagrams**.
      * **Details**: It uses `reactflow` library and custom hooks (`useFlowLayout`, `useFlowData`) to display nodes and edges based on the `agenticData`. It handles node selection, and exposes methods like `expandAllNodes` and `collapseAllNodes` to its parent.
  * **`app/components/NodeIcons.js`**:
      * **Purpose**: Provides **reusable icon components** (`ExternalLinkIcon`) and the `NodeHeaderButtons` component.
      * **Details**: `NodeHeaderButtons` is used within custom flow nodes to provide standard buttons for actions like toggling node expansion and opening the corresponding item in ServiceNow.
  * **`app/components/ServiceNowConnector.js`**:
      * **Purpose**: The UI component that allows users to **input connection details for a ServiceNow instance** and initiate data fetching.
      * **Details**: It fetches initial non-sensitive details (like instance URL and scope ID) from `/api/servicenow/get-credentials`, takes user input, and then calls the `/api/servicenow/fetch-agentic-data` endpoint. It manages loading and error states during this process.
  * **`app/components/flow/FlowCanvas.js`**:
      * **Purpose**: Encapsulates the core `ReactFlow` component setup.
      * **Details**: It defines the `ReactFlow` instance, including its `MiniMap`, `Controls`, `Background`, and the `Panel` for displaying selected node details. It takes nodes and edges as props and configures the custom node types (`UseCaseNode`, `TriggerNode`, etc.).
  * **`app/components/nodes/AgentNode.js`**:
      * **Purpose**: Defines the visual representation and behavior of an **"Agent" node** in the flow diagram.
      * **Details**: It displays agent-specific information (label, description, role), handles connection points (sources/targets), and includes `NodeHeaderButtons` for expansion and linking to the agent's record in ServiceNow.
  * **`app/components/nodes/ToolNode.js`**:
      * **Purpose**: Defines the visual representation and behavior of a **"Tool" node** in the flow diagram.
      * **Details**: Similar to `AgentNode`, it displays tool-specific data (label, description, tool type), handles connection points, and uses `NodeHeaderButtons`.
  * **`app/components/nodes/TriggerNode.js`**:
      * **Purpose**: Defines the visual representation and behavior of a **"Trigger" node** in the flow diagram.
      * **Details**: Displays trigger information (label, description, condition), handles connection points, and includes `NodeHeaderButtons`.
  * **`app/components/nodes/UseCaseNode.js`**:
      * **Purpose**: Defines the visual representation and behavior of a **"Use Case" node** in the flow diagram (typically the top-level nodes).
      * **Details**: Displays use case details (label, description), handles connection points, and uses `NodeHeaderButtons` for expansion and linking to the use case in ServiceNow.

### `app/hooks/` (Custom React Hooks)

This directory contains custom hooks for encapsulating reusable stateful logic.

  * **`app/hooks/useFlowData.js`**:
      * **Purpose**: Manages the **transformation and initialization of data for the flow diagram**.
      * **Details**: It takes raw `agenticData`, processes it using `transformAgenticData` (from `app/utils/`), applies an initial layout using `applyDagreLayout`, sets initial node visibility (e.g., collapsing children), and updates the nodes and edges state for `ReactFlow`.
  * **`app/hooks/useFlowLayout.js`**:
      * **Purpose**: Manages the **dynamic layout and interaction logic for the flow diagram**.
      * **Details**: It handles changes in layout direction (Left-to-Right or Top-to-Bottom), node expansion/collapse logic (updating visibility of child nodes and edges), re-applying the Dagre layout when the graph structure changes, and fitting the view.

### `app/profiles/` (Client Profiles Feature)

This section contains the pages and components for the Client Profile Management feature.

  * **`app/profiles/page.js`**:
      * **Purpose**: The main page for the **Client Profiles feature**, listing existing profiles and allowing creation of new ones.
      * **Details**: It fetches and displays a list of client profiles (using `ProfileService`), provides a button to launch the `ProfileWizard` for creating new profiles, and allows loading of demo data (using `demoDataService`). It renders `ProfileCard` components for each profile.
  * **`app/profiles/[id]/page.js`**:
      * **Purpose**: A dynamic route page that displays the **detailed view of a specific client profile**.
      * **Details**: It fetches the profile data based on the `id` parameter using `ProfileService`. It features tabbed navigation (`ProfileOverviewTab`, `ProfileAnalysisTab`, `ProfileOpportunitiesTab`, `ProfileMarkdownTab`) to display different aspects of the client profile.
  * **`app/profiles/components/ProfileWizard.js`**:
      * **Purpose**: A **multi-step form component** that guides the user through creating a comprehensive client profile based on the Value Selling Framework.
      * **Details**: It manages the state for each of the 8 steps (Company Overview, Business Issue, Problems, Impact, Solution, Decision, AI Assessment, Summary). It uses `ProfileService` to save the completed profile and `markdownService` for previewing the structured markdown output. It also allows loading demo data via `demoDataService`.

### `app/services/` (Business Logic Services)

Modules containing core business logic, separate from UI concerns.

  * **`app/services/demoDataService.js`**:
      * **Purpose**: Provides **realistic sample client profiles** for demonstration and testing purposes.
      * **Details**: It contains hardcoded data for various industry profiles (Tech Startup, Manufacturing, Healthcare, Finance) structured according to the client profile schema. This allows users to quickly populate the system with examples.
  * **`app/services/markdownService.js`**:
      * **Purpose**: Handles the **conversion between structured JavaScript objects (client profile data) and a standardized Markdown format**.
      * **Details**: This service is crucial for the "anti-hallucination" design, ensuring data is stored and processed in a consistent, parseable way. It has `generateMarkdown` to create Markdown from profile data and `parseMarkdown` (though its parsing implementation is partial in the snippet) to convert Markdown back to an object.
  * **`app/services/profileService.js`**:
      * **Purpose**: Manages the **business logic related to client profiles**.
      * **Details**: It handles CRUD-like operations for profiles (currently using `localStorage` for client-side persistence), integrates with `markdownService`, and orchestrates the generation of AI timelines by calling `timelineService` with data extracted from a client profile.
  * **`app/services/timelineService.js`**:
      * **Purpose**: Contains the logic for **generating the AI Transformation Timeline**.
      * **Details**: It takes a `businessProfile` (extracted from a client profile) and a `scenarioType` (e.g., conservative, aggressive) to produce a structured timeline. The timeline includes a current state analysis, multiple transformation phases with initiatives, technologies, and outcomes, and a future state vision. Currently, it uses a rule-based approach for generation.

### `app/store/` (Global State Management)

This directory holds Zustand stores for managing global application state.

  * **`app/store/useAgenticStore.js`**:
      * **Purpose**: A Zustand store to manage state related to the **ServiceNow Agentic AI Flow visualization**.
      * **Details**: It stores the fetched `agenticData`, connection details (`instanceUrl`, `serviceNowUrl`, `scopeId`), loading status, and any errors related to data fetching or processing for the flow diagram. It provides actions to set, clear, and refresh this data.
  * **`app/store/useBusinessProfileStore.js`**:
      * **Purpose**: (As described in `README.md`, though not fully present in the file snippets) A Zustand store intended to manage state for **client business profiles and the AI Transformation Timeline data**.
      * **Details**: This would likely hold data related to the multi-step business profile form for the timeline, the generated timeline itself, and any user selections or scenario planning data for the timeline feature.

### `app/timeline/` (AI Transformation Timeline Feature)

This section contains the pages and components specific to the AI Transformation Timeline feature.

  * **`app/timeline/README.md`**:
      * **Purpose**: Provides specific documentation for the **AI Transformation Timeline feature**. (Its content is not in the provided snippets but its existence is noted).
  * **`app/timeline/layout.js`**:
      * **Purpose**: A **layout component specifically for the timeline pages**.
      * **Details**: It likely sets up a structure common to all timeline views, potentially including a consistent header, sidebar, or footer for this section of the application.
  * **`app/timeline/page.js`**:
      * **Purpose**: The **main page for the AI Transformation Timeline feature**.
      * **Details**: This page would orchestrate the display of the timeline, manage the business profile input (perhaps via `BusinessProfileModal.js`), call the API to generate the timeline, and render the various timeline components (`TimelineSidebar.js`, `TimelineContent.js`, `MetricsWidget.js`).
  * **`app/timeline/components/BusinessProfileForm.js`**:
      * **Purpose**: A form component used to **collect detailed business profile information** from the user, which is then used to generate a personalized AI Transformation Timeline.
      * **Details**: It likely contains various input fields for company details, AI maturity, goals, etc.
  * **`app/timeline/components/BusinessProfileModal.js`**:
      * **Purpose**: A modal component that likely houses the `BusinessProfileForm.js` to **collect user input before generating the timeline**.
      * **Details**: It handles the presentation of the form in a modal dialog, making it easy to gate the timeline generation until the necessary information is provided.
  * **`app/timeline/components/MetricsCards.js`**:
      * **Purpose**: Displays key **metrics or Key Performance Indicators (KPIs)** relevant to the AI transformation journey, likely in a card format.
      * **Details**: These cards could show data like projected ROI, efficiency gains, or cost savings at different stages of the timeline.
  * **`app/timeline/components/MetricsWidget.js`**:
      * **Purpose**: The **floating widget** (inspired by ai-2027.com) that displays real-time KPIs that update as the user scrolls through the timeline.
      * **Details**: This is a key UI element for the timeline, providing dynamic feedback. It's styled with a dark theme and backdrop blur.
  * **`app/timeline/components/ScenarioSelector.js`**:
      * **Purpose**: Allows the user to **select different scenarios** (e.g., conservative, balanced, aggressive) for the AI transformation timeline.
      * **Details**: This component would modify the parameters sent to the `TimelineService` to generate different versions of the roadmap.
  * **`app/timeline/components/TimelineContent.js`**:
      * **Purpose**: The main component responsible for **rendering the scrollable content of the AI Transformation Timeline**.
      * **Details**: It would display the different phases, initiatives, and details of the generated roadmap.
  * **`app/timeline/components/TimelineHeader.js`**:
      * **Purpose**: Displays the **header section for the AI Transformation Timeline page**.
      * **Details**: This might include the timeline title, introductory text, or primary action buttons related to the timeline.
  * **`app/timeline/components/TimelineSidebar.js`**:
      * **Purpose**: Provides **navigation for the different phases** of the AI Transformation Timeline.
      * **Details**: It likely uses a scroll-spy mechanism to highlight the current phase as the user scrolls through the `TimelineContent`.
  * **`app/timeline/components/TimelineVisualization.js`**:
      * **Purpose**: Could be a component responsible for any **visual aspects of the timeline itself**, perhaps charts or graphical representations of progress or phases.
      * **Details**: The exact nature depends on the design, but it would complement the textual information in `TimelineContent`.

### `app/utils/` (Utility Functions)

This directory contains helper functions used in various parts of the application.

  * **`app/utils/layoutGraph.js`**:
      * **Purpose**: Provides the `applyDagreLayout` function for **automatic graph layout**.
      * **Details**: It uses the Dagre.js library to calculate node positions for the flow diagram, supporting different layout directions (e.g., top-to-bottom, left-to-right) and spacing parameters.
  * **`app/utils/nodeUtils.js`**:
      * **Purpose**: Contains utility functions related to **nodes in the flow diagram**.
      * **Details**: Based on imports in other files, this includes `generateServiceNowUrl` for creating direct links to records in ServiceNow and likely other helper functions for node manipulation or data extraction. The `ExternalLinkIcon` component is also often associated with this or similar utility files.
  * **`app/utils/transformAgenticData.js`**:
      * **Purpose**: A crucial utility for the ServiceNow visualizer, responsible for **transforming the raw JSON data fetched from ServiceNow into the specific node and edge objects** that the `ReactFlow` library expects.
      * **Details**: It maps the ServiceNow data structure to the visual elements, defining their types (UseCase, Trigger, Agent, Tool), labels, connections, and associated metadata.
  * **`app/utils/validation.js`**:
      * **Purpose**: Contains functions for **input validation and basic security measures**.
      * **Details**: This includes functions to validate ServiceNow instance URLs (`validateInstanceUrl`), scope IDs (`validateScopeId`), business profile data for the timeline (`validateBusinessProfile`), timeline scenario types (`validateScenarioType`), and a basic rate-limiting mechanism (`checkRateLimit`).
