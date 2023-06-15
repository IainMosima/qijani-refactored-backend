import { cleanEnv } from "envalid";
import { port, str, num } from "envalid/dist/validators";

// exporting validated environment variables
export default cleanEnv(process.env, {
    MONGO_CONNECTION_STRING: str(),
    PORT: port(),
    SESSION_SECRETY_KEY: str(),
    ENVIRONMENT: str()
});