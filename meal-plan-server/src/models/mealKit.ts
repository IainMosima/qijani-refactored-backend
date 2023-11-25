import { InferSchemaType, Schema, model } from "mongoose";

const MealKitSchema = new Schema({
    mealName: { type: Schema.Types.String, required: true },
    imageKey: { type: Schema.Types.String, required: true },
    duration: { type: Schema.Types.Number, required: true },
    pricing: { type: Schema.Types.Number, required: true },
    focus: { type: Schema.Types.String, required: true },
    ingredients: { type: Array, required: true },
    basicItems: { type: Array, required: true },
    nutritionInfo: { type: Array, required: true },
    categories: { type: Array, required: true },
});

type MealKit = InferSchemaType<typeof MealKitSchema>;

export default model<MealKit>('MealKit', MealKitSchema);