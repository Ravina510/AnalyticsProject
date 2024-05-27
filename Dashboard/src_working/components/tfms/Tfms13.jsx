import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import { Table } from "ant-table-extensions";
import Axios from "axios";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import "./tfms.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Dataset, Source } from "@mui/icons-material";
import moment from "moment";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
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

const Tfms13 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [data, setData] = useState([]);
  const [loadingData, setloadingData] = useState([]);
  const [unhealthyTanks, setunhealthyTanks] = useState([]);
  const [avgSale, setTotalAvg] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [pairOfPercAndOccur, setPairOfPercAndOccur] = useState({});
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [columns, setColumns] = useState([]);
  // const [columns1, setColumns1] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [totalValveDyke, settotalValveDyke] = useState([]);
  const [sourcePercentages, setSourcePercentages] = useState([]);
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };
  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const config = {
    data,
    xField: "Source",
    yField: "count",
    seriesField: "count",
    color: "#338AFF",

    xAxis: {
      title: {
        text: "Source",
      },
      label: {
        rotate: true,
        offsetX: 15,
      },
    },
    yAxis: {
      title: {
        text: "Count",
      },
    },
    label: {
      position: "top", // Display the label on top of the column
      visible: ({ count }) => count > 0, // Display when occurces is greater than 1
      style: {
        fill: "#000",
      },
      content: ({ count }) => (count > 0 ? count : null),
    },
  };

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate);

    AnalyticAxios.get(`/api/GridChart/TFMS13/${StartDate}/${EndDate}`)
            .then((result) => {
              const recordsWithSourceValueNotNull = result.data.recordset.filter(
                (record) => record.CurrentStatus !== null
              );
              recordsWithSourceValueNotNull.sort((a, b) => {
                if (b.CurrentStatus < a.CurrentStatus) {
                  return -1;
                }
                if (b.CurrentStatus > a.CurrentStatus) {
                  return 1;
                }
                return 0;
              });
      
              console.log(recordsWithSourceValueNotNull, "filtered data");
              setData(result.data.recordset);
      
              const getGridData = result.data.recordset;
              const list = getGridData || [];
              if (list) {
                const firstObject = list[0] || {};
                const cols = [];
                for (const key in firstObject) {
                  const col = {
                    title: key,
                    dataIndex: key,
                    // width:100,
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
                  } else if (key === "TT Count") {
                    col.filterVariant = "range";
                    col.filterFn = "between";
                    col.size = 80;
                  }
                  cols.push(col);
                }
                setColumns(cols);
                setDataSource(recordsWithSourceValueNotNull.filter(item => item['Current Status'] !== null));
              }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });



    // Axios.get(`http://${window.location.hostname}:3005/TFMS13/${StartDate}/${EndDate}`).then(
    //   (result) => {
    //     const recordsWithSourceValueNotNull = result.data.recordset.filter(
    //       (record) => record.CurrentStatus !== null
    //     );
    //     recordsWithSourceValueNotNull.sort((a, b) => {
    //       if (b.CurrentStatus < a.CurrentStatus) {
    //         return -1;
    //       }
    //       if (b.CurrentStatus > a.CurrentStatus) {
    //         return 1;
    //       }
    //       return 0;
    //     });

    //     console.log(recordsWithSourceValueNotNull, "filtered data");
    //     setData(result.data.recordset);

    //     const getGridData = result.data.recordset;
    //     const list = getGridData || [];
    //     if (list) {
    //       const firstObject = list[0] || {};
    //       const cols = [];
    //       for (const key in firstObject) {
    //         const col = {
    //           title: key,
    //           dataIndex: key,
    //           // width:100,
    //           header: key,
    //           accessorKey: key,
    //           headerStyle: {
    //             backgroundColor: "#378FC3",
    //             color: "#FFF",
    //             fontSize: "17px",
    //             textAlign: "center",
    //             fontWeight: "bold",
    //           },
    //         };
    //         if (typeof firstObject[key] === "number") {
    //           col.filterVariant = "range";
    //           col.filterFn = "between";
    //           col.size = 80;
    //         } else if (key === "TT Count") {
    //           col.filterVariant = "range";
    //           col.filterFn = "between";
    //           col.size = 80;
    //         }
    //         cols.push(col);
    //       }
    //       setColumns(cols);
    //       setDataSource(recordsWithSourceValueNotNull.filter(item => item['Current Status'] !== null));
    //     }
    //   }
    // );
  };

  const list_valve_dyke = () => {
    const counts = {};

    data.forEach((item) => {
      const Source = item.Source;
      const CurrentStatus = item['Current Status'];
      // const { Source, CurrentStatus } = item;
      console.log(Source, CurrentStatus);
      if (CurrentStatus !== null) {
        if (counts[Source] === undefined) {
          counts[Source] = 1;
        } else {
          counts[Source]++;
        }
      } else {
        counts[Source] = 0;
      }
    });

    const sourceOccurAndPercArray = Object.entries(counts);

    sourceOccurAndPercArray.sort((a, b) => b[1] - a[1]);

    const sortedSourceOccurAndPerc = Object.fromEntries(
      sourceOccurAndPercArray
    );
    setSourcePercentages(sortedSourceOccurAndPerc);

  };

  const columns1 = [
    {
      id: "TankName",
      title: "Source",
      field: "TankName",
      header: "Source",
      accessorKey: "TankName",
    },
    {
      id: "Percentage",
      title: "Count of Occurences", // Update the title here
      field: "Percentage",
      header: "Count of Occurences", // Update the header here
      accessorKey: "Percentage",
    },
  ];

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  const openDyke = () => {
    // Calculate the total count
    const totalCount = data.reduce((total, item) => total + item.count, 0);
    console.log(totalCount, "total count");
    setPairOfPercAndOccur(totalCount);

    const percentageData = data.map((item) => ({
      source: item.Source,
      percentage: ((item.count / totalCount) * 100).toFixed(2),
    }));

    setTotalOccurrences(percentageData);
  };

  const handleToday = (e) => {
    // Assume you have selectedDate from the calendar as a valid Date object
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
    console.log(StartDate, EndDate, "today");
    getdata(StartDate, EndDate);
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
    console.log(StartDate, EndDate, "month");
    getdata(StartDate, EndDate);
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

    getdata(StartDate, EndDate);
  };

  useEffect(() => {
    openDyke();
  }, [data]);

  useEffect(() => {
    const date1 = new Date(),
    mnth1 = ("0" + (date1.getMonth() + 1)).slice(-2),
    day1 = ("0" + date1.getDate()).slice(-2);
  const StartDate = [date1.getFullYear(), mnth1, day1].join("-");

  const date2 = new Date(),
    mnth2 = ("0" + (date2.getMonth() + 1)).slice(-2),
    day2 = ("0" + date2.getDate()).slice(-2);

  const EndDate = [date2.getFullYear(), mnth2, day2].join("-");
  console.log(StartDate, EndDate, "today");
  getdata(StartDate, EndDate);
  }, []);

  useEffect(() => {
    list_valve_dyke();
  }, [data]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      setIsLoggedin(loggedInUser);
    }
  }, []);

  if (!isLoggedin) {
    navigate("/login");
  }
  return isLoggedin ? (
    <div className="main">
      <div className="flex-parent-element">
        <h3
          className="flex-child-element magenta"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "25rem",
          }}
        >
          {state.PageTitle}
        </h3>
        <div
          className="flex-child-element magenta"
          style={{
            right: 0,
            display: "flex",
            position: "absolute",
            alignItems: "float-right",
          }}
        >
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
          <div>
            <DatePicker
              defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
              onChange={(e) => {
                handleToday(e);
              }}
              //   picker="year"
              style={{
                display: `${selectedKey != "Day Filter" ? "none" : ""}`,
              }}
            />
            <DatePicker
              placeholder={Date()}
              // defaultValue={dayjs(monthName)}
              value={month}
              onChange={(e) => handleMonth(e)}
              style={{
                display: `${selectedKey != "Month Filter" ? "none" : ""}`,
              }}
              picker="month"
            />
            <RangePicker
              onChange={(e) => handleBetweenDate(e)}
              style={{
                width: "345px",
                display: `${selectedKey != "Range Filter" ? "none" : ""}`,
              }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
            <br />
          </div>
        </div>
      </div>
      <br />

      <div className="float-end" style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>

      <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
        <div style={{ flex: 1, marginRight: "16px" }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns1}
            data={Object.entries(sourcePercentages).map(
              ([TankName, Percentage]) => ({
                TankName,
                Percentage: parseFloat(Percentage),
              })
            )}
            enableStickyHeader
            muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
            initialState={{ density: "compact" }}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            // enableHiding={false}
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
          />
        </div>
        <div style={{ flex: 1 }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns}
            data={dataSource}
            enableStickyHeader
            muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
            initialState={{ density: "compact" }}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            // enableHiding={false}
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
          />
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};

export default Tfms13;
