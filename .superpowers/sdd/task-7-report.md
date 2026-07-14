# Task 7 Report: Auth Handlers (Register, Login, Logout)

## What I Implemented

Created `pkg/handlers/auth.go` with:

- **Request/response types**: `RegisterRequest`, `LoginRequest`, `UserResponse`
- **`writeError`**: Shared JSON error helper (reused by Task 8)
- **`Register`**: Validates input, hashes password with bcrypt, inserts user, creates session, sets cookie, returns 201
- **`Login`**: Looks up user by email, verifies bcrypt hash, creates session, sets cookie, returns user JSON
- **`Logout`**: Reads session cookie, deletes session from store, clears cookie with MaxAge=-1, returns 204

## What I Tested and Test Results

- `go build ./pkg/handlers/` — compiled with no errors
- No unit tests (not required by brief)

## Files Changed

- Created: `pkg/handlers/auth.go` (188 lines)

## Self-Review Findings

- All code matches the brief exactly
- Uses existing `SessionStore` and `session.go` types correctly
- `writeError` is defined here for shared use by other handlers
