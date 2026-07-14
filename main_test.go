package main

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"social-network/pkg/db/sqlite"
	"social-network/pkg/handlers"
)

func setupTestServer(t *testing.T) *httptest.Server {
	t.Helper()

	db, err := sqlite.Connect(":memory:")
	if err != nil {
		t.Fatalf("failed to connect to test db: %v", err)
	}

	if err := sqlite.RunMigrations(db, "file://pkg/db/migrations/sqlite"); err != nil {
		t.Fatalf("failed to run migrations: %v", err)
	}

	sessionStore := handlers.NewSessionStore()
	r := NewServer(db, sessionStore)

	return httptest.NewServer(r)
}

func TestRegisterAndLogin(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	regBody, _ := json.Marshal(map[string]string{
		"username": "testuser",
		"email":    "test@example.com",
		"password": "password123",
	})

	resp, err := http.Post(ts.URL+"/api/register", "application/json", bytes.NewReader(regBody))
	if err != nil {
		t.Fatalf("register request failed: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}

	var user handlers.UserResponse
	json.NewDecoder(resp.Body).Decode(&user)
	resp.Body.Close()

	if user.Username != "testuser" {
		t.Fatalf("expected username testuser, got %s", user.Username)
	}

	loginBody, _ := json.Marshal(map[string]string{
		"email":    "test@example.com",
		"password": "password123",
	})

	resp, err = http.Post(ts.URL+"/api/login", "application/json", bytes.NewReader(loginBody))
	if err != nil {
		t.Fatalf("login request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	cookies := resp.Cookies()
	if len(cookies) == 0 {
		t.Fatal("expected session cookie")
	}

	var sessionCookie *http.Cookie
	for _, c := range cookies {
		if c.Name == "session_id" {
			sessionCookie = c
			break
		}
	}
	if sessionCookie == nil {
		t.Fatal("session_id cookie not found")
	}

	resp.Body.Close()

	postBody, _ := json.Marshal(map[string]string{
		"content": "Hello from test",
	})

	req, _ := http.NewRequest("POST", ts.URL+"/api/posts", bytes.NewReader(postBody))
	req.Header.Set("Content-Type", "application/json")
	req.AddCookie(sessionCookie)

	client := &http.Client{}
	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("create post request failed: %v", err)
	}
	if resp.StatusCode != http.StatusCreated {
		t.Fatalf("expected 201, got %d", resp.StatusCode)
	}
	resp.Body.Close()

	req, _ = http.NewRequest("GET", ts.URL+"/api/posts", nil)
	req.AddCookie(sessionCookie)

	resp, err = client.Do(req)
	if err != nil {
		t.Fatalf("get posts request failed: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("expected 200, got %d", resp.StatusCode)
	}

	var posts []map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&posts)
	resp.Body.Close()

	if len(posts) != 1 {
		t.Fatalf("expected 1 post, got %d", len(posts))
	}
}

func TestUnauthorizedAccess(t *testing.T) {
	ts := setupTestServer(t)
	defer ts.Close()

	resp, err := http.Get(ts.URL + "/api/posts")
	if err != nil {
		t.Fatalf("request failed: %v", err)
	}
	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("expected 401, got %d", resp.StatusCode)
	}
	resp.Body.Close()
}
