import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import Axios from "axios";
import "./Visibility.scss";

import { useLocation, useNavigate } from "react-router-dom";

const Utilization_TLF = (props) => {
  const [data, setData] = useState([]);
  const { state } = useLocation();
  const navigate = useNavigate();

  const getData = () => {
    Axios.get(`http://${window.location.hostname}:3005/Utilization_TLF`).then(
      (result) => {
        const newData = result.data.recordsets.filter(
          (graph) => graph.length > 0
        );
        console.log("tlf", newData)
        setData(newData);
      }
    );
  };

  useEffect(() => {
    getData();
  }, []);

  const getProductName = (Entitycategory) => {
    switch (Entitycategory) {
      case 1:
        return "MS";
      case 2:
        return "HSD";
      case 3:
        return "ETHANOL";
      default:
        return "Unknown Product";
    }
  };

  const config = (index) => {
    return {
      data: data[index],
      angleField: "Percentage",
      colorField: "LPNo",

      radius: 0.6,
      label: {
        type: "outer",
        content: (item) => `${item.LPNo}: ${item.Percentage}%`,
      },
      interactions: [
        {
          type: "element-active",
        },
      ],
    };
  };

  return (
    <div className="Analytics">
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          fontWeight: "bold",
          fontSize: "1.5rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {state.PageTitle}
        </h3>
      </div>

      <div className="charts-container" >
        {data.map((graph, index) => (
          <div className="chart-wrapper" key={index} style={{
            width: "38%",
            borderStyle: "solid",
            borderWidth: "3px",
            borderColor: "black",
          }}>
            <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {getProductName(index + 1)}
            </p>
            <Pie {...config(index)} />
          </div>
        ))}
      </div>

    </div>
  );
};
export default Utilization_TLF;
