import React, { useEffect, useState } from "react";
import { MaterialReactTable } from "material-react-table";
import { Line } from "@ant-design/plots";
import Axios from "axios";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";

const Tlf_20 = (props) => {
  const [data, setData] = useState([]);
  // const [data2, setData2] = useState(Array(6).fill([]));
  // const [data3, setData3] = useState([]);
  // const [data4, setData4] = useState([]);
  // const [data5, setData5] = useState([]);
  // const [data6, setData6] = useState([]);

  const [columns, setColumns] = useState([]);
  const [dataGrid, setDataGrid] = useState([]);

  const fromdate = props.fromdate;

  const getDate = () => {
    const getToday = new Date();
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
  };

  const getData = () => {
    Axios.get(
      `http://${window.location.hostname}:3005/TLF_20_Combined_Graph`
    ).then((result) => {
      //BCU01
      const newData = result.data.recordsets.map((graph) => graph);
      setData(newData);
      console.log("graph1", newData);

      // //BCU02
      // const graph2 = result.data.recordsets[1];
      // setData2(graph2);
      // console.log("graph2", graph2);

      // //BCU03
      // const graph3 = result.data.recordsets[2];
      // setData3(graph3);
      // console.log("graph3", graph3);

      // //BCU04
      // const graph4 = result.data.recordsets[3];
      // setData4(graph4);
      // console.log("graph4", graph4);

      // //BCU05
      // const graph5 = result.data.recordsets[4];
      // setData5(graph5);
      // console.log("graph5", graph5);

      // //BCU06
      // const graph6 = result.data.recordsets[5];
      // setData6(graph6);
      // console.log("graph6", graph6);
    });
  };

  const getGriddata = () => {
    Axios.get(
      `http://${window.location.hostname}:3005/TLF_20_Combined_Grid`
    ).then((result) => {
      const list = result.data.recordset;

      if (list) {
        const firstObject = list[0] || {};
        const cols = [];
        for (const key in firstObject) {
          const col = {
            // styles: { col },
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
        setDataGrid(result.data.recordset);
      }
    });
  };

  useEffect(() => {
    getData();
    getGriddata();
  }, [props.fromdate]);

  const config = (index) => {
    return {
      data: data[index],
      xField: "Time",
      yField: "AlarmType",
      // seriesField: "Source",
      stepType: "vh",
      xAxis: {
        label: {
          position: "middle",
          rotate: 120,
          offsetX: 55,
        },
        title: {
          text: "Time",
        },
      },
      yAxis: {
        title: {
          text: "Status",
        },
      },
    };
  };

  // const config2 = {
  //   data2,
  //   xField: "Time2",
  //   yField: "AlarmType",
  //   seriesField: "Source2",
  //   stepType: "vh",
  //   xAxis: {
  //     label: {
  //       position: "middle",
  //       rotate: 120,
  //       offsetX: 55,
  //     },
  //     title: {
  //       text: "Time",
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Status",
  //     },
  //   },
  // };

  // const config3 = {
  //   data3,
  //   xField: "Time3",
  //   yField: "AlarmType",
  //   seriesField: "Source3",
  //   stepType: "vh",
  //   xAxis: {
  //     label: {
  //       position: "middle",
  //       rotate: 120,
  //       offsetX: 55,
  //     },
  //     title: {
  //       text: "Time",
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Status",
  //     },
  //   },
  // };

  // const config4 = {
  //   data4,
  //   xField: "Time4",
  //   yField: "AlarmType",
  //   seriesField: "Source4",
  //   stepType: "vh",
  //   xAxis: {
  //     label: {
  //       position: "middle",
  //       rotate: 120,
  //       offsetX: 55,
  //     },
  //     title: {
  //       text: "Time4",
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Status4",
  //     },
  //   },
  // };

  // const config5 = {
  //   data5,
  //   xField: "Time5",
  //   yField: "AlarmType",
  //   seriesField: "Source5",
  //   stepType: "vh",
  //   xAxis: {
  //     label: {
  //       position: "middle",
  //       rotate: 120,
  //       offsetX: 55,
  //     },
  //     title: {
  //       text: "Time",
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Status",
  //     },
  //   },
  // };

  // const config6 = {
  //   data6,
  //   xField: "Time6",
  //   yField: "AlarmType",
  //   seriesField: "Source6",
  //   stepType: "vh",
  //   xAxis: {
  //     label: {
  //       position: "middle",
  //       rotate: 120,
  //       offsetX: 55,
  //     },
  //     title: {
  //       text: "Time6",
  //     },
  //   },
  //   yAxis: {
  //     title: {
  //       text: "Status6",
  //     },
  //   },
  // };

  return (
    <div className="Analytics">
      <span style={{ textAlign: "center", fontSize: "1.5rem" }}>
        {" "}
        <strong>Bay not communicating</strong>
      </span>

      {data.map((graph, index) => (
        <div style={{ height: "500px", width: "900px" }} key={index}>
          {" "}
          <Line {...config(index)} />
        </div>
      ))}
      {/* <div  
        style={{
          height: "300px",
          width: "600px",
        }}
      >

      </div> */}

      {/* <div style={{ marginLeft: "85rem" }}>
        <ExportCSVButton dataSource={dataGrid} columns={columns} />
        <ExportToPdfButton data={dataGrid} columns={columns} />
      </div>
      <div style={{}}>
        <div style={{ paddingLeft: "20%", paddingRight: "20%" }}>
          <MaterialReactTable
            className="custom-header-row"
            columns={columns}
            data={dataGrid}
            initialState={{ density: "compact" }}
            enableStickyHeader
            muiTableContainerProps={{
              sx: { maxHeight: "500px" },
              color: "red",
            }}
            enableColumnResizing
            columnResizeMode="onEnd"
            enableRowNumbers
            rowNumberMode="original"
            enableFullScreenToggle={false}
            enableDensityToggle={false}
            enableGlobalFilter={false}
            enableHiding={false}
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
      </div> */}
    </div>
  );
};
export default Tlf_20;
