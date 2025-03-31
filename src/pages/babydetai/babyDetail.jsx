import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Form, message } from "antd";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import { getChildById } from "../../services/api.children";
import { GetAllWHOStatistics } from "../../services/api.whostandard";
import { getClosestSchedule } from "../../services/api.notification";

import {
  addNewHealthMetric,
  getHealthMetricsByChild,
  updateHealthMetric,
  deleteHealthMetric,
} from "../../services/api.heathmetric";

const BabyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // State Variables
  const [child, setChild] = useState(null);
  const [filteredWHOData, setFilteredWHOData] = useState(null);
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [filteredMetrics, setFilteredMetrics] = useState([]);
  const [weeksUntilBirth, setWeeksUntilBirth] = useState(null);
  const [daysUntilDue, setDaysUntilDue] = useState(null);
  const [daysUntilNextAppointment, setDaysUntilNextAppointment] =
    useState(null);
  const [currentTrimester, setCurrentTrimester] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(true);

  // Helper function for pregnancy week calculation
  const calculateCurrentPregnancyWeek = (birthDate) => {
    const currentDate = dayjs();
    const daysUntilBirth = dayjs(birthDate).diff(currentDate, "day");
    return {
      currentPregnancyWeek: 40 - Math.ceil(daysUntilBirth / 7),
      daysUntilBirth,
    };
  };

  // Fetch WHO Data
  const fetchWHOData = async (currentPregnancyWeek) => {
    try {
      const allWHOData = await GetAllWHOStatistics();
      const dataForCurrentWeek = allWHOData.find(
        (item) => item.pregnancyWeek === currentPregnancyWeek
      );
      setFilteredWHOData(dataForCurrentWeek || null);
    } catch (error) {
      console.error("Error fetching WHO data:", error);
      message.error("Failed to fetch WHO standards.");
    }
  };
  const handleNavigateToGraph = () => {
    navigate(`/graph/${id}`); // Dynamically navigate to graph/id
  };
  // Fetch Child Details
  const getChildDetails = async () => {
    try {
      const childData = await getChildById(id);
      if (!childData) {
        message.error("Child data not found.");
        return;
      }

      setChild(childData);

      const { currentPregnancyWeek, daysUntilBirth } =
        calculateCurrentPregnancyWeek(childData.birth);

      setWeeksUntilBirth(40 - currentPregnancyWeek);
      setDaysUntilDue(daysUntilBirth);

      // Set Trimester Based on Current Pregnancy Week
      setCurrentTrimester(
        currentPregnancyWeek <= 13
          ? "Tam cá nguyệt thứ nhất"
          : currentPregnancyWeek <= 27
          ? "Tam cá nguyệt thứ hai"
          : "Tam cá nguyệt thứ ba"
      );

      // Fetch WHO Data
      await fetchWHOData(currentPregnancyWeek);

      // Fetch Closest Appointment
      const response = await getClosestSchedule();
      if (response?.appointmentDate) {
        setDaysUntilNextAppointment(
          dayjs(response.appointmentDate).diff(dayjs(), "day")
        );
        setChild((prevChild) => ({
          ...prevChild,
          nextAppointment: dayjs(response.appointmentDate).format(
            "DD/MM/YYYY HH:mm"
          ),
        }));
      } else {
        setDaysUntilNextAppointment(null);
        setChild((prevChild) => ({
          ...prevChild,
          nextAppointment: "Chưa có thông tin",
        }));
      }
    } catch (error) {
      console.error("Error fetching child details:", error);
      message.error("Failed to fetch child details.");
    }
  };

  // Fetch Health Metrics
  const getChildHealthMetrics = async () => {
    try {
      const data = await getHealthMetricsByChild(id);
      const currentPregnancyWeek = weeksUntilBirth
        ? 40 - weeksUntilBirth
        : null;

      const filteredData = currentPregnancyWeek
        ? data.filter((metric) => metric.pregnancyWeek === currentPregnancyWeek)
        : data;

      setHealthMetrics(data);
      setFilteredMetrics(filteredData);
    } catch (error) {
      console.error("Error fetching health metrics:", error);
      message.error("Failed to fetch health metrics.");
    }
  };

  // Combined Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getChildDetails();
      await getChildHealthMetrics();
      setIsLoading(false);
    };

    fetchData();
  }, [id]);

  // Handle Add/Edit Modal
  const handleAddNew = () => {
    form.resetFields();
    setIsEditing(false);
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsEditing(true);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHealthMetric(id);
      message.success("Health metric deleted successfully.");
      await getChildHealthMetrics();
    } catch (error) {
      console.error("Error deleting health metric:", error);
      message.error("Failed to delete health metric.");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const currentPregnancyWeek = 40 - weeksUntilBirth;

      if (isEditing) {
        await updateHealthMetric(editingRecord.id, values);
        message.success("Health metric updated successfully.");
      } else {
        await addNewHealthMetric({
          ...values,
          childrentId: id,
          pregnancyWeek: currentPregnancyWeek,
        });
        message.success("Health metric added successfully.");
      }

      setIsModalVisible(false);
      await getChildHealthMetrics();
    } catch (error) {
      console.error("Error saving health metric:", error);
      message.error("Failed to save health metric.");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Loading State
  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">
          Thông Tin Bé {child.fullName}
        </h1>
        <p className="text-gray-600">
          Chào trở lại! Đây là thông tin khái quát về tình trạng sức khỏe của
          thai nhi
        </p>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 text-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Thông Tin Tổng Hợp
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Pregnancy Week */}
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              Tuần thai hiện tại
            </h3>
            <p className="text-2xl font-bold text-pink-600 mt-2">
              {weeksUntilBirth > 0
                ? `${40 - weeksUntilBirth} tuần`
                : "Ngày dự sinh đã qua."}
            </p>
            <p className="text-sm text-gray-500">{currentTrimester}</p>
          </div>
          {/* Due Date */}
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              Ngày Dự Sinh
            </h3>
            <p className="text-2xl font-bold text-pink-600 mt-2">
              {dayjs(child.birth).format("DD/MM/YYYY")}
            </p>
            {daysUntilDue > 0 && (
              <p className="text-sm text-gray-500">
                {daysUntilDue} ngày còn lại
              </p>
            )}
          </div>
          {/* Upcoming Appointment */}
          <div>
            <h3 className="text-lg font-semibold text-gray-600">
              Lịch khám sắp đến
            </h3>
            <p className="text-2xl font-bold text-pink-600 mt-2">
              {child.nextAppointment
                ? child.nextAppointment
                : "Chưa có thông tin"}
            </p>
            {daysUntilNextAppointment > 0 && (
              <p className="text-sm text-gray-500">
                {daysUntilNextAppointment} ngày còn lại
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Chỉ số sức khỏe của tuần hiện tại
        </h2>
        <div className="flex flex-col items-center space-y-6">
          {/* Weight Progress Bar */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Cân nặng (grams)
            </h3>
            {/* Min and Max Labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span className="text-gray-500">
                {filteredWHOData?.weightMin || 0} g
              </span>
              <span className="text-gray-500">
                {filteredWHOData?.weightMax || 0} g
              </span>
            </div>
            {/* Progress Bar */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: `${
                    healthMetrics.length &&
                    filteredWHOData?.weightMin !== undefined &&
                    filteredWHOData?.weightMax !== undefined &&
                    healthMetrics[0]?.weight
                      ? ((healthMetrics[0]?.weight -
                          filteredWHOData?.weightMin) /
                          (filteredWHOData?.weightMax -
                            filteredWHOData?.weightMin)) *
                        100
                      : 0
                  }%`,
                  backgroundColor: "black",
                  height: "12px",
                  borderRadius: "6px",
                }}
              ></div>
              <div
                style={{
                  width: `${
                    healthMetrics.weight &&
                    filteredWHOData?.weightMin !== undefined &&
                    filteredWHOData?.weightMax !== undefined &&
                    healthMetrics[0]?.weight
                      ? 100 -
                        ((healthMetrics[0]?.weight -
                          filteredWHOData?.weightMin) /
                          (filteredWHOData?.weightMax -
                            filteredWHOData?.weightMin)) *
                          100
                      : 100
                  }%`,
                  backgroundColor: "lightgray",
                  height: "12px",
                  borderRadius: "6px",
                }}
              ></div>
              <span style={{ marginLeft: "8px", color: "green" }}>
                {healthMetrics[0]?.weight >= filteredWHOData?.weightMin &&
                healthMetrics[0]?.weight <= filteredWHOData?.weightMax
                  ? "Normal"
                  : "Out of Range"}
              </span>
            </div>
          </div>

          {/* Height Progress Bar */}
          <div className="w-full">
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              Chiều dài (cm)
            </h3>
            {/* Min and Max Labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "4px",
              }}
            >
              <span className="text-gray-500">
                {filteredWHOData?.lenghtMin || 0} cm
              </span>
              <span className="text-gray-500">
                {filteredWHOData?.lenghtMax || 0} cm
              </span>
            </div>
            {/* Progress Bar */}
            <div style={{ display: "flex", alignItems: "center" }}>
              <div
                style={{
                  width: `${
                    healthMetrics.lenght &&
                    filteredWHOData?.lenghtMin !== undefined &&
                    filteredWHOData?.lenghtMax !== undefined &&
                    healthMetrics[0]?.length
                      ? ((healthMetrics[0]?.lenght -
                          filteredWHOData?.lenghtMin) /
                          (filteredWHOData?.lenghtMax -
                            filteredWHOData?.lenghtMin)) *
                        100
                      : 0
                  }%`,
                  backgroundColor: "black",
                  height: "12px",
                  borderRadius: "6px",
                }}
              ></div>
              <div
                style={{
                  width: `${
                    healthMetrics.lenght &&
                    filteredWHOData?.lenghtMin !== undefined &&
                    filteredWHOData?.lenghtMax !== undefined &&
                    healthMetrics[0]?.lenght
                      ? 100 -
                        ((healthMetrics[0]?.lenght -
                          filteredWHOData?.lenghtMin) /
                          (filteredWHOData?.lenghtMax -
                            filteredWHOData?.lenghtMin)) *
                          100
                      : 100
                  }%`,
                  backgroundColor: "lightgray",
                  height: "12px",
                  borderRadius: "6px",
                }}
              ></div>
              <span style={{ marginLeft: "8px", color: "green" }}>
                {healthMetrics[0]?.lenght >= filteredWHOData?.lenghtMin &&
                healthMetrics[0]?.lenght <= filteredWHOData?.lenghtMax
                  ? "Normal"
                  : "Out of Range"}
              </span>
            </div>
          </div>

          {/* Add Data Button */}
          <div className="w-full flex justify-center mt-4">
            <Button
              type="primary"
              onClick={handleAddNew}
              style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
            >
              Nhập Chỉ Số
            </Button>
          </div>
          <div className="w-full flex justify-center mt-4">
            <Button
              type="primary"
              onClick={handleNavigateToGraph}
              style={{
                backgroundColor: "#f0f0f0",
                borderColor: "#d9d9d9",
                color: "#000",
              }}
            >
              Xem Đồ Thị
            </Button>
          </div>
          <Modal
            title={isEditing ? "Edit Health Metric" : "Add New Measurement"} // Dynamic title
            visible={isModalVisible} // Modal visibility
            onOk={handleOk} // Save button handler
            onCancel={handleCancel} // Cancel button handler
          >
            <Form form={form} layout="vertical">
              {/* Weight Field */}
              <Form.Item
                name="weight"
                label="Cân nặng (grams)"
                rules={[{ required: true, message: "Weight is required" }]}
              >
                <Input type="number" placeholder="Enter weight (grams)" />
              </Form.Item>

              {/* Height Field */}
              <Form.Item
                name="lenght"
                label="Chiều dài (cm)"
                rules={[{ required: true, message: "lenght is required" }]}
              >
                <Input type="number" placeholder="Enter lenght (cm)" />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default BabyDetails;
