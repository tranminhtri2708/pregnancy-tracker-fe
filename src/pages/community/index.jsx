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
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";
import { getProfile } from "../../services/api.getprofile";

// Post Card component
const PostCard = ({ post, onLike }) => {
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

// Trending Topics component
const TrendingTopics = () => {
  const topics = [
    "Thai nhi khỏe mạnh",
    "Tiêm phòng",
    "Ăn uống đủ chất",
    "Yoga bầu",
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="font-bold text-lg mb-3 text-gray-800">Chủ đề nổi bật</h2>
      <div className="flex flex-wrap gap-2">
        {topics.map((topic, index) => (
          <span
            key={index}
            className="bg-pink-50 text-pink-600 px-3 py-1 rounded-full text-sm"
          >
            #{topic}
          </span>
        ))}
      </div>
    </div>
  );
};

// Get Base64 function
const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

// Create Post Modal component
const CreatePostModal = ({ show, onClose, onSubmit, isSubmitting }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

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
      <h2 className="text-lg font-bold">Chuẩn bị mang thai</h2>
      <div className="text-gray-600 text-sm flex items-center gap-x-4">
        <span>4 chủ đề</span>
        <span>💬 7.2k tương tác</span>
        <span>👥 6k thành viên</span>
      </div>
    </div>

    {/* Join button */}
    <button className="bg-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-x-2">
      <span className="text-lg">+</span>
      <span>Tham gia</span>
    </button>
  </div>
);

const Pregnancy = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    imgUrl: "",
  });

  // Fetch posts function
  const fetchPosts = async () => {
    try {
      setLoading(true);
      const result = await getPost();
      if (result && result.items) {
        setPosts(result.items);
      } else {
        console.error("Không nhận được dữ liệu bài viết hợp lệ");
        toast.error("Không thể tải bài viết");
      }
    } catch (error) {
      console.error("Lỗi khi tải bài viết:", error);
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau!");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Refresh data function
  const handleRefresh = () => {
    setRefreshing(true);
    fetchPosts();
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

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleCreatePost = async ({ title, content, fileList }) => {
    try {
      setIsSubmitting(true);
      let imageUrl = "";

      // Check if there's an image to upload
      if (fileList && fileList.length > 0 && fileList[0].originFileObj) {
        try {
          // Upload the first image and get its URL
          const uploadedFile = fileList[0].originFileObj;
          imageUrl = await uploadFile(uploadedFile);
        } catch (uploadError) {
          console.error("Lỗi khi tải lên hình ảnh:", uploadError);
          toast.error(
            "Không thể tải lên hình ảnh. Bài viết sẽ được đăng không có hình ảnh."
          );
        }
      }

      // Create post data object
      const postData = {
        title,
        content,
        imageUrl,
      };

      // Call API to create the post
      const createdPost = await createPost(postData);

      // If API call is successful
      if (createdPost) {
        toast.success("Đăng bài viết thành công!");
        setShowModal(false);

        // Reload data after creating post
        await fetchPosts();
      } else {
        throw new Error("Không nhận được phản hồi từ API");
      }
    } catch (error) {
      console.error("Lỗi khi tạo bài viết:", error);
      toast.error("Đã xảy ra lỗi khi đăng bài viết!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: (post.likes || 0) + 1 } : post
      )
    );
  };

  const filteredPosts = posts.filter(
    (post) =>
      (post.content || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.title || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Banner />
      <UnderBanner />

      {/* Main content - now full width */}
      <main className="max-w-6xl mx-auto py-8 px-4 flex-grow w-full">
        <div className="flex justify-between mb-8">
          {/* Search bar and refresh button */}
          <div className="flex space-x-4 items-center">
            <div className="relative w-64">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
                aria-label="Search posts"
              />
            </div>
            <button
              onClick={handleRefresh}
              disabled={loading || refreshing}
              className={`flex items-center space-x-1 text-pink-500 hover:text-pink-600 transition-colors ${
                refreshing ? "animate-spin" : ""
              }`}
              aria-label="Refresh posts"
            >
              <FiRefreshCw size={20} />
              <span className="ml-1">
                {refreshing ? "Đang tải..." : "Làm mới"}
              </span>
            </button>
          </div>
        </div>

        {/* Full-width post section */}
        <div className="w-full">
          {/* Optional: Trending topics section */}
          <TrendingTopics />

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
                <PostCard key={post.id} post={post} onLike={handleLike} />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create post button */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-8 right-8 bg-pink-500 text-white p-4 rounded-full shadow-lg hover:bg-pink-600 transition-transform hover:scale-110 z-10"
        aria-label="Create new post"
      >
        <FiPlus size={24} />
      </button>

      <CreatePostModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleCreatePost}
        isSubmitting={isSubmitting}
      />
      <Footer />
    </div>
  );
};

export default Pregnancy;
