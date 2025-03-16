import { toast } from "react-toastify";
import api from "../config/axios";

export const createPayment = async (orderId) =>{
    try{
        const response = await api.post("/Payment", {orderId});
    return response.data.result;
    } catch (error) {
        toast.error(error.response.data);
    }
}
