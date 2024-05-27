import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import Axios from "axios";
import "./web.scss";
import AnalyticAxios from "../../Axios/Axios";
// import { DarkModeContext } from "../../context/darkModeContext";
// import { useContext } from "react";
// import "../../style/dark.scss";

const Bay_Wise_Loading_Details_New1 = (props) => {
  const [data, setData] = useState([]);
  // const { darkMode } = useContext(DarkModeContext);
  const fromdate = props.fromdate;
  const borderRadius = props.borderRadius || 0;
  //default date part
  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // Axios.get(
    //   `http:///${window.location.hostname}:3005/GraphData_UI_BayWiseLoadingDetails/${fromdate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/ColumnChart/GraphData_UI_BayWiseLoadingDetails/${fromdate}`)
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
    //   `http:///${window.location.hostname}:3005/GraphData_UI_BayWiseLoadingDetails/${fromdate}`
    // ).then((result) => {
    //   // console.log(result.data.recordset,"results");
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/ColumnChart/GraphData_UI_BayWiseLoadingDetails/${fromdate}`)
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
      //console.log("Fetching Agian")
    }, 180000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  const config = {
    data,
    isGroup: true,

    xField: "Bay",
    yField: "Quantity_KL",
    seriesField: "Product",

    // color: ['#0000ff', '#ff8040', '#808080', '#FFFF00'],

    color: data.map((products) =>
      products.Product.includes("HSD")
        ? "#0000ff"
        : products.Product.includes("MS")
        ? "#ff8040"
        : products.Product.includes("SKO")
        ? "#ffe100"
        : products.Product.includes("ATF")
        ? "#b7b7b7" : "#ffffff"
    ),
    groupField: "Product",
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
        text: "Qty (KL)",
      },
    },

    meta: {
      value: {
        min: 50,
        max: 100,
      },
    },
  };

  return (
    //
    // <div className={darkMode ? "app dark" : "app"}>
    <div
      className="Analytics"
      style={{
        borderRadius: borderRadius ? borderRadius : 0,
      }}
    >
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Bay Wise Loading Details</strong>
      </span>
      <div style={{ height: "52rem" }}>
        <Column {...config} />
      </div>
    </div>
    // </div>
  );
};
export default Bay_Wise_Loading_Details_New1;