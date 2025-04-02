import { useParams } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { Button, Modal, Input, Form, message, Table, Tag } from "antd";
import dayjs from "dayjs";
import Header from "../../components/header";
import Footer from "../../components/footer";
import { useNavigate } from "react-router-dom";
import { getChildById } from "../../services/api.children";
import { GetAllWHOStatistics } from "../../services/api.whostandard";
import { getClosestSchedule } from "../../services/api.notification";
import { debounce } from "lodash";
import {
  addNewHealthMetric,
  getHealthMetricsByChild,
  updateHealthMetric,
  deleteHealthMetric,
} from "../../services/api.heathmetric";

const BabyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [darkMode] = useState(false);
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
  console.log("123", weeksUntilBirth);
  // Helper function for pregnancy week calculation
  const calculateCurrentPregnancyWeek = (birthDate) => {
    const currentDate = dayjs();
    const daysUntilBirth = dayjs(birthDate).diff(currentDate, "day");
    return {
      currentPregnancyWeek: 40 - Math.round(daysUntilBirth / 7),
      daysUntilBirth,
    };
  };
  console.log("1", weeksUntilBirth <= 7);
  // Fetch WHO Data
  const fetchWHOData = async (currentPregnancyWeek) => {
    try {
      const allWHOData = await GetAllWHOStatistics();
      const dataForCurrentWeek = allWHOData.find(
        (item) => item.pregnancyWeek === currentPregnancyWeek
      );
      setFilteredWHOData(dataForCurrentWeek || null);
    } catch (error) {
      message.error("Failed to fetch WHO standards.");
    }
  };
  const handleNavigateToGraph = () => {
    navigate(`/graph/${id}`); // Dynamically navigate to graph/id
  };
  const HealthMetricsTable = ({ healthMetrics }) => {
    return (
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Lịch sử sức khỏe
        </h2>
        <Table columns={columns} dataSource={healthMetrics} rowKey="id" />
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
      </div>
    );
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
      message.error("Failed to fetch child details.");
    }
  };
  const columns = [
    {
      title: "Tuần",
      dataIndex: "pregnancyWeek",
      key: "pregnancyWeek",
      sorter: (a, b) => a.pregnancyWeek - b.pregnancyWeek, // Default sorting in ascending order
      defaultSortOrder: "ascend",
    },
    {
      title: "Cân nặng (grams)",
      dataIndex: "weight",
      key: "weight",
    },
    {
      title: "Chiều dài (cm)",
      dataIndex: "lenght",
      key: "lenght",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex space-x-4">
          <Button type="link" onClick={() => handleEdit(record)}>
            Chỉnh sửa
          </Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>
            Xóa
          </Button>
        </div>
      ),
    },
  ];
  // Fetch Health Metrics
  const getChildHealthMetrics = async () => {
    try {
      const data = await getHealthMetricsByChild(id);
      data.sort((a, b) => b.id - a.id);

      setHealthMetrics(data);
    } catch (error) {
      message.error("Failed to fetch health metrics.");
    }
  };

  // Combined Data Fetching
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await getChildDetails();
      await getChildHealthMetrics();
      // Ensure healthMetrics exists before checking the condition
      if (healthMetrics.lenght > 0) {
        if (weeksUntilBirth === healthMetrics[0]?.pregnancyWeek) {
          setIsEditing(true);
        }
      }
      setIsLoading(false);
    };
    fetchData();
  }, [id]); // Added dependencies for reactivity

  // Handle Add/Edit Modal
  const handleAddNew = () => {
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingRecord(record);
    form.setFieldsValue(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteHealthMetric(id);
      message.success("Health metric deleted successfully.");
      await getChildHealthMetrics();
    } catch (error) {
      message.error("Failed to delete health metric.");
    }
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const currentPregnancyWeek = 40 - weeksUntilBirth;

      if (isEditing) {
        await updateHealthMetric(values.editID, values);

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

  const weightPercentage = Math.floor(
    ((healthMetrics[0]?.weight - filteredWHOData?.weightMin) /
      (filteredWHOData?.weightMax - filteredWHOData?.weightMin)) *
      100
  );
  const lengthPercentage = Math.floor(
    ((healthMetrics[0]?.lenght - filteredWHOData?.lenghtMin) /
      (filteredWHOData?.lenghtMax - filteredWHOData?.lenghtMin)) *
      100
  );
  return (
    <div
      className={`pl-25 pr-25 pt-5 pb-5 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      <Header />
      <div className="mb-6 mt-12">
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
              {weeksUntilBirth > 0 ? `${40 - weeksUntilBirth} tuần` : "Tuần 40"}
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

      {40 - weeksUntilBirth > 7 ? (
        healthMetrics[0] ? (
          <div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Thông Tin Sức Khỏe Bé
              </h2>
              <div className="flex flex-col items-center space-y-6">
                {/* Weight Progress Bar */}
                <div className="w-full">
                  {/* Name, Status Label, and Baby Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-600">
                        Cân nặng (grams)
                      </h3>
                      <span
                        style={{
                          backgroundColor:
                            healthMetrics[0]?.weight >=
                              filteredWHOData?.weightMin &&
                            healthMetrics[0]?.weight <=
                              filteredWHOData?.weightMax
                              ? "#d1fad1" // Light green background for Normal
                              : "#fad1d1", // Light red background for Out of Range
                          color:
                            healthMetrics[0]?.weight >=
                              filteredWHOData?.weightMin &&
                            healthMetrics[0]?.weight <=
                              filteredWHOData?.weightMax
                              ? "green"
                              : "red",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          marginLeft: "12px",
                        }}
                      >
                        {healthMetrics[0]?.weight >=
                          filteredWHOData?.weightMin &&
                        healthMetrics[0]?.weight <= filteredWHOData?.weightMax
                          ? "Khỏe mạnh"
                          : "Hãy đi khám bác sĩ ngay"}
                      </span>
                    </div>

                    <span className="text-gray-600">
                      {healthMetrics[0]?.weight} g
                    </span>
                  </div>

                  {/* Min and Max Labels */}
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">
                      {filteredWHOData?.weightMin || 0} g
                    </span>
                    <span className="text-gray-500">
                      {filteredWHOData?.weightMax || 0} g
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center">
                    <div
                      style={{
                        width: `${weightPercentage}%`,
                        backgroundColor: "black",
                        height: "12px",
                        borderRadius: "6px",
                      }}
                    ></div>

                    <div
                      style={{
                        flexGrow: 1,
                        backgroundColor: "lightgray",
                        height: "12px",
                        borderRadius: "6px",
                        marginLeft: "8px",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Height Progress Bar */}
                <div className="w-full">
                  {/* Name, Status Label, and Baby Stats */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h3 className="text-lg font-semibold text-gray-600">
                        Chiều dài (cm)
                      </h3>
                      <span
                        style={{
                          backgroundColor:
                            healthMetrics[0]?.lenght >=
                              filteredWHOData?.lenghtMin &&
                            healthMetrics[0]?.lenght <=
                              filteredWHOData?.lenghtMax
                              ? "#d1fad1" // Light green for Normal
                              : "#fad1d1", // Light red for Out of Range
                          color:
                            healthMetrics[0]?.lenght >=
                              filteredWHOData?.lenghtMin &&
                            healthMetrics[0]?.lenght <=
                              filteredWHOData?.lenghtMax
                              ? "green"
                              : "red",
                          fontWeight: "bold",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          marginLeft: "12px",
                        }}
                      >
                        {healthMetrics[0]?.lenght >=
                          filteredWHOData?.lenghtMin &&
                        healthMetrics[0]?.lenght <= filteredWHOData?.lenghtMax
                          ? "Khỏe mạnh"
                          : "Hãy đi khám bác sĩ ngay"}
                      </span>
                    </div>

                    <span className="text-gray-600">
                      {healthMetrics[0]?.lenght} cm
                    </span>
                  </div>

                  {/* Min and Max Labels */}
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-500">
                      {filteredWHOData?.lenghtMin || 0} cm
                    </span>
                    <span className="text-gray-500">
                      {filteredWHOData?.lenghtMax || 0} cm
                    </span>
                  </div>

                  {/* Progress Bar */}
                  <div className="flex items-center">
                    <div
                      style={{
                        width: `${lengthPercentage}%`,
                        backgroundColor: "black",
                        height: "12px",
                        borderRadius: "6px",
                      }}
                    ></div>

                    <div
                      style={{
                        flexGrow: 1,
                        backgroundColor: "lightgray",
                        height: "12px",
                        borderRadius: "6px",
                        marginLeft: "8px",
                      }}
                    ></div>
                  </div>
                </div>

                {/* Add Data Button */}
                <div className="w-full flex justify-center mt-4">
                  <Button
                    type="primary"
                    onClick={handleAddNew}
                    style={{
                      backgroundColor: "#1890ff",
                      borderColor: "#1890ff",
                    }}
                  >
                    Nhập Chỉ Số
                  </Button>
                </div>
                <Modal
                  title={isEditing ? "Cập nhật chỉ số" : "Thêm chỉ số mới"} // Dynamic title
                  visible={isModalVisible} // Modal visibility
                  onOk={handleOk} // Save button handler
                  onCancel={handleCancel} // Cancel button handler
                >
                  <Form
                    form={form}
                    layout="vertical"
                    initialValues={{
                      weight: healthMetrics[0]?.weight || null, // Default to empty string if undefined
                      lenght: healthMetrics[0]?.lenght || null, // Default to empty string if undefined
                      editID: healthMetrics[0]?.id || null, // Hidden field for healthMetric ID, defaults to empty string
                    }}
                  >
                    {/* Hidden Field for editID */}
                    <Form.Item name="editID" hidden={true}>
                      <Input type="hidden" />
                    </Form.Item>

                    {/* Weight Field */}
                    <Form.Item
                      name="weight"
                      label="Cân nặng (grams)"
                      rules={[
                        { required: true, message: "Weight is required" },
                      ]}
                    >
                      <Input type="number" placeholder="Enter weight (grams)" />
                    </Form.Item>

                    {/* Height Field */}
                    <Form.Item
                      name="lenght"
                      label="Chiều dài (cm)"
                      rules={[
                        { required: true, message: "Lenght is required" },
                      ]}
                    >
                      <Input type="number" placeholder="Enter lenght (cm)" />
                    </Form.Item>
                  </Form>
                </Modal>
              </div>
            </div>
            <HealthMetricsTable healthMetrics={healthMetrics} />
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Thông Tin Sức Khỏe Bé
            </h2>
            <p className="text-center text-gray-600">
              Hãy bắt đầu theo dõi sự phát triển của bé trong hôm nay
            </p>
            <div className="w-full flex justify-center mt-4">
              <Button
                type="primary"
                onClick={handleAddNew}
                style={{ backgroundColor: "#1890ff", borderColor: "#1890ff" }}
              >
                Nhập Chỉ Số
              </Button>
            </div>
            <Modal
              title={isEditing ? "Cập nhật chỉ số" : "Thêm chỉ số mới"} // Dynamic title
              visible={isModalVisible} // Modal visibility
              onOk={handleOk} // Save button handler
              onCancel={handleCancel} // Cancel button handler
            >
              <Form
                form={form}
                layout="vertical"
                initialValues={{
                  weight: healthMetrics[0]?.weight || null, // Default to empty string if undefined
                  lenght: healthMetrics[0]?.lenght || null, // Default to empty string if undefined
                  editID: healthMetrics[0]?.id || null, // Hidden field for healthMetric ID, defaults to empty string
                }}
              >
                {/* Hidden Field for editID */}
                <Form.Item name="editID" hidden={true}>
                  <Input type="hidden" />
                </Form.Item>

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
                  rules={[{ required: true, message: "Lenght is required" }]}
                >
                  <Input type="number" placeholder="Enter lenght (cm)" />
                </Form.Item>
              </Form>
            </Modal>
          </div>
        )
      ) : (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Thông Tin Sức Khỏe Bé
          </h2>
          <p className="text-center text-gray-600">
            Từ tuần 1 tới tuần 7 thai nhi chưa phát triển đủ để có chỉ số.
          </p>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BabyDetails;
