import React from 'react';
import { Button } from 'antd';
import { ExportOutlined } from '@ant-design/icons';
import { saveAs } from 'file-saver';

const ExportCSVButton = ({ dataSource, columns }) => {
  const handleExportCSV = () => {
    // Convert data to CSV format
    const csvData = [columns.map(column => column.title)];

    dataSource.forEach(record => {
      const row = columns.map(column => {
        return record[column.dataIndex];
      });
      csvData.push(row);
    });

    // Convert CSV data to a string
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    // Create a Blob containing the CSV data
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8' });

    // Use FileSaver library to trigger download
    saveAs(blob, 'analytics_summary.csv');
  };

  return (
    <Button  icon={<ExportOutlined />} onClick={handleExportCSV}>
      Export to CSV
    </Button>
  );
};

export default ExportCSVButton;
