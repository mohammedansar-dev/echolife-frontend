EchoLife Frontend

Production-oriented React + TypeScript frontend for EchoLife, organized by application feature and designed for clean backend API integration.

Tech Stack

React + TypeScript

Vite

React Router

Axios

Lucide React

CSS / Tailwind configuration

ESLint

Requirements

Node.js 20+ recommended

npm

Git

Check versions:

node --version
npm --version
git --version

Quick Start

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd echolife-frontend-final-ai
npm install

Create .env in the project root:

VITE_API_BASE_URL=http://localhost:8080/api

Start the frontend:

npm run dev

Open the URL shown by Vite, normally:

http://localhost:5173

Build:

npm run build

Preview:

npm run preview

Do not commit .env. Use .env.example as the template for local configuration.

Project Structure

echolife-frontend-final-ai/
├── .env
├── .env.example
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── README.md
├── tailwind.config.js
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── src/
    ├── App.tsx
    ├── App.css
    ├── index.css
    ├── main.tsx
    │
    ├── api/
    │   ├── axios.ts
    │   ├── interceptors.ts
    │   └── sessionAxios.ts
    │
    ├── components/
    │   ├── ai/
    │   ├── feedback/
    │   ├── layout/
    │   └── ui/
    │
    ├── features/
    │   ├── activity/
    │   ├── ai/
    │   ├── auth/
    │   ├── billing/
    │   ├── dashboard/
    │   ├── family/
    │   ├── legacy/
    │   ├── notifications/
    │   ├── onboarding/
    │   ├── persona/
    │   ├── profile/
    │   ├── prompts/
    │   ├── reports/
    │   ├── search/
    │   ├── session/
    │   ├── settings/
    │   └── vault/
    │
    ├── hooks/
    ├── services/
    └── styles/

The current repository contains the feature-specific pages, API clients, contexts, types and styles under src/features. Keep new code in the appropriate feature directory.

API Configuration

The shared API clients are:

src/api/axios.ts
src/api/interceptors.ts
src/api/sessionAxios.ts

The base URL is controlled by:

VITE_API_BASE_URL=http://localhost:8080/api

Feature-specific API clients are kept next to their features.

Examples:

src/features/auth/auth.api.ts
src/features/vault/MemoryAPI.ts
src/features/persona/PersonaAPI.ts
src/features/session/session.api.ts

This keeps UI components separate from HTTP implementation.

Authentication

Authentication and MFA are implemented under:

src/features/auth/

Important files include:

auth.api.ts
auth.types.ts
AuthContext.tsx
ProtectedRoute.tsx
PublicRoute.tsx

Authentication-dependent pages should use the existing authentication flow rather than storing credentials or tokens directly inside page components.

For local integration, make sure the backend authentication service is running and the frontend API base URL points to the correct API/gateway.

Routing

Application routes are configured in:

src/App.tsx

The authenticated application layout is handled by:

src/components/layout/AppLayout.tsx

Main application routes follow the existing /app/... convention.

Examples include:

/app/dashboard
/app/vault
/app/family
/app/persona
/app/sessions
/app/profile
/app/settings

Persona

Persona frontend code is located at:

src/features/persona/

Main files:

persona.types.ts
PersonaAPI.ts
PersonaContext.tsx
PersonaPage.tsx
PersonaConfigurePage.tsx
PersonaConversationPage.tsx

The UI supports:

Persona configuration

Persona name

Communication tone

Memory selection

Persona conversation UI

Starting a conversation session

Session-based conversation routing

The Persona page starts a session through the session API and routes to the conversation page using the returned sessionId.

Session

Session frontend integration is located at:

src/features/session/

Files:

session.api.ts
session.types.ts
SessionsPage.tsx
SessionDetailsPage.tsx
SessionConversationPage.tsx

The API client exposes:

startSession(payload)
getSession(sessionId)
endSession(sessionId)

Start session

The frontend sends:

POST /api/v1/sessions

Example body:

{
  "personaId": "family-persona",
  "mode": "STORY",
  "inputChannel": "TEXT",
  "outputChannel": "TEXT",
  "clientType": "WEB"
}

Expected response:

{
  "sessionId": "sess_example",
  "userId": "user-example",
  "personaId": "family-persona",
  "mode": "STORY",
  "status": "ACTIVE",
  "outputChannel": "TEXT",
  "degraded": false,
  "policyVersion": 0
}

The returned sessionId is used to open the session conversation.

Get session

GET /api/v1/sessions/{sessionId}

End session

POST /api/v1/sessions/{sessionId}/end

The session frontend types are defined in:

src/features/session/session.types.ts

The supported session modes are:

BLESSING
STORY
ADVICE
CHECK_IN
REFLECTION

Supported channels:

TEXT
VOICE
AVATAR

Memory Vault

Memory Vault code is located at:

src/features/vault/

Important files:

memory.types.ts
MemoryAPI.ts
MemoryContext.tsx

Persona configuration reads the available memories and sends selected memory IDs where required by the API contract.

Onboarding

Onboarding is located at:

src/features/onboarding/

The flow contains components for:

Welcome
Profile
Consent
Family
Persona
First Memory
Complete

Family

Family functionality is located at:

src/features/family/

It includes family members, invitations, member details, editing, deletion, settings and permission-related types.

Other Features

The repository also contains frontend modules for:

Dashboard
AI
Activity
Billing
Legacy Contacts
Notifications
Daily Prompt
Reports
Search
Profile
Settings

Each feature keeps its related UI and supporting code grouped under src/features.

Backend Integration Guide

This repository is the frontend application. Backend services should expose endpoints matching the API contracts used by the frontend.

1. Clone

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd echolife-frontend-final-ai

2. Install

npm install

3. Configure API URL

Create .env:

VITE_API_BASE_URL=http://localhost:8080/api

If the backend gateway/API is running on another host or port, change this value accordingly.

4. Start Backend Services

Start the required backend services according to the backend repository documentation.

5. Start Frontend

npm run dev

6. Login

Open the frontend in the browser and authenticate through the existing login/MFA flow.

7. Verify API Requests

Use browser DevTools:

F12 → Network

Select the API request and verify:

Request URL
HTTP method
Request headers
Authentication
Request body
Response status
Response body

This is the fastest way to identify whether an integration issue is coming from the frontend request or the backend response.

API Contract Rules

When an API is integrated, the frontend expects the backend to preserve the agreed:

URL

HTTP method

request fields

response fields

authentication requirements

HTTP status codes

error response format

If a backend contract changes, update the corresponding API client and TypeScript types together.

For session changes:

src/features/session/session.api.ts
src/features/session/session.types.ts

For Persona changes:

src/features/persona/PersonaAPI.ts
src/features/persona/persona.types.ts
src/features/persona/PersonaContext.tsx

Avoid placing raw API calls throughout UI components.

Troubleshooting

401 Unauthorized

Check:

Authentication state
Authorization/credentials
Token validity
API base URL
Backend authentication configuration

A frontend page should not bypass authentication to hide a 401 response.

403 Forbidden

The request reached the backend but access was rejected.

Check the backend authorization/policy response and service logs.

404 Not Found

Check that the configured API URL and endpoint path match the backend route.

500 Internal Server Error

Check backend service logs and the request payload.

CORS Error

Make sure the backend allows the frontend development origin.

The default Vite development origin is normally:

http://localhost:5173

Build Error

Run:

npm run build

Resolve TypeScript/Vite errors before pushing.

Development Workflow

Pull the latest code:

git pull

Install dependencies:

npm install

Run locally:

npm run dev

Verify before committing:

npm run build
git status
git diff

Stage the application changes:

git add README.md src package.json package-lock.json

Review staged changes:

git diff --cached

Commit:

git commit -m "Update frontend integration"

Push:

git push

If other files were intentionally changed, stage those specific files as well. Avoid accidentally staging .env or other local secrets.

Environment and Secrets

Never commit:

.env

Do not put the following into source code or Git:

Passwords
Private keys
Database credentials
Service secrets
Access tokens

VITE_* values are exposed to the browser at build time, so they must not contain secrets.

Integration Checklist

Before handing the frontend to another developer:

[ ] npm install works
[ ] .env is configured
[ ] npm run dev works
[ ] npm run build passes
[ ] Login works
[ ] Protected routes work
[ ] API base URL is correct
[ ] Session API paths match the backend
[ ] Persona API paths match the backend
[ ] Browser Network requests can be inspected
[ ] No .env/secrets are committed

The frontend should be integrated by connecting the backend services to the API contracts documented above and then running the application locally.