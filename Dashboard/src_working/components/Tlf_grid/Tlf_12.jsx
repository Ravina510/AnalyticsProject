import React, { useState, useEffect, useRef } from "react";
import moment from "moment";
import { Column } from "@ant-design/plots";
import Axios from "axios";
import { Button } from "antd";
import { DatePicker, Table } from "antd";
import * as dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
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

const Tlf_12 = () => {
  const chartRef = useRef(null);
  const { state } = useLocation();
  const [isLoggedin, setIsLoggedin] = useState(null);
  const navigate = useNavigate();
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);

  const [month, setMonth] = useState("");
  const [currentValue, setCurrentValue] = useState(new Date());
  const [dataCount1, setDataCount1] = useState([]);

  const [TTCount, setTTDataCount] = useState([]); //TTCount
  const [CompCount, setCompDataCount] = useState([]); //CompartmentsCount
  const [StartDate, setStartDate] = useState(null); // TLF_Mod Start Date
  const [EndDate, setEndDate] = useState(null); // TLF_Mod End Date
  const [selectedKey, setSelectedKey] = useState("Day Filter");
  const onClick = (e) => {
    setSelectedKey(e.target.value);
  };

  var date = new Date(currentValue),
    mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    day = ("0" + date.getDate()).slice(-2);
  let getfromdate = [date.getFullYear(), mnth, day].join("-");

  const TotalCountOfTT = (
    spName = "TotalCountOfIndents",
    StartDate,
    EndDate
  ) => {
    if (spName === "TotalCountOfIndents") {
      // Axios.get(
      //   `http://${window.location.hostname}:3005/TotalCountOfIndents/${StartDate}/${EndDate}`
      // ).then((result) => {
      //   const TTIndentsCount = result.data.recordset[0].CountOfIndents;
      //   setTTDataCount(TTIndentsCount);
      // });
      AnalyticAxios.get(`/api/GridChart/TotalCountOfIndents/${StartDate}/${EndDate}`)
      .then((result) => {
        const TTIndentsCount = result.data.recordset[0].CountOfIndents;
        setTTDataCount(TTIndentsCount);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      })
    }
  };

  const TotalCountOfCompartments = (
    spName = "TotalCountOfCompartments",
    StartDate,
    EndDate
  ) => {
    if (spName === "TotalCountOfCompartments") {
      // Axios.get(
      //   `http://${window.location.hostname}:3005/TotalCountOfCompartments/${StartDate}/${EndDate}`
      // ).then((result) => {
      //   const TTCompartmentsCount =
      //     result.data.recordset[0].CountOfCompartments;
      //   setCompDataCount(TTCompartmentsCount);
      // });
      AnalyticAxios.get(`/api/GridChart/TotalCountOfCompartments/${StartDate}/${EndDate}`)
      .then((result) => {
        const TTCompartmentsCount =
        result.data.recordset[0].CountOfCompartments;
      setCompDataCount(TTCompartmentsCount);
      })
      .catch((error) => {
          console.error("Error fetching data:", error);
      })
    }
  };

  const getGriddata1 = (StartDate, EndDate) => {
    // Axios.get(
    //   `http://${window.location.hostname}:3005/TLF_12_Graph/${StartDate}/${EndDate}`
    // ).then((result) => {
    //   const list1 = result.data.recordsets[0];
    //   const list2 = result.data.recordsets[1];
    //   setData1(list1);
    //   setData2(list2);
    //   const qty = new Set(list1.map((a) => a.SumQty1));
    //   const sumQty = [...qty].map((a) => a);
    //   setDataCount1(sumQty === "" ? "0" : sumQty);
    // });
    AnalyticAxios.get(`/api/ColumnChart/TLF_12_Graph/${StartDate}/${EndDate}`)
    .then((result) => {
      const list1 = result.data.recordsets[0];
      const list2 = result.data.recordsets[1];
      setData1(list1);
      setData2(list2);
      const qty = new Set(list1.map((a) => a.SumQty1));
      const sumQty = [...qty].map((a) => a);
      setDataCount1(sumQty === "" ? "0" : sumQty);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    })
  };

  // const getGriddata2 = (StartDate, EndDate) => {
  //   Axios.get(
  //     `http://${window.location.hostname}:3005/TLF_12_Graph1/${StartDate}/${EndDate}`
  //   ).then((result) => {
  //     setData(result.data.recordset);
  //     const qty = new Set(result.data.recordset.map((a) => a.SumQty2));
  //     const sumQty = [...qty].map((a) => a);
  //     setDataCount2(sumQty);
  //   });
  // };

  const loadData = (StartDate, EndDate) => {
    getGriddata1(StartDate, EndDate);
    // getGriddata2(StartDate, EndDate);
    TotalCountOfTT("TotalCountOfIndents", StartDate, EndDate);
    TotalCountOfCompartments("TotalCountOfCompartments", StartDate, EndDate);
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
    setStartDate(StartDate);
    setEndDate(EndDate);
    loadData(StartDate, EndDate);
  };
  //

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
    setStartDate(StartDate);
    setEndDate(EndDate);
    loadData(StartDate, EndDate);
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
    setStartDate(StartDate);
    setEndDate(EndDate);
    loadData(StartDate, EndDate);
  };

  const handleExportPDF = async () => {
    const chartCanvas = chartRef.current.container;
    const canvas = await html2canvas(chartCanvas);

    const chartImage = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    // {state.PageTitle}
    const title = state.PageTitle;
    pdf.setFontSize(16);
    pdf.text(10, 10, title);

    const titleHeight = pdf.getTextDimensions(title).h; // Get title height
    const spaceBelowTitle = 10; // Adjust this value for the desired space

    const currentTime = new Date().toLocaleTimeString();
    const currentDate = new Date().toLocaleDateString();
    pdf.setFontSize(12);

    // const textBlockHeight = 28; // Height of text block (date and time)

    const chartImageY = 10 + titleHeight + spaceBelowTitle; // Adjust this value

    pdf.addImage(chartImage, "PNG", 10, chartImageY, 190, 100);
    const logoBottomY = chartImageY + 110;
    const chartDataStartDate = new Date(StartDate);
    const chartDataEndDate = new Date(EndDate);
    const formattedChartDataStartDate = `${chartDataStartDate.toLocaleDateString()} ${chartDataStartDate.toLocaleTimeString()}`;
    const formattedChartDataEndDate = `${chartDataEndDate.toLocaleDateString()} ${chartDataEndDate.toLocaleTimeString()}`;
    const dateRangeText = `Data Date: ${formattedChartDataStartDate} to ${formattedChartDataEndDate}`;
    pdf.setFontSize(10);
    pdf.text(10, logoBottomY, dateRangeText, { align: "left" });
    // Adding company logo
    const logoImage = new Image();
    logoImage.src = "../../assets/HoneywellLogo.png";
    // logoImage.src =
    //   "data:image/png;base64,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";
    logoImage.onload = () => {
      const logoY = chartImageY + 110 + 100; // Adjust this value to position the logo
      const logoWidth = 30; // Adjust the width of the logo
      const logoHeight = (logoImage.height / logoImage.width) * logoWidth; // Maintain aspect ratio

      pdf.addImage(logoImage, "PNG", 10, logoY, logoWidth, logoHeight); // Adjust position and size as needed.
      // Adding exported date and time below the logo
      const logoBottomY = logoY + logoHeight + 5; // Adjust this value for spacing
      pdf.setFontSize(10);
      pdf.text(10, logoBottomY, `Date: ${currentDate}`);
      pdf.text(10, logoBottomY + 8, `Time: ${currentTime}`);

      pdf.save("analytics_summary.pdf");
    };
  };

  useEffect(() => {
    const date1 = new Date(),
      mnth1 = ("0" + (date1.getMonth() + 1)).slice(-2),
      day1 = ("0" + date1.getDate()).slice(-2);
    const StartDate = [date1.getFullYear(), mnth1, day1].join("-");

    const date2 = new Date(),
      mnth2 = ("0" + (date2.getMonth() + 1)).slice(-2),
      day2 = ("0" + date2.getDate()).slice(-2);
    const EndDate = [date2.getFullYear(), mnth2, day2].join("-");

    setStartDate(StartDate);
    setEndDate(EndDate);
    loadData(StartDate, EndDate);
  }, []);

  const config1 = {
    data: data1,
    //isGroup: true,

    xField: "TimeInterval1",
    yField: "Qty1",

    xAxis: {
      label: {
        position: "middle",
        rotate: "120",
        offsetX: 5,
      },
      title: {
        text: "Time Interval",
      },
    },
    yAxis: {
      title: {
        text: "Quantity in KL",
      },
    },

    meta: {
      value: {
        min: 50,
        max: 100,
      },
    },
  };

  const config2 = {
    data: data2,
    //isGroup: true,

    xField: "TimeInterval2",
    yField: "Qty2",

    xAxis: {
      label: {
        position: "middle",
        rotate: "120",
        offsetX: 5,
      },
      title: {
        text: "Time Interval",
      },
    },
    yAxis: {
      title: {
        text: "Quantity in KL",
      },
    },

    meta: {
      value: {
        min: 50,
        max: 100,
      },
    },
  };

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
      <div
        style={{
          backgroundColor: "black",
          color: "white",
          fontweight: "1rem",
          fontSize: "1.5rem",
        }}
      >
        <h3
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {state.PageTitle}
        </h3>
      </div>

      <div style={{ paddingLeft: "80rem" }}>
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
          // value={monthValue}
          onChange={(e) => handleMonth(e)}
          style={{
            display: `${selectedKey != "Month Filter" ? "none" : ""}`,
          }}
          picker="month"
          format="MMMM"
          disabledDate={(current) => {
            return moment().add(-1, "days") <= current;
          }}
        />
        <RangePicker
          onChange={(e) => handleBetweenDate(e)}
          style={{
            width: "345px",
            display: `${selectedKey != "Range Filter" ? "none" : ""}`,
          }}
          showTime
          format="YYYY-MM-DD HH:mm:ss"
          disabledDate={(current) => {
            return moment().add(-1, "days") <= current;
          }}
        />
      </div>

      <div className="boxes">
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "#2b2d42",
            alignContent: "center",
            padding: "20px 10px 5px 10px",
          }}
        >
          Total Indents:
          <span
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#284b63",
              justifyContent: "center",
              margin: "1rem",
            }}
          >
            <br></br>
            <p style={{ padding: "20px 10px 5px 10px" }}>{TTCount}</p>
          </span>
        </div>
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "#2b2d42",
            alignContent: "center",
            padding: "20px 10px 5px 10px",
          }}
        >
          Total Compartments:
          <span
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#284b63",
              justifyContent: "center",
              margin: "1rem",
            }}
          >
            <br></br>
            <p style={{ padding: "20px 10px 5px 10px" }}>{CompCount}</p>
          </span>
        </div>
        <div
          className="square box"
          style={{
            fontSize: "15px",
            color: "#2b2d42",
            alignContent: "center",
            padding: "20px 10px 5px 10px",
          }}
        >
          Total Quantity(KL) :
          <span
            style={{
              fontSize: "30px",
              fontWeight: "bold",
              color: "#284b63",
              justifyContent: "center",
              margin: "1rem",
            }}
          >
            <br></br>
            <p style={{ padding: "20px 10px 5px 10px" }}>{dataCount1}</p>
          </span>
        </div>
      </div>

      <div
        style={{
          paddingLeft: "3rem",
          marginLeft: "5%",
          paddingRight: "3rem",
          marginRight: "5%",
        }}
      >
        <Button onClick={handleExportPDF} style={{ marginLeft: "73rem" }}>
          <i className="fa fa-download" aria-hidden="true"></i> &nbsp; Export to
          PDF
        </Button>

        <div classname="row">
          {" "}
          <div
            classname="col-sm-6"
            style={{
              float: "left",
              width: "49%",
              zIndex: "0",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <strong>Loading End Time</strong>
            </p>
            <Column {...config1} chartRef={chartRef} />
          </div>
          <div
            classname="col-sm-6"
            style={{
              float: "right",
              width: "49%",
              zIndex: "0",
              position: "relative",
            }}
          >
            <p
              style={{
                fontSize: "20px",
                backgroundColor: "black",
                color: "white",
              }}
            >
              <strong>Loading Start Time</strong>
            </p>
            <Column {...config2} chartRef={chartRef} />
          </div>
        </div>
      </div>
    </div>
  ) : (
    ""
  );
};
export default Tlf_12;
