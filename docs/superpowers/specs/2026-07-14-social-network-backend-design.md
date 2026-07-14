# Social Network Backend Design Spec

## Overview

A Go API server for a social network with user authentication and text-based posts. The backend serves JSON APIs to a separate SPA frontend. SQLite is used for persistence with a migration system.

**Scope (initial version):**
- User registration, login, logout (sessions/cookies)
- Posts CRUD (create, read, update, delete)
- SQLite with golang-migrate
- Chi router, HTTP-only session cookies

**Out of scope (future phases):**
- Image handling (JPEG, PNG, GIF uploads)
- WebSocket private chat
- Followers, groups, notifications, likes

## Project Structure

```
social-network/
├── main.go
├── server.go
├── pkg/
│   ├── db/
│   │   ├── sqlite/
│   │   │   └── sqlite.go
│   │   └── migrations/
│   │       └── sqlite/
│   │           ├── 000001_create_users_table.up.sql
│   │           ├── 000001_create_users_table.down.sql
│   │           ├── 000002_create_posts_table.up.sql
│   │           └── 000002_create_posts_table.down.sql
│   ├── handlers/
│   │   ├── auth.go
│   │   └── posts.go
│   └── middleware/
│       └── middleware.go
├── go.mod
```

- `main.go`: Entry point, starts the HTTP server
- `server.go`: Wires up Chi routes, middleware, and dependency injection
- `pkg/db/sqlite/sqlite.go`: Database connection, migration runner
- `pkg/db/migrations/sqlite/`: SQL migration files
- `pkg/handlers/auth.go`: Registration, login, logout handlers
- `pkg/handlers/posts.go`: Post CRUD handlers
- `pkg/middleware/middleware.go`: CORS, logging, auth middleware

## Database Schema

### users table

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### posts table

```sql
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

## Authentication System

### Session Management

- Server-side session store: in-memory `map[string]Session` (swappable for Redis later)
- Session ID stored in an HTTP-only, Secure cookie named `session_id`
- Session struct contains: session ID, user ID, expiration time

### Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/register` | Create account | No |
| POST | `/api/login` | Authenticate, set session | No |
| POST | `/api/logout` | Destroy session | Yes |

### Registration (`POST /api/register`)

Request body:
```json
{
  "username": "string (required)",
  "email": "string (required)",
  "password": "string (required, min 6 chars)"
}
```

Validation:
- All fields required
- Email must contain `@`
- Password minimum 6 characters
- Username and email must be unique

Password hashed with bcrypt (default cost). Returns 201 on success.

### Login (`POST /api/login`)

Request body:
```json
{
  "email": "string (required)",
  "password": "string (required)"
}
```

Verifies password against bcrypt hash. Creates session, sets cookie. Returns 200 with user info (id, username, email).

### Logout (`POST /api/logout`)

Destroys session server-side, clears cookie. Returns 204.

## Posts API

### Endpoints

| Method | Path | Description | Auth Required |
|--------|------|-------------|---------------|
| POST | `/api/posts` | Create a post | Yes |
| GET | `/api/posts` | Get all posts | Yes |
| GET | `/api/posts/{id}` | Get single post | Yes |
| PUT | `/api/posts/{id}` | Update own post | Yes |
| DELETE | `/api/posts/{id}` | Delete own post | Yes |

### Create Post (`POST /api/posts`)

Request body:
```json
{
  "content": "string (required, non-empty)"
}
```

Returns 201 with the created post including `id`, `user_id`, `content`, `created_at`.

### Get All Posts (`GET /api/posts`)

Returns 200 with array of posts, each including author `username` (joined from users table). Ordered by `created_at` descending (newest first).

Response:
```json
[
  {
    "id": 1,
    "content": "Hello world",
    "username": "johndoe",
    "created_at": "2026-07-14T10:00:00Z"
  }
]
```

### Get Single Post (`GET /api/posts/{id}`)

Returns 200 with post including author username, or 404 if not found.

### Update Post (`PUT /api/posts/{id}`)

Request body:
```json
{
  "content": "string (required, non-empty)"
}
```

Only the post's author can update. Returns 200 with updated post, 403 if not owner, 404 if not found.

### Delete Post (`DELETE /api/posts/{id}`)

Only the post's author can delete. Returns 204 on success, 403 if not owner, 404 if not found.

## Error Handling

All errors returned as JSON:
```json
{"error": "Human-readable error message"}
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad request / validation error |
| 401 | Not authenticated |
| 403 | Not authorized (not owner) |
| 404 | Resource not found |
| 500 | Internal server error |

## Middleware

| Middleware | Purpose |
|------------|---------|
| `Logger` | Logs method, path, status code for each request |
| `CORS` | Allows cross-origin requests from SPA frontend |
| `RequireAuth` | Validates session cookie, injects user ID into request context |
| `ContentType` | Sets `Content-Type: application/json` on API responses |

CORS configuration: Allow all origins in development, configurable for production.

## Dependencies

| Package | Purpose |
|---------|---------|
| `github.com/go-chi/chi/v5` | HTTP router |
| `github.com/golang-migrate/migrate/v4` | Database migrations |
| `github.com/mattn/go-sqlite3` | SQLite driver |
| `golang.org/x/crypto` | bcrypt password hashing |

## Migration System

Migrations stored at `pkg/db/migrations/sqlite/`. Applied on server startup using `golang-migrate` with the `file://` protocol. The `sqlite.go` file handles connection setup and migration execution.

Migration file naming: `NNNNNN_description.up.sql` / `NNNNNN_description.down.sql`
