import { Request, Response, NextFunction } from 'express';
import * as ProductController from '../../src/controllers/products';
import Product from '../../src/models/products';

jest.mock('../../src/models/products');

describe('Product Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
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

  describe('filterProducts', () => {
    it('should filter products by query', async () => {
      const mockProducts = [
        { productName: 'Apple', price: 1 },
        { productName: 'Banana', price: 2 }
      ];

      mockRequest.params = { query: 'Apple' };
      (Product.find as jest.Mock).mockResolvedValue(mockProducts);

      await ProductController.filterProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle filter error', async () => {
      const error = new Error('Database error');
      mockRequest.params = { query: 'test' };
      (Product.find as jest.Mock).mockRejectedValue(error);

      await ProductController.filterProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('getCategoryProducts', () => {
    it('should get products by category', async () => {
      const mockProducts = [
        { productName: 'Product 1', categoryName: 'Category 1' }
      ];

      mockRequest.query = { category: 'Category 1' };
      (Product.find as jest.Mock).mockResolvedValue(mockProducts);

      await ProductController.getCategoryProducts(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });
  });
}); 