# EchoLife Frontend

EchoLife is a digital memory and legacy platform that allows users to preserve meaningful memories, organize personal experiences, and build a lasting digital legacy.

This repository contains the **EchoLife frontend application**, built with React and TypeScript.

The frontend communicates with the EchoLife backend through REST APIs.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Configuration](#environment-configuration)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [Backend Integration](#backend-integration)
- [Authentication](#authentication)
- [Memory Integration](#memory-integration)
- [Memory Media Integration](#memory-media-integration)
- [Time Capsule Integration](#time-capsule-integration)
- [Other Backend APIs](#other-backend-apis)
- [API Configuration](#api-configuration)
- [Development Workflow](#development-workflow)
- [Git Workflow](#git-workflow)
- [Build Verification](#build-verification)
- [Troubleshooting](#troubleshooting)
- [Current Integration Status](#current-integration-status)
- [Important Development Notes](#important-development-notes)

---

# Project Overview

EchoLife provides a frontend experience for preserving and managing personal memories and legacy-related information.

The frontend currently contains UI and application structure for:

- Authentication
- Registration
- Login
- Onboarding
- Dashboard
- Memory Vault
- Memory creation
- Memory details
- Memory media
- Time Capsules
- Family
- Legacy Contacts
- Persona / AI
- Profile
- Settings

The backend is maintained separately and exposes REST APIs used by the frontend.

---

# Technology Stack

## Frontend

- React
- TypeScript
- Vite
- React Router
- Axios
- CSS
- HTML

## API Communication

- REST APIs
- Axios
- JSON
- `multipart/form-data` for file uploads

## Development Tools

- Node.js
- npm
- Git
- GitHub
- Swagger / OpenAPI for backend API verification

---

# Prerequisites

Before running the project, install:

- Node.js
- npm
- Git

Verify the installations:

```bash
node --version
npm --version
git --version


Clone the Repository
git clone https://github.com/mohammedansar-dev/echolife-frontend.git

Navigate to the project:

cd echolife-frontend
Install Dependencies

Run:

npm install
npm run dev
