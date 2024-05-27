import React, { useState, useEffect } from "react";
import Axios from "axios";
import AnalyticAxios from "../../Axios/Axios";
const Avg_time_cycle = (props) => {
  const [data, setData] = useState([]);
  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    // Axios.get(
    //   `http:///${window.location.hostname}:3005/AvgTimeCycle/${fromdate}`
    // ).then((result) => {
    //   let Time = result.data.recordset[0].TimeDiff;
    //   const newValue = (Time * 100) / 300;
    //   setData(newValue);
    //   // console.log(data);
    // });
    AnalyticAxios.get(`/api/ProgressChart/AvgTimeCycle/${fromdate}`)
    .then((result) => {
      let Time = result.data.recordset[0].TimeDiff;
      const newValue = (Time * 100) / 300;
      setData(newValue);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };
  const getData = async () => {
    // await Axios.get(
    //   `http:///${window.location.hostname}:3005/AvgTimeCycle/${fromdate}`
    // ).then((result) => {
    //   let Time = result.data.recordset[0].TimeDiff;
    //   const newValue = (Time * 100) / 300;
    //   setData(newValue);
    // });
    AnalyticAxios.get(`/api/ProgressChart/AvgTimeCycle/${fromdate}`)
    .then((result) => {
      let Time = result.data.recordset[0].TimeDiff;
      const newValue = (Time * 100) / 300;
      setData(newValue);
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
    }, 60000);

    return () => clearInterval(intervalValue);
  }, [props.fromdate]);

  return (
    <div
      className="Analytics"
      style={{
        display: "flex",
        flexDirection: "Column",
        height: "252px",
        width: "96%",
        //backgroundColor: "red",
      }}
    >
      <div
        style={{
          display: "flex",
          paddingTop: "20px",
          height: "50%",
          width: "80%",
          flexDirection: "row",
          alignItems: "top",
          justifyContent: "center",
          fontSize: 15,
          textAlign: "center",
        }}
      >
        <strong>Average Time Cycle (in mins)</strong>
      </div>
      <div style={{ paddingLeft: "20px" }}>
        <div
          style={{
            alignItems: "center",
            position: "relative",
            maxWidth: "30rem",
            width: "18rem",
            minWidth: "24rem",
            height: "40px",
            backgroundColor: "#adb5bd",
            borderRadius: "0 50px 50px 0",
            // paddingLeft:'2rem'
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 0,
              top: 0,
              width: `${data}%`,

              height: "100%",
              background: "#854576",
              borderRadius: "0 50px 50px 0",
            }}
          ></div>
        </div>
        <div>
          <p style={{ marginTop: "5px", alignContent: "left", float: "left" }}>
            <strong>0</strong>
          </p>
          <p
            style={{
              alignContent: "right",
              float: "right",
              paddingRight: "3rem",
            }}
          >
            <strong>300</strong>
          </p>
        </div>
      </div>
      <div
        style={{
          marginTop: "40px",
          width: "100%",
          textAlign: "center",
          fontSize: 20,
        }}
      >
        <strong>{(data * 300) / 100} mins</strong>
      </div>
      {/* <div style={{position:"relative",left:'8rem',fontSize:'10px'}}>Details</div> */}
    </div>
  );
};

export default Avg_time_cycle;
