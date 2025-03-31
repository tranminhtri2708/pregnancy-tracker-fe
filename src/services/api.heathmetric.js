import api from "../config/axios"; // Your axios instance

export const addNewHealthMetric = async (healthMetricData) => {
  try {
    const response = await api.post("/HealthMetric/AddNewHealthMetric", healthMetricData);
    return response.data; // Return the API response
  } catch (error) {
    console.error("Error adding health metric:", error);
    throw error; // Re-throw the error for further handling
  }
};
export const getHealthMetricsByChild = async (childId) => {
    try {
      const response = await api.get(`/HealthMetric/GetAllHealthMetric`);
      // Filter the response by childrenId
      console.log("response", response.data.result);
      const filteredData = response.data.result.filter(
        (metric) => metric.childrentId === +childId
      );
      console.log("filteredData", filteredData);
      return filteredData; // Return only the filtered data
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      throw error; // Re-throw the error for further handling
    }
  };


export const updateHealthMetric = async (id, healthMetricData) => {
  try {
    const response = await api.put(`/HealthMetric/UpdateHealthMetric/${id}`, healthMetricData);
    return response.data; // Return the updated data
  } catch (error) {
    console.error("Error updating health metric:", error);
    throw error; // Re-throw the error for handling in the UI
  }
};
export const deleteHealthMetric = async (id) => {
  try {
    const response = await api.delete(`/HealthMetric/DeleteHealthMetric/${id}`);
    return response.data; // Return the response from the backend
  } catch (error) {
    console.error("Error deleting health metric:", error);
    throw error; // Re-throw for UI error handling
  }};

export const compareHealthMetrics = async (id) => {
  try{
    const response = await api.get(`/HealthMetric/compareHealthMetricData/${id}`);
    return response;
  }catch(error){
    console.error("Error comparing health metrics:", error);
    throw error;
  }
}