import { toast } from "react-toastify";
import api from "../config/axios";

export const getAllSubscriptionPlanUser = async () => {
  try {
    const response = await api.get("Subscription/my-subscriptions");
    return response.data.result;
  } catch (error) {
  }
};

export const createSubscription = async (id) =>{
  try{
    const response = await api.post("Subscription", id); 
    
    return response.data.result.id;
  }
  catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
}