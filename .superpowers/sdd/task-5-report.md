## Task 5: Session Management

**What I implemented:**
- Created `pkg/handlers/session.go` with thread-safe in-memory session store
- `SessionStore` struct with `sync.RWMutex` and `map[string]session`
- `NewSessionStore()` constructor
- `Create(userID int) (string, error)` — generates 32-byte crypto random hex ID, stores with 24h expiry
- `Get(sessionID string) (int, bool)` — returns user ID if session exists and not expired
- `Delete(sessionID string)` — removes session from store

**What I tested:**
- `go build ./pkg/handlers/` — compiled without errors

**Files changed:**
- Created: `pkg/handlers/session.go`

**Self-review findings:**
- Code matches brief exactly
- Thread safety via RWMutex properly implemented
- Session expiry correctly checked in `Get()`
- No concerns