"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
var express_1 = require("express");
var morgan_1 = require("morgan");
var body_parser_1 = require("body-parser");
var http_errors_1 = require("http-errors");
var products_1 = require("./routes/products");
var validateEnv_1 = require("./utils/validateEnv");
var cors_1 = require("cors");
var app = (0, express_1.default)();
// enabling cors for all routes
app.use((0, cors_1.default)());
// Content-Type: application/json handling
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
// using morgan to log http requests into the console
if (validateEnv_1.default.ENVIRONMENT == 'development') {
    app.use((0, morgan_1.default)("dev"));
}
// products endpoint
app.use("/api/v1/products", products_1.default);
// middleware to handle an endpoint not found
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404, "Endpoint not found"));
});
// middleware to handle errors
app.use(function (error, req, res) {
    console.error(error);
    var errorMessage = "An unknown error occurred";
    var statusCode = 500;
    if ((0, http_errors_1.isHttpError)(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});
exports.default = app;
