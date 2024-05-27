import React from "react";
import moment from "moment";
import Axios from "axios";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./Tlf_1.scss";
import { useLocation, useNavigate } from "react-router-dom";

import localeData from "dayjs/plugin/localeData";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
dayjs.extend(localeData);
import AnalyticAxios from "../../Axios/Axios";
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

const Tlf_18 = () => {
  const { state } = useLocation();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);

  const [dataGrid, setDataGrid] = useState([]);

  const [dataCount, setDataCount] = useState([]);
  const [CompCount, setCompDataCount] = useState([]); //CompartmentsCount
  const [currentValue, setCurrentValue] = useState(new Date());
  const [StartDate, setStartDate] = useState(null); // TLF_Mod Start Date
  const [EndDate, setEndDate] = useState(null); // TLF_Mod End Date
  const [monthValue, setMonth] = useState("");
  const [value, setValue] = useState("50");
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const TotalCountOfCompartments = (
    spName = "TotalCountOfCompartments",
    StartDate,
    EndDate
  ) => {
    if (spName === "TotalCountOfCompartments") {
      // Axios.get(
      //   `http://${window.location.hostname}:3005/TotalCountOfCompartments/${StartDate}/${EndDate}`
      // ).then((result) => {
      //   const TTCompartmentsCount =
      //     result.data.recordset[0].CountOfCompartments;
      //   setCompDataCount(TTCompartmentsCount);
      // });
      AnalyticAxios.get(`/api/GridChart/TotalCountOfCompartments/${StartDate}/${EndDate}`)
      .then((result) => {
        const TTCompartmentsCount =
        result.data.recordset[0].CountOfCompartments;
      setCompDataCount(TTCompartmentsCount);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      })
    }
  };

  const getGriddata = (
    spName = "TLF_18_Combined",
    StartDate,
    EndDate,
    value
  ) => {
    if (spName === "TLF_18_Combined") {
      // console.log(spName, StartDate, EndDate, value);
      // Axios.get(
      //   `http://${window.location.hostname}:3005/TLF_18_Combined/${StartDate}/${EndDate}/${value}`
      // ).then((result) => {
      //   setDataCount(result.data.recordset.length);
      //   const list = result.data.recordset;
      //   if (list) {
      //     const firstObject = list[0] || {};
      //     const cols = [];
      //     for (const key in firstObject) {
      //       const col = {
      //         title: key,
      //         dataIndex: key,
      //         header: key,
      //         accessorKey: key,
      //       };
      //       if (typeof firstObject[key] === "number") {
      //         col.filterVariant = "range";
      //         col.filterFn = "between";
      //         col.size = 80;
      //       }
      //       cols.push(col);
      //     }
      //     setColumns(cols);
      //     setDataGrid(list);
      //   }
      // });
      AnalyticAxios.get(`/api/GridChart/TLF_18_Combined/${StartDate}/${EndDate}/${value}`)
      .then((result) => {
        setDataCount(result.data.recordset.length);
        const list = result.data.recordset;
        if (list) {
          const firstObject = list[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              title: key,
              dataIndex: key,
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
          setColumns(cols);
          setDataGrid(list);
        }
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      })
    } else {
    }
  };

  const loadData = (StartDate, EndDate, value) => {
    getGriddata("TLF_18_Combined", StartDate, EndDate, value);
    TotalCountOfCompartments("TotalCountOfCompartments", StartDate, EndDate);
  };

  const handleToday = (e) => {
    const getToday1 = e;
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

    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue(value);
    loadData(StartDate, EndDate, value);
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

    // getGriddata("TLF_18_Combined_Date", StartDate, EndDate, value);
    // TotalCountOfCompartments("TotalCountOfCompartments", StartDate, EndDate);

    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue(value);
    loadData(StartDate, EndDate, value);
  }, []);

  const handleValueChange = (event) => {
    const val = event.target.value.replace(/[^0-9]/g, "");
    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue(val);

    loadData(StartDate, EndDate, val === "" ? "0" : val);
  };

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
        
        <div style={{paddingLeft: "80rem"}}>
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
            defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
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
          Total Compartments :
          <span
            className="widget"
            style={{
              fontSize: "35px",
              fontWeight: "bold",
              color: "black",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <div style={{ paddingTop: "1.5rem" }}>{CompCount}</div>
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
              color: "black",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <div style={{ paddingTop: "1.5rem" }}>{dataCount}</div>
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
              color: "black",
              justifyContent: "center",
              marginBottom: "5px",
            }}
          >
            <div style={{ paddingTop: "1.5rem" }}>
              {" "}
              {Math.round((dataCount * 100) / CompCount)
                ? Math.round((dataCount * 100) / CompCount)
                : 0}
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
          Filter Value :
          <span>
            <h1
              style={{
                padding: "19px",
              }}
            >
              <input
                className="widget"
                style={{
                  width: "100px",
                  fontWeight: "bold",
                  color: "black",
                  textAlign: "center",
                  borderColor: "transparent",
                  fontSize: "35px",
                  backgroundColor: "transparent",
                  border: "none",
                  justifyContent: "center",
                  paddingBottom: "1rem"
                }}
                type="text"
                pattern="[0-9]*"
                value={value}
                name="value"
                onChange={(event) => {
                  handleValueChange(event);
                }}
              />
            </h1>
          </span>
        </div>
      </div>

      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataGrid} columns={columns} />
        <ExportToPdfButton data={dataGrid} columns={columns} />
      </div>
      <div style={{ zIndex: "0", position: "relative" }}>
        <MaterialReactTable
          className="custom-header-row"
          columns={columns}
          data={dataGrid}
          initialState={{ density: "compact" }}
          enableStickyHeader
          muiTableContainerProps={{ sx: { maxHeight: "500px" }, color: "red" }}
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
  ) : (
    ""
  );
};
export default Tlf_18;
