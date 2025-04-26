import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import { AIrecommendedMeals } from "../dto/response";
import { AIService } from "../infrastructure/recommendationEngine";
import MealProfileModel from "../models/mealProfile";
import MealRecommednationModel from "../models/recommendedMeal";
import { assertIsDefined } from "../utils/asserIsDefined";
import env from "../utils/validateEnv";


const secretKey = env.SESSION_SECRETY_KEY;

interface User {
  _id: string,
  username: string,
  email: string,
  location: string,
  phoneNumber: string,
  profileImgKey: string,
  county: string,
  area: string,
  landmark: string,
  iat: number,
  exp: number,
}


// Store meal recommendations for a user
export const storeMealRecommendationsCallback: RequestHandler<unknown, unknown, AIrecommendedMeals, unknown> = async (req, res, next) => {
  let authenticatedUserId = req.body.user_profile.user_id;

  try {
    assertIsDefined(authenticatedUserId);

    const { recommended_meals: recommendedMeals } = req.body;

    // Validate required fields
    if (!recommendedMeals || !Array.isArray(recommendedMeals) || recommendedMeals.length === 0) {
      throw createHttpError(400, "Invalid meal recommendations data");
    }

    // Check if user profile exists
    const existingRecommendation = await MealRecommednationModel.findOne({ userId: authenticatedUserId });

    if (existingRecommendation) {
      // Update existing recommendations
      await MealRecommednationModel.updateOne(
        { userId: authenticatedUserId },
        { recommendedMeals: req.body.recommended_meals }
      );
      res.status(200).json({
        msg: "Successfully updated meal recommendations"
      });
    } else {
      // Create new recommendations
      await MealRecommednationModel.create({
        userId: authenticatedUserId,
        recommendedMeals: req.body.recommended_meals
      });
      res.status(201).json({
        msg: "Successfully created new meal recommendations"
      });
    }

  } catch (err) {
    next(err);
  }
};

// Get user's meal recommendations
export const getMealRecommendations: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization as string;
  let authenticatedUserId = '';

  jwt.verify(token.split(' ')[1] || ' ', secretKey, (err, decoded) => {
    if (!token) {
      next(createHttpError(401, 'Unauthorized'));
    }
    const user = decoded as User;
    if (user) {
      authenticatedUserId = user._id;
    }
  });

  try {
    assertIsDefined(authenticatedUserId);

    const mealRecommendations = await MealRecommednationModel.find({ userId: authenticatedUserId });

    res.status(200).json(mealRecommendations);

  } catch (err) {
    next(err);
  }
}; 

export const getNewMealRecommendations: RequestHandler = async (req, res, next) => {
  const token = req.headers.authorization as string;
  let authenticatedUserId = '';

  jwt.verify(token.split(' ')[1] || ' ', secretKey, (err, decoded) => {
    if (!token) {
      next(createHttpError(401, 'Unauthorized'));
    }
    const user = decoded as User;
    if (user) {
      authenticatedUserId = user._id;
    }
  });

  try {
    assertIsDefined(authenticatedUserId);

    const mealProfile = await MealProfileModel.findOne({ userId: authenticatedUserId });

    const priorMealRecommendation = await MealRecommednationModel.findOne({ userId: authenticatedUserId })

    if (!mealProfile) {
      throw createHttpError(404, "Meal profile not found");
    }

    const thread = await AIService.createThread();

    const userProfile = {
      user_id: authenticatedUserId,
      age: mealProfile.age,
      gender: mealProfile.gender,
      height_cm: mealProfile.heightCm,
      weight_kg: mealProfile.weightKg,
      activity_level: mealProfile.activityLevel,
      dietary_preferences: mealProfile.dietaryPrefernces,
      allergies: mealProfile.allergies,
      health_conditions: mealProfile.healthConditions,
      weight_goal: mealProfile.weightGoal,
      past_meals: priorMealRecommendation?.recommendedMeals || [] 
    };

    const recommendations = await AIService.sendMessageWithWait(thread.thread_id, userProfile);

    res.status(200).json(recommendations);

  } catch (err) {
    next(err);
  }
};