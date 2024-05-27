import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";
import AnalyticAxios from "../../Axios/Axios";
export default function Signup(props) {
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [nickName, setNickName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loginStatus, setLoginStatus] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [PasswordError, setPasswordError] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  const cancelbtn = () => {
    navigate("/login");
  };
  const handleSubmit = (e) => {
    // console.log("handleSubmit called");
    e.preventDefault();
    if (username.length < 6) {
      setUsernameError("Username cannot less than 6 characters");
      return;
    }
    if (nickName.length < 3) {
      setNickNameError("Nickname cannot less than 3 characters");
      return;
    }
    if (password.length < 6) {
      setPasswordError("Password cannot less than 6 characters");
      return;
    }
    if (phoneNumber.length < 10) {
      setPhoneNumberError("Please provide Valid phoneNumber");
      return;
    }

    AnalyticAxios.get(`/api//user/register`, {
      username: username,
      password: password,
      phoneNumber: phoneNumber,
      nickName: nickName,
    }).then((response) => {
      if (response.data.status1 == true) {
        // console.log(response.data);
        alert(response.data.data1);
        setLoginStatus(
          <p style={{ fontSize: 12, color: "red" }}>{response.data.data1}</p>
        );
        navigate("/login");
      } else {
        // console.log(response.data.data);
        setLoginStatus(
          <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
        );
      }
    })
    .catch((error) => {
        console.error("Error fetching data:", error);
    });


    // Axios.post(`http:///${window.location.hostname}:3005/register`, {
    //   username: username,
    //   password: password,
    //   phoneNumber: phoneNumber,
    //   nickName: nickName,
    // }).then((response) => {
    //   if (response.data.status1 == true) {
    //     // console.log(response.data);
    //     alert(response.data.data1);
    //     setLoginStatus(
    //       <p style={{ fontSize: 12, color: "red" }}>{response.data.data1}</p>
    //     );
    //     navigate("/login");
    //   } else {
    //     // console.log(response.data.data);
    //     setLoginStatus(
    //       <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
    //     );
    //   }
    // });
  };

  // if (isLoggedin) {
  //     navigate('/webServer')
  // }

  return (
    <>
      <div className="wrapper1">
        <br></br>
        <div className="logo">
          <img className="img" src={require("./iocl-logo.png")} alt="" />
        </div>
        <div className="text-center mt-4 name">
          <b>Sign Up</b>
        </div>
        <br />

        <form
          action=""
          method="POST"
          className="p-3 mt-3"
          onSubmit={handleSubmit}
        >
          <div className="inputField">
            <div className="form-field d-flex align-items-center">
              <span
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "10px",
                }}
                className="fa fa-user"
              ></span>
              <input
                type="username"
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
                autoComplete="off"
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
                }}
                className="fa fa-smile-o"
              ></span>
              <input
                type="password"
                value={nickName}
                onChange={(e) => {
                  if (nickName.length > 0) {
                    setNickNameError("");
                  }
                  setNickName(e.target.value);
                }}
                name="nickName"
                id="nickName"
                placeholder="Enter Your Nickname"
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
                value={password}
                onChange={(e) => {
                  if (password.length > 0) {
                    setPasswordError("");
                  }
                  setPassword(e.target.value);
                }}
                name="password"
                id="pwd"
                placeholder="Password"
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
                }}
                className="fa fa-phone"
              ></span>
              <input
                type="tel"
                pattern="[0-9]{10}"
                label="Enter Phone Number"
                value={phoneNumber}
                onChange={(e) => {
                  if (phoneNumber.length > 0) {
                    setPhoneNumberError("");
                  }
                  setPhoneNumber(e.target.value);
                }}
                name="phoneNumber"
                id="phoneNumber"
                placeholder="Enter a 10-digit phone no."
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
          {nickNameError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{nickNameError}</p>
            </h4>
          )}
          {PasswordError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{PasswordError}</p>
            </h4>
          )}
          {phoneNumberError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{phoneNumberError}</p>
            </h4>
          )}
          {loginStatus && <h4>{loginStatus}</h4>}
          <div className="row">
            <button
              type="button"
              onClick={cancelbtn}
              className="btn bg-danger col"
              style={{ backgroundColor: "red" }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary signupbtn col">
              Sign Up
            </button>
          </div>
        </form>
        <br />
        <div>
          <img
            style={{ position: "relative", height: "70px" }}
            className="float-right"
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
