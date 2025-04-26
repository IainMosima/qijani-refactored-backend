import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../utils/validateEnv";
import jwt from "jsonwebtoken";


const secretKey = env.SESSION_SECRETY_KEY;

export const requireAuth: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization as string;
    if (!token) {
        next(createHttpError(401, 'Unauthorized'));
    }
    next()
    // jwt.verify(token.split(' ')[1] || ' ', secretKey, (err, decoded) => {
    //     if (err) {
    //         next(createHttpError(401, 'Invalid token'));
    //     }
    //     next();
    // });
}