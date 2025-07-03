# === Base build stage ===
FROM node:18.0.0-alpine AS base

WORKDIR /usr/src/app

# Copy project files
COPY package.json yarn.lock tsconfig.json ecosystem.config.json ./
COPY ./src ./src

# Install dependencies and compile TypeScript
RUN yarn install --pure-lockfile && yarn compile


# === Production stage ===
FROM node:18-alpine AS production

WORKDIR /usr/prod/app
ENV NODE_ENV=production

# Copy only required files for production
COPY package.json yarn.lock ecosystem.config.json ./
RUN yarn install --production --pure-lockfile

# Copy compiled output from base stage
COPY --from=base /usr/src/app/dist ./dist

# Optional: run command
CMD ["node", "dist/index.js"]
