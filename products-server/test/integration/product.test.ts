import request from 'supertest';
import { app } from '../../src/app';
import { connect, disconnect } from '../../src/config/database';
import Product from '../../src/models/products';

describe('Product API', () => {
  beforeAll(async () => await connect());
  afterAll(async () => await disconnect());
  afterEach(async () => await Product.deleteMany({}));

  const sampleProduct = {
    productName: 'Test Product',
    categoryName: 'Test Category',
    price: 99.99,
    available: true,
    unit: 'piece'
  };

  describe('GET /products', () => {
    it('should return empty array when no products', async () => {
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });

    it('should return all products', async () => {
      await Product.create(sampleProduct);
      const res = await request(app).get('/products');
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].productName).toBe(sampleProduct.productName);
    });
  });

  describe('POST /products', () => {
    it('should create new product', async () => {
      const res = await request(app)
        .post('/products')
        .send(sampleProduct);
      
      expect(res.status).toBe(201);
      expect(res.body.productName).toBe(sampleProduct.productName);
      expect(res.body.price).toBe(sampleProduct.price);
    });

    it('should validate required fields', async () => {
      const res = await request(app)
        .post('/products')
        .send({});
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /products/:id', () => {
    it('should return product by id', async () => {
      const product = await Product.create(sampleProduct);
      const res = await request(app).get(`/products/${product._id}`);
      
      expect(res.status).toBe(200);
      expect(res.body.productName).toBe(sampleProduct.productName);
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app).get('/products/nonexistentid');
      expect(res.status).toBe(404);
    });
  });

  describe('GET /products/category', () => {
    it('should return products by category', async () => {
      await Product.create(sampleProduct);
      const res = await request(app)
        .get('/products/category')
        .query({ category: sampleProduct.categoryName });
      
      expect(res.status).toBe(200);
      expect(res.body.length).toBe(1);
      expect(res.body[0].categoryName).toBe(sampleProduct.categoryName);
    });
  });
}); 