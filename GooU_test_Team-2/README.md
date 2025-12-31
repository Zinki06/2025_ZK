# Spring Boot User API Project

A simple Spring Boot application implementing a RESTful API for User management using an in-memory `ArrayList` storage. This project demonstrates basic CRUD operations in Spring Boot.

## Features

- **User Management**: Create, Read, Update, and Delete users.
- **In-Memory Storage**: Uses a simple Java `List` to store data (data is reset on restart).
- **RESTful Endpoints**: Standard HTTP methods (GET, POST, PUT, DELETE).

## API Endpoints

### Base URL: `/api/users`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | `/`      | Get all users |
| GET    | `/{id}`  | Get user by ID |
| POST   | `/`      | Create new user |
| PUT    | `/{id}`  | Update user |
| DELETE | `/{id}`  | Delete user |

### Request Example (Create User)
```json
{
  "name": "Hong Gil Dong",
  "email": "hong@example.com",
  "age": 25
}
```

## How to Run

### Prerequisites
- Java 17 or higher
- Maven

### Build & Run
```bash
./mvnw spring-boot:run
```
The server will start at `http://localhost:8080`.

### Run Tests
```bash
./mvnw test
```
