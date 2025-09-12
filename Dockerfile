FROM node:20.10.0

# Set working directory
WORKDIR /usr/src/avto-salon

# Copy package files
COPY package*.json ./
COPY yarn.lock ./

# Install dependencies with retry and timeout settings
RUN yarn config set network-timeout 300000 && \
    yarn config set registry https://registry.npmjs.org/ && \
    yarn install --frozen-lockfile --network-timeout 300000

# Copy source code
COPY . .

# Build the application
RUN yarn build

# Expose port
EXPOSE 3000

# Start production server
CMD ["yarn", "start"]
