import React, { useState } from "react";
import DashboardTemplate from "../../components/templates/dashboardTemplate";
import { Image, Input, Upload } from "antd";
import FormItem from "antd/es/form/FormItem";
import { PlusOutlined } from "@ant-design/icons";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Image",
    dataIndex: "image",
    key: "image",
    render: (image) => <Image src={image} width={100} />,
  },
  {
    title: "Price",
    key: "price",
    dataIndex: "price",
  },
  // {
  //   title: "Quantity",
  //   key: "quantity",
  //   dataIndex: "quantity",
  // },
];

function ManageSubscription() {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [fileList, setFileList] = useState([]);
  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };
  const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const formItems = (
    <>
      <FormItem
        label="Name"
        name="PlanName"
        rules={[
          {
            required: true,
            message: "Name can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>

      <FormItem
        label="Price"
        name="Price"
        rules={[
          {
            required: true,
            message: "Price can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="DurationMonths"
        name="DurationMonths"
        rules={[
          {
            required: true,
            message: "DurationMonths can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="Description"
        name="Description"
        rules={[
          {
            required: true,
            message: "Description can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="isActive"
        name="isActive"
        rules={[
          {
            required: true,
            message: "isActive can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="CreatedTime"
        name="CreatedTime"
        rules={[
          {
            required: true,
            message: "CreatedTime can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem
        label="isDeleted"
        name="isDeleted"
        rules={[
          {
            required: true,
            message: "isDeleted can not be empty",
          },
        ]}
      >
        <Input />
      </FormItem>
      <FormItem label="Avatar" name="avatar">
        <Upload
          action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
          listType="picture-card"
          fileList={fileList}
          onPreview={handlePreview}
          onChange={handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
      </FormItem>
    </>
  );
  return (
    <div>
      <DashboardTemplate
        title={"Subscription"}
        columns={columns}
        uri={"subscription"}
        formItems={formItems}
      />
    </div>
  );
}

export default ManageSubscription;
