import React, { useEffect, useState } from "react";
import {
  createChildren,
  deleteChildren,
  getAllChildren,
  updateChildren,
} from "../../services/api.children";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";
import {
  Button,
  Form,
  Input,
  Select,
  Table,
  Modal,
  DatePicker,
  Popconfirm,
} from "antd";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";
import dayjs from "dayjs";

function ManagerBaby() {
  const navigate = useNavigate();
  const [childrens, setChildrens] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  const getUserID = async () => {
    try {
      const response = await api.get("UserAccount/GetUserId");
      console.log("GetUserId response:", response.data);

      if (
        response.data &&
        response.data.result &&
        response.data.result.userId
      ) {
        const userId = response.data.result.userId;
        localStorage.setItem("userId", userId);
        setUserId(userId);
        return userId;
      } else {
        console.error("Invalid user ID response format:", response.data);
        toast.error("Không thể lấy thông tin người dùng");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
      toast.error(
        "Lỗi khi lấy thông tin người dùng: " +
          (error.message || "Không xác định")
      );
      return null;
    }
  };

  const fetchChildren = async (userIdParam) => {
    try {
      setLoading(true);
      const data = await getAllChildren();
      console.log("getAllChildren response:", data);

      if (!data || !data.result) {
        toast.error("Định dạng dữ liệu trẻ em không hợp lệ");
        setChildrens([]);
        return;
      }

      // Kiểm tra cấu trúc dữ liệu và in ra console để debug
      console.log("Children data structure sample:", data.result[0]);

      // Kiểm tra cả accountId và userId để phù hợp với dữ liệu API
      const filteredResult = data.result.filter((item) => {
        // Kiểm tra xem đối tượng có accountId hoặc userId không
        const matchesUserId =
          (item.accountId !== undefined &&
            item.accountId === Number(userIdParam)) ||
          (item.userId !== undefined && item.userId === Number(userIdParam));

        return matchesUserId;
      });

      console.log("Filtered children:", filteredResult);
      console.log("Current userId for filtering:", userIdParam);
      setChildrens(filteredResult);
    } catch (error) {
      console.error("Error fetching children:", error);
      toast.error(
        "Lỗi khi lấy danh sách trẻ: " + (error.message || "Không xác định")
      );
      setChildrens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      // Thử dùng userId từ state trước
      if (userId) {
        fetchChildren(userId);
        return;
      }
      getUserID();
      // Thử dùng userId từ localStorage nếu đã có
      const storedUserId = localStorage.getItem("userId");
      if (storedUserId) {
        setUserId(storedUserId);
        fetchChildren(storedUserId);
        return;
      }

      // Cuối cùng thử lấy userId mới
      const newUserId = await getUserID();
      if (newUserId) {
        fetchChildren(newUserId);
      }
    };

    initData();
  }, [userId]);

  const formatGender = (value) => {
    return value === 0 || value === "0" ? "Nam" : "Nữ";
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => formatGender(gender),
    },
    {
      title: "Ngày dự sinh",
      dataIndex: "birth",
      key: "birth",
      render: (birth) => formatDate(birth),
    },
    {
      title: "Biệt danh",
      dataIndex: "nickName",
      key: "nickName",
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                form.setFieldsValue({
                  ...record,
                  birth: record.birth ? dayjs(record.birth) : null,
                });
              }}
            >
              Chỉnh sửa
            </Button>
            <Popconfirm
              title="Xóa thông tin"
              description="Bạn có chắc chắn xóa thông tin bé?"
              onConfirm={() => handleDeleteProduct(id)}
            >
              <Button danger type="primary" style={{ marginLeft: 8 }}>
                Xóa
              </Button>
            </Popconfirm>
            <Button
              style={{ marginLeft: 8 }}
              onClick={() => navigate(`/baby/${id}`)} // Navigate to /baby/id
            >
              Chi tiết sức khỏe
            </Button>
          </>
        );
      },
    },
  ];

  const handleDeleteProduct = async (id) => {
    try {
      const response = await deleteChildren(id);
      if (response && response.isSuccess) {
        toast.success("Xóa thành công");
        fetchChildren(userId || localStorage.getItem("userId"));
      } else {
        toast.error(response?.errorMessage || "Xóa thất bại");
      }
    } catch (error) {
      toast.error("Xóa thất bại: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleSubmit = async (formValues) => {
    const formattedDate = formValues.birth?.format("YYYY-MM-DD");
    const currentUserId = userId || localStorage.getItem("userId");

    if (!currentUserId) {
      toast.error(
        "Không tìm thấy thông tin người dùng, vui lòng tải lại trang"
      );
      return;
    }

    const dataToSubmit = {
      fullname: formValues.fullName || formValues.name, // Sửa để phù hợp với cả hai trường
      nickName: formValues.nickName,
      birth: formattedDate,
      gender: parseInt(formValues.gender, 10),
    };

    console.log("Data gửi lên API:", dataToSubmit);

    try {
      if (formValues.id) {
        // Update existing child
        const response = await updateChildren({
          id: formValues.id,
          children: dataToSubmit,
        });
        if (response?.isSuccess) {
          toast.success("Cập nhật thành công");
          setOpen(false);
          form.resetFields();
          fetchChildren(currentUserId);
        } else {
          toast.error(response?.errorMessage || "Có lỗi xảy ra!");
        }
      } else {
        // Create new child
        const response = await createChildren(dataToSubmit);
        if (response?.isSuccess) {
          toast.success("Thêm mới thành công");
          setOpen(false);
          form.resetFields();
          fetchChildren(currentUserId);
        } else {
          toast.error(
            response?.errorMessage ||
              "Vui lòng mua gói để sử dụng chức năng này"
          );
        }
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error(
        "Có lỗi xảy ra khi " +
          (formValues.id ? "cập nhật" : "thêm mới") +
          " thông tin bé!"
      );
    }
  };

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true);
          form.resetFields();
        }}
      >
        Thêm bé mới
      </Button>
      <Table
        dataSource={childrens}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={
          form.getFieldValue("id") ? "Cập nhật thông tin bé" : "Thêm bé mới"
        }
        open={open}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText={form.getFieldValue("id") ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmit}>
          <Form.Item label="Id" name="id" hidden>
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Bé"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên của bé!!!" }]}
          >
            <Input placeholder="Nhập tên của bé" />
          </Form.Item>
          <Form.Item label="Biệt Danh (Nickname)" name="nickName">
            <Input placeholder="Nhập biệt danh của bé" />
          </Form.Item>
          <Form.Item
            label="Giới Tính"
            name="gender"
            rules={[
              { required: true, message: "Vui lòng nhập giới tính của bé!!!" },
            ]}
          >
            <Select placeholder="Chọn giới tính">
              <Select.Option value={0}>Nam</Select.Option>
              <Select.Option value={1}>Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Ngày dự sinh"
            name="birth"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập Ngày dự sinh của bé!!!",
              },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn Ngày dự sinh"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManagerBaby;
