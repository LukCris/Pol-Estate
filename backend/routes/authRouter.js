const express = require("express");
const {register, login, findUsernameByToken} = require("../controllers/authController");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/findUsernameByToken", findUsernameByToken);

module.exports = router;
