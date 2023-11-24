import express from "express";
import multer from "multer";
import * as UsersController from "../controllers/user";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

// getting an authenticated user
router.get('/', UsersController.getAuthenticatedUser);

// getting a user
router.get('/:userId', UsersController.getUserInfo);

// creating a new user
router.post('/signup', upload.single('profileImg'), UsersController.signup);

// updating a user's profile
router.patch('/update/:userId', upload.single('profileImg'), UsersController.updateUserProfile);

// logging in a user
router.post('/login', UsersController.login);

// checking if username exists
router.get('/checkusername/:query', UsersController.checkUername);

// checking if email exists
router.get('/checkemail/:query', UsersController.checkEmail);



export default router;