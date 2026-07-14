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

