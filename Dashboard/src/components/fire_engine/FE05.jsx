import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import "./firengine.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import { MaterialReactTable } from "material-react-table";
import moment from "moment";
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
const FE05 = (props) => {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [pairOfPercAndOccur, setPairOfPercAndOccur] = useState();
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
    yField: "Series",
    seriesField: "Series",
    color: ({ Series }) => {
      // console.log("Inside callback", Series);
      return Series == "ToppedUp" ? "GREEN" : "red";
    },
    columnStyle: {
      // radius: [20, 20, 0, 0],
    },

    xAxis: {
      title: {
        // text: "Fire engines",
      },
    },
    yAxis: {
      title: {
        // text: "In Day",
      },
    },
    padding: "auto",
    // seriesField: 'Difference',
  };

  const columns1 = [
    {
      id: "Source",
      title: "Source",
      field: "Source",
      header: "Source",
      accessorKey: "Source",
    },
    {
      id: "Percentage",
      title: "% of Occurences", // Update the title here
      field: "Percentage",
      header: "% of Occurences", // Update the header here
      accessorKey: "Percentage",
    },
  ];

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  const getdata = (StartDate, EndDate) => {
    Axios.get(
      `http://${window.location.hostname}:3005/Fire_water_tank_not_topped_up/${StartDate}/${EndDate}`
    ).then((result) => {
        setData(result.data.recordsets[0]);

        const getGridData = result.data.recordsets[1];
        const sourceOccurrences = {};
        getGridData.forEach((entry) => {
          const source = entry.Source;
          const fromTime = entry["FromTime"];
          if (fromTime === null) {
            sourceOccurrences[source] = null;
          } else {
            if (sourceOccurrences[source]) {
              sourceOccurrences[source]++;
            } else {
              sourceOccurrences[source] = 1;
            }
          }
        });
        console.log(sourceOccurrences, "sourceOccurrences");
        const totalOccurrences = Object.values(sourceOccurrences).reduce(
          (sum, count) => sum + count,
          0
        );

        const sourcePercentageOccurrences = {};

        for (const source in sourceOccurrences) {
          let percentage;
          if (sourceOccurrences[source] === null) {
            percentage = 0;
          } else {
            percentage = isNaN(sourceOccurrences[source])
              ? 0
              : (sourceOccurrences[source] / totalOccurrences) * 100;
          }
          sourcePercentageOccurrences[source] = percentage;
        }
        console.log(sourcePercentageOccurrences, "sourcePercentageOccurrences");
        setPairOfPercAndOccur(sourcePercentageOccurrences);

        const list = getGridData || [];
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
          setDataSource(result.data.recordsets[1].filter((item) => item["FromTime"] !== null));
          // setShowData(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });

    // Axios.get(
    //   `http://localhost:3005/api/GridChart/Fire_water_tank_not_topped_up/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   setData(result.data.recordsets[0]);
    //   // console.log(result.data.recordsets[0]);
    //   const getGridData = result.data.recordsets[1];
    //   const list = getGridData || [];
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
    //     setDataSource(result.data.recordsets[1]);
    //     // setShowData(true);
    //   }
    // });
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
    getdata(StartDate, EndDate);
    setMonth(e);
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
      <div className="flex-parent-element">
        <h3
          className="flex-child-element magenta"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingLeft: "18rem",
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
              // picker="month"
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
            />
            <br />
          </div>
          {/* <Dropdown
            menu={{
              items,
              onClick,
            }}
            trigger={["click"]}
          >
            <button
              style={{
                backgroundColor: "white",
                border: "0.5px solid lightgray",
              }}
            >
              {items[filterType].label}
              <DownOutlined
                style={{
                  marginLeft: "10px",
                }}
              />
            </button>
          </Dropdown>
          <div
            onClick={(e) => {
              handleSubmit(e);
            }}
            style={{ display: "inline" }}
          >
            <DatePicker
              defaultValue={dayjs(getfromdate, "YYYY")}
              onChange={(e) => {
                handleToday(e);
              }}
              style={{ display: `${filterType != 0 ? "none" : ""}` }}
            />
            <DatePicker
              placeholder={Date()}
              value={month}
              onChange={(e) => handleMonth(e)}
              style={{ display: `${filterType != 1 ? "none" : ""}` }}
              picker="month"
            />
            <RangePicker
              onChange={(e) => handleBetweenDate(e)}
              style={{ display: `${filterType != 2 ? "none" : ""}` }}
              showTime
              format="YYYY-MM-DD HH:mm:ss"
            />
            <br />
          </div> */}
        </div>
      </div>
      <br></br>

      <div className="singleRow">
        <div style={{ width: "100%" }}>
          <Column {...config} />
        </div>
      </div>
      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>
      <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
        {dataSource && dataSource.length > 0 && (
          <div style={{ flex: 1 }}>
            <MaterialReactTable
              className="custom-header-row"
              columns={columns1}
              data={Object.entries(pairOfPercAndOccur).map(
                ([Source, Percentage]) => ({
                  Source,
                  Percentage: parseFloat(Percentage).toFixed(2),
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
        )}
        {/* &ns */}
        <div style={{ flex: 1 }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns}
            data={dataSource}
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
            // enableHiding={false}
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
export default FE05;
