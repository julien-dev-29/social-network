# Task 6 Report: Auth middleware (RequireAuth)

## What I Implemented

- Added `"context"` to imports in `pkg/middleware/middleware.go`
- Added `SessionValidator` interface with `Get(sessionID string) (int, bool)` method
- Added `RequireAuth(sv SessionValidator) func(http.Handler) http.Handler` middleware that:
  - Reads `session_id` cookie from request
  - Returns 401 JSON error if cookie missing/invalid
  - Returns 401 JSON error if session invalid/expired
  - Injects user ID into request context with key `"userID"` on success

## What I Tested

- `go build ./pkg/middleware/` — compiles with no errors

## Files Changed

- `pkg/middleware/middleware.go` — added context import, SessionValidator interface, RequireAuth function

## Commits

- `ea701a2` — `feat: add RequireAuth middleware with SessionValidator interface`

## Self-Review Findings

- None. Implementation matches the task brief exactly.
- Minor note: `context.WithValue` uses a bare string key (`"userID"`), which is acceptable per the brief but not ideal practice for production code (typed keys preferred). This is intentional per task spec.
