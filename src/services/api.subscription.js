import { toast } from "react-toastify";
import api from "../config/axios";

// dùng chung cho nhiều lần
// mỗi kh lấy danh sách subscription gọi đến hàm này
export const getProduct = async () => {
  try {
    const response = await api.get("products");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const createProduct = async (product) => {
  try {
    const response = await api.post("products", product); // đẩy thông tin vừa nhập đi
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
