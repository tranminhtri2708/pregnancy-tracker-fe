import { Button, Form, Input, Modal, Popconfirm, Table, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { Image, Upload } from "antd";
import FormItem from "antd/es/form/FormItem";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import { PlusOutlined } from "@ant-design/icons";
import uploadFile from "../../utils/upload";

const SubcriptionManagement = () => {
  const [subcriptionList, setSubcriptionList] = useState([]);
  const [isOpen, setOpen] = useState(false); // mặc định Modal đóng
  const [form] = useForm();
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
  const columns = [
    // {
    //   title: "ID",
    //   dataIndex: "PlanID",
    //   key: "PlanID",
    // },
    {
      title: "Name",
      dataIndex: "PlanName",
      key: "PlanName",
    },
    {
      title: "Price",
      dataIndex: "Price",
      key: "Price",
    },
    {
      title: "DurationMonths",
      dataIndex: "DurationMonths",
      key: "DurationMonths",
    },
    {
      title: "Description",
      dataIndex: "Description",
      key: "Description",
    },
    {
      title: "IsActive",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive) => (isActive ? "Đang hoạt động" : "Không hoạt động"),
    },
    {
      title: "CreatedTime",
      dataIndex: "CreatedTime",
      key: "CreatedTime",
    },
    {
      title: "IsDeleted",
      dataIndex: "isDeleted",
      key: "isDeleted",
      render: (isDeleted) => (isDeleted ? "Đã xóa" : "Chưa xóa"),
    },
    {
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      render: (avatar) => <Image src={avatar} width={100} />,
    },
    {
      title: "Action",
      dataIndex: "PlanID",
      key: "PlanID",
      render: (PlanID, subscription) => {
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true);
                form.setFieldsValue(subscription); // lấy các giá trị det ngược lại lên form
              }}
            >
              Update
            </Button>
            <Popconfirm
              title="Delete the subscription"
              description="Are you sure to delete this subscription?"
              onConfirm={() => handleDeleteSubscription(PlanID)}
            >
              <Button danger type="primary">
                Delete
              </Button>
            </Popconfirm>
          </>
        );
      },
    },
  ];
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  const handleDeleteSubscription = async (PlanID) => {
    await axios.delete(
      `https://67a3896d31d0d3a6b783e6ab.mockapi.io/Subcription/${PlanID}`
    );
    toast.success("Successfully delete subscription!");
    fetchSubcription(); // xóa laf nó phải biên mất khỏi table
  };
  //lấy dữ liệu về
  const fetchSubcription = async () => {
    // tạo ra 1 hành động sử lý việc lấy danh sách các gói phí thành viên
    // xuống be lấy sanh sách student
    // dùng axios call api tương tác vs be
    // gọi hành động lấy dữ liệu này laf promise hứa -> chưa chắc đã làm-> bất đồng bộ

    const response = await axios.get(
      "https://67a3896d31d0d3a6b783e6ab.mockapi.io/Subcription"
    );
    console.log(response.data);
    setSubcriptionList(response.data);
  };
  // event => chạy lhi page vừa load lên
  useEffect(() => {
    fetchSubcription(); // mỗi lần chạy sẽ lấy danh các gói
  }, []);
  const handleOpenModal = () => {
    form.resetFields();
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleSubmitForm = async (values) => {
    console.log(values);
    if (values.avatar) {
      const url = await uploadFile(values.avatar.file.originFileObj);
      values.avatar = url;
    }
    if (values.PlanID) {
      // update
      await axios.put(
        `https://67a3896d31d0d3a6b783e6ab.mockapi.io/Subcription/${values.PlanID}`,
        values
      );
      toast.success("Successfully update subscription!");
    } else {
      //create
      await axios.post(
        "https://67a3896d31d0d3a6b783e6ab.mockapi.io/Subcription",
        values
      );
      toast.success("Successfully create new student");
    }

    handleCloseModal(); // đóng Modal
    fetchSubcription(); // lấy lại danh sách mới lên
  };
  return (
    <div>
      <ToastContainer />
      <h1>Subcription Management</h1>
      <Button onClick={handleOpenModal}>Add new subcription</Button>
      <Table dataSource={subcriptionList} columns={columns} rowKey="PlanID" />;
      <Modal
        title="Create new subscription"
        open={isOpen}
        onClose={handleCloseModal}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmitForm}
        >
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
          <FormItem label="Id" name="PlanID" hidden>
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
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
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
            initialValue={false}
            rules={[
              {
                required: true,
                message: "isDeleted can not be empty",
              },
            ]}
          >
            <Select>
              <Option value={true}>Active</Option>
              <Option value={false}>Inactive</Option>
            </Select>
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
        </Form>
      </Modal>
      {previewImage && (
        <Image
          wrapperStyle={{
            display: "none",
          }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
};
export default SubcriptionManagement;
