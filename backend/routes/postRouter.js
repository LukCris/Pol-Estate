const express = require("express");
const { addPost, deletePost, findPost, getAllPosts, getPostById} = require("../controllers/postController.js");
const router = express.Router();

router.get("/findAllPost", getAllPosts);
router.post("/findPost", findPost);
router.get("/getPostById/:id", getPostById);
router.post("/addPost", addPost);
router.post("/deletePost", deletePost);
module.exports = router;
