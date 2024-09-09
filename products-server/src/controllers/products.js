"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategories = exports.getAvailableCategories = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = exports.getCategoryProducts = exports.filterProducts = void 0;
var products_1 = require("../models/products");
var category_1 = require("../models/category");
var s3API = require("../aws/s3");
var http_errors_1 = require("http-errors");
var mongoose_1 = require("mongoose");
var validateEnv_1 = require("../utils/validateEnv");
var unlinkFIle_1 = require("../utils/unlinkFIle");
var productsBucket = validateEnv_1.default.AWS_BUCKET_PRODUCTS_NAME;
// getting query data
var filterProducts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var query, products, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                query = req.params.query;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, products_1.default.find({
                        $or: [
                            { productName: new RegExp('^' + query, 'i') },
                            { categoryName: new RegExp('^' + query, 'i') },
                        ]
                    })];
            case 2:
                products = _a.sent();
                res.status(200).json(products);
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                next(err_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.filterProducts = filterProducts;
// getting category data
var getCategoryProducts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var category, records, products, pipeline, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                category = req.query.category;
                records = req.query.records;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                products = void 0;
                if (!records) return [3 /*break*/, 3];
                pipeline = [
                    { $match: { categoryName: category } },
                    { $sample: { size: parseInt(records) } }
                ];
                return [4 /*yield*/, products_1.default.aggregate(pipeline)];
            case 2:
                products = _a.sent();
                return [3 /*break*/, 5];
            case 3: return [4 /*yield*/, products_1.default.find({ categoryName: category })];
            case 4:
                products = _a.sent();
                _a.label = 5;
            case 5:
                res.status(200).json(products);
                return [3 /*break*/, 7];
            case 6:
                error_1 = _a.sent();
                next(error_1);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.getCategoryProducts = getCategoryProducts;
// fetch all products available in the db
var getProducts = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var products, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, products_1.default.find().exec()];
            case 1:
                products = _a.sent();
                res.status(200).json(products);
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                next(error_2);
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); };
exports.getProducts = getProducts;
// geting a product
var getProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, error_3;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = req.params.productId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                if (!mongoose_1.default.isValidObjectId(productId)) {
                    throw (0, http_errors_1.default)(400, 'Invalid product id');
                }
                return [4 /*yield*/, products_1.default.findById(productId).exec()];
            case 2:
                product = _a.sent();
                if (!product) {
                    throw (0, http_errors_1.default)(404, 'product not found');
                }
                else {
                    res.status(200).json(product);
                }
                return [3 /*break*/, 4];
            case 3:
                error_3 = _a.sent();
                next(error_3);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getProduct = getProduct;
var createProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productName, categoryName, available, price, unit, productImg, productImgKey, result, newProduct, error_4;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productName = req.body.productName;
                categoryName = req.body.categoryName;
                available = req.body.available;
                price = req.body.price;
                unit = req.body.unit;
                productImg = req.file;
                if (!productName) {
                    throw (0, http_errors_1.default)(400, 'Product must have a title');
                }
                productImgKey = '';
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 9]);
                if (!productImg) return [3 /*break*/, 4];
                return [4 /*yield*/, s3API.uploadFile(productImg, productsBucket)];
            case 2:
                result = _a.sent();
                // deleting an image from the upload dir once uploaded
                return [4 /*yield*/, (0, unlinkFIle_1.unlinkFile)(productImg.path)];
            case 3:
                // deleting an image from the upload dir once uploaded
                _a.sent();
                if (result)
                    productImgKey = result;
                _a.label = 4;
            case 4: return [4 /*yield*/, products_1.default.create({
                    productName: productName,
                    productImgKey: productImgKey,
                    categoryName: categoryName,
                    price: price,
                    available: available,
                    unit: unit
                })];
            case 5:
                newProduct = _a.sent();
                res.status(200).json(newProduct);
                return [3 /*break*/, 9];
            case 6:
                error_4 = _a.sent();
                if (!productImgKey) return [3 /*break*/, 8];
                return [4 /*yield*/, s3API.deleteImage(productImgKey, productsBucket)];
            case 7:
                _a.sent();
                _a.label = 8;
            case 8:
                next(error_4);
                return [3 /*break*/, 9];
            case 9: return [2 /*return*/];
        }
    });
}); };
exports.createProduct = createProduct;
var updateProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, productName, categoryName, available, price, unit, productImg, product, imageKey, updatedProduct, error_5;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = req.params.productId;
                productName = req.body.productName;
                categoryName = req.body.categoryName;
                available = req.body.available;
                price = req.body.price;
                unit = req.body.unit;
                productImg = req.file;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 9, , 10]);
                if (!mongoose_1.default.isValidObjectId(productId)) {
                    throw (0, http_errors_1.default)(400, "Product must have a valid id");
                }
                return [4 /*yield*/, products_1.default.findById(productId).exec()];
            case 2:
                product = _a.sent();
                if (!product) {
                    throw (0, http_errors_1.default)(404, "Product not found");
                }
                if (productName)
                    product.productName = productName;
                if (categoryName)
                    product.categoryName = categoryName;
                if (available)
                    product.available = available;
                if (price)
                    product.price = price;
                if (unit)
                    product.unit = unit;
                if (!productImg) return [3 /*break*/, 7];
                if (!product.productImgKey) return [3 /*break*/, 4];
                return [4 /*yield*/, s3API.deleteImage(product.productImgKey, productsBucket)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: return [4 /*yield*/, s3API.uploadFile(productImg, productsBucket)];
            case 5:
                imageKey = _a.sent();
                // deleting an image from the upload dir once uploaded
                return [4 /*yield*/, (0, unlinkFIle_1.unlinkFile)(productImg.path)];
            case 6:
                // deleting an image from the upload dir once uploaded
                _a.sent();
                product.productImgKey = imageKey;
                _a.label = 7;
            case 7: return [4 /*yield*/, product.save()];
            case 8:
                updatedProduct = _a.sent();
                res.status(200).send({
                    success: true,
                    message: "Product updated successfully",
                    data: updatedProduct
                });
                return [3 /*break*/, 10];
            case 9:
                error_5 = _a.sent();
                next(error_5);
                return [3 /*break*/, 10];
            case 10: return [2 /*return*/];
        }
    });
}); };
exports.updateProduct = updateProduct;
// deleting a product from the mongodb and s3Bucket
var deleteProduct = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var productId, product, error_6;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                productId = req.params.productId;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 6, , 7]);
                if (!mongoose_1.default.isValidObjectId(productId)) {
                    throw (0, http_errors_1.default)(400, "Invalid id product!");
                }
                return [4 /*yield*/, products_1.default.findById(productId).exec()];
            case 2:
                product = _a.sent();
                if (!product) {
                    throw (0, http_errors_1.default)(404, "Product not found");
                }
                if (!product.productImgKey) return [3 /*break*/, 4];
                return [4 /*yield*/, s3API.deleteImage(product.productImgKey, productsBucket)];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4: 
            // deleting the product details from mongodb
            return [4 /*yield*/, product.remove()];
            case 5:
                // deleting the product details from mongodb
                _a.sent();
                res.sendStatus(204);
                return [3 /*break*/, 7];
            case 6:
                error_6 = _a.sent();
                next(error_6);
                return [3 /*break*/, 7];
            case 7: return [2 /*return*/];
        }
    });
}); };
exports.deleteProduct = deleteProduct;
// fetching all categories
var getAvailableCategories = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var id, response, error_7;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = validateEnv_1.default.CATEGORIESID;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, category_1.default.findById(id).exec()];
            case 2:
                response = _a.sent();
                if (response) {
                    res.status(200).json(response.categories);
                }
                else {
                    throw (0, http_errors_1.default)(400, "Invalid categories id");
                }
                return [3 /*break*/, 4];
            case 3:
                error_7 = _a.sent();
                next(error_7);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
exports.getAvailableCategories = getAvailableCategories;
var updateCategories = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, categoryName, categories, updateCategories_1, error_8;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryId = validateEnv_1.default.CATEGORIESID;
                categoryName = req.body.categoryName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (!mongoose_1.default.isValidObjectId(categoryId)) {
                    throw (0, http_errors_1.default)(400, "Categories must have a valid id");
                }
                return [4 /*yield*/, category_1.default.findById(categoryId).exec()];
            case 2:
                categories = _a.sent();
                if (!categories) {
                    throw (0, http_errors_1.default)(404, "Categories not found");
                }
                categories.categories = __spreadArray(__spreadArray([], categories.categories, true), [categoryName], false);
                return [4 /*yield*/, categories.save()];
            case 3:
                updateCategories_1 = _a.sent();
                res.status(200).send({
                    success: true,
                    message: "Categories updated successfully",
                    data: updateCategories_1
                });
                return [3 /*break*/, 5];
            case 4:
                error_8 = _a.sent();
                next(error_8);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.updateCategories = updateCategories;
// deleting a category
var deleteCategory = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var categoryId, categoryName, categories, updateCategories_2, err_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                categoryId = validateEnv_1.default.CATEGORIESID;
                categoryName = req.body.categoryName;
                _a.label = 1;
            case 1:
                _a.trys.push([1, 4, , 5]);
                if (!mongoose_1.default.isValidObjectId(categoryId)) {
                    throw (0, http_errors_1.default)(400, "Categories must have a valid id");
                }
                return [4 /*yield*/, category_1.default.findById(categoryId).exec()];
            case 2:
                categories = _a.sent();
                if (!categories) {
                    throw (0, http_errors_1.default)(404, "Categories not found");
                }
                categories.categories = categories.categories.filter(function (item) { return item !== categoryName; });
                return [4 /*yield*/, categories.save()];
            case 3:
                updateCategories_2 = _a.sent();
                res.status(200).send({
                    success: true,
                    message: "Category deleted successfully",
                    data: updateCategories_2
                });
                return [3 /*break*/, 5];
            case 4:
                err_2 = _a.sent();
                next(err_2);
                return [3 /*break*/, 5];
            case 5: return [2 /*return*/];
        }
    });
}); };
exports.deleteCategory = deleteCategory;
