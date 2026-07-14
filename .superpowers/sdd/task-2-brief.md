### Task 2: Database connection and migration runner

**Files:**
- Create: `pkg/db/sqlite/sqlite.go`

**Interfaces:**
- Produces: `func Connect(dbPath string) (*sql.DB, error)` â€” opens SQLite connection
- Produces: `func RunMigrations(db *sql.DB, migrationsPath string) error` â€” applies pending migrations

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

