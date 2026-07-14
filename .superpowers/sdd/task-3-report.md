# Task 3: Migration files

## What I implemented

Created 4 SQL migration files for the users and posts tables, plus their rollback scripts.

## Files created

- `pkg/db/migrations/sqlite/000001_create_users_table.up.sql`
- `pkg/db/migrations/sqlite/000001_create_users_table.down.sql`
- `pkg/db/migrations/sqlite/000002_create_posts_table.up.sql`
- `pkg/db/migrations/sqlite/000002_create_posts_table.down.sql`

## Migration details

### 000001 - Users table
- `id`: auto-incrementing integer primary key
- `username`: unique, non-null text
- `email`: unique, non-null text
- `password_hash`: non-null text
- `created_at`: datetime with CURRENT_TIMESTAMP default

### 000002 - Posts table
- `id`: auto-incrementing integer primary key
- `user_id`: non-null integer, foreign key referencing users(id)
- `content`: non-null text
- `created_at`: datetime with CURRENT_TIMESTAMP default

## Self-review findings

No concerns. All files match the brief exactly. Content verified by reading files back after creation. Commit created successfully.
