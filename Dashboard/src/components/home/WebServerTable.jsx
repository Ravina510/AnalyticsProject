import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./home.scss";
import * as dayjs from "dayjs";
import { DatePicker } from "antd";
import Axios from "axios";
import { Table, Row, Col } from "antd";
import "../../style/dark.scss";
import moment from "moment";

const { Column } = Table;
const WebServerTable = (props) => {
  const [columns, setColumns] = useState([]);
  const [dataSource, setDataSource] = useState([]);
  const [columns1, setColumns1] = useState([]);
  const [dataSource1, setDataSource1] = useState([]);
  const [currentValue, setcurrentValue] = useState(new Date());
  const [fromdate, setToday] = useState(null);
  const [showData, setShowData] = useState(false);
  const [objWeek, setObjWeek] = useState({
    date: new Date(),
    dateFrom: null,
    dateTo: null,
    weekNumber: null,
    //const fromdate = props.fromdate,
  });
  const todays = new Date(currentValue),
    mnth = ("0" + (todays.getMonth() + 1)).slice(-2),
    day = ("0" + todays.getDate()).slice(-2);
  let getfromdate = [todays.getFullYear(), mnth, day].join("-");

  const onChange = (e) => {
    //console.log("Selected date",e);
    setDataSource([]);
    setDataSource1([]);
    const getToday = e;
    const today = new Date(e),
      mnth = ("0" + (today.getMonth() + 1)).slice(-2),
      day = ("0" + today.getDate()).slice(-2);
    //console.log([today.getFullYear(), mnth, day].join("-"))
    //return [today.getFullYear(), mnth, day].join("-");
    const fromdate = [today.getFullYear(), mnth, day].join("-");
    setToday(fromdate);

    Axios.get(
      `http://${window.location.hostname}:3005/WebServerDataField/${fromdate}`
    ).then((result) => {
      const list = result.data.recordset;
      if (list) {
        const firstObject = list[0];
        const cols = [];
        for (const key in firstObject) {
          const col = {
            title: key,
            dataIndex: key,
          };
          cols.push(col);
        }
        setColumns(cols);
        setColumns1(cols);

        for (let i = 0; i < list.length; i++) {
          if (i < (list.length/2)) {
            setDataSource((prev) => [...prev, list[i]]);
          } else {
            setDataSource1((prev) => [...prev, list[i]]);
          }
        }
        setShowData(true);
      }
    });
  };

  useEffect(() => {
    const getToday = new Date();
    //console.log(getToday);
    var date = new Date(getToday),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    const fromdate = [date.getFullYear(), mnth, day].join("-");
    //console.log(fromdate)
    Axios.get(
      `http://${window.location.hostname}:3005/WebServerDataField/${fromdate}`
    ).then((result) => {
      const list = result.data.recordset;
      if (list) {
        const firstObject = list[0];
        const cols = [];
        for (const key in firstObject) {
          const col = {
            title: key,
            dataIndex: key,
          };
          cols.push(col);
        }
        setColumns(cols);
        setColumns1(cols);
        setDataSource([]);
        setDataSource1([]);
        for (let i = 0; i < list.length; i++) {
          if (i < (list.length/2)) {
            setDataSource((prev) => [...prev, list[i]]);
          } else {
            setDataSource1((prev) => [...prev, list[i]]);
          }
        }
        setShowData(true);
      }
    });
  }, []);

  const getRowClassname = (record, index) => {
    return index % 2 === 0 ? "even-row" : "odd-row";
  };
  return (
    <div>
      <div className="home">
        <div className="datepicker">
          <DatePicker
            defaultValue={dayjs(getfromdate, "YYYY-MM-DD")}
            className="col-sm-3 float-end"
            onChange={onChange}
            disabledDate={(current) => {
              return moment().add(-1, 'days')  <= current }}
          />
        </div>
        <br></br>
        <br></br>
        <div>
          <Row gutter={16}>
            <Col span={12}>
              <Table
                key="1"
                dataSource={dataSource}
                columns={columns}
                pagination={false}
                className="custom-header-row"
                bordered
                rowClassName={() => {
                  "editable-row";
                }}
                // rowClassName={getRowClassname}
              />
            </Col>
            <Col span={12}>
              <Table
                key="2"
                dataSource={dataSource1}
                columns={columns1}
                pagination={false}
                className="custom-header-row"
                bordered
                rowClassName={() => {
                  "editable-row";
                }}
                // rowClassName={getRowClassname}
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default WebServerTable;
