import "./login.scss";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import Axios from "axios";
export default function Edit(props) {
  const navigate = useNavigate();
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [EditStatus, setEditStatus] = useState(false);
  const [isLoggedin, setIsLoggedin] = useState("");
  const [loginStatus, setLoginStatus] = useState("");
  const [oldPassError, setOldPassError] = useState("");
  const [newPassError, setNewPassError] = useState("");
  const [confirmPassError, setConfirmPassError] = useState("");

  const cancelbtn = () => {
    navigate("/login");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (oldPass.length < 6) {
      setOldPassError("Old Password cannot less than 6 characters");
      return;
    }
    if (newPass.length < 6) {
      setNewPassError("New Password cannot less than 6 characters");
      return;
    }
    if (confirmPass.length < 6) {
      setConfirmPassError("Confirm Password cannot less than 6 characters");
      return;
    }
    Axios.post(`http:///${window.location.hostname}:3005/edit`, {
      isLoggedin: window.atob(isLoggedin),
      oldPass: oldPass,
      newPass: newPass,
      confirmPass: confirmPass,
    }).then((response) => {
      // console.log(response);
      if (response.data.status === true) {
        // console.log();
        setEditStatus(
          <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
        );
        alert("Data Updated successfully");
        localStorage.removeItem("CurrentUser");
        navigate("/login");
      } else {
        // console.log(response.data.data);
        setEditStatus(
          <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
        );
      }
    });
  };
  useEffect(() => {
    const loggedInUser = localStorage.getItem("CurrentUser");
    // console.log(loggedInUser, "loggedInUser");
    if (loggedInUser) {
      setIsLoggedin(loggedInUser);
    }
  }, []);
  return (
    <>
      {/* {isLoggedin} */}
      <div className="wrapper1">
        <br></br>
        <div className="logo">
          <img className="img" src={require("./iocl-logo.png")} alt="" />
        </div>
        <div className="text-center mt-4 name">
          <b>Hi {window.atob(isLoggedin)}</b>
        </div>
        <div className="text-center mt-3 name">
          <b>Change Password</b>
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
                  transform: "rotate(90deg)",
                }}
                className="fa fa-key"
              ></span>
              <input
                // {...register("password", {
                //   required: true,
                //   minLength: 5,
                // })}
                id="password"
                type="password"
                placeholder="Old Password"
                onChange={(e) => {
                  if (oldPass.length > 0) {
                    setOldPassError("");
                  }
                  setOldPass(e.target.value);
                }}
                value={oldPass}
                style={{ paddingLeft: "20px" }}
              />
            </div>
            {/* {errors?.password?.type === "required" && (
              <p style={{ color: "red" }}>This field is required</p>
            )}
            {errors?.password?.type === "minLength" && (
              <p style={{ color: "red" }}>
                password cannot less than 5 characters
              </p>
            )} */}
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
                // {...register("newPass", {
                //   required: true,
                //   minLength: 5,
                // })}
                id="password"
                type="password"
                placeholder="New Password"
                onChange={(e) => {
                  if (newPass.length > 0) {
                    setNewPassError("");
                  }
                  setNewPass(e.target.value);
                }}
                value={newPass}
                style={{ paddingLeft: "20px" }}
              />
            </div>
            {/* {errors?.newPass?.type === "required" && (
              <p style={{ color: "red" }}>This field is required</p>
            )}
            {errors?.newPass?.type === "minLength" && (
              <p style={{ color: "red" }}>
                password cannot less than 5 characters
              </p>
            )} */}
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
                // {...register("confirmPass", { required: true })}
                id="password"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => {
                  if (confirmPass.length > 0) {
                    setConfirmPassError("");
                  }
                  setConfirmPass(e.target.value);
                }}
                value={confirmPass}
                style={{ paddingLeft: "20px" }}
              />
            </div>
            {/* } {errors?.confirmPass?.type === "required" && (
              <p style={{ color: "red" }}>This field is required</p>
            )}
            {watch("confirmPass") !== watch("newPass") &&
            getValues("confirmPass") ? (
              <p style={{ color: "red" }}>password not match</p>
            ) : null */}
          </div>
          <br />
          {oldPassError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{oldPassError}</p>
            </h4>
          )}
          {newPassError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{newPassError}</p>
            </h4>
          )}
          {confirmPassError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{confirmPassError}</p>
            </h4>
          )}
          {loginStatus && <h4>{loginStatus}</h4>}
          <div className="row">
            <button
              type="button"
              className="btn bg-danger col"
              onClick={cancelbtn}
              style={{ backgroundColor: "red" }}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary signupbtn col">
              Update
            </button>
          </div>
          {/* {isError} */}
          <p style={{ color: "red" }}>{EditStatus}</p>
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
        <div className="position-absolute bottom-0 end-0">
          {/* Not a member?Sign up now */}
        </div>
      </div>
    </>
  );
}
