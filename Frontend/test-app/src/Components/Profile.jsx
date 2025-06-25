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
  const [deleteModal, setDeleteModal] = useState({ open: false, postId: null });

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
      const res = await axios.get("http://localhost:8000/Post/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        "http://localhost:8000/Feedback/mine",
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
  };

  const closeEditModal = () => {
    setEditModal({ open: false, post: null });
    setEditCaption("");
  };

  const handleEditPost = async () => {
    try {
      await axios.put(
        `http://localhost:8000/Post/edit/${editModal.post._id}`,
        { caption: editCaption },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      closeEditModal();
      fetchUserPosts();
    } catch (err) {
      console.error("Error editing post:", err);
    }
  };

  const openDeleteModal = (postId) => {
    setDeleteModal({ open: true, postId });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ open: false, postId: null });
  };

  const handleDeletePost = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/Post/delete/${deleteModal.postId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      closeDeleteModal();
      fetchUserPosts();
    } catch (err) {
      console.error("Error deleting post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 pt-24 p-6">
      <Navbar />

      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            {user.name || "User"}
          </h1>
          <p className="text-gray-600">{user.email}</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex">
            <button
              onClick={() => setActiveTab("posts")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "posts"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Posts
            </button>
            <button
              onClick={() => setActiveTab("feedbacks")}
              className={`flex-1 py-4 px-6 text-center font-medium ${
                activeTab === "feedbacks"
                  ? "border-b-2 border-blue-600 text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              My Feedbacks
            </button>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-600">Loading...</p>
          </div>
        ) : (
          <>
            {activeTab === "posts" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPosts.length === 0 ? (
                  <div className="col-span-full bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No posts yet.</p>
                  </div>
                ) : (
                  userPosts.map((post) => (
                    <div
                      key={post._id}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <img
                        src={post.image}
                        alt="Post"
                        className="w-full h-48 object-cover rounded mb-3"
                      />
                      <p className="font-medium text-gray-800 mb-2">
                        {post.caption}
                      </p>
                      <div className="text-sm text-gray-600 mb-4">
                        <span>{post.feedbackCount || 0} feedbacks</span>
                        <span className="mx-2">•</span>
                        <span>
                          {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => openEditModal(post)}
                          className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openDeleteModal(post._id)}
                          className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                        >
                          Delete
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
                  <div className="bg-white rounded-lg shadow p-8 text-center">
                    <p className="text-gray-500">No feedbacks yet.</p>
                  </div>
                ) : (
                  userFeedbacks.map((feedback) => (
                    <div
                      key={feedback._id}
                      className="bg-white rounded-lg shadow p-4"
                    >
                      <div className="flex gap-4">
                        <img
                          src={feedback.post?.image}
                          alt="Post"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-800 mb-1">
                            "{feedback.post?.caption || "Deleted Post"}"
                          </h3>
                          <p className="text-sm text-gray-600 mb-2">
                            By: {feedback.post?.user?.name || "Unknown"}
                          </p>
                          <div className="bg-gray-50 rounded p-3 mb-2">
                            <p className="text-gray-800">"{feedback.text}"</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            <span>
                              {feedback.anonymous ? "Anonymous" : "Public"}
                            </span>
                            <span className="mx-2">•</span>
                            <span>
                              {new Date(
                                feedback.createdAt
                              ).toLocaleDateString()}
                            </span>
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

      {/* Edit Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Edit Post</h2>
            <textarea
              value={editCaption}
              onChange={(e) => setEditCaption(e.target.value)}
              rows={3}
              className="w-full p-3 border border-gray-300 rounded mb-4"
              placeholder="Edit caption..."
            />
            <div className="flex gap-3">
              <button
                onClick={closeEditModal}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleEditPost}
                className="flex-1 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-bold mb-4">Delete Post</h2>
            <p className="text-gray-700 mb-6">
              Are you sure? This cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={closeDeleteModal}
                className="flex-1 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleDeletePost}
                className="flex-1 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
