import app from "./app";
import env from "./utils/validateEnv";
import mongoose from "mongoose";

const port = env.PORT;

// setting strictQuery
mongoose.set('strictQuery', true);

// connection to mongoose db then running the epress app
mongoose.connect(env.MONGO_CONNECTION_STRING)
.then(() => {
    console.log("Mongoose connection established")
    app.listen(port, ()=>{
        console.log(`Qijani's products server running on port ${port}`);
    })
}).catch(console.error);
