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
export const updateProduct = async ({ id, product }) => {
  // update cần 2 fill id và product

  try {
    const response = await api.put(`products/${id}`, product); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const deleteProduct = async (id) => {
  // update cần 2 fill id và product

  try {
    const response = await api.delete(`products/${id}`); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    return null; // để xác định khi nào lỗi và khi nào không lỗi
  }
};
