import React, { useState, useEffect } from "react";
import { Column } from "@ant-design/plots";
import "./firengine.scss";
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
    label: "Year Filter",
    key: "0",
  },
  // {
  //   label: "Month Filter",
  //   key: "1",
  // },
  {
    label: "Range Filter",
    key: "1",
  },
];

const { RangePicker } = DatePicker;
const FE03 = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [showData, setShowData] = useState(false);
  const [data, setData] = useState([]);
  const [record, setRecord] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [widges, setWidges] = useState([]);
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
  const [open, setOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState("Year Filter");
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
    yField: "STATUS",
    seriesField: "STATUS",
    color :({STATUS})=>{
        return STATUS == "RUN" ? 'GREEN':'RED'
    },
    isGroup: true,
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
        text: "STATUS",
      },
    },
  };

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate);
    // Axios.get(
    //   `http://${window.location.hostname}:3005/FE_is_not_run_for_four_hours_in_a_year/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   console.log(result.data.recordsets[0],"dtaa");
    //   setData(result.data.recordsets[0]);
    //   setWidges(result.data.recordsets[2]);
    //   console.log(result.data.recordsets[0]);

    //   const getGridData = result.data.recordsets[1];
    //   const Total_FE = new Set(getGridData.map((record) => record.Source));
    //   const record = [...Total_FE].map((rec) => rec);
    //   setRecord(record);
    //   // console.log(record,"rec");
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
    AnalyticAxios.get(`/api/ColumnChart/FE_is_not_run_for_four_hours_in_a_year/${StartDate}/${EndDate}`)
    .then((result) => {
      setData(result.data.recordsets[0]);
      setWidges(result.data.recordsets[2]);
      console.log(result.data.recordsets[0]);

      const getGridData = result.data.recordsets[1];
      const Total_FE = new Set(getGridData.map((record) => record.Source));
      const record = [...Total_FE].map((rec) => rec);
      setRecord(record);
      // console.log(record,"rec");
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
    // Assume you have selectedDate from the calendar as a valid Date object
    const selectedDate = new Date(e); // Replace this line with the selected date from the calendar

    // Calculate the first date of the year
    const firstDateOfYear = new Date(selectedDate.getFullYear(), 0, 1);

    // Calculate the last date of the year (with time set to the end of the day)
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

  // const fetchData = (e) => {
  //   e?.preventDefault();
  //   const InputValue = selectionOfValue;
  //   const Series = selectionSeries;

  //   Axios({
  //     method: "get",
  //     url: "http://${window.location.hostname}:3005/selectionOfInput/",
  //     params: {
  //       InputValue: InputValue,
  //       Series: Series,
  //       fromDateValue: fromDateValue,
  //       toDateValue: toDateValue,
  //       todaysDate: todaysDate,
  //       toMonthValue: toMonthValue,
  //     },
  //   }).then((result) => {
  //     setData(result.data.recordset);
  //     const list = result.data.recordset || [];
  //     if (list) {
  //       const firstObject = list[0] || {};
  //       const cols = [];
  //       for (const key in firstObject) {
  //         const col = {
  //           title: key,
  //           dataIndex: key,
  //         };
  //         cols.push(col);
  //       }
  //       setColumns(cols);
  //       setDataSource(result.data.recordset);
  //       setShowData(true);
  //     }
  //   });
  // };

  useEffect(() => {
    // fetchData();
    const widgesdata = widges.map((x) => x.EntityName);
    // console.log(widgesdata, "widges");
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
              {/* <DatePicker
                placeholder={Date()}
                // defaultValue={dayjs(monthName)}
                value={month}
                onChange={(e) => handleMonth(e)}
                style={{
                  display: `${selectedKey != "Month Filter" ? "none" : ""}`,
                }}
                picker="month"
              /> */}
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
export default FE03;
