import { toast } from "react-toastify";
import api from "../config/axios";

export const createOrder = async (subscriptionId) =>{
    try{
        const response = await api.post("/orders/create", {subscriptionId});
    return response.data.result;
    } catch (error) {
        toast.error(error.response.data);
    }
}

