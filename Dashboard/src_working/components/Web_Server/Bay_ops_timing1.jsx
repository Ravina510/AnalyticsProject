import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Pie } from "@ant-design/plots";
import { FormatBold } from "@mui/icons-material";
import AnalyticAxios from "../../Axios/Axios";
const Bay_ops_timing1 = (props) => {
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
    //   `http:///${window.location.hostname}:3005/BayOpsTiming/${fromdate}`
    // ).then((result) => {
    //   // let Time = result.data.recordset[0].BayOpsHour;
    //   // const Timediff = (Time * 100) / 24;
    //   setData(result.data.recordset);
    // });

    AnalyticAxios.get(`/api/PieChart/BayOpsTiming/${fromdate}`)
    .then((result) => {
     // let Time = result.data.recordset[0].BayOpsHour;
      // const Timediff = (Time * 100) / 24;
      setData(result.data.recordset);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  const getData = async () => {
    // await Axios.get(
    //   `http:///${window.location.hostname}:3005/BayOpsTiming/${fromdate}`
    // ).then((result) => {
    //   // let Time = result.data.recordset[0].BayOpsHour;
    //   // const Timediff = (Time * 100) / 24;
    //   // console.log(result.data.recordset);
    //   setData(result.data.recordset);
    // });

    AnalyticAxios.get(`/api/PieChart/BayOpsTiming/${fromdate}`)
    .then((result) => {
      setData(result.data.recordset);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  useEffect(() => {
    getDate();
    if (!props.fromdate) return;
    getData();

    const intervalValue = setInterval(() => {
      getData();
    }, 180000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  const config = {
    appendPadding: 10,
    data,
    angleField: "Value",
    colorField: "Title",
    color: ["#854576", "#adb5bd"],
    radius: 0.9,
    innerRadius: 0.7,
    legend: {
      // position: "top",
      flipPage: false,
      Text: "bold",
    },

    label: {
      type: "inner",
      offset: "-50%",
      content: "{value}",
      style: {
        textAlign: "center",
        fontSize: 14,
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
        {" "}
        <strong>Bay Ops Timing</strong>
      </span>
      <div style={{ height: "52rem" }}>
        <Pie {...config} />
      </div>
    </div>
  );
};
export default Bay_ops_timing1;
