package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"

	"strconv"

	"github.com/gorilla/mux"
)

type APIServer struct {
	listenAddr string
	db         DB
}

func NewAPIServer(listenAddr string, db DB) *APIServer {
	return &APIServer{
		listenAddr: listenAddr,
		db:         db,
	}
}

func (s *APIServer) Run() {
	router := mux.NewRouter()

	router.HandleFunc("/login", makeHTTPHandleFunc(s.handleLogin))
	router.HandleFunc("/user", makeHTTPHandleFunc(s.handleUser))
	router.HandleFunc("/user/{id}", makeHTTPHandleFunc(s.handleGetUserByID))

	http.ListenAndServe(s.listenAddr, router)

	log.Printf("API server listening on %s", s.listenAddr)
}

type apiFunc func(http.ResponseWriter, *http.Request) error

type ApiError struct {
	Error string `json:"error"`
}

func WriteJSON(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)

	return json.NewEncoder(w).Encode(v)
}

func makeHTTPHandleFunc(f apiFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		if err := f(w, r); err != nil {
			WriteJSON(w, http.StatusBadRequest, ApiError{Error: err.Error()})
		}
	}
}

func (s *APIServer) handleLogin(w http.ResponseWriter, r *http.Request) error {
	if r.Method != "POST" {
		return fmt.Errorf("method not allowed %s", r.Method)
	}

	var req LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		return err
	}

	user, err := s.db.GetUserByID(int(req.ID))
	if err != nil {
		return err
	}

	if !user.ValidPassword(req.Password) {
		return fmt.Errorf("not authenticated")
	}

	resp := LoginResponse{Username: user.Username, ID: user.ID}
	return WriteJSON(w, http.StatusOK, resp)
}

func (s *APIServer) handleUser(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		return s.handleGetUser(w)
	}
	if r.Method == "POST" {
		return s.handleCreateUser(w, r)
	}

	return fmt.Errorf("method not allowed %s", r.Method)
}

func (s *APIServer) handleGetUser(w http.ResponseWriter) error {
	Users, err := s.db.GetUsers()
	if err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, Users)
}

func parseReqParams(r *http.Request, p *[]string) ([]string, error) {
	for _, param := range *p {
		if r.FormValue(param) == "" {
			return 0, fmt.Errorf("missing required parameter %s", param)
		}

	}
	idStr := mux.Vars(r)["id"]
	id, err := strconv.Atoi(idStr)
	if err != nil {
		return id, fmt.Errorf("invalid id given %s", idStr)
	}
	return id, nil
}

func (s *APIServer) handleGetUserByID(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		id, err := parseID(r)
		if err != nil {
			return err
		}

		User, err := s.db.GetUserByID(id)
		if err != nil {
			return err
		}

		return WriteJSON(w, http.StatusOK, User)
	}

	if r.Method == "DELETE" {
		return s.handleDeleteUser(w, r)
	}

	return fmt.Errorf("method not allowed %s", r.Method)
}

func (s *APIServer) handleCreateUser(w http.ResponseWriter, r *http.Request) error {
	req := new(CreateUserRequest)
	if err := json.NewDecoder(r.Body).Decode(req); err != nil {
		return err
	}

	User, err := NewUser(req.Username, req.Password)
	if err != nil {
		return err
	}
	if err := s.db.CreateUser(User); err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, User)
}

func (s *APIServer) handleDeleteUser(w http.ResponseWriter, r *http.Request) error {
	id, err := parseID(r)
	if err != nil {
		return err
	}

	if err := s.db.DeleteUser(id); err != nil {
		return err
	}

	return WriteJSON(w, http.StatusOK, map[string]int{"deleted": id})
}

func (s *APIServer) handleFlight(w http.ResponseWriter) error {
	Flights, err := s.db.GetFlights()
	if err != nil {
		return err
	}
	return WriteJSON(w, http.StatusOK, Flights)
}

func (s *APIServer) handleGetFlight(w http.ResponseWriter, r *http.Request) error {
	if r.Method == "GET" {
		id, err := parseID(r)
		if err != nil {
			return err
		}

		Flight, err := s.db.GetFlight(id)
		if err != nil {
			return
		}
}