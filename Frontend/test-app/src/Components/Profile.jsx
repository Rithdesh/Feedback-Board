import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");
  const [userPosts, setUserPosts] = useState([]);
  const [userFeedbacks, setUserFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editModal, setEditModal] = useState({ open: false, post: null });
  const [editCaption, setEditCaption] = useState("");
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImageUrl, setEditImageUrl] = useState("");
  const [feedbackEditModal, setFeedbackEditModal] = useState({
    open: false,
    feedback: null,
  });
  const [editFeedbackText, setEditFeedbackText] = useState("");
  const [editFeedbackAnonymous, setEditFeedbackAnonymous] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (activeTab === "posts") {
      fetchUserPosts();
    } else {
      fetchUserFeedbacks();
    }
  }, [activeTab]);

  const fetchUserPosts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://feedback-board-n9zh.onrender.com/Post/mine",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserPosts(res.data);
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserFeedbacks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        "https://feedback-board-n9zh.onrender.com/Feedback/mine",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setUserFeedbacks(res.data);
    } catch (err) {
      console.error("Error fetching user feedbacks:", err);
    } finally {
      setLoading(false);
    }
  };

  const openEditModal = (post) => {
    setEditModal({ open: true, post });
    setEditCaption(post.caption);
    setEditImageUrl(post.image);
    setEditImageFile(null);
  };

  const closeEditModal = () => {
    setEditModal({ open: false, post: null });
    setEditCaption("");
    setEditImageFile(null);
    setEditImageUrl("");
  };

  const handleEditPost = async () => {
    const formData = new FormData();
    formData.append("caption", editCaption);
    if (editImageFile) formData.append("image", editImageFile);
    else if (editImageUrl.trim() !== "")
      formData.append("imageLink", editImageUrl);

    try {
      await axios.put(
        `https://feedback-board-n9zh.onrender.com/Post/update/${editModal.post._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      closeEditModal();
      fetchUserPosts();
    } catch (err) {
      console.error("Error updating post:", err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(
        `https://feedback-board-n9zh.onrender.com/Post/delete/${postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUserPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  const handleDeleteFeedback = async (feedbackId) => {
    try {
      await axios.delete(
        `https://feedback-board-n9zh.onrender.com/Feedback/delete/${feedbackId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchUserFeedbacks();
    } catch (err) {
      console.error("Error deleting feedback:", err);
    }
  };

  const openFeedbackEditModal = (feedback) => {
    setFeedbackEditModal({ open: true, feedback });
    setEditFeedbackText(feedback.text);
    setEditFeedbackAnonymous(feedback.anonymous);
  };

  const closeFeedbackEditModal = () => {
    setFeedbackEditModal({ open: false, feedback: null });
    setEditFeedbackText("");
    setEditFeedbackAnonymous(false);
  };

  const handleEditFeedback = async () => {
    try {
      await axios.put(
        `https://feedback-board-n9zh.onrender.com/Feedback/update/${feedbackEditModal.feedback._id}`,
        {
          text: editFeedbackText,
          anonymous: editFeedbackAnonymous,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      closeFeedbackEditModal();
      fetchUserFeedbacks();
    } catch (err) {
      console.error("Error updating feedback:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-300 via-red-300 to-pink-400 pt-6 p-3 sm:p-4 md:p-6">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {user.name || "User"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 break-words">
            {user.email}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow mb-4 sm:mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium text-sm sm:text-base ${
                activeTab === "posts"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("feedbacks")}
              className={`flex-1 py-3 sm:py-4 px-3 sm:px-6 text-center font-medium text-sm sm:text-base ${
                activeTab === "feedbacks"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Feedbacks
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex h-screen items-center justify-center">
            <p className="text-3xl text-black font-mono">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "posts" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {userPosts.length === 0 ? (
                  <div className="flex h-screen items-center justify-center text-black text-3xl font-mono">
                    No posts yet.
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-3 sm:p-4 hover:scale-105 transition-all duration-300 group"
                    >
                      <div className="relative overflow-hidden rounded-xl mb-3">
                        <img
                          src={post.image}
                          alt="Post"
                          className="w-full h-40 sm:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <p className="font-medium text-black mb-2 text-sm sm:text-base break-words">
                        {post.caption}
                      </p>
                      <div className="text-xs sm:text-sm text-black mb-4 flex items-center gap-1">
                        <span className="text-blue-400">🗓️</span>
                        <span className="font-medium">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-sm rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="flex-1 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm rounded-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {activeTab === "feedbacks" && (
              <div className="space-y-4">
                {userFeedbacks.length === 0 ? (
                  <p className="flex h-screen items-center justify-center text-black text-3xl font-mono">
                    No feedbacks given yet
                  </p>
                ) : (
                  userFeedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="bg-slate-100  border border-white/20 rounded-2xl shadow-2xl p-3 sm:p-4 hover:scale-105 transition-all duration-500"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <div className="relative overflow-hidden rounded-xl flex-shrink-0">
                          <img
                            src={feedback.post?.image}
                            alt="Post"
                            className="w-full sm:w-16 h-40 sm:h-16 object-cover"
                          />
                        </div>

                        <div className="flex-1 overflow-hidden w-full sm:w-auto">
                          <h4 className="text-sm font-semibold text-black mb-2 break-words flex items-center gap-2">
                            <span className="text-blue-400">📌</span>
                            On: {feedback.post?.caption || "Deleted Post"}
                          </h4>

                          <div className="bg-gradient-to-r from-blue-500/10 to-purple-600/10 backdrop-blur-sm border border-blue-400/30 rounded-xl p-3 border-l-4 border-l-blue-400">
                            <p className="text-sm text-black mb-2 break-words leading-relaxed">
                              {feedback.text}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-black">
                              <span className="flex items-center gap-1">
                                <span className="text-black">👤 - </span>
                                {feedback.anonymous ? "Anonymous" : user.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <span className="text-yellow-400">📅</span>
                                {new Date(
                                  feedback.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-3">
                            <button
                              onClick={() => openFeedbackEditModal(feedback)}
                              className="py-1 px-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs rounded-lg hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                            >
                              ✏️ Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(feedback._id)}
                              className="py-1 px-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs rounded-lg hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-md"
                            >
                              🗑️ Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>

      {editModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-blue-500">✏️</span>
              Edit Post
            </h2>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              placeholder="Edit caption..."
            />
            <input
              type="text"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              placeholder="Paste new image URL (Optional)"
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 text-sm sm:text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <div className="relative mb-3">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setEditImageFile(e.target.files[0])}
                className="w-full p-3 border border-gray-300 rounded-xl text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 text-sm sm:text-base transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="flex-1 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {feedbackEditModal.open && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white/95 backdrop-blur-md border border-white/30 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <span className="text-purple-500">💬</span>
              Edit Feedback
            </h2>
            <textarea
              value={editFeedbackText}
              onChange={(e) => setEditFeedbackText(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded-xl mb-3 text-sm sm:text-base focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              placeholder="Edit feedback text..."
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeFeedbackEditModal}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 text-sm sm:text-base transition-all duration-200 transform hover:scale-105"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFeedback}
                className="flex-1 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 text-sm sm:text-base transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
