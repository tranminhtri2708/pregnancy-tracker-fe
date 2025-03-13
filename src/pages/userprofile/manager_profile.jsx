import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { getProfile, updateProfile } from "../../services/api.getprofile";
import { Image, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";

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

  // Image upload state
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const response = await getProfile();
        console.log("Profile response:", response);

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
          setEditData(profileInfo);

          // Initialize fileList if imgUrl exists
          if (data.imgUrl) {
            setFileList([
              {
                uid: "-1",
                name: "profile-image.png",
                status: "done",
                url: data.imgUrl,
              },
            ]);
          }
        } else {
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

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);

    // Update editData.imgUrl when a file is uploaded successfully
    if (newFileList.length > 0) {
      const lastFile = newFileList[newFileList.length - 1];

      if (lastFile.status === "done" && lastFile.response) {
        // If the upload API returns an image URL
        if (lastFile.response.url) {
          setEditData((prev) => ({
            ...prev,
            imgUrl: lastFile.response.url,
          }));
        }
      } else if (lastFile.status === "done" && lastFile.url) {
        // If file already has URL (like when we initialize from existing profile)
        setEditData((prev) => ({
          ...prev,
          imgUrl: lastFile.url,
        }));
      } else if (lastFile.originFileObj) {
        // For local preview before upload completes
        getBase64(lastFile.originFileObj).then((base64Url) => {
          setEditData((prev) => ({
            ...prev,
            imgUrl: base64Url,
          }));
        });
      }
    } else {
      // No files, clear the imgUrl
      setEditData((prev) => ({
        ...prev,
        imgUrl: "",
      }));
    }
  };

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

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Reset edit data and fileList to original values
    setEditData({ ...profileData });

    // Reset fileList to match the profile image
    if (profileData.imgUrl) {
      setFileList([
        {
          uid: "-1",
          name: "profile-image.png",
          status: "done",
          url: profileData.imgUrl,
        },
      ]);
    } else {
      setFileList([]);
    }
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
      toast.error("Không thể cập nhật thông tin hồ sơ");
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

  // Custom request handler for Upload component
  const customUploadRequest = async ({ file, onSuccess, onError }) => {
    try {
      // Here you would normally upload to your server
      // For now, we'll simulate a successful upload and use FileReader for preview
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64Url = reader.result;

        // Update the imgUrl in editData
        setEditData((prev) => ({
          ...prev,
          imgUrl: base64Url,
        }));

        // Call onSuccess to update the Upload component's internal state
        onSuccess({ url: base64Url }, file);
      };
    } catch (error) {
      console.error("Upload error:", error);
      onError(error);
    }
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
        {/* Khung chứa avatar và edit button (only shown when not editing) */}
        <div className="flex items-center mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-pink-200">
            {renderProfileImage()}
          </div>

          {!isEditing && (
            <button
              className="ml-4 bg-pink-500 text-white px-4 py-2 rounded-full flex items-center"
              onClick={handleEditProfile}
            >
              <span className="mr-2">✏️</span>
              Edit Profile
            </button>
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
          <div className="space-y-4 mt-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Edit Profile
            </h2>

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
                Hình ảnh
              </label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                customRequest={customUploadRequest}
                maxCount={1}
              >
                {fileList.length >= 1 ? null : uploadButton}
              </Upload>
              {previewImage && (
                <Image
                  wrapperStyle={{
                    display: "none",
                  }}
                  preview={{
                    visible: previewOpen,
                    onVisibleChange: (visible) => setPreviewOpen(visible),
                    afterOpenChange: (visible) =>
                      !visible && setPreviewImage(""),
                  }}
                  src={previewImage}
                />
              )}
            </div>

            {/* Form action buttons moved to the bottom */}
            <div className="flex justify-end space-x-2 pt-4 mt-6 border-t border-gray-100">
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
