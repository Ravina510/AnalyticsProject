import React, { useState, useEffect } from "react";
import Axios from "axios";
import { Pie } from "@ant-design/plots";
import { FormatBold } from "@mui/icons-material";

const Bay_ops_timing = (props) => {
  const [data, setData] = useState([]);
  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    Axios.get(
      `http:///${window.location.hostname}:3005/BayOpsTiming/${fromdate}`
    ).then((result) => {
      // let Time = result.data.recordset[0].BayOpsHour;
      // const Timediff = (Time * 100) / 24;
      setData(result.data.recordset);
    });
  };

  const getData = async () => {
    await Axios.get(
      `http:///${window.location.hostname}:3005/BayOpsTiming/${fromdate}`
    ).then((result) => {
      // let Time = result.data.recordset[0].BayOpsHour;
      // const Timediff = (Time * 100) / 24;
      setData(result.data.recordset);
    });
  };

  useEffect(() => {
    getDate();
    if (!props.fromdate) return;
    getData();

    const intervalValue = setInterval(() => {
      getData();
    }, 60000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  const config = {
    appendPadding: 10,
    data,
    angleField: "Value",
    colorField: "Title",
    color: ["#854576", "#adb5bd"],
    radius: 0.9,
    innerRadius: 0.6,
    legend: {
      // position: "top",
      flipPage: false,
      Text: "Bold",
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
  //#adb5bd
  return (
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Bay Operation Timing</strong>
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
        <Pie {...config} />
      </div>
    </div>
  );
};
export default Bay_ops_timing;
