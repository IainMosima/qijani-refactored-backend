"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ProductsController = require("../controllers/products");
var multer_1 = require("multer");
var router = express_1.default.Router();
var upload = (0, multer_1.default)({ dest: "uploads/" });
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
exports.default = router;
