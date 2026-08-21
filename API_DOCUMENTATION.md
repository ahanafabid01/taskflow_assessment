# TaskFlow API Documentation

Base URL in local development: `http://localhost:3001`

Successful API responses return a `data` property. Errors return a consistent shape:

```json
{ "error": { "message": "Human-readable explanation" } }
```

## Authentication

### `POST /api/auth/register`

Creates a user, hashes the password, and returns a JWT.

```json
{
  "name": "Ada Lovelace",
  "email": "ada@example.com",
  "password": "at-least-eight-characters"
}
```

Returns `201 Created`. A duplicate email returns `409 Conflict`; invalid input returns `400 Bad Request`.

### `POST /api/auth/login`

```json
{
  "email": "ada@example.com",
  "password": "at-least-eight-characters"
}
```

Returns `200 OK` with:

```json
{
  "data": {
    "token": "<jwt>",
    "user": { "id": "<uuid>", "name": "Ada Lovelace", "email": "ada@example.com" }
  }
}
```

Invalid credentials return `401 Unauthorized` without revealing which credential failed.

## Authorization

All endpoints below require this header:

```text
Authorization: Bearer <token>
```

Missing, malformed, expired, or invalid tokens return `401 Unauthorized`.

## Projects

### `GET /api/projects?page=1&limit=12`

Returns projects owned by the current user or containing a task assigned to them. `page` starts at 1; `limit` defaults to 12 and accepts 1 through 24.

```json
{
  "data": {
    "projects": [],
    "pagination": { "page": 1, "limit": 12, "total": 0, "totalPages": 1 }
  }
}
```

### `POST /api/projects`

```json
{
  "title": "Website redesign",
  "description": "Optional project description"
}
```

Returns `201 Created`. `title` is required and may be at most 255 characters.

### `GET /api/projects/:id`

Returns an accessible project with its owner and task count. A nonexistent project returns `404`; a project the user cannot access returns `403`.

## Tasks

### `GET /api/projects/:id/tasks`

Returns tasks for an accessible project. Project owners receive every task; collaborators receive only tasks assigned to their account. Query parameters are optional:

- `search`: case-insensitive task-title search
- `status`: `TODO`, `IN_PROGRESS`, or `DONE`
- `priority`: `LOW`, `MEDIUM`, or `HIGH`

### `POST /api/projects/:id/tasks`

Only the project owner can create tasks. Example body:

```json
{
  "title": "Design the dashboard",
  "description": "Prepare the first design pass",
  "status": "TODO",
  "priority": "HIGH",
  "assigned_to": "<user-uuid>",
  "due_date": "2026-09-01T00:00:00.000Z"
}
```

`status` defaults to `TODO`, `priority` defaults to `MEDIUM`, and `assigned_to` / `due_date` may be `null`.

### `PATCH /api/tasks/:id`

The project owner or assigned user can update a task. Submit at least one field from the create-task body. For example:

```json
{ "status": "IN_PROGRESS", "priority": "MEDIUM" }
```

### `DELETE /api/tasks/:id`

Only the project owner can delete a task. Returns `204 No Content`.

## Users

### `GET /api/users`

Returns users with `id`, `name`, and `email` for the task-assignee picker.

## Status codes

| Status | Meaning |
| --- | --- |
| 200 | Successful read, login, or update |
| 201 | Resource created |
| 204 | Resource deleted |
| 400 | Validation or malformed request error |
| 401 | Missing, invalid, or expired authentication token |
| 403 | Authenticated user lacks permission |
| 404 | Route or resource not found |
| 409 | Duplicate registration email |
| 500 | Unexpected server error (implementation details are not exposed) |
