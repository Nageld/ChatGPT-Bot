FROM node:lts

# make workdir /ap
WORKDIR /app

# install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install requested packages
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy app source, ignoring config.json
COPY . .

# Run pnpm deploy-cmd, pnpm start
CMD pnpm deploy-cmd; pnpm start