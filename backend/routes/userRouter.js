const express = require("express");
const {profilePosts, getProfile, findUserByPost} = require("../controllers/userController.js");
const authController = require("../controllers/authController.js");
const router = express.Router();

router.get("/profile", getProfile);
router.get("/profilePosts", profilePosts);
router.post("/findUser", findUserByPost);

module.exports = router;