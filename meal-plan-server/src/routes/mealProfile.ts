import express from "express";
import * as MealProfileController from "../controllers/mealProfile";

const router = express.Router();

// Create a new meal profile
router.post('/', MealProfileController.createMealProfile);

// Update user's meal profile
router.patch('/', MealProfileController.updateMealProfile);

// Get user's meal profile
router.get('/', MealProfileController.getMealProfile);

export default router;
