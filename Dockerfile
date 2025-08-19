# === Base build stage ===
FROM node:18-alpine AS base

WORKDIR /app

# Copy package files
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./

# Copy source code
COPY ./src ./src

# Install all dependencies (including dev dependencies for building) 
RUN yarn install --frozen-lockfile

# Compile TypeScript
RUN yarn build


# === Production stage ===
FROM node:18-alpine AS production

WORKDIR /app
ENV NODE_ENV=production
    
# Copy package files
COPY package.json ./
COPY yarn.lock ./

# Install only production dependencies
RUN yarn install --production --frozen-lockfile

# Copy compiled output from base stage
COPY --from=base /app/dist ./dist

# Copy ecosystem config for PM2 if using PM2
COPY ecosystem.config.json ./

# Expose port (adjust if needed)
EXPOSE 3000

# Run the application
CMD ["node", "./dist/index.js"]
