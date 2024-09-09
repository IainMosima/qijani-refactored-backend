"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mongoose_1 = require("mongoose");
var categorySchema = new mongoose_1.Schema({
    categories: { type: Array }
});
exports.default = (0, mongoose_1.model)('Category', categorySchema);
