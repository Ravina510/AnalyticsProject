import React from "react";
import moment from "moment";
import Axios from "axios";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import "./Tlf_1.scss";
import { useLocation, useNavigate } from "react-router-dom";

import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
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

const { RangePicker } = DatePicker;

const Tlf_5 = () => {
  const { state } = useLocation();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const navigate = useNavigate();

  const [columns1, setColumns1] = useState([]);
  const [columns2, setColumns2] = useState([]);
  const [dataGrid1, setDataGrid1] = useState([]);
  const [dataGrid2, setDataGrid2] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const [data, setData] = useState([]);
  const [TTCount, setTTDataCount] = useState([]); //TTCount
  const [value, setValue] = useState("80");
  const [filterType, setFilterType] = useState(0);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [StartDate, setStartDate] = useState(null); // TLF_Mod Start Date
  const [EndDate, setEndDate] = useState(null); // TLF_Mod End Date
  const [monthValue, setMonth] = useState("");
  const [selectedKey, setSelectedKey] = useState("Day Filter");
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
    spName = "TLF_5_Combined",
    StartDate,
    EndDate,
    value
  ) => {
    if (spName === "TLF_5_Combined") {
      Axios.get(
        `http://${window.location.hostname}:3005/TLF_5_Combined/${StartDate}/${EndDate}/${value}`
      ).then((result) => {
        const list1 = result.data.recordsets[0];
        const list2 = result.data.recordsets[1];
        setDataCount(list1.length);

        if (list1) {
          const firstObject = list1[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              title: key,
              dataIndex: key,
              // width: 50,
              header: key,

              accessorKey: key,
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
        }

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
      });
    } else {
    }
  };

  const loadData = (StartDate, EndDate, value) => {
    getGriddata("TLF_5_Combined", StartDate, EndDate, value);
    TotalCountOfTT("TotalCountOfIndents", StartDate, EndDate);
  };

  const handleValueChange = (event) => {
    const val = event.target.value.replace(/[^0-9]/g, "");
    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue(val);

    loadData(StartDate, EndDate, val === "" ? "0" : val);
  };

  const handleToday = (e) => {
    //GRID
    // console.log(e, "date and time");
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
    setValue(value);
    loadData(StartDate, EndDate, value);
  };

  const handleMonth = (e) => {
    //GRID

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
    setValue(value);
    loadData(StartDate, EndDate, value);
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
    setValue(value);
    loadData(StartDate, EndDate, value);
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
    setValue(value);
    loadData(StartDate, EndDate, value);
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
          value={monthValue}
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

      <div className="boxes">
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "black",
            alignContent: "center",
            paddingTop: "1rem",
          }}
        >
          Total Indents :
          <span
            className="widget"
            style={{
              fontSize: "35px",
              fontWeight: "bold",
              color: "#1d2d44",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <div style={{ paddingTop: "1.5rem" }}>{TTCount}</div>
          </span>
        </div>
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "black",
            alignContent: "center",
            paddingTop: "1rem",
          }}
        >
          Total of Result Count :
          <span
            className="widget"
            style={{
              fontSize: "35px",
              fontWeight: "bold",
              color: "#1d2d44",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <div style={{ paddingTop: "1.5rem" }}>
              {dataCount === "" ? "0" : dataCount}
            </div>
          </span>
        </div>
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "black",
            alignContent: "center",
            paddingTop: "1rem",
          }}
        >
          Percentage :
          <span
            className="widget"
            style={{
              fontSize: "35px",
              fontWeight: "bold",
              color: "#1d2d44",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <div style={{ paddingTop: "1.5rem" }}>
              {" "}
              {Math.round((dataCount * 100) / TTCount)
                ? Math.round((dataCount * 100) / TTCount)
                : 0}
            </div>
          </span>
        </div>
      </div>

      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataGrid1} columns={columns1} />
        <ExportToPdfButton data={dataGrid1} columns={columns1} />
      </div>
      <div classname="row">
        {" "}
        <div
          classname="col-sm-6"
          style={{
            float: "left",
            width: "49%",
            zIndex: "0",
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <strong>MS</strong>
          </p>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns1}
            data={dataGrid1}
            initialState={{ density: "compact" }}
            enableStickyHeader
            muiTableContainerProps={{
              sx: { maxHeight: "500px" },
              color: "red",
            }}
            enableColumnResizing
            columnResizeMode="onEnd"
            enableRowNumbers
            rowNumberMode="original"
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            enableHiding={false}
            muiTableBodyProps={{
              sx: {
                "& tr:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: { borderRight: "2px solid #e0e0e0" },
            }}
          />
        </div>
        <div
          classname="col-sm-6"
          style={{
            float: "right",
            width: "49%",
            zIndex: "0",
            position: "relative",
          }}
        >
          <p
            style={{
              fontSize: "20px",
              backgroundColor: "black",
              color: "white",
            }}
          >
            <strong>HSD</strong>
          </p>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns2}
            data={dataGrid2}
            initialState={{ density: "compact" }}
            enableStickyHeader
            muiTableContainerProps={{
              sx: { maxHeight: "500px" },
              color: "red",
            }}
            enableColumnResizing
            columnResizeMode="onEnd"
            enableRowNumbers
            rowNumberMode="original"
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            enableHiding={false}
            muiTableBodyProps={{
              sx: {
                "& tr:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: { borderRight: "2px solid #e0e0e0" },
            }}
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Tlf_5;
