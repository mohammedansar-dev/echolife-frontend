# EchoLife Frontend — Backend Integration Guide

EchoLife is a React + TypeScript frontend for a digital memory platform.

The frontend is already connected to the EchoLife Spring Boot backend for authentication and the initial Memory functionality.

This document is the handoff guide for backend developers.

The main goal is:

Frontend UI → Frontend API/Context → Spring Boot REST API → Service → Repository → PostgreSQL

Do not connect the frontend directly to PostgreSQL.

---

## 1. Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React

### Backend

- Java 17
- Spring Boot 3.3.2
- Spring Data JPA
- Hibernate
- PostgreSQL
- Spring Security
- JWT
- SpringDoc OpenAPI / Swagger

---

# 2. Frontend Structure

Important frontend structure:

src/
├── api/
│   └── axios.ts
│
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── auth.api.ts
│   │   ├── auth.types.ts
│   │   └── pages/
│   │       ├── LoginPage.tsx
│   │       └── RegisterPage.tsx
│   │
│   ├── vault/
│   │   ├── MemoryContext.tsx
│   │   ├── memory.types.ts
│   │   ├── MemoryAPI.ts
│   │   ├── components/
│   │   │   └── EditMemoryModal.tsx
│   │   └── pages/
│   │       ├── MemoryVaultPage.tsx
│   │       ├── MemoryVaultPage.css
│   │       ├── UploadMemoryPage.tsx
│   │       ├── UploadMemoryPage.css
│   │       ├── MemoryDetailsPage.tsx
│   │       └── MemoryDetailsPage.css
│   │
│   ├── dashboard/
│   ├── family/
│   ├── persona/
│   ├── sessions/
│   ├── reports/
│   ├── billing/
│   ├── daily-prompt/
│   ├── ai-reflection/
│   ├── legacy/
│   └── settings/
│
├── services/
│   ├── memoryService.ts
│   └── memoryMediaService.ts
│
├── App.tsx
└── main.tsx

---

# 3. Backend Architecture Expected

The backend should follow:

Controller
↓
Service
↓
Repository
↓
Entity
↓
PostgreSQL

Example:

MemoryController
↓
MemoryService
↓
MemoryRepository
↓
Memory entity
↓
PostgreSQL

Do not put database logic inside controllers.

Do not put business logic inside controllers.

---

# 4. Authentication

Frontend authentication files:

src/features/auth/AuthContext.tsx
src/features/auth/auth.api.ts
src/features/auth/auth.types.ts

Current backend endpoints:

POST /api/auth/register
POST /api/auth/login

Registration flow:

Register Page
↓
auth.api.ts
↓
POST /api/auth/register
↓
Spring Boot
↓
UserRepository
↓
PostgreSQL

Login flow:

Login Page
↓
AuthContext
↓
auth.api.ts
↓
POST /api/auth/login
↓
Spring Boot
↓
UserRepository
↓
PostgreSQL
↓
Login response
↓
Frontend authentication state
↓
Dashboard

The backend login response currently provides:

{
  "userId": 5,
  "name": "Ansar",
  "email": "a12@gmail.com",
  "role": "USER",
  "message": "Login successful."
}

The frontend uses the returned userId.

IMPORTANT:

Do not hard-code a user ID.

Do not create fake users on the frontend.

The backend user ID must come from the database.

---

# 5. Axios

Frontend API configuration:

src/api/axios.ts

Default backend:

http://localhost:8080

Recommended .env:

VITE_API_BASE_URL=http://localhost:8080

All frontend API services should use the shared Axios instance.

Do not create separate Axios configurations unnecessarily.

---

# 6. Memory Architecture

Main frontend memory files:

src/features/vault/MemoryContext.tsx
src/features/vault/memory.types.ts
src/features/vault/MemoryAPI.ts
src/features/vault/pages/MemoryVaultPage.tsx
src/features/vault/pages/UploadMemoryPage.tsx
src/features/vault/pages/MemoryDetailsPage.tsx
src/features/vault/components/EditMemoryModal.tsx

Supporting services:

src/services/memoryService.ts
src/services/memoryMediaService.ts

Architecture:

MemoryVaultPage
↓
MemoryContext
↓
memoryService
↓
Axios
↓
MemoryController
↓
MemoryService
↓
MemoryRepository
↓
PostgreSQL

---

# 7. Memory Backend Endpoints

Currently expected:

POST /api/memories/user/{userId}

GET /api/memories/user/{userId}

GET /api/memories/user/{userId}/accessible

GET /api/memories/user/{userId}/time-capsules/locked

POST /api/memories/user/{userId}/prompt/{promptId}

DELETE /api/memories/{id}

The frontend expects these APIs to work with the logged-in user's real database ID.

---

# 8. Creating a Memory

Frontend:

UploadMemoryPage.tsx

calls:

useMemory()

which calls:

MemoryContext.addMemory()

The flow is:

User selects file
↓
User enters title
↓
User enters description
↓
User selects memory date
↓
User selects category
↓
User selects emotional tone
↓
Optional Time Capsule
↓
MemoryContext
↓
POST /api/memories/user/{userId}
↓
Backend creates database memory
↓
Backend returns memory ID
↓
Frontend uploads media using memory ID
↓
Memory appears in Memory Vault

The backend must return a valid database ID after creating the memory.

---

# 9. Memory Request

The frontend expects memory data around:

{
  "title": "My Memory",
  "description": "A special memory",
  "memoryDate": "2026-08-24",
  "isTimeCapsule": false,
  "unlockDate": null,
  "emotionalTone": "Family"
}

Additional fields may be used depending on the current backend DTO.

Do not unnecessarily rename existing fields.

---

# 10. Memory Entity

Backend Memory should support at minimum:

id
title
description
memoryDate
isTimeCapsule
unlockDate
emotionalTone
user
prompt
aiReflection
aiReflectionSummary
createdAt
updatedAt

The exact entity implementation belongs to the backend.

The frontend should not directly depend on database entities.

Use DTOs for API responses.

---

# 11. User → Memory Relationship

Every memory belongs to a user.

Expected relationship:

User
│
├── Memory 1
├── Memory 2
├── Memory 3
└── Memory 4

Backend must always verify ownership.

For example:

GET /api/memories/user/7

must return memories belonging to user 7.

A user must never be able to access another user's memory by changing the URL.

---

# 12. Memory Media

Memory metadata and media should be treated separately.

Frontend service:

src/services/memoryMediaService.ts

Expected flow:

Create Memory
↓
Memory ID returned
↓
Upload media using Memory ID
↓
Store media
↓
Return media information
↓
Frontend displays media

Supported frontend media types:

photo
video
audio
document

Backend media should provide enough information for the frontend to display/download it.

Example:

{
  "id": 10,
  "memoryId": 25,
  "fileUrl": "...",
  "mediaType": "photo"
}

---

# 13. Media URL

The frontend must be able to access the returned media URL from the browser.

Do not return a backend-only filesystem path such as:

C:\Users\...

Instead return a URL or API path that the frontend can access.

Example:

/uploads/memories/25/photo.jpg

or:

http://localhost:8080/uploads/memories/25/photo.jpg

The final production URL should be environment-based.

---

# 14. Memory Retrieval

Memory Vault uses:

GET /api/memories/user/{userId}

Flow:

User logs in
↓
Frontend obtains user ID
↓
MemoryContext gets user ID
↓
GET /api/memories/user/{userId}
↓
Backend queries MemoryRepository
↓
PostgreSQL
↓
Memory list
↓
Frontend Memory Vault

The backend should return only memories owned by that user.

---

# 15. Memory Details

Frontend:

src/features/vault/pages/MemoryDetailsPage.tsx

It displays:

- Title
- Description
- Memory date
- Category
- Emotional tone
- Media
- Time Capsule information
- AI reflection
- Edit action
- Delete action

The backend response should contain enough information for this page.

---

# 16. Memory Delete

Current backend endpoint:

DELETE /api/memories/{id}

Flow:

Delete button
↓
Frontend confirmation
↓
DELETE /api/memories/{id}
↓
Backend validates ownership
↓
MemoryRepository.delete(...)
↓
Database
↓
Frontend removes memory
↓
Success toast

IMPORTANT:

The backend must verify that the authenticated user owns the memory.

Do not allow:

DELETE /api/memories/123

to delete another user's memory.

---

# 17. Memory Edit

The frontend already has:

src/features/vault/components/EditMemoryModal.tsx

and edit UI inside:

MemoryDetailsPage.tsx

However, the backend currently needs a persistent update endpoint if one is not already available.

Recommended:

PUT /api/memories/{id}

or:

PATCH /api/memories/{id}

Recommended request:

{
  "title": "Updated title",
  "description": "Updated description",
  "memoryDate": "2026-08-24",
  "emotionalTone": "Family",
  "isTimeCapsule": false,
  "unlockDate": null
}

Backend must:

1. Find memory.
2. Verify ownership.
3. Update fields.
4. Save using repository.
5. Return updated memory DTO.

---

# 18. Time Capsule

Frontend supports:

isTimeCapsule
unlockDate

Expected backend behavior:

Create Time Capsule
↓
Save unlockDate
↓
Memory remains locked
↓
Before unlock date
↓
Do not expose memory content
↓
After unlock date
↓
Memory becomes accessible

Backend must enforce Time Capsule security.

Do not rely only on frontend hiding the memory.

---

# 19. Time Capsule APIs

Expected:

GET /api/memories/user/{userId}/accessible

GET /api/memories/user/{userId}/time-capsules/locked

The backend should determine whether a memory is accessible based on the server date/time.

---

# 20. Consent / Governance

Memory creation may require consent.

Backend consent endpoints:

POST /api/consents/user/{userId}/grant

POST /api/consents/user/{userId}/revoke

GET /api/consents/user/{userId}

Important consent types include:

AI_DATA_PROCESSING
TIME_CAPSULE_ACCESS
LEGACY_SHARING

If AI_DATA_PROCESSING consent is required and not granted, the backend may return:

403 Forbidden

Example:

{
  "error": "Consent / Security Violation",
  "message": "User has not granted active consent for AI Data Processing."
}

The frontend should display this as a user-friendly toast/message.

---

# 21. AI Safety

The backend is responsible for AI safety.

The backend should perform safety screening before AI processing.

The frontend should NOT be treated as the security layer.

Expected backend flow:

Memory Request
↓
Validate request
↓
Check user
↓
Check consent
↓
Safety screening
↓
AI processing
↓
Save memory
↓
Return response

The backend should handle unsafe content according to its existing safety rules.

---

# 22. AI Reflection

Memory can contain:

aiReflection
aiReflectionSummary
emotionalTone

Backend AI service should generate these values where applicable.

Frontend displays the returned values.

Do not generate fake AI responses in the frontend.

---

# 23. AI Personas

Frontend route:

/app/persona

Backend endpoints:

GET /api/personas/user/{userId}

POST /api/personas/user/{userId}

Backend should support:

- System personas
- Custom personas
- Persona selection
- Persona configuration

The frontend should consume the backend response rather than maintain a separate production persona database.

---

# 24. Daily Prompts

Backend:

GET /api/prompts

GET /api/prompts/category/{category}

POST /api/prompts

Frontend can use these for:

- Daily Reflection
- Memory prompts
- Prompt-based memories

---

# 25. Prompt-Based Memory

Backend endpoint:

POST /api/memories/user/{userId}/prompt/{promptId}

Expected:

Daily Prompt
↓
User answers
↓
Create Memory
↓
Prompt ID attached
↓
Backend saves relationship
↓
Memory returned

---

# 26. Authentication + Protected APIs

Backend should protect user-specific APIs.

Protected APIs include:

Memory APIs
Consent APIs
Persona APIs
User APIs
Legacy APIs
Time Capsule APIs

The frontend should eventually send:

Authorization: Bearer <JWT>

for protected endpoints.

Recommended frontend implementation:

Axios interceptor
↓
Read JWT
↓
Attach Authorization header
↓
Backend JwtAuthenticationFilter
↓
Spring Security

Do not duplicate authentication code inside every API service.

---

# 27. Backend Security

Backend should use:

Spring Security
JWT
Role-based authorization
Ownership validation

Backend must never trust:

userId
memoryId
role
permission

sent from the frontend without verification.

The authenticated user should be obtained from the backend security context wherever possible.

---

# 28. Error Contract

Backend should use consistent JSON errors.

Example:

{
  "error": "Something went wrong",
  "message": "Human-readable explanation",
  "status": 400,
  "timestamp": "..."
}

Important status codes:

200 = Success

201 = Created

400 = Validation / safety error

401 = Authentication required

403 = Forbidden / consent / authorization

404 = Resource not found

500 = Server error

Frontend should convert these into readable toast messages.

---

# 29. CORS

Frontend development server:

http://localhost:5173

Backend:

http://localhost:8080

Backend CORS must allow the frontend development origin.

Do not use unrestricted CORS in production.

---

# 30. PostgreSQL

Backend owns PostgreSQL.

Example:

Database:
echolife

Username:
postgres

Port:
5432

Frontend must never contain PostgreSQL credentials.

Never put database passwords inside:

.env

frontend source code

Axios configuration

React components

---

# 31. Backend Package Structure

Recommended backend structure:

src/main/java/com/echolife/backend/

├── config/
│   ├── CorsConfig.java
│   ├── SecurityConfig.java
│   └── OpenApiConfig.java
│
├── controller/
│   ├── AuthController.java
│   ├── MemoryController.java
│   ├── ConsentController.java
│   ├── PersonaController.java
│   ├── PromptController.java
│   └── UserController.java
│
├── dto/
│   ├── LoginRequest.java
│   ├── RegisterRequest.java
│   ├── AuthResponse.java
│   ├── MemoryRequest.java
│   ├── ConsentRequest.java
│   └── ...
│
├── entity/
│   ├── User.java
│   ├── Memory.java
│   ├── Persona.java
│   ├── Prompt.java
│   └── UserConsent.java
│
├── repository/
│   ├── UserRepository.java
│   ├── MemoryRepository.java
│   ├── PersonaRepository.java
│   ├── PromptRepository.java
│   └── UserConsentRepository.java
│
├── service/
│   ├── AuthService.java
│   ├── MemoryService.java
│   ├── ConsentService.java
│   ├── PersonaService.java
│   ├── PromptService.java
│   ├── AiReflectionService.java
│   └── AiSafetyService.java
│
├── security/
│   ├── JwtAuthenticationFilter.java
│   └── JwtTokenProvider.java
│
└── exception/
    ├── GlobalExceptionHandler.java
    ├── GovernanceException.java
    └── ResourceNotFoundException.java

---

# 32. Service Responsibility

AuthService:

- Register user
- Hash password
- Validate login
- Generate JWT

MemoryService:

- Create memory
- Update memory
- Delete memory
- Retrieve memories
- Validate ownership
- Handle Time Capsule rules
- Trigger AI processing if required

ConsentService:

- Grant consent
- Revoke consent
- Check consent

AiSafetyService:

- Safety screening

AiReflectionService:

- AI reflection
- AI summary

PersonaService:

- Persona management

PromptService:

- Prompt management

---

# 33. Repository Responsibility

Repositories should only handle database operations.

Example:

MemoryRepository

- findById
- findByUser
- delete
- save
- time capsule queries

Do not put AI logic inside repositories.

Do not put authorization logic inside repositories unless specifically required by the query design.

---

# 34. Frontend Responsibilities

Frontend handles:

- UI
- Routing
- Forms
- Client-side validation
- Loading states
- Error states
- Toasts
- API calls
- Authentication state
- Memory presentation
- File selection
- File previews

---

# 35. Backend Responsibilities

Backend handles:

- Authentication
- Authorization
- JWT
- Database
- Memory ownership
- Consent
- AI safety
- AI processing
- Time Capsule security
- Media persistence
- Data validation
- Business rules
- API responses

---

# 36. Do Not Duplicate Backend Logic

Do not implement database/business rules in React.

For example:

BAD:

Frontend decides:

"user owns memory"

GOOD:

Frontend requests memory.

Backend verifies:

authenticatedUser.id == memory.user.id

---

# 37. Testing Workflow

First test backend independently using Swagger.

Swagger:

http://localhost:8080/swagger-ui/index.html

Then test frontend.

Recommended sequence:

1. Start PostgreSQL.
2. Start Spring Boot backend.
3. Open Swagger.
4. Test register.
5. Test login.
6. Verify database user.
7. Test consent.
8. Test memory creation.
9. Verify database memory.
10. Test memory retrieval.
11. Test media.
12. Test delete.
13. Test frontend login.
14. Test frontend Memory Vault.
15. Test frontend memory creation.
16. Test frontend memory retrieval.
17. Test frontend deletion.
18. Test Time Capsule.
19. Test AI processing.

---

# 38. Frontend Testing Flow

Browser:

Register
↓
Login
↓
Dashboard
↓
Memory Vault
↓
Create Memory
↓
Select file
↓
Save
↓
Backend creates memory
↓
Media uploaded
↓
Memory appears
↓
Refresh page
↓
Memory still exists
↓
Open details
↓
Edit
↓
Delete

If the memory disappears after refresh, the backend/database integration is not correct.

---

# 39. Swagger Testing

Swagger should be used to verify:

- Request structure
- Response structure
- HTTP status
- Authentication
- Consent
- Database persistence
- Error handling

But Swagger success alone is not enough.

The frontend must also work with the same API.

---

# 40. Backend Handoff Checklist

Before changing frontend code, backend developer should check:

[ ] Existing frontend API endpoint

[ ] Request JSON

[ ] Response JSON

[ ] TypeScript type

[ ] MemoryContext

[ ] Authentication flow

[ ] User ID flow

[ ] Axios configuration

[ ] Database entity

[ ] DTO

[ ] Controller

[ ] Service

[ ] Repository

---

# 41. Important Files Backend Developer Should Inspect

Start with these frontend files:

src/api/axios.ts

src/features/auth/AuthContext.tsx

src/features/auth/auth.api.ts

src/features/auth/auth.types.ts

src/features/vault/MemoryContext.tsx

src/features/vault/memory.types.ts

src/features/vault/MemoryAPI.ts

src/services/memoryService.ts

src/services/memoryMediaService.ts

src/features/vault/pages/UploadMemoryPage.tsx

src/features/vault/pages/MemoryVaultPage.tsx

src/features/vault/pages/MemoryDetailsPage.tsx

src/features/vault/components/EditMemoryModal.tsx

These files define most of the current authentication and Memory integration contract.

---

# 42. If Backend API Changes

If the backend changes:

Example:

memoryDate

to:

date

then update both sides.

Frontend:

memory.types.ts

MemoryContext.tsx

memoryService.ts

Relevant pages/components

Backend:

DTO

Controller

Service

Entity mapping

Swagger

Never change only the database entity and assume the frontend will automatically adapt.

---

# 43. Current Important Backend Work

The frontend is already prepared for the basic authentication flow and Memory Vault flow.

Backend should ensure the following are fully production-ready:

1. JWT authentication
2. Protected endpoints
3. Memory ownership validation
4. Memory update endpoint
5. Media upload/retrieval
6. Consent integration
7. AI safety integration
8. AI reflection integration
9. Time Capsule enforcement
10. Consistent API response DTOs
11. Consistent error responses
12. CORS
13. Database relationships
14. Transaction handling
15. Proper authorization

---

# 44. Recommended Memory API

Recommended final API:

POST /api/memories/user/{userId}

GET /api/memories/user/{userId}

GET /api/memories/user/{userId}/accessible

GET /api/memories/user/{userId}/time-capsules/locked

GET /api/memories/{id}

PUT /api/memories/{id}

DELETE /api/memories/{id}

POST /api/memories/user/{userId}/prompt/{promptId}

---

# 45. Recommended Media API

Recommended:

POST /api/memories/{memoryId}/media

GET /api/memories/{memoryId}/media

GET /api/memories/{memoryId}/media/{mediaId}

DELETE /api/memories/{memoryId}/media/{mediaId}

The exact endpoint names can remain as the existing backend contract if already implemented.

Do not create duplicate APIs unnecessarily.

---

# 46. Recommended Authentication API

POST /api/auth/register

POST /api/auth/login

GET /api/auth/me

POST /api/auth/logout

If /me or logout are not currently implemented, they can be added later.

The frontend should not fake these endpoints.

---

# 47. Microservice / Service Separation

EchoLife does not need to become multiple microservices immediately.

Start with a clean modular Spring Boot architecture:

Auth
Memory
Consent
Persona
Prompt
AI Safety
AI Reflection
Media

These can initially exist as modules/services inside the same Spring Boot application.

If the project later becomes true microservices, these domains can be separated into services such as:

echolife-auth-service
echolife-memory-service
echolife-media-service
echolife-ai-service
echolife-consent-service
echolife-notification-service

Do NOT split everything into microservices unnecessarily before the API contracts and domain boundaries are stable.

---

# 48. Recommended Future Architecture

Current:

Frontend
↓
Spring Boot Backend
↓
PostgreSQL

Future if required:

                    React Frontend
                          |
                     API Gateway
                          |
        ┌─────────────────┼─────────────────┐
        |                 |                 |
   Auth Service     Memory Service     AI Service
        |                 |                 |
        |             Media Service      AI Safety
        |                 |                 |
        └─────────────────┼─────────────────┘
                          |
                    PostgreSQL /
                    Object Storage

Microservices should only be introduced when there is a real requirement for independent deployment, scaling, ownership, or fault isolation.

---

# 49. Definition of Done

A backend feature is complete only when:

[ ] API implemented

[ ] DTO implemented

[ ] Service implemented

[ ] Repository implemented

[ ] Database persistence verified

[ ] Authorization verified

[ ] Swagger tested

[ ] Frontend API service connected

[ ] Frontend UI connected

[ ] Error handling implemented

[ ] Loading state handled

[ ] Success toast handled

[ ] Browser flow tested

[ ] Refresh tested

[ ] Unauthorized access tested

[ ] Different-user access tested

---

# 50. Final Rule

The frontend should be treated as the API consumer.

The backend should be treated as the source of truth.

Never:

Frontend → PostgreSQL

Always:

Frontend
↓
Axios
↓
REST API
↓
Controller
↓
Service
↓
Repository
↓
PostgreSQL

For AI:

Frontend
↓
Memory API
↓
Consent Check
↓
Safety Check
↓
AI Service
↓
Save Result
↓
Frontend

For authentication:

Frontend
↓
Login API
↓
AuthService
↓
UserRepository
↓
PostgreSQL
↓
JWT
↓
Frontend
↓
Protected API requests

For Memory:

Frontend
↓
MemoryContext
↓
MemoryService API
↓
MemoryController
↓
MemoryService
↓
MemoryRepository
↓
PostgreSQL

This README is the integration contract between the EchoLife frontend and backend teams.
