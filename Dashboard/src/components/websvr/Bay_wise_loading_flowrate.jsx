import { Column } from "@ant-design/plots";
import Axios from "axios";
import React, { useEffect, useState } from "react";

const Bay_wise_loading_flowrate = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    Axios.get(
      `http:///${window.location.hostname}:3005/BayWiseLoadingFlowRate/${fromdate}`
    ).then((result) => {
      // console.log(result.data.recordset);
      setData(result.data.recordset);
    });
  };

  const getData = async () => {
    await Axios.get(
      `http:///${window.location.hostname}:3005/BayWiseLoadingFlowRate/${fromdate}`
    ).then((result) => {
      //console.log(result.data.recordset);
      setData(result.data.recordset);
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
  console.log(data,"Bay_wise_loading_flowrate" )
  const config = {
    data,
    xField: "Bay",
    yField: "LPM",
    seriesField: "Product",
    isGroup: true,
    color: (products) =>
    // console.log(products),
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
    // color: data.map((products) =>
    //   products.Product.includes("HSD")
    //     ? "#0000ff"
    //     : products.Product.includes("MS")
    //     ? "#ff8040"
    //     : products.Product.includes("SKO")
    //     ? "#ffe100"
    //     : products.Product.includes("ATF")
    //     ? "#b7b7b7" : "#ffffff"
    // ),
    xAxis: {
      label: {
        rotate: true,
        offsetX: 15,
      },
      title: {
        text: "Bays",
      },
    },
    yAxis: {
      title: {
        text: "LPM",
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
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Average Bay Wise Loading Flow Rate (LPM)</strong>
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
      {/* <div style={{position:"relative",left:'8rem',fontSize:'10px'}}><a href='/Bay_wise_loading_flowrate'>Details</a></div> */}
    </div>
  );
};

export default Bay_wise_loading_flowrate;
// 	TASAnalytics	Database	SERVER0A\Experionadmin
