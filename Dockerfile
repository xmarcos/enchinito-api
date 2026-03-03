# Use Node.js 20 as the base image for stability and compatibility
FROM node:20-slim

# Set the working directory inside the container
WORKDIR /app

# Copy package configuration files first to optimize layer caching
COPY package.json package-lock.json ./

# Install project dependencies quietly and skip post-install scripts (e.g., husky)
RUN npm install --no-audit --no-fund --quiet && \
    npm cache clean --force

# Copy the rest of the application code
COPY . .

# Expose the default Wrangler development port
EXPOSE 8787

# Use 'npx wrangler dev' to run the development server, binding to all interfaces
CMD ["npx", "wrangler", "dev", "--ip", "0.0.0.0", "--port", "8787"]
