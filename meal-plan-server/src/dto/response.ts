export interface AIRecommendedMeal {
    meal_name: string,
    meal_type: string,
    ingridients: string[],
    portion: string,
    preparation_steps: string[],
    prep_time_minutes: number,
    goal_support: string
}

export interface AIUserProfile {
    user_id: string, 
    age: number,
    gender: string,
    height_cm: number, 
    weight_kg: number,
    activity_level: string,
    dietary_preferences: string[],
    allergies: string[],
    health_conditions: string[],
    weight_goal: string,
    past_meals: string[]
}

export interface AIrecommendedMeals {
    user_profile: AIUserProfile,
    recommended_meals: AIRecommendedMeal[]
}