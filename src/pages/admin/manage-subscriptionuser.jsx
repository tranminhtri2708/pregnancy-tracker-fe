import React, { useEffect, useState } from "react";
import { Table, Select, Space, Typography } from "antd";
import { getAllMemberByPlan } from "../../services/api.subscription";

const { Title } = Typography;

function ManageSubscriptionUserAdmin() {
  const [subscriptionUserAdmin, setSubscriptionUserAdmin] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState("0");
  const [loading, setLoading] = useState(false);

  const fetchSubscriptionUserAdmin = async (PlansName) => {
    try {
      setLoading(true);
      const data = await getAllMemberByPlan(PlansName);
      setSubscriptionUserAdmin(data?.result || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách thành viên:", error);
      setSubscriptionUserAdmin([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptionUserAdmin(selectedPlan);
  }, [selectedPlan]);

  const getPlanColor = (plan) => {
    switch (plan) {
      case "0":
        return "text-blue-600";
      case "1":
        return "text-green-600";
      case "2":
        return "text-yellow-600";
      default:
        return "text-gray-600";
    }
  };

  const columns = [
    {
      title: "STT",
      dataIndex: "",
      key: "index",
      width: 70,
      render: (text, record, index) => (
        <span className="font-semibold text-gray-700">{index + 1}</span>
      ),
    },
    {
      title: "Họ",
      dataIndex: "firstName",
      key: "firstName",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
      render: (text) => (
        <span className="font-medium text-gray-800">{text}</span>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text) => <span className="text-blue-700 italic">{text}</span>,
    },
    {
      title: "Gói Đăng Ký",
      key: "planName",
      render: () => (
        <span className={`font-bold ${getPlanColor(selectedPlan)}`}>
          {selectedPlan === "0"
            ? "Gói Bronze"
            : selectedPlan === "1"
            ? "Gói Silver"
            : "Gói Gold"}
        </span>
      ),
    },
  ];

  const handlePlanChange = (value) => {
    setSelectedPlan(value);
  };

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-4 text-blue-500">
        Quản Lý Người Dùng Theo Gói
      </h1>
      <Space direction="vertical" style={{ width: "100%" }}>
        <Select
          className="w-[200px] mb-4"
          placeholder="Chọn gói"
          value={selectedPlan}
          onChange={handlePlanChange}
        >
          <Select.Option value="0" className="font-medium">
            Gói Bronze
          </Select.Option>
          <Select.Option value="1" className="font-medium">
            Gói Silver
          </Select.Option>
          <Select.Option value="2" className="font-medium">
            Gói Gold
          </Select.Option>
        </Select>
        <Table
          dataSource={subscriptionUserAdmin}
          columns={columns}
          loading={loading}
          locale={{
            emptyText: (
              <div className="text-gray-500 font-medium">
                Không có người dùng trong gói này
              </div>
            ),
          }}
          rowKey="email"
          className="shadow-md rounded-lg"
        />
      </Space>
    </div>
  );
}

export default ManageSubscriptionUserAdmin;
