"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var productsSchema = new mongoose_1.Schema({
    productName: { type: String, required: true },
    productImgKey: { type: String },
    categoryName: { type: String, required: true },
    price: { type: Number, required: true },
    available: { type: Boolean },
    unit: { type: String, required: true },
});
exports.default = (0, mongoose_1.model)("Product", productsSchema);
