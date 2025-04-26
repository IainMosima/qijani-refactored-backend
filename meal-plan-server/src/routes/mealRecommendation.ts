import express from "express";
import { storeMealRecommendationsCallback, getMealRecommendations, getNewMealRecommendations } from "../controllers/mealRecommendation";

const router = express.Router();

// Store meal recommendations
router.post("/callback", storeMealRecommendationsCallback);

// Get meal recommendations
router.get("/", getMealRecommendations);

// Get new meal recommendations
router.get("/new", getNewMealRecommendations);

export default router; 