# webredis
Web api for redis key value store

# Developed with
Node js version: `v12.2.0` (output of `node -v`)
Docker version: `Docker version 19.03.12, build 48a66213fe` (output of `docker -v`)
Time spent on this project: 5h

# Available commands
`npm start`: starts the server on the host machine
`npm run dev`: starts the server in watch mode, any file change should restart the app
`npm test`: runs unit and integration tests
`npm run test:unit`: executes unit tests and displays coverage
`npm run test:integration`: executes integration tests (built with supertest)
`npm run test:e2e`: executes e2e test (requires a running instance on port 3000)
`npm run test:watch`: executes unit tests in watch mode, all file changes should trigger a new test run
`npm run compose:up`: Starts the server and dependecies defined in the docker-compose.yaml (redis)
