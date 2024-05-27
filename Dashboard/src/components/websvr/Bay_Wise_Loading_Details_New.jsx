import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import Axios from "axios";
import "./web.scss";

// import { DarkModeContext } from "../../context/darkModeContext";
// import { useContext } from "react";
// import "../../style/dark.scss";

const Bay_Wise_Loading_Details_New = (props) => {
  const [data, setData] = useState([]);
  // const { darkMode } = useContext(DarkModeContext);
  const fromdate = props.fromdate;

  //default date part
  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    Axios.get(
      `http:///${window.location.hostname}:3005/GraphData_UI_BayWiseLoadingDetails/${fromdate}`
    ).then((result) => {
      setData(result.data.recordset);
    });
  };
  //

  const getData = async () => {
    await Axios.get(
      `http:///${window.location.hostname}:3005/GraphData_UI_BayWiseLoadingDetails/${fromdate}`
    ).then((result) => {
      // console.log(result.data.recordset,"results");
      setData(result.data.recordset);
      console.log("colour", )
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
  console.log(data,"BayWiseLoadingDetails" )
  const config = {
    data,
    isGroup: true,

    xField: "Bay",
    yField: "Quantity_KL",
    seriesField: "Product",

    // color: ['#0000ff', '#ff8040', '#808080', '#FFFF00'],

    // color: data.map((products) =>
    // {
    //   console.log("product name",products);
    //   return products.Product.includes("HSD")
    //     ? "#0000ff"
    //     : products.Product.includes("MS")
    //     ? "#ff8040"
    //     : products.Product.includes("SKO")
    //     ? "#ffe100"
    //     : products.Product.includes("ATF")
    //     ? "#b7b7b7" : "#ffffff"}
    // ),
    color: (products) =>
    products.Product.includes("HSD")
      ? "#0000FF"
      : products.Product.includes("MS")
      ? "#FF8040"
      : products.Product.includes("SKO")
      ? "#FFFF00"
      : products.Product.includes("ATF")
      ? "#B7B7B7"
      : products.Product.includes("PCK")
      ? "#E1E180"
      : "#000000",    
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
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Bay Wise Loading Details</strong>
      </span>
      <div
        style={{
          paddingTop: "10px",
          border: "10px",
          height: "220px",
          width: "368px",
          paddingLeft: "3rem",
        }}
      >
        <Column {...config} />
      </div>
      <div style={{ position: "relative", left: "8rem", fontSize: "10px" }}>
        {/* <a href="/Bay_Wise_Loading_Details_New">Details</a> */}
      </div>
    </div>
    // </div>
  );
};
export default Bay_Wise_Loading_Details_New;
