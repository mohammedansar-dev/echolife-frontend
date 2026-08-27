# EchoLife Frontend

EchoLife is a privacy-focused family memory and AI experience.

This repository contains the EchoLife frontend application built with
React, TypeScript and Vite.

The frontend communicates with the EchoLife backend microservices through
their exposed APIs.

---

# 1. Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- Lucide React
- CSS
- Context API

---

# 2. Main Features

The frontend currently contains UI and integration flows for:

- Authentication
- Login / Register
- MFA flow
- Dashboard
- Memory Vault
- Family
- AI Persona
- Persona configuration
- Persona conversation
- Session management
- Daily Prompt
- Profile
- Settings

---

# 3. Backend Services

The frontend is designed to communicate with the EchoLife backend services.

## S1 – Identity & Consent

Responsible for:

- Authentication
- JWT authentication
- Current user
- MFA
- Consent
- Identity and access control

The frontend consumes the Identity & Consent APIs.

Backend service expected:

identity-consent-service

Default local port:

8081

---

## S2 – Vault

Responsible for:

- Memory Vault
- Memory/asset metadata
- Upload authorization
- Asset lifecycle
- Memory-related APIs

Backend service expected:

vault-service

The exact backend port/API base URL must be provided by the backend team.

---

## S3 – Session Orchestrator

Responsible for:

- Starting sessions
- Getting session status
- Ending sessions
- Interactive session flow

Backend service:

session-orchestrator-service

Default local port:

8082

Current session APIs used by the frontend:

POST /api/v1/sessions

GET /api/v1/sessions/{sessionId}

POST /api/v1/sessions/{sessionId}/end

---

# 4. Requirements

Install the following before running the project:

- Node.js
- npm
- Git

Recommended Node.js version:

Node.js 20+

Verify:

node --version
npm --version

---

# 5. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>

cd echolife-frontend-final-ai

---

# 6. Install Dependencies

npm install

---

# 7. Environment Configuration

Create a local environment file:

.env.local

Example:

VITE_API_BASE_URL=http://localhost:8080/api

Do not commit .env.local or any file containing secrets.

The backend/API gateway configuration may change the API base URL.

---

# 8. Run Frontend

Start the development server:

npm run dev

The application will normally be available at:

http://localhost:5173

---

# 9. Production Build

Run:

npm run build

The build must complete without TypeScript errors.

To preview the production build:

npm run preview

---

# 10. Frontend Project Structure

src/
├── api/
│   └── axios configuration
│
├── components/
│   └── layout/
│       └── AppLayout
│
├── features/
│   ├── auth/
│   │   ├── authentication
│   │   └── MFA
│   │
│   ├── persona/
│   │   ├── PersonaAPI
│   │   ├── PersonaContext
│   │   ├── PersonaPage
│   │   ├── PersonaConfigurePage
│   │   └── PersonaConversationPage
│   │
│   ├── session/
│   │   ├── session.api
│   │   ├── session.types
│   │   └── SessionConversationPage
│   │
│   ├── vault/
│   │   └── Memory Vault
│   │
│   ├── family/
│   │   └── Family
│   │
│   └── prompts/
│       └── Daily Prompt
│
├── App.tsx
└── main.tsx

---

# 11. S3 Session Integration

The frontend starts a session using:

POST /api/v1/sessions

Example request:

{
  "personaId": "family-persona",
  "mode": "STORY",
  "inputChannel": "TEXT",
  "outputChannel": "TEXT",
  "clientType": "WEB"
}

Expected response contains:

{
  "sessionId": "sess_xxx",
  "userId": "xxx",
  "personaId": "family-persona",
  "mode": "STORY",
  "status": "ACTIVE",
  "outputChannel": "TEXT",
  "degraded": false,
  "policyVersion": 0
}

The frontend then navigates to:

/app/persona/conversation/{sessionId}

The session conversation page loads the session using:

GET /api/v1/sessions/{sessionId}

When the conversation is finished:

POST /api/v1/sessions/{sessionId}/end

---

# 12. S1 Integration

The frontend expects the Identity & Consent service to provide the
authentication and identity APIs required by the application.

The frontend authentication state is used when calling protected APIs.

The backend team must ensure:

- JWT authentication works
- Current user is available
- MFA flow works
- Required authentication/session cookies or tokens are correctly configured
- CORS is configured for the frontend origin

---

# 13. S2 Integration

The frontend Memory Vault expects the backend to provide the required
Vault APIs for:

- Creating/uploading memories
- Retrieving memories
- Updating memory metadata
- Deleting memories
- Asset/upload lifecycle

The backend team should verify the exact API paths and response contracts
against the PRD before integration.

---

# 14. S3 Integration

The frontend already contains the session API integration.

Backend team should verify:

1. JWT is accepted by S3.
2. Session creation accepts the frontend request.
3. Identity/Consent access checking works.
4. A valid session ID is returned.
5. GET session works.
6. END session works.
7. Session status changes correctly.
8. Persona conversation can use the created session.
9. CORS/API gateway configuration allows the frontend.
10. Any required internal service authentication is configured on the backend.

---

# 15. Frontend Routes

Main application routes include:

/app/dashboard

/app/vault

/app/family

/app/persona

/app/persona/configure

/app/persona/conversation

/app/persona/conversation/:sessionId

/app/sessions

/app/profile

/app/settings

/app/daily-prompt

---

# 16. Running Frontend + Backend Locally

Start the required backend services first.

Example:

Identity & Consent:

http://localhost:8081

Session Orchestrator:

http://localhost:8082

Then start the frontend:

npm run dev

Open:

http://localhost:5173

Login through the frontend and verify the authenticated flow.

---

# 17. Integration Testing

After starting the services, verify:

## Authentication

- Login works
- JWT/session authentication works
- MFA works
- Dashboard opens

## Vault

- Memory Vault opens
- Memory APIs respond
- Memory creation/retrieval works

## Persona

- AI Persona page opens
- Persona configuration can be saved
- Selected memories are displayed
- Conversation can be started

## Session

- Session starts successfully
- Session ID is returned
- Session conversation page opens
- Session status can be retrieved
- Session can be ended

---

# 18. Important Backend Integration Note

The frontend repository contains the UI and frontend API integration.

Backend business logic, database ownership, service-to-service authentication,
DynamoDB/PostgreSQL configuration, and backend API implementation remain the
responsibility of the corresponding backend services.

If an API returns 401, 403, 404 or 500, verify the backend service,
authentication configuration, API path, CORS configuration and service
configuration before changing the frontend contract.

---

# 19. Build Verification

Before pushing changes:

npm run build

The build should complete successfully with zero TypeScript errors.

Then:

git status

---

# 20. Git Workflow

Check current branch:

git branch

Pull latest changes:

git pull origin <branch-name>

Check changes:

git status

Build:

npm run build

Stage:

git add .

Commit:

git commit -m "Update S1 S2 S3 frontend integration"

Push:

git push origin <branch-name>

---

# 21. Backend Team Integration

The backend team can clone this repository and run:

git clone <YOUR_GITHUB_REPOSITORY_URL>

cd echolife-frontend-final-ai

npm install

npm run dev

They should run the required backend services separately and configure
VITE_API_BASE_URL according to the backend/API gateway configuration.

---

# 22. Current Frontend Status

Frontend implementation is completed for the currently integrated flows.

Final end-to-end verification depends on the corresponding backend services
being available and correctly configured.

Backend API contracts should be verified against the EchoLife PRD before
final integration.