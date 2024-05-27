import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./home.scss";
import * as dayjs from "dayjs";
import { DatePicker, Space } from "antd";
import Axios from "axios";
import Bay_Wise_Loading_Details_New from "../websvr/Bay_Wise_Loading_Details_New";
import Bay_wise_loading_flowrate from "../websvr/Bay_wise_loading_flowrate";
import Product_wise_loading_qty from "../websvr/Product_wise_loading_qty";
import Registered_Filled_Truck from "../websvr/Registered_Filled_Truck";
import Avg_filling_qty from "../websvr/Avg_filling_qty";
import Avg_bay_utilized from "../websvr/Avg_bay_utilized";
import TT_filling_status from "../websvr/TT_filling_status";
import Avg_time_cycle from "../websvr/Avg_time_cycle";
import Bay_ops_timing from "../websvr/Bay_ops_timing";

import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import "../../style/dark.scss";
import Bay_Wise_Loading_Details_New1 from "../Web_Server/Bay_Wise_Loading_Details_New1";
import Bay_wise_loading_flowrate1 from "../Web_Server/Bay_wise_loading_flowrate1";
import Product_wise_loading_qty1 from "../Web_Server/Product_wise_loading_qty1";
import Registered_Filled_Truck1 from "../Web_Server/Registered_Filled_Truck1";
import Avg_filling_qty1 from "../Web_Server/Avg_filling_qty1";
import Avg_bay_utilized1 from "../Web_Server/Avg_bay_utilized1";
import TT_filling_status1 from "../Web_Server/TT_filling_status1";
import Avg_time_cycle1 from "../Web_Server/Avg_time_cycle1";
import Bay_ops_timing1 from "../Web_Server/Bay_ops_timing1";
import Avg_bay_occupancy1 from "../Web_Server/Avg_bay_occupancy1";
import Avg_bay_occupancy from "../websvr/Avg_bay_occupancy";
import moment from "moment";

const Home = (props) => {
  const divRef = useRef(null);
  const [isLoggedin, setIsLoggedin] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const [data, setData] = useState([]);
  const [fromdate, setfromdate] = useState(null);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [isOpen, setIsOpen] = useState(false);
  const [isOpen1, setIsOpen1] = useState(false);
  const [isOpen2, setIsOpen2] = useState(false);
  const [isOpen3, setIsOpen3] = useState(false);
  const [isOpen4, setIsOpen4] = useState(false);
  const [isOpen5, setIsOpen5] = useState(false);
  const [isOpen6, setIsOpen6] = useState(false);
  const [isOpen7, setIsOpen7] = useState(false);
  const [isOpen8, setIsOpen8] = useState(false);
  const [isOpen9, setIsOpen9] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState("");
  const navigate = useNavigate();

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const onChange = (date) => {
    function convert(date) {
      var date = new Date(date),
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
      return [date.getFullYear(), mnth, day].join("-");
    }
    const fromdate = convert(date);

    setfromdate(fromdate);
  };
  // useEffect(() => {
  //   const getToday = new Date();
  //   var date = new Date(getToday),
  //     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
  //     day = ("0" + date.getDate()).slice(-2);
  //   const fromdate = [date.getFullYear(), mnth, day].join("-");
  //   Axios.get(
  //     `http:///${window.location.hostname}:3005/GraphData_UI_BayWiseLoadingDetails/${fromdate}`
  //   ).then((result) => {
  //     setData(result.data.recordset);
  //   });
  // }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      // console.log(loggedInUser);
      setIsLoggedin(loggedInUser);
    }
  }, []);

  if (!isLoggedin) {
    navigate("/login");
  }

  return isLoggedin ? (
    <div className={darkMode ? "app dark" : "app"}>
      <div className="home">
        <div className="datepicker">
          <DatePicker
            defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
            className="col-sm-3 float-end"
            onChange={onChange}
            disabledDate={(current) => {
              return moment().add(-1, 'days')  <= current }}
          />
        </div>

        <br></br>
        <br></br>

        <div className="charts cursor">
          <div onClick={() => setIsOpen(true)} style={{ width: "100%" }}>
            <Bay_Wise_Loading_Details_New fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen1(true)} style={{ width: "100%" }}>
            <Bay_wise_loading_flowrate fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen2(true)} style={{ width: "100%" }}>
            <Product_wise_loading_qty fromdate={fromdate} />
          </div>
        </div>

        <div className="charts cursor">
          <div onClick={() => setIsOpen3(true)} style={{ width: "100%" }}>
            <Registered_Filled_Truck fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen4(true)} style={{ width: "100%" }}>
            <Avg_filling_qty fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen7(true)} style={{ width: "100%" }}>
            <TT_filling_status fromdate={fromdate} />
          </div>
        </div>

        <div className="charts cursor">
          <div onClick={() => setIsOpen5(true)} style={{ width: "100%" }}>
            <Avg_bay_utilized fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen6(true)} style={{ width: "100%" }}>
            <Avg_bay_occupancy fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen8(true)} style={{ width: "100%" }}>
            <Avg_time_cycle fromdate={fromdate} />
          </div>
          <div onClick={() => setIsOpen9(true)} style={{ width: "100%" }}>
            <Bay_ops_timing fromdate={fromdate} />
          </div>
        </div>

        {isOpen && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen(false);
                }}
              >
                X
              </span>

              <Bay_Wise_Loading_Details_New1
                borderRadius="15px"
                fromdate={fromdate}
              />
            </div>
          </div>
        )}
        {isOpen1 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen1(false);
                }}
              >
                X
              </span>

              <Bay_wise_loading_flowrate1
                borderRadius="15px"
                fromdate={fromdate}
              />
            </div>
          </div>
        )}
        {isOpen2 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen2(false);
                }}
              >
                X
              </span>

              <Product_wise_loading_qty1
                borderRadius="15px"
                fromdate={fromdate}
              />
            </div>
          </div>
        )}
        {isOpen3 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen3(false);
                }}
              >
                X
              </span>

              <Registered_Filled_Truck1
                borderRadius="15px"
                fromdate={fromdate}
              />
            </div>
          </div>
        )}
        {isOpen4 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen4(false);
                }}
              >
                X
              </span>

              <Avg_filling_qty1 borderRadius="15px" fromdate={fromdate} />
            </div>
          </div>
        )}
        {isOpen5 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen5(false);
                }}
              >
                X
              </span>

              <Avg_bay_utilized1 borderRadius="15px" fromdate={fromdate} />
            </div>
          </div>
        )}
        {isOpen6 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen6(false);
                }}
              >
                X
              </span>

              <Avg_bay_occupancy1 borderRadius="15px" fromdate={fromdate} />
            </div>
          </div>
        )}
        {isOpen7 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen7(false);
                }}
              >
                X
              </span>

              <TT_filling_status1 borderRadius="15px" fromdate={fromdate} />
            </div>
          </div>
        )}
        {isOpen8 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "79%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen8(false);
                }}
              >
                X
              </span>

              <Avg_time_cycle1 borderRadius="15px" fromdate={fromdate} />
            </div>
          </div>
        )}
        {isOpen9 && (
          <div
            style={{
              width: "100%",
              height: "100%",
              backgroundColor: "rgba(10, 10, 10, 0.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "fixed",
              top: 0,
              left: 0,
              zIndex: 999,
            }}
          >
            <div
              style={{
                backgroundColor: "white",
                border: "gray",
                height: "80%",
                width: "80%",
                transition: "width 0.5s",
                zIndex: 1000,
                borderRadius: "15px",
                boxShadow: "3px 3px 10px 0px rgba(0,0,0,0.06)",
                position: "relative",
              }}
            >
              <span
                style={{
                  float: "right",
                  height: "",
                  color: "red",
                  position: "absolute",
                  top: "10px",
                  right: "15px",
                  fontSize: "1.7rem",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setIsOpen9(false);
                }}
              >
                X
              </span>

              <Bay_ops_timing1 borderRadius="15px" fromdate={fromdate} />
            </div>
          </div>
        )}
      </div>
    </div>
  ) : (
    ""
  );
};
export default Home;
