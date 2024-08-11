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
    // console.log(value, "++++");
    const [companyName, description, lastChecked] = value.split("||");

    const ListItems = data
      .filter((item) => item.companyName === companyName)
      .map((filtereditems) => {
        return {
          ...filtereditems,
        };
      });
    const selectedItem = ListItems.find(
      (item) =>
        item &&
        item.companyName === companyName &&
        item.description === description
    );
    // console.log(selectedItem);
    // if (
    //   selectedItem &&
    //   !selectedFilters.some((item) => item && item.companyName === companyName)
    // ) {
    setSelectedFilters([...selectedFilters, ...ListItems]);
    // console.log(selectedItem);
    setFilteredItems([]);
    setSearchInput([]);
    // setIsInputChange(true);
    // setMyOptions([]);
    // }
  };

  const handleDeselect = (value) => {
    const [companyName] = value.split("||");
    setSelectedFilters(
      selectedFilters.filter((item) => item.companyName !== companyName)
    );
    // setSearchInput([]);
    // setSelectedFilters([]);
    setMyOptions([]);
    setSearchInput([]);
  };

  const handleDateChange = (date, dateString) => {
    handleSearchChange(dateString);
    // setIsInputChange(true);
    // setMyOptions([]);
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
    const uniqueItems = Array.from(
      new Map(data.map((item) => [item.companyName, item])).values()
    );
    if (!isDateMode) {
      const ListItems = uniqueItems.filter((item) => {
        const lowerInput = Input.toLowerCase();
        const ItemNameDesc =
          item.companyName.toLowerCase() + "~" + item.description.toLowerCase();
        return (
          item.companyName.toLowerCase().includes(lowerInput) ||
          item.description.toLowerCase().startsWith(lowerInput) ||
          ItemNameDesc.includes(lowerInput)
        );
      });
      if (Input === "") {
        setFilteredItems([]);
        setMyOptions([]);
        setSelectedFilters([]);
      } else {
        setFilteredItems(ListItems);
      }
    } else {
      const ListsItems = data.filter((item) => {
        return item.lastChecked === formatDate;
      });

      setMyOptions(ListsItems);
    }
  };
  console.log(myOption);
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
              : Array.from(
                  new Set(
                    selectedFilters
                      .filter((item) => item && item.companyName) // Safeguard against undefined
                      .map((item) => `${item.companyName}`)
                  )
                )
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
                  value: `${item.companyName}||${item.description}||${item.lastChecked}`,
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
