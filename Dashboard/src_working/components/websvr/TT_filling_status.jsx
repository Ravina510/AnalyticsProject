import React, { useEffect, useState } from "react";
import { Line } from "@ant-design/plots";
import Axios from "axios";
import AnalyticAxios from "../../Axios/Axios";
const TT_filling_status = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // Axios.get(
    //   `http:///${window.location.hostname}:3005/TTFillingStatus/${fromdate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/LineChart/TTFillingStatus/${fromdate}`)
    .then((result) => {
      setData(result.data.recordset);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };
  //

  const getData = async () => {
    // await Axios.get(
    //   `http:///${window.location.hostname}:3005/TTFillingStatus/${fromdate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/LineChart/TTFillingStatus/${fromdate}`)
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
    }, 60000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  const config = {
    data,
    xField: "TimeInterval",
    yField: "Loadid",
    seriesField: "Series",

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
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>TT Filling Pattern</strong>
      </span>
      <div
        style={{
          paddingTop: "10px",
          border: "10px",
          height: "220px",
          width: "550px",
          paddingLeft: "3rem",
        }}
      >
        <Line {...config} />
      </div>
      {/* <div style={{position:"relative",left:'8rem',fontSize:'10px'}}>Details</div> */}
    </div>
  );
};
export default TT_filling_status;
