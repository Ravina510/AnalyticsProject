import React, { useEffect, useState } from "react";
import { Pie } from "@ant-design/plots";
import Axios from "axios";
import "./Visibility.scss";

import { useLocation, useNavigate } from "react-router-dom";

const Utilization_BG = (props) => {
  const [data, setData] = useState([]);
  const [heading, setHeading] = useState(" ");
  const { state } = useLocation();
  const navigate = useNavigate();

  const getData = () => {
    Axios.get(
      `http://${window.location.hostname}:3005/Utilization_BG`
    ).then((result) => {
      //   const title1 = result.data.recordsets[0][0].EntityType;

      let title1 = "";
      for (let i = 0; i < result.data.recordsets.length; i++) {
        if (
          result.data.recordsets[i].length > 0 &&
          result.data.recordsets[i][0].EntityType
        ) {
          title1 = result.data.recordsets[i][0].EntityType;
          console.log("title1", title1);
          continue;
        }
      }

      setHeading(title1);

      const newData = result.data.recordsets.map((graph) => graph);
      setData(newData);
    });
  };

  useEffect(() => {
    getData();
  }, []);

  const getProductName = (index) => {
    switch (index) {
      case 1:
        return "% TLF BG IN Utilization";
      case 2:
        return "% TLF BG OUT Utilization";
      default:
        return "";
    }
  };

  const config = (index) => {
    return {
      data: data[index],
      angleField: "Percentage",
      colorField: "EntityName",

      radius: 0.8,

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

      <div className="charts-container">
        {data.map((graph, index) => (
          <div
            className="chart-wrapper"
            key={index}
            style={{
              // padding: "50px",
              borderStyle: "solid",
              borderWidth: "3px",
              borderColor: "black",
            }}
          >
            <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>
              {/* <div> % {heading} Utilization</div> */}
              {getProductName(index + 1)}
            </div>
            <Pie {...config(index)} />
          </div>
        ))}
      </div>
    </div>
  );
};
export default Utilization_BG;
