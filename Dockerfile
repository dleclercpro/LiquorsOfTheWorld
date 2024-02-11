# --------------- BUILD STAGE --------------- #
FROM node:lts as build-stage

# Move to root directory
WORKDIR /apps

# Copy all necessary files
COPY ./Apps/Server ./Server
COPY ./Apps/Client ./Client

# Move to client app directory
WORKDIR /apps/Client

# Install packages
RUN npm install

# Build the app
RUN npm run build

# Move to server app directory
WORKDIR /apps/Server

# Install packages
RUN npm install

# Build the app
RUN npm run build



# --------------- RUN STAGE --------------- #
FROM node:lts-alpine as run-stage

# Move to root directory of app
WORKDIR /app

# Only copy compiled files
COPY --from=build-stage ./apps/Server/build ./

# Copy client app to static directory of server app
COPY --from=build-stage ./apps/Client/build ./client

# Only install production-related packages
RUN npm install --omit=dev

# Copy environment variables
COPY ./Apps/Server/.env ./.env

# Set the STOPSIGNAL
STOPSIGNAL SIGTERM

# Expose necessary port to talk with service
EXPOSE 8000

# Set environment variables
ENV ENV=production

# Define command to run when launching the image
CMD ["node", "./src/index.js"]