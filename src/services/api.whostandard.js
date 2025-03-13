import { toast } from "react-toastify";
import api from "../config/axios";

// Function to get the latest record for each pregnancyWeek
export const GetAllWHOStatistics = async () => {
  try {
    const response = await api.get("WHOStandard/GetAllWHOStatistics");
    const allData = response.data.result;

    // Helper function to filter data
    const filterLatestByWeek = (data) => {
      // Use a Map to store the latest record for each pregnancyWeek
      const latestByWeek = new Map();

      data.forEach((item) => {
        const week = item.pregnancyWeek;

        // If week doesn't exist in Map or the item's ID is greater, update the entry
        if (!latestByWeek.has(week) || item.id > latestByWeek.get(week).id) {
          latestByWeek.set(week, item);
        }
      });

      // Convert Map values (latest records) back to an array
      return Array.from(latestByWeek.values());
    };

    // Apply the filtering logic
    const filteredData = filterLatestByWeek(allData);

    return filteredData; // Return the filtered results
  } catch (error) {
    toast.error(error.response?.data || "An error occurred while fetching data."); // Handle and display errors
  }
};
export const AddWHOStandard = async (newRecord) => {
    try {
      // Make a POST request to the API
      const response = await api.post("WHOStandard/AddWHOStandard", newRecord);
  
      // Notify the user about the success
      toast.success("New WHO Standard record added successfully!");
      return response.data; // Return the response from the API
    } catch (error) {
      // Notify the user about the error
      toast.error(
        error.response?.data || "An error occurred while adding the record."
      );
      throw error; // Re-throw the error for additional handling
    }
  };
  export const UpdateWHOStandard = async (id, updatedRecord) => {
    try {
      // Make a PUT request to the API with the ID and updated data
      const response = await api.put(`WHOStandard/UpdateWHOData/${id}`, updatedRecord);
  
      // Notify the user about the success
      toast.success("WHO Standard record updated successfully!");
      console.log("api",updatedRecord);
      return response.data; // Return the response from the API
    } catch (error) {
      // Notify the user about the error
      toast.error(
        error.response?.data || "An error occurred while updating the record."
      );
      throw error; // Re-throw the error for additional handling
    }
  };
  export const DeleteWHOStandard = async (id) => {
  try {
    // Call the DELETE API with the provided ID
    const response = await api.delete(`WHOStandard/DeleteWHOData/${id}`);
    
    // Notify success
    toast.success("WHO Standard record deleted successfully!");
    return response.data; // Return the response if needed
  } catch (error) {
    // Notify failure
    toast.error(
      error.response?.data || "An error occurred while deleting the record."
    );
    throw error; // Re-throw the error for additional handling
  }
};
  