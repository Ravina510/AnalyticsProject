import "./navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext, useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticAxios from "../../Axios/Axios";
import Axios from "axios";

const Header = (props) => {
  const navigate = useNavigate();

  const { dispatch } = useContext(DarkModeContext);

  const [value, setValue] = useState("");
  const [url, setUrl] = useState("");
  const [allList, setAllList] = useState([]); 
  const [listItems, setListItems] = useState([]);
  const COMPNAME = "iocl";
  const [filteredData, setFilteredData] = useState(listItems);
  const [isLoggedin, setIsLoggedin] = useState(null);
  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    const getUrl = allList.filter((item) => item.ShortName === searchTerm);
    const URL = getUrl.map((item) => item.Link);
    const PageTitle = getUrl.map((item) => item.Description);
    const ConfigValue = getUrl.map((item) => item.ConfigurableValue);

    if (URL) {
      navigate("/" + URL, {
        state: {
          PageTitle: PageTitle,
          ConfigValue: ConfigValue,
        },
      });
    } else {
      // console.log("failed main loop");
    }
  };
  const onChange = (event) => {
    event.preventDefault();
    setValue(event.target.value);
    // setClear(true);
  };
  const onClear = () => {
    setValue("");
  };
  const getData = () => {
    // Axios.get(`http:///${window.location.hostname}:3005/search`).then((result) => {
    //   setAllList(result.data.recordset);
    //   console.log(result.data.recordset,'data');
    //   const list = new Set(allList.map((info) => info.ShortName));
    //   const data = [...list].map((dataa) => dataa);
    //   // console.log(data);
    //   setListItems(() => {
    //     return [...data];
    //   });
    //   setListItems((prev) => data);
    // });

    AnalyticAxios.get(`/api/HeaderChart/search`)
    .then((result) => {
      setAllList(result.data.recordset);
      console.log(result.data.recordset,'data');
      const list = new Set(allList.map((info) => info.ShortName));
      const data = [...list].map((dataa) => dataa);
      // console.log(data);
      setListItems(() => {
        return [...data];
      });
      setListItems((prev) => data);
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
  };

  const handleLogout = () => {
    // console.log('HTMLHeadingElement');
    localStorage.removeItem("CurrentUser");
    // setauthenticated('');
  };

  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    // console.log(atob(loggedInUser));
    // console.log(btoa(loggedInUser));

    if (loggedInUser) {
      setIsLoggedin(loggedInUser);

      // console.log(loggedInUser);
      navigate("/");
    }
  }, []);

  useEffect(() => {
    if (!listItems[0]) {
      getData();
    }
  }, [listItems, getData]);

  if (!listItems[0]) {
    return <h1>Loading...</h1>;
  }
  if (!isLoggedin) {
    navigate("/login");
  }

  return (
    <div className="navbar">
      <div className="wrapper">
        <div style={{ marginRight: "29rem" }}>
          <div className="search">
            <SearchOutlinedIcon
              style={{ paddingLeft: "1rem" }}
              className="flex-end"
              onClick={() => onSearch(value)}
            />
            <input
              type="text"
              placeholder="Search Analytic..."
              value={value}
              onChange={onChange}
            />
            <ClearIcon
              style={{ paddingRight: "1rem", height: "20px" }}
              onClick={onClear}
            />
          </div>
          <div className="dropdown list">
            {listItems
              .filter((items) => {
                const searchTerm = value.toLowerCase();
                const category = items.toLowerCase();
                return (
                  searchTerm &&
                  category.includes(searchTerm) &&
                  category !== searchTerm
                );
              })

              .map((items, index) => (
                <>
                  <ul
                    className="dropdown-row dropdown-content"
                    style={{
                      position: "absolute",
                      margin: "auto",
                      top: `${index * 32}px`,
                      display: "inline",
                      zIndex: 100,
                      paddingTop: "12px",
                      borderRadius: "5px",
                      backgroundColor: "white",
                    }}
                  >
                    <li onClick={() => onSearch(items)}>
                      <a>{items}</a>
                    </li>
                  </ul>
                </>
              ))}
          </div>
        </div>
        <div className="dash">
          <button
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: "10px",
              marginRight: "4rem",
              border: "0.5px solid lightgray",
              height: "37px",
              boxShadow: "0 3px 10px rgb(0 0 0 / 0.2)",
            }}
          >
            <a href="/" style={{ color: "black" }}>
              Dashboard
            </a>
          </button>
        </div>
        <div className="items">
          {/* <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div> */}
          <div className="item">
            <img
              className="img1"
              height={"40px"}
              src={require(`../assets/${COMPNAME.toUpperCase()}.jpg`)}
            />
          </div>
          <div className="item">
            <div
              className="dropdown1"
              style={{
                position: "relative",
                zIndex: "999",
              }}
            >
              <AccountCircleIcon className="icon avatar dropbtn" />
              <div className="dropdown1-content">
                <a>Hi {atob(isLoggedin)}</a>
                <a href="/edit-password">Change Password</a>
                <a href="/login" onClick={handleLogout}>
                  logout
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
