import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import Axios from "axios";

const TT_filling_status1 = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;
  const borderRadius = props.borderRadius || 0;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    Axios.get(
      `http:///${window.location.hostname}:3005/TTFillingStatus/${fromdate}`
    ).then((result) => {
      setData(result.data.recordset);
    });
  };
  //

  const getData = async () => {
    await Axios.get(
      `http:///${window.location.hostname}:3005/TTFillingStatus/${fromdate}`
    ).then((result) => {
      setData(result.data.recordset);
    });
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
    data,
    xField: "TimeInterval",
    yField: "Loadid",
    seriesField: "Series",
    point: {
      
    },

    color: ["#1d7d14", "#480ca8"],
    tooltip: {
      shared: true,
    },

    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
      title: {
        text: "Time",
      },
    },
    yAxis: {
      title: {
        text: "No. of TTs",
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
        <strong>TT Filling Status</strong>
      </span>
      <div style={{ height: "52rem" }}>
        <Line {...config} />
      </div>
    </div>
  );
};
export default TT_filling_status1;
