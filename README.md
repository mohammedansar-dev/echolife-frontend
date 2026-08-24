# EchoLife Frontend

EchoLife is a modern digital memory platform that allows users to securely create, preserve, organize, and revisit meaningful memories with support for AI reflection, family sharing, and time capsules.

The frontend is built with React + TypeScript and is designed to integrate with the EchoLife Spring Boot backend and PostgreSQL database.

---

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Axios
- Tailwind CSS
- Lucide React
- Spring Boot Backend
- PostgreSQL
- Swagger / OpenAPI

---

## Frontend Structure

```text
src/
│
├── api/
│   └── axios.ts
│
├── features/
│   ├── auth/
│   │   ├── AuthContext.tsx
│   │   ├── auth.api.ts
│   │   ├── auth.types.ts
│   │   └── pages/
│   │
│   ├── dashboard/
│   │
│   ├── vault/
│   │   ├── MemoryAPI.ts
│   │   ├── MemoryContext.tsx
│   │   ├── memory.types.ts
│   │   ├── components/
│   │   ├── data/
│   │   └── pages/
│   │       ├── MemoryVaultPage.tsx
│   │       ├── UploadMemoryPage.tsx
│   │       └── MemoryDetailsPage.tsx
│   │
│   ├── family/
│   ├── persona/
│   ├── sessions/
│   ├── reports/
│   ├── billing/
│   ├── daily-prompt/
│   ├── ai-reflection/
│   ├── legacy/
│   ├── onboarding/
│   ├── profile/
│   └── settings/
│
├── services/
│   ├── memoryService.ts
│   └── memoryMediaService.ts
│
├── App.tsx
└── main.tsx
