# Use the official NGINX base image
FROM nginx:latest

# Copy the custom NGINX configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80 (the default NGINX HTTP port)
EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
