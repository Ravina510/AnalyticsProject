import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { Link } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import Axios from "axios";
import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [allList, setAllList] = useState([]);
  const [listItems, setListItems] = useState([]);
  const [selectionSeries, setselectionSeries] = useState();
  const [listAnalytics, setListAnalytics] = useState([]);
  const [selectedAnalytic, setSelectedAnalytic] = useState();
  const selectShortName = () => {
    const newList = allList.filter((a) => a.Category === selectionSeries);
    const ShortName = newList.map((x) => x.ShortName);
    // console.log(ShortName)
    setListAnalytics(ShortName);
  };

  const openOnclick = () => {
    // console.log("openButton Clicked", selectionSeries, selectedAnalytic)
    // console.log(selectionSeries, selectedAnalytic);

    const containsId = allList.find((x) => x.ShortName === selectedAnalytic);
    // console.log("checking", containsId);

    const PageTitle = containsId.Description;
    const ConfigValue = containsId.ConfigurableValue;

    const URL = containsId.Link;
    // console.log(URL);

    var flag = URL.substring(0, 4);
    // console.log(flag);
    if (URL) {
      if (flag != "http") {
        // console.log("route", flag)
        navigate("/" + URL, {
          state: {
            PageTitle: PageTitle,
            ConfigValue: ConfigValue,
          },
        });
      } else if ((flag = "http")) {
        // console.log(flag)
        window.location.href = URL;
      } else {
        // console.log("failed to load internal loop")
      }
    } else {
      // console.log("failed main loop")
    }
  };

  useEffect(() => {
    selectShortName();
    Axios.get(`http:///${window.location.hostname}:3005/selectAnalytics`).then((result) => {
      setAllList(result.data.recordset);
console.log(result
  .data.recordset,"data");
      const list = new Set(result.data.recordset.map((a) => a.Category));
      const a = [...list].map((a) => a);
      setListItems(a);
    });
  }, [selectionSeries]);

  return (
    <div className="sidebar">
      <hr />
      <form>
        <div className="center">
          <ul>
            <p className="title">MAIN</p>
            <li>
              <DashboardIcon className="icon" />
              <span style={{ color: "white" }}>
                <Link to="/">Dashboard</Link>
              </span>
            </li>
            <p className="title">ANALYTICS</p>

            <li>
              {/* <InsertChartIcon className="icon" /> */}
              <span className="custom-select">
                <select
                  className="form-control form-select"
                  value={selectionSeries}
                  onChange={(e) => {
                    setselectionSeries((prev) => e.target.value);
                  }}
                >
                  <option value="" disabled selected>
                    Select an Category
                  </option>
                  {listItems.map((dataa, index) => (
                    <option value={dataa} key={index}>
                      {dataa}
                    </option>
                  ))}
                </select>
              </span>
            </li>

            <li>
              {/* <InsertChartIcon className="icon" /> */}
              <span>
                <select
                  className="form-control form-select"
                  value={selectedAnalytic}
                  onChange={(e) => setSelectedAnalytic(e.target.value)}
                >
                  <option value="" disabled selected>
                    Select an Description
                  </option>
                  {listAnalytics.map((data, index) => (
                    <option value={data} key={index}>
                      {data}
                    </option>
                  ))}
                </select>
              </span>
            </li>

            <li>
              {/* <CreditCardIcon className="icon" /> */}
              <div className="btn bg-primary" onClick={openOnclick}>
                Open
              </div>
            </li>
            {/* <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li> */}
            {/* <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li> */}
            {/* <p className="title">SERVICE</p>
          <li>
            <SettingsSystemDaydreamOutlinedIcon className="icon" />
            <span>System Health</span>
          </li>
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span>Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li> */}
            <p className="title">USER</p>
            <li>
              <AccountCircleOutlinedIcon className="icon" />
              <span>Profile</span>
            </li>
            <li>
              <ExitToAppIcon className="icon" />
              <span>Logout</span>
            </li>
          </ul>
        </div>
      </form>
      {/* <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div> */}
    </div>
  );
};

export default Sidebar;
