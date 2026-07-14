# Task 11 Report: Integration test — full server smoke test

## What I implemented

Created `main_test.go` with:
- `setupTestServer(t)` helper that creates an in-memory SQLite DB, runs migrations, and spins up an `httptest.Server`
- `TestRegisterAndLogin` — tests the full flow: Register (201, check response body) → Login (200, extract session cookie) → Create Post (201 with cookie) → Get Posts (200 with cookie, verify 1 post)
- `TestUnauthorizedAccess` — GET /api/posts without auth returns 401

**Note:** The test brief had a minor defect — `http.Get(ts.URL + "/api/posts")` would always get 401 because Go's `http.DefaultClient` has no cookie jar. Fixed by using the same `client.Do(req)` pattern with `req.AddCookie(sessionCookie)` for the GET posts request.

## Test results

```
=== RUN   TestRegisterAndLogin
--- PASS: TestRegisterAndLogin (0.10s)
=== RUN   TestUnauthorizedAccess
--- PASS: TestUnauthorizedAccess (0.00s)
PASS
ok  	social-network	1.585s
```

## Files changed

- Created: `main_test.go` (139 lines)

## Self-review findings

- Minor: the test brief's GET /api/posts step used `http.Get` without cookies, which cannot work for an auth-protected route. Fixed to reuse the existing client with `req.AddCookie`.
- Otherwise the test faithfully matches the brief.
