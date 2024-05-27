import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { MaterialReactTable } from "material-react-table";
import * as dayjs from "dayjs";
import { DatePicker } from "antd";
import "./tfms.scss";
import { useLocation, useNavigate } from "react-router-dom";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
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
const Tfms15 = (props) => {
  const [isLoggedin, setIsLoggedin] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState([]);
  const [data_foam, setDataFoam] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  const containerStyle = {
    borderStyle: "solid",
    borderColor: "gray",
    marginBottom: "10px", // Adjust the margin as needed for spacing between containers
    padding: "10px",
    // width:'50%',// Add padding for better spacing within containers
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const getdata = (StartDate, EndDate) => {
    
    AnalyticAxios.get(`/api/ColumnChart/tanks_sprinkler_and_foam_facility/${StartDate}/${EndDate}`)
            .then((result) => {
              const getGridData = result.data.recordset; //result.data.recordsets[1];
              // console.log("Testing print", result.data.recordsets[0]);
              // setData(() => getGridData);
              const FOAM_LIST = [];
              const SPRINKLER_LIST = [];
        
              // Iterate through the data
              getGridData.forEach((entry) => {
                // Check if entry and entry.Source are not null or undefined
                if (entry && entry.Source && typeof entry.Source === "string") {
                  // Update the SourceValue based on the condition
                  entry.SourceValue = entry.SourceValue === 'ON' ? "Tested" : "Not Tested";
              
                  // Check if Source ends with 'FOAM' or 'SP1'
                  if (entry.Source.endsWith("FOAM")) {
                    FOAM_LIST.push(entry);
                  } else if (entry.Source.endsWith("SP1")) {
                    SPRINKLER_LIST.push(entry);
                  }
                } else {
                  // console.error('Invalid entry or entry.Source:', entry);
                  FOAM_LIST.push(entry);
                  SPRINKLER_LIST.push(entry);
                }
              });
        
              // Log the results
              console.log("FOAM_LIST:", FOAM_LIST);
              console.log("SPRINKLER_LIST:", SPRINKLER_LIST);
              setData(() => SPRINKLER_LIST);
              setDataFoam(FOAM_LIST);
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
                setDataSource(result.data.recordset.filter(item => item.Source !== null));
              }
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    // Axios.get(
    //   `http://${window.location.hostname}:3005/tanks_sprinkler_and_foam_facility/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   const getGridData = result.data.recordset; //result.data.recordsets[1];
    //   // console.log("Testing print", result.data.recordsets[0]);
    //   // setData(() => getGridData);
    //   const FOAM_LIST = [];
    //   const SPRINKLER_LIST = [];

    //   // Iterate through the data
    //   getGridData.forEach((entry) => {
    //     // Check if entry and entry.Source are not null or undefined
    //     if (entry && entry.Source && typeof entry.Source === "string") {
    //       // Update the SourceValue based on the condition
    //       entry.SourceValue = entry.SourceValue === 'ON' ? "Tested" : "Not Tested";
      
    //       // Check if Source ends with 'FOAM' or 'SP1'
    //       if (entry.Source.endsWith("FOAM")) {
    //         FOAM_LIST.push(entry);
    //       } else if (entry.Source.endsWith("SP1")) {
    //         SPRINKLER_LIST.push(entry);
    //       }
    //     } else {
    //       // console.error('Invalid entry or entry.Source:', entry);
    //       FOAM_LIST.push(entry);
    //       SPRINKLER_LIST.push(entry);
    //     }
    //   });

    //   // Log the results
    //   console.log("FOAM_LIST:", FOAM_LIST);
    //   console.log("SPRINKLER_LIST:", SPRINKLER_LIST);
    //   setData(() => SPRINKLER_LIST);
    //   setDataFoam(FOAM_LIST);
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
    //     setDataSource(result.data.recordset.filter(item => item.Source !== null));
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

  const config = {
    data: data,
    xField: "Source",
    yField: "SourceValue",
    seriesField: "SourceValue",
    color: ({ SourceValue }) => {
      return SourceValue == "Tested" ? "green" : "red";
    },
    plotOptions: {
      series: {
        pointWidth: 20,
      },
    },
    columnStyle: {
      // radius: [20, 20, 0, 0],
    },
    xAxis: {
      title: {
        text: "Tanks",
      },
    },
    yAxis: {},
  };

  const configData = {
    data: data_foam,
    xField: "Source",
    yField: "SourceValue",
    // yField : ({SourceValue})=>{return SourceValue == "ON" ? "TESTED" : "Not Tested";},
    seriesField: "SourceValue",
    color: ({ SourceValue }) => {
      return SourceValue == "Tested" ? "green" : "red";
    },
    plotOptions: {
      series: {
        pointWidth: 20,
      }
    },
    columnStyle: {
      // radius: [20, 20, 0, 0],
    },

    xAxis: {
      title: {
        text: "Tanks",
      },
    },
    yAxis: {},
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

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      // console.log(loggedInUser);
      setIsLoggedin(loggedInUser);
    }
  }, []);

  if (!data) {
    return;
    <div>Loading...</div>;
  }

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
          {/* <Dropdown
            menu={{
              items,
              onClick,
            }}
            trigger={["click"]}
          >
            <Button onClick={(e) => e.preventDefault()}>
              <Space>
                {filterType === 0
                  ? "Select Filter Type"
                  : items[filterType].label}
                <DownOutlined />
              </Space>
            </Button>
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
            />
            <br />
          </div> */}
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

      <div style={containerStyle}>
        <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
          <div style={{ width: "50%" }}>
            <div style={containerStyle}>
              <p>LIST OF TANKS SPRINKLER</p>
              <Column {...config} />
            </div>
          </div>
          <div style={{ width: "50%" }}>
            <div style={containerStyle}>
              <p>LIST OF FOAM FACILITY</p>
              <Column {...configData} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>
      <div style={{ zIndex: "0", position: "relative" }}>
        <MaterialReactTable
          className="custom-header-row"
          columns={columns}
          data={dataSource}
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
  ) : (
    ""
  );
};
export default Tfms15;
