import React, { useEffect, useState } from "react";
import { Column, Line } from "@ant-design/plots";
import Axios from "axios";
import { Table } from "ant-table-extensions";
import { DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button, selectedKeys } from "antd";
import * as dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import "./tfms.scss";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
import AnalyticAxios from "../../Axios/Axios";
const items = [
  {
    label: "Month Filter",
    key: "0",
  },
  {
    label: "year Filter",
    key: "1",
  },
  {
    label: "Range Filter",
    key: "2",
  },
];

const { RangePicker } = DatePicker;
const Tfms4 = (props) => {
  const { state } = useLocation();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [currentValue, setCurrentValue] = useState(new Date());
  const [todaysDate, setToday] = useState(null);
  const [fromDateValue, setgetfromdate] = useState(null);
  const [toDateValue, setgettodate] = useState(null);
  const [toMonthValue, setgettomonth] = useState(null);
  const [month, setMonth] = useState("");
  const [filterType, setFilterType] = useState(0);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [selectionOfValue, setselectionOfValue] = useState();
  const [selectionSeries, setselectionSeries] = useState();
  const [selectedKey, setSelectedKey] = useState("Month Filter");
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };
  const date = new Date(),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  const getfromdate = [date.getFullYear(), mnth, day].join("-");
  // const month = [date.getFullYear(), mnth].join("-");
  // console.log(getfromdate, "date");

  const config = {
    data,
    xField: "Source",
    yField: "SourceValue",
    seriesField: "SourceValue",
    color: ({ SourceValue }) => {
      console.log(SourceValue, "source");
      return SourceValue == "Not Tested" ? "RED" : "green";
    },
    // color: "#138D20",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 16,
      },
      title: {
        text: "ESD",
      },
      
    },
    yAxis: {
      title: {
        text: "Status",
      },
    },
    label: {
      position: "top", // Display the label on top of the column
      visible: ({ Occurences }) => Occurences > 0, // Display when occurces is greater than 1
      style: {
        fill: "#000",
      },
      content: ({ Occurences }) => (Occurences  ? Occurences : null),
    },
    // tooltip: {
    //   customContent: <CustomTooltip />,
    // },
  };

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate);
    // Axios.get(
    //   `http://${window.location.hostname}:3005/ESD_not_tested_in_month/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   setData(result.data.recordset);
    //   console.log(result.data.recordset, "data");
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

    AnalyticAxios.get(`/api/ColumnChart/ESD_not_tested_in_month/${StartDate}/${EndDate}`)
    .then((result) => {
      setData(result.data.recordset);
      console.log(result.data.recordset, "data");
      const getGridData = result.data.recordsets[1];
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
        setDataSource(result.data.recordsets[1]);
        // setShowData(true);
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
  };

  const handleYear = (e) => {
    const selectedDate = new Date(e);

    const firstDateOfYear = new Date(selectedDate.getFullYear(), 0, 1);

    const lastDateOfYear = new Date(selectedDate.getFullYear() + 1, 0, 1);
    lastDateOfYear.setMilliseconds(lastDateOfYear.getMilliseconds() - 1);

    // Format the dates with time
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
    console.log(StartDate, EndDate, "year");
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
    console.log(StartDate, EndDate, "range");
    getdata(StartDate, EndDate);
  };

  useEffect(() => {
    const date = new Date();
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
    // console.log(StartDate, EndDate);
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
              defaultValue={dayjs(getfromdate, "YYYY")}
              onChange={(e) => {
                handleYear(e);
              }}
              picker="year"
              style={{
                display: `${selectedKey != "year Filter" ? "none" : ""}`,
              }}
            />
            <DatePicker
              placeholder={Date()}
              // defaultValue={dayjs(month, "mm")}
              value={month}
              onChange={(e) => handleMonth(e)}
              style={{
                display: `${selectedKey != "Month Filter" ? "none" : ""}`,
              }}
              picker="month"
              format="MMMM"
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
      {/* <div className="table">
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
export default Tfms4;
