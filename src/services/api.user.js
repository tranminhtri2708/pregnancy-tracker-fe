import { toast } from "react-toastify";
import api from "../config/axios";

// xử lý api liên quan đến user
// lấy danh sách user
export const getUser = async () => {
  try {
    const response = await api.get("UserAccount/GetAllAccountAsync");
    return response.data.result;
  } catch (error) {
    toast.error(error.response.data);
  }
};
