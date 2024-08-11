import "./styles.css";
import React, { useState, useEffect } from "react";
import SearchFilterComponent from "./Filter";

export default function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://demo-backend.durbin.co.in/get-all-dashboard-data"
        );
        const result = await response.json();
        setData(result.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="App">
      <SearchFilterComponent data={data} />
    </div>
  );
}
