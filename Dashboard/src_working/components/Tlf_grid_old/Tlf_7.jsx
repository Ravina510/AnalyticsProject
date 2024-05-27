import React from "react";
import moment from "moment";
import Axios from "axios";
import { useState, useEffect } from "react";
import { DatePicker } from "antd";
import { Table } from "antd";
import * as dayjs from "dayjs";
import "./Tlf_1.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
const items = [
  {
    label: "Day Filter",
    key: "0",
  },
  {
    label: "Month Filter",
    key: "1",
  },
  {
    label: "Range Filter",
    key: "2",
  },
];

// const DropDownItems = [
//   {
//     label: "Show All",
//     key: "''",
//   },
//   {
//     label: "No Flow Timeout,PRESS ACK",
//     key: "'No Flow Timeout,PRESS ACK'",
//   },
//   {
//     label: "Meter OverRun , TOBV Close command sent",
//     key: "'Meter OverRun , TOBV Close command sent'",
//   },
//   {
//     label: "Pressure Error,PRESS ACK",
//     key: "'Pressure Error,PRESS ACK'",
//   },
//   {
//     label: "ESD/Emergency Stop",
//     key: "'Emergency Stop'",
//   },
//   {
//     label: "Internal Additive Low,PRESS ACK",
//     key: "'Internal Additive Low,PRESS ACK'",
//   },
//   {
//     label: "RECONNECT OR CLEAR ARM PARK",
//     key: "'RECONNECT OR CLEAR ARM PARK'",
//   },
//   {
//     label: "CONNECT GROUND",
//     key: "'CONNECT GROUND'",
//   },
//   {
//     label: "Meter Overrun",
//     key: "'Meter Overrun'",
//   },
//   {
//     label: "No Additive Flow,PRESS ACK",
//     key: "'No Additive Flow,PRESS ACK'",
//   },
//   {
//     label: "Connect Earth",
//     key: "'Connect Earth'",
//   },
//   {
//     label: "Temperature Fault,PRESS ACK",
//     key: "'Temperature Fault,PRESS ACK'",
//   },
//   {
//     label: "Meter OverRun ,Pump Trip Command Sent",
//     key: "'Meter OverRun ,Pump Trip Command Sent'",
//   },
//   {
//     label: "Slow Flow Error,PRESS ACK",
//     key: "'Slow Flow Error,PRESS ACK'",
//   },
//   {
//     label: "Truck Aborted",
//     key: "'Truck Aborted'",
//   },
//   {
//     label: "Truck Reallocated",
//     key: "'Truck Reallocated'",
//   },
//   {
//     label: "Loading Stopped by Operator,PRESS ACK",
//     key: "'Loading Stopped by Operator,PRESS ACK'",
//   },
//   {
//     label: "RIT Stop Arm1",
//     key: "'RIT Stop Arm1'",
//   },
//   {
//     label: "Low Flow",
//     key: "'Low Flow'",
//   },
//   {
//     label: "Internal Additive High,PRESS ACK",
//     key: "'Internal Additive High,PRESS ACK'",
//   },
//   {
//     label: "Internal Additive No Flow,PRESS ACK",
//     key: "'Internal Additive No Flow,PRESS ACK'",
//   },
//   {
//     label: "Power Failure,PRESS ACK",
//     key: "'Power Failure,PRESS ACK'",
//   },
// ];

// const DropDownItems = [
//   {
//     label: "Show All",
//     key: "'%%'",
//   },
//   {
//     label: "No Flow Timeout,PRESS ACK",
//     key: "'%No Flow Timeout,PRESS ACK%'",
//   },
//   {
//     label: "Meter OverRun , TOBV Close command sent",
//     key: "'%Meter OverRun , TOBV Close command sent%'",
//   },
//   {
//     label: "Pressure Error,PRESS ACK",
//     key: "'%Pressure Error,PRESS ACK%'",
//   },
//   {
//     label: "ESD/Emergency Stop",
//     key: "'%ESD/Emergency Stop%'",
//   },
//   {
//     label: "Internal Additive Low,PRESS ACK",
//     key: "'%Internal Additive Low,PRESS ACK%'",
//   },
//   {
//     label: "RECONNECT OR CLEAR ARM PARK",
//     key: "'%RECONNECT OR CLEAR ARM PARK%'",
//   },
//   {
//     label: "CONNECT GROUND",
//     key: "'%CONNECT GROUND%'",
//   },
//   {
//     label: "Meter Overrun",
//     key: "'%Meter Overrun%'",
//   },
//   {
//     label: "No Additive Flow,PRESS ACK",
//     key: "'%No Additive Flow,PRESS ACK%'",
//   },
//   {
//     label: "Connect Earth",
//     key: "'%Connect Earth%'",
//   },
//   {
//     label: "Temperature Fault,PRESS ACK",
//     key: "'%Temperature Fault,PRESS ACK%'",
//   },
//   {
//     label: "Meter OverRun ,Pump Trip Command Sent",
//     key: "'%Meter OverRun ,Pump Trip Command Sent%'",
//   },
//   {
//     label: "Slow Flow Error,PRESS ACK",
//     key: "'%Slow Flow Error,PRESS ACK%'",
//   },
//   {
//     label: "Truck Aborted",
//     key: "'%Truck Aborted%'",
//   },
//   {
//     label: "Truck Reallocated",
//     key: "'%Truck Reallocated%'",
//   },
//   {
//     label: "Loading Stopped by Operator,PRESS ACK",
//     key: "'%Loading Stopped by Operator,PRESS ACK%'",
//   },
//   {
//     label: "RIT Stop Arm1",
//     key: "'%RIT Stop Arm1%'",
//   },
//   {
//     label: "Low Flow",
//     key: "'%Low Flow%'",
//   },
//   {
//     label: "Internal Additive High,PRESS ACK",
//     key: "'%Internal Additive High,PRESS ACK%'",
//   },
//   {
//     label: "Internal Additive No Flow,PRESS ACK",
//     key: "'%Internal Additive No Flow,PRESS ACK%'",
//   },
//   {
//     label: "Power Failure,PRESS ACK",
//     key: "'%Power Failure,PRESS ACK%'",
//   },
// ];

const { RangePicker } = DatePicker;

const Tlf_7 = () => {
  const { state } = useLocation();

  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [columns1, setColumns1] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [columns3, setColumns3] = useState([]);

  const [dataGrid1, setDataGrid1] = useState([]);
  const [dataGrid2, setDataGrid2] = useState([]);
  const [dataGrid3, setDataGrid3] = useState([]);
  const [error, setError] = useState("''");
  const [dataCount, setDataCount] = useState([]);
  const [data, setData] = useState([]);
  const [TTCount, setTTDataCount] = useState([]); //TTCount

  const [filterType, setFilterType] = useState(0);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [StartDate, setStartDate] = useState(null); // TLF_Mod Start Date
  const [EndDate, setEndDate] = useState(null); // TLF_Mod End Date
  const [monthValue, setMonth] = useState("");
  const [selectedKey, setSelectedKey] = useState("Day Filter");

  const [dropDown, setDropDown] = useState([]);
  const [selectedError, setSelectedError] = useState("");

  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let defaultDate = [date.getFullYear(), mnth, day].join("-");

  const TotalCountOfTT = (
    spName = "TotalCountOfIndents",
    StartDate,
    EndDate
  ) => {
    if (spName === "TotalCountOfIndents") {
      Axios.get(
        `http://${window.location.hostname}:3005/TotalCountOfIndents/${StartDate}/${EndDate}`
      ).then((result) => {
        const TTIndentsCount = result.data.recordset[0].CountOfIndents;
        setTTDataCount(TTIndentsCount);
      });
    }
  };

  const getGriddata = (
    storedProcedureName = "TLF_7_Combined",
    StartDate,
    EndDate,
    error
  ) => {
    //Grid 1
    //console.log("TLF7.1", StartDate, EndDate, error);
    if (storedProcedureName === "TLF_7_Combined") {
      Axios.get(
        `http:///${window.location.hostname}:3005/TLF_7_Combined/${StartDate}/${EndDate}/${error}`
      ).then((result) => {
        const list1 = result.data.recordsets[0];
        const list2 = result.data.recordsets[1];
        const list3 = result.data.recordsets[2];

        if (list1) {
          // console.log("Inside data", list1);
          const firstObject = list1[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              // styles: { col },
              title: key,
              dataIndex: key,
              header: key,
              accessorKey: key,
              headerStyle: {
                backgroundColor: "#378FC3",
                color: "#FFF",
                fontSize: "17px",
                textAlign: "center",
                fontWeight: "bold",
              },
            };
            if (typeof firstObject[key] === "number") {
              col.filterVariant = "range";
              col.filterFn = "between";
              col.size = 80;
            }
            cols.push(col);
          }
          setColumns1(cols);
          setDataGrid1(list1);

          const ErrorOcc = list1.map((row) => row.Error);
          const ErrorOccQuotes = [`'Reset'`].concat(
            ErrorOcc.map((Error) => `'${Error}'`)
          );
          setDropDown(ErrorOccQuotes);
          ////console.log("dropdown", ErrorOccQuotes);
        }

        //Grid 2
        if (list2) {
          const firstObject = list2[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              title: key,
              dataIndex: key,
              // width: 50,
              header: key,
              accessorKey: key,
              headerStyle: {
                backgroundColor: "#378FC3",
                color: "#FFF",
                fontSize: "17px",
                textAlign: "center",
                fontWeight: "bold",
              },
            };
            if (typeof firstObject[key] === "number") {
              col.filterVariant = "range";
              col.filterFn = "between";
              col.size = 80;
            }
            cols.push(col);
          }
          setColumns2(cols);
          setDataGrid2(list2);
        }

        //Grid 3
        if (list3) {
          const firstObject = list3[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              title: key,
              dataIndex: key,
              width: 50,
              header: key,
              accessorKey: key,
              headerStyle: {
                backgroundColor: "#378FC3",
                color: "#FFF",
                fontSize: "17px",
                textAlign: "center",
                fontWeight: "bold",
              },
            };
            if (typeof firstObject[key] === "number") {
              col.filterVariant = "range";
              col.filterFn = "between";
              col.size = 80;
            }
            cols.push(col);
          }
          setColumns3(cols);
          setDataGrid3(list3);
        }
      });
    }
  };

  const loadData = (StartDate, EndDate, error) => {
    //console.log("TLF7.1", StartDate, EndDate, error);
    getGriddata("TLF_7_Combined", StartDate, EndDate, error);
    TotalCountOfTT("TotalCountOfIndents", StartDate, EndDate);
  };

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  const handleToday = (e) => {
    // ////console.log(e, "date and time");
    const getToday1 = e;
    // console.log(e, "today1");
    const date = new Date(getToday1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const StartDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

    const lastMomentOfDay = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate() + 1
    );
    lastMomentOfDay.setMilliseconds(lastMomentOfDay.getMilliseconds() - 1);

    const lastHour = lastMomentOfDay.getHours();
    const lastMinute = lastMomentOfDay.getMinutes();
    const lastSecond = lastMomentOfDay.getSeconds();
    const EndDate = `${year}-${month}-${day} ${lastHour}:${lastMinute}:${lastSecond}`;
    // console.log(StartDate, EndDate);

    setStartDate(StartDate);
    setEndDate(EndDate);
    setError(error);
    loadData(StartDate, EndDate, error);
  };

  const handleMonth = (e) => {
    const date = new Date(e);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const yearStart = firstDayOfMonth.getFullYear();
    const monthStart = String(firstDayOfMonth.getMonth() + 1).padStart(2, "0");
    const dayStart = String(firstDayOfMonth.getDate()).padStart(2, "0");
    const StartDate = `${yearStart}-${monthStart}-${dayStart} 00:00:00`;

    const yearEnd = lastDayOfMonth.getFullYear();
    const monthEnd = String(lastDayOfMonth.getMonth() + 1).padStart(2, "0");
    const dayEnd = String(lastDayOfMonth.getDate()).padStart(2, "0");
    const EndDate = `${yearEnd}-${monthEnd}-${dayEnd} 23:59:59`;
    setMonth(e);
    setStartDate(StartDate);
    setEndDate(EndDate);
    setError(error);
    loadData(StartDate, EndDate, error);
  };

  const handleBetweenDate = (e) => {
    const getBetweenDate = e;
    const GetFromDate = getBetweenDate[0];

    const GetToDate = getBetweenDate[1];

    const d = new Date(GetFromDate);
    const date = d.toISOString().split("T")[0];
    const time = d.toTimeString().split(" ")[0];
    const StartDate = `${date} ${time}`;

    const d2 = new Date(GetToDate);
    const date2 = d2.toISOString().split("T")[0];
    const time2 = d2.toTimeString().split(" ")[0];
    const EndDate = `${date2} ${time2}`;

    setStartDate(StartDate);
    setEndDate(EndDate);
    setError(error);
    loadData(StartDate, EndDate, error);
  };

  const handleError = (event) => {
    const err = event.target.value;
    setStartDate(StartDate);
    setEndDate(EndDate);
    setSelectedError(err);
    loadData(StartDate, EndDate, err === "" ? "0" : err);
    //console.log("TLF7.2,", StartDate, EndDate, err);
  };

  useEffect(() => {
    const date1 = new Date(),
      mnth1 = ("0" + (date1.getMonth() + 1)).slice(-2),
      day1 = ("0" + date1.getDate()).slice(-2);
    const StartDate = [date1.getFullYear(), mnth1, day1].join("-");

    const date2 = new Date(),
      mnth2 = ("0" + (date2.getMonth() + 1)).slice(-2),
      day2 = ("0" + date2.getDate()).slice(-2);
    const EndDate = [date2.getFullYear(), mnth2, day2].join("-");

    setStartDate(StartDate);
    setEndDate(EndDate);
    setError(error);
    loadData(StartDate, EndDate, error);
  }, []);

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
    <div className="main">
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          fontweight: "1rem",
          fontSize: "1.5rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {state.PageTitle}
        </h3>
      </div>

      <div style={{ paddingLeft: "80rem" }}>
        <select
          onChange={onClick}
          style={{ height: "31px", borderRadius: "5px" }}
        >
          {items.map((item, index) => (
            <option value={item.label} key={item.key}>
              {item.label}
            </option>
          ))}
        </select>

        <DatePicker
          // defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
          onChange={(e) => {
            handleToday(e);
          }}
          style={{
            display: `${selectedKey != "Day Filter" ? "none" : ""}`,
          }}
          disabledDate={(current) => {
            return moment().add(-1, "days") <= current;
          }}
        />
        <DatePicker
          placeholder={Date()}
          // defaultValue={dayjs(monthName)}
          // value={monthValue}
          onChange={(e) => handleMonth(e)}
          style={{
            display: `${selectedKey != "Month Filter" ? "none" : ""}`,
          }}
          picker="month"
          format="MMMM"
          disabledDate={(current) => {
            return moment().add(-1, "days") <= current;
          }}
        />
        <RangePicker
          onChange={(e) => handleBetweenDate(e)}
          style={{
            width: "345px",
            display: `${selectedKey != "Range Filter" ? "none" : ""}`,
          }}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={(current) => {
            return moment().add(-1, "days") <= current;
          }}
        />
      </div>

      <div>
        <label>Select an option:</label>{" "}
        <select
          value={selectedError}
          onChange={handleError}
          defaultValue={""}
          style={{
            height: "31px",
            borderRadius: "5px",
          }}
        >
          {" "}
          {dropDown.map((option, index) => (
            <option key={index} value={option === `'Reset'` ? `''` : option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <br />
      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: "16px" }}>
          <strong>Alarm Wise Pattern</strong>
          <div style={{ marginLeft: "32rem" }}>
            <ExportCSVButton dataSource={dataGrid1} columns={columns1} />
            <ExportToPdfButton data={dataGrid1} columns={columns1} />
          </div>
          <div style={{ zIndex: "0", position: "relative" }}>
            <MaterialReactTable
              className="custom-header-row"
              columns={columns1}
              data={dataGrid1}
              // dataSource={dataSource}
              // columns={columns}
              enableStickyHeader
              muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
              initialState={{ density: "compact" }}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              enableGlobalFilter={false}
              enableHiding={false}
              enableColumnResizing
              columnResizeMode="onEnd"
              enableRowNumbers
              rowNumberMode="original"
              muiTableBodyProps={{
                sx: {
                  //stripe the rows, make odd rows a darker color
                  "& tr:nth-of-type(odd)": {
                    backgroundColor: "#f5f5f5",
                  },
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  borderRight: "2px solid #e0e0e0", //add a border between columns
                },
              }}
              muiTableProps={{
                headerStyle: headerStyle, // Apply the header style here
              }}
              muiTablePaginationProps={{
                rowsPerPageOptions: [11, 22],
                showFirstButton: false,
                showLastButton: false,
              }}
              enablePagination={false}
            />
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <strong>Truck Wise Pattern</strong>
          <div style={{ marginLeft: "32rem" }}>
            <ExportCSVButton dataSource={dataGrid2} columns={columns2} />
            <ExportToPdfButton data={dataGrid2} columns={columns2} />
          </div>
          <div style={{ zIndex: "0", position: "relative" }}>
            <MaterialReactTable
              className="custom-header-row"
              columns={columns2}
              data={dataGrid2}
              enableStickyHeader
              muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
              initialState={{ density: "compact" }}
              enableFullScreenToggle={false}
              enableDensityToggle={false}
              enableGlobalFilter={false}
              enableHiding={false}
              enableColumnResizing
              columnResizeMode="onEnd"
              enableRowNumbers
              rowNumberMode="original"
              muiTableBodyProps={{
                sx: {
                  //stripe the rows, make odd rows a darker color
                  "& tr:nth-of-type(odd)": {
                    backgroundColor: "#f5f5f5",
                  },
                },
              }}
              muiTableBodyCellProps={{
                sx: {
                  borderRight: "2px solid #e0e0e0", //add a border between columns
                },
              }}
              muiTableProps={{
                headerStyle: headerStyle, // Apply the header style here
              }}
              enablePagination={false}
            />
          </div>
        </div>
      </div>
      <br />
      <div style={{ flex: 1 }}>
        <strong>Description</strong>
        <div style={{ marginLeft: "85rem" }}>
          <ExportCSVButton dataSource={dataGrid3} columns={columns3} />
          <ExportToPdfButton data={dataGrid3} columns={columns3} />
        </div>
        <div style={{ zIndex: "0", position: "relative" }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns3}
            data={dataGrid3}
            enableStickyHeader
            muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
            initialState={{ density: "compact" }}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            enableHiding={false}
            enableColumnResizing
            columnResizeMode="onEnd"
            enableRowNumbers
            rowNumberMode="original"
            muiTableBodyProps={{
              sx: {
                //stripe the rows, make odd rows a darker color
                "& tr:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderRight: "2px solid #e0e0e0", //add a border between columns
              },
            }}
            muiTableProps={{
              headerStyle: headerStyle, // Apply the header style here
            }}
            enablePagination={false}
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Tlf_7;
