import React, { useState, useMemo, useEffect ,useRef} from "react";
import { MaterialReactTable } from "material-react-table";
import Axios from "axios";
import "./firengine.scss";
// import ExportCsv from '@material-table/exporters/csv';
// import { ExportToCsv } from 'export-to-csv';
// import { CSVLink } from "react-csv";
import ExportCSVButton from "../export-to-pdf/ExportCSVButton";
import ExportToPdfButton from "../export-to-pdf/ExportToPdfButton";
const FilterTable = () => {
  const [columns1, setColumns] = useState([]);
  const [dataGrid, setDataGrid] = useState([]);
  const [value, setValue] = useState("15");
  const [exportData, setExportData] = useState([]);
  // const csvLink = useRef();

  useEffect(() => {
    const StartDate = "2023-06-01";
    const EndDate = "2023-06-30";
    Axios.get(
      `http://${window.location.hostname}:3005/TLF_1_Combined_Date/${StartDate}/${EndDate}/${value}`
    ).then((result) => {
      const list = result.data.recordset;
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
              fontWeight: "bold"
            },
          };

          if (typeof firstObject[key] === "number") {
            col.filterVariant = "range";
            col.filterFn = "between";
            col.size = 80;
          } else if (key === "TT Count") {
            col.filterVariant = "range";
            col.filterFn = "between";
            col.size = 80;
          }
          cols.push(col);
        }
        setColumns(cols);
        setDataGrid(list);
        setExportData(list);
      }
    });
  }, []);

  // const csvOptions = {
  //   fieldSeparator: ',',
  //   quoteStrings: '"',
  //   decimalSeparator: '.',
  //   showLabels: true,
  //   useBom: true,
  //   useKeysAsHeaders: false,
  //   headers: columns1.map((c) => c.header),
  // };
  
  // const csvExporter = new ExportToCsv(csvOptions);

  const columnHeaderStyle = {
    backgroundColor: "red",
    color: "white",
    // Add any other styles you want for the header here
  };

  const columnsWithHeaderStyle = columns1.map((col) => ({
    ...col,
    headerStyle: columnHeaderStyle,
  }));

  const headerStyle = {
    backgroundColor: "black",
    color: "white",
  };

  // const handleExportRows = (rows) => {
  //   csvExporter.generateCsv(rows.map((row) => row.original));
  // };

  // const handleExportData = () => {
  //   csvExporter.generateCsv(dataGrid);
  // };

  return (
    <div>
      {/* <button onClick={() => csvLink.current.link.click()}>Export to CSV</button> */}
    {/* <CSVLink
      data={exportData}
      filename={"table_data.csv"}
      ref={csvLink}
      style={{ display: "none" }}
    /> */}
    <div style={{ marginLeft: "42rem" }}>
        <ExportCSVButton dataSource={dataGrid} columns={columns1} />
        <ExportToPdfButton data={dataGrid} columns={columns1} />
      </div>
    <MaterialReactTable
      className="custom-header-row"
      columns={columnsWithHeaderStyle}
      // columns={columns1}
      data={dataGrid}
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
      // enableColumnFilters={false}
    />
    </div>
  );
};
export default FilterTable;
