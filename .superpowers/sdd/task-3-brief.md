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

