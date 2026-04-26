# 🛡️ Insurance Platform (MERN + Agentic AI + GenAI)

A full-stack insurance system with modular backend architecture, role-based access control, and AI-powered features including agent orchestration and multimodal content generation.

---

## Overview

This project combines a MERN-based insurance platform with advanced AI capabilities to handle both informational and transactional user workflows.

- Structured insurance modules (plans, policies, claims)
- Agentic AI for multi-step reasoning and response generation
- Multimodal GenAI for text + image outputs
- Intent-aware system for dynamic response handling

---

## Features

### Backend
- REST API with modular routing:
  - `/api/auth` → OTP-based authentication (Nodemailer)
  - `/api/plans` → plan management
  - `/api/policies` → policy handling
  - `/api/claims` → claims processing
  - `/api/testroutes` → testing routes
- Role-Based Access Control (RBAC) for admin and users
- Scalable and clean architecture (controllers, services, routes)

---

### Agentic AI
- Built using LangChain / CrewAI
- Multi-agent workflow:
  - **Researcher Agent** → fetches and analyzes insurance data
  - **Writer Agent** → structures and formats output
- Supports:
  - Agent hand-offs
  - Stateful execution
  - Structured responses

---

### GenAI (Multimodal)
- LLM + Image Generation integration
- Generates:
  - Explanations
  - Visual outputs (e.g., risk infographics)
- Designed for better understanding of insurance concepts

---

### Intent-Based Response System
- Detects user intent and adapts response:

| Intent | Output |
|-------|--------|
| Informational | Explanation + infographic |
| Transactional (e.g. "buy insurance") | Plan cards (title, coverage, buy link) |

---

## Tech Stack

### Core
- MongoDB  
- Express.js  
- React  
- Node.js  

### AI Layer
- Python (FastAPI)  
- LangChain / CrewAI  
- LLM APIs  
- Image Generation APIs  
- Vector Database  

### Infrastructure
- Docker  
- Kubernetes  
- GitHub Actions (CI/CD)

---

## Architecture (High Level)

Frontend (React)
↓
Backend (Node.js / Express)
↓
AI Service (Python / FastAPI)
↓
Databases (MongoDB + Vector DB)
↓
Infrastructure (Docker + Kubernetes)

---

## Auther
- Yash Shrivastava