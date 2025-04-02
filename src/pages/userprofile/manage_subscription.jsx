import React, { useEffect, useState } from "react";
import { getAllSubscriptionPlanUser } from "../../services/api.subscriptionuser";
import { Table, Tag } from "antd";
import moment from "moment";

function ManageSubscriptionUser() {
  const [mysubscription, setMysubscription] = useState([]);

  const fetchMySubscription = async () => {
    const data = await getAllSubscriptionPlanUser();
    // Xử lý dữ liệu để thêm trạng thái hết hạn và chuyển active sang tiếng Việt
    console.log("456456", data);
    const processedData = data.map((item) => {
      // Clone đối tượng để không ảnh hưởng đến dữ liệu gốc
      const newItem = { ...item };
      // Chuyển "active" thành "Đang hoạt động"
      if (newItem.status && newItem.status.toLowerCase() === "Active") {
        console.log("123123", newItem.status);
        newItem.status = "Đang hoạt động";
      }
      // else {
      //   newItem.status = "Hết hạn";
      // }

      return newItem;
    });
    console.log("processedData", processedData);
    setMysubscription(processedData);
  };

  useEffect(() => {
    fetchMySubscription();
  }, []);

  // Hàm định dạng ngày tháng - chỉ hiển thị ngày
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return moment(dateString).format("DD/MM/YYYY");
  };

  const colums = [
    {
      title: "Tên gói",
      dataIndex: "planName",
      key: "planName",
    },
    {
      title: "Giá gói",
      dataIndex: "price",
      key: "price",
    },

    {
      title: "Ngày mua gói",
      dataIndex: "startDate",
      key: "startDate",
      render: (text) => formatDate(text),
    },
    {
      title: "Ngày gói hết hạn",
      dataIndex: "endDate",
      key: "endDate",
      render: (text, record) => {
        // Nếu gói là vĩnh viễn
        if (record.planName && record.planName.toLowerCase() === "gold") {
          return "Gói này có hiệu lực vĩnh viễn";
        }
        return formatDate(text);
      },
    },
    {
      title: "Trạng thái gói",
      dataIndex: "status",
      key: "status",
      render: (text, record) => {
        // Determine the color based on status

        let color = "";
        let displayText = "";
        if (record.status === "Active") {
          color = "green";
          displayText = "Đang hoạt động";
        } else if (record.status === "Expired") {
          color = "red";
          displayText = "Hết hạn";
        }
        return <Tag color={color}>{displayText}</Tag>;
      },
    },
    {
      title: "Trạng thái thanh toán",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (text, record) => {
        let color = "";
        let displayText = "";
        if (record.paymentStatus === "Paid") {
          color = "green";
          displayText = "Đã thanh toán";
        } else if (record.paymentStatus === "Pending") {
          color = "yellow";
          displayText = "Chưa thanh toán";
        }

        return <Tag color={color}>{displayText}</Tag>;
      },
    },
  ];

  // CSS tùy chỉnh cho bảng
  const customStyle = `
    <style>
      .subscription-table .ant-table-thead > tr > th {
        background-color: #ffebee !important; /* Màu hồng nhạt */
        color: #d81b60 !important; /* Màu hồng đậm */
        font-weight: bold;
        font-size: 16px;
      }
      
      /* Đảm bảo đường viền vẫn hiển thị */
      .subscription-table .ant-table-thead > tr > th,
      .subscription-table .ant-table-tbody > tr > td {
        border: 1px solid #f0f0f0 !important;
      }
      
      /* Đảm bảo các đường viền nội bộ vẫn còn */
      .subscription-table .ant-table-container table > thead > tr:first-child th:first-child {
        border-top-left-radius: 2px;
      }
      
      .subscription-table .ant-table-container table > thead > tr:first-child th:last-child {
        border-top-right-radius: 2px;
      }
    </style>
  `;

  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: customStyle }} />
      <Table
        dataSource={mysubscription}
        columns={colums}
        bordered={true}
        className="subscription-table"
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

export default ManageSubscriptionUser;
