import React, { useEffect, useState } from "react";
import { Spin, message, Button } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart,
} from "recharts";
import html2canvas from "html2canvas";
import api from "../../config/axios";
import { getHealthMetricsByChild } from "../../services/api.heathmetric";

const GrowthChart = ({ childId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [whoStandards, setWhoStandards] = useState([]);
  const [loading, setLoading] = useState(false);

  const defaultWeeks = Array.from({ length: 35 }, (_, i) => i + 8);

  // Fetch Baby Data
  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);
      console.log("@3", id);
      const response = await getHealthMetricsByChild(id);
      console.log("123", response);
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
      const range = [whoMetric[`${key}Min`] ?? 0, whoMetric[`${key}Max`] ?? 0];
      return {
        pregnancyWeek: week,
        baby: babyMetric[key] || null,
        range: range,
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

  const renderChart = (data, title, babyKey) => {
    // Filter the data to include only weeks with baby data
    const filteredData = data.filter((entry) => entry[babyKey] !== null);

    return (
      <div className="chart-container">
        <div style={{ marginBottom: "2rem" }}>
          <h3 className="text-2xl text-center mb-6">{title}</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={filteredData}>
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
              <Tooltip />
              <Legend
                wrapperStyle={{
                  bottom: -10,
                  right: -20,
                }}
              />
              {/* Line representing the baby's data */}
              <Line
                type="monotone"
                dataKey={babyKey}
                stroke="#ff7300"
                name="Baby"
                strokeWidth={3}
              />
              {/* Area representing WHO Min and Max range */}
              <Area
                type="monotone"
                dataKey="range"
                stroke="none"
                fill="#add8e6"
                name="WHO Range"
                fillOpacity={0.3}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    );
  };

  const handleExportImage = async () => {
    const chartElement = document.querySelector(".chart-container"); // Adjust the selector to match your chart's container
    console.log("clicked!", chartElement);
    if (!chartElement) {
      message.error("Chart not found!");
      return;
    }

    try {
      const canvas = await html2canvas(chartElement);
      const link = document.createElement("a");
      link.download = "chart.png";
      link.href = canvas.toDataURL("image/png");
      link.click();
      message.success("Chart exported as an image successfully!");
    } catch (error) {
      console.error("Error exporting chart:", error);
      message.error("Could not export chart as an image.");
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
      {/* <div>{renderChart(graphData.heartRate, "Nhịp tim (bpm)", "baby")}</div>
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
      <div>{renderChart(graphData.fl, "Chiều dài xương đùi (mm)", "baby")}</div> */}
      <div className="text-center mt-6">
        <Button
          type="primary"
          onClick={handleExportImage}
          style={{
            marginRight: "1rem",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
          }}
        >
          Export as Image
        </Button>
      </div>
    </div>
  );
};

export default GrowthChart;
