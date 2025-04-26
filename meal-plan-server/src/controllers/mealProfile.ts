import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import MealProfileModel from "../models/mealProfile";
import { assertIsDefined } from "../utils/asserIsDefined";
import env from "../utils/validateEnv";
import { AIService } from "../infrastructure/recommendationEngine";
import { MealProfileBody } from "../dto/request";


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


// Create a new meal profile
export const createMealProfile: RequestHandler<unknown, unknown, MealProfileBody, unknown> = async (req, res, next) => {
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

    const {
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      dietaryPrefernces,
      allergies,
      healthConditions,
      weightGoal
    } = req.body;

    // Validate required fields
    if (!age || !gender || !heightCm || !weightKg || !activityLevel || !weightGoal) {
      throw createHttpError(400, "Missing required fields");
    }

    const newMealProfile = await MealProfileModel.create({
      userId: authenticatedUserId,
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      dietaryPrefernces,
      allergies,
      healthConditions,
      weightGoal
    });

    (async () => {
      try {
        const thread = await AIService.createThread();
        await AIService.sendMessageWithoutWait(thread.thread_id, {
          user_id: authenticatedUserId,
          age,
          gender,
          height_cm: heightCm,
          weight_kg: weightKg,
          activity_level: activityLevel,
          dietary_preferences: dietaryPrefernces,
          allergies,
          health_conditions: healthConditions,
          weight_goal: weightGoal,
          past_meals: []
        });
      } catch (error) {
        console.error('Error sending profile to AI:', error);
      }
    })();

    res.status(201).json(newMealProfile);

  } catch (err) {
    next(err);
  }
};

// Update a meal profile
export const updateMealProfile: RequestHandler<unknown, unknown, MealProfileBody, unknown> = async (req, res, next) => {
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

    const {
      age,
      gender,
      heightCm,
      weightKg,
      activityLevel,
      dietaryPrefernces,
      allergies,
      healthConditions,
      weightGoal
    } = req.body;

    // Find the existing meal profile
    const existingProfile = await MealProfileModel.findOne({ userId: authenticatedUserId });

    if (!existingProfile) {
      throw createHttpError(404, "Meal profile not found");
    }

    // Update the profile with new values
    existingProfile.age = age;
    existingProfile.gender = gender;
    existingProfile.heightCm = heightCm;
    existingProfile.weightKg = weightKg;
    existingProfile.activityLevel = activityLevel;
    existingProfile.dietaryPrefernces = dietaryPrefernces;
    existingProfile.allergies = allergies;
    existingProfile.healthConditions = healthConditions;
    existingProfile.weightGoal = weightGoal;

    const updatedProfile = await existingProfile.save();

    (async () => {
      try {
        const thread = await AIService.createThread();
        await AIService.sendMessageWithoutWait(thread.thread_id, {
          user_id: authenticatedUserId,
          age,
          gender,
          height_cm: heightCm,
          weight_kg: weightKg,
          activity_level: activityLevel,
          dietary_preferences: dietaryPrefernces,
          allergies,
          health_conditions: healthConditions,
          weight_goal: weightGoal,
          past_meals: []
        });
      } catch (error) {
        console.error('Error sending profile to AI:', error);
      }
    })();

    res.status(200).json(updatedProfile);

  } catch (err) {
    next(err);
  }
};

// Get user's meal profile
export const getMealProfile: RequestHandler = async (req, res, next) => {
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

    if (!mealProfile) {
      throw createHttpError(404, "Meal profile not found");
    }

    res.status(200).json(mealProfile);

  } catch (err) {
    next(err);
  }
};
