import express from "express";
import * as ProductsController from "../controllers/products";
import multer from "multer";


const router = express.Router();
const upload = multer({ dest: "uploads/" })

// fetching all products
router.get('/', ProductsController.getProducts);

// fetching specified category
router.get('/category', ProductsController.getCategoryProducts);

// creating a new product
router.post('/', upload.single('productImg'), ProductsController.createProduct);

// updating a product
router.patch('/:productId', upload.single('productImg'), ProductsController.updateProduct);

// filtering a product
router.get('/query/:query', ProductsController.filterProducts);

// deleting a product
router.delete('/:productId', ProductsController.deleteProduct);

// fetching all available categories
router.get('/availableCategories', ProductsController.getAvailableCategories);

// adding a new category
router.post('/addCategory', ProductsController.updateCategories);

// deleting available category
router.post('/deleteCategory', ProductsController.deleteCategory);

// getting a product
router.get('/:productId', ProductsController.getProduct);

export default router;