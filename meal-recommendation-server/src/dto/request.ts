export interface UserProfile {
    userId: string;
    age: number;
    gender: string;
    heightCm: number;
    weightKg: number;
    activityLevel: string;
    dietaryPrefernces: string[]; 
    allergies: string[];
    healthConditions: string[];
    weightGoal: string;
}

export interface MealProfileBody {
    age: number,
    gender: string,
    heightCm: number,
    weightKg: number,
    activityLevel: string,
    dietaryPrefernces: string[],
    allergies: string[],
    healthConditions: string[],
    weightGoal: string,
  }