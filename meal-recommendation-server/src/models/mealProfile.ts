import { InferSchemaType, Schema, model } from "mongoose";


const MealProfileSchema = new Schema({
    userId: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    heightCm: { type: Number, required: true },
    weightKg: { type: Number, required: true },
    activityLevel: { type: String, required: true },
    dietaryPrefernces: { type: Array, required: true },
    allergies: { type: Array, required: true },
    healthConditions: { type: Array, required: true },
    weightGoal: { type: String, required: true },
});

type MealProfile = InferSchemaType<typeof MealProfileSchema>;

export default model<MealProfile>('MealProfile', MealProfileSchema);