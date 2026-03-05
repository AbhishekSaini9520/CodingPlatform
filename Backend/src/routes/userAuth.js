const express = require('express');
const userAuth = express.Router();
const { register, login, logout, adminRegister, deleteProfile, getProfile } = require('../controllers/userAuthent')
const userMiddleware = require("../middleware/userMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const upload = require("../middleware/multer.middleware");
const { uploadProfileImage, updateCoverImage, updateProfile } = require("../controllers/user.controller");
// import { upload } from "../middleware/multer.middleware.js";
// import { uploadProfileImage } from "../controllers/user.controller.js";

// Register
userAuth.post("/register", register);
userAuth.post("/login", login);
userAuth.post("/logout", userMiddleware, logout);
userAuth.post("/admin/register", adminMiddleware, adminRegister);
userAuth.post("/deleteProfile", userMiddleware, deleteProfile);
userAuth.get("/getProfile", userMiddleware, getProfile);
userAuth.post("/updateProfile", userMiddleware, updateProfile);
userAuth.post("/uploadProfile", userMiddleware, upload.single("image"), uploadProfileImage)
userAuth.post("/uploadCoverImage", userMiddleware, upload.single("image"), updateCoverImage)

module.exports = userAuth;
