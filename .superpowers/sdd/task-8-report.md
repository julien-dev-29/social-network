# Task 8: Post handlers (CRUD)

## What was implemented
Created `pkg/handlers/posts.go` with five CRUD handler functions:
- `CreatePost` — inserts post, returns 201 with post + username via JOIN
- `GetPosts` — returns all posts (newest first) with author username
- `GetPost` — returns single post by ID, 404 if not found
- `UpdatePost` — updates own post only, ownership enforced
- `DeletePost` — deletes own post only, ownership enforced

Also defined:
- `CreatePostRequest` and `PostResponse` types
- `getUserID(r)` helper to read userID from context

## What was tested
- `go build ./pkg/handlers/` — compiles cleanly, no errors

## Files changed
- `pkg/handlers/posts.go` (new file, 222 lines)

## Self-review findings
- Ownership check uses `ownerID != userID` — works correctly when getUserID returns 0 for unauthenticated (RequireAuth middleware should prevent this path)
- The `sql.NullString` trick on line 36 is a no-op for string values but matches the brief exactly
- Reuses `writeError` from auth.go as required
- Uses `chi.URLParam` for route params as required
