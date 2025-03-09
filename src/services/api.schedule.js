import { toast } from "react-toastify";
import api from "../config/axios";
// lấy lịch
export const getSchedule = async () => {
  try {
    const response = await api.get("Schedule/GetAllSchedule");
    return response.data;
  } catch (error) {
    toast.error(error.response.data);
  }
};
export const createSchedule = async (scheduleData) => {
  try {
    const response = await api.post("Schedule/CreateSchedule", scheduleData); // đẩy thông ting đứa bé đí
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
export const updateSchedule = async ({ id, scheduleData }) => {
  try {
    const response = await api.put(
      `Schedule/UpdateSchedule/${id}`,
      scheduleData
    );
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
export const deleteSchedule = async (id) => {
  try {
    const response = await api.delete(`Schedule/DeleteSchedule/${id}`);
    return response.data; // trả về danh sách đứa con
  } catch (error) {
    toast.error(error.response.data); // lấy bị lỗi thì sẽ show ra lỗi
  }
};
