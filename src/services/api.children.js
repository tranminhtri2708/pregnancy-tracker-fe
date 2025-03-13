import { toast } from "react-toastify";
import api from "../config/axios";

// dùng chung cho nhiều lần
// mỗi kh lấy danh sách subscription gọi đến hàm này
// lấy tất cả các children
export const getAllChildren = async () => {
  try {
    const response = await api.get("Children/GetAllChildren");
    console.log(response);
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
export const createChildren = async (children) => {
  try {
    const response = await api.post("Children/AddNewChildren", children); // đẩy thông ting đứa bé đí
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
export const updateChildren = async ({ id, children }) => {
  try {
    const response = await api.put(
      `Children/UpdateChildrenData/${id}`,
      children
    );
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
export const deleteChildren = async (id) => {
  try {
    const response = await api.delete(`Children/DeleteChildrenDetail/${id}`);
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
