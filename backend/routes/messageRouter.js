const express = require("express");
const messageController = require("../controllers/messageController.js");


const router = express.Router();



router.get("/getMessageById/:id", messageController.getMessageById);

module.exports = router;
