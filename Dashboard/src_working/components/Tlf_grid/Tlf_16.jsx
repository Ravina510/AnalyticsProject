import React from "react";
import moment from "moment";
import Axios from "axios";
import { useState, useEffect } from "react";
import { MaterialReactTable } from "material-react-table";
import { Bar } from "@ant-design/plots";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import "./Tlf_1.scss";
import { useLocation, useNavigate } from "react-router-dom";
import localeData from "dayjs/plugin/localeData";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
dayjs.extend(localeData);
//
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

const DropDownItems = [
  {
    label: "Main gate entry time to Main gate exit time",
    startKey: "MainEntryGateTime",
    endKey: "MainExitGateTime",
  },
  // {
  //   label: "Reporting time to License area entry time",
  //   startKey: "BayReportingTime",
  //   endKey: "LicEntryGateTime",
  // },
  {
    label: "License area entry time to Loading end time",
    startKey: "LicEntryGateTime",
    endKey: "LoadingEndTime",
  },
  // {
  //   label: "Loading start time to Loading end time",
  //   startKey: "LoadingStartTime",
  //   endKey: "LoadingEndTime",
  // },
  {
    label: "Loading end time to License area exit time",
    startKey: "LoadingEndTime",
    endKey: "LicExitGateTime",
  },
  {
    label: "License area exit time to Main gate exit time",
    startKey: "LicExitGateTime",
    endKey: "MainExitGateTime",
  },
];


const { RangePicker } = DatePicker;

const Tlf_16 = () => {
  const { state } = useLocation();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const navigate = useNavigate();
  const [columns, setColumns] = useState([]);
  const [dataGrid, setDataGrid] = useState([]);
  const [data, setGraphData] = useState([]);
  const [dataCount, setDataCount] = useState([]);
  const [TTCount, setTTDataCount] = useState([]); //TTCount
  const [currentValue, setCurrentValue] = useState(new Date());
  const [StartDate, setStartDate] = useState(null); // TLF_Mod Start Date
  const [EndDate, setEndDate] = useState(null); // TLF_Mod End Date
  const [value2, setValue2] = useState("2");
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [selectedColumn1, setSelectedColumn1] = useState("MainEntryGateTime");
  const [selectedColumn2, setSelectedColumn2] = useState("MainExitGateTime");
  const [selectedFilterValue, setSelectedFilterValue] = useState(new Date()); //to set value in date box that is selected
  const [monthValue, setMonth] = useState("");

  //value1, value2
  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const TotalCountOfTT = (
    spName = "TotalCountOfIndents",
    StartDate,
    EndDate
  ) => {
    if (spName === "TotalCountOfIndents") {
      // Axios.get(
      //   `http://${window.location.hostname}:3005/TotalCountOfIndents/${StartDate}/${EndDate}`
      // ).then((result) => {
      //   // console.log(result);
      //   const TTIndentsCount = result.data.recordset[0].CountOfIndents;
      //   setTTDataCount(TTIndentsCount);
      // });

      AnalyticAxios.get(`/api/GridChart/TotalCountOfIndents/${StartDate}/${EndDate}`)
      .then((result) => {
        const TTIndentsCount = result.data.recordset[0].CountOfIndents;
        setTTDataCount(TTIndentsCount);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      })
    }
  };

  const getGriddata = (
    spName = "TLF_16_Combined",
    StartDate,
    EndDate,
    value2,
    selectedColumn1,
    selectedColumn2
  ) => {
    if (spName === "TLF_16_Combined") {
      AnalyticAxios.get(`/api/BarChart/TLF_16_Combined/${StartDate}/${EndDate}/${value2}/${selectedColumn1}/${selectedColumn2}`)
      .then((result) => {
        const sumTTOccurence = result.data.recordsets[0].reduce((total, record) => {
          return total + record["Result Count"];
        }, 0);
        setDataCount(sumTTOccurence);
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
          setDataGrid(result.data.recordset);
        }
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      })
      // Axios.get(
      //   `http://${window.location.hostname}:3005/TLF_16_Combined/${StartDate}/${EndDate}/${value2}/${selectedColumn1}/${selectedColumn2}`
      // ).then((result) => {
      //   const sumTTOccurence = result.data.recordsets[0].reduce((total, record) => {
      //     return total + record["Result Count"];
      //   }, 0);
      //   setDataCount(sumTTOccurence);
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
      //     setDataGrid(result.data.recordset);
      //   }
      // });
    } else {
    }
  };

  const getGraphData = (StartDate, EndDate) => {
    // Axios.get(
    //   `http://${window.location.hostname}:3005/TLF_16_Graph/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   // console.log(result);
    //   setGraphData(result.data.recordset);
    // });
    AnalyticAxios.get(`/api/BarChart/TLF_16_Graph/${StartDate}/${EndDate}`)
    .then((result) => {
      setGraphData(result.data.recordset);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  const loadData = (
    StartDate,
    EndDate,
    value2,
    selectedColumn1,
    selectedColumn2
  ) => {
    getGriddata(
      "TLF_16_Combined",
      StartDate,
      EndDate,
      value2,
      selectedColumn1,
      selectedColumn2
    );
    getGraphData(StartDate, EndDate);
    TotalCountOfTT("TotalCountOfIndents", StartDate, EndDate);
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

    setSelectedFilterValue(StartDate);

    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue2(value2);
    setSelectedColumn1(selectedColumn1);
    setSelectedColumn2(selectedColumn2);
    loadData(
      StartDate,
      EndDate,

      value2,
      selectedColumn1,
      selectedColumn2
    );
  };
  //  value2,
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

    setSelectedFilterValue(`${dayjs(StartDate).format("MMMM YYYY")}`);

    setMonth(e);
    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue2(value2);
    setSelectedColumn1(selectedColumn1);
    setSelectedColumn2(selectedColumn2);
    loadData(StartDate, EndDate, value2, selectedColumn1, selectedColumn2);
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

    setSelectedFilterValue(
      `${dayjs(StartDate).format("MMM D, YYYY")} - ${dayjs(EndDate).format(
        "MMM D, YYYY"
      )}`
    );

    setStartDate(StartDate);
    setEndDate(EndDate);
    setValue2(value2);
    setSelectedColumn1(selectedColumn1);
    setSelectedColumn2(selectedColumn2);
    loadData(StartDate, EndDate, value2, selectedColumn1, selectedColumn2);
  };

  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  // const handleValueChange1 = (event) => {
  //   const val1 = event.target.value.replace(/[^0-9]/g, "");
  //   setStartDate(StartDate);
  //   setEndDate(EndDate);
  //   setValue2(value2);
  //   setSelectedColumn1(selectedColumn1);
  //   setSelectedColumn2(selectedColumn2);
  //   loadData(
  //     StartDate,
  //     EndDate,
  //     val1 === "" ? "0" : val1,
  //     value2 === "" ? "0" : value2,
  //     selectedColumn1,
  //     selectedColumn2
  //   );
  // };

  const handleValueChange2 = (event) => {
    const val2 = event.target.value.replace(/[^0-9]/g, "");
    setStartDate(StartDate);
    setEndDate(EndDate);

    setValue2(val2);
    setSelectedColumn1(selectedColumn1);
    setSelectedColumn2(selectedColumn2);
    loadData(
      StartDate,
      EndDate,
      val2 === "" ? "0" : val2,
      selectedColumn1,
      selectedColumn2
    );
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
    setValue2(value2);
    setSelectedColumn1(selectedColumn1);
    setSelectedColumn2(selectedColumn2);
    loadData(StartDate, EndDate, value2, selectedColumn1, selectedColumn2);
  }, []);

  const config = {
    data,
    xField: "DiffValue",
    yField: "ColumnDiff",
    seriesField: "ColumnDiff",
    legend: {
      position: "top-left",
    },
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

      <div>
        <br></br>
        Cycle Time From:{"   "}
        <select
          onChange={(e) => {
            const selectedOption = DropDownItems.find(
              (item) => item.label === e.target.value
            );
            if (selectedOption) {
              setSelectedColumn1(selectedOption.startKey);
              setSelectedColumn2(selectedOption.endKey);
              const { startKey, endKey } = selectedOption;
              loadData(StartDate, EndDate, value2, startKey, endKey);
            }
          }}
          style={{ height: "31px", borderRadius: "5px" }}
        >
          {DropDownItems.map((item, index) => (
            <option value={item.label} key={index}>
              {item.label}
            </option>
          ))}
        </select>
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
        {/* <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "black",
            alignContent: "center",
            paddingTop: "1rem",
          }}
        >
          Lower Value :
          <span>
            <h1>
              <input
                className="widget"
                style={{
                  width: "100px",
                  fontWeight: "bold",
                  color: "#1d2d44",
                  textAlign: "center",
                  borderColor: "transparent",
                  fontSize: "35px",
                  backgroundColor: "transparent",
                  border: "none",
                  justifyContent: "center",
                }}
                type="text"
                pattern="[0-9]*"
                value={value1}
                name="value"
                onChange={(event) => {
                  handleValueChange1(event);
                }}
              />
            </h1>
          </span>
        </div> */}
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "black",
            alignContent: "center",
            paddingTop: "1.2rem",
          }}
        >
          Higher Value :
          <span>
            <h1>
              <input
                className="widget"
                style={{
                  width: "100px",
                  fontWeight: "bold",
                  color: "#1d2d44",
                  textAlign: "center",
                  borderColor: "transparent",
                  fontSize: "35px",
                  backgroundColor: "transparent",
                  border: "none",
                }}
                type="text"
                pattern="[0-9]*"
                value={value2}
                name="value"
                onChange={(event) => {
                  handleValueChange2(event);
                }}
              />
            </h1>
          </span>
        </div>
      </div>

      <div
        style={{
          height: "350px",
          width: "50rem",
          marginLeft: "20%",
          marginRight: "20%",
          padding: "50px",
          borderStyle: "solid",
          borderWidth: "2px",
          borderColor: "darkgrey",
        }}
      >
        <Bar {...config} />
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
export default Tlf_16;
