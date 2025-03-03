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
import axios from "axios";

function ManagerBaby() {
  const [childrens, setChildrens] = useState([]);
  const [open, setOpen] = useState(false);
  const [form] = useForm();

  const getUserID = async() => {
    try{
      const response = await api.get("UserAccount/GetUserId");
      
      localStorage.setItem(
        "userId",
        response.data.result.userId
      );
    }catch (error) {
      console.error("Error fetching children:", error);
    }

  }
  const fetchChildren = async () => {
    try {
      const data = await getAllChildren();
      const userId = localStorage.getItem("userId");
      console.log("userId", userId);
      const filteredResult = data.result.filter(item => item.accountId === +userId);
      console.log(filteredResult)
      setChildrens(filteredResult);
      // const filteredResult = data.result.filter(item => item.accountId === localStorage.getItem("userId"));
      
    } catch (error) {
      console.error("Error fetching children:", error);
      setChildrens([]);
    }
  };

  useEffect(() => {
    fetchChildren();
    getUserID();
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
      title: "Trạng thái",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        // record là data của từng hàng
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true); // show modal lên
                form.setFieldsValue({
                  ...record,
                  birth: record.birth ? dayjs(record.birth) : null, // Chuyển đổi ngày sinh
                });
              }}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete the children"
              description="Bạn có chắc chắn xóa tên này?"
              onConfirm={() => handleDeleteProduct(id)}
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
  const handleDeleteProduct = async (id) => {
    const response = await deleteChildren(id);
    if (response) {
      fetchChildren();
    }
  };
  const handleSubmit = async (formValues) => {
    const formattedDate = formValues.birth?.format("YYYY-MM-DD");
    const dataToSubmit = {
      name: formValues.name,
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
          children: dataToSubmit, // Sử dụng dữ liệu đã định dạng ở đây
        });
        if (response?.isSuccess) {
          toast.success("Update successfully");
          setOpen(false);
          form.resetFields();
          fetchChildren();
        } else {
          toast.error(response?.errorMessage || "Có lỗi xảy ra!");
        }
      } else {
        // Create new child
        const response = await createChildren(dataToSubmit);
        if (response?.isSuccess) {
          toast.success("Create successfully");
          setOpen(false);
          form.resetFields();
          fetchChildren();
        } else {
          toast.error(response?.errorMessage || "Có lỗi xảy ra!");
        }
      }
    } catch (error) {
      console.error("Lỗi API:", error);
      toast.error(
        "Có lỗi xảy ra khi " + (formValues.id ? "cập nhật" : "tạo") + " bé!"
      );
    }
  };
  return (
    <div>
      <Button type="primary" onClick={() => setOpen(true)}>
        Create new children
      </Button>
      <Table dataSource={childrens} columns={columns} rowKey="id" />
      <Modal
        title="Children"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form labelCol={{ span: 24 }} form={form} onFinish={handleSubmit}>
          <Form.Item label="Id" name="id" hidden>
            {" "}
            {/*Này là để biết mình đang update thằng nào */}
            <Input />
          </Form.Item>
          <Form.Item
            label="Tên Bé"
            name="name"
            rules={[{ required: true, message: "Vui lòng nhập tên của bé!!!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Giới Tính"
            name="gender"
            rules={[
              { required: true, message: "Vui lòng nhập giới tính của bé!!!" },
            ]}
          >
            <Select>
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
