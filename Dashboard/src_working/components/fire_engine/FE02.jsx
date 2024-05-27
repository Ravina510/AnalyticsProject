import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { Table } from "ant-table-extensions";
import { DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button, selectedKeys } from "antd";
import * as dayjs from "dayjs";
import { Link } from "react-router-dom";
import "./firengine.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
import AnalyticAxios from "../../Axios/Axios";
const items = [
  {
    label: "Weekly Filter",
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
const FE02 = (props) => {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Weekly Filter");
  const [totalOccurrences, setTotalOccurrences] = useState(0);
  const [pairOfPercAndOccur, setPairOfPercAndOccur] = useState({});
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
    yField: "Status",

    // isStack: true,
    seriesField: "Status",
    color: ({ Status }) => {
      // console.log("Inside callback", Diff);
      return Status == "NOT RUN" ? "red" : "GREEN";
    },
    // barStyle: {
    //   radius: [20, 20, 0, 0],
    // },
    xAxis: {
      title: {
        text: "Fire engines",
      },
        },
    yAxis: {
      title: {
        text: "Status",
      },
    },
    isGroup: true,
    
    label: {
      position: "top", // Display the label on top of the column
      visible: ({ count }) => count > 0, // Display when occurces is greater than 1
      style: {
        fill: "#000",
      },
      content: ({ count }) => (count  ? count : null),
    },
  };

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate);
    // Axios.get(
    //   `http://${window.location.hostname}:3005/FE_not_run_for_two_times_in_a_week/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    //   console.log(result.data.recordset,result.data.recordsets[1]);
    //   const getGridData = result.data.recordsets[1];
    //   const sourceOccurrences = {};
    //   getGridData.forEach((item) => {
    //     const { Source } = item;
    //     const currentStatus = item['Description'];
    //     if (currentStatus !== null) {
    //       if (sourceOccurrences[Source] === undefined) {
    //         sourceOccurrences[Source] = 1;
    //       } else {
    //         sourceOccurrences[Source]++;
    //       }
    //     } else {
    //       sourceOccurrences[Source] = 0;
    //     }
    //   });
    //   console.log(sourceOccurrences, "sourceOccurrences"); ///6
 
    //   console.log(sourceOccurrences, "sourceOccurrences");
    //   setSourcePercentages(sourceOccurrences);

     
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
    //         headerStyle: {
    //           backgroundColor: "#378FC3",
    //           color: "#FFF",
    //           fontSize: "17px",
    //           textAlign: "center",
    //           fontWeight: "bold",
    //         },
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
    //   }
    // });
    AnalyticAxios.get(`/api/ColumnChart/FE_not_run_for_two_times_in_a_week/${StartDate}/${EndDate}`)
    .then((result) => {
      setData(result.data.recordset);
      console.log(result.data.recordset,result.data.recordsets[1]);
      const getGridData = result.data.recordsets[1];
      const sourceOccurrences = {};
      getGridData.forEach((item) => {
        const { Source } = item;
        const currentStatus = item['Description'];
        if (currentStatus !== null) {
          if (sourceOccurrences[Source] === undefined) {
            sourceOccurrences[Source] = 1;
          } else {
            sourceOccurrences[Source]++;
          }
        } else {
          sourceOccurrences[Source] = 0;
        }
      });
      console.log(sourceOccurrences, "sourceOccurrences"); ///6
 
      console.log(sourceOccurrences, "sourceOccurrences");
      setSourcePercentages(sourceOccurrences);

     
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
        setColumns(cols);
        setDataSource(result.data.recordsets[1]);
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
  };

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
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
      title: "Running of Occurences", // Update the title here
      field: "Percentage",
      header: "Running of Occurences", // Update the header here
      accessorKey: "Percentage",
    },
  ];

  const handleWeek = (e) => {
    const selectedDate = new Date(e);
    const dayOfWeek = selectedDate.getDay();

    const firstDateOfWeek = new Date(selectedDate);
    firstDateOfWeek.setDate(selectedDate.getDate() - dayOfWeek);
    const lastDateOfWeek = new Date(selectedDate);
    lastDateOfWeek.setDate(selectedDate.getDate() - dayOfWeek + 6);
    lastDateOfWeek.setHours(23, 59, 59, 999);
    const year = firstDateOfWeek.getFullYear();
    const month = String(firstDateOfWeek.getMonth() + 1).padStart(2, "0");
    const day = String(firstDateOfWeek.getDate()).padStart(2, "0");
    const firstHours = String(firstDateOfWeek.getHours()).padStart(2, "0");
    const firstMinutes = String(firstDateOfWeek.getMinutes()).padStart(2, "0");
    const firstSeconds = String(firstDateOfWeek.getSeconds()).padStart(2, "0");
    const StartDate = `${year}-${month}-${day} ${firstHours}:${firstMinutes}:${firstSeconds}`;

    const lastYear = lastDateOfWeek.getFullYear();
    const lastMonth = String(lastDateOfWeek.getMonth() + 1).padStart(2, "0");
    const lastDay = String(lastDateOfWeek.getDate()).padStart(2, "0");
    const lastHours = String(lastDateOfWeek.getHours()).padStart(2, "0");
    const lastMinutes = String(lastDateOfWeek.getMinutes()).padStart(2, "0");
    const lastSeconds = String(lastDateOfWeek.getSeconds()).padStart(2, "0");
    const EndDate = `${lastYear}-${lastMonth}-${lastDay} ${lastHours}:${lastMinutes}:${lastSeconds}`;

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
    // fetchData();
    var today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    var getdate = new Date(firstDay),
      mnth = ("0" + (getdate.getMonth() + 1)).slice(-2),
      day = ("0" + getdate.getDate()).slice(-2);
    let StartDate = [getdate.getFullYear(), mnth, day].join("-");

    const lastDay = new Date(
      today.setDate(today.getDate() - today.getDay() + 6)
    );
    var getdate2 = new Date(lastDay),
      mnth = ("0" + (getdate2.getMonth() + 1)).slice(-2),
      day = ("0" + getdate2.getDate()).slice(-2);
    let EndDate = [getdate2.getFullYear(), mnth, day].join("-");
    getdata(StartDate, EndDate);
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      setIsLoggedin(loggedInUser);
    }
  }, []);

  if (!data) return <h1>Loading...</h1>;

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
                handleWeek(e);
              }}
              picker="week"
              style={{
                display: `${selectedKey != "Weekly Filter" ? "none" : ""}`,
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
      <br></br>

      <div
        className="small-box-container "
        style={{ paddingLeft: "5rem", fontSize: 16 }}
      >
        {Object.keys(pairOfPercAndOccur).map((source) => (
          <div
            className="small-box"
            style={{
              width: "200px",
              height: "120px",
              textAlign: "center",
              padding: "20px",
            }}
            key={source}
          >
            <p style={{ fontSize: "15px", paddingBottom: "20px" }}> {source}</p>
            <p style={{ fontWeight: "bold", fontSize: "30px" }}>
              {" "}
              {pairOfPercAndOccur[source].Avg}%
            </p>
          </div>
        ))}
      </div>

      {/* <div>
          <h2>Pair of Percentage and Occurrence:</h2>
          <pre>{JSON.stringify(pairOfPercAndOccur, null, 2)}</pre>
        </div> */}
      <div className="singleRow">
        <div style={{ width: "100%" }}>
          <Column {...config} />
        </div>
      </div>
      <br />
      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>
      <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
        {/* <div style={{ flex: 1, marginRight: "16px" }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns1}
            data={Object.entries(sourcePercentages).map(
              ([Source, Percentage]) => ({
                Source,
                Percentage: parseFloat(Percentage),
              })
            )}
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
               
                "& tr:nth-of-type(odd)": {
                  backgroundColor: "#f5f5f5",
                },
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                borderRight: "2px solid #e0e0e0", 
              },
            }}
            muiTableProps={{
              headerStyle: headerStyle, 
            }}
            muiTablePaginationProps={{
              rowsPerPageOptions: [11, 22],
              showFirstButton: false,
              showLastButton: false,
            }}
          />
        </div> */}
        <div style={{ flex: 1 }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns}
            // columns={columns1}
            data={dataSource}
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
          />
        </div>
      </div>
      {/* 
      <div className="table">
        <div>
          <Table
            className="custom-header-row"
            bordered
            style={{ width: "60rem" }}
            dataSource={dataSource}
            columns={columns}
            pagination={{
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"],
            }}
          />
        </div>
      </div> */}
    </div>
  ) : (
    ""
  );
};
export default FE02;
