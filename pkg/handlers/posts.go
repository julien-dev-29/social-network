package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"social-network/pkg/middleware"
)

type CreatePostRequest struct {
	Content string `json:"content"`
}

type PostResponse struct {
	ID        int    `json:"id"`
	Content   string `json:"content"`
	Username  string `json:"username"`
	CreatedAt string `json:"created_at"`
}

func getUserID(r *http.Request) int {
	userID, _ := r.Context().Value(middleware.UserIDKey).(int)
	return userID
}

func CreatePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		req.Content = sql.NullString{String: req.Content, Valid: true}.String
		if req.Content == "" {
			writeError(w, http.StatusBadRequest, "content is required")
			return
		}

		userID := getUserID(r)

		result, err := db.Exec(
			"INSERT INTO posts (user_id, content) VALUES (?, ?)",
			userID, req.Content,
		)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to create post")
			return
		}

		postID, _ := result.LastInsertId()

		var post PostResponse
		err = db.QueryRow(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 WHERE p.id = ?`, postID,
		).Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch post")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusCreated)
		json.NewEncoder(w).Encode(post)
	}
}

func GetPosts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 ORDER BY p.created_at DESC`,
		)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch posts")
			return
		}
		defer rows.Close()

		posts := []PostResponse{}
		for rows.Next() {
			var post PostResponse
			if err := rows.Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt); err != nil {
				writeError(w, http.StatusInternalServerError, "failed to scan post")
				return
			}
			posts = append(posts, post)
		}

		if err := rows.Err(); err != nil {
			writeError(w, http.StatusInternalServerError, "error reading posts")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(posts)
	}
}

func GetPost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		var post PostResponse
		err = db.QueryRow(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 WHERE p.id = ?`, id,
		).Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt)

		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch post")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
	}
}

func UpdatePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		var req CreatePostRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			writeError(w, http.StatusBadRequest, "invalid request body")
			return
		}

		if req.Content == "" {
			writeError(w, http.StatusBadRequest, "content is required")
			return
		}

		userID := getUserID(r)

		var ownerID int
		err = db.QueryRow("SELECT user_id FROM posts WHERE id = ?", id).Scan(&ownerID)
		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "database error")
			return
		}

		if ownerID != userID {
			writeError(w, http.StatusForbidden, "you can only update your own posts")
			return
		}

		_, err = db.Exec("UPDATE posts SET content = ? WHERE id = ?", req.Content, id)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to update post")
			return
		}

		var post PostResponse
		err = db.QueryRow(
			`SELECT p.id, p.content, u.username, p.created_at
			 FROM posts p JOIN users u ON p.user_id = u.id
			 WHERE p.id = ?`, id,
		).Scan(&post.ID, &post.Content, &post.Username, &post.CreatedAt)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to fetch updated post")
			return
		}

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(post)
	}
}

func DeletePost(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		id, err := strconv.Atoi(chi.URLParam(r, "id"))
		if err != nil {
			writeError(w, http.StatusBadRequest, "invalid post id")
			return
		}

		userID := getUserID(r)

		var ownerID int
		err = db.QueryRow("SELECT user_id FROM posts WHERE id = ?", id).Scan(&ownerID)
		if err == sql.ErrNoRows {
			writeError(w, http.StatusNotFound, "post not found")
			return
		}
		if err != nil {
			writeError(w, http.StatusInternalServerError, "database error")
			return
		}

		if ownerID != userID {
			writeError(w, http.StatusForbidden, "you can only delete your own posts")
			return
		}

		_, err = db.Exec("DELETE FROM posts WHERE id = ?", id)
		if err != nil {
			writeError(w, http.StatusInternalServerError, "failed to delete post")
			return
		}

		w.WriteHeader(http.StatusNoContent)
	}
}
