import { RequestHandler } from "express";
import MealKitModel from "../models/mealKit";
import * as s3API from "../aws/s3";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import env from "../utils/validateEnv";
import { unlinkFile } from "../utils/unlinkFIle";

const mealKitBucket = env.AWS_BUCKET_MEAL_KIT;

// getting query data
export const filterMeals: RequestHandler = async (req, res, next) => {
    const query = req.params.query;

    try {
        const meals = await MealKitModel.find({
            $or: [
                { mealName: new RegExp('^' + query, 'i') },
                { categories: { $in: [new RegExp('^' + query, 'i')] } },
            ]
        });
        res.status(200).json(meals);
    } catch (err) {
        next(err);
    }
}

// getting preference (preference)
export const getMealKitPreference: RequestHandler = async (req, res, next) => {
    const category = req.params.category;

    try {
        const mealKits = await MealKitModel.find({ categories: { $in:[category] } });
        res.status(200).json(mealKits);

    } catch (error) {
        next(error);
    }
}


