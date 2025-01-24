import Product from '../../src/models/products';
import mongoose from 'mongoose';
import { connect, disconnect } from '../../src/config/database';

describe('Product Model', () => {
  beforeAll(async () => await connect());
  afterAll(async () => await disconnect());
  afterEach(async () => await Product.deleteMany({}));

  it('should create product with valid data', async () => {
    const validProduct = {
      productName: 'Test Product',
      categoryName: 'Test Category',
      price: 99.99,
      available: true,
      unit: 'piece'
    };

    const product = await Product.create(validProduct);
    expect(product.productName).toBe(validProduct.productName);
    expect(product.price).toBe(validProduct.price);
  });

  it('should fail without required fields', async () => {
    const invalidProduct = {};
    
    await expect(Product.create(invalidProduct))
      .rejects
      .toThrow(mongoose.Error.ValidationError);
  });

  it('should validate price is positive', async () => {
    const invalidProduct = {
      productName: 'Test Product',
      categoryName: 'Test Category',
      price: -10,
      available: true,
      unit: 'piece'
    };

    await expect(Product.create(invalidProduct))
      .rejects
      .toThrow(mongoose.Error.ValidationError);
  });
}); 