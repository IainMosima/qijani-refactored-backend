import { InferSchemaType, Schema, model } from "mongoose";
import MealKit from "../models/mealKit"

const MealPlanSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    category: { type: String, required: true },
    dayLength: { type: Number, required: true },
    mealsPerDay: { type: Number, required: true },
    serving: { type: String, required: true },
    mealKits: { type: Array<{
        kit: typeof MealKit[],
        days: string[]
    }>, required: true }
});

type MealPlan = InferSchemaType<typeof MealPlanSchema>;

export default model<MealPlan>('MealPlan', MealPlanSchema);