import express from 'express';
import * as MealKitController from "../controllers/mealkit";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

//  fetching all mealKits
router.get('/', MealKitController.getAllMealKits);

// querying based on mealKit name and preference name
router.get('/query/:query', MealKitController.filterMeals);

// fetching specified mealkit based on preference
router.get('/:category', MealKitController.getMealKitPreference);

// creating a mealkit
router.post('/', upload.single('image'), MealKitController.createMealKit);

// updating a mealkit
router.patch('/:mealKitId', upload.single('image'), MealKitController.updateMealKit);

// deleting a mealkit
router.delete('/:mealKitId', MealKitController.deleteMealkit);

export default router;
