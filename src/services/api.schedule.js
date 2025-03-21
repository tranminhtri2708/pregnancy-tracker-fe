import { toast } from "react-toastify";
import api from "../config/axios";
// lấy lịch

const parseApiDate = (dateString) => {
  try {
    // Create a new Date object from the ISO string
    const date = new Date(dateString);

    // For debugging if needed
    // console.log("Original API date:", dateString);
    // console.log("Parsed date hours:", date.getHours(), "UTC hours:", date.getUTCHours());

    return date;
  } catch (error) {
    console.error("Invalid date format:", dateString);
    return new Date();
  }
};


export const getSchedule = async (targetAccountId) => {
  try {
    const response = await api.get("Schedule/GetAllSchedule");
    // Filter the response data by accountId
    const filteredData = response.data.result.filter(schedule => schedule.accountId === +targetAccountId);
    const formattedAppointments = filteredData.map((item) => {
      const dateObj = parseApiDate(item.appointmentDate);

      return {
        id: item.id,
        date: dateObj,
        description: item.description,
        notify: item.isNoti,
        appointmentDate: item.appointmentDate,
      };
    });
    return formattedAppointments;
  } catch (error) {
    toast.error(error.response?.data || "An error occurred");
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
