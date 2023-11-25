import { RequestHandler } from "express";
import MealKitModel from "../models/mealKit";
import * as s3API from "../aws/s3";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import env from "../utils/validateEnv";
import { unlinkFile } from "../utils/unlinkFIle";

const mealKitBucket = env.AWS_BUCKET_MEAL_KIT;

// getting all mealkits
export const getAllMealKits: RequestHandler =async (req, res, next) => {
    try {
        const mealkits = await MealKitModel.find().exec();
        res.status(200).json(mealkits);
    } catch (error) {
        next(error);
    } 
}

// querying based on preference or meal name
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

// getting mealkit based on preference
export const getMealKitPreference: RequestHandler = async (req, res, next) => {
    const category = req.params.category;

    try {
        const mealKits = await MealKitModel.find({ categories: { $in: [category] } });
        res.status(200).json(mealKits);

    } catch (error) {
        next(error);
    }
}

// crete a new meal kit
interface MealKitBody {
    mealName: string,
    image: File,
    duration: number,
    pricing: number,
    focus: string,
    ingredients: string[],
    basicItems: string[],
    nutritionInfo: string[],
    categories: string[],
}

export const createMealKit: RequestHandler<unknown, unknown, MealKitBody, unknown> = async (req, res, next) => {
    const mealName = req.body.mealName;
    const image = req.file;
    const duration = req.body.duration;
    const pricing = req.body.pricing;
    const focus = req.body.focus;
    const ingredients = req.body.ingredients;
    const basicItems = req.body.basicItems;
    const nutritionInfo = req.body.nutritionInfo;
    const categories = req.body.categories;

    if (!mealName) {
        throw createHttpError(400, 'MealKit must have a title');
    }

    let imageKey = '';

    try {
        if (image) {
            const result = await s3API.uploadFile(image, mealKitBucket);
            // deleting an image from the upload dir once uploaded
            await unlinkFile(image.path);

            if (result) imageKey = result;
        }

        // uploading the other records to mongodb
        const newMealKit = await MealKitModel.create({
            mealName: mealName,
            imageKey: imageKey,
            duration: duration,
            pricing: pricing,
            focus: focus,
            ingredients: ingredients,
            basicItems: basicItems,
            nutritionInfo: nutritionInfo,
            categories: categories,
        });

        res.status(200).json(newMealKit);
    } catch (error) {
        // deleting the uploaded Image from s3 if it exists
        if (mealKitBucket) {
            await s3API.deleteImage(imageKey, mealKitBucket);
        }
        next(error);
    }
}

// updating a product
interface UpdateProductParam {
    mealKitId: mongoose.Types.ObjectId;
}

interface UpdateProductBody {
    mealName?: string,
    image?: File,
    duration?: number,
    pricing?: number,
    focus?: string,
    ingredients?: string[],
    basicItems?: string[],
    nutritionInfo?: string[],
    categories?: string[],
}
// <'bachelorsCcorner' | 'familyFavourites' | 'vegeterian' | 'carnivoreSpecial' | 'wellness' | 'theBoldChef'>
export const updateMealKit: RequestHandler<unknown, unknown, UpdateProductBody, unknown> = async (req, res, next) => {
    const mealKitId = (req.params as unknown as UpdateProductParam).mealKitId;
    const mealName = req.body.mealName;
    const image = req.file;
    const duration = req.body.duration;
    const pricing = req.body.pricing;
    const focus = req.body.focus;
    const ingredients = req.body.ingredients;
    const basicItems = req.body.basicItems;
    const nutritionInfo = req.body.nutritionInfo;
    const categories = req.body.categories;

    try {
        if (!mongoose.isValidObjectId(mealKitId)) {
            throw createHttpError(400, "Invalid mealKit id");
        }

        const mealKit = await MealKitModel.findById(mealKitId).exec();

        if (!mealKit) {
            throw createHttpError(400, "Invalid mealKit id");
        }

        if (mealName) mealKit.mealName = mealName;
        if (duration) mealKit.duration = duration;
        if (pricing) mealKit.pricing = pricing;
        if (focus) mealKit.focus = focus;
        if (ingredients) (mealKit.ingredients) = ingredients;
        if (basicItems) mealKit.basicItems = basicItems;
        if (nutritionInfo) mealKit.nutritionInfo = nutritionInfo;
        if (categories) mealKit.categories = categories;

        if (image) {
            // deletinng the image from the s3 bucket
            if (mealKit.imageKey) {
                await s3API.deleteImage(mealKit.imageKey, mealKitBucket);
            }
            // uploading the new image to s3
            const imageKey = await s3API.uploadFile(image, mealKitBucket);
            // deleting an image from the upload dir once uploaded
            await unlinkFile(image.path);

            mealKit.imageKey = imageKey;
        }

        const updatedMealKit = await mealKit.save();
        res.status(200).json(updatedMealKit);

    } catch (error) {
        next(error);
    }
}

// deleting a mealkit
export const deleteMealkit: RequestHandler = async (req, res, next) => {
    const mealkitId = req.params.mealKitId;

    try {
        if (!mongoose.isValidObjectId(mealkitId)) {
            throw createHttpError(400, "Invalid id!");
        }

        const mealkit = await MealKitModel.findById(mealkitId);

        if (!mealkit) {
            throw createHttpError(404, "Mealkit not found!");
        }

               // deleting the image from the s3 bucket
               if (mealkit.imageKey) {
                await s3API.deleteImage(mealkit.imageKey, mealKitBucket);
            }
    
            // deleting the product details from mongodb
            await mealkit.remove();

            res.sendStatus(204);
    } catch (error) {
        next(error);
    }
}