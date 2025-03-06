import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfile } from "../../services/api.getprofile";

const ProfilePage = () => {
  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    imgUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        console.log("Profile response:", response);

        // Kiểm tra cấu trúc API trả về và lấy dữ liệu từ trường result
        if (response && response.isSuccess && response.result) {
          const data = response.result;

          setProfileData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            imgUrl: data.imgUrl || "",
          });
        } else {
          // Hiển thị thông báo nếu API trả về lỗi
          if (response && response.errorMessage) {
            toast.error(response.errorMessage);
          } else {
            toast.error("Không thể tải thông tin hồ sơ");
          }
        }
      } catch (error) {
        toast.error("Không thể tải thông tin hồ sơ");
        console.error("Lỗi khi tải hồ sơ:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    // Xử lý sự kiện khi người dùng nhấn nút Edit Profile
    toast.info("Tính năng chỉnh sửa hồ sơ đang được phát triển");
  };

  // Tạo fullName từ firstName và lastName
  const fullName = `${profileData.firstName} ${profileData.lastName}`.trim();

  // Render hình ảnh mặc định hoặc avatar người dùng
  const renderProfileImage = () => {
    if (!profileData.imgUrl || imageError) {
      // Hiển thị avatar mặc định (có thể là chữ cái đầu của tên)
      const initial = fullName ? fullName.charAt(0).toUpperCase() : "?";
      return (
        <div className="w-full h-full bg-pink-300 flex items-center justify-center text-white text-4xl font-bold">
          {initial}
        </div>
      );
    }

    return (
      <img
        src={profileData.imgUrl}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    );
  };

  if (loading) {
    return (
      <div className="bg-pink-50 min-h-screen flex items-center justify-center">
        <div className="text-xl text-pink-500">Đang tải thông tin hồ sơ...</div>
      </div>
    );
  }

  return (
    <div>
      <div>
        {/* Khung chứa avatar và nút edit nằm kế bên nhau */}
        <div className="flex items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200">
            {renderProfileImage()}
          </div>

          <button
            className="ml-4 bg-pink-500 text-white px-4 py-2 rounded-full flex items-center"
            onClick={handleEditProfile}
          >
            <span className="mr-2">✏️</span>
            Edit Profile
          </button>
        </div>

        {/* Khung thông tin cá nhân - đã bỏ border-t */}
        <div className="space-y-4 mt-6">
          <div>
            <p className="text-lg">
              <span className="font-bold">FullName: </span>
              {fullName || "Chưa được cập nhật"}
            </p>
          </div>

          <div>
            <p className="text-lg">
              <span className="font-bold">Phone: </span>
              {profileData.phoneNumber || "Chưa được cập nhật"}
            </p>
          </div>

          <div>
            <p className="text-lg">
              <span className="font-bold">Email: </span>
              {profileData.email || "Chưa được cập nhật"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
