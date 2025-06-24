const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
} = require("../Controllers/PostController");

const {authenticateJWT} = require('../Middleware/AuthMiddleware')
const upload = require("../Middleware/UploadMiddleware");


router.get("/allposts", getAllPosts);


router.get("/mine", authenticateJWT, getMyPosts);


router.post("/create", authenticateJWT, upload.single("image"), createPost);


router.put("/update/:id", authenticateJWT, upload.single("image"), updatePost);


router.delete("/delete/:id", authenticateJWT, deletePost);

module.exports = router;
