## Task 2: Database connection and migration runner — Report

### What I implemented

Created `pkg/db/sqlite/sqlite.go` with:
- `Connect(dbPath string) (*sql.DB, error)` — opens SQLite, pings it, sets MaxOpenConns(1)
- `RunMigrations(db *sql.DB, migrationsPath string) error` — applies pending migrations via golang-migrate

### Deviation from brief

The brief's import `"github.com/golang-migrate/migrate/v4/database/sqlite"` conflicts with the local package name `sqlite`. Added alias `migrateSqlite` to resolve the ambiguity. This is standard Go practice.

### What I tested

- `go build ./pkg/db/sqlite/` — compiles cleanly, no errors.

### Files changed

- `pkg/db/sqlite/sqlite.go` (created)

### Self-review findings

- None. Code is clean, idiomatic, and matches the brief's intent.
