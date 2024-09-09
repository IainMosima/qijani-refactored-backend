"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var envalid_1 = require("envalid");
var validators_1 = require("envalid/dist/validators");
// exporting validated environment variables
exports.default = (0, envalid_1.cleanEnv)(process.env, {
    MONGO_CONNECTION_STRING: (0, validators_1.str)(),
    PORT: (0, validators_1.port)(),
    CATEGORIESID: (0, validators_1.str)(),
    AWS_BUCKET_PRODUCTS_NAME: (0, validators_1.str)(),
    AWS_REGION: (0, validators_1.str)(),
    AWS_ACCESS_KEY_ID: (0, validators_1.str)(),
    AWS_SECRET_KEY: (0, validators_1.str)(),
    ENVIRONMENT: (0, validators_1.str)()
});
