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
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-300 to-pink-400 pt-6 p-3 sm:p-4 md:p-6">
      <Navbar />
      <div className="max-w-6xl mx-auto sm:mt-44 md:mt-12 lg:mt-16 p-4 sm:p-6 md:p-8 ">
        {loading ? (
          <p className="text-black font-bold text-2xl">Loading posts...</p>
        ) : posts.length === 0 ? (
          <div className="text-center py-8">
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 sm:p-8">
              <div className="text-6xl text-white mb-4">📝</div>
              <p className="text-white text-lg">No posts available yet.</p>
              <p className="text-gray-200 text-sm mt-2">
                Be the first to share something amazing!
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-3 sm:p-4 hover:scale-105 transition-all duration-300 group flex flex-col h-auto"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden rounded-xl mb-3">
                  <img
                    src={post.image}
                    alt="Post"
                    className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Caption */}
                <p className="font-medium text-black mb-2 text-sm sm:text-base break-words">
                  {post.caption}
                </p>

                {/* Post Meta */}
                <div className="text-xs sm:text-sm text-black mb-3 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <span className="text-blue-400">👤</span>
                    <span className="font-medium">
                      {post.user?.name || "Anonymous"}
                    </span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="text-blue-400">🗓️</span>
                    <span className="font-medium">
                      {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                  </span>
                </div>

                {/* Add Feedback Button */}
                <button
                  onClick={() => openModal(post._id)}
                  className="w-full py-2 bg-gradient-to-r from-orange-500 to-red-600 text-white text-sm rounded-lg hover:from-orange-600 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg mb-3"
                >
                  💬 Add Feedback
                </button>

                {/* Feedback Section */}
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-medium text-black mb-2 flex items-center gap-1">
                    <span className="text-purple-500">💬</span>
                    Feedback ({postFeedbacks[post._id]?.length || 0})
                  </h4>

                  <div className="max-h-48 overflow-y-auto">
                    {loadingFeedback[post._id] ? (
                      <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-xl p-3">
                        <div className="animate-pulse flex space-x-2">
                          <div className="rounded-full bg-gray-300 h-4 w-4"></div>
                          <div className="flex-1 space-y-1">
                            <div className="h-3 bg-gray-300 rounded"></div>
                            <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                          </div>
                        </div>
                      </div>
                    ) : postFeedbacks[post._id] &&
                      postFeedbacks[post._id].length > 0 ? (
                      <div className="space-y-2">
                        {postFeedbacks[post._id].map((fb, id) => (
                          <div
                            key={id}
                            className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3 border-l-4 border-l-orange-400"
                          >
                            <p className="text-sm text-black mb-2 break-words leading-relaxed">
                              {fb.text}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-black">
                              <span className="flex items-center gap-1">
                                <span className="text-purple-400">👤</span>
                                {fb.name || "Anonymous"}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-400">📅</span>
                                {new Date(fb.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-white/30 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center">
                        <p className="text-sm text-gray-600">
                          No feedback yet.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Be the first to share your thoughts!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Post Button */}
        {isLoggedIn && (
          <div className="mt-8 flex justify-center">
            <button
              onClick={() => setCreatePostModal(true)}
              className="py-3 px-6 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg text-sm sm:text-base font-medium flex items-center gap-2"
            >
              ✨ Create Post
            </button>
          </div>
        )}

        {/* Feedback Modal */}
        {feedbackModal.open && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
                <span className="text-purple-500">💬</span>
                Submit Feedback
              </h2>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={4}
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                placeholder="Write your feedback..."
              />

              <label className="flex items-center mb-4 text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={anonymous}
                  onChange={() => setAnonymous(!anonymous)}
                  className="mr-2 w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm">Post anonymously</span>
              </label>

              {errorMsg && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                  <p className="text-sm text-red-600">{errorMsg}</p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 text-sm sm:text-base transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Post Modal */}
        {createPostModal && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                ✨Create New Post
              </h2>
              <input
                type="text"
                value={newPostCaption}
                onChange={(e) => setNewPostCaption(e.target.value)}
                placeholder="Enter caption..."
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <input
                type="text"
                value={newPostImageUrl}
                onChange={(e) => setNewPostImageUrl(e.target.value)}
                placeholder="Paste image URL (Optional)"
                className="w-full p-3 border border-gray-300 rounded-xl mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <div className="relative mb-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setCreatePostModal(false)}
                  className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 text-sm sm:text-base transition-all duration-200 transform hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreatePost}
                  className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
