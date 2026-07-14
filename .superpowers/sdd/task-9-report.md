### Task 9 Report: Server wiring and routes

**Status:** DONE_WITH_CONCERNS

**What was implemented:**
- Created `server.go` at project root with `NewServer(db *sql.DB, sessionStore *handlers.SessionStore) *chi.Mux`
- Wires up global middleware: Logger, CORS, ContentType
- Public routes under `/api`: `/register`, `/login`, `/logout`
- Protected routes (RequireAuth): `/posts` CRUD (POST, GET, GET/{id}, PUT/{id}, DELETE/{id})

**What was tested:**
- `go vet ./...` — passes with no output (clean)
- `go build .` — fails with "function main is undeclared in the main package"

**Test results:**
- `go vet`: PASS
- `go build .`: FAIL (expected — no `main()` exists yet)

**Self-review findings:**
- The file content matches the task brief exactly
- The `go build .` failure is expected: the brief defines only `NewServer` with no `main()` entry point. A later task or manual addition of `main.go` will be needed for the binary to compile
- `go vet ./...` confirms all code in the package is syntactically and structurally valid
- No logic or wiring errors detected

**Files changed:**
- `server.go` (created)
