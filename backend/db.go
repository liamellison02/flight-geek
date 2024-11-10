package main

import (
	"database/sql"
	"fmt"

	_ "github.com/lib/pq"
)

type DB interface {
	CreateUser(*User) error
	DeleteUser(int) error
	UpdateUser(*User) error
	GetUsers() ([]*User, error)
	GetUserByID(int) (*User, error)
	GetUserByUsername(string) (*User, error)
}

type PostgresDB struct {
	db *sql.DB
}

func NewPostgresDB() (*PostgresDB, error) {
	// connStr will need to be replaced
	connStr := "user=postgres dbname=postgres password=password sslmode=disable"
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

func (s *PostgresDB) Init() error {
	return s.createUserTable()
}

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

func scanIntoUser(rows *sql.Rows) (*User, error) {
	User := new(User)
	err := rows.Scan(
		&User.ID,
		&User.Username,
		&User.EncryptedPassword,
		&User.CreatedAt)

	return User, err
}
