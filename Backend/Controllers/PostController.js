const Post = require("../Models/PostModel");


const createPost = async (req, res) => {
  try {
    const { caption, imageUrl } = req.body;
    const userId = req.user.id;

    let finalImageUrl = "";

    if (req.file) {
      // Case 1: User uploaded a file (multer + cloudinary will give the path)
      finalImageUrl = req.file.path;
    } else if (imageUrl && imageUrl.trim() !== "") {
      // Case 2: User provided a URL
      finalImageUrl = imageUrl;
    }

    // Validate: At least one image input should exist
    if (!finalImageUrl) {
      return res.status(400).json({ message: "Please upload an image or provide an image URL." });
    }

    const newPost = new Post({
      caption,
      image: finalImageUrl,
      user: userId,
    });

    await newPost.save();
    res.status(201).json({ message: "Post created", post: newPost });
  } catch (error) {
    console.error("Post creation error:", error);
    res.status(500).json({ message: "Error creating post", error: error.message });
  }
};





const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching posts", error: error.message });
  }
};


const getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching your posts", error: error.message });
  }
};


const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { caption, imageLink } = req.body;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to update this post" });
    }

  
    if (req.file) {
      post.image = req.file.path;
    } else if (imageLink && imageLink.trim() !== "") {
      post.image = imageLink; 
    }

    
    if (caption !== undefined) {
      post.caption = caption;
    }

    await post.save();

    res.status(200).json({ message: "Post updated", post });
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error: error.message });
  }
};


const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized to delete this post" });
    }

    await post.deleteOne();
    res.status(200).json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getMyPosts,
  updatePost,
  deletePost,
};
