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
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [postFeedbacks, setPostFeedbacks] = useState({});
  const [loadingFeedback, setLoadingFeedback] = useState(false);
  const [createPostModal, setCreatePostModal] = useState(false);
  const [newPostCaption, setNewPostCaption] = useState("");
  const [newPostImage, setNewPostImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await axios.get("http://localhost:8000/Post/allposts");
      setPosts(res.data);
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
        `http://localhost:8000/Feedback/create/${feedbackModal.postId}`,
        {
          text: feedbackText,
          anonymous,
        },
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
    setLoadingFeedback(true);
    try {
      const res = await axios.get(
        `http://localhost:8000/Feedback/getpostfeedback/${postId}`
      );
      setPostFeedbacks((prev) => ({ ...prev, [postId]: res.data }));
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const toggleShowFeedback = (postId) => {
    if (expandedPostId === postId) {
      setExpandedPostId(null);
    } else {
      setExpandedPostId(postId);
      if (!postFeedbacks[postId]) {
        fetchPostFeedbacks(postId);
      }
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
    } else {
      formData.append("imageLink", newPostImage);
    }

    try {
      await axios.post("http://localhost:8000/Post/create", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });
      setCreatePostModal(false);
      setNewPostCaption("");
      setNewPostImage("");
      setImageFile(null);
      fetchPosts();
    } catch (err) {
      console.error("Error creating post:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6 pt-24">
      <Navbar />

      {isLoggedIn && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={() => setCreatePostModal(true)}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition"
          >
            + Create Post
          </button>
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-600">Loading posts...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-gray-500">No posts available.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              className={`bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-4 flex flex-col justify-between transition-all duration-300 ${
                expandedPostId === post._id
                  ? "scale-[1.03] ring-2 ring-indigo-200"
                  : "scale-100"
              }`}
            >
              <img
                src={post.image}
                alt="Post"
                className="w-full h-48 object-cover rounded-md mb-3"
              />
              <p className="text-lg font-semibold text-gray-800 mb-2">
                {post.caption}
              </p>
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>By: {post.user?.name || "Anonymous"}</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="mt-4 flex justify-between items-center">
                <div className="flex gap-2">
                  <button
                    onClick={() => openModal(post._id)}
                    className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Add Feedback
                  </button>
                  <button
                    onClick={() => toggleShowFeedback(post._id)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                  >
                    {expandedPostId === post._id
                      ? "Hide Feedback"
                      : "Show Feedback"}
                  </button>
                </div>
              </div>

              {expandedPostId === post._id && (
                <div className="mt-4 bg-gray-100 p-3 rounded-lg">
                  {loadingFeedback ? (
                    <p className="text-sm text-gray-500">Loading feedback...</p>
                  ) : postFeedbacks[post._id] &&
                    postFeedbacks[post._id].length > 0 ? (
                    postFeedbacks[post._id].map((fb, idx) => (
                      <div key={idx} className="mb-2 p-2 bg-gray-200 rounded">
                        <p className="text-sm text-gray-700">{fb.text}</p>
                        <p className="text-xs text-gray-500">
                          - {fb.name || "Anonymous"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No feedback yet.</p>
                  )}
                </div>
              )}
            </div>
          ))}
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
              value={newPostImage}
              onChange={(e) => setNewPostImage(e.target.value)}
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
