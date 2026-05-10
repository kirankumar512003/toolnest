# ToolNest

A cozy nest of developer tools: JSONify, diff editor, Cipher Lab, MarkSmith, Time Forge, Blank Space, and Drawboard. Everything runs locally; no login required.

## Structure

```
ToolNest/
├── backend/          # Spring Boot (Java 21, Maven)
│   └── src/main/java/com/toolnest/
│       ├── ToolNestApplication.java
│       ├── config/
│       ├── controller/
│       ├── service/
│       └── utils/
├── frontend/         # Next.js (React, TypeScript, TailwindCSS)
│   ├── components/
│   ├── pages/
│   ├── tools/
│   ├── utils/
│   └── styles/
└── README.md
```

## Backend (Spring Boot)

- **Java 21**, **Maven**, **Spring Boot 3.2**
- REST API under `/api` (e.g. `/api/tools/list`, `/api/tools/health`)
- CORS enabled for `http://localhost:3000`

### Run

```bash
cd backend
mvn spring-boot:run
```

(Or use `./mvnw spring-boot:run` if you add the Maven wrapper.)

API base: **http://localhost:8080/api**

## Frontend (Next.js)

- **Next.js 14**, **React 18**, **TypeScript**, **TailwindCSS**
- Pages Router; tool pages under `pages/tools/`
- Next.js rewrites proxy `/api/*` to the backend
- Dark theme with warm amber accent

### Run

```bash
cd frontend
npm install
npm run dev
```

App: **http://localhost:3000**

## Design

- **No login** – all tools are anonymous and local.
- **Frontend-first** – tools run in the browser.
- **Backend** – used for advanced utilities and future AI features; optional for basic use.

Start both backend and frontend, then open http://localhost:3000 to use ToolNest.
