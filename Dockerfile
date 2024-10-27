# Base Stage
FROM node:20-alpine as base
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy shared libraries and configurations
COPY src/lib /app/lib

# Producer Stage
FROM base as producer
WORKDIR /app/producer

# Copy producer-specific files
COPY src/producer/ . 
CMD ["node", "index.js"]

# Consumer Stage
FROM base as consumer
WORKDIR /app/consumer

# Copy consumer-specific files
COPY src/consumer/ . 
CMD ["node", "index.js"]

# Dashboard Stage
FROM base as dashboard
WORKDIR /app/dashboard

# Copy dashboard-specific files
COPY src/dashboard/ . 
CMD ["node", "server.js"]


FROM base as test
ENV NODE_ENV test
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --include=dev
USER node
COPY . .
RUN npm run test
