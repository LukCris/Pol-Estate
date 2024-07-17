const express = require("express");
const {getMessagesLists, getIdByUsername, getUsernameContact, addContact, deleteChat} = require("../controllers/chatController.js")
const router = express.Router();

router.get("/getMessagesList/:username", getMessagesLists);
router.get("/getIdByUsername/:username", getIdByUsername);
router.get("/getUsernameContact/:username", getUsernameContact);
router.post("/addContact", addContact);
router.post("/deleteChat", deleteChat);
module.exports = router;
