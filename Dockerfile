FROM node:lts AS builder

# make workdir /app
WORKDIR /app

# install pnpm
RUN corepack enable && corepack prepare pnpm@v7.32.2 --activate

# Install requested packages
COPY pnpm-lock.yaml ./
RUN pnpm fetch

# Copy app source and install dependencies
COPY . .
RUN pnpm install -r --offline --ignore-scripts

# transpile to js
RUN pnpm build

FROM node:lts-alpine AS final

# make workdir /app
WORKDIR /app

# install pnpm
RUN corepack enable && corepack prepare pnpm@v7.32.2 --activate

# Fetch production packages
COPY pnpm-lock.yaml ./
RUN pnpm fetch --prod

# copy transpiled code, install prod dependencies
COPY --from=builder ./app/dist ./dist
COPY package.json .
RUN pnpm install -r --offline --prod --ignore-scripts

# start server
CMD cd dist && node deploy-commands.js && node .