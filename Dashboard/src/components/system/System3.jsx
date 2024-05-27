import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import { Table } from "ant-table-extensions";
import { DownOutlined } from "@ant-design/icons";
import { Dropdown, Space, Button, selectedKeys } from "antd";
import * as dayjs from "dayjs";
import { Line } from "@ant-design/plots";
import { useLocation, useNavigate } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import InputLabel from "@mui/material/InputLabel";
import { MaterialReactTable } from "material-react-table";

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
const System3 = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [filterType, setFilterType] = useState(0);
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [data, setData] = useState([]);
  const [dataPercentage, setDataPercentage] = useState([]);
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [showDefaultGraphs, setShowDefaultGraphs] = useState(true);
  const [showDefaultGrid, setShowDefaultGrid] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [uniqueCategories, setUniqueCategories] = useState([]);
  const [datagridLRC, setDatagridLRC] = useState([]);
  const [datagridCIU, setDatagridCIU] = useState([]);
  const [datagridDCS, setDatagridDCS] = useState([]);
  const [datagridCCTV, setDatagridCCTV] = useState([]);
  const [datagridMCS, setDatagridMCS] = useState([]);

  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  const stylePartner = {
    // padding: "20px",
    borderStyle: "solid",
    borderColor: "gray",
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const getdata = (StartDate, EndDate) => {
    Axios.get(`http://${window.location.hostname}:3005/SYSTEM_3/${StartDate}/${EndDate}`).then(
      (result) => {
        const getGridData = result.data.recordsets[1];
        setDataPercentage(getGridData);
        setData(result.data.recordset);
        console.log(result.data.recordset,'data');
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
          // .filter(
          // (item) => item["Difference in SEC"] !== null));
        }
      }
    );
  };

  const configLRC = {
    data: data.filter((e) => e.Category === "LRC_PARTNER_PERC"),
    //.sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        rotate: 45,
        offsetY: 15,
      },
    },
    heading: "LRC PARTNER ",
  };

  const configCCTV = {
    data: data.filter((e) => e.Category === "CCTV_PARTNER_PERC"),
    // .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        rotate: 45,
        offsetY: 15,
      },
    },
    heading: "CCTV PARTNER ",
  };

  const configCIU = {
    data: data.filter((e) => e.Category === "CIU_PARTNER_PERC"),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        rotate: 45,
        offsetY: 15,
      },
    },
    heading: "CIU PARTNER ",
  };

  const configDCS = {
    data: data.filter((e) => e.Category === "DCS_PARTNER_PERC"),
    // .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        rotate: 45,
        offsetY: 15,
      },
    },
    heading: "DCS PARTNER ",
  };

  const configMCS = {
    data: data.filter((e) => e.Category === "MCS_PARTNER_PERC"),
    // .sort((a, b) => a.Date.localeCompare(b.Date)),
    xField: "Date",
    yField: "Status",
    seriesField: "Source",
    xAxis: {
      label: {
        rotate: 45,
        offsetY: 15,
      },
    },
    heading: "MCS PARTNER ",
  };

  const columnHeaderStyle = {
    backgroundColor: "red",
    color: "white",
    // Add any other styles you want for the header here
  };

  useEffect(() => {
    const CIU_PARTNER = {};
    const CIU_percentage = dataPercentage.filter(
      (e) => e.Category === "CIU_PARTNER_PERC"
    );
    CIU_percentage.forEach((row) => {
      const differenceValue = parseInt(row["Difference in SEC"], 10);
      if (!isNaN(differenceValue)) {
        CIU_PARTNER[row.Source] =
          (CIU_PARTNER[row.Source] || 0) + differenceValue;
      } else {
        // Handle the case where "Difference in SEC" is not a valid integer
        CIU_PARTNER[row.Source] = CIU_PARTNER[row.Source] || 0;
      }
    });
    const resultsObject = {};
    for (const source in CIU_PARTNER) {
      resultsObject[source] = (CIU_PARTNER[source] / 3600 / 24) * 100;
    }
    const CIUResultsObject = {};
    Object.keys(resultsObject).forEach((source) => {
      const currentNumber = parseInt(source.match(/(\d+)/)[0], 10);
      const nextNumber =
        currentNumber % 2 === 0 ? currentNumber - 1 : currentNumber + 1;

      const nextSource = `CIU${nextNumber.toFixed(0).padStart(2, "0")}_STS`;

      CIUResultsObject[source] = resultsObject[source];
      CIUResultsObject[nextSource] = 100 - resultsObject[source];
    });

    const lastCIUMap = new Map();
    const partnerCIU = data.filter((e) => e.Category === "CIU_PARTNER_PERC");

    partnerCIU.forEach((entry) => {
      const source = entry.Source;
      lastCIUMap.set(source, entry);
    });

    // Get the values (last entries) from the Map
    const lastCIUList = Array.from(lastCIUMap.values());

    // Print the result
    lastCIUList.forEach((entry) => {
      const source = entry.Source;

      if (!(source in CIUResultsObject)) {
        // If the source is not in CIUResultsObject, use the status from lastCIUList
        CIUResultsObject[source] = entry.Status;
      }
    });

    setDatagridCIU(CIUResultsObject);
    //END CIU PARTNER PERCENTAGE

    //LRC PARTNER PERCENTAGE
    const LRC_PARTNER = {};
    const LRC_percentage = dataPercentage.filter(
      (e) => e.Category === "LRC_PARTNER_PERC"
    );
    LRC_percentage.forEach((row) => {
      const differenceLRC = parseInt(row["Difference in SEC"], 10);
      if (!isNaN(differenceLRC)) {
        LRC_PARTNER[row.Source] =
          (LRC_PARTNER[row.Source] || 0) + differenceLRC;
      }
    });
    const resultsObjectLRC = {};
    for (const source in LRC_PARTNER) {
      const value = (LRC_PARTNER[source] / 3600 / 24) * 100;
      resultsObjectLRC[source] = value;
    }
    const lastEntriesMap = new Map();
    const partnerlrc = data.filter((e) => e.Category === "LRC_PARTNER_PERC");

    partnerlrc.forEach((entry) => {
      const source = entry.Source;
      lastEntriesMap.set(source, entry);
    });

    // Get the values (last entries) from the Map
    const lastEntriesList = Array.from(lastEntriesMap.values());

    // Print the result
    lastEntriesList.forEach((entry) => {
      const source = entry.Source;

      if (!(source in resultsObjectLRC)) {
        // If the source is not in resultsObjectLRC, use the status from lastEntriesList
        resultsObjectLRC[source] = entry.Status;
      }
    });


    setDatagridLRC(resultsObjectLRC);
    //end lrc percentage

    //DCS STARTED
    const DCS_PARTNER = {};
    const DCS_percentage = dataPercentage.filter(
      (e) => e.Category === "DCS_PARTNER_PERC"
    );
    DCS_percentage.forEach((row) => {
      const differenceDCS = parseInt(row["Difference in SEC"], 10);
      if (!isNaN(differenceDCS)) {
        DCS_PARTNER[row.Source] =
          (DCS_PARTNER[row.Source] || 0) + differenceDCS;
      }
  
    });
    const resultsDCS = {};
    for (const source in DCS_PARTNER) {
      resultsDCS[source] = (DCS_PARTNER[source] / 3600 / 24) * 100;
    }
    const lastDCSMap = new Map();
    const partnerdcs = data.filter((e) => e.Category === "DCS_PARTNER_PERC");

    partnerdcs.forEach((entry) => {
      const source = entry.Source;
      lastDCSMap.set(source, entry);
    });

    const lastDCSList = Array.from(lastDCSMap.values());

    // Print the result
    lastDCSList.forEach((entry) => {
      const source = entry.Source;

      if (!(source in resultsDCS)) {
        // If the source is not in resultsDCS, use the status from lastDCSList
        resultsDCS[source] = entry.Status;
      }
    });
    setDatagridDCS(resultsDCS);
    //DCS ENDED

    //CCTV
    const CCTV_PARTNER = {};
    const CCTV_percentage = dataPercentage.filter(
      (e) => e.Category === "CCTV_PARTNER_PERC"
    );
    CCTV_percentage.forEach((row) => {
      const differenceCCTV = parseInt(row["Difference in SEC"], 10);
      if (!isNaN(differenceCCTV)) {
        CCTV_PARTNER[row.Source] =
          (CCTV_PARTNER[row.Source] || 0) + differenceCCTV;
      }

    });
    const resultsCCTV = {};
    for (const source in CCTV_PARTNER) {
      resultsCCTV[source] = (CCTV_PARTNER[source] / 3600 / 24) * 100;
    }

    const lastCCTVMap = new Map();
    const partnercctv = data.filter((e) => e.Category === "CCTV_PARTNER_PERC");

    partnercctv.forEach((entry) => {
      const source = entry.Source;
      lastCCTVMap.set(source, entry);
    });

    // Get the values (last entries) from the Map
    const lastCCTVList = Array.from(lastCCTVMap.values());

    // Print the result
    lastCCTVList.forEach((entry) => {
      const source = entry.Source;

      if (!(source in resultsCCTV)) {
        // If the source is not in resultsCCTV, use the status from lastCCTVList
        resultsCCTV[source] = entry.Status;
      }
    });
    setDatagridCCTV(resultsCCTV);
    //CCTV ENDED

    //MCS
    const MCS_PARTNER = {};
    const MCS_percentage = dataPercentage.filter(
      (e) => e.Category === "MCS_PARTNER_PERC"
    );
    MCS_percentage.forEach((row) => {
      const differenceMCS = parseInt(row["Difference in SEC"], 10);
      // if (!isNaN(differenceMCS)) {
      //   MCS_PARTNER[row.Source] =
      //     (MCS_PARTNER[row.Source] || 0) + differenceMCS;
      // }
      if (!isNaN(differenceMCS)) {
        MCS_PARTNER[row.Source] =
          (MCS_PARTNER[row.Source] || 0) + differenceMCS;
      }
      // else {
      //   // Handle the case where "Difference in SEC" is not a valid integer
      //   MCS_PARTNER[row.Source] = MCS_PARTNER[row.Source] || 0;
      // }
    });
    const resultsMCS = {};
    for (const source in MCS_PARTNER) {
      resultsMCS[source] = (MCS_PARTNER[source] / 3600 / 24) * 100;
    }
    const lastMCSMap = new Map();
    const partnermcs = data.filter((e) => e.Category === "MCS_PARTNER_PERC");

    partnermcs.forEach((entry) => {
      const source = entry.Source;
      lastMCSMap.set(source, entry);
    });

    // Get the values (last entries) from the Map
    const lastMCSList = Array.from(lastMCSMap.values());

    // Print the result
    lastMCSList.forEach((entry) => {
      const source = entry.Source;

      if (!(source in resultsMCS)) {
        // If the source is not in resultsMCS, use the status from lastMCSList
        resultsMCS[source] = entry.Status;
      }
    });
    setDatagridMCS(resultsMCS);
    //MCS ENDED
  }, [data]);

  const columnsWithHeaderStyle = columns.map((col) => ({
    ...col,
    headerStyle: columnHeaderStyle,
  }));

  const handleCategoryChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCategory(selectedValue);
    // setDatagridLRC(resultsObjectLRC);
    setShowDefaultGraphs(!selectedValue);
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
    getdata(StartDate, EndDate);
  }, []);

  useEffect(() => {
    // Update the showDefaultGrid state based on the selected category
    setShowDefaultGrid(selectedCategory === "LRC_PARTNER_PERC");
  }, [selectedCategory]);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      setIsLoggedin(loggedInUser);
    }
  }, []);

  const columns1 = [
    {
      id: "Source",
      title: "Source",
      field: "Source",
      header: "Source",
      accessorKey: "Source",
    },
    {
      id: "stdPercentage",
      title: "STANDBY Percentage", // Update the title here
      field: "stdPercentage",
      header: "STANDBY Percentage", // Update the header here
      accessorKey: "stdPercentage",
    },
    {
      id: "primaryPercentage",
      title: "MASTER Percentage", // Update the title here
      field: "primaryPercentage",
      header: "MASTER Percentage", // Update the header here
      accessorKey: "primaryPercentage",
    },
  ];

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

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
            <MenuItem disabled value="">
              <em>Select Partners</em>
            </MenuItem>
            {uniqueCategories &&
              uniqueCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </div>

  
      {showDefaultGraphs && (
        <div>
          <div style={stylePartner}>
            {configCIU.heading}
            <div>
              <Line {...configCIU} />
            </div>
          </div>
          <br />
          <div style={{ display: "flex", zIndex: "0", position: "relative" }}>
            <div style={{ flex: 1, marginRight: "16px" }}>
              {datagridCIU && (
                <div style={{ flex: 1, marginRight: "16px" }}>
                  <MaterialReactTable
                    className="custom-header-row"
                    columns={columns1}
                    data={Object.entries(datagridCIU).map(
                      ([Source, stdPercentage, primaryPercentage]) => ({
                        Source,
                        // stdPercentage: stdPercentage, //parseFloat(stdPercentage), //.toFixed(4),
                        stdPercentage:
                          typeof stdPercentage === "number"
                            ? stdPercentage
                            : stdPercentage === "STANDBY"
                              ? 100 //"MASTER"
                              : stdPercentage === "MASTER"
                                ? 0 //"STANDBY"
                                : null,
                        primaryPercentage:
                          typeof stdPercentage === "number"
                            ? 100 - stdPercentage
                            : stdPercentage === "STANDBY"
                              ? 0 //"MASTER"
                              : stdPercentage === "MASTER"
                                ? 100 //"STANDBY"
                                : null,
                        // primaryPercentage: 100 - stdPercentage, //.toFixed(4),
                        // primaryPercentage:
                        // typeof primaryPercentage === "number"
                        //   ? primaryPercentage.toFixed(4)
                        //   : primaryPercentage,
                      })
                    )}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {!showDefaultGraphs && selectedCategory && (
        <div>
          {selectedCategory === "LRC_PARTNER_PERC" && datagridLRC && (
            <>
              <div style={stylePartner}>
                {configLRC.heading}
                <Line {...configLRC} />
              </div>
              <br />
              <div
                style={{ display: "flex", zIndex: "0", position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  {datagridLRC && (
                    <div style={{ flex: 1, marginRight: "16px" }}>
                      <MaterialReactTable
                        className="custom-header-row"
                        columns={columns1}
                        data={Object.entries(datagridLRC).map(
                          ([Source, stdPercentage, primaryPercentage]) => ({
                            Source,
                            //  stdPercentage: stdPercentage, // parseFloat(stdPercentage), //.toFixed(4),
                            stdPercentage:
                              typeof stdPercentage === "number"
                                ? stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 100 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 0 //"STANDBY"
                                    : null,
                            primaryPercentage:
                              typeof stdPercentage === "number"
                                ? 100 - stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 0 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 100 //"STANDBY"
                                    : null,
                          })
                        )}
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {selectedCategory === "CCTV_PARTNER_PERC" && datagridCCTV && (
            <>
              <div style={stylePartner}>
                {configCCTV.heading}
                <Line {...configCCTV} />
              </div>
              <br />
              <div
                style={{ display: "flex", zIndex: "0", position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  {datagridCCTV && selectedCategory === "CCTV_PARTNER_PERC" && (
                    <div style={{ flex: 1, marginRight: "16px" }}>
                      <MaterialReactTable
                        className="custom-header-row"
                        columns={columns1}
                        data={Object.entries(datagridCCTV).map(
                          ([Source, stdPercentage, primaryPercentage]) => ({
                            Source,
                            //  stdPercentage: stdPercentage, // parseFloat(stdPercentage), //.toFixed(4),
                            stdPercentage:
                              typeof stdPercentage === "number"
                                ? stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 100 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 0 //"STANDBY"
                                    : null,
                            primaryPercentage:
                              typeof stdPercentage === "number"
                                ? 100 - stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 0 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 100 //"STANDBY"
                                    : null,
                          })
                        )}
                        // data={Object.entries(datagridCCTV).map(
                        //   ([Source, stdPercentage, primaryPercentage]) => ({
                        //     Source,
                        //     stdPercentage: parseFloat(stdPercentage).toFixed(4),
                        //     primaryPercentage: 100 - stdPercentage.toFixed(4),
                        //   })
                        // )}
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
                </div>
              </div>
            </>
          )}

          {selectedCategory === "CIU_PARTNER_PERC" && datagridCIU && (
            <>
              <div style={stylePartner}>
                {configCIU.heading}
                <Line {...configCIU} />
              </div>
              <br />
              <div
                style={{ display: "flex", zIndex: "0", position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  {datagridCIU && selectedCategory === "CIU_PARTNER_PERC" && (
                    <div style={{ flex: 1, marginRight: "16px" }}>
                      <MaterialReactTable
                        className="custom-header-row"
                        columns={columns1}
                        // data={Object.entries(datagridCIU).map(
                        //   ([Source, stdPercentage, primaryPercentage]) => ({
                        //     Source,
                        //     stdPercentage: parseFloat(stdPercentage).toFixed(4),
                        //     primaryPercentage: 100 - stdPercentage.toFixed(4),
                        //   })
                        // )}
                        data={Object.entries(datagridCIU).map(
                          ([Source, stdPercentage, primaryPercentage]) => ({
                            Source,
                            //  stdPercentage: stdPercentage, // parseFloat(stdPercentage), //.toFixed(4),
                            stdPercentage:
                              typeof stdPercentage === "number"
                                ? stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 100 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 0 //"STANDBY"
                                    : null,
                            primaryPercentage:
                              typeof stdPercentage === "number"
                                ? 100 - stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 0 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 100 //"STANDBY"
                                    : null,
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
                  )}
                </div>
              </div>
            </>
          )}

          {selectedCategory === "DCS_PARTNER_PERC" && datagridDCS && (
            <>
              <div style={stylePartner}>
                {configDCS.heading}
                <Line {...configDCS} />
              </div>
              <br />
              <div
                style={{ display: "flex", zIndex: "0", position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  {datagridDCS && selectedCategory === "DCS_PARTNER_PERC" && (
                    <div style={{ flex: 1, marginRight: "16px" }}>
                      <MaterialReactTable
                        className="custom-header-row"
                        columns={columns1}
                        data={Object.entries(datagridDCS).map(
                          ([Source, stdPercentage, primaryPercentage]) => ({
                            Source,
                            //  stdPercentage: stdPercentage, // parseFloat(stdPercentage), //.toFixed(4),
                            stdPercentage:
                              typeof stdPercentage === "number"
                                ? stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 100 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 0 //"STANDBY"
                                    : null,
                            primaryPercentage:
                              typeof stdPercentage === "number"
                                ? 100 - stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 0 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 100 //"STANDBY"
                                    : null,
                          })
                        )}
                        // data={Object.entries(datagridDCS).map(
                        //   ([Source, stdPercentage, primaryPercentage]) => ({
                        //     Source,
                        //     stdPercentage: parseFloat(stdPercentage).toFixed(4),
                        //     primaryPercentage: 100 - stdPercentage.toFixed(4),
                        //   })
                        // )}
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
                </div>
              </div>
            </>
          )}
          {selectedCategory === "MCS_PARTNER_PERC" && datagridMCS && (
            <>
              <div style={stylePartner}>
                {configMCS.heading}
                <Line {...configMCS} />
              </div>
              <br />
              <div
                style={{ display: "flex", zIndex: "0", position: "relative" }}
              >
                <div style={{ flex: 1, marginRight: "16px" }}>
                  {datagridMCS && selectedCategory === "MCS_PARTNER_PERC" && (
                    <div style={{ flex: 1, marginRight: "16px" }}>
                      <MaterialReactTable
                        className="custom-header-row"
                        columns={columns1}
                        data={Object.entries(datagridMCS).map(
                          ([Source, stdPercentage, primaryPercentage]) => ({
                            Source,
                            //  stdPercentage: stdPercentage, // parseFloat(stdPercentage), //.toFixed(4),
                            stdPercentage:
                              typeof stdPercentage === "number"
                                ? stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 100 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 0 //"STANDBY"
                                    : null,
                            primaryPercentage:
                              typeof stdPercentage === "number"
                                ? 100 - stdPercentage
                                : stdPercentage === "STANDBY"
                                  ? 0 //"MASTER"
                                  : stdPercentage === "MASTER"
                                    ? 100 //"STANDBY"
                                    : null,
                          })
                        )}
                        // data={Object.entries(datagridMCS).map(
                        //   ([Source, stdPercentage, primaryPercentage]) => ({
                        //     Source,
                        //     stdPercentage: parseFloat(stdPercentage).toFixed(4),
                        //     primaryPercentage: 100 - stdPercentage.toFixed(4),
                        //   })
                        // )}
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
                </div>
              </div>
            </>
          )}
        </div>
      )}


    </div>
  ) : (
    ""
  );
};
export default System3;
