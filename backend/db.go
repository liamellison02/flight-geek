package main

import (
	"database/sql"
	"fmt"
	"reflect"

	_ "github.com/lib/pq"
)

type PostgresDB struct {
	db *sql.DB
}

type DB interface {
	CreateUser(*User) error
	DeleteUser(int) error
	UpdateUser(*User) error
	GetUsers() ([]*User, error)
	GetUserByID(int) (*User, error)
	GetUserByUsername(string) (*User, error)
	CreateFlight(*Flight) error
	GetFlights() ([]*Flight, error)
	DeleteFlight(int) error
}

type initDB interface {
	createUserTable() error
	createFlightTable() error
	createTrackerTable() error
}

func NewPostgresDB() (*PostgresDB, error) {
	// connStr will need to be replaced
	connStr := "user=lellison dbname=flight_geek_db password= sslmode=disable"
	db, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, err
	}

	if err := db.Ping(); err != nil {
		return nil, err
	}

	return &PostgresDB{
		db: db,
	}, nil
}

func Init(s *initDB) error {
	// Go allows dynamic dispatch of methods on interfaces, so we can call the
	// createUserTable and createFlightTable methods on the PostgresDB struct
	// without knowing the concrete type of the struct at compile time. In a
	// language like Java, you type your params in your function signature
	// which are then set at compile time, and so any args passed into that
	// function must match the same types you defined in your function
	// signature at compile time. Go doesn't have generics and so you can type
	// a param as an interface, and pass a struct in for that arg so long as it
	// implements all the interface's methods (i.e. it implements the interface).
	// Pretty dope for a statically typed language...

	rtVal := reflect.ValueOf(s)
	rtType := reflect.TypeOf(s)
	for i := 0; i < rtType.NumMethod(); i++ {
		method := rtVal.Method(i)
		if method.Type().NumIn() == 1 {
			if err := method.Call([]reflect.Value{})[0].Interface(); err != nil {
				return err.(error)
			}
		}
	}

	return nil
}

func (s *PostgresDB) Close() {
	s.db.Close()
}

// Schema Initialization:

func (s *PostgresDB) createUserTable() error {
	query := `create table if not exists User (
		id serial primary key,
		username varchar(100),
		encrypted_password varchar(100),
		created_at timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresDB) createFlightTable() error {
	query := `create table if not exists Flight (
		flight_id serial primary key,
		departure_date_time timestamp,
		arrival_date_time timestamp,
		departure_airport varchar(100),
		arrival_airport varchar(100),
		price float,
		created_at timestamp,
		updated_at timestamp
	)`

	_, err := s.db.Exec(query)
	return err
}

func (s *PostgresDB) createTrackerTable() error {
	query := `create table if not exists Tracker (
		id serial primary key,
		user_id int,
		flight_id int,
		created_at timestamp
	)`
	_, err := s.db.Exec(query)
	return err
}

// Helper functions to scan rows and populate/return data as structs:

func scanIntoUser(rows *sql.Rows) (*User, error) {
	User := new(User)
	err := rows.Scan(
		&User.ID,
		&User.Username,
		&User.EncryptedPassword,
		&User.CreatedAt)

	return User, err
}

func scanIntoFlight(rows *sql.Rows) (*Flight, error) {
	Flight := new(Flight)
	err := rows.Scan(
		&Flight.FlightID,
		&Flight.DepartureDT,
		&Flight.ArrivalDT,
		&Flight.DepartureAirport,
		&Flight.ArrivalAirport,
		&Flight.Price,
		&Flight.CreatedAt,
		&Flight.UpdatedAt)

	return Flight, err
}

// Wrapper functions for CRUD operations:

func (s *PostgresDB) CreateUser(user *User) error {
	query := `insert into User (username, encrypted_password, created_at) values ($1, $2, $3)`

	_, err := s.db.Query(
		query,
		user.ID,
		user.Username,
		user.EncryptedPassword,
		user.CreatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (s *PostgresDB) UpdateUser(*User) error {
	// TODO: Implement
	return nil
}

func (s *PostgresDB) DeleteUser(id int) error {
	_, err := s.db.Query("delete from User where id = $1", id)
	return err
}

func (s *PostgresDB) GetUserByUsername(username string) (*User, error) {
	rows, err := s.db.Query("select * from User where username = $1", username)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		return scanIntoUser(rows)
	}

	return nil, fmt.Errorf("User with username [%s] not found", username)
}

func (s *PostgresDB) GetUserByID(id int) (*User, error) {
	rows, err := s.db.Query("select * from User where id = $1", id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		return scanIntoUser(rows)
	}

	return nil, fmt.Errorf("User %d not found", id)
}

func (s *PostgresDB) GetUsers() ([]*User, error) {
	rows, err := s.db.Query("select * from User")
	if err != nil {
		return nil, err
	}

	Users := []*User{}
	for rows.Next() {
		User, err := scanIntoUser(rows)
		if err != nil {
			return nil, err
		}
		Users = append(Users, User)
	}

	return Users, nil
}

func (s *PostgresDB) CreateFlight(flight *Flight) error {
	query := `insert into Flight (flight_id, departure_date_time, 
		arrival_date_time, departure_airport, arrival_airport, price, 
		created_at, updated_at) values ($1, $2, $3, $4, $5, $6, $7, $8)`

	_, err := s.db.Query(
		query,
		flight.FlightID,
		flight.DepartureDT,
		flight.ArrivalDT,
		flight.DepartureAirport,
		flight.ArrivalAirport,
		flight.Price,
		flight.CreatedAt,
		flight.UpdatedAt)

	if err != nil {
		return err
	}

	return nil
}

func (s *PostgresDB) UpdateFlight(*Flight) error {
	// TODO: Implement
	return nil
}

func (s *PostgresDB) DeleteFlight(id int) error {
	_, err := s.db.Query("delete from Flight where flight_id = $1", id)

	if err != nil {
		return err
	}

	return nil
}

func (s *PostgresDB) GetFlights() ([]*Flight, error) {
	rows, err := s.db.Query("select * from Flight")
	if err != nil {
		return nil, err
	}

	Flights := []*Flight{}
	for rows.Next() {
		Flight, err := scanIntoFlight(rows)
		if err != nil {
			return nil, err
		}
		Flights = append(Flights, Flight)
	}

	return Flights, nil
}

func (s *PostgresDB) GetFlightByID(id int) (*Flight, error) {
	rows, err := s.db.Query("select * from Flight where flight_id = $1", id)
	if err != nil {
		return nil, err
	}

	for rows.Next() {
		return scanIntoFlight(rows)
	}

	return nil, fmt.Errorf("Flight %d not found", id)
}
