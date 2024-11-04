package main

import (
	"flight-geek/backend/internal/handlers"
	"flight-geek/backend/pkg/database"
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Connect to the database
	database.Connect()
	defer database.DB.Close()

	// Set up routes
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Flight Price Tracker API is running!")
	})
	http.HandleFunc("/flights", handlers.GetFlights)

	// Start the server
	fmt.Println("Starting server on :8080...")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatalf("Could not start server: %s\n", err)
	}
}
