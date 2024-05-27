import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
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
const FE_freq_engine_wise_for_min_30m_in_a_week = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
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
  const [selectedKey, setSelectedKey] = useState("Weekly Filter");
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
    yField: "Count",
    seriesField: "Count",
    color: ["#5B8FF9"],
    columnStyle: {
      // radius: [20, 20, 0, 0],
    },
    xAxis: {
      title: {
        text: "Fire engines",
      },
    },
    yAxis: {
      title: {
        text: "Total Count",
      },
    },
  };

  const getdata = (StartDate, EndDate) => {
    console.log(StartDate, EndDate);
    // Axios.get(
    //   `http://${window.location.hostname}:3005/FE_freq_engine_wise_for_min_30m_in_a_week/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   setData(result.data.recordsets[0]);
    //   console.log(result.data.recordsets[0], "data found");
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
    //   }
    // });
    AnalyticAxios.get(`/api/ColumnChart/FE_freq_engine_wise_for_min_30m_in_a_week/${StartDate}/${EndDate}`)
    .then((result) => {
      setData(result.data.recordsets[0]);
      console.log(result.data.recordsets[0], "data found");
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
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });

  };

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


  const changeColor = () => {
    // console.log("hi");
    // console.log(data);
  };

  useEffect(() => {

    changeColor();

    var today = new Date();
    const firstDay = new Date(today.setDate(today.getDate() - today.getDay()));
    var getdate = new Date(firstDay),
      mnth = ("0" + (getdate.getMonth() + 1)).slice(-2),
      day = ("0" + getdate.getDate()).slice(-2);
    let StartDate = [getdate.getFullYear(), mnth, day].join("-");

    let EndDate = [getdate.getFullYear(), mnth, day].join("-");
    // console.log(EndDate, StartDate, "lastDay");

    getdata(StartDate, EndDate);
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      // console.log(loggedInUser);
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
                handleWeek(e);
              }}
              picker="week"
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

      <div className="singleRow">
        <div style={{ width: "100%" }}>
          <Column {...config} />
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
export default FE_freq_engine_wise_for_min_30m_in_a_week;
