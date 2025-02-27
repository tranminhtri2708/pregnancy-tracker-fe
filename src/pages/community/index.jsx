import React, { useState } from "react";
import {
  FiHeart,
  FiMessageSquare,
  FiPlus,
  FiSearch,
  FiSave,
} from "react-icons/fi";
import Header from "../../components/header";
import Footer from "../../components/footer";

// Dữ liệu mẫu được tách riêng để dễ quản lý
const INITIAL_POSTS = [
  {
    id: 1,
    user: {
      name: "Sarah Johnson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    },
    timestamp: "2 hours ago",
    content:
      "Starting my third trimester today! Any tips from experienced moms?",
    image: "https://images.unsplash.com/photo-1518932945647-7a1c969f8be2",
    likes: 24,
    comments: 8,
  },
  {
    id: 2,
    user: {
      name: "Emily Davis",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
    },
    timestamp: "4 hours ago",
    content: "First ultrasound today! So excited to meet our little one.",
    image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d",
    likes: 42,
    comments: 12,
  },
];

// Dữ liệu mẫu cho các nhóm cộng đồng
const COMMUNITY_GROUPS = [
  {
    id: 1,
    name: "Mẹ Bầu 3 Tháng Đầu",
    members: 2400,
    posts: 320,
    icon: "https://img.icons8.com/?size=100&id=17061&format=png&color=000000",
  },
  {
    id: 2,
    name: "Mẹ Bầu 3 Tháng Giữa",
    members: 1800,
    posts: 280,
    icon: "https://img.icons8.com/?size=100&id=wraoCSnFlSrw&format=png&color=000000",
  },
  {
    id: 3,
    name: "Mẹ Bầu 3 Tháng Cuối",
    members: 2100,
    posts: 310,
    icon: "https://img.icons8.com/?size=100&id=UpLMHtRX4A2A&format=png&color=000000",
  },
  {
    id: 4,
    name: "Dinh Dưỡng Mẹ Bầu",
    members: 1500,
    posts: 250,
    icon: "https://img.icons8.com/?size=100&id=25478&format=png&color=000000",
  },
];

// Component hiển thị nhóm cộng đồng
const CommunityGroupCard = ({ group }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 transition-all hover:shadow-lg">
      <div className="flex items-center">
        <img
          src={group.icon}
          alt={group.name}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <div className="ml-3 flex-1">
          <h3 className="font-semibold text-gray-800">{group.name}</h3>
          <p className="text-sm text-gray-500">
            {group.members.toLocaleString()} thành viên • {group.posts} bài viết
          </p>
        </div>
        <button className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm hover:bg-pink-200 transition-colors">
          Tham gia
        </button>
      </div>
    </div>
  );
};

// Tách PostCard thành component riêng biệt
const PostCard = ({ post, onLike }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 transition-all hover:shadow-lg">
      <div className="flex items-center mb-4">
        <img
          src={post.user.avatar}
          alt={post.user.name}
          className="h-10 w-10 rounded-full object-cover"
          loading="lazy"
        />
        <div className="ml-3">
          <h3 className="font-semibold text-gray-800">{post.user.name}</h3>
          <p className="text-sm text-gray-500">{post.timestamp}</p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{post.content}</p>
      {post.image && (
        <div className="mb-4 overflow-hidden rounded-lg">
          <img
            src={post.image}
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
          aria-label={`Like post. Current likes: ${post.likes}`}
        >
          <FiHeart />
          <span>{post.likes}</span>
        </button>
        <button
          className="flex items-center space-x-2 text-gray-600 hover:text-pink-500 transition-colors"
          aria-label={`Comment on post. Current comments: ${post.comments}`}
        >
          <FiMessageSquare />
          <span>{post.comments}</span>
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

// Component cho phần trending
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

// Tách CreatePostModal thành component riêng biệt
const CreatePostModal = ({ show, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle("");
    setContent("");
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-pink-200 bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Create Post
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            required
          />
          <textarea
            placeholder="Share your thoughts..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded-lg h-32 focus:ring-2 focus:ring-pink-300 focus:border-pink-300"
            required
          ></textarea>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
            >
              Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Banner component được điều chỉnh để hiển thị ảnh tốt hơn
const Banner = () => (
  <div className="w-full mt-25 flex justify-center">
    <div
      className="w-full max-w-6xl h-auto py-55"
      style={{
        background: `url('https://cdn-together.hellohealthgroup.com/2024/10/1729480091_6715c59be23826.55274785') no-repeat center center`,
        backgroundSize: "cover",
        minHeight: "300px",
        width: "100%", // Chiếm toàn bộ chiều ngang
      }}
      role="img"
      aria-label="Community banner"
    ></div>
  </div>
);

const UnderBanner = () => (
  <div className="w-full max-w-6xl mx-auto bg-white p-4 shadow-lg flex items-center justify-between gap-x-4">
    {/* Ảnh đại diện */}
    <div className="w-12 h-12 flex-shrink-0">
      <img
        src="https://img.icons8.com/?size=100&id=5ylCh8WWmAHf&format=png&color=000000" // Thay bằng URL icon thật
        alt="Community Icon"
        className="w-full h-full object-cover rounded-full"
      />
    </div>

    {/* Nội dung */}
    <div className="flex-1">
      <h2 className="text-lg font-bold">Chuẩn bị mang thai</h2>
      <div className="text-gray-600 text-sm flex items-center gap-x-4">
        <span>4 chủ đề</span>
        <span>💬 7.2k tương tác</span>
        <span>👥 6k thành viên</span>
      </div>
    </div>

    {/* Nút tham gia */}
    <button className="bg-pink-500 text-white px-4 py-2 rounded-full flex items-center gap-x-2">
      <span className="text-lg">➕</span>
      <span>Tham gia</span>
    </button>
  </div>
);

const Pregnancy = () => {
  const [posts, setPosts] = useState(INITIAL_POSTS);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreatePost = ({ title, content }) => {
    const newPost = {
      id: posts.length + 1,
      user: {
        name: "Current User",
        avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
      },
      timestamp: "Just now",
      content: content,
      title: title,
      likes: 0,
      comments: 0,
    };
    setPosts([newPost, ...posts]);
  };

  const handleLike = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

  const filteredPosts = posts.filter((post) =>
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <Banner />
      <UnderBanner />

      {/* Main content with two columns */}
      <main className="max-w-6xl mx-auto py-8 px-4 flex-grow w-full">
        <div className="flex justify-between mb-8">
          {/* Thanh tìm kiếm */}
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
        </div>

        {/* Two column layout */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Left column for posts - takes 2/3 of the space */}
          <div className="w-full lg:w-2/3">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-gray-500 text-lg">
                  No posts found. Create a new post!
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

          {/* Right column for community groups - takes 1/3 of the space */}
          <div className="w-full lg:w-1/3">
            <TrendingTopics />

            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-bold text-lg text-gray-800">Cộng đồng</h2>
                <a href="#" className="text-pink-500 text-sm hover:underline">
                  Xem tất cả
                </a>
              </div>

              {COMMUNITY_GROUPS.map((group) => (
                <CommunityGroupCard key={group.id} group={group} />
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Nút tạo bài viết */}
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
      />
      <Footer />
    </div>
  );
};

export default Pregnancy;
