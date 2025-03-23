# Simple VOIP Implementation with Asterisk and Call Event Management

This project is a simple VOIP implementation that uses **Asterisk** to create two SIP channels, which can call each other. It captures and stores all call events in a **TimescaleDB**. The system is composed of four main parts:

1. **API Gateway** - Handles authorization and provides an API for accessing call events.
2. **Event Listener** - Listens for various call events such as 'Up', 'Busy', 'Ring', 'Idle', 'Hangup', 'Newexten', 'VarSet', 'SoftHangupRequest', and sends them to **RabbitMQ** when they occur.
3. **Event Writer** - Writes the captured call events from **RabbitMQ** into a **TimescaleDB**.
4. **Database Migration** - Uses **Liquibase** for managing database migrations. All SQL queries are written in plain SQL.

## Getting Started

### Prerequisites

- **Docker** and **Docker Compose** should be installed on your machine.
- **Asterisk** configuration files are required (for production environment). You must specify your own configuration credentials in `build/asterix` the files listed below:
    - `asterisk.conf`
    - `extensions.conf`
    - `manager.conf`
    - `modules.conf`
    - `pjsip.conf`
    - `sounds`
    - `stasis.conf`

For production environment, copy the `docker-compose.local.yaml` file to `docker-compose.yaml` and insert your credentials.

### Docker Compose for Local Environment

For local development, you can run the services using Docker Compose. Run the following command to start the project:

```bash
docker compose -f docker-compose.local.yaml up
```

### Docker Compose for Production Environment

For a production environment, you'll need to update the following configuration files:

- **docker-compose.local.yaml** should be copied to **docker-compose.yaml**.
- Insert the production credentials in the following files:
    - `asterisk.conf`
    - `extensions.conf`
    - `manager.conf`
    - `modules.conf`
    - `pjsip.conf`
    - `sounds`
    - `stasis.conf`

Once you've updated the credentials, you can start the production environment with:

```bash
docker compose -f docker-compose.yaml up
```

---

## Components

### 1. API Gateway

The **API Gateway** handles the authorization (using JWT tokens) and exposes an API for accessing the call events stored in the database.

- **Authorization** is done using JWT tokens.
- The **GET /call-events/get-all** API endpoint allows querying the call events with optional filters for start and end dates.

### 2. Event Listener

The **Event Listener** listens to various call events such as:

- `Up`
- `Busy`
- `Ring`
- `Idle`
- `Hangup`
- `Newexten`
- `VarSet`
- `SoftHangupRequest`

Whenever one of these events occurs, the listener sends the event details to **RabbitMQ** for further processing.

### 3. Event Writer

The **Event Writer** reads the events from **RabbitMQ** and writes them to a **TimescaleDB** for persistent storage.

- The database is structured to store event details such as call status, caller ID, timestamp, and channel information.

### 4. Database Migration

This project uses **Liquibase** to handle database migrations. All SQL queries are written in **plain SQL** and managed through Liquibase.

### Example of a Call Event

When a call event occurs, it might look like this:

```json
{
"event_id": 1,
"event_status": "Ringing",
"caller_id": "1234567890",
"event_timestamp": "2025-03-22T10:15:00Z",
"event_channel": "SIP/6001-0000001"
}
```

### Running Migrations

To apply the database migrations, make sure **Liquibase** is installed and configured to use the **TimescaleDB**. Run the migration commands to apply the necessary database schema changes.

```bash
liquibase update
```


## JWT Authentication

The **API Gateway** uses JWT tokens for authorization. To get a token, you'll need to authenticate using your credentials, and then the system will provide a JWT token to use in the **Authorization** header for making API requests.

- **Registration**:
  Users can register using the `/auth/register` API endpoint. The registration requires:
  - `username`
  - `email`
  - `phone`
  - `password`

  Upon successful registration, a JWT token is returned which can be used to authenticate subsequent requests.

- **Authentication**:
  Authentication is handled via JWT. To log in, use the `/auth/login` API endpoint with the following credentials:
  - `username`: `test`
  - `password`: `qwerty123`

  The login API returns a JWT token that should be used to authenticate API requests.

- Example of a **GET** request for call events:

```http
GET /call-events/get-all?startDate=2025-03-22T00:00:00Z&endDate=2025-03-24T23:59:59Z
Authorization: Bearer <your-jwt-token>
```

---

## Configuration Files

- **docker-compose.local.yaml**: Configuration file for local development setup.
- **docker-compose.yaml**: Configuration file for production setup.
- **Asterisk configuration files**: `asterisk.conf`, `extensions.conf`, `manager.conf`, `modules.conf`, `pjsip.conf`, `sounds`, `stasis.conf` - Required for configuring the Asterisk server.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

