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
export const updateRoleUser = async ({ customerId, personal }) => {
  try {
    const response = await api.put(
      `UserAccount/UpdateUserRoleProfile/${customerId}`,
      personal
    );
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
