// import React from "react";
// import Axios from "axios";
// import { useState, useEffect } from "react";
// import { Table } from "antd";
// import { DatePicker } from "antd";
// import dayjs from "dayjs";
// import "./Tlf_1.scss";
// import { useLocation, useNavigate } from "react-router-dom";

// import localeData from "dayjs/plugin/localeData";
// import moment from "moment";
// import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
// import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
// dayjs.extend(localeData);

// const items = [
//   {
//     label: "Day Filter",
//     key: "0",
//   },
//   {
//     label: "Month Filter",
//     key: "1",
//   },
//   {
//     label: "Range Filter",
//     key: "2",
//   },
// ];

// const { RangePicker } = DatePicker;

// const Tlf_17 = () => {
//   const { state } = useLocation();
//   const [isLoggedin, setIsLoggedin] = useState(null);
//   const navigate = useNavigate();
//   const [columns, setColumns] = useState([]);
//   const [dataGrid, setDataGrid] = useState([]);
//   const [dataCount, setDataCount] = useState([]);
//   const [TTCount, setTTDataCount] = useState([]); //TTCount
//   const [currentValue, setCurrentValue] = useState(new Date());
//   const [StartDate, setStartDate] = useState(null); // TLF_Mod Start Date
//   const [EndDate, setEndDate] = useState(null); // TLF_Mod End Date
//   const [month, setMonth] = useState("");
//   const columnWidths = [200, 300];

//   const [value, setValue] = useState("100");
//   const [selectedKey, setSelectedKey] = useState("Day Filter");
//   const onClick = (e) => {
//     setSelectedKey(e.target.value);
//   };

//   var date = new Date(currentValue),
//     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
//     day = ("0" + date.getDate()).slice(-2);
//   let getfromdate = [date.getFullYear(), mnth, day].join("-");

//   const TotalCountOfTT = (
//     spName = "TotalCountOfIndents",
//     StartDate,
//     EndDate
//   ) => {
//     if (spName === "TotalCountOfIndents") {
//       Axios.get(
//         `http://${window.location.hostname}:3005/TotalCountOfIndents/${StartDate}/${EndDate}`
//       ).then((result) => {
//         const TTIndentsCount = result.data.recordset[0].CountOfIndents;
//         setTTDataCount(TTIndentsCount);
//       });
//     }
//   };

//   const getGriddata = (
//     spName = "TLF_17_Combined_Date",
//     StartDate,
//     EndDate,
//     value
//   ) => {
//     if (spName === "TLF_17_Combined_Date") {
//       // console.log(spName, StartDate, EndDate, value);
//       Axios.get(
//         `http://${window.location.hostname}:3005/TLF_17_Combined_Date/${StartDate}/${EndDate}/${value}`
//       ).then((result) => {
//         const list = result.data.recordset;
//         setDataCount(list.length);
//         if (list) {
//           const firstObject = list[0] || {};
//           const cols = [];
//           for (const key in firstObject) {
//             const col = {
//               // styles: { col },
//               title: key,
//               dataIndex: key,
//               width: 50,
//             };
//             cols.push(col);
//           }
//           setColumns(cols);
//           setDataGrid(result.data.recordset);
//         }
//       });
//     } else {
//     }
//   };

//   const loadData = (StartDate, EndDate, value) => {
//     getGriddata("TLF_17_Combined_Date", StartDate, EndDate, value);
//     TotalCountOfTT("TotalCountOfIndents", StartDate, EndDate);
//   };

//   const handleToday = (e) => {
//     const getToday1 = e;
//     const date = new Date(getToday1);
//     const year = date.getFullYear();
//     const month = String(date.getMonth() + 1).padStart(2, "0");
//     const day = String(date.getDate()).padStart(2, "0");
//     const hours = String(date.getHours()).padStart(2, "0");
//     const minutes = String(date.getMinutes()).padStart(2, "0");
//     const seconds = String(date.getSeconds()).padStart(2, "0");
//     const StartDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

//     const lastMomentOfDay = new Date(
//       date.getFullYear(),
//       date.getMonth(),
//       date.getDate() + 1
//     );
//     lastMomentOfDay.setMilliseconds(lastMomentOfDay.getMilliseconds() - 1);

//     const lastHour = lastMomentOfDay.getHours();
//     const lastMinute = lastMomentOfDay.getMinutes();
//     const lastSecond = lastMomentOfDay.getSeconds();
//     const EndDate = `${year}-${month}-${day} ${lastHour}:${lastMinute}:${lastSecond}`;

//     setStartDate(StartDate);
//     setEndDate(EndDate);
//     setValue(value);
//     loadData(StartDate, EndDate, value);
//   };

//   const handleMonth = (e) => {
//     const date = new Date(e);
//     const year = date.getFullYear();
//     const month = date.getMonth() + 1;
//     const firstDayOfMonth = new Date(year, month - 1, 1);
//     const lastDayOfMonth = new Date(year, month, 0);

//     const yearStart = firstDayOfMonth.getFullYear();
//     const monthStart = String(firstDayOfMonth.getMonth() + 1).padStart(2, "0");
//     const dayStart = String(firstDayOfMonth.getDate()).padStart(2, "0");
//     const StartDate = `${yearStart}-${monthStart}-${dayStart} 00:00:00`;

//     const yearEnd = lastDayOfMonth.getFullYear();
//     const monthEnd = String(lastDayOfMonth.getMonth() + 1).padStart(2, "0");
//     const dayEnd = String(lastDayOfMonth.getDate()).padStart(2, "0");
//     const EndDate = `${yearEnd}-${monthEnd}-${dayEnd} 23:59:59`;

//     setStartDate(StartDate);
//     setEndDate(EndDate);
//     setValue(value);
//     loadData(StartDate, EndDate, value);
//   };

//   const handleBetweenDate = (e) => {
//     const getBetweenDate = e;
//     const GetFromDate = getBetweenDate[0];

//     const GetToDate = getBetweenDate[1];

//     const d = new Date(GetFromDate);
//     const date = d.toISOString().split("T")[0];
//     const time = d.toTimeString().split(" ")[0];
//     const StartDate = `${date} ${time}`;

//     const d2 = new Date(GetToDate);
//     const date2 = d2.toISOString().split("T")[0];
//     const time2 = d2.toTimeString().split(" ")[0];
//     const EndDate = `${date2} ${time2}`;

//     setStartDate(StartDate);
//     setEndDate(EndDate);
//     setValue(value);
//     loadData(StartDate, EndDate, value);
//   };

//   useEffect(() => {
//     const date1 = new Date(),
//       mnth1 = ("0" + (date1.getMonth() + 1)).slice(-2),
//       day1 = ("0" + date1.getDate()).slice(-2);
//     const StartDate = [date1.getFullYear(), mnth1, day1].join("-");

//     const date2 = new Date(),
//       mnth2 = ("0" + (date2.getMonth() + 1)).slice(-2),
//       day2 = ("0" + date2.getDate()).slice(-2);
//     const EndDate = [date2.getFullYear(), mnth2, day2].join("-");
//     setStartDate(StartDate);
//     setEndDate(EndDate);
//     setValue(value);
//     loadData(StartDate, EndDate, value);
//   }, []);

//   const handleValueChange = (event) => {
//     const val = event.target.value.replace(/[^0-9]/g, "");
//     setStartDate(StartDate);
//     setEndDate(EndDate);
//     setValue(val);

//     loadData(StartDate, EndDate, val === "" ? "0" : val);
//   };
//   useEffect(() => {
//     const loggedInUser = localStorage.getItem("CurrentUser");
//     if (loggedInUser) {
//       // console.log(loggedInUser);
//       setIsLoggedin(loggedInUser);
//     }
//   }, []);

//   if (!isLoggedin) {
//     navigate("/login");
//   }

//   return isLoggedin ? (
//     <div className="main">
//       <div
//         style={{
//           backgroundColor: "black",
//           color: "white",
//           fontweight: "1rem",
//           fontSize: "1.5rem",
//         }}
//       >
//         <h3
//           style={{
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           {state.PageTitle}
//         </h3>
//         </div>
        
//         <div style={{paddingLeft: "80rem"}}>
//           <select
//             onChange={onClick}
//             style={{ height: "31px", borderRadius: "5px" }}
//           >
//             {items.map((item, index) => (
//               <option value={item.label} key={item.key}>
//                 {item.label}
//               </option>
//             ))}
//           </select>

//           <DatePicker
//             defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
//             onChange={(e) => {
//               handleToday(e);
//             }}
//             style={{
//               display: `${selectedKey != "Day Filter" ? "none" : ""}`,
//             }}
//             disabledDate={(current) => {
//               return moment().add(-1, "days") <= current;
//             }}
//           />
//           <DatePicker
//             placeholder={Date()}
//             // defaultValue={dayjs(monthName)}
//             value={monthValue}
//             onChange={(e) => handleMonth(e)}
//             style={{
//               display: `${selectedKey != "Month Filter" ? "none" : ""}`,
//             }}
//             picker="month"
//             format="MMMM"
//             disabledDate={(current) => {
//               return moment().add(-1, "days") <= current;
//             }}
//           />
//           <RangePicker
//             onChange={(e) => handleBetweenDate(e)}
//             style={{
//               width: "345px",
//               display: `${selectedKey != "Range Filter" ? "none" : ""}`,
//             }}
//             showTime
//             format="YYYY-MM-DD HH:mm:ss"
//             disabledDate={(current) => {
//               return moment().add(-1, "days") <= current;
//             }}
//           />
//         </div>

//       <div className="boxes">
//         <div
//           className="square box widget"
//           style={{
//             fontSize: "15px",
//             color: "#2b2d42",
//             alignContent: "center",
//             padding: "20px 10px 5px 10px",
//           }}
//         >
//           Total Indents :
//           <span
//             className="widge"
//             style={{
//               fontSize: "30px",
//               fontWeight: "bold",
//               color: "#284b63",
//               justifyContent: "center",
//               margin: "1rem",
//             }}
//           >
//             <br></br>
//             <p style={{ padding: "20px 10px 5px 10px" }}>{TTCount}</p>
//           </span>
//         </div>
//         <div
//           className="square box"
//           style={{
//             fontSize: "15px",
//             color: "#2b2d42",
//             alignContent: "center",
//             padding: "20px 10px 5px 10px",
//           }}
//         >
//           Result Count :
//           <span
//             style={{
//               fontSize: "30px",
//               fontWeight: "bold",
//               color: "#284b63",
//               justifyContent: "center",
//               margin: "1rem",
//             }}
//           >
//             <br></br>
//             {/* style={{ padding: '20px 10px 5px 10px' }}  */}
//             <p style={{ padding: "20px 10px 5px 10px" }}>{dataCount}</p>
//           </span>
//         </div>
//         <div
//           className="square box"
//           style={{
//             fontSize: "15px",
//             color: "#2b2d42",
//             alignContent: "center",
//             padding: "20px 10px 5px 10px",
//           }}
//         >
//           Percentage :
//           <span
//             style={{
//               fontSize: "30px",
//               fontWeight: "bold",
//               color: "#284b63",
//               justifyContent: "center",
//               margin: "1rem",
//             }}
//           >
//             <br></br>
//             <p style={{ padding: "20px 10px 5px 10px" }}>
//               {Math.round((dataCount * 100) / dataCount)
//                 ? Math.round((dataCount * 100) / dataCount)
//                 : 0}
//               <span style={{ marginLeft: "10%", fontSize: "20px" }}>%</span>
//             </p>
//           </span>
//         </div>
//         <div
//           className="square box"
//           style={{
//             fontSize: "15px",
//             color: "#2b2d42",
//             alignContent: "center",
//             padding: "20px 10px 5px 10px",
//           }}
//         >
//           Filter Value :
//           <span
//             style={{
//               fontSize: "30px",
//               fontWeight: "bold",
//               color: "#284b63",
//               justifyContent: "center",
//               margin: "1rem",
//             }}
//           >
//             <br></br>
//             <p style={{ padding: "5px 5px 5px 5px" }}>
//               <h1 className="card-text">
//                 <input
//                   style={{
//                     width: "100px",
//                     textAlign: "center",
//                     borderRadius: "5px",
//                     borderColor: "transparent",
//                     fontSize: "30px",
//                     fontWeight: "bold",
//                     color: "#284b63",
//                     backgroundColor: "transparent",
//                     border: "none",
//                   }}
//                   type="text"
//                   pattern="[0-9]*"
//                   value={value}
//                   name="value"
//                   onChange={(event) => {
//                     handleValueChange(event);
//                   }}
//                 />
//               </h1>
//             </p>
//           </span>
//         </div>
//       </div>
//       <div style={{ marginLeft: "42rem" }}>
//         <ExportCSVButton dataSource={dataGrid} columns={columns} />
//         <ExportToPdfButton data={dataGrid} columns={columns} />
//       </div>
//       <div className="table">
//         <Table
//           style={{ width: "60rem" }}
//           // style={{ width: '100' }}
//           className="custom-header-row custom-table"
//           bordered
//           columnWidths={columnWidths}
//           tableLayout="auto"
//           dataSource={dataGrid}
//           // width='200'
//           columns={columns}
//           scroll={{ y: "calc(80vh - 200px)" }}
//           align="center"
//           size="small"
//           pagination={{
//             defaultPageSize: 20,
//             showSizeChanger: true,
//             pageSizeOptions: ["20", "30", "40"],
//           }}
//         />
//       </div>
//     </div>
//   ) : (
//     ""
//   );
// };
// export default Tlf_17;
