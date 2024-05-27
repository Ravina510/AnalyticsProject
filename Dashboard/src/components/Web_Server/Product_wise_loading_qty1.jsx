import React, { useState, useEffect } from "react";
import { Pie } from "@ant-design/plots";
import Axios from "axios";

const Product_wise_loading_qty1 = (props) => {
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
      `http:///${window.location.hostname}:3005/ProductWiseLoadedQty/${fromdate}`
    ).then((result) => {
      setData(result.data.recordset);
    });
  };

  const getData = async () => {
    await Axios.get(
      `http:///${window.location.hostname}:3005/ProductWiseLoadedQty/${fromdate}`
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
    }, 500000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  //

  const config = {
    appendPadding: 10,
    data,
    angleField: "Quantity",
    colorField: "Product",
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
    // color: ['#0000ff', '#ff8040', '#808080', '#FFFF00'],
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
    <div
      className="Analytics"
      style={{
        borderRadius: borderRadius ? borderRadius : 0,
      }}
    >
      <span style={{ textAlign: "center" }}>
        {" "}
        <strong>Product Wise Loaded Quantity (KL)</strong>
      </span>
      <div style={{ height: "52rem" }}>
        <Pie {...config} />
      </div>
    </div>
    //Product_wise_loading_qty
  );
};

export default Product_wise_loading_qty1;
