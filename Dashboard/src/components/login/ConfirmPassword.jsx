import "./login.scss";
import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import Axios from "axios";
import { useForm } from "react-hook-form";
export default function ConfirmPassword(props) {
  // const {
  //   register,
  //   handleSubmit,
  //   getValues,
  //   watch,
  //   formState: { errors },
  // } = useForm();
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [nickName, setNickName] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [nickNameError, setNickNameError] = useState("");
  const [passwordConfirmError, setpasswordConfirmError] = useState("");
  const [PasswordError, setPasswordError] = useState("");

  const [loginStatus, setLoginStatus] = useState("");

  const cancelbtn = () => {
    navigate("/login");
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log(username, username.length);
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
    if (passwordConfirm.length < 6) {
      setpasswordConfirmError("confirm Password cannot less than 6 characters");
      return;
    }
    Axios.post(`http:///${window.location.hostname}:3005/forgotPass`, {
      username: username,
      password: password,
      nickName: nickName,
      passwordConfirm: passwordConfirm,
    }).then((response) => {
      if (response.data.status == true) {
        // console.log(response.data.data);
        setLoginStatus(
          <p style={{ fontSize: 12, color: "red" }}>{response.data.data}</p>
        );
        alert("Password Reset successfully");
        navigate("/login");
      } else {
        // console.log(response.data.data);
        setLoginStatus(<p style={{ fontSize: 12 }}>{response.data.data}</p>);
      }
    });
  };

  return (
    <>
      <div className="wrapper1">
        {/* <div className="text-center mt-4 name">TAS Analytics Portal</div> */}
        <br></br>
        <div className="logo">
          <img className="img" src={require("./iocl-logo.png")} alt="" />
        </div>
        <div className="text-center mt-4 name">
          <b>Forgot Password</b>
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
                // {...register("username", {
                //   required: true,
                //   minLength: 6,
                // })}
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
                autoComplete="off"
                style={{ paddingLeft: "20px" }}
              />
            </div>
            {/* {errors?.username?.type === "required" && (
              <p style={{ color: "red" }}>This field is required</p>
            )}
            {errors?.username?.type === "minLength" && (
              <p style={{ color: "red" }}>
                password cannot less than 6 characters
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
                }}
                className="fa fa-smile-o"
              ></span>
              <input
                // {...register("nickName", {
                //   required: true,
                //   minLength: 3,
                // })}
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
            {/* {errors?.nickName?.type === "required" && (
              <p style={{ color: "red" }}>This field is required</p>
            )}
            {errors?.nickName?.type === "minLength" && (
              <p style={{ color: "red" }}>
                password cannot less than 3 characters
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
                // {...register("password", {
                //   required: true,
                //   minLength: 5,
                // })}
                id="password"
                type="password"
                placeholder="New Password"
                onChange={(e) => {
                  if (password.length > 0) {
                    setPasswordError("");
                  }
                  setPassword(e.target.value);
                }}
                value={password}
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
                // {...register("password_repeat", { required: true })}
                id="password"
                type="password"
                placeholder="Confirm Password"
                onChange={(e) => {
                  if (passwordConfirm.length > 0) {
                    setpasswordConfirmError("");
                  }
                  setPasswordConfirm(e.target.value);
                }}
                value={passwordConfirm}
                style={{ paddingLeft: "20px" }}
              />
            </div>
            {/* {errors?.password_repeat?.type === "required" && (
              <p style={{ color: "red" }}>This field is required</p>
            )}
            {watch("password_repeat") !== watch("password") &&
            getValues("password_repeat") ? (
              <p style={{ color: "red" }}>Both Password not match</p>
            ) : null} */}
          </div>
          <br />
          {usernameError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{usernameError}</p>
            </h4>
          )}
          {passwordConfirmError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>
                {passwordConfirmError}
              </p>
            </h4>
          )}
          {PasswordError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{PasswordError}</p>
            </h4>
          )}
          {nickNameError && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{nickNameError}</p>
            </h4>
          )}
          {loginStatus && (
            <h4>
              <p style={{ color: "red", fontSize: 12 }}>{loginStatus}</p>
            </h4>
          )}
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
              Save
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
        <div classNa me="position-absolute bottom-0 end-0">
          {/* Not a member?Sign up now */}
        </div>
      </div>
    </>
  );
}
