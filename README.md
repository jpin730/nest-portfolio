# NestJS Portfolio API

Backend API for a portfolio website built with NestJS. It includes features such as JWT authentication, TypeORM for database management, PostgreSQL as the database, and Cloudinary for image storage. The API allows users to manage their profile information, projects, and certificate gallery.

## Project setup

```bash
pnpm install
```

## Running the development server

```bash
# development
pnpm run start

# watch mode
pnpm run start:dev

# debug mode
pnpm run start:debug
```

> VS Code users can also use the provided launch configurations for debugging. Just run the "Debug NestJS API" configuration to start the development server in debug mode.

## Building and running production

```bash
# CI package installation
pnpm install --frozen-lockfile

# build the project
pnpm run build

# start the production server
pnpm run start:prod
```

## Linting & Formatting

Staged files are automatically linted with ESLint and formatted with Prettier on each commit. The commit is aborted if any issues remain unfixed.

For security reasons, scripts are ignored on install. For setting up Husky, run (if you haven't already):

```bash
pnpm prepare
```
