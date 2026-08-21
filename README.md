# TaskFlow - Octobrain

TaskFlow is a full-stack Kanban project-management application built for the Octobrain assessment. It provides JWT authentication, project pagination, task assignment, filtering, and drag-and-drop task status updates.

## Stack

- **Client:** Next.js App Router, React, TypeScript, Tailwind CSS, TanStack Query, dnd-kit
- **API:** Express 5, TypeScript, Zod, JWT, bcrypt, Helmet, CORS
- **Database:** PostgreSQL with Prisma ORM

## Architecture

```text
Next.js client (port 3000)
  └─ TanStack Query + Bearer JWT
       └─ Express REST API (port 3001)
            └─ Prisma ORM
                 └─ PostgreSQL
```

The Next.js pages and layout are Server Components by default. Interactive UI, browser storage, TanStack Query hooks, forms, filters, and drag-and-drop live in explicitly marked Client Components.

## Features

- Register and login with bcrypt-hashed passwords and JWT Bearer authentication
- Protected projects and Kanban board routes; an expired or invalid session is cleared and redirected to `/login`
- Create and paginate accessible projects (12 per page by default); project titles are unique per owner (enforced case-insensitively)
- Create, edit, assign, filter, search, and delete tasks; collaborators can update assigned task status via drag-and-drop
- Drag tasks between Todo, In Progress, and Done columns
- TanStack Query caching, mutation invalidation, optimistic task updates, and debounced task search
- Brand loading animations and shimmering skeleton screens for project cards and Kanban board
- Input validation, authorization checks, standard HTTP status codes, and central error handling

## Prerequisites

- Node.js 20 or later
- npm 9 or later
- A PostgreSQL database (Neon PostgreSQL is supported)

## Setup

### 1. Configure the server

From the repository root, copy the template and supply real database and JWT values:

```powershell
Copy-Item server/.env.example server/.env
```

Required values are documented in [`server/.env.example`](server/.env.example). Never commit `server/.env`.

Install server dependencies, generate Prisma Client, and use the current DB or synchronize a fresh development database:

```powershell
cd server
npm install
npx prisma generate
# Run only when connecting to a new, empty database - Here it's connected with neon DB, THe Database URL should be paste on it's filed with real credentials.
# The schema is already pushed there.


npx prisma db push
```

`db push` is only needed when setting up a new database. Do not run it against a database whose schema you are not authorized to change.

### 2. Configure the client

In a second terminal:

```powershell
Copy-Item client/.env.example client/.env.local
cd client
npm install
```

The default API URL is `http://localhost:3001`.

### 3. Optional demo data

With the server environment configured, run:

```powershell
cd server
npm run db:seed
```
Note: Use it only if you want to test with a new Database connection. Otherwise skip this step. 
The seed creates five demo users, 50 projects, and varied task counts. It is intended for a development database only.

### Demo login credentials

After running the seed, use any account below. All demo accounts use the same development-only password:

```text
TaskFlowDemo2026!
```

| Name | Email | Access |
| --- | --- | --- |
| Abid Rahman | `abid@taskflow.demo` | Project owner; sees all seeded projects and tasks |
| Nadia Islam | `nadia@taskflow.demo` | Collaborator; sees assigned projects and tasks |
| Tanvir Hasan | `tanvir@taskflow.demo` | Collaborator; sees assigned projects and tasks |
| Sadia Ahmed | `sadia@taskflow.demo` | Collaborator; sees assigned projects and tasks |
| Rafi Karim | `rafi@taskflow.demo` | Collaborator; sees assigned projects and tasks |

These credentials are generated only by `npm run db:seed`; do not use them in a production deployment.

### 4. Start the application

Run these commands in separate terminals:

```powershell
cd server
npm run dev
```

```powershell
cd client
npm run dev
```

Open `http://localhost:3000`.

## Verification

```powershell
cd server
npm run build

cd ../client
npm run lint
npm run build
```

## API

All responses use `{ "data": ... }` on success. Protected endpoints require:

```text
Authorization: Bearer <token>
```

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/health` | API health check |
| POST | `/api/auth/register` | Register a user and receive a token |
| POST | `/api/auth/login` | Log in and receive a token |
| GET | `/api/projects?page=1&limit=12` | List accessible projects with pagination |
| POST | `/api/projects` | Create a project |
| GET | `/api/projects/:id` | Get an accessible project |
| GET | `/api/projects/:id/tasks` | List project tasks; supports `search`, `status`, and `priority` |
| POST | `/api/projects/:id/tasks` | Create a task (project owner) |
| PATCH | `/api/tasks/:id` | Update a task (owner can update all fields; assignee can update status) |
| DELETE | `/api/tasks/:id` | Delete a task (project owner) |
| GET | `/api/users` | List users for task assignment |

See [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for request examples and error behavior, or import [TaskFlow_Postman_Collection.json](TaskFlow_Postman_Collection.json) into Postman.

## Project structure

```text
client/                  Next.js application
  app/                   Server Component routes
  components/            UI and interactive Client Components
  hooks/                 TanStack Query query/mutation hooks
  lib/api/               Central API client and endpoint modules
server/                  Express API
  prisma/                Prisma schema and development seed
  src/routes/            Route composition
  src/controllers/       HTTP layer
  src/services/          Business and authorization logic
  src/middleware/        JWT and error middleware
  src/validators/        Zod request validation
```

## Security and data integrity

- Prisma parameterizes database access and avoids raw SQL.
- Foreign keys model ownership, project-task relationships, and optional task assignees.
- Compound unique constraints and validation prevent duplicate project titles per owner.
- Indexed fields support project ownership and task project/status/priority/assignee lookups.
- `helmet`, CORS configuration, bcrypt password hashing, validation, and centralized error handling are enabled.
- `.env`, build output, dependency folders, logs, and TypeScript cache files are ignored by Git. Only safe `.env.example` templates are tracked.
