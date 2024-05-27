import React, { useEffect, useState } from "react";
import { Column } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import { Table } from "ant-table-extensions";
import * as dayjs from "dayjs";
import "./firengine.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
// import AnalyticAxios from "../../Axios/Axios";
import { green } from "@mui/material/colors";
const items = [
  {
    label: "Year Filter",
    key: "0",
  },
  // {
  //   label: "Month Filter",
  //   key: "1",
  // },
  // {
  //   label: "Range Filter",
  //   key: "2",
  // },
];

const { RangePicker } = DatePicker;
const FE01 = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  // console.log(state.ConfigValue, state.PageTitle);
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [todaysDate, setToday] = useState(null);
  const [fromDateValue, setgetfromdate] = useState(null);
  const [toDateValue, setgettodate] = useState(null);
  const [toMonthValue, setgettomonth] = useState(null);
  const [month, setMonth] = useState("");
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectionOfValue, setselectionOfValue] = useState();
  const [selectionSeries, setselectionSeries] = useState();
  const [selectedKey, setSelectedKey] = useState("Year Filter");
  const [totalOccurrences, setTotalOccurrences] = useState(0);
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
    yField: "Status",
    seriesField: "Status",
    color: ({ Status }) => {
      return Status == "OK" ? "green" : "red";
    },

    // isGroup: true,
    xAxis: {
      title: {
        text: "FIRE ENGINES",
      },
    },
    yAxis: {
      title: {
        text: "STATUS",
      },
    },
    label: {
      position: "top",
      visible: ({ Day }) => Day > 30,
      style: {
        fill: "#000",
      },
      content: ({ count, Day }) => (Day > 30 ? count : null),
    },
  };

  const getdata = (StartDate, EndDate) => {
    console.log(StartDate, EndDate);
    Axios.get(
      `http://${window.location.hostname}:3005/FE_maintenance_more_than_month/${StartDate}/${EndDate}`
    )
      .then((result) => {
        // console.log(result.data);
        setData(result.data.recordset);
        const getGridData = result.data.recordsets[1]; //.filter((item) => item['From Time'] !== null);
        // const getGridData = /* Your data here */;

        const sourceOccurrences = {};
        getGridData.forEach((entry) => {
          const source = entry.Source;
          const fromTime = entry["From Time"];

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

        setPairOfPercAndOccur(sourcePercentageOccurrences);

        // Output
        console.log(sourcePercentageOccurrences);

        // .map(
        //   ({ Counter, ...rest }) => rest
        // );
        // console.log("Final D", result.data.recordset);
        const list = getGridData || [];
        console.log("Final D", list);
        if (list) {
          const firstObject = list[0] || {};
          const cols = [];
          for (const key in firstObject) {
            const col = {
              // id: key,
              Header: key,
              accessor: key,
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
          setDataSource(
            getGridData.filter((item) => item["From Time"] !== null)
          );
        }
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
    // Axios.get(
    //   `http://localhost:3005/api/ColumnChart/FE_maintenance_more_than_month/${StartDate}/${EndDate}`
    // ).then((result) => {
    //
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
      title: "% of Occurences year", // Update the title here
      field: "Percentage",
      header: "% of Occurences year", // Update the header here
      accessorKey: "Percentage",
    },
  ];

  const handleYear = (e) => {
    const selectedDate = new Date(e); // Replace this line with the selected date from the calendar

    const firstDateOfYear = new Date(selectedDate.getFullYear(), 0, 1);

    const lastDateOfYear = new Date(selectedDate.getFullYear() + 1, 0, 1);
    lastDateOfYear.setMilliseconds(lastDateOfYear.getMilliseconds() - 1);

    const year = firstDateOfYear.getFullYear();
    const month = String(firstDateOfYear.getMonth() + 1).padStart(2, "0");
    const day = String(firstDateOfYear.getDate()).padStart(2, "0");
    const firstHours = String(firstDateOfYear.getHours()).padStart(2, "0");
    const firstMinutes = String(firstDateOfYear.getMinutes()).padStart(2, "0");
    const firstSeconds = String(firstDateOfYear.getSeconds()).padStart(2, "0");
    const StartDate = `${year}-${month}-${day} ${firstHours}:${firstMinutes}:${firstSeconds}`;

    const lastYear = lastDateOfYear.getFullYear();
    const lastMonth = String(lastDateOfYear.getMonth() + 1).padStart(2, "0");
    const lastDay = String(lastDateOfYear.getDate()).padStart(2, "0");
    const lastHours = String(lastDateOfYear.getHours()).padStart(2, "0");
    const lastMinutes = String(lastDateOfYear.getMinutes()).padStart(2, "0");
    const lastSeconds = String(lastDateOfYear.getSeconds()).padStart(2, "0");
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
    const currentYear = new Date().getFullYear();
    function getFirstDayOfYear(year) {
      return new Date(year, 0, 1);
    }
    function getLastDayOfYear(year) {
      return new Date(year, 11, 31);
    }
    const firstDate = getFirstDayOfYear(currentYear);
    var date = new Date(firstDate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    let StartDate = [date.getFullYear(), mnth, day].join("-");

    const lastDate = getLastDayOfYear(currentYear);
    var date = new Date(lastDate),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    let EndDate = [date.getFullYear(), mnth, day].join("-");

    getdata(StartDate, EndDate);
  }, []);

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  const tableData = pairOfPercAndOccur
    ? Object.entries(pairOfPercAndOccur).map(([source, percentage]) => ({
        Source: source,
        Percentage: parseFloat(percentage).toFixed(2),
      }))
    : [];

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
              defaultValue={dayjs(getfromdate, "YYYY")}
              onChange={(e) => {
                handleYear(e);
              }}
              picker="year"
              style={{
                display: `${selectedKey != "Year Filter" ? "none" : ""}`,
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

      <div className="singleRow">
        <div style={{ width: "100%" }}>
          <Column {...config} />
        </div>
      </div>
      <div className="float-end" style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>
      <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
      {dataSource && dataSource.length > 0 && (
          <div style={{ flex: 1, marginRight: "16px" }}>
            <MaterialReactTable
              className="custom-header-row"
              columns={columns1}
              data={tableData}
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
export default FE01;
