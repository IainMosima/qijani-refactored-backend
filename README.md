# Qijani Backend Services

This is the backend infrastructure for the Qijani application, built using a microservices architecture. Each service is designed to handle specific business functionality, making the system modular and scalable.

## Services Overview

- **Products Service**: Manages product catalog, categories, and product-related operations
- **Orders Service**: Handles order processing, tracking, and management
- **Authentication Service**: Manages user authentication and authorization
- **Payment Service**: Processes payments and handles financial transactions

## Technology Stack

- Node.js & TypeScript
- Express.js
- MongoDB
- AWS S3 (for file storage)
- Docker & Kubernetes
- Jest (for testing)

## Project Structure

```
backend/
├── products-server/     # Products microservice
├── orders-server/       # Orders microservice
├── auth-server/        # Authentication microservice
├── payment-server/     # Payment processing microservice
└── k8s/               # Kubernetes configuration files
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Docker
- Kubernetes (for production deployment)
- AWS Account (for S3 storage)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/qijani-backend.git
cd qijani-backend
```

2. Install dependencies for each service:
```bash
cd products-server && npm install
cd ../orders-server && npm install
cd ../auth-server && npm install
cd ../payment-server && npm install
```

3. Set up environment variables:
- Copy `.env.example` to `.env` in each service directory
- Update the variables with your configuration

### Development

To run services in development mode:

```bash
# In each service directory
npm run dev
```

### Testing

Each service includes its own test suite:

```bash
# In each service directory
npm test
```

### Building for Production

```bash
# In each service directory
npm run build
```

### Docker Deployment

Build and run services using Docker:

```bash
# Build images
docker-compose build

# Run services
docker-compose up
```

### Kubernetes Deployment

Deploy to Kubernetes cluster:

```bash
kubectl apply -f k8s/
```

## API Documentation

Each service exposes its own API endpoints. Detailed documentation can be found in the respective service directories:

- [Products Service API](./products-server/README.md)
- [Orders Service API](./orders-server/README.md)
- [Authentication Service API](./auth-server/README.md)
- [Payment Service API](./payment-server/README.md)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Contact

Your Name - your.email@example.com
Project Link: [https://github.com/yourusername/qijani-backend](https://github.com/yourusername/qijani-backend)