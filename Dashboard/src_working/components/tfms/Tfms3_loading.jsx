import React, { useEffect, useState } from "react";
import { Column, Bar } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import "./tfms.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { useMemo } from "react";
import { MaterialReactTable } from "material-react-table";
import AnalyticAxios from "../../Axios/Axios";

const Tfms3_loading = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [data, setData] = useState([]);

  const [loadingData, setloadingData] = useState([]);
  const [unhealthyTanks, setunhealthyTanks] = useState([]);
  const [avgSale, setTotalAvg] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const optimumLoading = () => {
    const uniqueProducts = {};
    const avgSale = [];
    const records = Array.from(data).sort((a, b) => b.Mode - a.Mode);

    records.forEach((item) => {
      console.log(item, "item ");
      if (!uniqueProducts[item.productname]) {
        uniqueProducts[item.productname] = true;

        const modeValue = item.productname ? item["Tank Name"] : item.Mode;

        avgSale.push({
          productname: item.productname,
          total_quantity: item.total_quantity,
          Mode: modeValue,
        });
        setTotalAvg(avgSale);
        console.log(avgSale, "avgsale");
      }
    });

    const loadingData = [];

    const uniqueProductNames = [
      ...new Set(data.map((item) => item.productname)),
    ];

    for (const productName of uniqueProductNames) {
      let productAlreadyLoaded = false;
      let currentSum = 0;
      const itemsContributingToExceed = [];

      for (const item of data) {
        const { Pumpable_Volume, Status, total_quantity, productname, Mode } =
          item;
        if (productname !== productName) {
          continue;
        }

        if (Pumpable_Volume > total_quantity && Status == 0) {
          loadingData.push(item);
        }

        if (Pumpable_Volume < total_quantity && Status == 0) {
          if (
            loadingData.some(
              (loadedItem) => loadedItem.productname === productname
            )
          ) {
            productAlreadyLoaded = true;
            break;
          } else {
            currentSum += Pumpable_Volume;
            itemsContributingToExceed.push(item);
            if (currentSum > total_quantity) {
              // console.log(itemsContributingToExceed);
              loadingData.push(...itemsContributingToExceed);
              break;
            } else {
              // console.log("fail", item);
            }
          }
        }
      }
    }

    loadingData.sort((a, b) => b.Pumpable_Volume - a.Pumpable_Volume);

    console.log("loadingData in descending order:");
    for (const item of loadingData) {
      console.log(item);
    }

    const filteredData = loadingData.map((item) => ({
      // productname: item.productname,
      ["Tank Name"]: item["Tank Name"],
      Pumpable_Volume: item.Pumpable_Volume,
    }));
    console.log(filteredData, "load1213");
    const getGridData = filteredData;

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
          width: "5%",
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
          col.width= 50 ;
        }
        cols.push(col);
      }
      setColumns(cols);

      setDataSource(loadingData);
    }
    setloadingData(loadingData);

    const notInLoadingData = data.filter(
      (item) =>
        !loadingData.some(
          (loadedItem) => loadedItem.productname === item.productname
        )
    );
    console.log("Data not in loadingData:", notInLoadingData);
    const tankNamesString = [
      ...new Set(notInLoadingData.map((item) => item.productname)),
    ];
    const unhealthyTanks = tankNamesString.join(" , ");
    setunhealthyTanks(unhealthyTanks);
  };
  // ----------------------------------------------------------------------

  const columnConfig = {
    loadingData,
    xField: "Tank Name",
    title: "Ullage and Pumpable Volume by Tank",
    yFields: [
      {
        field: "PV",
        yAxisTitle: "Tank Capacity",
        label: "LOADING(Pumpable Volume)",
        // Note: unhealthyTanks
      },
    ],
    seriesField: "productname",
    isGroup: true,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    tooltip: { isHtml: true },
  };

  const handleToday = (e) => {
    // console.log(e, "handletoday");
    const getToday1 = e;
    const date = new Date(getToday1);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    const fromdate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    console.log(fromdate);

    getdata(fromdate);
  };

  const getdata = (fromdate) => {
    // console.log(fromdate, "selected date");
    // Axios.get(
    //   `http:///${window.location.hostname}:3005/api/ColumnChart/TFMS_03/${fromdate}`
    // ).then((result) => {
    //   console.log(result.data.recordset);
    //   setData(result.data.recordset);
    // });

    AnalyticAxios.get(`/api/ColumnChart/TFMS_03/${fromdate}`)
    .then((result) => {
      setData(result.data.recordset);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  };

  useEffect(() => {
    optimumLoading();
  }, [data]);

  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = "00";
    const minutes = "00";
    const seconds = "00";
    const fromdate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    getdata(fromdate);
  }, []);

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    if (loggedInUser) {
      setIsLoggedin(loggedInUser);
    }
  }, []);

  if (!isLoggedin) {
    navigate("/login");
  }

  return isLoggedin ? (
    <div>
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
            <div>
              <DatePicker
                defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
                className="col-sm-3 float-end"
                onChange={(e) => {
                  handleToday(e);
                }}
                disabledDate={(current) =>
                  !dayjs(current.format("YYYY-MM-DD")).isSame(dayjs(), "day")
                }
              />
              <br />
            </div>
          </div>
        </div>

        <br />

        <div className="singleRow">
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              top: 0,
              bottom: 0,
              margin: "auto",
            }}
          >
            {avgSale.map((item, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #ccc",
                  padding: "10px",
                  margin: "10px",
                  borderRadius: "5px",
                  width: "11rem",
                }}
              >
                <p>Product:{item.productname}</p>
                <p>
                  Average Sale:
                  {item.total_quantity ? item.total_quantity.toFixed() : 0} KL
                </p>
                <p>Operational Tank : {item.Mode}</p>
              </div>
            ))}
          </div>
          {columnConfig.yFields.map((config, index) => (
            <div style={{ width: "100%" }}>
              {/* <h4>{config.label}</h4> */}
              <Column
                key={index}
                data={loadingData}
                xField={columnConfig.xField}
                yField={config.field}
                seriesField="productname"
                xAxis={{ title: { text: columnConfig.xAxisTitle } }}
                yAxis={{ title: { text: config.yAxisTitle } }}
                label={{
                  visible: true,
                  position: "top",
                  className: "ant-plot-x-axis-labels rotate-label",
                  style: {
                    fill: "#000",
                    rotate: -45,
                  },

                  geometry: "polygon",
                  content: ({ Mode }) => (Mode === 3 ? "Dispatch" : null),
                }} // (Mode === 2 ? 'Dispatch' : null),//🔴 // Mode
                title={columnConfig.title}
                style={{ width: "80%", padding: "20px" }}
                color={({ productname, Mode }) => {
                  // console.log(ProductName);
                  if (Mode === 2) {
                    return "red";
                  } else if (productname === "MS") {
                    return "rgb(255,128,64)";
                  } else if (productname === "HSD") {
                    return "rgb(0,0,255)"; ///BLUE
                  } else if (productname === "PCK") {
                    return "rgb(255,255,128)";
                  } else if (productname === "ETHANOL") {
                    return "rgb(128,0,128)";
                  } else if (productname === "BIO DIESEL") {
                    return "rgb(0,0,255)";
                  }
                }}
                columnBackground={{
                  style: {
                    fill: "rgba(0, 0, 0, 0.5)", // Set your desired background color here
                  },
                }}
              />
              {unhealthyTanks.length > 0 && (
                <h4>
                  Note: Auto loading tank suggestion failed for :
                  <strong>{unhealthyTanks ? unhealthyTanks : "0"} .</strong>
                </h4>
                //dispatch
              )}
            </div>
          ))}
          <div style={{ maxWidth: "30%", paddingTop:'50px' }}>
          <MaterialReactTable
            columns={columns}
            data={dataSource}
            enableStickyHeader
            // muiTableContainerProps={{ sx: { maxHeight: "500px" } }}
            initialState={{ density: "compact" }}
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            // enableHiding={false}
            enableColumnResizing
            // columnResizeMode="onEnd"
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
           
            muiTablePaginationProps={{
              rowsPerPageOptions: [11, 22],
              showFirstButton: false, 
              showLastButton: false,
            }}
          />
          </div>
        
        </div>
      </div>
      <div style={{ padding: "20px", textAlign: "left" }}>
        <h4>Notes:</h4>
        <ul>
          <li>
            Average Sale Quantity(KL) = (Average Sale of last 7 days) x (Stock
            for 2 days).
          </li>
          <li>
            Only healthy tanks , Not in maintainance are considered for Loading
            Operation.
          </li>
          {/* <li>Tanks that are not in maintenance are displayed.</li> */}
        </ul>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Tfms3_loading;
