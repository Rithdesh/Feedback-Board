const Feedback = require("../Models/FeedbackModel");
const Post = require("../Models/PostModel");

const addFeedback = async (req, res) => {
    try {
      const { text, anonymous } = req.body;
      const { postId } = req.params;
  
      if (!text) {
        return res.status(400).json({ message: "Feedback text is required" });
      }
  
      const post = await Post.findById(postId);
      if (!post) return res.status(404).json({ message: "Post not found" });
  
      const isAnonymous = anonymous === "true" || anonymous === true;

        let displayName = "Anonymous";


        if (req.user && !isAnonymous) {
        displayName = req.user.name;
        }

  
      const feedback = new Feedback({
        post: postId,
        text,
        name: displayName,
        anonymous: isAnonymous,
        user: req.user?.id || null,
      });
  
      await feedback.save();
      res.status(201).json({ message: "Feedback added", feedback });
    } catch (error) {
      res.status(500).json({ message: "Failed to add feedback", error: error.message });
    }
  };
  

const getFeedbacksForPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const feedbacks = await Feedback.find({ post: postId })
      .sort({ createdAt: -1 })

    res.status(200).json(feedbacks);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch feedbacks", error: error.message });
  }
};

const getMyFeedbacks = async (req, res) => {
    try {
      const userId = req.user.id;
  
      const feedbacks = await Feedback.find({ user: userId })
        .populate("post", "caption image") 
  
      res.status(200).json(feedbacks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch your feedbacks", error: error.message });
    }
  };

  const updateFeedback = async (req, res) => {
    try {
      const { id } = req.params;
      const { text, anonymous } = req.body;
  
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
  
    
      if (feedback.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to edit this feedback" });
      }
  
      
      if (text) feedback.text = text;
      if (anonymous !== undefined) feedback.anonymous = anonymous;
  
      await feedback.save();
  
      res.status(200).json({ message: "Feedback updated successfully", feedback });
    } catch (error) {
      res.status(500).json({ message: "Error updating feedback", error: error.message });
    }
  };

  const deleteFeedback = async (req, res) => {
    try {
      const { id } = req.params;
  
      const feedback = await Feedback.findById(id);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found" });
      }
  
      if (!feedback.user || feedback.user.toString() !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized to delete this feedback" });
      }
  
      await feedback.deleteOne();
      res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
      console.error("Error deleting feedback:", error.message);
      res.status(500).json({ message: "Error deleting feedback", error: error.message });
    }
  };
  

module.exports = {
  addFeedback,
  getFeedbacksForPost,
  getMyFeedbacks,
  updateFeedback,
  deleteFeedback
};
