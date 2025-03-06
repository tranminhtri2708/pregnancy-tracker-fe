import React, { useEffect, useState } from "react";
import {
  createChildren,
  deleteChildren,
  getAllChildren,
  updateChildren,
} from "../../services/api.children";

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
  const [childrens, setChildrens] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = useForm();
  const [loading, setLoading] = useState(false);

  const getUserID = async () => {
    try {
      const response = await api.get("UserAccount/GetUserId");
      localStorage.setItem("userId", response.data.result.userId);
      return response.data.result.userId;
    } catch (error) {
      console.error("Error fetching user ID:", error);
      return null;
    }
  };

  const fetchChildren = async (userId) => {
    try {
      setLoading(true);
      const data = await getAllChildren();
      const filteredResult = data.result.filter(
        (item) => item.accountId === +userId
      );
      console.log("Filtered children:", filteredResult);
      setChildrens(filteredResult);
    } catch (error) {
      console.error("Error fetching children:", error);
      setChildrens([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initData = async () => {
      const userId = await getUserID(); // Đợi lấy userId trước
      if (userId) {
        fetchChildren(userId); // Sau đó mới gọi fetchChildren với userId
      } else {
        // Thử dùng userId từ localStorage nếu đã có
        const storedUserId = localStorage.getItem("userId");
        if (storedUserId) {
          fetchChildren(storedUserId);
        }
      }
    };

    initData();
  }, []);

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
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      render: (gender) => formatGender(gender),
    },
    {
      title: "Ngày sinh",
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
        const userId = localStorage.getItem("userId");
        fetchChildren(userId);
      }
    } catch (error) {
      toast.error("Xóa thất bại: " + (error.message || "Lỗi không xác định"));
    }
  };

  const handleSubmit = async (formValues) => {
    const formattedDate = formValues.birth?.format("YYYY-MM-DD");
    const dataToSubmit = {
      name: formValues.name,
      nickName: formValues.nickName, // Thêm nickName vào data
      birth: formattedDate,
      gender: parseInt(formValues.gender, 10),
      userId: localStorage.getItem("userId"),
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
          const userId = localStorage.getItem("userId");
          fetchChildren(userId);
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
          const userId = localStorage.getItem("userId");
          fetchChildren(userId);
        } else {
          toast.error(response?.errorMessage || "Có lỗi xảy ra!");
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
            label="Ngày Sinh"
            name="birth"
            rules={[
              { required: true, message: "Vui lòng nhập ngày sinh của bé!!!" },
            ]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              placeholder="Chọn ngày sinh"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManagerBaby;
