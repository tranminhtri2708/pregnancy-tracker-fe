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
import { jsPDF } from "jspdf";
import Header from "../../components/header";
import Footer from "../../components/footer";
import html2canvas from "html2canvas";
import html2pdf from "html2pdf.js";
import api from "../../config/axios";
import { getHealthMetricsByChild } from "../../services/api.heathmetric";

const GrowthChart = ({ childId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [healthMetrics, setHealthMetrics] = useState([]);
  const [whoStandards, setWhoStandards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [darkMode] = useState(false);
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

  // const handleExportPDF = () => {
  //   const chartElement = document.querySelector(".namMo"); // Adjust selector to match your chart's container
  //   console.log("clicked!", chartElement);
  //   if (!chartElement) {
  //     message.error("Chart not found!");
  //     return;
  //   }

  //   const options = {
  //     margin: 10,
  //     filename: "chart.pdf",
  //     image: { type: "jpeg", quality: 0.98 },
  //     html2canvas: { scale: 3 }, // Adjusted for better resolution without excessive scaling
  //     jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }, // Changed format to A3 for a larger chart
  //   };

  //   html2pdf().from(chartElement).set(options).save();
  //   message.success("Chart exported as a PDF successfully!");
  // };
  const handleExportPDF = async () => {
    const chartElement = document.querySelector(".namMo");
    if (!chartElement) {
      message.error("Chart not found!");
      return;
    }

    try {
      const canvas = await html2canvas(chartElement, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: "portrait", // Portrait ensures better readability for multipage PDFs
        unit: "mm",
        format: "a4",
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let imgWidth = pageWidth - 20; // Slight padding for better visibility
      let imgHeight = (canvas.height * imgWidth) / canvas.width;

      let yPosition = 30; // Start below the header
      // Add Header
      pdf.setFontSize(16);
      pdf.setFont("times", "bold"); // Make first line bold
      pdf.text("Pregnancy's health overview report", 10, 15);

      pdf.setFontSize(12);
      pdf.setFont("times", "normal"); // Reset to normal font
      pdf.text("Pregnancy's health growth chart", 10, 25); // Change Y value to place below

      // Split the chart into multiple pages
      while (yPosition + imgHeight > pageHeight - 20) {
        pdf.addImage(
          imgData,
          "PNG",
          10,
          yPosition,
          imgWidth,
          pageHeight - yPosition - 20
        );
        pdf.addPage(); // Create a new page
        yPosition = 10; // Reset position on the new page
      }

      // Add remaining part of the image on the last page
      pdf.addImage(imgData, "PNG", 10, yPosition, imgWidth, imgHeight);

      // Add Footer
      pdf.setFontSize(10);
      pdf.text(
        "Generated by MomCare",
        10,
        pdf.internal.pageSize.getHeight() - 10
      );

      pdf.save("chart.pdf");
      message.success("Chart exported as a multi-page PDF successfully!");
    } catch (error) {
      console.error("Error exporting chart:", error);
      message.error("Could not export chart as a PDF.");
    }
  };

  const renderChart = (data, title, babyKey) => {
    // Filter the data to include only weeks with baby data
    const filteredData = data.filter((entry) => entry[babyKey] !== null);

    return (
      <div
        className="chart-container"
        style={{
          backgroundColor: "#ffffff",
          padding: "1rem",
          borderRadius: "8px",
        }}
      >
        <div style={{ marginBottom: "2rem" }}>
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
                tickFormatter={(tick) => `${tick}`}
              />
              <YAxis />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  position: "absolute",
                  textAlign: "center",
                  width: "100%", // Ensures it aligns correctly
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
    const chartElement = document.querySelector(".namMo"); // Adjust the selector to match your chart's container
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
    <div className={`pl-25 pr-25 pt-5 pb-5 min-h-screen`}>
      <Header />
      <h2 className="text-center text-2xl font-bold mt-12 mb-5">
        Tham khảo thông số tại trang{" "}
        <i>
          <u
            className="font-bold italic cursor-pointer text-blue-500 hover:underline"
            onClick={() => navigate("/whostandard")}
          >
            Who Standard
          </u>
        </i>
      </h2>
      <div className="namMo">
        <div>{renderChart(graphData.weight, "Cân nặng (gram)", "baby")}</div>
        <div>{renderChart(graphData.length, "Chiều dài (cm)", "baby")}</div>
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
      <div className="text-center mt-6">
        <Button
          type="primary"
          onClick={handleExportPDF}
          style={{
            marginRight: "1rem",
            fontSize: "1rem",
            padding: "0.5rem 1rem",
          }}
        >
          Export as PDF
        </Button>
      </div>
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
      <Footer />
    </div>
  );
};

export default GrowthChart;
