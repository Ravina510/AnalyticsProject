import React, { useEffect, useState } from "react";
import { Dropdown, Space, Button, selectedKeys } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { DatePicker } from "antd";
import { MaterialReactTable } from "material-react-table";
import * as dayjs from "dayjs";
import { Column, Bar, Line } from "@ant-design/plots";
import Axios from "axios";
import "./firengine.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import moment from "moment";
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
const FE04 = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate);
    AnalyticAxios.get(`/api/GridChart/Hydrant_system_automation/${StartDate}/${EndDate}`)
    .then((result) => {
      setData(result.data.recordset);
      // console.log(result.data.recordset, "LATEST DATA");
      const getGridData = result.data.recordsets[1];
      const recordData = {};
      getGridData.forEach((row) => {
        const differenceValue = parseInt(row["Difference in sec"], 10);
        if (!isNaN(differenceValue)) {
          const key = `${row.Source}_${row.Value}`;
          recordData[key] = (recordData[key] || 0) + differenceValue;
        } else {
          const key = `${row.Source}_${row.Value}`;
          recordData[key] = recordData[key] || 0;
        }
      });
      console.log(recordData, "now");
      const resultsObject = {};
      for (const source in recordData) {
        const startDate = new Date(StartDate);
        const endDate = new Date(EndDate);
        console.log(startDate, endDate);
        const timeDifferenceInMilliseconds = endDate - startDate;
        console.log( timeDifferenceInMilliseconds,  "timeDifferenceInMilliseconds" );
        const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000;
        console.log(timeDifferenceInSeconds, "timeDifferenceInSeconds");
        const DifferenceInHours = timeDifferenceInSeconds / 3600;
        console.log(DifferenceInHours, "timeDifferenceInHours");

        resultsObject[source] = (recordData[source] / 3660 / DifferenceInHours) * 100;
        // resultsObject[source] = (recordData[source] / 3600 / 24) * 100;
      }
      console.log(resultsObject, "recordData");

      const orderedRecordData = Object.entries(resultsObject)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        const dataArray = Object.entries(orderedRecordData);

        dataArray.sort((a, b) => b[1] - a[1]);
        
        const sortedData = Object.fromEntries(dataArray);

      setDataSource1(sortedData);
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
        setDataSource(
          result.data.recordsets[1].filter(
            (item) => item["Difference in sec"] !== null
          )
        );
        // setShowData(true);
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
    // Axios.get(
    //   `http://${window.location.hostname}:3005/Hydrant_system_automation/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    //   // console.log(result.data.recordset, "LATEST DATA");
    //   const getGridData = result.data.recordsets[1];
    //   const recordData = {};
    //   getGridData.forEach((row) => {
    //     const differenceValue = parseInt(row["Difference in sec"], 10);
    //     if (!isNaN(differenceValue)) {
    //       const key = `${row.Source}_${row.Value}`;
    //       recordData[key] = (recordData[key] || 0) + differenceValue;
    //     } else {
    //       const key = `${row.Source}_${row.Value}`;
    //       recordData[key] = recordData[key] || 0;
    //     }
    //   });
    //   console.log(recordData, "now");
    //   const resultsObject = {};
    //   for (const source in recordData) {
    //     const startDate = new Date(StartDate);
    //     const endDate = new Date(EndDate);
    //     // console.log(startDate, endDate);
    //     const timeDifferenceInMilliseconds = endDate - startDate;
    //     // console.log( timeDifferenceInMilliseconds,  "timeDifferenceInMilliseconds" );
    //     const timeDifferenceInSeconds = timeDifferenceInMilliseconds / 1000;
    //     // console.log(timeDifferenceInSeconds, "timeDifferenceInSeconds");
    //     const DifferenceInHours = timeDifferenceInSeconds / 3600;
    //     // console.log(DifferenceInHours, "timeDifferenceInHours");

    //     resultsObject[source] = (recordData[source] / 3660 / DifferenceInHours) * 100;
    //   }
    //   console.log(resultsObject, "recordData");

    //   const orderedRecordData = Object.entries(resultsObject)
    //     .sort((a, b) => a[0].localeCompare(b[0]))
    //     .reduce((acc, [key, value]) => {
    //       acc[key] = value;
    //       return acc;
    //     }, {});
    //     const dataArray = Object.entries(orderedRecordData);

    //     dataArray.sort((a, b) => b[1] - a[1]);
        
    //     const sortedData = Object.fromEntries(dataArray);

    //   setDataSource1(sortedData);
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
    //     setDataSource(
    //       result.data.recordsets[1].filter(
    //         (item) => item["Difference in sec"] !== null
    //       )
    //     );
    //     // setShowData(true);
    //   }
    // });
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
      title: "Percentage", // Update the title here
      field: "Percentage",
      header: "Percentage", // Update the header here
      accessorKey: "Percentage",
    },
  ];

  const combinedData = data.filter(
    (e) => e.SourceValue === "MANUAL" || e.SourceValue === "LOCAL"
  );

  const configCombined = {
    data: combinedData,
    xField: "DATE",
    yField: "STATUS",
    seriesField: "SourceValue",
    connectNulls: true, // Connect lines between gaps in the data
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
  };
  const configData = {
    data: data.filter((e) => e.SourceValue === "MANUAL"),
    xField: "DATE",
    yField: "STATUS",
    seriesField: "Source",
    stepType: "vh",
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
  };
  const config = {
    data: data.filter((e) => e.SourceValue === "LOCAL"),
    xField: "DATE",
    yField: "STATUS",
    seriesField: "Source",
    stepType: "vh",
    yAxis: {
      label: {
        formatter: (v) =>
          `${v}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`),
      },
    },
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
  };

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
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
    setMonth(e);
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
    const date1 = new Date(),
    mnth1 = ("0" + (date1.getMonth() + 1)).slice(-2),
    day1 = ("0" + date1.getDate()).slice(-2);
  const StartDate = [date1.getFullYear(), mnth1, day1].join("-") + " 00:00:00";
  
  const date2 = new Date();
  const mnth2 = ("0" + (date2.getMonth() + 1)).slice(-2);
  const day2 = ("0" + date2.getDate()).slice(-2);
  const hours2 = ("0" + date2.getHours()).slice(-2);
  const minutes2 = ("0" + date2.getMinutes()).slice(-2);
  const seconds2 = ("0" + date2.getSeconds()).slice(-2);
  const EndDate = [date2.getFullYear(), mnth2, day2].join("-") + ` ${hours2}:${minutes2}:${seconds2}`;
   
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
        </div>
      </div>
      <br></br>
      {/* 
      <div className="singleRow">
        <div style={{ display: "flex", gap: "20px", width: "100%" }}>
       
          <div style={{ flex: 2, border: "1px solid #ccc", padding: "10px" }}>
            <Line {...config} />
          </div>
        
          <div style={{ flex: 2, border: "1px solid #ccc", padding: "10px" }}>
            <Line {...configData} />
          </div>         
         </div>
      </div> */}
      {/* 
      <div className="singleRow">
        {config.data && configData.data ? (
          <div style={{ display: "flex", gap: "20px", width: "100%" }}>
            {config.data.length > 0 ? (
              <div
                style={{ flex: 2, border: "1px solid #ccc", padding: "10px" }}
              >
                <Line {...config} />
              </div>
            ) : (
              <div>No records found for Local</div>
            )}
            {configData.data.length > 0 ? (
              <div
                style={{ flex: 2, border: "1px solid #ccc", padding: "10px" }}
              >
                <Line {...configData} />
              </div>
            ) : (
              <div>No records found for Manual</div>
            )}
          </div>
        ) : (
          <div>No records found for config and configData</div>
        )}
      </div> */}

      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>
      <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
        <div style={{ flex: 1, marginRight: "16px" }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns1}
            data={Object.entries(dataSource1).map(([Source, Percentage]) => ({
              Source,
              Percentage: parseFloat(Percentage).toFixed(4),
            }))}
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
export default FE04;
