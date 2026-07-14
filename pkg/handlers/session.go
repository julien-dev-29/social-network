package handlers

import (
	"crypto/rand"
	"encoding/hex"
	"sync"
	"time"
)

type session struct {
	userID    int
	expiresAt time.Time
}

type SessionStore struct {
	mu       sync.RWMutex
	sessions map[string]session
}

func NewSessionStore() *SessionStore {
	return &SessionStore{
		sessions: make(map[string]session),
	}
}

func (s *SessionStore) Create(userID int) (string, error) {
	b := make([]byte, 32)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}
	id := hex.EncodeToString(b)

	s.mu.Lock()
	s.sessions[id] = session{
		userID:    userID,
		expiresAt: time.Now().Add(24 * time.Hour),
	}
	s.mu.Unlock()

	return id, nil
}

func (s *SessionStore) Get(sessionID string) (int, bool) {
	s.mu.RLock()
	sess, ok := s.sessions[sessionID]
	s.mu.RUnlock()

	if !ok || time.Now().After(sess.expiresAt) {
		return 0, false
	}

	return sess.userID, true
}

func (s *SessionStore) Delete(sessionID string) {
	s.mu.Lock()
	delete(s.sessions, sessionID)
	s.mu.Unlock()
}