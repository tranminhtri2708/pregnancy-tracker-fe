import { toast } from "react-toastify";
import api from "../config/axios";
// tạo bài viết
export const createPost = async (post) => {
  try {
    const response = await api.post("Post", post);
    return response.data.result;
  } catch (error) {
    
  }
};
export const getPost = async () => {
  try {
    const response = await api.get("Post");
    return response.data.result;
  } catch (error) {
    
  }
};
// lấy danh sách tất cả bài post của account
export const getPostId = async (accountId) => {
  // update cần 2 fill id và product

  try {
    const response = await api.get(`Post/user/${accountId}`); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    
    return null; // để xác định khi nào lỗi và khi nào không lỗi
  }
};
export const deletePost = async (postId) => {
  // update cần 2 fill id và product

  try {
    const response = await api.delete(`Post/${postId}`); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    
    return null; // để xác định khi nào lỗi và khi nào không lỗi
  }
};
export const updatePost = async ({ postId, post }) => {
  // update cần 2 fill id và product

  try {
    const response = await api.put(`Post/${postId}`, post); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    
  }
};
