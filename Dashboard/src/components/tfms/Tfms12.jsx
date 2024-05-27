import React, { useState, useEffect } from "react";
import moment from "moment";
import "./tfms.scss";
import Axios from "axios";
import { Table } from "ant-table-extensions";
import { DatePicker } from "antd";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button, selectedKeys } from "antd";
import * as dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
import { MaterialReactTable } from "material-react-table";
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
const Tfms12 = () => {
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
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [percentage, setPercentage] = useState(null);
  const [sourcePercentages, setSourcePercentages] = useState([]);
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const getdata = (StartDate, EndDate) => {
    // console.log(StartDate, EndDate);
    Axios.get(`http://${window.location.hostname}:3005/TFMS12/${StartDate}/${EndDate}`).then(
      (result) => {
        setData(result.data.recordset);
        // console.log(result.data.recordset ,"result.data.recordset");
        const getGridData = result.data.recordset;

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
          setDataSource(result.data.recordset.filter(item => item.Description !== null));
        }
      }
    );
  };

  const hcdDetector = () => {
    const sourceOccurrences = {};
    data.forEach(entry => {
      const source = entry.Source.replace('_HI', ''); // Remove '_HI' from the source
      if (!sourceOccurrences[source]) {
        sourceOccurrences[source] = 0; // Initialize count to 0 if not present
      }

      // Increment count if Description is not null
      if (entry.Description !== null) {
        sourceOccurrences[source]++;
      }
    });
    console.log(sourceOccurrences, "sourceOccurrences"); ///6

    const sourceOccurAndPercArray = Object.entries(sourceOccurrences);

    sourceOccurAndPercArray.sort((a, b) => b[1] - a[1]);

    const sortedSourceOccurAndPerc = Object.fromEntries(
      sourceOccurAndPercArray
    );
    console.log(sourceOccurrences, "sourceOccurrences");
    setSourcePercentages(sortedSourceOccurAndPerc);
  };

  const columns1 = [
    {
      id: "TankName",
      title: "Source",
      field: "TankName",
      header: "Source",
      accessorKey: "TankName",
    },
    {
      id: "Percentage",
      title: "Count of Occurences", // Update the title here
      field: "Percentage",
      header: "Count of Occurences", // Update the header here
      accessorKey: "Percentage",
    },
  ];

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
    console.log(StartDate, EndDate, "TODAY");
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

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  useEffect(() => {
    // fetchData();
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

  useEffect(() => {
    hcdDetector();
  }, [data]);

  useEffect(() => {
    // Calculate counts and percentages when the component mounts
    const counts = data.reduce((accumulator, item) => {
      if (item.sourcevalue) {
        accumulator[item.sourcevalue] =
          (accumulator[item.sourcevalue] || 0) + item.count;
      }
      return accumulator;
    }, {});

    // Calculate the total sum
    const totalSum = Object.values(counts).reduce(
      (sum, count) => sum + count,
      0
    );

    // Calculate percentages
    const percentages = {};

    for (const sourcevalue in counts) {
      percentages[sourcevalue] = (counts[sourcevalue] / totalSum) * 100;
    }

    // Set the 'percentage' state
    setPercentage(percentages);
  }, [data]);
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
                handleYear(e);
              }}
              picker="year"
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
            <div>
            <DatePicker
          defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
          onChange={(e) => {
            handleToday(e);
          }}
          style={{
            display: `${selectedKey != "Day Filter" ? "none" : ""}`,
          }}
          disabledDate={(current) => {
            return moment().add(-1, "days") <= current;
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

            <br />
          </div>
        </div>
      </div>
      <br />
      <div className="float-end" style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataSource} columns={columns} />
        <ExportToPdfButton data={dataSource} columns={columns} />
      </div>

      <div style={{ display: "flex" }}>
        <div style={{ flex: 1, marginRight: "16px" }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns1}
            data={
              Object.entries(sourcePercentages).map(
                ([TankName, Percentage]) => ({
                  TankName,
                  Percentage: parseFloat(Percentage),
                })
              )

              // Object.entries(sourcePercentages).map(([TankName, Percentage]) => ({
              //   TankName: TankName.split('_').slice(0, -1).join('_'), // Remove the last 3 words or digits
              //   Percentage: parseFloat(Percentage).toFixed(2),
              // }))
            }
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
export default Tfms12;
