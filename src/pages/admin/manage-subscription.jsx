import React, { useEffect, useState } from "react";
import {
  createProduct,
  deleteProduct,
  getProduct,
  updateProduct,
} from "../../services/api.subscription";
import { Button, Form, Input, Modal, Popconfirm, Select, Table } from "antd";

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
    // lấy ra được 2 fill trong swagger
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
    {
      title: "Price", // này thì tự đặt
      dataIndex: "price", // này phải để chính xác cái be trả về
      key: "price", // này cũng phải giống be
    },
    {
      title: "Quantity", // này thì tự đặt
      dataIndex: "quantity", // này phải để chính xác cái be trả về
      key: "quantity", // này cũng phải giống be
    },
    // cần thêm 2 cái action
    {
      title: "Action",
      dataIndex: "id",
      key: "id",
      render: (id, record) => {
        // record là dữ liệu nó trả về từng cái data trên từng hàng
        return (
          <>
            <Button
              type="primary"
              onClick={() => {
                setOpen(true); // mở Modal khi nhấn Update
                // data sẽ đỗ lên từng fill
                // cái record trả về object cuar catagori chứ không phải là 1 id
                form.setFieldsValue({
                  ...record,
                  categoryID: record?.categories
                    ? record?.categories?.map((item) => item.id)
                    : [],
                }); // sử lý để fill categoriId đươc đổ ra
              }}
            >
              Update
            </Button>
            <Popconfirm
              title="Delete the product"
              description="Are you sure to delete this product?"
              onConfirm={() => handleDeleteProduct(id)}
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
  const handleDeleteProduct = async (id) => {
    const response = await deleteProduct(id);
    if (response) {
      fetchProduct(); // khi xóa xong gọi lại để refre lại table
    }
  };
  const handleSubmit = async (formValues) => {
    formValues.image = "123"; // này set đại Image chưa chính xác
    // có id thì update ngược laij không có là post
    if (formValues.id) {
      const response = await updateProduct({
        id: formValues.id,
        product: formValues,
      });
      console.log(response);
      toast.success("Successfully update product"); // hiển thị thông báo thành công
    } else {
      const response = await createProduct(formValues);
      toast.success("Successfull create new product"); // hiển thị thông báo thành công
    }

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
      {/* <Table dataSource={products} columns={columns} /> */}
      {/*Cái table này là hiển thị tất cả các sản phẩm chưa xóa và đã xóa */}
      {/*Giờ mình cập nhật thêm tại delete be phải làm ko dc delete hẵn trên database */}
      {/*Modal này có hai trang thái mở lên và ẩn đi */}
      <Table
        dataSource={products.filter((product) => !product.deleted)} // đây là lọc lấy những thằng chưa bị xóa
        columns={columns}
      />
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
          <Form.Item label="Id" name="id" hidden>
            {" "}
            {/*Dòng này để biết mình đang muốn update thằng nào */}
            <Input />
          </Form.Item>
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
