import React, { useEffect, useState } from "react";
import { Spin, message, Button, Select, Table } from "antd";
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
import { jsPDF } from "jspdf";
import Header from "../../components/header";
import Footer from "../../components/footer";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import api from "../../config/axios";
import { getHealthMetricsByChild } from "../../services/api.heathmetric";

const GrowthChart = ({ childId }) => {
  const { id } = useParams();
  const [startWeek, setStartWeek] = useState(8); // Default start week
  const [endWeek, setEndWeek] = useState(40); // Default end week
  const navigate = useNavigate();
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [sortedHealthMetrics, setSortedHealthMetrics] = useState([]);
  const [whoStandards, setWhoStandards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode] = useState(false);
  const defaultWeeks = Array.from({ length: 35 }, (_, i) => i + 8);

  // Fetch Baby Data
  // ✅ State Management & Variables
  const fetchHealthMetrics = async () => {
    try {
      setLoading(true);

      const response = await getHealthMetricsByChild(id);
      setHealthMetrics(response);
      const sortedHealthMetrics = response.sort(
        (a, b) => a.pregnancyWeek - b.pregnancyWeek
      );
      setSortedHealthMetrics("sortedHealthMetrics");
      console.log("!!!!!", sortedHealthMetrics);
      if (sortedHealthMetrics.length === 0) return; // Prevent errors
      setStartWeek(sortedHealthMetrics[0].pregnancyWeek);

      setEndWeek(
        sortedHealthMetrics[sortedHealthMetrics.length - 1].pregnancyWeek
      );
    } catch (error) {
      message.error("Cannot fetch health metrics! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchWHOStandards = async () => {
    try {
      const response = await api.get("WHOStandard/GetAllWHOStatistics");
      setWhoStandards(response.data.result || []);
    } catch (error) {
      message.error("Cannot fetch WHO standards! Please try again.");
    }
  };

  // ✅ Data Processing Functions
  const mergeData = (key) => {
    return defaultWeeks.map((week) => {
      const babyMetric =
        healthMetrics.find((m) => m.pregnancyWeek === week) || {};
      const whoMetric =
        whoStandards.find((s) => s.pregnancyWeek === week) || {};
      return {
        pregnancyWeek: week,
        baby: babyMetric[key] || null,
        range: [whoMetric[`${key}Min`] ?? 0, whoMetric[`${key}Max`] ?? 0],
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

  // ✅ Data Fetching on Component Mount
  useEffect(() => {
    const fetchData = async () => {
      await fetchHealthMetrics();
      await fetchWHOStandards();
    };
    fetchData();
  }, [childId]);

  // ✅ Chart Rendering Function
  const renderChart = (data, title, babyKey) => {
    const filteredData = data.filter(
      (entry) =>
        entry.pregnancyWeek >= startWeek &&
        entry.pregnancyWeek <= endWeek &&
        entry[babyKey] !== null
    );

    return (
      <div
        className="chart-container"
        style={{
          backgroundColor: "#ffffff",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <h3 className="text-2xl text-center mb-6">{title}</h3>
        <ResponsiveContainer width="100%" height={400}>
          <ComposedChart data={filteredData}>
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis
              dataKey="pregnancyWeek"
              label={{
                value: "Pregnancy Week",
                position: "insideBottom",
                offset: -2,
              }}
            />
            <YAxis />
            <Tooltip />
            <Legend
              wrapperStyle={{
                position: "absolute",
                textAlign: "center",
                width: "100%",
              }}
            />
            <Line
              type="monotone"
              dataKey={babyKey}
              stroke="#ff7300"
              name="Baby"
              strokeWidth={3}
            />
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
    );
  };

  // ✅ Export Chart as Image
  const handleExportImage = async () => {
    const chartElement = document.querySelector(".namMo");
    if (!chartElement) return message.error("Chart not found!");

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

  // ✅ Export Report as PDF
  const exportToPDF = () => {
    const element = document.querySelector(".NamMoo");
    html2canvas(element, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 190;
      const pageHeight = pdf.internal.pageSize.height;
      let imgHeight = (canvas.height * imgWidth) / canvas.width;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      position += imgHeight;

      while (position > pageHeight) {
        pdf.addPage();
        position -= pageHeight;
      }

      pdf.save("report.pdf");
    });
  };

  // ✅ Table Configuration
  const columns = [
    {
      title: "Tuần",
      dataIndex: "pregnancyWeek",
      key: "pregnancyWeek",
      sorter: (a, b) => a.pregnancyWeek - b.pregnancyWeek,
      defaultSortOrder: "ascend",
    },
    { title: "Cân nặng (grams)", dataIndex: "weight", key: "weight" },
    { title: "Chiều dài (cm)", dataIndex: "lenght", key: "lenght" },
  ];

  // ✅ Loading State
  if (loading) return <Spin tip="Loading growth data..." />;

  return (
    <div className={`pl-25 pr-25 pt-5 pb-5 min-h-screen`}>
      <Header />
      <h2 className="text-center text-2xl font-bold mt-12 mb-5">
        Tham khảo thông số tại trang{" "}
        <i>
          <u
            className="font-bold italic cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate("/whostandard")}
          >
            bảng sức khỏe chuẩn
          </u>
        </i>
      </h2>
      <div>
        {/* Week Selection */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          {" "}
          {/* Start Week Dropdown */}{" "}
          <Select defaultValue={startWeek} onChange={setStartWeek}>
            {" "}
            {[...Array.from({ length: 33 }, (_, i) => i + 8)]
              .filter((week) => week < endWeek)
              .map((week) => (
                <Select.Option key={week} value={week}>
                  {" "}
                  Tuần {week}{" "}
                </Select.Option>
              ))}{" "}
          </Select>{" "}
          {/* End Week Dropdown (Only Weeks Greater than startWeek) */}{" "}
          <Select defaultValue={endWeek} onChange={setEndWeek}>
            {" "}
            {[...Array.from({ length: 33 + 8 }, (_, i) => i + 8).keys()]
              .filter((week) => week > startWeek)
              .map((week) => (
                <Select.Option key={week} value={week}>
                  {" "}
                  Tuần {week}{" "}
                </Select.Option>
              ))}{" "}
          </Select>{" "}
        </div>
      </div>
      <div className="NamMoo">
        <h1 className="text-4xl font-bold text-center">
          Báo cáo sức khỏe của bé qua các tuần
        </h1>
        <h3 className="text-2xl font-semibold text-left mt-6 mb-2">
          {startWeek === 9 && endWeek === 13
            ? "Biểu đồ từ tuần 9 đến tuần 13"
            : `Biểu đồ từ tuần ${startWeek} đến tuần ${endWeek}`}
        </h3>
        <div className="namMo">
          <div>{renderChart(graphData.weight, "Cân nặng (gram)", "baby")}</div>
          <div>{renderChart(graphData.length, "Chiều dài (cm)", "baby")}</div>
        </div>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        {/* <Table
          className="ant-table-content"
          columns={columns}
          dataSource={healthMetrics}
          rowKey="id"
          pagination={false}
        /> */}
      </div>

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
      <div className="text-center mt-6 mb-9">
        <Button
          type="primary"
          onClick={exportToPDF}
          style={{
            marginRight: "1rem",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
          }}
        >
          Xuất file PDF
        </Button>
        <Button
          type="primary"
          onClick={handleExportImage}
          style={{
            marginRight: "1rem",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
          }}
        >
          Xuất file ảnh
        </Button>
      </div>
      <Footer />
    </div>
  );
};

export default GrowthChart;
