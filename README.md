# EchoLife Frontend

EchoLife is a React + TypeScript frontend for a private digital family platform.

The frontend provides the user-facing experience for authentication, dashboard, Memory Vault, Family, AI Persona, conversations, sessions, daily prompts, profile, settings, activity, reports, billing and related application features.

The project follows a feature-based architecture where each major feature keeps its pages, API integration, state/context, types and styles organized together.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- CSS

---

## Project Structure

```text
echolife-frontend-final-ai/
│
├── src/
│   │
│   ├── api/
│   │   ├── axios.ts
│   │   ├── interceptors.ts
│   │   └── sessionAxios.ts
│   │
│   ├── components/
│   │   ├── ai/
│   │   ├── feedback/
│   │   ├── layout/
│   │   └── ui/
│   │
│   ├── features/
│   │   │
│   │   ├── activity/
│   │   │
│   │   ├── ai/
│   │   │
│   │   ├── auth/
│   │   │   ├── auth.api.ts
│   │   │   ├── auth.types.ts
│   │   │   ├── AuthContext.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── PublicRoute.tsx
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── billing/
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardPage.tsx
│   │   │   └── DashboardPage.css
│   │   │
│   │   ├── family/
│   │   │   ├── family.permissions.ts
│   │   │   ├── family.types.ts
│   │   │   ├── FamilyContext.tsx
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── legacy/
│   │   │
│   │   ├── notifications/
│   │   │
│   │   ├── onboarding/
│   │   │   ├── onboarding.api.ts
│   │   │   ├── onboarding.types.ts
│   │   │   ├── components/
│   │   │   └── pages/
│   │   │
│   │   ├── persona/
│   │   │   ├── PersonaAPI.ts
│   │   │   ├── PersonaContext.tsx
│   │   │   ├── PersonaPage.tsx
│   │   │   ├── PersonaPage.css
│   │   │   ├── PersonaConfigurePage.tsx
│   │   │   ├── PersonaConfigurePage.css
│   │   │   ├── PersonaConversationPage.tsx
│   │   │   └── PersonaConversationPage.css
│   │   │
│   │   ├── profile/
│   │   │
│   │   ├── prompts/
│   │   │   ├── DailyPromptPage.tsx
│   │   │   └── DailyPromptPage.css
│   │   │
│   │   ├── reports/
│   │   │
│   │   ├── search/
│   │   │   ├── GlobalSearch.tsx
│   │   │   ├── GlobalSearch.css
│   │   │   └── search.types.ts
│   │   │
│   │   ├── session/
│   │   │   ├── session.api.ts
│   │   │   ├── session.types.ts
│   │   │   ├── SessionsPage.tsx
│   │   │   ├── SessionsPage.css
│   │   │   ├── SessionDetailsPage.tsx
│   │   │   ├── SessionDetailsPage.css
│   │   │   ├── SessionConversationPage.tsx
│   │   │   └── SessionConversationPage.css
│   │   │
│   │   ├── settings/
│   │   │
│   │   └── vault/
│   │       ├── memory.types.ts
│   │       ├── MemoryAPI.ts
│   │       ├── MemoryContext.tsx
│   │       ├── timeCapsule.types.ts
│   │       ├── TimeCapsuleContext.tsx
│   │       ├── components/
│   │       ├── data/
│   │       └── pages/
│   │
│   ├── hooks/
│   ├── services/
│   ├── styles/
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env
├── index.html
├── package.json
├── package-lock.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
├── vite.config.ts
└── README.md


Main Features
Authentication
Login
Registration
MFA
Forgot password
Password reset
Protected routes
Public routes
Dashboard
Main application dashboard
Navigation to major EchoLife features
User application overview
Memory Vault
Memory management
Memory cards
Memory preview
Edit and delete memory
Time Capsule functionality
Memory selection for Persona
Family
Family management
Family permissions
Family-related pages and components
AI Persona
Persona creation
Persona configuration
Persona name
Communication tone selection
Memory selection
Connected memories
Persona conversation
Sessions
Session creation
Session details
Session conversation
Session status
Session ending
Daily Prompt
Daily prompts
Navigation into Persona conversations
Account
Profile
Settings
Security
Notifications
Activity
Reports
Billing
Environment Setup

Create a .env file in the project root:

VITE_API_BASE_URL=http://localhost:8080/api

The frontend uses this variable as the base URL for backend API communication.

If the backend or API gateway is running on another URL, update the value accordingly.

Installation & Running
Clone
git clone <REPOSITORY_URL>
cd echolife-frontend-final-ai
Install dependencies
npm install
Configure environment

Create .env in the project root:

VITE_API_BASE_URL=http://localhost:8080/api
Start development server
npm run dev
Build
npm run build
Preview production build
npm run preview
Backend Integration

The frontend communicates with backend services through the existing API layer.

The main integration areas are:

src/api/

Shared API configuration and request handling.

src/features/auth/

Authentication API calls and authentication state.

src/features/vault/

Memory Vault API calls and memory state.

src/features/persona/

Persona configuration and conversation API integration.

src/features/session/

Session API calls, session types and session-related pages.

The backend/API gateway URL is controlled through:

VITE_API_BASE_URL=http://localhost:8080/api

Make sure the backend services are running and that this URL points to the correct API gateway/backend endpoint.

The existing frontend API clients can then communicate with the corresponding backend endpoints.

Development Guidelines

Feature-specific code should remain inside its respective feature directory:

src/features/<feature>/

Shared functionality should be placed in:

src/components/
src/api/
src/hooks/
src/services/
src/styles/

API communication should remain inside the appropriate API/service layer rather than being implemented directly inside UI components.

Git Commands

Check current changes:

git status

Get the latest changes:

git pull

Stage changes:

git add .

Commit changes:

git commit -m "Update frontend"

Push changes:

git push
