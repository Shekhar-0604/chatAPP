# Stage 1: Build the Angular application
FROM node:latest as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Stage 2: Serve the application with Nginx
FROM nginx:latest
COPY --from=builder /app/dist/chat-app /usr/share/nginx/html
EXPOSE 80