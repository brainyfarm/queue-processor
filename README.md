Here's the updated README to reflect the automatic refreshing of the dashboard using WebSocket:

---

# Webhook Queue Processing System

This is a robust, production-ready webhook queue processing system designed to handle high volumes of webhooks with features like retry logic, exponential backoff, blacklisting, and real-time monitoring through a dashboard that updates automatically via WebSocket.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Environment Variables](#environment-variables)
- [Docker Setup and Usage](#docker-setup-and-usage)
- [Running the Application](#running-the-application)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Adding Tests](#adding-tests)
- [Dashboard](#dashboard)
- [Logging](#logging)
- [License](#license)

---

## Features

- **Webhook Processing**: Efficiently handles and sends webhook events.
- **Retry Logic**: Employs exponential backoff with configurable retry limits.
- **Dead Letter Queue**: Failed jobs after maximum retries are sent to a Dead Letter Queue for future analysis.
- **Endpoint Blacklisting**: Endpoints that repeatedly fail are automatically blacklisted to reduce system strain.
- **Real-Time Monitoring**: Dashboard displays metrics including job statuses, retries, failed jobs, and blacklisted endpoints, with automatic updates via WebSocket.

---

## Project Structure

```
.
├── .env                 # Environment variables
├── Dockerfile           # Docker setup for each service (consumer, producer, dashboard)
├── docker-compose.yml   # Docker Compose for setting up isolated services
├── src
│   ├── consumer         # Consumes jobs from the queue
│   ├── dashboard        # Real-time metrics and monitoring dashboard
│   ├── lib
│   │   ├── client       # Redis client setup
│   │   ├── config       # Configuration management
│   │   ├── logger       # Logging setup with Winston
│   │   ├── queue        # Queue management, Dead Letter Queue, metrics
│   │   └── retry        # Retry logic and exponential backoff
│   └── producer         # Produces jobs into the queue
├── tests
│   ├── unit             # Unit tests for isolated functionality
│   ├── integration      # Integration tests for component interaction
│   └── __mocks__        # Mock files for testing, such as Redis
└── README.md
```

---

## Setup

To set up the project locally:

1. **Clone the repository** and navigate to the project directory.

2. **Install dependencies** (if running outside Docker):
   ```bash
   npm install
   ```

3. **Set up environment variables** by copying `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

---

## Environment Variables

Make sure to update the `.env` file with the required environment variables:

```env
# Redis configuration
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=yourpassword

# Retry and queue settings
BACKOFF_BASE=1000                # Base delay in ms for retry backoff
MAX_RETRIES=5                    # Max retry attempts for each job
MAX_DELAY=60000                  # Max delay for backoff in ms
CONCURRENCY_LIMIT=5              # Max concurrent jobs
RETRY_INTERVAL=500               # Interval for job processing
DASHBOARD_PORT=8080              # Port for the dashboard
```

---

## Docker Setup and Usage

To use Docker and Docker Compose for this project, ensure you have Docker installed and running.

### Build and Run All Services

To build the containers and bring up the application:

```bash
docker-compose up --build
```

This command will set up the following services:

- **Redis**: Primary Redis instance for the application.
- **Redis-Test**: Isolated Redis instance for running tests.
- **Producer**: Produces webhook jobs.
- **Consumer**: Consumes and processes jobs with retry logic.
- **Dashboard**: Real-time dashboard for monitoring metrics.

---

## Running the Application

After building the services, run the following command to start all containers:

```bash
docker-compose up
```

The application will start running, with each service operating in its own container. You can view the logs for each service in the console.

---

## Testing

This project includes both unit and integration tests, with isolated Redis instances to prevent interference with production data.

### Running Tests

To run tests in an isolated environment:

```bash
docker-compose up --abort-on-container-exit test-runner
```

The `test-runner` container will execute all tests and then stop, ensuring tests don’t interfere with the main application. Results will be displayed in the console.

### Adding Tests

Tests are organized into `unit` and `integration` categories:

- **Unit Tests**: Located in `tests/unit`, focusing on individual functions or modules.
- **Integration Tests**: Located in `tests/integration`, testing interactions between multiple components.

To add a new test:
1. Create a new file in the appropriate directory (`unit` or `integration`).
2. Write your test logic using Jest.
3. Run `docker-compose up --abort-on-container-exit test-runner` to verify your test.

---

## Dashboard

The **Webhook Queue Dashboard** provides real-time monitoring of metrics and queue status.

- **URL**: The dashboard is accessible at [http://localhost:8080](http://localhost:8080) (replace with `DASHBOARD_PORT` if customized).
- **Automatic Updates**: The dashboard uses WebSocket to automatically refresh data in real-time, displaying up-to-date metrics without manual refreshing.
- **Metrics Displayed**:
  - Queue size
  - Processed jobs
  - Failed jobs
  - Blacklisted endpoints
  - Dead Letter Queue

---

## Logging

Logging is handled by Winston and is configured to log both to the console and to files within the `logs` directory.

Log levels are set based on the environment:
- **Development**: Logs at `info` level to the console.
- **Production**: Logs warnings and errors to console and file.

---

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

This README provides a comprehensive overview of the system, including setup, usage, testing, and real-time monitoring via the automatically refreshing dashboard.