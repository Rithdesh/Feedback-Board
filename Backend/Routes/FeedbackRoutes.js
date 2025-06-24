const express = require("express");
const router = express.Router();
const { addFeedback, getFeedbacksForPost,getMyFeedbacks } = require("../Controllers/FeedbackController");
const { authenticateJWT,authenticateJWTOptional } = require("../Middleware/AuthMiddleware");

// Anyone (user or guest) can add feedback
router.post("/create/:postId",authenticateJWTOptional, addFeedback);

// Anyone can view feedback for a post
router.get("/getpostfeedback/:postId", getFeedbacksForPost);

// Authenticated users can view their own feedbacks
router.get("/mine", authenticateJWT, getMyFeedbacks);


module.exports = router;
