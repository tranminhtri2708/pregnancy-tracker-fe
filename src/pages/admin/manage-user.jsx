import React from "react";
import { useSelector } from "react-redux";

function ManageUser() {
  // get data từ redux
  const user = useSelector((state) => state.user);
  return (
    <div>
      <h1>{user?.fullName}</h1> {/*Lấy thử dũ liệu */}
    </div>
  );
}

export default ManageUser;
