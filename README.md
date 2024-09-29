# NestJS Auth Application

## Description

This is a backend application built using [NestJS](https://nestjs.com/) &
MongoDB, it provides backend endpoints for user sign-up, sign-in etc.

## Features

-   REST API
-   User authentication (JWT: access token & refresh token)
-   MongoDB Integration (Mongoose)
-   Input validation
-   Error handling
-   Api Throttling, Security
-   Password Salted and Hashed
-   Configurable Logging (File/Console with log rotating)
-   Cors, CSP, Api Throttling, Api Security ()
-   Unit test cases and E2E tests
-   Swagger API Documentation

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/suren179/nestjs-auth-mongodb.git
    ```

2. Navigate into the project directory:

    ```bash
    cd nestjs-auth-mongodb
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Create a .env file in the root directory and add the following variables (or
refer to .env.example): CORS_ORIGIN: Is the UI app origin

    PORT=3000
    MONGODB_URL=mongodb://localhost:27017/auth
    JWT_ACCESS_TOKEN_SECRET=ec538028ed699a2ed464f54df56f3699a33a6363c764ac5252bc2be188b40de9
    JWT_ACCESS_TOKEN_EXPIRES_IN=15m
    JWT_REFRESH_TOEKN_SECRET=51c5d16f61d9969c11d7cb1170edb5d088b5ab6fcf8bfd8fdbc16e82731abe9b
    JWT_REFRESH_TOKEN_EXPIRES_IN=7d
    THROTTLE_TTL=900000  # 15 minutes
    THROTTLE_LIMIT=100   # 100 requests per ttl
    CORS_ORIGIN=https://localhost:3001
    LOG_LEVEL=verbose
    LOG_DIR=./logs
    LOG_FILE_MAX_SIZE=20m
    ENABLE_HTTPS=true

## Running the Application

To run the app in development mode:

```bash
npm run start:dev
```

The app will be running at https://localhost:3000 or http://localhost:3000
(based on ENABLE_HTTPS env).

To enable HTTPS in production we need to get CA authorized certificate files and
place these in ./ssl-certs directory (Self signed ones are already included).

Please remember to accept self signed certificates for server app (this app
[https://localhost:3000]) before accessing companion web app

## Running the Application in Production

To run the app in production mode:

```bash
npm run build
npm run start:prod
```

## API Endpoints

-   **POST** `/auth/sign-up` – Sign up a new user
-   **POST** `/auth/sign-in` – Login a user
-   **POST** `/auth/refresh-token` – Get access token from refresh token
-   **GET** `/users/me` – Get Logged in user's information
-   **PUT** `/users/me` – Update Logged in user's information
-   **PUT** `/users/me/change-password` – Change Logged in user's password

## Testing

To run unit test tests:

```bash
npm run test
```

To run end to end tests:

```bash
npm run test:e2e
```

## Documentation

The API is documented using [Swagger](https://swagger.io/). After starting the
app, navigate to `/api` ( [Local Https Swagger](https://localhost:3000/api) or
[Local Http Swagger](http://localhost:3000/api) ) to view the API documentation.

## License

N/A
