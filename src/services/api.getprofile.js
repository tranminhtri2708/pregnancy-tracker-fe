import { toast } from "react-toastify";
import api from "../config/axios";

// dùng chung cho nhiều lần
// mỗi kh lấy danh sách subscription gọi đến hàm này
export const getProfile = async () => {
  try {
    const response = await api.get("UserAccount/GetUserProfile");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
// api update profile
// Cập nhật hàm updateProfile để gửi dữ liệu
export const updateProfile = async (personal) => {
  try {
    const response = await api.put("UserAccount/UpdateUserProfile", personal);
    return response.data;
  } catch (error) {
    if (error.response && error.response.data) {
      toast.error(error.response.data);
    } else {
      toast.error("Đã xảy ra lỗi khi cập nhật thông tin");
    }
    throw error; // Ném lỗi để hàm gọi có thể xử lý
  }
};
