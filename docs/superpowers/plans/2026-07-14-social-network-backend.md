# Social Network Backend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Go API server with user authentication (sessions/cookies) and text post CRUD, backed by SQLite with a migration system.

**Architecture:** Chi router serving JSON APIs. In-memory session store with HTTP-only cookies. SQLite database with golang-migrate for schema management. Each domain (auth, posts) gets its own handler package.

**Tech Stack:** Go, Chi router (`github.com/go-chi/chi/v5`), SQLite (`github.com/mattn/go-sqlite3`), golang-migrate (`github.com/golang-migrate/migrate/v4`), bcrypt (`golang.org/x/crypto`)

## Global Constraints

- Go modules with `go.mod`
- SQLite database file stored at `social-network.db` (project root)
- Migrations applied on server startup from `file://pkg/db/migrations/sqlite`
- Sessions stored in-memory (map), session cookie named `session_id`, HTTP-only, Secure
- Password hashing: bcrypt with default cost
- All API responses are JSON with `Content-Type: application/json`
- Error format: `{"error": "message"}`

---

## File Structure

| File | Responsibility |
|------|---------------|
| `go.mod` | Module definition, dependencies |
| `main.go` | Entry point, starts server on `:8080` |
| `server.go` | Route definitions, middleware wiring, handler registration |
| `pkg/db/sqlite/sqlite.go` | DB connection, migration runner, DB handle |
| `pkg/db/migrations/sqlite/000001_create_users_table.up.sql` | Create users table |
| `pkg/db/migrations/sqlite/000001_create_users_table.down.sql` | Drop users table |
| `pkg/db/migrations/sqlite/000002_create_posts_table.up.sql` | Create posts table |
| `pkg/db/migrations/sqlite/000002_create_posts_table.down.sql` | Drop posts table |
| `pkg/middleware/middleware.go` | Logger, CORS, ContentType, RequireAuth |
| `pkg/handlers/auth.go` | Register, Login, Logout handlers |
| `pkg/handlers/posts.go` | Post CRUD handlers |

---

### Task 1: Project scaffolding and Go module initialization

**Files:**
- Create: `go.mod`

- [ ] **Step 1: Initialize Go module**

Run from project root:
```bash
go mod init social-network
```

Expected: Creates `go.mod` with module name `social-network` and Go version.

- [ ] **Step 2: Install dependencies**

Run:
```bash
go get github.com/go-chi/chi/v5
go get github.com/mattn/go-sqlite3
go get github.com/golang-migrate/migrate/v4
go get github.com/golang-migrate/migrate/v4/database/sqlite
go get github.com/golang-migrate/migrate/v4/source/file
go get golang.org/x/crypto
```

- [ ] **Step 3: Verify module setup**

Run:
```bash
go list -m all
```

Expected: All dependencies listed without errors.

- [ ] **Step 4: Create directory structure**

```bash
mkdir -p pkg/db/sqlite
mkdir -p pkg/db/migrations/sqlite
mkdir -p pkg/handlers
mkdir -p pkg/middleware
```

- [ ] **Step 5: Commit**

```bash
git init
git add go.mod go.sum
git commit -m "chore: initialize go module with dependencies"
```

---

### Task 2: Database connection and migration runner

**Files:**
- Create: `pkg/db/sqlite/sqlite.go`

**Interfaces:**
- Produces: `func Connect(dbPath string) (*sql.DB, error)` — opens SQLite connection
- Produces: `func RunMigrations(db *sql.DB, migrationsPath string) error` — applies pending migrations

- [ ] **Step 1: Write sqlite.go with Connect function**

```go
package sqlite

import (
	"database/sql"
	"fmt"

	_ "github.com/mattn/go-sqlite3"
	"github.com/golang-migrate/migrate/v4"
	"github.com/golang-migrate/migrate/v4/database/sqlite"
	_ "github.com/golang-migrate/migrate/v4/source/file"
)

func Connect(dbPath string) (*sql.DB, error) {
	db, err := sql.Open("sqlite3", dbPath)
	if err != nil {
		return nil, fmt.Errorf("failed to open database: %w", err)
	}

	if err := db.Ping(); err != nil {
		return nil, fmt.Errorf("failed to ping database: %w", err)
	}

	db.SetMaxOpenConns(1)

	return db, nil
}

func RunMigrations(db *sql.DB, migrationsPath string) error {
	driver, err := sqlite.WithInstance(db, &sqlite.Config{})
	if err != nil {
		return fmt.Errorf("failed to create migration driver: %w", err)
	}

	m, err := migrate.NewWithDatabaseInstance(
		migrationsPath,
		"sqlite",
		driver,
	)
	if err != nil {
		return fmt.Errorf("failed to create migrate instance: %w", err)
	}

	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		return fmt.Errorf("failed to run migrations: %w", err)
	}

	return nil
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build ./pkg/db/sqlite/
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add pkg/db/sqlite/sqlite.go
git commit -m "feat: add SQLite connection and migration runner"
```

---

### Task 3: Migration files

**Files:**
- Create: `pkg/db/migrations/sqlite/000001_create_users_table.up.sql`
- Create: `pkg/db/migrations/sqlite/000001_create_users_table.down.sql`
- Create: `pkg/db/migrations/sqlite/000002_create_posts_table.up.sql`
- Create: `pkg/db/migrations/sqlite/000002_create_posts_table.down.sql`

- [ ] **Step 1: Create users table migration (up)**

```sql
CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

Save to: `pkg/db/migrations/sqlite/000001_create_users_table.up.sql`

- [ ] **Step 2: Create users table migration (down)**

```sql
DROP TABLE IF EXISTS users;
```

Save to: `pkg/db/migrations/sqlite/000001_create_users_table.down.sql`

- [ ] **Step 3: Create posts table migration (up)**

```sql
CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

Save to: `pkg/db/migrations/sqlite/000002_create_posts_table.up.sql`

- [ ] **Step 4: Create posts table migration (down)**

```sql
DROP TABLE IF EXISTS posts;
```

Save to: `pkg/db/migrations/sqlite/000002_create_posts_table.down.sql`

- [ ] **Step 5: Commit**

```bash
git add pkg/db/migrations/
git commit -m "feat: add users and posts migration files"
```

---

### Task 4: Middleware

**Files:**
- Create: `pkg/middleware/middleware.go`

**Interfaces:**
- Produces: `func Logger(next http.Handler) http.Handler`
- Produces: `func CORS(next http.Handler) http.Handler`
- Produces: `func ContentType(next http.Handler) http.Handler`
- Produces: `func RequireAuth(sessionStore *handlers.SessionStore) func(http.Handler) http.Handler`

Note: RequireAuth depends on the session store from Task 5. We'll define the interface here and finalize the import in Task 7 when we wire everything together.

- [ ] **Step 1: Write middleware.go**

```go
package middleware

import (
	"log"
	"net/http"
	"strings"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func CORS(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func ContentType(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if strings.HasPrefix(r.URL.Path, "/api/") {
			w.Header().Set("Content-Type", "application/json")
		}
		next.ServeHTTP(w, r)
	})
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build ./pkg/middleware/
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add pkg/middleware/middleware.go
git commit -m "feat: add Logger, CORS, and ContentType middleware"
```

---

### Task 5: Session management

**Files:**
- Create: `pkg/handlers/session.go`

**Interfaces:**
- Produces: `type SessionStore struct` — in-memory session store
- Produces: `func NewSessionStore() *SessionStore`
- Produces: `func (s *SessionStore) Create(userID int) (string, error)` — returns session ID
- Produces: `func (s *SessionStore) Get(sessionID string) (int, bool)` — returns user ID and validity
- Produces: `func (s *SessionStore) Delete(sessionID string)`

- [ ] **Step 1: Write session.go**

```go
package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"
)

type session struct {
	userID    int
	expiresAt time.Time
}

type SessionStore struct {
	mu       sync.RWMutex
	sessions map[string]session
}

func NewSessionStore() *SessionStore {
	return &SessionStore{
		sessions: make(map[string]session),
	}
}

func (s *SessionStore) Create(userID int) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	id := hex.EncodeToString(b)

	s.mu.Lock()
	s.sessions[id] = session{
		userID:    userID,
		expiresAt: time.Now().Add(24 * time.Hour),
	}
	s.mu.Unlock()

	return id, nil
}

func (s *SessionStore) Get(sessionID string) (int, bool) {
	s.mu.RLock()
	sess, ok := s.sessions[sessionID]
	s.mu.RUnlock()

	if !ok || time.Now().After(sess.expiresAt) {
		return 0, false
	}

	return sess.userID, true
}

func (s *SessionStore) Delete(sessionID string) {
	s.mu.Lock()
	delete(s.sessions, sessionID)
	s.mu.Unlock()
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build ./pkg/handlers/
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add pkg/handlers/session.go
git commit -m "feat: add in-memory session store"
```

---

### Task 6: Auth middleware (RequireAuth)

**Files:**
- Modify: `pkg/middleware/middleware.go`

**Interfaces:**
- Consumes: session store interface ( userID int) (int, bool)` for Get, `Delete(sessionID string)` for Delete)

We define a minimal interface in the middleware package to avoid circular imports.

- [ ] **Step 1: Add SessionValidator interface and RequireAuth to middleware.go**

Add to the bottom of `pkg/middleware/middleware.go`:

```go
// SessionValidator is the interface RequireAuth needs from the session store.
type SessionValidator interface {
	Get(sessionID string) (int, bool)
}

func RequireAuth(sv SessionValidator) func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			cookie, err := r.Cookie("session_id")
			if err != nil {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(`{"error":"not authenticated"}`))
				return
			}

			userID, ok := sv.Get(cookie.Value)
			if !ok {
				w.Header().Set("Content-Type", "application/json")
				w.WriteHeader(http.StatusUnauthorized)
				w.Write([]byte(`{"error":"invalid or expired session"}`))
				return
			}

			ctx := r.Context()
			ctx = context.WithValue(ctx, "userID", userID)
			next.ServeHTTP(w, r.WithContext(ctx))
		})
	}
}
```

Also add this import at the top of the file:

```go
import (
	"context"
	"log"
	"net/http"
	"strings"
)
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build ./pkg/middleware/
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add pkg/middleware/middleware.go
git commit -m "feat: add RequireAuth middleware with SessionValidator interface"
```

---

### Task 7: Auth handlers (Register, Login, Logout)

**Files:**
- Create: `pkg/handlers/auth.go`

**Interfaces:**
- Consumes: `*SessionStore` from Task 5
- Consumes: `*sql.DB` from Task 2
- Produces: `func Register(db *sql.DB, sessionStore *SessionStore) http.HandlerFunc`
- Produces: `func Login(db *sql.DB, sessionStore *SessionStore) http.HandlerFunc`
- Produces: `func Logout(sessionStore *SessionStore) http.HandlerFunc`

- [ ] **Step 1: Write auth.go**

```go
package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strings"

	"golang.org/x/crypto/bcrypt"
)

type RegisterRequest struct {
	Username string `json:"username"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type UserResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Email    string `json:"email"`
}

func writeError(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	w.Write([]byte(`{"error":"` + msg + `"}`))
}

func Register(db *sql.DB, sessionStore *SessionStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req RegisterRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		req.Username = strings.TrimSpace(req.Username)
		req.Email = strings.TrimSpace(req.Email)

		if req.Username == "" || req.Email == "" || req.Password == "" {
			writeError(w, http.StatusBadRequest, "username, email, and password are required")
			return
		}

		if !strings.Contains(req.Email, "@") {
			writeError(w, http.StatusBadRequest, "invalid email format")
			return
		}

		if len(req.Password) < 6 {
			writeError(w, http.StatusBadRequest, "password must be at least 6 characters")
			return
		}

		hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to hash password")
			return
		}

		result, err := db.Exec(
			"INSERT INTO users (username, email, password_hash) VALUES (?, ?, ?)",
			req.Username, req.Email, string(hash),
		)
		if err != nil {
			if strings.Contains(err.Error(), "UNIQUE constraint") {
				writeError(w, http.StatusBadRequest, "username or email already exists")
				return
			}
			writeError(w, http.StatusInternalServerError, "failed to create user")
			return
		}

		userID, _ := result.LastInsertId()

		sessionID, err := sessionStore.Create(int(userID))
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to create session")
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    sessionID,
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			MaxAge:   86400,
		})

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(UserResponse{
			ID:       int(userID),
			Username: req.Username,
			Email:    req.Email,
		})
	}
}

func Login(db *sql.DB, sessionStore *SessionStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req LoginRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		req.Email = strings.TrimSpace(req.Email)

		if req.Email == "" || req.Password == "" {
			writeError(w, http.StatusBadRequest, "email and password are required")
			return
		}

		var user struct {
			ID           int
			PasswordHash string
			Username     string
		}

		err := db.QueryRow(
			"SELECT id, password_hash, username FROM users WHERE email = ?",
			req.Email,
		).Scan(&user.ID, &user.PasswordHash, &user.Username)

		if err == sql.ErrNoRows {
			writeError(w, http.StatusUnauthorized, "invalid email or password")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "database error")
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
			writeError(w, http.StatusUnauthorized, "invalid email or password")
			return
		}

		sessionID, err := sessionStore.Create(user.ID)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to create session")
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    sessionID,
			Path:     "/",
			HttpOnly: true,
			Secure:   true,
			MaxAge:   86400,
		})

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(UserResponse{
			ID:       user.ID,
			Username: user.Username,
			Email:    req.Email,
		})
	}
}

func Logout(sessionStore *SessionStore) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("session_id")
		if err == nil {
			sessionStore.Delete(cookie.Value)
		}

		http.SetCookie(w, &http.Cookie{
			Name:     "session_id",
			Value:    "",
			Path:     "/",
			HttpOnly: true,
			MaxAge:   -1,
		})

		w.WriteHeader(http.StatusNoContent)
	}
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build ./pkg/handlers/
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add pkg/handlers/auth.go
git commit -m "feat: add Register, Login, Logout handlers with bcrypt and sessions"
```

---

### Task 8: Post handlers (CRUD)

**Files:**
- Create: `pkg/handlers/posts.go`

**Interfaces:**
- Consumes: `*sql.DB` from Task 2
- Consumes: `userID int` from request context (set by RequireAuth)
- Produces: `func CreatePost(db *sql.DB) http.HandlerFunc`
- Produces: `func GetPosts(db *sql.DB) http.HandlerFunc`
- Produces: `func GetPost(db *sql.DB) http.HandlerFunc`
- Produces: `func UpdatePost(db *sql.DB) http.HandlerFunc`
- Produces: `func DeletePost(db *sql.DB) http.HandlerFunc`

- [ ] **Step 1: Write posts.go**

```go
package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
)

type CreatePostRequest struct {
	Content string `json:"content"`
}

type PostResponse struct {
	ID        int    `json:"id"`
	Content   string `json:"content"`
	Username  string `json:"username"`
	CreatedAt string `json:"created_at"`
}

func getUserID(r *http.Request) int {
	userID, _ := r.Context().Value("userID").(int)
	return userID
}

func CreatePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		req.Content = sql.NullString{String: req.Content, Valid: true}.String
		if req.Content == "" {
			writeError(w, http.StatusBadRequest, "content is required")
			return
		}

		userID := getUserID(r)

		result, err := db.Exec(
			"INSERT INTO posts (user_id, content) VALUES (?, ?)",
			userID, req.Content,
		)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to create post")
			return
		}

		postID, _ := result.LastInsertId()

		var post PostResponse
		err = db.QueryRow(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 WHERE p.id = ?`, postID,
		).Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch post")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(post)
	}
}

func GetPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 ORDER BY p.created_at DESC`,
		)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch posts")
			return
		}
		defer rows.Close()

		posts := []PostResponse{}
		for rows.Next() {
			var post PostResponse
			if err := rows.Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to scan post")
				return
			}
			posts = append(posts, post)
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}
}

func GetPost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		var post PostResponse
		err = db.QueryRow(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 WHERE p.id = ?`, id,
		).Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt)

		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch post")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
	}
}

func UpdatePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		if req.Content == "" {
			writeError(w, http.StatusBadRequest, "content is required")
			return
		}

		userID := getUserID(r)

		var ownerID int
		err = db.QueryRow("SELECT user_id FROM posts WHERE id = ?", id).Scan(&ownerID)
		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "database error")
			return
		}

		if ownerID != userID {
			writeError(w, http.StatusForbidden, "you can only update your own posts")
			return
		}

		_, err = db.Exec("UPDATE posts SET content = ? WHERE id = ?", req.Content, id)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to update post")
			return
		}

		var post PostResponse
		err = db.QueryRow(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 WHERE p.id = ?`, id,
		).Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch updated post")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
	}
}

func DeletePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		userID := getUserID(r)

		var ownerID int
		err = db.QueryRow("SELECT user_id FROM posts WHERE id = ?", id).Scan(&ownerID)
		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "database error")
			return
		}

		if ownerID != userID {
			writeError(w, http.StatusForbidden, "you can only delete your own posts")
			return
		}

		_, err = db.Exec("DELETE FROM posts WHERE id = ?", id)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to delete post")
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build ./pkg/handlers/
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add pkg/handlers/posts.go
git commit -m "feat: add Post CRUD handlers with ownership enforcement"
```

---

### Task 9: Server wiring and routes

**Files:**
- Create: `server.go`

**Interfaces:**
- Consumes: `*sql.DB` from Task 2
- Consumes: `*SessionStore` from Task 5
- Consumes: all handlers from Tasks 7 and 8
- Consumes: all middleware from Tasks 4 and 6
- Produces: `func NewServer(db *sql.DB, sessionStore *SessionStore) *chi.Mux`

- [ ] **Step 1: Write server.go**

```go
package main

import (
	"database/sql"

	"github.com/go-chi/chi/v5"

	"social-network/pkg/handlers"
	"social-network/pkg/middleware"
)

func NewServer(db *sql.DB, sessionStore *handlers.SessionStore) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.CORS)
	r.Use(middleware.ContentType)

	r.Route("/api", func(r chi.Router) {
		r.Post("/register", handlers.Register(db, sessionStore))
		r.Post("/login", handlers.Login(db, sessionStore))
		r.Post("/logout", handlers.Logout(sessionStore))

		r.Group(func(r chi.Router) {
			r.Use(middleware.RequireAuth(sessionStore))

			r.Post("/posts", handlers.CreatePost(db))
			r.Get("/posts", handlers.GetPosts(db))
			r.Get("/posts/{id}", handlers.GetPost(db))
			r.Put("/posts/{id}", handlers.UpdatePost(db))
			r.Delete("/posts/{id}", handlers.DeletePost(db))
		})
	})

	return r
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build .
```

Expected: No errors.

- [ ] **Step 3: Commit**

```bash
git add server.go
git commit -m "feat: wire up Chi routes with auth and post handlers"
```

---

### Task 10: Main entry point

**Files:**
- Create: `main.go`

**Interfaces:**
- Consumes: `NewServer()` from Task 9
- Consumes: `sqlite.Connect()` and `sqlite.RunMigrations()` from Task 2

- [ ] **Step 1: Write main.go**

```go
package main

import (
	"fmt"
	"log"
	"net/http"

	"social-network/pkg/db/sqlite"
	"social-network/pkg/handlers"
)

func main() {
	db, err := sqlite.Connect("social-network.db")
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := sqlite.RunMigrations(db, "file://pkg/db/migrations/sqlite"); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	sessionStore := handlers.NewSessionStore()
	r := NewServer(db, sessionStore)

	addr := ":8080"
	fmt.Printf("Server running on %s\n", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
```

- [ ] **Step 2: Verify it compiles**

Run:
```bash
go build -o social-network.exe .
```

Expected: Binary `social-network.exe` created without errors.

- [ ] **Step 3: Commit**

```bash
git add main.go
git commit -m "feat: add main entry point with DB init and server start"
```

---

### Task 11: Integration test — full server smoke test

**Files:**
- Create: `main_test.go`

**Interfaces:**
- Consumes: `NewServer()` from Task 9
- Consumes: `sqlite.Connect()` and `sqlite.RunMigrations()` from Task 2

- [ ] **Step 1: Write main_test.go**

```go
package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"social-network/pkg/db/sqlite"
	"social-network/pkg/handlers"
)

func setupTestServer(t *testing.T) *httptest.Server {
	t.Helper()

	db, err := sqlite.Connect(":memory:")
	if err != nil {
		t.Fatalf("failed to connect to test db: %v", err)
	}

	if err := sqlite.RunMigrations(db, "file://pkg/db/migrations/sqlite"); err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	sessionStore := handlers.NewSessionStore()
	r := NewServer(db, sessionStore)

	return httptest.NewServer(r)
}

func TestRegisterAndLogin(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	regBody, _ := json.Marshal(map[string]string{
		"username": "testuser",
		"email":    "test@example.com",
		"password": "password123",
	})

	resp, err := http.Post(ts.URL+"/api/register", "application/json", bytes.NewReader(regBody))
	if err != nil {
		t.Fatalf("register request failed: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}

	var user handlers.UserResponse
	json.NewDecoder(resp.Body).Decode(&user)
	resp.Body.Close()

	if user.Username != "testuser" {
		t.Fatalf("expected username testuser, got %s", user.Username)
	}

	loginBody, _ := json.Marshal(map[string]string{
		"email":    "test@example.com",
		"password": "password123",
	})

	resp, err = http.Post(ts.URL+"/api/login", "application/json", bytes.NewReader(loginBody))
	if err != nil {
		t.Fatalf("login request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	cookies := resp.Cookies()
	if len(cookies) == 0 {
		t.Fatal("expected session cookie")
	}

	var sessionCookie *http.Cookie
	for _, c := range cookies {
		if c.Name == "session_id" {
			sessionCookie = c
			break
		}
	}
	if sessionCookie == nil {
		t.Fatal("session_id cookie not found")
	}

	resp.Body.Close()

	postBody, _ := json.Marshal(map[string]string{
		"content": "Hello from test",
	})

	req, _ := http.NewRequest("POST", ts.URL+"/api/posts", bytes.NewReader(postBody))
	req.Header.Set("Content-Type", "application/json")
	req.AddCookie(sessionCookie)

	client := &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("create post request failed: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	resp, err = http.Get(ts.URL + "/api/posts")
	if err != nil {
		t.Fatalf("get posts request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var posts []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&posts)
	resp.Body.Close()

	if len(posts) != 1 {
		t.Fatalf("expected 1 post, got %d", len(posts))
	}
}

func TestUnauthorizedAccess(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/api/posts")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
```

- [ ] **Step 2: Run tests**

Run:
```bash
go test -v -count=1 .
```

Expected: Both tests PASS.

- [ ] **Step 3: Commit**

```bash
git add main_test.go
git commit -m "test: add integration smoke tests for auth and posts"
```

---

### Task 12: Final verification and cleanup

- [ ] **Step 1: Run all tests**

Run:
```bash
go test -v -count=1 ./...
```

Expected: All tests PASS.

- [ ] **Step 2: Run build**

Run:
```bash
go build -o social-network.exe .
```

Expected: Binary created without errors.

- [ ] **Step 3: Verify go vet passes**

Run:
```bash
go vet ./...
```

Expected: No issues.

- [ ] **Step 4: Commit if needed**

```bash
git add -A
git status
```

If there are uncommitted changes:
```bash
git commit -m "chore: final cleanup and verification"
```
