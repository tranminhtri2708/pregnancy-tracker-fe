import { Card, Col, Row, Statistic } from "antd";
import React, { useEffect, useState } from "react";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { UserOutlined, RiseOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";

function Overview() {
  const [data, setData] = useState();
  const [dataTotalPlan, setDataTotalPlan] = useState();
  const [dataNumberSub, setDataNumberSub] = useState();
  const [pieData, setPieData] = useState([]);
  const [revenuePieData, setRevenuePieData] = useState([]);

  const COLORS = ["#FFD700", "#C0C0C0", "#CD7F32"]; // Gold, Silver, Bronze colors

  const fetchDataTotalSub = async () => {
    try {
      const response = await api.get("SubscriptionPlan/CalculateTotalRevenue");
      console.log("Subscription data:", response.data);
      setDataNumberSub(response.data);

      // Transform the data for pie chart
      if (response.data && response.data.result) {
        const result = response.data.result;
        const formattedData = Object.keys(result).map((key) => ({
          name: key,
          value: result[key],
        }));
        setRevenuePieData(formattedData);
        console.log("Revenue Pie data:", formattedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataNumberSub = async () => {
    try {
      const response = await api.get("SubscriptionPlan/NumberOfSubscribers");
      console.log("Subscription data:", response.data);
      setDataNumberSub(response.data);

      // Transform the data for pie chart
      if (response.data && response.data.result) {
        const result = response.data.result;
        const formattedData = Object.keys(result).map((key) => ({
          name: key,
          value: result[key],
        }));
        setPieData(formattedData);
        console.log("Pie data:", formattedData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await api.get("UserAccount/CountUser");
      console.log("User count data:", response.data);
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchDataTotalPlan = async () => {
    try {
      const response = await api.get("SubscriptionPlan/TotalPrice");
      console.log("Total Plan Data:", response.data);
      setDataTotalPlan(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchDataTotalPlan();
    fetchDataNumberSub();
    fetchDataTotalSub(); // Fetch the revenue data
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  return (
    <div>
      <Row gutter={16}>
        <Col span={12}>
          <Card variant="borderless">
            <Statistic
              title="Tổng số người dùng"
              value={data?.result}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<UserOutlined />}
              suffix="người"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card variant="borderless">
            <Statistic
              title="Tổng danh thu"
              value={dataTotalPlan?.result}
              valueStyle={{
                color: "#3f8600",
              }}
              prefix={<RiseOutlined />}
              suffix="Đồng"
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card title="Phân bổ gói đăng ký" variant="borderless">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart width={300} height={300}>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {pieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Doanh thu theo gói đăng ký" variant="borderless">
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PieChart width={300} height={300}>
                <Pie
                  data={revenuePieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label={({ name, value }) => `${formatCurrency(value)}đ`}
                >
                  {revenuePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${formatCurrency(value)}đ`,
                    "Doanh thu",
                  ]}
                />
                <Legend />
              </PieChart>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Overview;
