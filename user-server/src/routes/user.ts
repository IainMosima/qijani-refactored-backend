import express from "express";
import * as UsersController from "../controllers/user";
import multer from "multer";
import { requireAuth } from "../middleware/requireAuth";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// getting an authenticated user
router.get('/', requireAuth, UsersController.getAuthenticatedUser);

// creating a new user
router.post('/signup', upload.single('profileImg'), UsersController.signup);

// logging out a user
router.post('/logout', UsersController.logout);

// logging in a user
router.post('/login', UsersController.login);

// getting a users profile photo
router.get('/signedUrl/:imageKey', UsersController.getProfileImageSignedUrl);


export default router;