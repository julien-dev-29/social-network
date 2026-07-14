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

