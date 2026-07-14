package main

import (
	"database/sql"

	"github.com/go-chi/chi/v5"

	"social-network/pkg/handlers"
	"social-network/pkg/middleware"
)

func NewServer(db *sql.DB, sessionStore *handlers.SessionStore) *chi.Mux {
	r := chi.NewRouter()

	r.Use(middleware.Logger)
	r.Use(middleware.CORS)
	r.Use(middleware.ContentType)

	r.Route("/api", func(r chi.Router) {
		r.Post("/register", handlers.Register(db, sessionStore))
		r.Post("/login", handlers.Login(db, sessionStore))
		r.Post("/logout", handlers.Logout(sessionStore))

		r.Group(func(r chi.Router) {
			r.Use(middleware.RequireAuth(sessionStore))

			r.Post("/posts", handlers.CreatePost(db))
			r.Get("/posts", handlers.GetPosts(db))
			r.Get("/posts/{id}", handlers.GetPost(db))
			r.Put("/posts/{id}", handlers.UpdatePost(db))
			r.Delete("/posts/{id}", handlers.DeletePost(db))
		})
	})

	return r
}
