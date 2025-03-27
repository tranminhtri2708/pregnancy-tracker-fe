import { toast } from "react-toastify";
import api from "../config/axios";

// dùng chung cho nhiều lần
// mỗi kh lấy danh sách subscription gọi đến hàm này
export const getSubscriptionPlan = async () => {
  try {
    const response = await api.get("SubscriptionPlan");
    return response.data.result;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const createSubscriptionPlan = async (subscriptionPlan) => {
  try {
    const response = await api.post("SubscriptionPlan", subscriptionPlan); // đẩy thông tin vừa nhập đi
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const updateSubscriptionPlan = async ({ planId, subscriptionPlan }) => {
  // update cần 2 fill id và product

  try {
    const response = await api.put(
      `SubscriptionPlan/${planId}`,
      subscriptionPlan
    ); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const deleteSubscriptionPlan = async (planId) => {
  // update cần 2 fill id và product

  try {
    const response = await api.delete(`SubscriptionPlan/${planId}`); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    return null; // để xác định khi nào lỗi và khi nào không lỗi
  }
};
// lấy các gói lên giao diện
export const getSubscriptionPlanId = async (planId) => {
  // update cần 2 fill id và product

  try {
    const response = await api.get(`SubscriptionPlan/${planId}`); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    return null; // để xác định khi nào lỗi và khi nào không lỗi
  }
};
// admin quản lý các gói thành viên mà người dùng đã mua và đang sử dụng
export const getAllMemberByPlan = async (PlansName) => {
  // update cần 2 fill id và product

  try {
    const response = await api.get(
      `UserAccount/GetAllMemberByPlan/${PlansName}`
    ); // truyền dữ liệu cần update xuống be
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
    return null; // để xác định khi nào lỗi và khi nào không lỗi
  }
};
