import React from "react";
import { Table, Checkbox } from "antd";
import "./styles.css"; // For custom styling

const CustomTable = (props) => {
  return (
    <Table
      columns={props.columns}
      dataSource={props.data}
      pagination={false}
      bordered={false}
      // className="table-row-dark"
      rowClassName={(record, index) =>
        index % 2 === 1 ? "table-row-dark" : "table-row-light"
      }
      // title={() => "Table #8"}
    />
  );
};

export default CustomTable;
