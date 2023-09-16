import { RequestHandler } from "express";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import * as s3API from "../aws/s3";
import UserModel from "../models/users";
import * as AuthSec from "../utils/authSec";
import { unlinkFile } from "../utils/unlinkFIle";
import env from "../utils/validateEnv";


const usersBucket = env.AWS_BUCKET_USERS_NAME;
const secretKey = env.SESSION_SECRETY_KEY;
// checking if a user is logged in
export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const token = req.headers.authorization as string;
    if (!token) {
        res.status(401).send('Unauthorized');
    }
    jwt.verify(token.split(' ')[1] || ' ', secretKey, (err, decoded) => {
        if (err) {
            res.status(401).send('Invalid token');
        }
        res.status(200).json(decoded);
    });
}

// checking if username exists
export const checkUername: RequestHandler = async (req, res, next) => {
    const query = req.params.query;

    try {
        const user = await UserModel.findOne({ username: query });

        if (user) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch (err) {
        next(err);
    }
}

// checking if email exists
export const checkEmail: RequestHandler = async (req, res, next) => {
    const query = req.params.query;

    try {
        const user = await UserModel.findOne({ email: query });
        if (user) {
            res.status(200).send(true);
        } else {
            res.status(200).send(false);
        }
    } catch (err) {
        next(err);
    }
}


//  signing up a new user
interface SignupBody {
    username?: string,
    email?: string,
    phoneNumber?: string,
    location?: string,
    password?: string,
    profileImg?: File,
    county?: string,
    area?: string,
    landmark?: string,
}

export const signup: RequestHandler<unknown, unknown, SignupBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const location = req.body.location;
    const password = req.body.password;
    const profileImg = req.file;
    const county = req.body.county
    const area = req.body.area
    const landmark = req.body.landmark

    try {
        if (!username || !email || !phoneNumber || !location || !password) throw createHttpError(400, "Missing necessary parameters");

        const existingUser = await UserModel.findOne({ username: username }).exec();

        if (existingUser) throw createHttpError(404, "Username already taken. Try a different username one");

        const existingEmail = await UserModel.findOne({ email: email }).exec();

        if (existingEmail) throw createHttpError(404, "Email already taken. Try a different email");

        // enctypting the password before storing it to th db
        const hasedAndSaltedPassword = await AuthSec.hashAndSalt(password);

        let profileImgKey = '';

        try {
            // uploading user profile picture to s3 user bucket
            if (profileImg) {
                const result = await s3API.uploadFile(profileImg, usersBucket);
                await unlinkFile(profileImg.path);
                if (result) profileImgKey = result;
            }

            // uploading to mongodb
            const newUser = await UserModel.create({
                username: username,
                email: email,
                phoneNumber: phoneNumber,
                location: location,
                password: hasedAndSaltedPassword,
                profileImgKey: profileImgKey,
                county: county,
                area: area,
                landmark: landmark,
            });

            const token = jwt.sign(
                {
                    _id: newUser._id,
                    username: newUser.username,
                    email: newUser.email,
                    location: newUser.location,
                    phoneNumber: newUser.phoneNumber,
                    profileImgKey: newUser.profileImgKey,
                    county: newUser.county,
                    area: newUser.area,
                    landmark: newUser.landmark
                }, secretKey, { expiresIn: '48h' }
            )

            res.status(201).json(token);

        } catch (error) {
            next(error);
        }


    } catch (error) {
        next(error);
    }
}

// logging in a user
interface LoginBody {
    usernameEmail?: string,
    password?: string
}
export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const usernameEmail = req.body.usernameEmail;
    const password = req.body.password;

    try {
        if (!usernameEmail || !password) {
            throw createHttpError(400, "Parameters Missing");
        }

        let user = await UserModel.findOne({ username: usernameEmail }).select("+password +phoneNumber +email").exec();



        if (!user) {
            user = await UserModel.findOne({ email: usernameEmail }).select("+password +phoneNumber +email").exec();

            if (!user) {
                return res.status(401).json({ message: "Invalid credentials" })

            }
        }

        // checking for password match
        const passwordMatch = await AuthSec.comparePassword(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Invalid credentials" })

        }

        const token = jwt.sign(
            {
                _id: user._id,
                username: user.username,
                email: user.email,
                location: user.location,
                phoneNumber: user.phoneNumber,
                profileImgKey: user.profileImgKey,
                county: user.county,
                area: user.area,
                landmark: user.landmark
            }, secretKey, { expiresIn: '48h' }
        )


        res.status(201).json(token);

    } catch (error) {
        next(error);
    }
}

// deleting an account
export const removeAccount: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.params.userId;

    try {
        const user = await UserModel.findById(authenticatedUserId);

        await user?.remove();

    } catch (error) {
        next(error);
    }

}

// updating a user's profile
// interface UpdateProfileParam {
//     userId: mongoose.Types.ObjectId
// }

interface UpdateProfileBody {
    username?: string,
    email?: string,
    phoneNumber?: number,
    location?: string,
    prevPassword?: string,
    newPassword?: string,
    profileImg?: File,
    county?: string,
    area?: string,
    landmark?: string,
}

interface updatedUser {
    _id: string,
    email: string,
    username: string,
    location: string,
    phoneNumber: number,
    profileImgKey: string,
    county: string,
    area: string,
    landmark: string,
    password: string
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const updateUserProfile: RequestHandler<any, unknown, UpdateProfileBody, unknown> = async (req, res, next) => {
    const userId = req.params.userId as mongoose.Types.ObjectId;
    const username = req.body.username;
    const email = req.body.email;
    const phoneNumber = req.body.phoneNumber;
    const location = req.body.location;
    const prevPassword = req.body.prevPassword;
    const newPassword = req.body.newPassword;
    const profileImg = req.file;
    const county = req.body.county;
    const area = req.body.area;
    const landmark = req.body.landmark;

    try {
        if (!mongoose.isValidObjectId(userId)) {
            throw createHttpError(400, "UserId missing");
        }

        const user = await UserModel.findById(userId).select("_id username email phoneNumber password location profileImgKey county area landmark").exec();

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        if (username) user.username = username;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (location) user.location = location;
        if (county) user.county = county;
        if (area) user.area = area
        if (landmark) user.landmark = landmark

        // updating user password
        if (newPassword && prevPassword) {
            // checking for password mismatch
            const passwordMatch = await AuthSec.comparePassword(prevPassword, user.password);

            if (!passwordMatch) {
                throw createHttpError(401, "Wrong previous password");
            }

            // updating the password with a new salt and hashed one
            user.password = await AuthSec.hashAndSalt(newPassword);
        }

        // updating user's profile image
        if (profileImg) {
            // deleting the prior profile image
            if (user.profileImgKey) {
                await s3API.deleteImage(user.profileImgKey, usersBucket);
            }

            // uploading users new profile image
            let imageKey = '';
            const result = await s3API.uploadFile(profileImg, usersBucket);
            await unlinkFile(profileImg.path);
            if (result) imageKey = result;
            user.profileImgKey = imageKey;
        }

        const updatedUserProfile = await user.save() as unknown as updatedUser;
        const updatedToken = jwt.sign(
            {
                username: updatedUserProfile.username,
                email: updatedUserProfile.email,
                phoneNumber: updatedUserProfile.phoneNumber,
                location: updatedUserProfile.location,
                password: updatedUserProfile.password,
                county: updatedUserProfile.county,
                area: updatedUserProfile.area,
                landmark: updatedUserProfile.landmark,
                profileImgKey: updatedUserProfile.profileImgKey
            }, secretKey, { expiresIn: '48h' });
            
        const updatedInfo = { 
            updatedToken: updatedToken, 
            username: updatedUserProfile.username,
            email: updatedUserProfile.email,
            phoneNumber: updatedUserProfile.phoneNumber,
            location: updatedUserProfile.location,
            password: updatedUserProfile.password,
            county: updatedUserProfile.county,
            area: updatedUserProfile.area,
            landmark: updatedUserProfile.landmark,
            profileImgKey: updatedUserProfile.profileImgKey
        };

        res.status(200).json(updatedInfo);

    } catch (error) {
        next(error);
    }
}


