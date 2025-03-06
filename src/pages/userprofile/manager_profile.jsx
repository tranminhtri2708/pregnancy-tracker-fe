import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/api.getprofile";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    email: "",
    imgUrl: "",
  });
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        console.log("Profile response:", response);

        // Kiểm tra cấu trúc API trả về và lấy dữ liệu từ trường result
        if (response && response.isSuccess && response.result) {
          const data = response.result;

          const profileInfo = {
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phoneNumber: data.phoneNumber || "",
            email: data.email || "",
            imgUrl: data.imgUrl || "",
          };

          setProfileData(profileInfo);
          setEditData(profileInfo); // Khởi tạo dữ liệu chỉnh sửa giống với profileData
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
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset dữ liệu chỉnh sửa về giá trị ban đầu
    setEditData({ ...profileData });
  };

  const handleSaveProfile = async () => {
    try {
      setUpdateLoading(true);

      // Gọi API để cập nhật thông tin
      const response = await updateProfile(editData);

      if (response && response.isSuccess) {
        // Cập nhật state với dữ liệu mới
        setProfileData({ ...editData });
        toast.success(response.message || "Thông tin hồ sơ đã được cập nhật");
        setIsEditing(false);
      } else {
        // Xử lý lỗi
        toast.error(
          response.errorMessage || "Không thể cập nhật thông tin hồ sơ"
        );
      }
    } catch (error) {
      console.error("Lỗi khi cập nhật hồ sơ:", error);
      // Toast error đã được xử lý trong hàm updateProfile
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

          {!isEditing ? (
            <button
              className="ml-4 bg-pink-500 text-white px-4 py-2 rounded-full flex items-center"
              onClick={handleEditProfile}
            >
              <span className="mr-2">✏️</span>
              Edit Profile
            </button>
          ) : (
            <div className="ml-4 flex space-x-2">
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-full"
                onClick={handleCancelEdit}
                disabled={updateLoading}
              >
                Hủy
              </button>
              <button
                className={`${
                  updateLoading ? "bg-green-300" : "bg-green-500"
                } text-white px-4 py-2 rounded-full flex items-center justify-center`}
                onClick={handleSaveProfile}
                disabled={updateLoading}
              >
                {updateLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang lưu...
                  </>
                ) : (
                  "Lưu"
                )}
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          /* Hiển thị thông tin */
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
        ) : (
          /* Form chỉnh sửa */
          <div className="space-y-4 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={editData.firstName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={updateLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tên
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={editData.lastName}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  disabled={updateLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số điện thoại
              </label>
              <input
                type="text"
                name="phoneNumber"
                value={editData.phoneNumber}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={updateLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL Hình ảnh
              </label>
              <input
                type="text"
                name="imgUrl"
                value={editData.imgUrl}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={updateLoading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
