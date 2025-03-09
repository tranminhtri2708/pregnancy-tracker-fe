import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../services/api.user";
import { Button, Table } from "antd";

// CRUD function
function ManageUser() {
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    const data = await getUser(); // call api
    setUsers(data);
  };

  // get user
  useEffect(() => {
    fetchUser();
  }, []);

  // định nghĩa các cột của table
  const columns = [
    {
      title: "Tên đầu",
      dataIndex: "firstName", // mapping vs be trả về
      key: "firstName",
    },
    {
      title: "Tên cuối",
      dataIndex: "lastName", // mapping vs be trả về
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email", // mapping vs be trả về
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber", // mapping vs be trả về
      key: "phoneNumber",
    },
    {
      title: "Role",
      dataIndex: "role", // mapping vs be trả về
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
        return <Button type="primary">Chỉnh sửa</Button>;
      },
    },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4 text-blue-500">
        Quản Lý Người Dùng
      </h1>
      <Table dataSource={users} columns={columns} />
      {/*dataSource nguồn dữ liệu nằm trong biến users */}
    </div>
  );
}

export default ManageUser;
