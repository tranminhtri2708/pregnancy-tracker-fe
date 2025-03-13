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
import {
  addNewHealthMetric,
  getHealthMetricsByChild,
  updateHealthMetric,
  deleteHealthMetric,
} from "../../services/api.heathmetric";
const ChildInfo = ({ child }) => {
  const [healthMetrics, setHealthMetrics] = useState([]); // State to manage table data
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility
  const [form] = Form.useForm(); // Form instance for managing input data
  const [editingRecord, setEditingRecord] = useState(null); // Manage the record being edited
  const [selectedWeek, setSelectedWeek] = useState(8); // State to manage selected week
  const [loading, setLoading] = useState(false); // Loading state
  const [selectedWeekId, setSelectedWeekId] = useState(null); // Store the ID of the selected week

  const weekOptions = Array.from({ length: 42 - 8 + 1 }, (_, i) => ({
    value: i + 8,
    label: `${i + 8}`,
  }));

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

  // Fetch data when the component mounts or when the child changes
  useEffect(() => {
    if (child?.id) {
      fetchHealthMetrics();
    }
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

  // Function to handle form submission
  // const handleFormSubmit = async (values) => {
  //   const healthMetricData = {
  //     childrenId: child.id,
  //     pregnancyWeek: selectedWeek,
  //     headCircumference: values.headCircumference,
  //     weight: values.weight,
  //     lenght: values.lenght,
  //     sacDiameter: values.sacDiameter,
  //     hearRate: values.hearRate,
  //     note: values.note || "",
  //   };
  //   try {
  //     console.log("editingRecord 1")
  //     if (editingRecord) {
  //       console.log("editingRecord 2")
  //       // Call update API if editing
  //       await updateHealthMetric(editingRecord.id, healthMetricData);
  //       setHealthMetrics((prevMetrics) =>
  //         prevMetrics.map((item) =>
  //           item.id === editingRecord.id ? { ...item, ...healthMetricData } : item
  //         )
  //       );
  //       message.success(`Dữ liệu sức khỏe tuần ${selectedWeek} đã được cập nhật!`);
  //     } else {
  //       // Add new metric logic here (if needed)
  //     }

  //     closeModal(); // Close modal after submission
  //   } catch (error) {
  //     message.error("Không thể cập nhật dữ liệu sức khỏe. Vui lòng thử lại sau.");
  //   }
  // };
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
      title: "Chu Vi Đầu",
      dataIndex: "headCircumference",
      key: "headCircumference",
      align: "center",
    },
    {
      title: "Cân Nặng",
      dataIndex: "weight",
      key: "weight",
      align: "center",
    },
    {
      title: "Chiều Dài",
      dataIndex: "lenght",
      key: "lenght",
      align: "center",
    },
    {
      title: "Đường Kính Lưỡng Đỉnh",
      dataIndex: "bpd",
      key: "bpd",
      align: "center",
    },
    {
      title: "Chu vi bụng",
      dataIndex: "ac",
      key: "ac",
      align: "center",
    },
    {
      title: "Chiều dài xương đùi",
      dataIndex: "fl",
      key: "fl",
      align: "center",
    },
    {
      title: "Nhịp Tim",
      dataIndex: "hearRate",
      key: "hearRate",
      align: "center",
    },
    {
      title: "Ghi Chú",
      dataIndex: "note",
      key: "note",
      align: "center",
    },
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Thông tin sức khỏe của bé {child.fullName} tại tuần {""}
        <Select
          options={weekOptions}
          value={selectedWeek}
          defaultValue={8}
          onChange={(value) => {
            setSelectedWeek(value); // Update selected week
            const selectedMetric = healthMetrics.find(
              (metric) => metric.pregnancyWeek === value // Match the week
            );
            setSelectedWeekId(selectedMetric?.id || null); // Update the selected ID or set to null
          }}
          style={{ width: 100 }}
        />
      </h2>

      <Table
        columns={columns}
        dataSource={healthMetrics.filter(
          (metric) => metric.pregnancyWeek === selectedWeek // Show only records for the selected week
        )}
        bordered
        rowKey="key"
        pagination={{ pageSize: 5 }}
      />

      <div className="flex justify-end mt-6">
        <Button
          type="primary"
          onClick={() => openModal()} // Opens the modal for adding data
          style={{ marginRight: 8 }}
        >
          Thêm Dữ Liệu
        </Button>
        <Button
          type="default"
          onClick={() => {
            const selectedMetric = healthMetrics.find(
              (metric) => metric.pregnancyWeek === selectedWeek
            ); // Find the record for the selected week

            if (selectedMetric) {
              openModal(selectedMetric); // Open the modal with the found record
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
            ); // Find the record matching the selected week
            if (selectedMetric) {
              handleDeleteMetric(selectedMetric.id); // Call handleDeleteMetric with the ID
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
        <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
          <Form.Item
            name="headCircumference"
            label="Chu Vi Đầu"
            rules={[{ required: true, message: "Vui lòng nhập chu vi đầu!" }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập chu vi đầu"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="weight"
            label="Cân Nặng"
            rules={[{ required: true, message: "Vui lòng nhập cân nặng!" }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập cân nặng"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="lenght"
            label="Chiều Dài"
            rules={[{ required: true, message: "Vui lòng nhập chiều dài!" }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập chiều dài"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="bpd"
            label="Đường Kính Lưỡng Đỉnh"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập đường kính lưỡng đỉnh!",
              },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập đường kính lưỡng đỉnh"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="ac"
            label="Chu Vi Bụng"
            rules={[{ required: true, message: "Vui lòng nhập chu vi bụng!" }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập chu vi bụng"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="fl"
            label="Chiều Dài Xương Đùi"
            rules={[
              { required: true, message: "Vui lòng nhập chiều dài xương đùi!" },
            ]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập chiều dài xương đùi"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item
            name="hearRate"
            label="Nhịp Tim"
            rules={[{ required: true, message: "Vui lòng nhập nhịp tim!" }]}
          >
            <InputNumber
              min={0}
              placeholder="Nhập nhịp tim"
              style={{ width: "100%" }}
            />
          </Form.Item>
          <Form.Item name="note" label="Ghi Chú">
            <Input.TextArea placeholder="Nhập ghi chú (nếu có)" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ChildInfo;
