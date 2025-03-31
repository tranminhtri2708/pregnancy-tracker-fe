import React, { useEffect, useState } from "react";
import {
  createSubscriptionPlan,
  deleteSubscriptionPlan,
  getSubscriptionPlan,
  updateSubscriptionPlan,
} from "../../services/api.subscription";
import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Table,
  Select,
  Typography,
} from "antd";

import { toast } from "react-toastify";
import { useForm } from "antd/es/form/Form";

function ManageSubscription() {
  const [subscriptionPlan, setSubscriptionPlan] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [filterStatus, setFilterStatus] = useState(null);
  const [isUpdateMode, setIsUpdateMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add state to track submission status
  const { Title } = Typography;

  //CRUD
  const fetchSubscriptionPlan = async () => {
    try {
      const data = await getSubscriptionPlan();
      // Ensure we're working with unique plans by ID
      const uniquePlans = [];
      const planIds = new Set();

      data.forEach((plan) => {
        if (!planIds.has(plan.id)) {
          planIds.add(plan.id);
          uniquePlans.push(plan);
        }
      });

      setSubscriptionPlan(uniquePlans);
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Không thể lấy danh sách gói thành viên");
    }
  };

  useEffect(() => {
    fetchSubscriptionPlan();
  }, []);

  const filteredData =
    filterStatus === null
      ? subscriptionPlan
      : subscriptionPlan.filter((plan) => plan.isActive === filterStatus);

  // Sort the filtered data by name in ascending order
  const sortedData = filteredData.sort((a, b) => a.name - b.name);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      render: (text) => {
        switch (text) {
          case 0:
            return "Bronze";
          case 1:
            return "Silver";
          case 2:
            return "Gold";
          default:
            return text; // Fallback for undefined or unexpected values
        }
      },
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Thời hạn sử dụng",
      dataIndex: "durationInMonths",
      key: "durationInMonths",
    },
    {
      title: "Miêu tả",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Chức năng",
      dataIndex: "feature",
      key: "feature",
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) =>
        isActive ? (
          <span style={{ color: "#52c41a" }}>Đang hoạt động</span>
        ) : (
          <span style={{ color: "#ff4d4f" }}>Dừng hoạt động</span>
        ),
      filters: [
        { text: "Đang hoạt động", value: true },
        { text: "Dừng hoạt động", value: false },
      ],
      onFilter: (value, record) => record.isActive === value,
    },
    {
      title: "Số lượng người đăng kí",
      dataIndex: "activeSubscribersCount",
      key: "activeSubscribersCount",
    },
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setIsUpdateMode(true);
                setOpen(true);
                form.setFieldsValue(record);
              }}
              style={{ marginRight: "8px" }}
            >
              Update
            </Button>
            <Popconfirm
              title="Xóa gói thành viên"
              description="Bạn có chắc muốn xóa gói này?"
              onConfirm={() => handleDeleteSubscription(id)}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];

  const handleDeleteSubscription = async (id) => {
    try {
      const response = await deleteSubscriptionPlan(id);
      if (response) {
        // Remove the plan from local state instead of re-fetching
        setSubscriptionPlan((prevPlans) =>
          prevPlans.filter((plan) => plan.id !== id)
        );
        toast.success("Xóa gói thành công");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Xóa gói thất bại");
    }
  };

  const handleSubmit = async (formValues) => {
    if (isSubmitting) return; // Prevent duplicate submissions

    setIsSubmitting(true);
    try {
      console.log("Form values:", formValues);

      if (formValues.id) {
        // UPDATE case
        const subscriptionData = {
          price: Number(formValues.price),
          description: formValues.description,
          feature: formValues.feature,
          isActive: Boolean(formValues.isActive),
        };

        console.log("Dữ liệu update gửi đến BE:", {
          planId: formValues.id,
          subscriptionPlan: subscriptionData,
        });

        const response = await updateSubscriptionPlan({
          planId: formValues.id,
          subscriptionPlan: subscriptionData,
        });

        console.log("Kết quả update:", response);

        // Update the local state directly
        setSubscriptionPlan((prevPlans) =>
          prevPlans.map((plan) =>
            plan.id === formValues.id ? { ...plan, ...subscriptionData } : plan
          )
        );

        toast.success("Cập nhật gói thành công");
      } else {
        // CREATE case
        // Make sure we're sending correct data types
        const newPlan = {
          ...formValues,
          price: Number(formValues.price),
          durationInMonths: Number(formValues.durationInMonths),
          isActive: true,
        };

        console.log("Dữ liệu create gửi đến BE:", newPlan);

        const response = await createSubscriptionPlan(newPlan);
        console.log("Kết quả tạo mới:", response);

        // Add the new plan to the state only if we have a response with ID
        if (response && response.id) {
          setSubscriptionPlan((prevPlans) => [...prevPlans, response]);
        } else {
          // If no valid response, fetch all plans to ensure consistency
          await fetchSubscriptionPlan();
        }

        toast.success("Tạo gói thành công");
      }

      setOpen(false);
      form.resetFields();
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
      toast.error(
        "Thao tác thất bại: " + (error.message || "Lỗi không xác định")
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseModal = () => {
    setOpen(false);
    setIsUpdateMode(false);
    form.resetFields();
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-blue-500">
        Quản Lý Gói Thành Viên
      </h1>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "16px",
        }}
      >
        <Button
          type="primary"
          onClick={() => {
            setIsUpdateMode(false);
            setOpen(true);
            form.resetFields();
            form.setFieldsValue({ isActive: true });
          }}
        >
          Tạo gói thành viên
        </Button>

        <div></div>
      </div>

      <Table
        dataSource={sortedData}
        columns={columns}
        rowKey="id" // Add rowKey to ensure each row has a unique key
      />

      <Modal
        title={isUpdateMode ? "Cập nhật gói thành viên" : "Tạo gói thành viên"}
        open={open}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        confirmLoading={isSubmitting} // Disable the OK button during submission
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item label="Id" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên gói"
            name="name"
            rules={[
              {
                required: true,
                message: "Tên gói bắt buộc nhập!",
              },
            ]}
          >
            <Select style={{ width: "100%" }} disabled={isUpdateMode}>
              <Select.Option value={0}>Bronze</Select.Option>
              <Select.Option value={1}>Silver</Select.Option>
              <Select.Option value={2}>Gold</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[
              {
                required: true,
                message: "Giá bắt buộc nhập!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            label="Thời gian sử dụng"
            name="durationInMonths"
            rules={[
              {
                required: true,
                message: "Thời gian sử dụng bắt buộc nhập!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} disabled={isUpdateMode} />
          </Form.Item>

          <Form.Item
            label="Miêu tả về gói"
            name="description"
            rules={[
              {
                required: true,
                message: "Miêu tả về gói bắt buộc nhập!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Chức năng của gói" name="feature">
            <Input />
          </Form.Item>

          {isUpdateMode && (
            <Form.Item label="Trạng thái" name="isActive" initialValue={true}>
              <Select
                options={[
                  { value: true, label: "Đang hoạt động" },
                  { value: false, label: "Dừng hoạt động" },
                ]}
              />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
}

export default ManageSubscription;
