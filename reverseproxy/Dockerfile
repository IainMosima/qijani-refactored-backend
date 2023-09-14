# Use the official NGINX base image
FROM nginx:latest

# Copy the custom NGINX configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf
COPY c3f1e07a88dbcc90.crt /etc/nginx/ssl/c3f1e07a88dbcc90.crt
COPY generated-private-key.key /etc/nginx/ssl/generated-private-key.key

# Set appropriate permissions for the files
# RUN chown nginx:nginx /etc/nginx/ssl/c3f1e07a88dbcc90.crt
# RUN chown nginx:nginx /etc/nginx/ssl/generated-private-key.key
# RUN chmod 400 /etc/nginx/ssl/c3f1e07a88dbcc90.crt
# RUN chmod 400 /etc/nginx/ssl/generated-private-key.key

EXPOSE 443
# EXPOSE 80

# Start NGINX in the foreground
CMD ["nginx", "-g", "daemon off;"]
