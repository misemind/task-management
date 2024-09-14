# Use the official Node.js image.
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy over package.json and pnpm-lock.yaml files
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Expose the necessary port
EXPOSE 3000

# Command for development mode with watch enabled
CMD ["pnpm", "run", "start:dev"]
