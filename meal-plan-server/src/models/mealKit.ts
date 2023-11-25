import { InferSchemaType, Schema, model } from "mongoose";

const MealKitSchema = new Schema({
    mealName: { type: Schema.Types.String, required: true },
    imageKey: { type: Schema.Types.String, required: true },
    duration: { type: Schema.Types.Number, required: true },
    pricing: { type: Schema.Types.String, required: true },
    focus: { type: Schema.Types.Boolean, required: true },
    ingredients: { type: Array<String>, required: true },
    basicItems: { type: Array<String>, required: true },
    nutritionInfo: { type: Array<String>, required: true },
    categories: { type: Array<'bachelorsCcorner' | 'familyFavourites' 
    | 'vegeterian' | 'carnivoreSpecial' | 'wellness' | 'theBoldChef'>, required: true },
});

type MealKit = InferSchemaType<typeof MealKitSchema>;

export default model<MealKit>('MealKit', MealKitSchema);