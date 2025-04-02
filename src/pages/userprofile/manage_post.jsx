import { useState, useEffect } from "react";
import { FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { deletePost, getPostId, updatePost } from "../../services/api.post";
import { getProfile } from "../../services/api.getprofile";
import { Image, Popconfirm, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

const ManageMyPost = () => {
  const [posts, setPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingPost, setEditingPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  // Fetch user profile
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await getProfile();
        console.log("Thông tin người dùng nhận được:", userInfo);

        if (userInfo) {
          const userData = userInfo.data || userInfo.result || userInfo;
          console.log("User data processed:", userData);

          setCurrentUser(userData);

          if (userData && userData.id) {
            console.log("User ID found:", userData.id);
          } else {
            console.error(
              "ID người dùng không tồn tại trong dữ liệu nhận được"
            );
          }
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

  // Fetch posts when user info is available
  useEffect(() => {
    const fetchPosts = async () => {
      if (!currentUser) {
        console.log("Đang đợi thông tin người dùng...");
        return;
      }

      setIsLoading(true);

      // Xác định ID người dùng
      let userId;
      if (typeof currentUser === "object") {
        userId =
          currentUser.id ||
          currentUser.userId ||
          currentUser.accountId ||
          currentUser.account?.id;
      } else if (typeof currentUser === "number") {
        userId = currentUser;
      }

      console.log("Đang tải bài viết với userId:", userId);

      if (!userId) {
        setError("Không tìm thấy ID người dùng");
        setIsLoading(false);
        toast.error("Không thể xác định ID người dùng");
        return;
      }

      try {
        const response = await getPostId(userId);
        console.log("API response:", response);

        if (response && response.isSuccess) {
          const postsData = response.result || [];
          console.log("Post data received:", postsData);

          if (Array.isArray(postsData) && postsData.length > 0) {
            const formattedPosts = postsData.map((post) => ({
              id: post.id,
              title: post.title,
              content: post.content,
              image: post.imageUrl,
              date: new Date(post.createdDate),
              authorName: post.authorName,
              authorImage: post.authorImageUrl,
            }));

            setPosts(formattedPosts);
            console.log("Đã định dạng bài viết:", formattedPosts);
          } else {
            console.log("Không có bài viết nào được tìm thấy");
            setPosts([]);
          }
        } else {
          const errorMsg = response?.message || "Không thể tải bài viết";
          setError(errorMsg);
          toast.error(errorMsg);
        }
      } catch (err) {
        console.error("Chi tiết lỗi:", err);
        setError("Lỗi khi tải bài viết");
        toast.error("Lỗi khi tải bài viết");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [currentUser]);

  const handleDelete = async (postId) => {
    try {
      const response = await deletePost(postId);

      if (response) {
        const updatedPosts = posts.filter((post) => post.id !== postId);
        setPosts(updatedPosts);
        toast.success("Xóa bài viết thành công");
      } else {
        toast.error("Không thể xóa bài viết");
      }
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      toast.error("Lỗi khi xóa bài viết");
    }
  };

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
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  // Xử lý khi người dùng bắt đầu chỉnh sửa bài
  const handleStartEditing = (post) => {
    setEditingPost(post);

    // Khởi tạo fileList từ ảnh hiện tại nếu có
    if (post.image) {
      setFileList([
        {
          uid: "-1",
          name: "current-image.jpg",
          status: "done",
          url: post.image,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  // Hủy chỉnh sửa
  const handleCancelEdit = () => {
    setEditingPost(null);
    setFileList([]);
  };

  const handleUpdate = async (postId, updatedData) => {
    try {
      // Tạo đối tượng bài viết cập nhật
      const post = {
        title: updatedData.title,
        content: updatedData.content,
      };

      let imageUrl = updatedData.image; // Ban đầu giữ nguyên URL hiện tại

      // Kiểm tra xem có tệp mới được tải lên không
      if (fileList && fileList.length > 0 && fileList[0].originFileObj) {
        // Nếu có file mới (originFileObj tồn tại), tải lên và lấy URL
        try {
          const uploadedUrl = await uploadFile(fileList[0].originFileObj);
          if (uploadedUrl) {
            imageUrl = uploadedUrl;
            post.imgUrl = uploadedUrl; // Cập nhật URL ảnh mới vào đối tượng post
          }
        } catch (uploadError) {
          console.error("Lỗi khi tải lên ảnh:", uploadError);
          toast.error("Không thể tải lên ảnh mới");
          // Tiếp tục cập nhật với ảnh cũ
        }
      } else if (fileList.length === 0) {
        // Nếu xóa ảnh
        post.imgUrl = ""; // Gửi URL rỗng để xóa ảnh
        imageUrl = "";
      }

      // Gọi API cập nhật bài viết
      const response = await updatePost({ postId, post });

      if (response && response.isSuccess) {
        // Cập nhật trạng thái local
        const updatedPosts = posts.map((p) =>
          p.id === postId
            ? {
                ...p,
                title: updatedData.title,
                content: updatedData.content,
                image: imageUrl,
              }
            : p
        );

        setPosts(updatedPosts);
        setEditingPost(null);
        setFileList([]);
        toast.success("Cập nhật bài viết thành công");
      } else {
        const errorMsg = response?.message || "Không thể cập nhật bài viết";
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Lỗi khi cập nhật bài viết:", err);
      toast.error("Lỗi khi cập nhật bài viết");
    }
  };

  const filteredPosts = posts.filter((post) =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add a search component at the top
  const SearchBar = () => <div className="mb-6"></div>;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải bài viết...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 text-lg">{error}</p>
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            onClick={() => window.location.reload()}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <SearchBar />

      {filteredPosts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            Không tìm thấy bài viết nào. Hãy bắt đầu tạo bài viết đầu tiên của
            bạn!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl shadow-md overflow-hidden"
            >
              <div className="md:flex">
                <div className="md:w-1/3">
                  {post.image ? (
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                      <p className="text-gray-500">Không có hình ảnh</p>
                    </div>
                  )}
                </div>
                <div className="p-6 md:w-2/3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center space-x-2">
                      {post.authorImage ? (
                        <img
                          src={post.authorImage}
                          alt={post.authorName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-300"></div>
                      )}
                      <div>
                        <p className="text-xs text-gray-500 mt-1">
                          By {post.authorName || "Unknown"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStartEditing(post)}
                        aria-label="Edit post"
                        className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                      >
                        <FaEdit />
                      </button>
                      <Popconfirm
                        title="Xóa bài viết"
                        description="Bạn có chắc chắn muốn xóa bài viết này không?"
                        onConfirm={() => handleDelete(post.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                      >
                        <button
                          aria-label="Delete post"
                          className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </Popconfirm>
                    </div>
                  </div>
                  <h2 className="mt-4 text-2xl font-semibold text-gray-800">
                    {post.title}
                  </h2>
                  {editingPost?.id === post.id ? (
                    <div className="mt-4">
                      <input
                        type="text"
                        className="w-full p-2 mb-2 border rounded-lg"
                        value={editingPost.title}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            title: e.target.value,
                          })
                        }
                      />
                      <textarea
                        className="w-full p-2 border rounded-lg"
                        rows="4"
                        value={editingPost.content}
                        onChange={(e) =>
                          setEditingPost({
                            ...editingPost,
                            content: e.target.value,
                          })
                        }
                      />
                      <div className="mt-4">
                        <p className="mb-2 text-sm text-gray-600">
                          Ảnh bài viết:
                        </p>
                        <Upload
                          listType="picture-card"
                          fileList={fileList}
                          onPreview={handlePreview}
                          onChange={handleChange}
                          beforeUpload={() => false} // Ngăn tải lên tự động
                          maxCount={1} // Chỉ cho phép 1 ảnh
                        >
                          {fileList.length >= 1 ? null : uploadButton}
                        </Upload>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleUpdate(post.id, editingPost)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <p className="text-gray-600">{post.content}</p>
                    </div>
                  )}
                  <div className="mt-6 flex items-center justify-between">
                    <time className="text-sm text-gray-500">
                      {format(post.date, "MMM dd, yyyy")}
                    </time>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Preview Image Modal */}
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
  );
};

export default ManageMyPost;
