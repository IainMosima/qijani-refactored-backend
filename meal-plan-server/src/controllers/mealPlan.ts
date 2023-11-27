import { RequestHandler } from "express";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import MealPlanModel, { Kit } from "../models/mealPlan";
import MealKitModel from "../models/mealKit";
import jwt from "jsonwebtoken";
import env from "../utils/validateEnv";
import { assertIsDefined } from "../utils/asserIsDefined";
import pickAndRemoveRandomItem from "../utils/pickAndRemoveRandomItem";

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
    landmark: string
}

interface MealPlanBody {
    preference: string,
    daysLength: number,
    mealsPerDay: number,
    serving: number,
}
interface MealKitDB {
    _id: string,
    mealName: string,
    imageKey: string,
    duration: string,
    pricing: string,
    focus: string,
    ingredients: string,
    basicItems: string,
    nutritionInfo: string,
    categories: string,
    weight: string,
}
// generate a meal plan for a user based on preference
export const generateMealPlan: RequestHandler<unknown, unknown, MealPlanBody, unknown> = async (req, res, next) => {
    const token = req.headers.authorization as string;
    let authenticatedUserId = '';
    const preference = req.body.preference;
    const mealsPerDay = req.body.mealsPerDay;
    const daysLength = req.body.daysLength;
    const serving = req.body.serving;
    let mealPlan;

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
        // filtering meals based on preference and meals
        const pipeline = [
            { $match: { preferences: { $in: [preference] } } },
            // { $sample: { size: mealsPerDay } }
        ];

        // filtering
        const meals = await MealKitModel.aggregate(pipeline).exec() as MealKitDB[];

        const currentDate = new Date();
        let mealKits: Kit[] = [];
        if (mealsPerDay === 1) {
            const mealTimes = ['lunch', 'supper'];
            const selectedMealKits = meals.filter(meal => meal.weight === 'heavy');

            // appending to mealKits
            for (let i = 0; i < daysLength; i++) {
                const pickedMealTime = mealTimes[Math.round(Math.random())];
                const pickedMealKit = pickAndRemoveRandomItem(selectedMealKits);
                if (pickedMealKit) {
                    mealKits.push({
                        ...pickedMealKit,
                        date: currentDate,
                        mealTime: pickedMealTime
                    });
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            // assignin the mealkit 
            mealPlan = {
                userId: authenticatedUserId,
                preference: preference,
                mealsPerDay: mealsPerDay,
                daysLength: daysLength,
                serving: serving,
                mealKits: mealKits,
            }

        } else if (mealsPerDay === 2) {
            const selectedMealKits = meals.filter(meal => meal.weight === 'heavy');
            const mealTimes = ['lunch', 'supper'];
            // appending to mealkits
            for (let i = 0; i < daysLength; i++) {
                for (const mealTime of mealTimes) {
                    const pickedMealKit = pickAndRemoveRandomItem(selectedMealKits);
                    if (pickedMealKit) {
                        mealKits.push({
                            ...pickedMealKit,
                            date: currentDate,
                            mealTime: mealTime
                        });
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            // assignin the mealkits
            mealPlan = {
                userId: authenticatedUserId,
                preference: preference,
                mealsPerDay: mealsPerDay,
                daysLength: daysLength,
                serving: serving,
                mealKits: mealKits,
            }
        } else if (mealsPerDay === 3) {
            const heavyMealKits = meals.filter(meal => meal.weight === 'heavy');
            const lightMealKits = meals.filter(meal => meal.weight === 'light');
            const mealTimes = ['breakfast', 'lunch', 'supper'];
            // appending to mealkits
            for (let i = 0; i < daysLength; i++) {
                for (const mealTime in mealTimes) {
                    if (mealTime === 'breakfast') {
                        const pickedMealKit = pickAndRemoveRandomItem(lightMealKits);
                        if (pickedMealKit) {
                            mealKits.push({
                                ...pickedMealKit,
                                date: currentDate,
                                mealTime: mealTime
                            });
                            currentDate.setDate(currentDate.getDate() + 1);
                        }
                    } else {
                        const pickedMealKit = pickAndRemoveRandomItem(heavyMealKits);
                        if (pickedMealKit) {
                            mealKits.push({
                                ...pickedMealKit,
                                date: currentDate,
                                mealTime: mealTime
                            });
                        }
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
            // assignin the mealkits
            mealPlan = {
                userId: authenticatedUserId,
                preference: preference,
                mealsPerDay: mealsPerDay,
                daysLength: daysLength,
                serving: serving,
                mealKits: mealKits,
            }


        } else {
            throw createHttpError(422, 'Meal plans per day must be 3,2 or 1');
        }

        res.status(200).json(mealPlan);


    } catch (error) {
        next(error);
    }
}

// deleting a mealplan
export const deleteMealPlan: RequestHandler = async (req, res, next) => {
    const mealPlanId = req.params.mealPlanId;

    try {
        if (!mongoose.isValidObjectId(mealPlanId)) {
            throw createHttpError(400, "Invalid id!");
        }

        const mealPlan = await MealPlanModel.findById(mealPlanId);

        if (!mealPlan) {
            throw createHttpError(404, "Mealkit not found!");
        }

        // deleting the product details from mongodb
        await mealPlan.remove();

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}

// getting all meal plans
export const getAllMealPlans: RequestHandler = async (req, res, next) => {
    try {
        const mealPlans = await MealPlanModel.find().exec();
        res.status(200).json(mealPlans);
    } catch (error) {
        next(error);
    }
}

// getting a users meal plan
// getting packages belonging to a specific user
export const getUserMealPlan: RequestHandler = async (req, res, next) => {
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
    })

    try {
        assertIsDefined(authenticatedUserId);

        const mealPlan = await MealPlanModel.find({ userId: authenticatedUserId }).exec();

        res.status(200).json(mealPlan);

    } catch (err) {
        next(err);
    }
}

// new meal plan body
interface MealPlanBody {
    preference: string,
    daysLength: number,
    mealsPerDay: number,
    serving: number,
    mealKits: Kit[],
}

// saving a meal plan
export const saveMealPlan: RequestHandler<unknown, unknown, MealPlanBody, unknown> = async (req, res, next) => {
    const token = req.headers.authorization as string;
    const preference = req.body.preference;
    const daysLength = req.body.daysLength;
    const mealsPerDay = req.body.mealsPerDay;
    const serving = req.body.serving;
    const mealKits = req.body.mealKits;

    let authenticatedUserId = '';

    jwt.verify(token.split(' ')[1] || ' ', secretKey, (err, decoded) => {
        if (!token) {
            next(createHttpError(401, 'Unauthorized'));
        }
        const user = decoded as User;
        if (user) {
            authenticatedUserId = user._id;
        }
    })

    try {
        const newMealPlan = await MealPlanModel.create({
            userId: authenticatedUserId,
            preference: preference,
            daysLength: daysLength,
            mealsPerDay: mealsPerDay,
            serving: serving,
            mealKits: mealKits,
        });

        res.status(200).json(newMealPlan);
    } catch (error) {
        next(error);
    }



}