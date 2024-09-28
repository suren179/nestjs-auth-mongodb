# NestJS Auth Application

## Description

This is a backend application built using [NestJS](https://nestjs.com/) & MongoDB, it provides backend endpoints for user sign-up, sign-in etc.

## Features

-   REST API
-   User authentication (JWT)
-   MongoDB Integration (Mongoose)
-   Input validation
-   Error handling

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-repo/nestjs-app.git
    ```

2. Navigate into the project directory:

    ```bash
    cd nestjs-app
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

## Environment Variables

Create a .env file in the root directory and add the following variables (or
refer to .env.example):

    PORT=3000
    MONGODB_URL=mongodb://localhost:27017/auth
    JWT_ACCESS_TOKEN_SECRET=XYZ
    JWT_ACCESS_TOKEN_EXPIRES_IN=15m
    JWT_REFRESH_TOEKN_SECRET=ABC
    JWT_REFRESH_TOKEN_EXPIRES_IN=7d
    THROTTLE_TTL=60000  # 1 minutes
    THROTTLE_LIMIT=20   # 20 requests per ttl
    CORS_ORIGIN=http://localhost:3000
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
place these in ./ssl-certs directory (Self signed ones are already included)

## Running the Application in Production

To run the app in production mode:

```bash
npm run build
npm run start:prod
```

## API Endpoints

-   **POST** `/auth/sign-up` – Sign up a new user
-   **POST** `/auth/log-in` – Login a user
-   **POST** `/auth/refresh-token` – Get access token from refresh token
-   **GET** `/users/me` – Get Logged in user's information
-   **PUT** `/users/me` – Update Logged in user's information
-   **PUT** `/users/me/change-password` – Change Logged in user's password

## Testing

To run tests:

```bash
npm run test
```

## Documentation

The API is documented using [Swagger](https://swagger.io/). After starting the
app, navigate to `/api` to view the API documentation.

## License

N/A
