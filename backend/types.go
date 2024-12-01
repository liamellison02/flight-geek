package main

import (
	"time"

	"golang.org/x/crypto/bcrypt"
)

type FlightRequest struct {
	DepartureAirport string `json:"departure_airport"`
	ArrivalAirport   string `json:"arrival_airport"`
	DepartureDT      string `json:"departure_date_time"`
	ArrivalDT        string `json:"arrival_date_time"`
}

type FlightResponse struct {
	Flights []Flight `json:"flights"`
}

type LoginResponse struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Token    string `json:"token"`
}

type LoginRequest struct {
	ID       int    `json:"id"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type CreateUserRequest struct {
	Username string `json:"username"`
	Password string `json:"password"`
}

type User struct {
	ID                int       `json:"id"`
	Username          string    `json:"username"`
	EncryptedPassword string    `json:"-"`
	Trackers          []Tracker `json:"trackers"`
	CreatedAt         time.Time `json:"createdAt"`
	UpdatedAt         time.Time `json:"updatedAt"`
}

type Flight struct {
	FlightID         int       `json:"flight_id"`
	DepartureDT      string    `json:"departure_date_time"`
	ArrivalDT        string    `json:"arrival_date_time"`
	DepartureAirport string    `json:"departure_airport"`
	ArrivalAirport   string    `json:"arrival_airport"`
	Price            float64   `json:"price"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}

type Price struct {
	PriceID    int     `json:"price_id"`
	FlightID   int     `json:"flight_id"`
	Price      float64 `json:"price"`
	RecordedAt string  `json:"recorded_at"`
}

type Airport struct {
	AirportID int    `json:"airport_id"`
	Name      string `json:"name"`
	City      string `json:"city"`
	Country   string `json:"country"`
}

type Airline struct {
	AirlineID      int    `json:"airline_id"`
	Name           string `json:"name"`
	CountyOfOrigin string `json:"country_of_origin"`
}

type Tracker struct {
	TrackerID int       `json:"tracker_id"`
	UserID    int       `json:"user_id"`
	FlightID  int       `json:"flight_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
	Status    string    `json:"status"`
}

func (a *User) ValidPassword(pw string) bool {
	return bcrypt.CompareHashAndPassword([]byte(a.EncryptedPassword), []byte(pw)) == nil
}

func NewUser(username string, password string) (*User, error) {
	encpw, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	return &User{
		Username:          username,
		EncryptedPassword: string(encpw),
		CreatedAt:         time.Now().UTC(),
	}, nil
}
