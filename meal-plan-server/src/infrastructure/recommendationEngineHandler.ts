import { AIUserProfile } from "../dto/response";
import { AIService } from "./recommendationEngine";

export default async function testAI() {
    try {
        const threadIdJson = await AIService.createThread();
        const threadId = threadIdJson.thread_id;

        const exampleUserProfile: AIUserProfile = {
            user_id: "brucewayne",
            age: 35,
            gender: "male",
            height_cm: 185,
            weight_kg: 75,
            activity_level: "Very Active",
            allergies: [],
            health_conditions: [],
            dietary_preferences: [
                "low carb", "high proteins", "low sugar"
            ],
            weight_goal: "Gain muscles",
            past_meals: []
        };

        const aiResponse = await AIService.sendMessageWithWait(threadId, exampleUserProfile);
        return aiResponse;

    } catch (err) {
        console.error("❌ Error in testAI():", err);
    }
}

testAI();