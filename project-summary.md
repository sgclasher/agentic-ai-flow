This project is a comprehensive **business AI advisory platform** built with Next.js 15, React 19, ReactFlow, Zustand, and Dagre. It visualizes ServiceNow agentic AI flows, provides interactive AI transformation timelines, and manages client profiles using the Value Selling Framework, all backed by a **Supabase** PostgreSQL database.

## 📄 Project Overview

The platform serves three primary functions:

1.  **ServiceNow Agentic AI Visualizer**: Transforms ServiceNow agentic AI data into interactive flow diagrams.
2.  **AI Transformation Timeline**: A business advisory tool that generates personalized AI adoption roadmaps.
3.  **Client Profile Management**: A comprehensive business intelligence system using the Value Selling Framework to create client "digital twins."

The system is designed as a sophisticated lead-generation tool for AI advisory services.

###  aktuellen Status

* **Phase 3 Complete + Major AI Model Updates - Ready for Phase 4.** [cite: 59]
* Fully functional three-feature platform with a complete Supabase backend integration. [cite: 12]
* Features enterprise-grade database architecture, robust service layers with RLS security, audit trails, feature flags, and multi-LLM provider preparation. [cite: 12, 16]
* **164 total tests passing** (ProfileService: 35, MarkdownService: 20, TimelineService: 41, DemoDataService: 46, Core Supabase Services: 37). [cite: 36, 60]
* AI provider abstraction layer is complete with OpenAI, Anthropic, and Google providers updated to **May 2025 models**. [cite: 61, 62]
* UI/UX for layout toggling and auto-fit controls in the main interface has been restored. [cite: 61]

### 🚀 Next Steps

* **Phase 4: Advanced AI Features & Production Optimization.** [cite: 63]
* **Immediate Priorities**: Fix 7 remaining OpenAI Provider tests (mock setup issues), add React Testing Library tests for UI components, complete AI provider API documentation, and prepare for enterprise production deployment. [cite: 63, 64]
* **Long-term**: Lead capture integration, industry-specific templates, export capabilities, multi-platform connectors (Salesforce, Microsoft), and advanced AI features like prompt versioning and A/B testing. [cite: 13, 34, 63]

---
## 🏗️ Architecture

The application follows a modern web architecture with a Next.js frontend, a Supabase backend, and a well-defined service layer.

### 📁 Directory Structure

```
sgclasher-agentic-ai-flow/
├── README.md
├── CLIENT_PROFILE_SYSTEM.md
├── instructions.md
├── jest.config.js
├── jest.setup.js
├── package.json
├── PHASE_3_PROGRESS.md
├── TESTING_GUIDE.md
├── app/                                # Main application code [cite: 1]
│   ├── api/                            # API routes (ServiceNow, Timeline generation) [cite: 1, 2, 3, 24, 25]
│   ├── components/                     # Core UI components (FlowVisualizer, Nodes, ServiceNowConnector) [cite: 3, 4, 20, 21, 111]
│   ├── hooks/                          # Custom React hooks (useFlowData, useFlowLayout) [cite: 4, 149]
│   ├── profiles/                       # Client Profile Management feature UI and logic [cite: 4, 5, 21, 22, 112, 149]
│   ├── services/                       # Business logic layer [cite: 5, 6, 7, 24, 114, 115]
│   │   ├── ai/                         # AI service, provider abstractions (OpenAI, Anthropic, Google) [cite: 7, 8]
│   │   ├── __tests__/                  # Service layer unit/integration tests [cite: 6, 7]
│   │   ├── demoDataService.js          # Provides realistic demo profiles [cite: 5, 24, 115]
│   │   ├── markdownService.js        # Handles structured markdown conversion [cite: 5, 24, 115]
│   │   ├── profileService.js         # CRUD for profiles, timeline integration [cite: 6, 24, 115]
│   │   ├── supabaseService.js        # Core Supabase client and service classes [cite: 6, 18]
│   │   └── timelineService.js        # Logic for AI timeline generation [cite: 6, 24, 115]
│   ├── store/                          # Zustand state management stores [cite: 8, 25, 116, 150]
│   ├── timeline/                       # AI Transformation Timeline feature UI and logic [cite: 9, 10, 22, 23, 113, 114, 150, 151]
│   └── utils/                          # Utility functions (layout, data transformation, validation) [cite: 10, 11, 26, 117, 152]
├── database/                           # Database schema [cite: 11]
│   └── schema.sql                      # Supabase PostgreSQL schema [cite: 11]
└── public/                             # Static assets (images) [cite: 11]
```

### 🔧 Backend: Supabase Integration

* **Database**: PostgreSQL on Supabase. [cite: 65]
    * **Schema (`database/schema.sql`)**: Includes tables like `profiles`, `profile_versions`, `timelines`, `ai_conversations`, `integrations`, `documents`, `features`, `user_features`, and `audit_logs`. [cite: 16, 17, 80, 81, 82, 83]
    * **Security**: Row Level Security (RLS) policies for multi-tenant data isolation. [cite: 19, 67, 76] Field-level encryption for sensitive data. [cite: 19]
* **Authentication**: Supabase Auth. [cite: 67]
* **Storage**: Supabase Storage for PDFs, documents, etc. (planned). [cite: 67]
* **Real-time**: Supabase Realtime for live collaboration features (planned). [cite: 67, 77]
* **Service Layer (`app/services/supabaseService.js`)**: Core Supabase client with service classes for `ProfileDB`, `ProfileVersionDB`, `AIConversationDB`, `TimelineDB`, `AuthService`, `AuditService`, `FeatureService`, and `RealtimeService`. [cite: 18]

### 🤖 AI Provider Abstraction Layer (`app/services/ai/`)

* **Unified Interface**: `BaseProvider` (abstract class) defines a common interface. [cite: 61, 96]
* **Providers**: Implementations for OpenAI (GPT-4.5, GPT-4.1, GPT-4o, o3/o3-mini), Anthropic (Claude 4 Opus/Sonnet, Claude 3.7 Sonnet), and Google (Gemini 2.5 Pro, Gemini 2.0 Flash). Models are updated as of **May 2025**. [cite: 8, 61, 73, 104]
* **AIService (`aiService.js`)**: Orchestrates AI operations, manages providers, handles fallback, and integrates with Supabase for conversation history and audit trails. [cite: 7, 62, 97]
* **Features**: Robust error handling (retry logic, exponential backoff), usage tracking (token consumption, cost), health monitoring, and intelligent caching. [cite: 62, 99]
* **Pricing**: All models priced per **million tokens**. Supports cached input pricing. [cite: 39, 61, 105]

### ↔️ Data Flow

1.  **ServiceNow Integration**:
    * Secure authentication via API routes proxying ServiceNow requests. [cite: 31, 109]
    * Data transformation from ServiceNow JSON to React Flow nodes/edges (`app/utils/transformAgenticData.js`). [cite: 31, 117]
    * Dagre layout algorithm positions nodes. [cite: 31, 117]
2.  **Timeline Generation**:
    * Business profile collected via `BusinessProfileModal.js` or automatically from client profiles. [cite: 23, 110, 114]
    * `TimelineService.js` processes data to generate phase-specific initiatives, technologies, and outcomes. [cite: 31, 115]
    * API route `/api/timeline/generate/route.js` handles requests. [cite: 3, 25, 116]
3.  **Client Profile Integration**:
    * `ProfileWizard.js` (8-step Value Selling Framework) captures business intelligence. [cite: 15, 22, 44, 110, 112]
    * `MarkdownService.js` converts profile data to/from structured markdown to prevent AI hallucinations. [cite: 42, 50, 110, 115, 118]
    * `ProfileService.js` handles CRUD, opportunity analysis, and integrates with `TimelineService.js` for automatic timeline generation. [cite: 42, 50, 110, 115, 118]
    * `DemoDataService.js` provides 4-8 realistic industry profiles. [cite: 15, 46, 60, 72, 110, 115, 118]

### 🧪 Testing

* **Frameworks**: Jest, React Testing Library. [cite: 190]
* **Configuration**: `jest.config.js`, `jest.setup.js`. [cite: 90, 91, 92, 93]
* **Coverage**: **164 tests passing**. [cite: 36, 60]
    * ProfileService: 35 tests [cite: 36, 60]
    * MarkdownService: 20 tests [cite: 36, 60]
    * TimelineService: 41 tests [cite: 36, 60]
    * DemoDataService: 46 tests [cite: 36, 60]
    * Core Supabase Services (in `supabaseService.js`): 37 tests [cite: 36, 60]
    * AI BaseProvider: 23 tests [cite: 61, 96]
    * AI AIService: 34 tests [cite: 61, 97]
    * AI OpenAIProvider: 21/28 tests passing (7 mock setup issues remain). [cite: 61, 97]
* **Workflow**: Test-Driven Development (TDD) maintained, especially for backend. [cite: 20, 36, 78]
* **Guides**: `TESTING_GUIDE.md` and `TESTING_WORKFLOW.md` provide detailed instructions. [cite: 190, 203]

### 💡 Key Technical Decisions

* **UI/UX**: Inspired by ai-2027.com, featuring modern dark themes and floating UI elements. [cite: 12, 107] Layout evolved from 3-column fixed to 2-column with a floating widget. [cite: 27]
* **State Management**: Zustand for global state (`useAgenticStore.js`, `useBusinessProfileStore.js`). [cite: 25, 65, 116, 150]
* **Service Layer**: Clear separation of concerns with dedicated services for profiles, markdown, demo data, timelines, and AI. [cite: 27, 118]
* **Data Storage**: Migrated from localStorage to Supabase for profiles and related data. [cite: 16, 69] Structured Markdown is used for client profiles to ensure AI compatibility and prevent hallucinations. [cite: 15, 42, 110, 127]
* **AI Models (May 2025)**:
    * **OpenAI**: GPT-4.5, GPT-4.1, GPT-4o, GPT-4o-mini, o3, o3-mini, o1. [cite: 37, 61, 104]
    * **Anthropic**: Claude 4 Opus, Claude 4 Sonnet, Claude 3.7 Sonnet, Claude 3.5 Sonnet/Haiku. [cite: 38, 61, 104]
    * **Google**: Gemini 2.5 Pro, Gemini 2.0 Flash/Flash Lite, Gemini 1.5 Pro/Flash. [cite: 38, 61, 104]



================================================
USER FIELDS THAT HAVE BEEN DEFINED IN .env
================================================

SERVICENOW_INSTANCE_URL

SERVICENOW_USERNAME

SERVICENOW_PASSWORD

SERVICENOW_SCOPE_ID

NEXT_PUBLIC_SUPABASE_URL

NEXT_PUBLIC_SUPABASE_ANON_KEY

SUPABASE_SERVICE_ROLE_KEY

DATABASE_URL

OPENAI_API_KEY

ANTHROPIC_API_KEY

GOOGLE_AI_API_KEY
