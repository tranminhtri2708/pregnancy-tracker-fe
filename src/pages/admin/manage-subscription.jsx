import React, { useEffect, useState } from "react";
import { createProduct, getProduct } from "../../services/api.subscription";
import { Button, Form, Input, Modal, Select, Table } from "antd";
import FormItem from "antd/es/form/FormItem";
import { getCategories } from "../../services/api.category";
import { useForm } from "antd/es/form/Form";
import { toast } from "react-toastify";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false); // lưu trang thái biến Modal
  const [form] = useForm();
  //CRUD
  const fetchProduct = async () => {
    const data = await getProduct();
    setProducts(data); //
  };
  const fetchCategories = async () => {
    const data = await getCategories();
    setCategories(data); //
  };
  //get product được sài nhiều chỗ, nhiều lần và dùng nguyên tắc DRY
  useEffect(() => {
    fetchProduct();
    fetchCategories();
  }, []);
  const columns = [
    // muốn hiển thị bao nhiêu cột thì thêm bấy nhiêu column dưaj vào be
    {
      title: "Name",
      dataIndex: "name", // này phải để chính xác cái be trả về
      key: "name", // này cũng phải giống be
    },
    {
      title: "Description", // này thì tự đặt
      dataIndex: "description", // này phải để chính xác cái be trả về
      key: "description", // này cũng phải giống be
    },
  ];
  const handleSubmit = async (formValues) => {
    formValues.image = "123"; // này set đại Image chưa chính xác
    const response = await createProduct(formValues);
    toast.success("Successfull"); // hiển thị thông báo thành công
    setOpen(false); // tắt modal
    form.resetFields(); // xóa dự liệu bắt đầu lại từ đầu
    fetchProduct();
  }; // khi mình bấm submit thì dữ liệu phải collect thành một cục

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setOpen(true); // khi click vào button này sẽ setOpen là true modal mở
        }}
      >
        Create new product
      </Button>
      <Table dataSource={products} columns={columns} />
      {/*Modal này có hai trang thái mở lên và ẩn đi */}
      <Modal
        title="Product"
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => form.submit()}
      >
        <Form
          labelCol={{
            span: 24,
          }}
          form={form}
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: "Name is required!",
              },
              {
                min: 3,
                message: "Name must be at least 3 characters!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label="Price" name="price" required>
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[
              {
                required: true,
                message: "Quantity is required!",
              },
            ]}
          >
            <Input type="number" />
          </Form.Item>

          <Form.Item
            label="Category ID"
            name="categoryID"
            rules={[
              {
                required: true,
                message: "At least one category must be selected!",
              },
            ]}
          >
            <Select mode="multiple">
              {categories.map((category) => (
                <Select.Option value={category.id} key={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[
              {
                required: true,
                message: "Description is required!",
              },
              {
                min: 5,
                message: "Description must be at least 5 characters!",
              },
            ]}
          >
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default ManageProduct;
