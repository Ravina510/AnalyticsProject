import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import Axios from "axios";
import AnalyticAxios from "../../Axios/Axios";
const Avg_filling_qty = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // Axios.get(
    //   `http:///${window.location.hostname}:3005/AvgFillingQtyWise/${fromdate}`
    // ).then((result) => {
    //   //console.log(result.data.recordset);
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/ColumnChart/AvgFillingQtyWise/${fromdate}`)
    .then((result) => {
      setData(result.data.recordset);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  const getData = async () => {
    // await Axios.get(
    //   `http:///${window.location.hostname}:3005/AvgFillingQtyWise/${fromdate}`
    // ).then((result) => {
    //   //console.log(result.data.recordset);
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/ColumnChart/AvgFillingQtyWise/${fromdate}`)
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
    //isGroup: true,
    xField: "Bay",
    yField: "KL/Hr",
    color: "#b392ac",

    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
      title: {
        text: "Bays",
      },
    },
    yAxis: {
      title: {
        text: "KL/Hr",
      },
    },
  };

  return (
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Average Filling Quantity Wise (KL/Hr)</strong>
      </span>
      <div
        style={{
          paddingTop: "10px",
          border: "10px",
          height: "220px",
          width: "500px",
          paddingLeft: "3rem",
        }}
      >
        <Column {...config} />
      </div>
      {/* <div style={{position:"relative",left:'8rem',fontSize:'10px'}}><a href="/Avg_filling_qty">Details</a></div> */}
    </div> //
  );
};
export default Avg_filling_qty;
