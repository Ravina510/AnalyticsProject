import React, { useState, useEffect } from "react";
import { Column } from '@ant-design/plots';
import Axios from 'axios';

const Avg_filling_qty1 = (props) => {
  const [data, setData] = useState([]);

  const fromdate = props.fromdate;
  const borderRadius = props.borderRadius || 0;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    Axios.get(`http:///${window.location.hostname}:3005/AvgFillingQtyWise/${fromdate}`).then((result) => {
      //console.log(result.data.recordset);
      setData(result.data.recordset);
    })
  }

  const getData = async () => {
    await Axios.get(`http:///${window.location.hostname}:3005/AvgFillingQtyWise/${fromdate}`).then((result) => {
      //console.log(result.data.recordset);
      setData(result.data.recordset);
    });
  }

  useEffect(() => {
    getDate();
    if (!props.fromdate) return;
    getData();

    const intervalValue = setInterval(() => {
      getData();

    }, 500000)

    return () => clearInterval(intervalValue)

  }, [props.fromdate]);

  const config = {
    data,
    //isGroup: true,
    xField: 'Bay',
    yField: 'KL/Hr',
    color: "#b392ac",

    xAxis: {
      label: {
        position: 'middle',
        rotate: true,
        offsetX: 15
      },
      title: {
        text: "Bays",
      }
    },
    yAxis: {
      title: {
        text: "KL/Hr",
      }
    },

  };

  return (
    <div className="Analytics"
      style={{
        borderRadius: borderRadius ? borderRadius : 0
      }}>
      <span style={{ textAlign: "center" }}> <strong >Average Filling Quantity Wise (KL/Hr)</strong></span>
      <div style={{ height: "52rem" }}><Column {...config} /></div>
    </div>//
  );
};
export default Avg_filling_qty1; 
