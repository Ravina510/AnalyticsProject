import React, { useState, useEffect } from "react";
import { Gauge } from "@ant-design/plots";
import Axios from "axios";

const Avg_bay_utilized = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    Axios.get(
      `http://${window.location.hostname}:3005/AvgBayUtilizationTime/${fromdate}`
    ).then((result) => {
      const value1 = new Set(result.data.recordset.map((a) => a.AvgPercent));
      const value2 = [...value1].map((a) => a);
      const FinalPercent = value2 / 100;
      setData(FinalPercent);
    });
  };

  const getData = async () => {
    await Axios.get(
      `http://${window.location.hostname}:3005/AvgBayUtilizationTime/${fromdate}`
    ).then((result) => {
      const value1 = new Set(result.data.recordset.map((a) => a.AvgPercent));
      const value2 = [...value1].map((a) => a);
      const FinalPercent = value2 / 100;
      setData(FinalPercent);
    });
  };

  useEffect(() => {
    getDate();
    if (!props.fromdate) return;
    getData();

    const intervalValue = setInterval(() => {
      getData();
      //console.log("Fetching Agian")
    }, 60000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  const config = {
    // data,
    percent: data,
    color: "#b392ac",
    range: {
      color: "l(0) 0:#b392ac 1:#854576",
    },
    startAngle: Math.PI,
    endAngle: 2 * Math.PI,
    indicator: null,
    statistic: {
      title: {
        offsetY: -36,
        style: {
          fontSize: "36px",
          color: "#4B535E",
        },
      },
      content: {
        style: {
          fontSize: "24px",
          lineHeight: "44px",
          color: "#4B535E",
        },
      },
    },
  };
  return (
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Average Bay Occupancy (%)</strong>
      </span>
      <div
        style={{
          paddingTop: "10px",
          border: "10px",
          height: "220px",
          width: "348px",
          paddingLeft: "3rem",
        }}
      >
        <Gauge {...config} />
      </div>
      {/* <div style={{fontSize:'10px',paddingLeft:'15rem'}}>Details</div> */}
    </div>
  );
};
export default Avg_bay_utilized;
