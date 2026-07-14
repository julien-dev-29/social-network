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

