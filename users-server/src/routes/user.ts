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

// updating a user's profile
router.patch('/update/:userId', upload.single('profileImg'), UsersController.updateUserProfile);

// logging out a user
router.post('/logout', UsersController.logout);

// logging in a user
router.post('/login', UsersController.login);

// checking if username exists
router.get('/checkusername/:query', UsersController.checkUername);

// checking if email exists
router.get('/checkemail/:query', UsersController.checkEmail);



export default router;