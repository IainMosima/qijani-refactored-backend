import { InferSchemaType, Schema, model } from "mongoose";

export interface NutritionInfo {
    per100: {
        energyKj: number,
        energyKc: number,
        protein: number,
        glycaemicCarbohydrate: number,
        totalSugar: number,
        totalFat: number,
        saturatedFat: number,
        dietaryFibre: number,
        totalSodium: number
    },
    perServing: {
        energyKj: number,
        energyKc: number,
        protein: number,
        glycaemicCarbohydrate: number,
        totalSugar: number,
        totalFat: number,
        saturatedFat: number,
        dietaryFibre: number,
        totalSodium: number
    },
    allergens: string[]
}

const MealKitSchema = new Schema({
    mealName: { type: String, required: true },
    imageKey: { type: String, required: true },
    duration: { type: Number, required: true },
    pricing: { type: Number, required: true },
    focus: { type: String, required: true },
    ingredients: { type: Array, required: true },
    basicItems: { type: Array, required: true },
    nutritionInfo: { type: Object as any as NutritionInfo, required: true },
    preferences: { type: Array, required: true },
    weight: { type: String, required: true },
});

type MealKit = InferSchemaType<typeof MealKitSchema>;

export default model<MealKit>('MealKit', MealKitSchema);