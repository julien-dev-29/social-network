# Task 4: Middleware — Report

## What I implemented

Created `pkg/middleware/middleware.go` with three HTTP middleware functions:

- **Logger** — Logs `METHOD /path` to stdout via `log.Printf`
- **CORS** — Sets `Access-Control-Allow-Origin: *`, allowed methods and headers; returns 204 on OPTIONS preflight
- **ContentType** — Sets `Content-Type: application/json` for routes starting with `/api/`

`RequireAuth` was deliberately omitted per instructions (Task 6 will add it).

## What I tested and test results

- `go build ./pkg/middleware/` — compiled with zero errors

## Files changed

- `pkg/middleware/middleware.go` (created)

## Self-review findings

- Code matches the brief exactly; no deviations
- Imports are minimal (`log`, `net/http`, `strings`)
- No issues found
