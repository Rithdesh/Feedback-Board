const express = require("express");
const router = express.Router();
const { addFeedback, getFeedbacksForPost,getMyFeedbacks,updateFeedback,deleteFeedback } = require("../Controllers/FeedbackController");
const { authenticateJWT,authenticateJWTOptional } = require("../Middleware/AuthMiddleware");

// Anyone (user or guest) can add feedback
router.post("/create/:postId",authenticateJWTOptional, addFeedback);

// Anyone can view feedback for a post
router.get("/getpostfeedback/:postId", getFeedbacksForPost);

// Authenticated users can view their own feedbacks
router.get("/mine", authenticateJWT, getMyFeedbacks);

// Authenticated users can update their own feedbacks
router.put("/update/:id", authenticateJWT, updateFeedback);

// Authenticated users can delete their own feedbacks
router.delete("/delete/:id", authenticateJWT, deleteFeedback);


module.exports = router;
