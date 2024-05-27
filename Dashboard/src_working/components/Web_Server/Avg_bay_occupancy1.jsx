import React, { useState, useEffect } from "react";
import { Gauge } from "@ant-design/plots";
import Axios from "axios";
import AnalyticAxios from "../../Axios/Axios";
const Avg_bay_occupancy1 = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;
  const borderRadius = props.borderRadius || 0;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // Axios.get(
    //   `http://${window.location.hostname}:3005/AvgBayOccupancyTime/${fromdate}`
    // ).then((result) => {
    //   const value1 = new Set(result.data.recordset.map((a) => a.AvgBayOcc));
    //   const FinalPercent = [...value1].map((a) => a);
    //   setData(FinalPercent);
    // });
    AnalyticAxios.get(`/api/GuageChart/AvgBayOccupancyTime/${fromdate}`)
    .then((result) => {
       const value1 = new Set(result.data.recordset.map((a) => a.AvgBayOcc));
      const FinalPercent = [...value1].map((a) => a);
      setData(FinalPercent);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  const getData = async () => {
    // await Axios.get(
    //   `http://${window.location.hostname}:3005/AvgBayOccupancyTime/${fromdate}`
    // ).then((result) => {
    //   const value1 = new Set(result.data.recordset.map((a) => a.AvgBayOcc));
    //   const FinalPercent = [...value1].map((a) => a);
    //   setData(FinalPercent);
    // });
    AnalyticAxios.get(`/api/GuageChart/AvgBayOccupancyTime/${fromdate}`)
    .then((result) => {
     const value1 = new Set(result.data.recordset.map((a) => a.AvgBayOcc));
      const FinalPercent = [...value1].map((a) => a);
      setData(FinalPercent);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  useEffect(() => {
    getDate();
    if (!props.fromdate) return;
    getData();
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
    <div
      className="Analytics"
      style={{
        borderRadius: borderRadius ? borderRadius : 0,
      }}
    >
      <span style={{ textAlign: "center" }}>
        <strong>Average Bay Utilization (%)</strong>
      </span>
      <div style={{ height: "52rem" }}>
        <Gauge {...config} />
      </div>
    </div>
  );
};
export default Avg_bay_occupancy1;
