import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getUser } from "../../services/api.user";
import { Table } from "antd";
// CRUD
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
  ];
  return (
    <div>
      <h1 className="text-3xl font-bold  mb-4 text-blue-500">
        Quản Lý Người Dùng
      </h1>
      <Table dataSource={users} columns={columns} />;
      {/*dataSource nguồn dữ liệu nằm trong biên users */}
    </div>
  );
}

export default ManageUser;
