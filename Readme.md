# URL Shortener Backend

A URL shortener application built using Express.js, PostgreSQL, and Redis.

## Prerequisites

-   Docker installed on your machine

## Getting Started

Follow these steps to set up and run the development environment:

### 1. Clone the Repository

Clone this repository to your local machine using the following command:

```bash
git clone https://github.com/mrshabel/url-shortener
```

### 2. Navigate to the Project Directory

Change to the project directory:

```bash
cd url-shortener
```

### 3. Build and Start the Containers

Build and start the Docker containers using Docker Compose:

```bash
docker compose up
```

### 4. Access the Application

Once the containers are up and running, your development environment is set up. The application should be accessible at `http://localhost:8000`.

## Configuration

-   `.env` file: Create a `.env` file in the root directory with the variables inside the `.env.example` file in the project's root directory:
