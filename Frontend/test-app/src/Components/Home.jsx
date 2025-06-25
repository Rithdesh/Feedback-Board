import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState({
    open: false,
    postId: null,
  });
  const [feedbackText, setFeedbackText] = useState("");
  const [anonymous, setAnonymous] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const [postFeedbacks, setPostFeedbacks] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState({});
  const [createPostModal, setCreatePostModal] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostImageUrl, setNewPostImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        "https://feedback-board-n9zh.onrender.com/Post/allposts"
      );
      setPosts(res.data);
      // Fetch feedback for all posts
      res.data.forEach((post) => {
        fetchPostFeedbacks(post._id);
      });
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (postId) => {
    setFeedbackModal({ open: true, postId });
    setFeedbackText("");
    setAnonymous(true);
    setErrorMsg("");
  };

  const closeModal = () => {
    setFeedbackModal({ open: false, postId: null });
  };

  const submitFeedback = async () => {
    if (!feedbackText.trim()) {
      setErrorMsg("Feedback cannot be empty");
      return;
    }
    try {
      await axios.post(
        `https://feedback-board-n9zh.onrender.com/Feedback/create/${feedbackModal.postId}`,
        { text: feedbackText, anonymous },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      closeModal();
      fetchPostFeedbacks(feedbackModal.postId);
    } catch (err) {
      setErrorMsg("Error submitting feedback");
    }
  };

  const fetchPostFeedbacks = async (postId) => {
    setLoadingFeedback((prev) => ({ ...prev, [postId]: true }));
    try {
      const res = await axios.get(
        `https://feedback-board-n9zh.onrender.com/Feedback/getpostfeedback/${postId}`
      );
      setPostFeedbacks((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoadingFeedback((prev) => ({ ...prev, [postId]: false }));
    }
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const handleCreatePost = async () => {
    const formData = new FormData();
    formData.append("caption", newPostCaption);

    if (imageFile) {
      formData.append("image", imageFile);
    } else if (newPostImageUrl.trim() !== "") {
      formData.append("imageUrl", newPostImageUrl);
    }

    try {
      await axios.post(
        "https://feedback-board-n9zh.onrender.com/Post/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCreatePostModal(false);
      setNewPostCaption("");
      setNewPostImageUrl("");
      setImageFile(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-00 p-6 pt-24">
      <Navbar />

      {loading ? (
        <p className="text-center text-gray-600">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 ">
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-slate-200 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col h-[550px]"
            >
              <img
                src={post.image}
                alt="Post"
                className="w-full h-48 object-cover rounded-md mb-3"
              />

              <p className="text-lg font-semibold text-gray-800 mb-2">
                {post.caption}
              </p>

              <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
                <span>By: {post.user?.name || "Anonymous"}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => openModal(post._id)}
                className="w-full px-3 py-2 rounded-lg bg-orange-600 hover:bg-orange-700 text-white mb-3"
              >
                Add Feedback
              </button>

              {/* Feedback Section */}
              <div className="flex-1 overflow-hidden">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Feedback ({postFeedbacks[post._id]?.length || 0})
                </h4>

                <div className="h-full overflow-y-auto pb-2">
                  {loadingFeedback[post._id] ? (
                    <p className="text-sm text-gray-500">Loading feedback...</p>
                  ) : postFeedbacks[post._id] &&
                    postFeedbacks[post._id].length > 0 ? (
                    <div className="space-y-2 pb-1">
                      {postFeedbacks[post._id].map((fb, idx) => (
                        <div
                          key={idx}
                          className="bg-gray-50 p-2 rounded border-l-4 border-blue-400"
                        >
                          <p className="text-sm text-gray-700 mb-1">
                            {fb.text}
                          </p>
                          <p className="text-xs text-gray-500">
                            - {fb.name || "Anonymous"}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No feedback yet.</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoggedIn && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={() => setCreatePostModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + Create Post
          </button>
        </div>
      )}

      {feedbackModal.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">Submit Feedback</h2>
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              rows={4}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 mb-3"
              placeholder="Write your feedback..."
            ></textarea>

            <label className="flex items-center mb-4">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={() => setAnonymous(!anonymous)}
                className="mr-2"
              />
              Post anonymously
            </label>

            {errorMsg && (
              <p className="text-sm text-red-600 mb-2">{errorMsg}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={submitFeedback}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {createPostModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Create New Post</h2>
            <input
              type="text"
              value={newPostCaption}
              onChange={(e) => setNewPostCaption(e.target.value)}
              placeholder="Enter caption..."
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            />
            <input
              type="text"
              value={newPostImageUrl}
              onChange={(e) => setNewPostImageUrl(e.target.value)}
              placeholder="Paste image URL (Optional)"
              className="w-full p-3 border border-gray-300 rounded-lg mb-3"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full mb-3"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCreatePostModal(false)}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleCreatePost}
                className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700"
              >
                Post
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
