const express = require('express');
const authRouter = require("./authRouter");
const postRouter = require("./postRouter");
const userRouter = require("./userRouter");
const chatRouter = require("./chatRouter");
const messageRouter = require("./messageRouter");
const router = express.Router();

//assegnazione router in base ai percorsi
router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
router.use("/chats", chatRouter);
router.use("/messages", messageRouter);

module.exports = router;