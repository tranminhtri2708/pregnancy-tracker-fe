import React, { useEffect, useState } from "react";
import {
  Table,
  Select,
  message,
  Button,
  Modal,
  Form,
  Input,
  Dropdown,
  Menu,
} from "antd";
import { DownOutlined } from "@ant-design/icons";
import Header from "../../components/header";
import Footer from "../../components/footer";
import {
  GetAllWHOStatistics,
  AddWHOStandard,
  UpdateWHOStandard,
  DeleteWHOStandard,
} from "../../services/api.whostandard";

const { Option } = Select;

const WhoStandardView = () => {
  const [darkMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hasData, setHasData] = useState(false);
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRow, setEditingRow] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false); // State for the create modal
  const [form] = Form.useForm();

  const defaultRows = Array.from({ length: 42 }, (_, index) => ({
    key: index + 1,
    week: index + 1,
    weightMin: "",
    weightMax: "",
    lenghtMin: "",
    lenghtMax: "",
    bpdMin: "",
    bpdMax: "",
    acMin: "",
    acMax: "",
    hearRateMin: "",
    hearRateMax: "",
    flMin: "",
    flMax: "",
    headCircumferenceMin: "",
    headCircumferenceMax: "",
  }));

  const handleCreateForWeek = (row) => {
    setEditingRow(row);
    setIsCreateModalVisible(true);
  };

  const handleCreate = async (values) => {
    try {
      const newRecord = {
        pregnancyWeek: 0,
        headCircumferenceMin: 0,
        headCircumferenceMax: 0,
        weightMin: 0,
        weightMax: 0,
        lenghtMin: 0,
        lenghtMax: 0,
        bpdMin: 0,
        bpdMax: 0,
        acMin: 0,
        acMax: 0,
        flMin: 0,
        flMax: 0,
        hearRateMin: 0,
        hearRateMax: 0,
        ...values,
      };
      console.log(pregnancyWeek);
      const createdRecord = await AddWHOStandard(newRecord); // Add API call
      form.resetFields();
      // Add the new record to local state
      fetchData();

      // Success notification
      message.success(
        `Successfully added new record for week ${
          newRecord.pregnancyWeek || "0"
        }!`
      );

      // Close the modal
      setIsCreateModalVisible(false);
    } catch (error) {
      message.error("Failed to add new WHO Standard record.");
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const fetchedData = await GetAllWHOStatistics();

      const processedData = defaultRows.map((defaultRow) => {
        const matchedRow = fetchedData.find(
          (item) => item.pregnancyWeek === defaultRow.week
        );
        return matchedRow
          ? {
              ...defaultRow,
              id: matchedRow.id, // Include the id from the API response
              headCircumferenceMin: matchedRow.headCircumferenceMin || "",
              headCircumferenceMax: matchedRow.headCircumferenceMax || "",
              weightMin: matchedRow.weightMin || "",
              weightMax: matchedRow.weightMax || "",
              lenghtMin: matchedRow.lenghtMin || "",
              lenghtMax: matchedRow.lenghtMax || "",
              bpdMin: matchedRow.bpdMin || "",
              bpdMax: matchedRow.bpdMax || "",
              acMin: matchedRow.acMin || "",
              acMax: matchedRow.acMax || "",
              flMin: matchedRow.flMin || "",
              flMax: matchedRow.flMax || "",
              hearRateMin: matchedRow.hearRateMin || "",
              hearRateMax: matchedRow.hearRateMax || "",
            }
          : defaultRow;
      });

      setData(processedData);
    } catch (error) {
      message.error("Failed to fetch WHO statistics");
      setData(defaultRows);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const deletedRow = data.find((row) => row.id === id); // Use id to find the row
    try {
      // Call the Delete API using the id
      await DeleteWHOStandard(id);

      // Reload the table by fetching the updated data
      await fetchData();

      // Success notification
      message.success(
        `Successfully deleted record for week ${deletedRow?.week}!`
      );
    } catch (error) {
      message.error("Failed to delete WHO Standard record.");
    }
  };

  const handleEdit = (row) => {
    setEditingRow(row);
    setIsModalVisible(true);
  };

  const handleSave = async (values) => {
    try {
      const updatedRecord = {
        pregnancyWeek: editingRow.week,
        headCircumferenceMin: editingRow.headCircumferenceMin || "",
        headCircumferenceMax: editingRow.headCircumferenceMax || "",
        weightMin: editingRow.weightMin || "",
        weightMax: editingRow.weightMax || "",
        lenghtMin: editingRow.lenghtMin || "",
        lenghtMax: editingRow.lenghtMax || "",
        bpdMin: editingRow.bpdMin || "",
        bpdMax: editingRow.bpdMax || "",
        acMin: editingRow.acMin || "",
        acMax: editingRow.acMax || "",
        flMin: editingRow.flMin || "",
        flMax: editingRow.flMax || "",
        hearRateMin: editingRow.hearRateMin || "",
        hearRateMax: editingRow.hearRateMax || "",
        ...values,
      };
      // Use the id from the editing row
      await UpdateWHOStandard(+editingRow.id, updatedRecord);

      // Update local state with the new values
      const updatedData = data.map((row) =>
        row.id === editingRow.id ? { ...row, ...values } : row
      );
      setData(updatedData);

      // Close the modal and show success notification
      form.resetFields();
      setIsModalVisible(false);

      message.success(
        `Successfully updated record for week ${editingRow?.week}!`
      );
    } catch (error) {
      message.error("Failed to update WHO Standard record.");
    }
  };

  const columns = [
    {
      title: "Tuần",
      dataIndex: "week",
      key: "week",
      align: "center", // Center horizontally
    },
    {
      title: "Chu vi vòng đầu",
      dataIndex: "headCircumference",
      key: "headCircumference",
      align: "center", // Center horizontally
      render: (_, record) => {
        const min = record.headCircumferenceMin || "";
        const max = record.headCircumferenceMax || "";
        return min || max ? (
          `${min}mm - ${max}mm`
        ) : (
          <span className="bg-gray-200 text-gray-500"></span>
        );
      },
    },
    {
      title: "Cân nặng ",
      dataIndex: "weight",
      key: "weight",
      align: "center",
      render: (_, record) => {
        const min = record.weightMin || "";
        const max = record.weightMax || "";

        // Convert values over 1000 to kilograms
        const formatWeight = (value) => {
          if (value && value > 1000) {
            return `${(value / 1000).toFixed(1)} kg`; // Convert to kg and keep 1 decimal place
          }
          return `${value} gram`; // Keep as gram
        };

        return min || max ? (
          `${formatWeight(min)} - ${formatWeight(max)}` // Format both min and max
        ) : (
          <span className="bg-gray-200 text-gray-500"></span> // Display placeholder if no data
        );
      },
    },
    {
      title: "Chiều dài",
      dataIndex: "lenght",
      key: "lenght",
      align: "center",
      render: (_, record) => {
        const min = record.lenghtMin || "";
        const max = record.lenghtMax || "";
        return min || max ? (
          `${min} cm - ${max} cm`
        ) : (
          <span className="bg-gray-200 text-gray-500"></span>
        );
      },
    },
    {
      title: "Đường kính lưỡng đỉnh",
      dataIndex: "bpd",
      key: "bpd",
      align: "center",
      render: (_, record) => {
        const min = record.bpdMin || "";
        const max = record.bpdMax || "";
        return min || max ? (
          `${min} mm - ${max} mm`
        ) : (
          <span className="bg-gray-200 text-gray-500"></span>
        );
      },
    },
    {
      title: "Chu vi bụng",
      dataIndex: "ac",
      key: "ac",
      align: "center",
      render: (_, record) => {
        const min = record.acMin || "";
        const max = record.acMax || "";
        return min || max ? (
          `${min} mm - ${max} mm`
        ) : (
          <span className="bg-gray-200 text-gray-500"></span>
        );
      },
    },
    {
      title: "Chiều dài xương đùi",
      dataIndex: "fl",
      key: "fl",
      align: "center",
      render: (_, record) => {
        const min = record.flMin || "";
        const max = record.flMax || "";
        return min || max ? (
          `${min} mm - ${max} mm`
        ) : (
          <span className="bg-gray-200 text-gray-500"></span>
        );
      },
    },
    {
      title: "Nhịp tim",
      dataIndex: "heartRate",
      key: "heartRate",
      align: "center",
      render: (_, record) => {
        const min = record.hearRateMin || "";
        const max = record.hearRateMax || "";
        return min || max ? (
          `${min} - ${max}`
        ) : (
          <span className="bg-gray-200 text-gray-500"></span>
        );
      },
    },
    {
      title: "Chỉnh sửa",
      key: "actions",
      align: "center",
      render: (_, row) => {
        // Check if row has any non-null or non-empty value
        const menu = (
          <Menu>
            <Menu.Item key="edit" onClick={() => handleEdit(row)}>
              Chỉnh sửa
            </Menu.Item>
            <Menu.Item key="delete" danger onClick={() => handleDelete(row.id)}>
              Xóa
            </Menu.Item>
            <Menu.Item key="create" onClick={() => handleCreateForWeek(row)}>
              Tạo Mới
            </Menu.Item>
          </Menu>
        );
        return (
          <Dropdown overlay={menu} trigger={["click"]}>
            <button className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded inline-flex items-center">
              Actions <DownOutlined className="ml-2" />
            </button>
          </Dropdown>
        );
      },
    },
  ];

  const MinMaxInputGroup = ({ field, label, disabled, getFieldValue }) => (
    <Form.Item label={label} style={{ marginBottom: "16px" }}>
      <Input.Group compact>
        <Form.Item name={field.min} noStyle>
          <Input
            placeholder="Min"
            style={{
              width: "48%",
              marginRight: "4%",
              borderRadius: "12px",
            }}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item
          name={field.max}
          noStyle
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const min = getFieldValue(field.min);
                if (min !== undefined && value < min) {
                  return Promise.reject(
                    new Error(
                      `${label.split(" ")[0]} tối đa không được nhỏ hơn ${
                        label.split(" ")[0]
                      } tối thiểu!`
                    )
                  );
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input
            placeholder="Max"
            style={{
              width: "48%",
              borderRadius: "12px",
            }}
            disabled={disabled}
          />
        </Form.Item>
      </Input.Group>
    </Form.Item>
  );

  const getDropdownOptions = () => {
    const totalPages = Math.ceil(42 / 14);
    const options = [];

    for (let page = 1; page <= totalPages; page++) {
      const startWeek = (page - 1) * 14 + 1;
      const endWeek = startWeek + 13;
      options.push({ label: `Week ${startWeek}-${endWeek}`, value: page });
    }

    return options;
  };
  const labels = [
    { min: "weightMin", max: "weightMax", label: "Cân nặng (gram)" },
    { min: "lenghtMin", max: "lenghtMax", label: "Chiều dài (cm)" },
    { min: "hearRateMin", max: "hearRateMax", label: "Nhịp tim (bpm)" },
    {
      min: "headCircumferenceMin",
      max: "headCircumferenceMax",
      label: "Chu vi vòng đầu (mm)",
    },
    { min: "bpdMin", max: "bpdMax", label: "Đường kính lưỡng đỉnh (mm)" },
    { min: "acMin", max: "acMax", label: "Chu vi bụng (mm)" },
    { min: "flMin", max: "flMax", label: "Chiều dài xương đùi (mm)" },
  ];

  return (
    <div
      className={`pl-25 pr-25 pt-5 pb-5 min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      <Header />
      <h1 className="text-3xl font-bold mb-4 text-blue-500">
        Quản Lý Tiêu Chuẩn WHO
      </h1>
      <Table
        className="border-gray-400"
        columns={columns}
        dataSource={data.slice((currentPage - 1) * 14, currentPage * 14)}
        loading={loading}
        bordered
        pagination={false}
        rowClassName={(record) => {
          if (record.week >= 1 && record.week <= 7) {
            return record.week === 7 && record.sacDiameter
              ? ""
              : "bg-gray-200 bg-gray-200 text-gray-500";
          }
          return "";
        }}
      />
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <Select
          value={currentPage}
          onChange={(value) => setCurrentPage(value)}
          style={{ width: 200 }}
          dropdownStyle={{ textAlign: "center" }}
        >
          {getDropdownOptions().map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>

      <Modal
        destroyOnClose={true}
        title={`Chỉnh sửa tiêu chuẩn WHO tuần ${editingRow?.week || ""}`}
        visible={isModalVisible}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          initialValues={editingRow}
          onFinish={handleSave}
          layout="vertical"
        >
          <Form.Item
            name="pregnancyWeek"
            initialValue={editingRow?.week || 0}
            hidden
          >
            <Input type="number" disabled hidden />
          </Form.Item>

          {editingRow?.week >= 1 && editingRow?.week <= 7 ? (
            <>
              <Form.Item name="pregnancyWeek" label="Tuần" hidden>
                <Input disabled />
              </Form.Item>

              {labels.map((field) => (
                <MinMaxInputGroup
                  key={field.min}
                  field={field}
                  label={field.label}
                  disabled
                  getFieldValue={form.getFieldValue}
                />
              ))}
            </>
          ) : (
            <>
              {/* Reusable MinMaxInputGroup for editable fields */}
              {labels.map((field) => (
                <MinMaxInputGroup
                  key={field.min}
                  field={field}
                  label={field.label}
                  getFieldValue={form.getFieldValue}
                />
              ))}
            </>
          )}

          {/* Save Button */}
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>

      <Modal
        destroyOnClose={true}
        title={`Tạo Mới Tiêu Chuẩn WHO - Tuần ${editingRow?.week || ""}`}
        visible={isCreateModalVisible}
        onCancel={() => {
          setIsCreateModalVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="pregnancyWeek"
            initialValue={editingRow?.week || 0}
            hidden
          >
            <Input type="number" disabled />
          </Form.Item>

          {editingRow?.week >= 1 && editingRow?.week <= 7 ? (
            <>
              <Form.Item name="pregnancyWeek" label="Tuần" hidden>
                <Input disabled />
              </Form.Item>

              {/* Reusable MinMaxInputGroup for each field */}
              {labels.map((field) => (
                <MinMaxInputGroup
                  key={field.min}
                  field={field}
                  label={field.label}
                  disabled
                  getFieldValue={form.getFieldValue}
                />
              ))}
            </>
          ) : (
            <>
              {/* Reusable MinMaxInputGroup for editable fields */}
              {labels.map((field) => (
                <MinMaxInputGroup
                  key={field.min}
                  field={field}
                  label={field.label}
                  getFieldValue={form.getFieldValue}
                />
              ))}
            </>
          )}

          <Button
            type="primary"
            htmlType="submit"
            style={{ marginTop: "16px", padding: "8px 16px" }}
          >
            Tạo Mới
          </Button>
        </Form>
      </Modal>

      <h2 className="text-center text-sm font-bold mt-4">
        * Thông tin được tham khảo từ nguồn{" "}
        <i>
          <u className="font-bold italic cursor-pointer text-blue-500 hover:underline">
            <a
              href="https://hellobacsi.com/mang-thai/thai-ky/tam-ca-nguyet-1/thai-nhi-8-tuan/"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold italic"
            >
              Hello Bacsi
            </a>
          </u>
        </i>
      </h2>

      <Footer />
    </div>
  );
};

export default WhoStandardView;
