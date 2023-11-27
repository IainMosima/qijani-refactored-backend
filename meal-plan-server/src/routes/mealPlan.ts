import express from 'express';
import * as MealPlanController from "../controllers/mealPlan";

const router = express.Router();

// getting a user's meal plan
router.get('/', MealPlanController.getUserMealPlan);

// get all meal plans
router.get('/all', MealPlanController.getAllMealPlans);

// generate meal plan
router.post('/generateMealPlan', MealPlanController.generateMealPlan);

// delete a meal plan
router.delete('/:mealPlanId', MealPlanController.deleteMealPlan);

// saving a meal plan
router.post('/saveMealPlan', MealPlanController.saveMealPlan);

export default router;