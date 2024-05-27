import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import { Line } from "@ant-design/plots";
import { useLocation, useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import AnalyticAxios from "../../Axios/Axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const items = [
  {
    label: "Day Filter",
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
const System2 = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [filterType, setFilterType] = useState(0);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState([]);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [showDefaultGraphs, setShowDefaultGraphs] = useState(true);

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);
    setShowDefaultGraphs(!selectedValue);
  };

  const handleAllPartnersClick = () => {
    setSelectedCategory(null); // Reset selected category
    setShowDefaultGraphs(true); // Show default graphs
  };

  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  const mystyle = {
    padding: "20px",
    borderStyle: "solid",
    borderColor: "gray",
    width: "50%",
    // height :'50%'
  };

  const stylePartner = {
    padding: "20px",
    borderStyle: "solid",
    borderColor: "gray",
    // width: "50%",
    // height :'50%'
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const getdata = (StartDate, EndDate) => {

    AnalyticAxios.get(`/api/LineChart/SYSTEM_2/${StartDate}/${EndDate}`)
    .then((result) => {
      const getGridData = result.data.recordset;
      setData(result.data.recordset);
      console.log(result.data.recordset);
      const categories = [
        ...new Set(result.data.recordset.map((item) => item.Category)),
      ];
      setUniqueCategories(categories);

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
    // Axios.get(`http://${window.location.hostname}:3005/SYSTEM_2/${StartDate}/${EndDate}`).then(
      
    //   (result) => {
    //     const getGridData = result.data.recordset;
    //     setData(result.data.recordset);
    //     const categories = [
    //       ...new Set(result.data.recordset.map((item) => item.Category)),
    //     ];
    //     setUniqueCategories(categories);

    //     const list = getGridData || [];
    //     if (list) {
    //       const firstObject = list[0] || {};
    //       const cols = [];
    //       for (const key in firstObject) {
    //         const col = {
    //           title: key,
    //           dataIndex: key,
    //           header: key,
    //           accessorKey: key,
    //           headerStyle: {
    //             backgroundColor: "#378FC3",
    //             color: "#FFF",
    //             fontSize: "17px",
    //             textAlign: "center",
    //             fontWeight: "bold",
    //           },
    //         };
    //         if (typeof firstObject[key] === "number") {
    //           col.filterVariant = "range";
    //           col.filterFn = "between";
    //           col.size = 80;
    //         }
    //         cols.push(col);
    //       }
    //       setColumns(cols);
    //       setDataSource(result.data.recordsets[1]);
    //     }
    //   }
    // );
  };

  const configData = {
    data: data
      .filter((e) => e.Category === "LRC_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
    heading: "LRC PARTNER ",
  };

  const config = {
    data: data
      .filter((e) => e.Category === "DCS_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
    heading: "DCS PARTNER ",
  };
console.log( data
  .filter((e) => e.Category === "SM_PARTNER_FAIL")
  .sort((a, b) => a.Date.localeCompare(b.Date)) ,"sm");
  const configSM = {
    data: data
      .filter((e) => e.Category === "SM_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },

    heading: "SM PARTNER ",
  };

  const configSWITCH = {
    data: data
      .filter((e) => e.Category === "SWITCH_PARTNER_FAIL")

      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },

    heading: "SWITCH PARTNER FAIL",
  };

  const configCCTV_SERVER = {
    data: data
      .filter((e) => e.Category === "CCTV_SERVER_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
    heading: "CCTV SERVER PARTNER ",
  };

  const configTFMS_Server = {
    data: data
      .filter((e) => e.Category === "TFMS_Server_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
    heading: "TFMS Server PARTNER ",
  };

  const configMCS = {
    data: data
      .filter((e) => e.Category === "MCS_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
    heading: "MCS PARTNER ",
  };

  const configCIU = {
    data: data
      .filter((e) => e.Category === "CIU_PARTNER_FAIL")
      .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        position: "middle",
        rotate: true,
        offsetX: 15,
      },
    },
    heading: "CIU PARTNER ",
  };

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  const columnHeaderStyle = {
    backgroundColor: "red",
    color: "white",
    // Add any other styles you want for the header here
  };

  const columnsWithHeaderStyle = columns.map((col) => ({
    ...col,
    headerStyle: columnHeaderStyle,
  }));

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
    console.log(StartDate, EndDate, "month");
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
    console.log(StartDate, EndDate, "between");
    getdata(StartDate, EndDate);
  };

  useEffect(() => {
    const date = new Date();
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
    console.log(StartDate, EndDate, "useeffect");
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
      <div
        style={{
          display: "flex",
          gap: "20px",
          justifyContent: "flex-end",
          paddingRight: "20px",
        }}
      >
        <FormControl sx={{ m: 1, width: 300, mt: 3 }}>
          <InputLabel id="demo-simple-select-label">Select Partners</InputLabel>
          <Select
            // multiple
            // displayEmpty
            value={selectedCategory || []}
            label="Select Partners"
            onChange={handleCategoryChange}
            input={<OutlinedInput />}
            MenuProps={MenuProps}
            inputProps={{ "aria-label": "Without label" }}
          >
            {/* <MenuItem disabled value="">
              <em>Select Partners</em>
            </MenuItem> */}
            {uniqueCategories &&
              uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* {selectedCategory && (
          <Button
            variant="outlined"
            sx={{ m: 1, width: 300, mt: 3 }}
            onClick={handleAllPartnersClick}
          >
            All Partners
          </Button>
        )} */}
      </div>

      {showDefaultGraphs && (
        <div>
          <div >
            <div style={stylePartner}>
              {configData.heading}
              <Line {...configData} />
            </div>
            {/* <div style={mystyle}>
              {configSM.heading}
              <Line {...configSM} />
            </div>
            <div style={mystyle}>
              {config.heading}
              <Line {...config} />
            </div>
            <div style={mystyle}>
              {configCCTV_SERVER.heading}
              <Line {...configCCTV_SERVER} />
            </div>
          </div>
          <br />
          <div style={{ display: "flex", gap: "20px" }}>
            <div style={mystyle}>
              {configSWITCH.heading}
              <Line {...configSWITCH} />
            </div>
            <div style={mystyle}>
              {configCIU.heading}
              <Column {...configCIU} />
            </div>
            <div style={mystyle}>
              {configMCS.heading}
              <Line {...configMCS} />
            </div>

            <div style={mystyle}>
              {configTFMS_Server.heading}
              <Line {...configTFMS_Server} />
            </div> */}
          </div>
        </div>
      )}

      {!showDefaultGraphs && selectedCategory && (
        <div>
          {selectedCategory === "LRC_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configData.heading}
              <Line {...configData} />
            </div>
          )}

          {selectedCategory === "CCTV_SERVER_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configCCTV_SERVER.heading}
              <Line {...configCCTV_SERVER} />
            </div>
          )}

          {selectedCategory === "SM_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configSM.heading}
              <Line {...configSM} />
            </div>
          )}
          {selectedCategory === "SWITCH_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configSWITCH.heading}
              <Line {...configSWITCH} />
            </div>
          )}
          {selectedCategory === "CIU_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configCIU.heading}
              <Line {...configCIU} />
            </div>
          )}
          {selectedCategory === "MCS_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configMCS.heading}
              <Line {...configMCS} />
            </div>
          )}
          {selectedCategory === "TFMS_Server_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {configTFMS_Server.heading}
              <Line {...configTFMS_Server} />
            </div>
          )}
          {selectedCategory === "DCS_PARTNER_FAIL" && (
            <div style={stylePartner}>
              {config.heading}
              <Line {...config} />
            </div>
          )}
        </div>
      )}

      <br />

      {/* <div className="float-end" style={{ marginLeft: "85rem" }}>
      //   <ExportCSVButton dataSource={dataSource} columns={columns} />
      //   <ExportToPdfButton data={dataSource} columns={columns} />
      // </div>
      // <br/>
      // <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
      //   <div style={{ flex: 1 }}>
      //     <MaterialReactTable
      //       className="custom-header-row"
      //       columns={columnsWithHeaderStyle}
      //       // columns={columns1}
      //       data={dataSource}
      //       enableStickyHeader
      //       muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
      //       initialState={{ density: "compact" }}
      //       enableFullScreenToggle={false}
      //       enableDensityToggle={false}
      //       enableGlobalFilter={false}
      //       // enableHiding={false}
      //       enableColumnResizing
      //       columnResizeMode="onEnd"
      //       enableRowNumbers
      //       rowNumberMode="original"
      //       muiTableBodyProps={{
      //         sx: {
      //           //stripe the rows, make odd rows a darker color
      //           "& tr:nth-of-type(odd)": {
      //             backgroundColor: "#f5f5f5",
      //           },
      //         },
      //       }}
      //       muiTableBodyCellProps={{
      //         sx: {
      //           borderRight: "2px solid #e0e0e0", //add a border between columns
      //         },
      //       }}
      //       muiTableProps={{
      //         headerStyle: headerStyle, // Apply the header style here
      //       }}
      //     />
      //   </div>
      // </div> */}
    </div>
  ) : (
    ""
  );
};
export default System2;
