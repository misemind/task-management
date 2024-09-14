# Use an official Node.js runtime as a parent image
FROM node:20-alpine

# Set the working directory in the container
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy package.json and pnpm-lock.yaml
COPY pnpm-lock.yaml package.json ./

# Install app dependencies using PNPM
RUN pnpm install

# Set memory limit for Node.js
ENV NODE_OPTIONS="--max-old-space-size=8192"

# Expose the app
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]
