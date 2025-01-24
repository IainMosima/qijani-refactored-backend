# Qijani Products Service

This service manages the product catalog for the Qijani platform, including product listings, categories, and image management.

## Features

- Product CRUD operations
- Category management
- Product image upload and management using AWS S3
- Product filtering and search
- Category-based product retrieval

## Tech Stack

- Node.js & TypeScript
- Express.js
- MongoDB (with Mongoose)
- AWS S3 for image storage
- Jest for testing
- Docker

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- AWS Account with S3 access
- Docker (optional)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Configuration
MONGO_CONNECTION_STRING=your_mongodb_connection_string

# AWS Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_BUCKET_PRODUCTS_NAME=your_s3_bucket_name

# Server Configuration
PORT=5000
CATEGORIESID=your_categories_id
ENVIRONMENT=development
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables as described above

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Products

- `GET /products` - Get all products
- `GET /products/:productId` - Get a specific product
- `POST /products` - Create a new product
- `PATCH /products/:productId` - Update a product
- `DELETE /products/:productId` - Delete a product
- `GET /products/query/:query` - Search/filter products
- `GET /products/category` - Get products by category

### Categories

- `GET /products/availableCategories` - Get all available categories
- `POST /products/addCategory` - Add a new category
- `POST /products/deleteCategory` - Delete a category

## Request & Response Examples

### Get All Products

Request:
```http
GET /products
```

Response:
```json
[
  {
    "_id": "123",
    "productName": "Sample Product",
    "productImgKey": "products/image123.jpg",
    "categoryName": "Electronics",
    "price": 99.99,
    "available": true,
    "unit": "piece"
  }
]
```

### Create Product

Request:
```http
POST /products
Content-Type: multipart/form-data

{
  "productName": "New Product",
  "categoryName": "Electronics",
  "price": 199.99,
  "available": true,
  "unit": "piece",
  "productImg": [binary_file]
}
```

Response:
```json
{
  "_id": "124",
  "productName": "New Product",
  "productImgKey": "products/image124.jpg",
  "categoryName": "Electronics",
  "price": 199.99,
  "available": true,
  "unit": "piece"
}
```

## Testing

Run the test suite:

```bash
npm test
```

Run tests with coverage:

```bash
npm test -- --coverage
```

## Docker Deployment

Build the Docker image:

```bash
docker build -t qijani-products-service .
```

Run the container:

```bash
docker run -p 5000:5000 --env-file .env qijani-products-service
```

## Error Handling

The service uses standard HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `500` - Internal Server Error

Error responses follow this format:

```json
{
  "error": "Error message description"
}
```

## Development

### File Structure

```
products-server/
├── src/
│   ├── controllers/    # Request handlers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── utils/         # Utility functions
│   ├── aws/          # AWS configurations
│   ├── app.ts        # Express app setup
│   └── server.ts     # Server entry point
├── test/             # Test files
├── dist/             # Compiled JavaScript
└── uploads/          # Temporary file uploads
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run lint` - Run linter

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License. 