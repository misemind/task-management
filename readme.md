Certainly! Here is the `README.md` content formatted for easy copy and paste:

```markdown
# Proactforge Application

## Overview

This repository contains a monorepo setup for a NestJS application along with MongoDB, Mongo Express, and MinIO services. The project is configured to run using Docker and Docker Compose.

## Prerequisites

Before running this application, ensure you have the following installed:

- [Docker](https://www.docker.com/get-started)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### Step 1: Clone the Repository

```sh
git clone https://github.com/misemind/proactforge.git
cd proactforge
```

### Step 2: Set Up Environment Variables

Create a `.env` file in the `apps/server` directory with the following content:

```env
MONGO_URI=mongodb://admin:admin@mongo:27017/serverdb
MINIO_ENDPOINT=http://minio:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
NODE_ENV=production
```

### Step 3: Build and Run the Docker Containers

Run the following command to build and start the Docker containers:

```sh
docker-compose up -d
```

### Step 4: Access the Application

- **Server**: The NestJS application will be accessible at [http://localhost:3000](http://localhost:3000)
- **Mongo Express**: MongoDB admin interface will be accessible at [http://localhost:8081](http://localhost:8081)
- **MinIO**: MinIO interface will be accessible at [http://localhost:9001](http://localhost:9001)

## Stopping the Application

To stop the Docker containers, run:

```sh
docker-compose down
```

## Troubleshooting

- Ensure Docker and Docker Compose are installed and running.
- Verify that no other services are using ports `3000`, `8081`, and `9001`.

For further assistance, please refer to the Docker and Docker Compose documentation or create an issue on this repository.

---

By following these steps, you will have the Proactforge application up and running with Docker.

```

You can copy this entire block and paste it directly into your `README.md` file.
```
