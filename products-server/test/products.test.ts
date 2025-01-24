import { Request, Response, NextFunction } from 'express';
import * as ProductsController from '../src/controllers/products';
import mongoose from 'mongoose';
import Product from '../src/models/products';

// Mock the Product model
jest.mock('../src/models/products');

describe('Products Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    // Reset mocks before each test
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return all products successfully', async () => {
      // Mock data
      const mockProducts = [
        { _id: '1', productName: 'Product 1', price: 100 },
        { _id: '2', productName: 'Product 2', price: 200 },
      ];

      // Mock the Product.find() method
      (Product.find as jest.Mock).mockResolvedValue(mockProducts);

      // Call the controller
      await ProductsController.getProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors when fetching products fails', async () => {
      // Mock an error
      const error = new Error('Database error');
      (Product.find as jest.Mock).mockRejectedValue(error);

      // Call the controller
      await ProductsController.getProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // Assertions
      expect(mockNext).toHaveBeenCalledWith(error);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });

  describe('getProduct', () => {
    it('should return a specific product by ID', async () => {
      const mockProduct = {
        _id: '123',
        productName: 'Test Product',
        price: 100
      };

      mockRequest = {
        params: { productId: '123' }
      };

      (Product.findById as jest.Mock).mockResolvedValue(mockProduct);

      await ProductsController.getProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should call next with error when product is not found', async () => {
      mockRequest = {
        params: { productId: 'nonexistent' }
      };

      (Product.findById as jest.Mock).mockResolvedValue(null);

      await ProductsController.getProduct(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalled();
      const error = (mockNext as jest.Mock).mock.calls[0][0];
      expect(error.status).toBe(404);
      expect(mockResponse.status).not.toHaveBeenCalled();
      expect(mockResponse.json).not.toHaveBeenCalled();
    });
  });
}); 