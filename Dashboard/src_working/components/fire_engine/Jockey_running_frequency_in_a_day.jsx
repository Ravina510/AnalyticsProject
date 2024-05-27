import React, { useState, useEffect } from "react";
import { Dropdown, Space, Button } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Table } from "ant-table-extensions";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import { Column, Bar, Line } from "@ant-design/plots";
import Axios from "axios";
import "./firengine.scss";
import { useLocation, useNavigate } from "react-router-dom";
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

const Jockey_running_frequency_in_a_day = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [filterType, setFilterType] = useState(0);
  const [month, setMonth] = useState("");
  const [data, setData] = useState([]);
  const [recordData, setRecord] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [sourcePercentages, setSourcePercentages] = useState([]);
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };
  var date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const config = {
    data,
    xField: "DATE",
    yField: "STATUS",
    seriesField: "Source",
    stepType: "vh",
    // label: {
    //   position: "top", // Display the label on top of the column
    //   visible: ({ Count }) => Count > 0, // Display when occurces is greater than 1
    //   style: {
    //     fill: "#000",
    //   },
    //   content: ({ Count }) => (Count  ? Count : null),
    // },
    xAxis: {
      title: {
        text: "Source",
      },
      label: {
        rotate: 45,
        offsetY: 15,
      },
    },
    yAxis: {
      title: {
        text: "Total Count",
      },
    },
  };
  // console.log(recordData);
  const getdata = (StartDate, EndDate) => {
    // Axios.get(
    //   `http://${window.location.hostname}:3005/jockey_running_frequency_in_a_day/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   const getGridData = result.data.recordsets[1];
    //   setData(result.data.recordset);
    //   console.log(result.data.recordset, "data");

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
    //     setDataSource(result.data.recordsets[1].filter((item) => item["Difference in sec"] !== null));

    //     const counts = {};

    //     result.data.recordsets[1].forEach((item) => {
    //       const { Source } = item;
    //       const currentStatus = item["Difference in sec"];
    //       if (currentStatus !== null) {
    //         if (counts[Source] === undefined) {
    //           counts[Source] = 1;
    //         } else {
    //           counts[Source]++;
    //         }
    //       } else {
    //         counts[Source] = 0;
    //       }
    //     });

    //     const sourceOccurAndPercArray = Object.entries(counts);

    //     sourceOccurAndPercArray.sort((a, b) => b[1] - a[1]);

    //     const sortedSourceOccurAndPerc = Object.fromEntries(
    //       sourceOccurAndPercArray
    //     );
    //     console.log(sortedSourceOccurAndPerc);
    //     setSourcePercentages(sortedSourceOccurAndPerc);
    //     // setShowData(true);
    //   }
    // });
    AnalyticAxios.get(`/api/LineChart/jockey_running_frequency_in_a_day/${StartDate}/${EndDate}`)
    .then((result) => {
      const getGridData = result.data.recordsets[1];
      setData(result.data.recordset);
      console.log(result.data.recordset, "data");

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
        setDataSource(result.data.recordsets[1].filter((item) => item["Difference in sec"] !== null));

        const counts = {};

        result.data.recordsets[1].forEach((item) => {
          const { Source } = item;
          const currentStatus = item["Difference in sec"];
          if (currentStatus !== null) {
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
        console.log(sortedSourceOccurAndPerc);
        setSourcePercentages(sortedSourceOccurAndPerc);
        // setShowData(true);
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });

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
    const firstDate = new Date();
    mnth = ("0" + (firstDate.getMonth() + 1)).slice(-2);
    day = ("0" + firstDate.getDate()).slice(-2);
    let StartDate = [firstDate.getFullYear(), mnth, day].join("-");
    let EndDate = [firstDate.getFullYear(), mnth, day].join("-");
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

  // if(!recordData.length ) return <h1>Loading</h1>
  // if(recordData[0]) {
  //   console.log("Here is dComplete ata",recordData);
  // }

  // if (!recordData) return <h1>Pending Data</h1>;

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
          <span //className="mainHead"
          >
            {" "}
            {state.PageTitle}
          </span>
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

      {/* <div class="seven">
  <h1>Style Seven</h1>
</div> */}
      <div className="singleRow">
        <div style={{ width: "100%" }}>
          <Line {...config} />
        </div>
      </div>
      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>
      <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
        <div style={{ flex: 1, marginRight: "16px" }}>
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
  ) : null;
};

export default Jockey_running_frequency_in_a_day;
