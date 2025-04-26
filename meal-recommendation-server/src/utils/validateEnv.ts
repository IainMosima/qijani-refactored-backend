import { cleanEnv } from "envalid";
import { port, str } from "envalid/dist/validators";

// exporting validated environment variables
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRETY_KEY: str(),
    ENVIRONMENT: str(),
    AWS_BUCKET_MEAL_KIT: str(),
    AWS_REGION: str(),
    AWS_ACCESS_KEY_ID: str(),
    AWS_SECRET_KEY: str(),
});