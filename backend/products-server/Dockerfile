# Base image
FROM node:16

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy the rest of the application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Expose the port that your Express app is listening on
EXPOSE 3000

# Set environment variables
ENV MONGO_CONNECTION_STRING="mongodb+srv://nyakundi:IdijevVDAs95XI4C@cluster0.b3brhci.mongodb.net/e-soko?retryWrites=true&w=majority"
ENV PORT=5000
ENV CATEGORIESID="63fcc32ff42bde9cdb1b24d1"
ENV AWS_BUCKET_PRODUCTS_NAME="e-soko"
ENV AWS_REGION="us-east-1"
ENV AWS_ACCESS_KEY_ID="AKIA32Y6M4THUTJ457FA"
ENV AWS_SECRET_KEY="OVUgLss/72/wggNtQ2vpkkK9BE8ZydIlemHHQNUz"
ENV ENVIRONMENT='production'

# Set the command to run your Express app
CMD ["node", "dist/server.js"]
