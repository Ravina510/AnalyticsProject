import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import Axios from "axios";
import AnalyticAxios from "../../Axios/Axios";
const Product_wise_loading_qty = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // Axios.get(
    //   `http:///${window.location.hostname}:3005/ProductWiseLoadedQty/${fromdate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/PieChart/ProductWiseLoadedQty/${fromdate}`)
    .then((result) => {
      setData(result.data.recordset);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  const getData = async () => {
    // await Axios.get(
    //   `http:///${window.location.hostname}:3005/ProductWiseLoadedQty/${fromdate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/PieChart/ProductWiseLoadedQty/${fromdate}`)
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

  //

  const config = {
    appendPadding: 10,
    data,
    angleField: "Quantity",
    colorField: "Product",

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
    radius: 0.9,
    label: {
      type: "outer",
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  return (
    <div className="Analytics">
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Product Wise Loaded Quantity (KL)</strong>
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
        <Pie {...config} />
      </div>
      {/* <div style={{fontSize:'10px',paddingLeft:'15rem'}}><a href="Product_wise_loading_qty">Details</a></div> */}
    </div>
    //Product_wise_loading_qty
  );
};

export default Product_wise_loading_qty;
