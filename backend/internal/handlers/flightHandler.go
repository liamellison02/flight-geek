package handlers

import (
	"fmt"
	"net/http"
)

func GetFlights(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "This will return a list of flights.")
}
