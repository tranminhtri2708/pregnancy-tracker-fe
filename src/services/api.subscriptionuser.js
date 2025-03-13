import { toast } from "react-toastify";
import api from "../config/axios";

export const getAllSubscriptionPlanUser = async () => {
  try {
    const response = await api.get("Subscription/my-subscriptions");
    console.log(response);
    return response.data.result;
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
