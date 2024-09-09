"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app_1 = require("./app");
var validateEnv_1 = require("./utils/validateEnv");
var mongoose_1 = require("mongoose");
var port = validateEnv_1.default.PORT;
// setting strictQuery
mongoose_1.default.set('strictQuery', true);
// connection to mongoose db then running the express app
mongoose_1.default.connect(validateEnv_1.default.MONGO_CONNECTION_STRING)
    .then(function () {
    console.log("Mongoose connection established");
    app_1.default.listen(port, function () {
        console.log("Qijani's products server running on port ".concat(port));
    });
}).catch(console.error);
