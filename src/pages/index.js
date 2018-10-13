import { Card, Button, Divider, Input, Icon, Table } from "antd";
import history from "umi/router";
import Link from "umi/link";
import CustomButton from "../components/CustomButton";
import Setting from "../components/Setting";
import styles from "./index.module.less";

const TableDemo = () => {
  const dataSource = [
    {
      key: "1",
      name: "胡彦斌",
      age: 32,
      address: "西湖区湖底公园1号"
    },
    {
      key: "2",
      name: "胡彦祖",
      age: 42,
      address: "西湖区湖底公园1号"
    }
  ];

  const columns = [
    {
      title: "姓名",
      dataIndex: "name",
      key: "name"
    },
    {
      title: "年龄",
      dataIndex: "age",
      key: "age"
    },
    {
      title: "住址",
      dataIndex: "address",
      key: "address"
    }
  ];

  return <Table dataSource={dataSource} columns={columns} />;
};

export default () => {
  return (
    <Card>
      <Setting />
      <Divider />

      <CustomButton />

      <Divider />

      <Input
        prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
        placeholder="Username"
      />

      <Divider />

      <Button type="primary">nihao</Button>

      <Divider />
      <TableDemo />
    </Card>
  );
};
