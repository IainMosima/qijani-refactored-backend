import { InferSchemaType, Schema, model } from "mongoose";
import { AIrecommendedMeals } from "../dto/response";


const MealRecommendationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, required: true },
    recommendedMeals: { type: Schema.Types.Mixed, required: true },
});

type MealRecommendation = InferSchemaType<typeof MealRecommendationSchema>;

export default model<MealRecommendation>('MealRecommendation', MealRecommendationSchema);