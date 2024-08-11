import React, { useState } from "react";
import "./styles.css";
import ConvertToOriginalFormat from "../src/DateConverter";
import CustomTables from "../src/TableComponent";
import { Input, Table, Select, DatePicker } from "antd";
import { SearchOutlined, CalendarOutlined } from "@ant-design/icons";

const { Option } = Select;

const SearchFilterComponent = ({ data }) => {
  const [searchInput, setSearchInput] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [isDateMode, setIsDateMode] = useState(false);
  const [myOption, setMyOptions] = useState([]);

  const handleSelect = (value) => {
    const [companyName, description] = value.split("||");

    const selectedItem = data.find(
      (item) =>
        item &&
        item.companyName === companyName &&
        item.description === description
    );

    if (
      selectedItem &&
      !selectedFilters.some((item) => item && item.companyName === companyName)
    ) {
      setSelectedFilters([...selectedFilters, selectedItem]);
      setFilteredItems([]);
      setSearchInput([]);
      setMyOptions([]);
    }
  };

  const handleDeselect = (value) => {
    const [companyName] = value.split("||");
    setSelectedFilters(
      selectedFilters.filter((item) => item.companyName !== companyName)
    );
    // setSearchInput([]);
    setMyOptions([]);
    setSearchInput([]);
  };

  const handleDateChange = (date, dateString) => {
    handleSearchChange(dateString);
  };

  const handleInputChange = (value) => {
    const isNumeric = /^\d+$/.test(value.replace(/-/g, ""));
    setIsDateMode(isNumeric);
    handleSearchChange(value);
  };

  const columns = [
    { title: "Company Name", dataIndex: "companyName", key: "companyName" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Details", dataIndex: "details", key: "details" },
    { title: "Last Checked", dataIndex: "lastChecked", key: "lastChecked" },
    { title: "Performance", dataIndex: "performance", key: "performance" },
    { title: "Status", dataIndex: "status", key: "status" },
    { title: "Website", dataIndex: "website", key: "website" },
  ];

  const isNumeric = /^\d+$/.test(searchInput);

  const handleSearchChange = (Input) => {
    setSearchInput(Input);

    const formatDate = ConvertToOriginalFormat(Input);

    const ListItems = data.filter((item) => {
      const lowerInput = Input.toLowerCase();
      const ItemNameDesc =
        item.companyName.toLowerCase() + "~" + item.description.toLowerCase();
      console.log(ItemNameDesc.includes(lowerInput));

      return (
        item.lastChecked === formatDate ||
        item.companyName.toLowerCase().includes(lowerInput) ||
        item.description.toLowerCase().startsWith(lowerInput) ||
        ItemNameDesc.includes(lowerInput)
      );
    });

    if (Input === "") {
      setFilteredItems([]);
    } else {
      console.log(ListItems);
      setFilteredItems(ListItems);
    }
    setMyOptions(ListItems);
  };

  return (
    <div>
      <div></div>
      <div style={{ marginBottom: "10px" }}>
        <Select
          className="inputField"
          mode="multiple"
          style={{ width: "100%" }}
          placeholder={isDateMode ? "Select Date" : "Search companies"}
          value={
            isDateMode
              ? searchInput
              : selectedFilters
                  .filter((item) => item && item.companyName) // Safeguard against undefined
                  .map((item) => `${item.companyName}`)
          }
          onSelect={handleSelect}
          onDeselect={handleDeselect}
          onSearch={handleInputChange}
          dropdownRender={(menu) => (
            <div>
              {isDateMode ? (
                <DatePicker
                  style={{ width: "100%" }}
                  onChange={handleDateChange}
                  value={selectedFilters.map((item) => item.lastChecked)}
                  format="YYYY-MM-DD"
                  placeholder="Select Date"
                />
              ) : (
                <div style={{ marginTop: "8px" }}>{menu}</div>
              )}
            </div>
          )}
          options={
            !isDateMode
              ? filteredItems.map((item) => ({
                  label: `${item.companyName} (${item.description})`,
                  value: `${item.companyName}||${item.description}`,
                }))
              : myOption
          }
        />
      </div>

      <div style={{ marginTop: "10px" }}>
        <h4 style={{ color: "white" }}>Selected Filters:</h4>
        <Table
          columns={columns}
          dataSource={isDateMode ? myOption : selectedFilters}
          rowKey="companyName"
          pagination={false}
        />
      </div>
    </div>
  );
};

export default SearchFilterComponent;
