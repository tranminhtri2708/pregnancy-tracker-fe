import { toast } from "react-toastify";
import api from "../config/axios";
// categori của dự án mình là quyền lợi của từng gói thành viên
export const getCategories = async () => {
  try {
    const response = await api.get("categories");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
