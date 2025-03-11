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
  const [open, setOpen] = useState(false); // trạng thái ban đầu là đóng
  const [form] = useForm();
  const [filterStatus, setFilterStatus] = useState(null); // null để hiển thị tất cả ban đầu
  const [isUpdateMode, setIsUpdateMode] = useState(false); // Thêm state để theo dõi chế độ cập nhật
  const { Title } = Typography;

  //CRUD
  const fetchSubscriptionPlan = async () => {
    try {
      const data = await getSubscriptionPlan();
      setSubscriptionPlan(data); //
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error);
      toast.error("Không thể lấy danh sách gói thành viên");
    }
  };

  //get product được sài nhiều chỗ, nhiều lần và dùng nguyên tắc DRY
  useEffect(() => {
    fetchSubscriptionPlan();
  }, []);

  // Lọc dữ liệu dựa trên trạng thái đã chọn
  const filteredData =
    filterStatus === null
      ? subscriptionPlan
      : subscriptionPlan.filter((plan) => plan.isActive === filterStatus);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
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
                setIsUpdateMode(true); // Đánh dấu là đang ở chế độ cập nhật
                setOpen(true);
                form.setFieldsValue(record);
              }}
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
        fetchSubscriptionPlan(); // refresh lại table
        toast.success("Xóa gói thành công");
      }
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Xóa gói thất bại");
    }
  };

  const handleSubmit = async (formValues) => {
    try {
      console.log("Form values:", formValues);

      if (formValues.id) {
        // Trường hợp UPDATE - chỉ gửi những trường cần thiết
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

        // Xử lý update - Chỉ gửi những trường cần thiết
        const response = await updateSubscriptionPlan({
          planId: formValues.id,
          subscriptionPlan: subscriptionData,
        });

        console.log("Kết quả update:", response);
        toast.success("Cập nhật gói thành công");
      } else {
        // Trường hợp CREATE - gửi toàn bộ formValues
        console.log("Dữ liệu create gửi đến BE:", formValues);

        // Xử lý tạo mới - gửi toàn bộ formValues
        const response = await createSubscriptionPlan(formValues);
        console.log("Kết quả tạo mới:", response);
        toast.success("Tạo gói thành công");
      }

      setOpen(false);
      form.resetFields();
      fetchSubscriptionPlan(); // Refresh lại dữ liệu
    } catch (error) {
      console.error("Lỗi khi xử lý:", error);
      toast.error(
        "Thao tác thất bại: " + (error.message || "Lỗi không xác định")
      );
    }
  };

  // Xử lý thay đổi bộ lọc trạng thái
  // const handleStatusFilterChange = (value) => {
  //   setFilterStatus(value);
  // };

  // Xử lý khi đóng modal
  const handleCloseModal = () => {
    setOpen(false);
    setIsUpdateMode(false); // Reset lại chế độ khi đóng modal
    form.resetFields(); // Xóa dữ liệu form khi đóng
  };

  return (
    <div>
      {/* Thêm header trước table */}
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
            setIsUpdateMode(false); // Đánh dấu là đang ở chế độ tạo mới
            setOpen(true);
            form.resetFields(); // Reset form khi tạo mới
            form.setFieldsValue({ isActive: true }); // Mặc định active
          }}
        >
          Tạo gói thành viên
        </Button>

        <div></div>
      </div>

      <Table dataSource={filteredData} columns={columns} />

      <Modal
        title={isUpdateMode ? "Cập nhật gói thành viên" : "Tạo gói thành viên"}
        open={open}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
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
            <InputNumber style={{ width: "100%" }} disabled={isUpdateMode} />
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

          {/* Chỉ hiển thị trường isActive khi đang ở chế độ cập nhật */}
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
