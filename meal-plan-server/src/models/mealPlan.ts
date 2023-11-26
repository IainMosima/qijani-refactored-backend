import { InferSchemaType, Schema, model } from "mongoose";

export interface Kit {
    _id: string,
    mealName: string,
    imageKey: string,
    duration: string,
    pricing: string,
    focus: string,
    ingredients: string,
    basicItems: string,
    nutritionInfo: string,
    categories: string,
    weight: string,
    date: Date,
    mealTime: string,
}

const MealPlanSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    preference: { type: String, required: true },
    daysLength: { type: Number, required: true },
    mealsPerDay: { type: Number, required: true },
    serving: { type: String, required: true },
    mealKits: { type: Array<Kit>, required: true },
});

type MealPlan = InferSchemaType<typeof MealPlanSchema>;

export default model<MealPlan>('MealPlan', MealPlanSchema);