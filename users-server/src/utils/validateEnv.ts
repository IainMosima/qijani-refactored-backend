import { cleanEnv } from "envalid";
import { port, str, num } from "envalid/dist/validators";

// exporting validated environment variables
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRETY_KEY: str(),
    AWS_BUCKET_USERS_NAME: str(),
    AWS_REGION: str(),
    AWS_ACCESS_KEY_ID: str(),
    AWS_SECRET_KEY: str(),
    ENVIRONMENT: str()
});