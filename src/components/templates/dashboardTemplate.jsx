import React, { useEffect, useState } from "react";
import { Button, Form, Input, Modal, Popconfirm, Table, Upload } from "antd";
import api from "../../config/axios";
import FormItem from "antd/es/form/FormItem";

function DashboardTemplate({ title, columns, uri, formItems }) {
  const [newColumns, setNewColumns] = useState(columns);
  const [isOpen, setOpen] = useState(false); // mặc định Modal đóng
  const [form] = Form.useForm();
  const [data, setData] = useState([]);

  useEffect(() => {
    const tableColumns = [
      ...columns,
      ...[
        {
          title: "Action",
          dataIndex: "PlanID",
          key: "PlanID",
          render: (PlanID, record) => {
            return (
              <>
                <Button
                  type="primary"
                  onClick={() => {
                    setOpen(true);
                    // form.setFieldsValue(subscription); // lấy các giá trị det ngược lại lên form
                    // if (subscription.avatar) {
                    //   setFileList([
                    //     {
                    //       name: "image.png",
                    //       status: "done",
                    //       url: subscription.avatar,
                    //     },
                    //   ]);
                    // }
                  }}
                >
                  Update
                </Button>
                <Popconfirm
                  title={`Delete the ${title}`}
                  description={`Are you sure to delete this ${title}?`}
                  onConfirm={() => console.log("delete")}
                >
                  <Button danger type="primary">
                    Delete
                  </Button>
                </Popconfirm>
              </>
            );
          },
        },
      ],
    ];
    setNewColumns(tableColumns);
  }, [newColumns]);
  const fetchData = async () => {
    const response = await api.get(`${uri}`);
    setData(response.data);
    console.log(response.data);
  };
  useEffect(() => {
    fetchData();
  }, []);
  const handleOpenModal = () => {
    form.resetFields();
    setOpen(true);
  };
  const handleCloseModal = () => {
    setOpen(false);
  };
  const handleSubmitForm = () => {};
  return (
    <div>
      <Button onClick={handleOpenModal} type="primary">
        Create {title}
      </Button>
      <Table columns={newColumns} dataSource={data} />;
      <Modal
        title={`Create new ${title}`}
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
          <FormItem label="Id" name="PlanID" hidden>
            <Input />
          </FormItem>
          {formItems}
        </Form>
      </Modal>
    </div>
  );
}

export default DashboardTemplate;
