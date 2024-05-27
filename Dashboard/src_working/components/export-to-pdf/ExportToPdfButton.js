import React from "react";
import { Table, Button } from "antd";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { saveAs } from "file-saver";

pdfMake.vfs = pdfFonts.pdfMake.vfs;

const ExportToPdfButton = ({ data, columns }) => {
  // console.log(data, columns, "tlf1");

  const handleExportPDF = () => {
    // console.log(data, columns, "tlf1");
    const tableData = [];
    const tableHeaders = columns.map((column) => column.title);

    tableData.push(tableHeaders);

    data.forEach((item) => {
      const rowData = columns.map((column) => item[column.dataIndex]);
      tableData.push(rowData);
    });

    const docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            widths: Array(columns.length).fill("*"),
            body: tableData,
          },
        },
      ],
    };

    const pdfDocGenerator = pdfMake.createPdf(docDefinition);
    pdfDocGenerator.getBlob((blob) => {
      saveAs(blob, "analytics_summary.pdf");
    });
  };

  return (
    <Button onClick={handleExportPDF}>
      <i className="fa fa-download" aria-hidden="true"></i> &nbsp; Export to PDF
    </Button>
  );
};

export default ExportToPdfButton;
