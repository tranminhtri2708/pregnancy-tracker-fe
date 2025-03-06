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
