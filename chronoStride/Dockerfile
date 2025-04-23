# chronoStride/Dockerfile

# Use a lightweight Node.js base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package manifests and install dependencies
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Copy the rest of your application code (src/, utils/, models/, etc.)
COPY . .

# Set production environment
ENV NODE_ENV=production

# Expose the port your app listens on
EXPOSE 3000

# Start your application
CMD ["npm", "start"]
