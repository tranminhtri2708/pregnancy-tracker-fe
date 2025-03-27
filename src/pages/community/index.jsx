import React, { useEffect, useState } from "react";
import {
  FiHeart,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiSave,
  FiRefreshCw,
} from "react-icons/fi";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { toast } from "react-toastify";
import { createPost, getPost } from "../../services/api.post";
import { Image, Upload, Modal, Input, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";
import { getProfile } from "../../services/api.getprofile";

const PostCard = ({ post }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
      <div className="flex items-center mb-4">
        <img
          src={post.authorImageUrl || "https://via.placeholder.com/150"}
          alt={post.authorName}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{post.authorName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.createdDate).toLocaleDateString()}
            {post.isEdited ? " (Edited)" : ""}
          </p>
        </div>
      </div>
      {post.title && <h2 className="font-bold text-lg mb-2">{post.title}</h2>}
      <p className="text-gray-700 mb-4">{post.content}</p>
      {post.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full object-contain max-h-96"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
};


// Create Post Modal component
const CreatePostModal = ({ show, onClose, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  // Get Base64 function
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content, fileList });
    setTitle("");
    setContent("");
    setFileList([]);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-pink-200 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Tạo bài viết
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Chủ đề"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            required
          />
          <textarea
            placeholder="Hãy chia sẻ nội dung của bạn..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            required
          ></textarea>
          <Upload
            action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
            listType="picture-card"
            fileList={fileList}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {fileList.length >= 8 ? null : uploadButton}
          </Upload>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              disabled={isSubmitting}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors flex items-center space-x-2"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin">
                    <FiRefreshCw />
                  </span>
                  <span>Đang đăng...</span>
                </>
              ) : (
                <span>Đăng</span>
              )}
            </button>
          </div>
        </form>
        {previewImage && (
          <Image
            wrapperStyle={{
              display: "none",
            }}
            preview={{
              visible: previewOpen,
              onVisibleChange: (visible) => setPreviewOpen(visible),
              afterOpenChange: (visible) => !visible && setPreviewImage(""),
            }}
            src={previewImage}
          />
        )}
      </div>
    </div>
  );
};

// Banner component
const Banner = () => (
  <div className="w-full mt-25 flex justify-center">
    <div
      className="w-full max-w-6xl h-auto py-55"
      style={{
        background: `url('https://cdn-together.hellohealthgroup.com/2024/10/1729480091_6715c59be23826.55274785') no-repeat center center`,
        backgroundSize: "cover",
        minHeight: "300px",
        width: "100%",
      }}
      role="img"
      aria-label="Community banner"
    ></div>
  </div>
);

// Under Banner component
const UnderBanner = () => (
  <div className="w-full max-w-6xl mx-auto bg-white p-4 shadow-lg flex items-center justify-between gap-x-4">
    {/* Profile image */}
    <div className="w-12 h-12 flex-shrink-0">
      <img
        src="https://img.icons8.com/?size=100&id=5ylCh8WWmAHf&format=png&color=000000"
        alt="Community Icon"
        className="w-full h-full object-cover rounded-full"
      />
    </div>

    {/* Content */}
    <div className="flex-1">
      <h2 className="text-lg font-bold">Cộng đồng mẹ bầu</h2>
    </div>
  </div>
);
const PostCard = ({ post, onLike, onComment }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
      <div className="flex items-center mb-4">
        <img
          src={post.authorImageUrl || "https://via.placeholder.com/150"}
          alt={post.authorName}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{post.authorName}</h3>
          <p className="text-sm text-gray-500">
            {new Date(post.createdDate).toLocaleDateString()}
            {post.isEdited ? " (Edited)" : ""}
          </p>
        </div>
      </div>
      {post.title && <h2 className="font-bold text-lg mb-2">{post.title}</h2>}
      <p className="text-gray-700 mb-4">{post.content}</p>
      {post.imageUrl && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={post.imageUrl}
            alt="Post content"
            className="w-full object-contain max-h-96"
            loading="lazy"
          />
        </div>
      )}
      <div className="flex items-center space-x-6">
        <button
          onClick={() => onLike(post.id)}
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
          aria-label="Like post"
        >
          <FiHeart />
          <span>{post.likes || 0}</span>
        </button>
        <button
          onClick={() => onComment(post)}
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
          aria-label="Comment on post"
        >
          <FiMessageSquare />
          <span>{post.comments || 0}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
          aria-label="Save post"
        >
          <FiSave />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
};

const CommentModal = ({ visible, post, onClose, onAddComment }) => {
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    if (post) {
      // Fetch comments for the selected post (replace with actual API call)
      setComments([
        "This is a sample comment.",
        "Another example of a comment.",
      ]);
    }
  }, [post]);

  const handleAddComment = () => {
    if (newComment.trim()) {
      // Add comment to the list (or send it to an API)
      setComments([...comments, newComment]);
      onAddComment(post.id, newComment); // Callback to update backend
      setNewComment("");
    }
  };

  return (
    <Modal title="Comments" visible={visible} onCancel={onClose} footer={null}>
      {post && (
        <div>
          <h3 className="font-bold">{post.title}</h3>
          <p>{post.content}</p>
        </div>
      )}
      <div className="mt-4">
        {comments.map((comment, index) => (
          <div key={index} className="bg-gray-100 p-2 rounded mb-2">
            {comment}
          </div>
        ))}
      </div>
      <div className="mt-4 flex">
        <Input
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="primary" onClick={handleAddComment} className="ml-2">
          Post
        </Button>
      </div>
    </Modal>
  );
};

const Pregnancy = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Track selected post for the comment modal
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await getPost();
      console.log("Kết quả API:", result); // In ra toàn bộ kết quả
      if (result && result.items) {
        setPosts(result.items);
      } else {
        toast.error("Không thể tải bài viết");
      }
    } catch (error) {
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
// Fetch and Refresh posts
useEffect(() => {
  fetchPosts();
}, []);

const handleRefresh = () => {
  setRefreshing(true);
  fetchPosts();
  setRefreshing(false); // Set refreshing back to false after fetching
};


useEffect(() => {
  const fetchUserInfo = async () => {
    try {
      const userInfo = await getProfile();
      console.log("Thông tin người dùng nhận được:", userInfo);
      if (userInfo) {
        setCurrentUser(userInfo);
      } else {
        console.error("Không nhận được thông tin người dùng");
        toast.error("Không thể tải thông tin người dùng");
      }
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      toast.error("Lỗi khi tải thông tin người dùng");
    }
  };

  fetchUserInfo();
}, []);

const handleCreatePost = async ({ title, content, fileList }) => {
  try {
    // Logic to handle post creation
    console.log("Creating post with:", { title, content, fileList });
    toast.success("Post created successfully!");
  } catch (error) {
    console.error("Error creating post:", error);
    toast.error("Failed to create post.");
  }
};

const handleComment = (post) => {
  setSelectedPost(post);
  console.log("Selected post:", post);
  setIsModalVisible(true);
};

const handleAddComment = async (postId, content) => {
  try {
    // Send the comment to the backend (replace with actual API call)
    console.log(`Adding comment to post ${postId}:`, content);
    toast.success("Comment added!");
  } catch (error) {
    toast.error("Failed to add comment.");
  }
};


// Filter posts based on search query
const filteredPosts = posts.filter(
  (post) =>
    (post.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
    (post.title || "").toLowerCase().includes(searchQuery.toLowerCase())
);

// Handle post like functionality
const handleLike = (postId) => {
  setPosts(
    posts.map((post) =>
      post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
    )
  );
};

// Fetch posts when the component mounts
useEffect(() => {
  fetchPosts();
}, []);


  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Banner />
      <UnderBanner />
      <main className="max-w-6xl mx-auto py-8 px-4 flex-grow w-full">
        <div className="flex justify-between mb-8">
          {/* Search bar and refresh */}
          <div className="flex space-x-4 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className="text-pink-500"
            >
              {refreshing ? "Loading..." : "Refresh"}
            </button>
          </div>
        </div>
{/* Full-width post section */}
<div className="w-full">
  {/* Posts section */}
  {loading ? (
    <div className="text-center py-10">
      <p className="text-gray-500">Đang tải bài viết...</p>
    </div>
  ) : filteredPosts.length === 0 ? (
    <div className="text-center py-10">
      <p className="text-gray-500 text-lg">
        Không tìm thấy bài viết. Hãy tạo bài viết mới!
      </p>
    </div>
  ) : (
    <div className="space-y-6">
      {filteredPosts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          onLike={handleLike} // Include like functionality
          onComment={handleComment} // Include comment functionality
        />
      ))}
    </div>
  )}
</div>

        </div>
      </main>
      <CommentModal
        visible={isModalVisible}
        post={selectedPost}
        onClose={() => setIsModalVisible(false)}
        onAddComment={handleAddComment}
      />
      <Footer />
    </div>
  );
};

export default Pregnancy;
