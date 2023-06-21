import { Table, Empty, Button } from "antd";
import { TableComponentProps } from "./interfaces";
import "./index.scss";

const TableComponent = ({
  columns,
  dataSource,
  classname,
}: TableComponentProps) => {
  const renderEmpty = () => (
    <Empty description="No tokens deployed">
      {classname === "deployed-token-table" && (
        <Button type="primary">Deploy Now</Button>
      )}
    </Empty>
  );

  return (
    <div>
      {dataSource.length ? (
        <Table
          dataSource={dataSource}
          columns={columns}
          scroll={{ x: true, y: 220 }}
          pagination={false}
          className={classname}
        />
      ) : (
        <Table
          dataSource={dataSource}
          columns={columns}
          locale={{ emptyText: renderEmpty() }}
          pagination={false}
          className={classname}
        />
      )}
    </div>
  );
};

export default TableComponent;
