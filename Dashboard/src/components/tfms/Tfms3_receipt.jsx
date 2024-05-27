import React, { useEffect, useState } from "react";
import { Column, Bar, Tooltip } from "@ant-design/plots";
import Axios from "axios";
import { DatePicker } from "antd";
import * as dayjs from "dayjs";
import "./tfms.scss";
import { useLocation, useNavigate } from "react-router-dom";
import { Dataset } from "@mui/icons-material";
import moment from "moment";
import { MaterialReactTable } from "material-react-table";
import { processFetchedData } from "../FetchTableData/processFetchedData";
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
const Tfms3_receipt = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const [data, setData] = useState([]);
  const [receiptData, setReceiptData] = useState([]);
  const [unhealthyTanks, setunhealthyTanks] = useState([]);
  const [avgSale, setTotalAvg] = useState([]);
  const [currentValue, setCurrentValue] = useState(new Date());
  const [month, setMonth] = useState("");
  const [UVlessthanMBL, setUVlessthanMBL] = useState("");
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const [MBL, setMBL] = useState([]);
  const [noRecReqired, setnoRecReqired] = useState("false");
  const [noRecReqired1, setnoRecReqired1] = useState("");
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);

  //MBL
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };
  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");


  const optimumLoading = () => {
    const uniqueProducts = {};
    const avgSale = [];
    console.log(data, "data2");
    data.forEach((item) => {
      if (!uniqueProducts[item.productname]) {
        uniqueProducts[item.productname] = true;
        avgSale.push({
          productname: item.productname,
          MSL: item.MSL,
          MBL: item.MBL,
        });
        console.log(avgSale, "avgSale");
        setTotalAvg(avgSale);
      }
    });

    const receiptData = [];
    const notreceiptData = [];
    const productSum = {};
    const sumCurrentUVByProduct = {};
    const finalSumByProduct = {};
    const finalProduct = {};


    data.forEach((record) => {
      const product = record.productname;
      const pumpablevolume = record.pumpablevolume;
      const MSL1 = record.MSL;

      if (!productSum[product]) {
        productSum[product] = 0;
      }

      productSum[product] += pumpablevolume;
    });

    data.forEach((record) => {
      const product = record.productname;
      const pumpablevolume = record.pumpablevolume;
      const msl = record.MSL;
      const mbl = record.MBL;
      const ullageVolume = record.Ullagevolume;
      const status = record.status

      if (productSum[product] < msl && status == 0) {
        if (!sumCurrentUVByProduct[product]) {
          sumCurrentUVByProduct[product] = 0;
        }

        sumCurrentUVByProduct[product] += ullageVolume;

        if (sumCurrentUVByProduct[product] > mbl && status == 0) {
          data.forEach((innerRecord) => {
            if (
              innerRecord.productname === product &&
              sumCurrentUVByProduct[product] > innerRecord.MBL
            ) {
              // console.log(innerRecord,"inner");
              receiptData.push(innerRecord);
            }
          });
        } else {
        }
      } else {
        // console.log(record,"rec");
        notreceiptData.push(record);
        const uniqueProductGroupDesc = [];

        notreceiptData.forEach((item) => {
          if (!uniqueProductGroupDesc.includes(item.productgroupdesc)) {
            uniqueProductGroupDesc.push(item.productgroupdesc);
          }
        });
        const receipt = uniqueProductGroupDesc.join(" , ");
        // console.log(receipt,"no reqired");
        setnoRecReqired(receipt);
      }

      finalSumByProduct[product] = {
        finalSum: sumCurrentUVByProduct[product],
        MBL: record.MBL,
      };
      finalProduct[product] = mbl;

      // console.log(finalSumByProduct,"finalSumByProduct");
      const productsLessThanMBL = [];

      for (const product in finalSumByProduct) {
        if (finalSumByProduct.hasOwnProperty(product)) {
          const { finalSum, MBL } = finalSumByProduct[product];

          if (finalSum < MBL) {
            productsLessThanMBL.push(product);
          }
        }
      }
      setnoRecReqired1(productsLessThanMBL);
      // console.log(
      //   "Products with final sum less than MBL:",
      //   productsLessThanMBL
      // );
    });

    receiptData.sort((a, b) => b.ullageVolume - a.ullageVolume);
    setReceiptData(receiptData);
    const tankNamesNotInReceipt = data.filter(
      (item) =>
        !receiptData.some(
          (loadedItem) => loadedItem.productname === item.productname
        )
    );

  };


  const getdata = (StartDate, EndDate) => {
    Axios.get(
      `http://${window.location.hostname}:3005/TFMS_03_ullage/${StartDate}/${EndDate}`
    ).then((result) => {
      console.log(result.data.recordset);
      setData(result.data.recordset);
      console.log(result.data.recordset, "datarec");
      const productMap = new Map();
      result.data.recordset.forEach((item) => {
        const productname = item.productname;
        const msl = Math.floor(item.MSL); // Use Math.floor to remove floating numbers
        const pumpableVolume = Math.floor(parseFloat(item.pumpablevolume));
        const mbl = Math.floor(item.MBL); // Use Math.floor to remove floating numbers
        const ullageVolume = Math.floor(parseFloat(item.Ullagevolume));

        console.log(productname, mbl, pumpableVolume, ullageVolume, msl, msl);
        // Check if the product is already in the map
        if (productMap.has(productname)) {
          const existingProduct = productMap.get(productname);
          existingProduct.MSL = Math.max(existingProduct.MSL, msl);
          existingProduct.Pumpable += pumpableVolume;
          existingProduct.MBL = Math.max(existingProduct.MBL, mbl);
          existingProduct.Ullage += ullageVolume;
        } else {
          // Add a new entry for the product in the map
          productMap.set(productname, {
            Productname: productname,
            MSL: msl,
            Pumpable: pumpableVolume,
            MBL: mbl,
            Ullage: ullageVolume,
          });
        }
      });

      // result.data.recordset.forEach(item => {
      //   const productname = item.productname;
      //   const msl = parseFloat(item.MSL).toFixed(4);  // Format to four digits
      //   const pumpableVolume = parseFloat(item.pumpablevolume).toFixed(4);  // Format to four digits
      //   const mbl = parseFloat(item.MBL).toFixed(4);  // Format to four digits
      //   const ullageVolume = parseFloat(item.Ullagevolume).toFixed(4);  // Format to four digits

      //   console.log(productname, mbl, pumpableVolume, ullageVolume, msl, msl);

      //   // Check if the product is already in the map
      //   if (productMap.has(productname)) {
      //     // Update values for the existing product
      //     const existingProduct = productMap.get(productname);
      //     existingProduct.MSL = Math.max(existingProduct.MSL, msl);
      //     existingProduct.Pumpable += parseFloat(pumpableVolume);
      //     existingProduct.MBL = Math.max(existingProduct.MBL, mbl);
      //     existingProduct.Ullage += parseFloat(ullageVolume);
      //   } else {
      //     // Add a new entry for the product in the map
      //     productMap.set(productname, {
      //       Productname: productname,
      //       MSL: msl,
      //       Pumpable:Math.floor(pumpableVolume),
      //       MBL: mbl,
      //       Ullage: Math.floor(ullageVolume),
      //     });
      //   }
      // });


      // const getGridData = Array.from(productMap.values());
      // console.log(getGridData);
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
      //       width: 20,
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
      //   setDataSource(getGridData);
      // }
      const getGridData = Array.from(productMap.values());
      console.log(getGridData);
      const { columns, dataSource } = processFetchedData(getGridData);
      setColumns(columns);
      setDataSource(dataSource);
      // const list = getGridData || [];
      // if (list) {
      //   const firstObject = list[0] || {};
      //   const cols = [];
      //   for (const key in firstObject) {
      //     const col = {
      //       title: key === "Productname" ? key : key + "(KL)",
      //       dataIndex: key,
      //       header: key === "Productname" ? key : key + "(KL)",
      //       accessorKey: key,
      //       width: 20,
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
      //   setDataSource(getGridData);
      // }
    });
  };



  // console.log(receiptData, "receiptData" ,noRecReqired);

  const columnConfig = {
    receiptData,
    isStack: true,
    autofit: true,
    xField: "Tank Name",
    title: "Ullage and Pumpable Volume by Tank",
    yFields: [
      {
        field: "UV",
        yAxisTitle: "Tank Capacity",
        label: "RECEIPT(Ullagevolume Volume)",
      },
    ],
    seriesField: "productname",
    columnBackground: {
      style: {
        fill: "rgba(0, 0, 0, 99)",
      },
    },
    columnstyle: {
      fill: "#dbe7fd",
    },
    interactions: [
      {
        type: "active-region",
        enable: false,
      },
    ],
    color: ["productname", ["color"]],
    geometry: "cylinder",
    columnStyle: {
      fill: "#2196F3",
      stroke: "#1565C0",
    },
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
    // console.log(StartDate, EndDate, "today");
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
                disabledDate={(current) => {
                  return moment().add(-1, 'days') <= current
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
                  width: '11rem'
                }}
              >
                <p>Product:{item.productname}</p>
                <p>(MSL) :{item.MSL.toFixed()} KL</p>
                <p>(MBL) :{item.MBL.toFixed()} KL</p>
              </div>
            ))}
          </div>
          {/* {receiptData.length > 0 ? ( */}
          {/* <div style={{ width: "100%" }}> */}
          {columnConfig.yFields.map((config, index) => (

            <div style={{ width: "60%" }} key={index}>
              {/* {receiptData && receiptData.length > 0 ? ( */}
              <Column
                key={index}
                data={receiptData}
                xField={columnConfig.xField}
                yField={config.field}
                seriesField="productname"
                xAxis={{ title: { text: columnConfig.xAxisTitle } }}
                yAxis={{ title: { text: config.yAxisTitle } }}
                label={{
                  visible: true,
                  position: 'top',
                  className: "ant-plot-x-axis-labels rotate-label",
                  style: {
                    fill: '#000',
                    rotate: -45,
                  },

                  geometry: 'polygon',
                  content: ({ Mode }) =>
                    Mode === 2 ? 'Receipt' : null
                }}
                title={columnConfig.title}
                style={{ width: "80%", padding: "20px" }}
                color={({ productname, mode }) => {
                  if (mode === 2) {
                    return "red";
                  } else if (productname === "MS") {
                    return "rgb(255,128,64)";
                  } else if (productname === "HSD") {
                    return "rgb(0,0,255)";
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
                    fill: 'rgba(0, 0, 0, 0.5)', // Set your desired background color here
                  },
                }}
              />

              <li>
                Auto receipt tank suggestion failed for the product :
                <strong>{noRecReqired}</strong> <strong>{noRecReqired1}</strong>
              </li>
              {/* )}  */}
            </div>
          ))}
          <div style={{ maxWidth: "40%", paddingTop: '50px' }}>
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
          {/* </div>        */}

        </div>
      </div>
      <div style={{ padding: "20px", textAlign: "left" }}>
        <h4>Notes:</h4>
        <ul>


          <li>
            MSL (Minimum Stock Level)(KL):
            <ul>
              <li>
                MSL for MS- 10 days stock , MSL for HSD- 12 days stock , MSL for
                Ethanol - 35 days stock , MSL for Bio diesel - 19 days stock{" "}
              </li>
            </ul>
          </li>
          <li>MBL (Minimum Batch Length)(KL)</li>
        </ul>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Tfms3_receipt;
