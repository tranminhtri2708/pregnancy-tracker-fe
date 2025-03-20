import { toast } from "react-toastify";
import api from "../config/axios";

const getUserID = async () => {
    try {
      const response = await api.get("UserAccount/GetUserId");

        return response.data.result.userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      toast.error(
        "Lỗi khi lấy thông tin người dùng: " +
          (error.message || "Không xác định")
      );
      return null;
    }
  };

  export const getClosestSchedule = async () => {
    try {
      const response = await api.get("Schedule/GetAllSchedule");
      // Filter the response data by accountId
      const targetAccountId = await getUserID();
      const filteredData = response.data.result.filter(
        (schedule) => schedule.accountId === +targetAccountId
      );
  
      const formattedAppointments = filteredData.map((item) => {
        const dateObj = parseApiDate(item.appointmentDate);
  
        return {
          id: item.id,
          date: dateObj,
          description: item.description,
          isNoti: item.isNoti,
          appointmentDate: item.appointmentDate,
        };
      });
  
      // Find the closest date to the current date
      const currentDate = new Date();
      let closestSchedule = null;
      let closestDiff = Infinity;
  
      formattedAppointments.forEach((appointment) => {
        const appointmentDate = new Date(appointment.date);
        const diff = Math.abs(appointmentDate - currentDate);
  
        if (diff < closestDiff && appointmentDate >= currentDate) {
          closestDiff = diff;
          closestSchedule = appointment;
        }
      });
      console.log("Closest schedule:", closestSchedule);
      return closestSchedule || "No upcoming schedules found.";
    } catch (error) {
      toast.error(error.response?.data || "An error occurred");
    }
  };
  

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