import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import Axios from "axios";

const Registered_Filled_Truck1 = (props) => {
  const [data, setData] = useState([]);
  //  const
  const fromdate = props.fromdate;
  const borderRadius = props.borderRadius || 0;

  const getDate = () => {
    const getToday = new Date();
    // console.log(getToday);
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // console.log(fromdate);
    Axios.get(
      `http:///${window.location.hostname}:3005/RegisteredFilledTrucks/${fromdate}`
    ).then((result) => {
      setData(result.data.recordset);
    });
  };
  //

  const getData = async () => {
    await Axios.get(
      `http:///${window.location.hostname}:3005/RegisteredFilledTrucks/${fromdate}`
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
    xField: "Bay",
    yField: "Value",
    seriesField: "Type",
    isGroup: true,
    color: ["#3f88c5", "#032b43", "#136f63"],
    xAxis: {
      title: {
        text: "Bays",
      },
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
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
        <strong>Registered and Filled Truck List</strong>
      </span>
      <div style={{ height: "52rem" }}>
        <Column {...config} />
      </div>
    </div>
  );
  //
};
export default Registered_Filled_Truck1;
