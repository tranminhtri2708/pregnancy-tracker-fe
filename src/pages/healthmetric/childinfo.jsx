import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
} from "antd";
import api from "../../config/axios";
import {
  addNewHealthMetric,
  getHealthMetricsByChild,
  updateHealthMetric,
  deleteHealthMetric,
  compareHealthMetrics,
} from "../../services/api.heathmetric";
const ChildInfo = ({ child }) => {
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState([]);
  const [whoStandards, setWhoStandards] = useState([]);
  const [healthMetrics, setHealthMetrics] = useState([]); // State to manage table data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [form] = Form.useForm(); // Form instance for managing input data
  const [editingRecord, setEditingRecord] = useState(null); // Manage the record being edited
  const [selectedWeek, setSelectedWeek] = useState(8); // State to manage selected week
  const [loading, setLoading] = useState(false); // Loading state

  const weekOptions = Array.from({ length: 40 - 8 + 1 }, (_, i) => ({
    value: i + 8,
    label: `${i + 8}`,
  }));

  const fetchWHOStandards = async () => {
    try {
      const response = await api.get("WHOStandard/GetAllWHOStatistics");
      console.log("ALOOO", response);
      const data = response.data.result || [];
      setWhoStandards(data);
    } catch (error) {
      message.error("Cannot fetch WHO standards! Please try again.");
    }
  };

  const fetchHealthMetrics = async () => {
    try {
      setLoading(true); // Set loading state
      const data = await getHealthMetricsByChild(child.id); // Fetch data using child ID
      // const data = await getHealthMetricsByChild(0)
      console.log("data", data);
      // Ensure no duplicate weeks
      const uniqueMetrics = data.filter(
        (metric, index, self) =>
          self.findIndex((m) => m.pregnancyWeek === metric.pregnancyWeek) ===
          index
      );
      setHealthMetrics(uniqueMetrics); // Set filtered data
    } catch (error) {
      message.error("Không thể lấy dữ liệu sức khỏe! Vui lòng thử lại sau.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const getHealthMetricsID = async () => {
    try {
      setLoading(true); // Set loading state
      const data = await getHealthMetricsByChild(child.id); // Fetch data using child ID
      // const data = await getHealthMetricsByChild(0)
      console.log("data", data);
      // Ensure no duplicate weeks
      const uniqueMetrics = data.filter(
        (metric, index, self) =>
          self.findIndex((m) => m.pregnancyWeek === metric.pregnancyWeek) ===
          index
      );
      return uniqueMetrics[0].id; // Set filtered data
    } catch (error) {
      message.error("Không thể lấy dữ liệu sức khỏe! Vui lòng thử lại sau.");
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Fetch data when the component mounts or when the child changes
  useEffect(() => {
    fetchWHOStandards();
    fetchHealthMetrics();
    handleCompareMetrics();
  }, [child]);
  // Function to open the modal
  const openModal = (record) => {
    setEditingRecord(record);
    console.log("record", record); // Set record for editing or null for adding
    form.resetFields(); // Reset form values
    if (record) {
      form.setFieldsValue(record); // Populate form with record values if editing
    }
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    form.resetFields();
  };

  const handleFormSubmit = async (values) => {
    const healthMetricData = {
      childrentId: child.id,
      pregnancyWeek: selectedWeek,
      headCircumference: values.headCircumference,
      weight: values.weight,
      lenght: values.lenght,
      hearRate: values.hearRate,
      bpd: values.bpd,
      fl: values.fl,
      ac: values.ac,
      note: values.note || "",
    };

    try {
      if (editingRecord) {
        console.log("Editing an existing record");

        // Call update API if editing
        await updateHealthMetric(editingRecord.id, healthMetricData);
        setHealthMetrics((prevMetrics) =>
          prevMetrics.map((item) =>
            item.id === editingRecord.id
              ? { ...item, ...healthMetricData }
              : item
          )
        );
        message.success(
          `Dữ liệu sức khỏe tuần ${selectedWeek} đã được cập nhật!`
        );
      } else {
        console.log("Adding a new record");

        // Call addNewHealthMetric for new records
        const response = await addNewHealthMetric(healthMetricData);

        // Update the state with the newly added health metric
        setHealthMetrics((prevMetrics) => [
          ...prevMetrics,
          { id: response.id, ...healthMetricData }, // Ensure the new ID is included
        ]);

        message.success(
          `Dữ liệu sức khỏe tuần ${selectedWeek} đã được thêm mới!`
        );
      }

      closeModal(); // Close modal after submission
    } catch (error) {
      console.error("Error submitting health metric:", error);
      message.error(
        "Không thể cập nhật dữ liệu sức khỏe. Vui lòng thử lại sau."
      );
    }
  };

  // Function to handle record deletion
  const handleDeleteMetric = async (id) => {
    try {
      await deleteHealthMetric(id); // Call the delete API
      setHealthMetrics((prevMetrics) =>
        prevMetrics.filter((item) => item.id !== id)
      ); // Remove from local state
      message.success("Dữ liệu sức khỏe đã được xóa thành công!");
    } catch (error) {
      message.error("Không thể xóa dữ liệu sức khỏe. Vui lòng thử lại sau.");
    }
  };

  const columns = [
    {
      title: "Metric",
      dataIndex: "metric",
      key: "metric",
      align: "center",
    },
    {
      title: "Baby's Data",
      dataIndex: "babyData",
      key: "babyData",
      align: "center",
    },
    {
      title: "WHO Standard (Min - Max)",
      dataIndex: "whoRange",
      key: "whoRange",
      align: "center",
    },
  ];

  const dataSource = [
    {
      key: "1",
      metric: "Chu Vi Đầu (mm)", // Head Circumference
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.headCircumference || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.headCircumferenceMin || "No data";
        const max = standard?.headCircumferenceMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max}`
          : "No data";
      })(),
    },
    {
      key: "2",
      metric: "Cân Nặng (gram)", // Weight
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.weight || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.weightMin || "No data";
        const max = standard?.weightMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max}`
          : "No data";
      })(),
    },
    {
      key: "3",
      metric: "Chiều Dài (cm)", // Length
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.lenght || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.lenghtMin || "No data";
        const max = standard?.lenghtMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max}`
          : "No data";
      })(),
    },
    {
      key: "4",
      metric: "Đường Kính Lưỡng Đỉnh (mm)", // BPD
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.bpd || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.bpdMin || "No data";
        const max = standard?.bpdMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max}`
          : "No data";
      })(),
    },
    {
      key: "5",
      metric: "Chu vi bụng (mm)", // AC
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.ac || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.acMin || "No data";
        const max = standard?.acMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max}`
          : "No data";
      })(),
    },
    {
      key: "6",
      metric: "Chiều dài xương đùi (mm)", // FL
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.fl || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.flMin || "No data";
        const max = standard?.flMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max} `
          : "No data";
      })(),
    },
    {
      key: "7",
      metric: "Nhịp Tim", // Heart Rate
      babyData:
        healthMetrics.find((metric) => metric.pregnancyWeek === selectedWeek)
          ?.hearRate || "No data",
      whoRange: (() => {
        const standard = whoStandards.find(
          (standard) => standard.pregnancyWeek === selectedWeek
        );
        const min = standard?.hearRateMin || "No data";
        const max = standard?.hearRateMax || "No data";
        return min !== "No data" && max !== "No data"
          ? `${min} - ${max}`
          : min !== "No data"
          ? `${min}`
          : max !== "No data"
          ? `${max}`
          : "No data";
      })(),
    },
  ];

  const handleCompareMetrics = async () => {
    try {
      // Retrieve the ID associated with the selected week's health metric
      const id = await getHealthMetricsID();
      console.log("ID retrieved:", id);

      if (!id) {
        message.error(
          "Không thể lấy ID dữ liệu sức khỏe! Vui lòng thử lại sau."
        );
        return;
      }

      setIsLoadingFeedback(true); // Set loading state while fetching feedback

      // Call the API to compare health metrics and retrieve feedback
      const response = await compareHealthMetrics(id);
      const response2 = response.data.result; // Extract the result containing feedback
      const feedback = response2?.split("\n") || []; // Split feedback into individual messages
      console.log("Feedback from API:", feedback);

      // Translate feedback into Vietnamese
      const translatedFeedback = feedback.map((msg) => {
        if (msg.includes("WARNING:")) {
          if (
            msg.includes("Fetal weight is different from the standard index!!!")
          ) {
            return "CẢNH BÁO: Cân nặng thai nhi khác với chỉ số tiêu chuẩn!!!";
          }
          if (
            msg.includes(
              "Fetal biparietal diameter is different from the standard index!!!"
            )
          ) {
            return "CẢNH BÁO: Đường kính lưỡng đỉnh của thai nhi khác với chỉ số tiêu chuẩn!!!";
          }
          if (
            msg.includes(
              "Fetal femur length is different from the standard index!!!"
            )
          ) {
            return "CẢNH BÁO: Chiều dài xương đùi của thai nhi khác với chỉ số tiêu chuẩn!!!";
          }
          if (
            msg.includes(
              "Fetal head circumference is different from the standard index!!!"
            )
          ) {
            return "CẢNH BÁO: Chu vi đầu của thai nhi khác với chỉ số tiêu chuẩn!!!";
          }
          if (
            msg.includes(
              "The fetal heart rate is different from the standard index!!!"
            )
          ) {
            return "CẢNH BÁO: Nhịp tim của thai nhi khác với chỉ số tiêu chuẩn!!!";
          }
          if (
            msg.includes(
              "Fetal abdominal circumference is different from the standard index!!!"
            )
          ) {
            return "CẢNH BÁO: Chu vi bụng của thai nhi khác với chỉ số tiêu chuẩn!!!";
          }
        }

        // Translate good feedback
        if (
          msg.includes("The fetus's health is in the most stable condition")
        ) {
          return "Sức khỏe của thai nhi đang ở trạng thái ổn định nhất";
        }

        // Return untranslated feedback if no match
        return msg;
      });

      console.log("Translated Feedback:", translatedFeedback);

      // Update feedback messages in state
      setFeedbackMessages(translatedFeedback);
    } catch (error) {
      console.error("Error during health metric comparison:", error);
      message.error("Không thể so sánh chỉ số sức khỏe! Vui lòng thử lại sau.");
    } finally {
      setIsLoadingFeedback(false); // Reset loading state
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Thông tin sức khỏe của bé {child.fullName} tại tuần{" "}
        <Select
          options={weekOptions}
          value={selectedWeek}
          onChange={(value) => {
            setSelectedWeek(value); // Update the selected week
            console.log("value", value);
          }}
          style={{ width: 100 }}
        />
      </h2>
      <Table
        columns={columns}
        dataSource={dataSource}
        bordered
        rowKey="key"
        pagination={false} // Disable pagination to show all rows on one page
      />
      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          onClick={() => openModal()}
          style={{ marginRight: 8 }}
        >
          Thêm Dữ Liệu
        </Button>
        <Button
          type="default"
          onClick={() => {
            const selectedMetric = healthMetrics.find(
              (metric) => metric.pregnancyWeek === selectedWeek
            );
            if (selectedMetric) {
              openModal(selectedMetric);
            } else {
              message.info(
                "Không có dữ liệu để chỉnh sửa! Vui lòng thêm dữ liệu trước."
              );
            }
          }}
          style={{ marginRight: 8 }}
        >
          Sửa Dữ Liệu
        </Button>
        <Button
          type="link"
          danger
          onClick={() => {
            const selectedMetric = healthMetrics.find(
              (metric) => metric.pregnancyWeek === selectedWeek
            );
            if (selectedMetric) {
              handleDeleteMetric(selectedMetric.id);
            } else {
              message.info(`Không có dữ liệu để xóa cho tuần ${selectedWeek}!`);
            }
          }}
        >
          Xóa
        </Button>
      </div>
      {/* Modal for Adding/Editing */}
      <Modal
        title={
          editingRecord
            ? `Chỉnh Sửa Dữ Liệu Tuần ${selectedWeek}`
            : `Thêm Dữ Liệu Tuần ${selectedWeek}`
        }
        open={isModalOpen}
        onCancel={closeModal}
        onOk={() => form.submit()}
        okText={editingRecord ? "Cập Nhật" : "Thêm Mới"}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            handleFormSubmit(values, editingRecord); // Pass form values and editing state
            closeModal();
          }}
        >
          <Form.Item name="headCircumference" label="Chu Vi Đầu (mm)">
            <InputNumber
              placeholder="Nhập chu vi đầu "
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="weight" label="Cân Nặng (gram)">
            <InputNumber
              placeholder="Nhập cân nặng"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="lenght" label="Chiều Dài (cm)">
            <InputNumber
              placeholder="Nhập chiều dài"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="bpd" label="Đường Kính Lưỡng Đỉnh (mm)">
            <InputNumber
              placeholder="Nhập đường kính lưỡng đỉnh"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="ac" label="Chu Vi Bụng (mm)">
            <InputNumber
              placeholder="Nhập chu vi bụng"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="fl" label="Chiều Dài Xương Đùi (mm)">
            <InputNumber
              placeholder="Nhập chiều dài xương đùi"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="hearRate" label="Nhịp Tim">
            <InputNumber
              placeholder="Nhập nhịp tim"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi Chú">
            <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
      {/* Feedback Section */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Phản hồi:</h3>
        {healthMetrics[selectedWeek - 8] == null ? ( // Check if healthMetrics is empty or null
          <p>Vui Lòng nhập dữ liệu để so sánh</p>
        ) : isLoadingFeedback ? ( // Check if feedback is loading
          <p>Đang tải...</p>
        ) : (
          <ul>
            {feedbackMessages.map((msg, index) => (
              <li
                key={index}
                style={{
                  color: msg.toLowerCase().includes("cảnh báo")
                    ? "red" // Red for warnings
                    : "green", // Green for positive feedback
                  fontWeight: "bold", // Make it bold
                }}
              >
                {msg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ChildInfo;
