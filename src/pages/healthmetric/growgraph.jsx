import React, { useEffect, useState } from "react";
import { Spin, message, Button } from "antd";
import { useNavigate } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import api from "../../config/axios";
import { getHealthMetricsByChild } from "../../services/api.heathmetric";

const GrowthChart = ({ childId }) => {
  const navigate = useNavigate();
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [whoStandards, setWhoStandards] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultWeeks = Array.from({ length: 35 }, (_, i) => i + 8);

  // Fetch Baby Data
  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      const response = await getHealthMetricsByChild(childId);
      setHealthMetrics(response);
    } catch (error) {
      message.error("Cannot fetch health metrics! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch WHO Standards
  const fetchWHOStandards = async () => {
    try {
      const response = await api.get("WHOStandard/GetAllWHOStatistics");
      const data = response.data.result || [];
      setWhoStandards(data);
    } catch (error) {
      message.error("Cannot fetch WHO standards! Please try again.");
    }
  };

  useEffect(() => {
    fetchHealthMetrics();
    fetchWHOStandards();
  }, [childId]);

  const mergeData = (key) => {
    return defaultWeeks.map((week) => {
      const babyMetric =
        healthMetrics.find((m) => m.pregnancyWeek === week) || {};
      const whoMetric =
        whoStandards.find((s) => s.pregnancyWeek === week) || {};
      return {
        pregnancyWeek: week,
        baby: babyMetric[key] || null,
        min: whoMetric[`${key}Min`] || null,
        max: whoMetric[`${key}Max`] || null,
      };
    });
  };

  const graphData = {
    weight: mergeData("weight"),
    length: mergeData("lenght"),
    heartRate: mergeData("hearRate"),
    headCircumference: mergeData("headCircumference"),
    bpd: mergeData("bpd"),
    ac: mergeData("ac"),
    fl: mergeData("fl"),
  };

  if (loading) {
    return <Spin tip="Loading growth data..." />;
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            padding: "10px",
          }}
        >
          <p>{`Week ${label}`}</p>
          {payload.map((data, index) => (
            <p key={index} style={{ color: data.stroke }}>
              {`${data.name}: ${data.value}`}
            </p>
          ))}
        </div>
      );
    }
  };

  const renderChart = (data, title, babyKey) => (
    <div style={{ marginBottom: "2rem" }}>
      <h3 className="text-2xl text-center mb-6">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid stroke="#f5f5f5" />
          <XAxis
            dataKey="pregnancyWeek"
            label={{
              value: "Pregnancy Week",
              position: "insideBottom",
              offset: -2,
            }}
            tickFormatter={(tick) => `${tick}`}
          />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              bottom: -10,
              right: -20,
            }}
          />
          <Line
            type="monotone"
            dataKey={babyKey}
            stroke="#ff7300"
            name="Baby"
            strokeWidth={3}
          />
          <Line type="monotone" dataKey="min" stroke="#387908" name="WHO Min" />
          <Line type="monotone" dataKey="max" stroke="#1E90FF" name="WHO Max" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  const handleExportReport = async () => {
    try {
      const response = await api.get(`/PdfExport/health-report/${childId}`, {
        responseType: "blob", // Ensure the file is downloaded as a blob
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `health-report-${childId}.pdf`);
      document.body.appendChild(link);
      link.click();
      message.success("Health report exported successfully!");
    } catch (error) {
      console.error("Error exporting health report:", error);
      message.error("Cannot export health report! Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-center text-2xl font-bold">
        Tất cả thông tin được dẫn từ nguồn{" "}
        <i>
          <u
            className="font-bold italic cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate("/whostandard")}
          >
            Who Standard
          </u>
        </i>
      </h2>
      <div>{renderChart(graphData.weight, "Cân nặng (gram)", "baby")}</div>
      <div>{renderChart(graphData.length, "Chiều dài (cm)", "baby")}</div>
      <div>{renderChart(graphData.heartRate, "Nhịp tim (bpm)", "baby")}</div>
      <div>
        {renderChart(
          graphData.headCircumference,
          "Chu vi vòng đầu (cm)",
          "baby"
        )}
      </div>
      <div>
        {renderChart(graphData.bpd, "Đường kính lưỡng đỉnh (mm)", "baby")}
      </div>
      <div>{renderChart(graphData.ac, "Chu vi bụng (mm)", "baby")}</div>
      <div>{renderChart(graphData.fl, "Chiều dài xương đùi (mm)", "baby")}</div>
      <div className="text-center mt-6">
        <Button
          type="primary"
          onClick={handleExportReport}
          style={{ fontSize: "1rem", padding: "0.5rem 1rem" }}
        >
          Xuất file báo cáo sức khỏe bé
        </Button>
      </div>
    </div>
  );
};

export default GrowthChart;
