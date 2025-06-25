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
    setEditImageUrl("");
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
    <div className="min-h-screen bg-gradient-to-br from-orange-400 via-red-400 to-pink-500 pt-16 sm:pt-20 md:pt-24 p-3 sm:p-4 md:p-6">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            {user.name || "User"}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 break-words">
            {user.email}
          </p>
        </div>

        {/* Tabs */}
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
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {/* Posts */}
            {activeTab === "posts" && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                {userPosts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow p-6 sm:p-8 text-center">
                    <p className="text-gray-500">No posts yet.</p>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-lg shadow p-3 sm:p-4"
                    >
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-40 sm:h-48 object-cover rounded mb-3"
                      />
                      <p className="font-medium text-gray-800 mb-2 text-sm sm:text-base break-words">
                        {post.caption}
                      </p>
                      <div className="text-xs sm:text-sm text-gray-600 mb-4">
                        <span className="font-bold">
                          Created on:{" "}
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="flex-1 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="flex-1 py-2 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Feedbacks */}
            {activeTab === "feedbacks" && (
              <div className="space-y-3">
                {userFeedbacks.length === 0 ? (
                  <div className="bg-white rounded-lg shadow p-4 sm:p-6 text-center">
                    <p className="text-gray-500">No feedbacks yet.</p>
                  </div>
                ) : (
                  userFeedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="bg-white rounded-lg shadow p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row gap-3 items-start">
                        <img
                          src={feedback.post?.image}
                          alt="Post"
                          className="w-full sm:w-16 h-40 sm:h-16 object-cover rounded flex-shrink-0"
                        />

                        <div className="flex-1 overflow-hidden w-full sm:w-auto">
                          <h4 className="text-sm font-semibold text-gray-700 mb-1 break-words">
                            On: "{feedback.post?.caption || "Deleted Post"}"
                          </h4>

                          <div className="bg-blue-50 rounded p-2 border-l-4 border-blue-400">
                            <p className="text-sm text-gray-700 mb-1 break-words">
                              {feedback.text}
                            </p>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 text-xs text-gray-500">
                              <span>
                                {feedback.anonymous ? "Anonymous" : user.name}
                              </span>
                              <span>
                                {new Date(
                                  feedback.createdAt
                                ).toLocaleDateString()}
                              </span>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-2">
                            <button
                              onClick={() => openFeedbackEditModal(feedback)}
                              className="py-1 px-3 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteFeedback(feedback._id)}
                              className="py-1 px-3 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Delete
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

      {/* Edit Post Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Post</h2>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded mb-3 text-sm sm:text-base"
              placeholder="Edit caption..."
            />
            <input
              type="text"
              value={editImageUrl}
              onChange={(e) => setEditImageUrl(e.target.value)}
              placeholder="Paste new image URL (Optional)"
              className="w-full p-3 border border-gray-300 rounded mb-3 text-sm sm:text-base"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEditImageFile(e.target.files[0])}
              className="w-full mb-3 text-sm"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Feedback Modal */}
      {feedbackEditModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg font-bold mb-4">Edit Feedback</h2>
            <textarea
              value={editFeedbackText}
              onChange={(e) => setEditFeedbackText(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded mb-3 text-sm sm:text-base"
              placeholder="Edit feedback text..."
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={closeFeedbackEditModal}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFeedback}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm sm:text-base"
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
