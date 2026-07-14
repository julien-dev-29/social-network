package main

import (
	"fmt"
	"log"
	"net/http"

	"social-network/pkg/db/sqlite"
	"social-network/pkg/handlers"
)

func main() {
	db, err := sqlite.Connect("social-network.db")
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer db.Close()

	if err := sqlite.RunMigrations(db, "file://pkg/db/migrations/sqlite"); err != nil {
		log.Fatalf("failed to run migrations: %v", err)
	}

	sessionStore := handlers.NewSessionStore()
	r := NewServer(db, sessionStore)

	addr := ":8080"
	fmt.Printf("Server running on %s\n", addr)
	if err := http.ListenAndServe(addr, r); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
