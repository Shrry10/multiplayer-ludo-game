# syntax = docker/dockerfile:1.2

# Use the official Node.js image as the base image
FROM node:18

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 5000

# Copy the .env file from the secret mount to the working directory
RUN --mount=type=secret,id=_env cp /etc/secrets/.env .env

# Command to run the application
CMD ["npm", "start"]