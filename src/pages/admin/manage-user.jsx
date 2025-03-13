import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser, updateRoleUser } from "../../services/api.user";
import { Button, Table, Modal, Select, message, Form, Input } from "antd";

function ManageUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [form] = Form.useForm();

  const fetchUser = async () => {
    setLoading(true);
    try {
      const data = await getUser();
      setUsers(data);
    } catch (error) {
      message.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // get user
  useEffect(() => {
    fetchUser();
  }, []);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalVisible(true);

    // Set initial form values
    form.setFieldsValue({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      role: user.role,
    });
  };

  const handleCancel = () => {
    setEditModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      // Create the payload with only the role field
      const personal = {
        role: values.role,
        // Không thêm các trường khác vì chúng ta chỉ cho phép sửa role
      };

      await updateRoleUser({
        customerId: selectedUser.id,
        personal,
      });

      message.success("User role updated successfully");

      // Update the local state to reflect the change
      setUsers(
        users.map((user) =>
          user.id === selectedUser.id ? { ...user, role: values.role } : user
        )
      );

      setEditModalVisible(false);
      form.resetFields();
    } catch (error) {
      console.error("Error updating role:", error);
    } finally {
      setLoading(false);
    }
  };

  // định nghĩa các cột của table
  const columns = [
    {
      title: "Tên đầu",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Tên cuối",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        return role === 0 ? "Customer" : "Admin";
      },
      filters: [
        { text: "Customer", value: 0 },
        { text: "Admin", value: 1 },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Hành động",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        return (
          <Button
            type="primary"
            onClick={() => handleEdit(record)}
            loading={loading && selectedUser?.id === id}
          >
            Chỉnh sửa
          </Button>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-blue-500">
        Quản Lý Người Dùng
      </h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading && !selectedUser}
      />

      <Modal
        title="Chỉnh sửa người dùng"
        open={editModalVisible}
        onOk={handleSave}
        onCancel={handleCancel}
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical" initialValues={{ remember: true }}>
          <Form.Item label="Tên đầu" name="firstName">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Tên cuối" name="lastName">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Email" name="email">
            <Input disabled />
          </Form.Item>

          <Form.Item label="Số điện thoại" name="phoneNumber">
            <Input disabled />
          </Form.Item>

          <Form.Item
            label="Vai trò"
            name="role"
            rules={[{ required: true, message: "Vui lòng chọn vai trò!" }]}
          >
            <Select
              options={[
                { value: 0, label: "Customer" },
                { value: 1, label: "Admin" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageUser;
