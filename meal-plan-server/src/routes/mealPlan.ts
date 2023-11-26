import express from 'express';
import * as MealPlanController from "../controllers/mealPlan";

const router = express.Router();

// generate meal plan
router.post('/generateMealPlan', MealPlanController.generateMealPlan);

// delete a meal plan
router.delete('/:mealPlanId', MealPlanController.deleteMealPlan);

export default router;