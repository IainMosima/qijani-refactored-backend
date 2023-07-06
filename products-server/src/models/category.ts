import {InferSchemaType, Schema, model} from "mongoose";

const categorySchema = new Schema({
    categories: { type: Array }
});

type Category = InferSchemaType<typeof categorySchema>;

export default model<Category>('Category', categorySchema);