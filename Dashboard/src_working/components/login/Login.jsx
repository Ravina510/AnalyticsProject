import "./login.scss";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";

export default function Login(props) {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [LoggedIn, setIsLoggedin] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(username, username.length);
    if (username.length < 6) {
      setUsernameError("Please provide Valid User Name");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Please provide Valid password");
      return;
    }



    AnalyticAxios.get(`/api/user/login`, {
      username: username,
      password: password,
    }).then((response) => {
      setIsLoggedin(true);

      if (response.data.status == true) {
        const loggenInDateTime = new Date();
        localStorage.setItem(window.btoa(username), loggenInDateTime);
        localStorage.setItem("CurrentUser", window.btoa(username));

        // setUserName("");
        // setPassword("");

        navigate("/", {
          state: {
            username: window.btoa(username),
            // loggedTime: loggenInDateTime
          },
        });
        if (LoggedIn) {
          navigate("/webServer");
        }
      } else {
        setLoginStatus(
          <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
        );
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });
    
    // Axios.post(`http:///${window.location.hostname}:3005/login`, {
    //   username: username,
    //   password: password,
    // }).then((response) => {
    //   setIsLoggedin(true);

    //   if (response.data.status == true) {
    //     const loggenInDateTime = new Date();
    //     localStorage.setItem(window.btoa(username), loggenInDateTime);
    //     localStorage.setItem("CurrentUser", window.btoa(username));

    //     // setUserName("");
    //     // setPassword("");

    //     navigate("/", {
    //       state: {
    //         username: window.btoa(username),
    //         // loggedTime: loggenInDateTime
    //       },
    //     });
    //     if (LoggedIn) {
    //       navigate("/webServer");
    //     }
    //   } else {
    //     setLoginStatus(
    //       <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
    //     );
    //   }
    // });
  };

  // if (LoggedIn) {
  //   navigate("/webServer");
  // }

  useEffect(() => {
    const loggedInUser = localStorage.getItem("authenticated");
    // console.log(loggedInUser);

    if (loggedInUser) {
      setIsLoggedin(loggedInUser);

      // console.log(loggedInUser);
      navigate("/");
    }
  }, []);
  return (
    <>
      <div className="wrapper1">
        <div className="text-center mt-4 name" style={{ paddingTop: "10px" }}>
          <strong>TAS Analytics Portal</strong>
        </div>
        <br></br>
        <div className="logo">
          <img className="img" src={require("./iocl-logo.png")} alt="" />
        </div>
        <br></br>
        <form
          action=""
          method="POST"
          className="p-3 mt-3"
          onSubmit={handleSubmit}
        >
          <div className="inputField">
            <div className="form-field ">
              <span
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "10px",
                }}
                className="fa fa-user"
              ></span>
              <input
                autoComplete="off"
                type="text"
                value={username}
                onChange={(e) => {
                  if (username.length > 0) {
                    setUsernameError("");
                  }
                  setUserName(e.target.value);
                }}
                name="username"
                id="username"
                placeholder="Username"
                style={{ paddingLeft: "20px" }}
              />
            </div>
          </div>

          <div className="inputField">
            <div className="form-field d-flex align-items-center">
              <span
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "10px",
                  transform: "rotate(90deg)",
                }}
                className="fa fa-key"
              ></span>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  if (password.length > 0) {
                    setPasswordError("");
                  }
                  setPassword(e.target.value);
                }}
                style={{ paddingLeft: "20px" }}
              />
            </div>
          </div>
          <br />
          {usernameError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{usernameError}</p>
            </h4>
          )}
          {PasswordError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{PasswordError}</p>
            </h4>
          )}
          {loginStatus && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{loginStatus}</p>
            </h4>
          )}

          <br />
          <button type="submit" className="btn mt-3">
            Login
          </button>
          {/* <p style={{ color: "red" }}>{loginStatus}</p> */}
        </form>
        <br />
        <div className="text-center">
          <a style={{ colour: "#2874A6" }} href="/confirm-password">
            Forgot password?
          </a>
          {"  "}
          OR{"  "}
          <a style={{ colour: "#2874A6" }} href="/signup">
            Sign up
          </a>
        </div>
        <div>
          <img
            style={{ width: "10rem", height: "7rem" }}
            className="img float-right"
            src={require("./HoneywellLogo.png")}
            alt=""
          />
        </div>
      </div>
      <div className="position-relative">
        <div className="position-absolute bottom-0 end-0"></div>
      </div>
    </>
  );
}
