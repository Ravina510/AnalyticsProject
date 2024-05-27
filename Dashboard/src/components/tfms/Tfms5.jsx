import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { Column } from "@ant-design/plots";
import "./tfms.scss";
import Axios from "axios";
import { Table } from "ant-table-extensions";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
import { processFetchedData } from "../FetchTableData/processFetchedData";
const items = [
  {
    label: "Year Filter",
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
const Tfms5 = () => {
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [record, setRecord] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [widges, setWidges] = useState([]);
  const [month, setMonth] = useState("");
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Year Filter");
  const [sourcePercentages, setSourcePercentages] = useState([]);
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");
  console.log(getfromdate);

  const config = {
    data,
    xField: "Source",
    yField: "Status",
    seriesField: "Status",
    color: ({ Status }) => {
      return Status == "Not Tested" ? "red" : "green";
    },

    // isGroup: true,
    // columnStyle: {
    //   radius: [20, 20, 0, 0],
    // },
    xAxis: {
      title: {
        text: "Tank names",
      },
      label: {
        position: "middle",
        rotate: true,
        offsetX: 16,
      },
    },
    yAxis: {
      title: {
        text: "Status",
      },
    },
    label: {
      position: "top", // Display the label on top of the column
      visible: ({ Count }) => Count, // Display when occurces is greater than 1
      style: {
        fill: "#000",
      },
      content: ({ Count }) => (Count ? Count : null),
    },
  };

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate, "aops");
    Axios.get(
      `http://${window.location.hostname}:3005/AOPS_not_tested_as_per_their_PTI_interval/${StartDate}/${EndDate}`
    ).then((result) => {
      setData(result.data.recordset);
      console.log(result.data.recordset, "data");

      const getGridData = result.data.recordsets[1];
      const { columns, dataSource } = processFetchedData(getGridData);
      setColumns(columns);
      setDataSource(dataSource);

      // const list = getGridData || [];
      // if (list) {
      //   const firstObject = list[0] || {};
      //   const cols = [];
      //   for (const key in firstObject) {
      //     const col = {
      //       title: key,
      //       dataIndex: key,
      //       header: key,
      //       accessorKey: key,
      //       headerStyle: {
      //         backgroundColor: "#378FC3",
      //         color: "#FFF",
      //         fontSize: "17px",
      //         textAlign: "center",
      //         fontWeight: "bold",
      //       },
      //     };
      //     if (typeof firstObject[key] === "number") {
      //       col.filterVariant = "range";
      //       col.filterFn = "between";
      //       col.size = 80;
      //     }
      //     cols.push(col);
      //   }
      //   setColumns(cols);
      //   setDataSource(
      //     result.data.recordsets[1].filter((item) => item.Source !== null)
      //   );
      // }
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

  const handleYear = (e) => {
    const selectedDate = new Date(e);
    console.log(selectedDate);
    // const date1 = new Date(selectedDate);
    // const year = date1.getFullYear();
    // const month = String(date1.getMonth() + 1).padStart(2, "0");
    // const day1 = String(date1.getDate()).padStart(2, "0");
    // const hours = String(date1.getHours()).padStart(2, "0");
    // const minutes = String(date1.getMinutes()).padStart(2, "0");
    // const seconds = String(date1.getSeconds()).padStart(2, "0");
    // const StartDate = `${year}-${month}-${day1} ${hours}:${minutes}:${seconds}`;
    var date = selectedDate,
        mnth = ("0" + (date.getMonth() + 1)).slice(-2),
        day = ("0" + date.getDate()).slice(-2);
    let EndDate = [date.getFullYear(), mnth, day].join("-");


    var last365DaysTimestamp = selectedDate.setFullYear(
      selectedDate.getFullYear() - 1
    );
    var last365DaysDate = new Date(last365DaysTimestamp);
    var StartDate = last365DaysDate.toISOString().split("T")[0];

    console.log(StartDate, EndDate);
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
    // console.log(StartDate, EndDate);
    getdata(StartDate, EndDate);
  };

  useEffect(() => {
    var last365DaysTimestamp = new Date().setFullYear(
      new Date().getFullYear() - 1
    );
    var last365DaysDate = new Date(last365DaysTimestamp);
    var StartDate = last365DaysDate.toISOString().split("T")[0];

    var date = new Date(),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    let EndDate = [date.getFullYear(), mnth, day].join("-");

    console.log(StartDate, EndDate, "dataes");
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
          <span>{state.PageTitle}</span>
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
                handleYear(e);
              }}
              // picker="year"
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
      <br></br>
      {/* <p style={{textAlign:"right"}}>Note:by default duration is one year</p> */}
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
                Percentage : parseFloat(Percentage).toFixed(2),
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
        </div> */}
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
export default Tfms5;
