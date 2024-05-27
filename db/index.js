const express = require("express");
var cors = require("cors");
const { request, sql, config } = require("./db/db");
var session = require("express-session");
const utf8 = require("utf8");

const app = express();
let decryptedString = new Buffer.from("cG9vamE=", "base64");
// console.log(decryptedString.toString("utf8"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "webslesson",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cors());
app.use(express.json());

const port = 3005;

app.get("/", (req, res) => {
  res.send("hello world");
});
app.get("/getdata", (req, res) => {
  request.query(
    "select Sr_NO ,TT_no ,CardID,reporting_time,qtyKL from Analytics_Dashboard WHERE  Sr_no <=11 ;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        //console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

////Rucha Graph

app.get("/WebServerDataField/:fromdate", (req, res) => {
  const { fromdate } = req.params;
  // console.log('req.params', req.params);
  request.query(
    " select AnalyticsMaster.id , AnalyticsMaster.Description, AnalyticsDetails.Output from AnalyticsMaster join AnalyticsDetails on AnalyticsMaster.Id = AnalyticsDetails.Id where AnalyticsDetails.Date ='" +
      fromdate +
      "' ",
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/GraphData_UI_BayWiseLoadingDetails/:fromdate", (req, res) => {
  const { fromdate } = req.params;
  // console.log(fromdate);

  graphdata =
    " EXECUTE GraphData_UI_BayWiseLoadingDetails @Date='" + fromdate + "' ";
  request.query(graphdata, function (err, recordSet) {
    if (err) {
      // console.log("example", err);
      res.send(err);
    } else {
      // console.log(recordSet,"recordSet");
      res.send(recordSet);
    }
  });
});
app.get(
  "/GraphData_UI_BayWiseLoadingDetailsIndetails/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;
    // console.log(fromdate);

    graphdata =
      " EXECUTE GraphData_UI_BayWiseLoadingDetails @Date='" + fromdate + "' ";
    request.query(graphdata, function (err, recordSet) {
      if (err) {
        // console.log("example", err);
        res.send(err);
      } else {
        // console.log(recordSet,"recordSet");
        res.send(recordSet);
      }
    });
  }
);

app.get("/BayWiseLoadingFlowRate/:fromdate", (req, res) => {
  const { fromdate } = req.params;

  BayWiseLoadingFlowrate =
    " EXECUTE GraphData_UI_BayWiseLoadingFlowRate  @Date='" + fromdate + "' ";
  request.query(BayWiseLoadingFlowrate, function (err, recordSet) {
    if (err) {
      // console.log("Error", err);
      res.send(err);
    } else {
      // console.log("Ruchs SP DATA", recordSet);
      res.send(recordSet);
    }
  });
});
//GraphData_UI_ProductWiseLoadedQuantity
app.get("/ProductWiseLoadedQty/:fromdate", (req, res) => {
  const { fromdate } = req.params;

  ProductWiseLoadedQty =
    " EXECUTE GraphData_UI_ProductWiseLoadedQuantity @Date='" + fromdate + "' ";
  request.query(ProductWiseLoadedQty, function (err, recordSet) {
    if (err) {
      //console.log(err);
      res.send(err);
    } else {
      //console.log(recordSet);
      res.send(recordSet);
    }
  });
});

app.get("/TTFillingStatus/:fromdate", (req, res) => {
  const { fromdate } = req.params;
  TTFilling = " EXECUTE GraphData_UI_TTFillingStatus @Date='" + fromdate + "' ";
  request.query(TTFilling, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
    }
  });
});

app.get("/AvgBayUtilizationTime/:fromdate", (req, res) => {
  const { fromdate } = req.params;

  AvgBayUtilizationTime =
    " EXECUTE GraphData_UI_AverageBayUtilization @Date='" + fromdate + "' ";
  request.query(AvgBayUtilizationTime, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
    }
  });
});

app.get("/AvgBayOccupancyTime/:fromdate", (req, res) => {
  const { fromdate } = req.params;

  AvgBayUtilizationTime =
    " EXECUTE GraphData_UI_AverageBayOccupancy @Date='" + fromdate + "' ";
  request.query(AvgBayUtilizationTime, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
    }
  });
});

app.get("/RegisteredFilledTrucks/:fromdate", (req, res) => {
  const { fromdate } = req.params;
  // console.log(fromdate);
  graphdata =
    " EXECUTE GraphData_UI_RegisteredandFilledTruckList @Date='" +
    fromdate +
    "' ";
  request.query(graphdata, function (err, recordSet) {
    if (err) {
      // console.log("example", err);
      res.send(err);
    } else {
      // console.log(recordSet, 'ravina');
      res.send(recordSet);
    }
  });
});

app.get("/BayOpsTiming/:fromdate", (req, res) => {
  const { fromdate } = req.params;

  BayOpsTiming =
    " EXECUTE GraphData_UI_BayOpsTiming @Date= '" + fromdate + "' ";
  request.query(BayOpsTiming, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
    }
  });
});

app.get("/AvgFillingQtyWise/:fromdate", (req, res) => {
  const { fromdate } = req.params;
  AvgFillingQtyWise =
    "EXECUTE GraphData_UI_AverageFillingQtyWise @Date='" + fromdate + "' ";
  request.query(AvgFillingQtyWise, function (err, recordSet) {
    if (err) {
      // console.log(err);
      res.send(err);
    } else {
      //  console.log(recordSet);
      res.send(recordSet);
    }
  });
});

//GraphData_UI_AvgTimeCycle

app.get("/AvgTimeCycle/:fromdate", (req, res) => {
  const { fromdate } = req.params;
  AvgTimeCycle = " EXECUTE GraphData_UI_AvgTimeCycle @Date='" + fromdate + "' ";
  request.query(AvgTimeCycle, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
    }
  });
});
/////

app.get("/fire_eng/pumpAnalysis", (req, res) => {
  request.query(
    "SELECT * FROM Analytics_Dashboard;",
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        //  console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/tlf_analysis", (req, res) => {
  request.query("SELECT * FROM TLF_analysis;", function (err, recordSet) {
    if (err) {
      // console.log(err);
      res.send(err);
    } else {
      // console.log(recordSet);
      res.send(recordSet);
    }
  });
});

app.get("/TLF/latefangeneration", (req, res) => {
  request.query(
    "SELECT Sr_no,TT_no,reporting_time,fan_generated_time,late_tt FROM Analytics_Dashboard WHERE Sr_no <=11;",
    function (err, recordSet) {
      if (err) {
        //  console.log(err);
        res.send(err);
      } else {
        //   console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/TLF/lateinvgeneration", (req, res) => {
  request.query(
    "SELECT Sr_no,TT_no,reporting_time,fan_generated_time,inv_generated_time,late_tt FROM Analytics_Dashboard WHERE Sr_no <=11;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/TTs_over_speeding_in_TLF", (req, res) => {
  request.query(
    "SELECT no_of_days_FE,days FROM Analytics_Dashboard WHERE Sr_no =1;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/inv_generated_before_filling_tts", (req, res) => {
  request.query(
    "select TLF_analysis.Sr_no , TLF_analysis.Petroleum_name,TLF_analysis.Vendor_No,Analytics_Dashboard.TT_no,TLF_analysis.dateTime,TLF_analysis.Invoice_no  FROM Analytics_Dashboard join TLF_analysis on Analytics_Dashboard.Sr_No = TLF_analysis.Sr_no;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});
app.get("/TTs_having_higher_cycle_time", (req, res) => {
  // request.query("SELECT Sr_no,Truck_no,Vendor_No,dateTime,todateTime,Invoice_no FROM TLF_analysis;", function (err, recordSet) {
  request.query(
    "select TLF_analysis.Sr_no ,TLF_analysis.Vendor_No,Analytics_Dashboard.TT_no,TLF_analysis.dateTime,TLF_analysis.todateTime,TLF_analysis.Invoice_no  FROM Analytics_Dashboard join TLF_analysis on Analytics_Dashboard.Sr_No = TLF_analysis.Sr_no;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});



app.get("/dateto/:fromdate/:todate", (req, res) => {
  const { fromdate, todate } = req.params;
  // console.log('req.params', req.params);
  request.query(
    `select Analytics_Dashboard.Bays,Analytics_Dashboard.Description,TLF_analysis.dateTime,TLF_analysis.todateTime
    from Analytics_Dashboard join TLF_analysis on Analytics_Dashboard.Sr_No = TLF_analysis.Sr_no where DateOfBayUtilized between '${fromdate}' and '${todate}';`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/TT_loading_time/:fromdate/:todate", (req, res) => {
  const { fromdate, todate } = req.params;
  // console.log('req.params', req.params);
  request.query(
    `select  Analytics_Dashboard.TT_no, TLF_analysis.dateTime,TLF_analysis.todateTime,
    TLF_analysis.Petroleum_name,Analytics_Dashboard.Bays
    from Analytics_Dashboard join TLF_analysis on Analytics_Dashboard.Sr_No = TLF_analysis.Sr_no where DateOfBayUtilized between '${fromdate}' and '${todate}';`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // let decryptedString = new Buffer.from("cHJhYmFsIzEyMw==", "base64");
  // console.log(decryptedString.toString("utf8"));
  const decrypted = new Buffer.from(password, "utf8");
  decryptedUsername = decrypted.toString("base64");

  //console.log(username, decryptedUsername);

  request.query(
    `SELECT UserName,CurrentPassword FROM Users WHERE UserName= '${username}' AND CurrentPassword= '${decryptedUsername}'`,
    function (err, result) {
      if (err) {
        res.send({
          status: false,
          data: "Please enter Username and Password!",
        });
      } else if (result != null && result.recordset.length > 0) {
        const username = result.recordset.map((a) => a.UserName);
        // console.log(username, "User Login Successfully!!");
        res.send({ status: true, data: "User Login Successfully!!" });
      } else {
        res.send({
          status: false,
          data: "User Not Found, Please provide Valid Credentials!",
        });
        //console.log("Either username or password is incorrect");
      }
    }
  );
});

app.post("/register", (req, res) => {
  let usernameNew = req.body.username;
  let passwordNew = req.body.password;
  let phoneNumber = req.body.phoneNumber;
  let nickNameNew = req.body.nickName;

  const decrypted = new Buffer.from(passwordNew, "utf8");
  decryptedPassword = decrypted.toString("base64");

  const nickName = new Buffer.from(nickNameNew, "utf8");
  decryptedNickname = nickName.toString("base64");

  // console.log(
  //   usernameNew,
  //   passwordNew,
  //   decryptedPassword,
  //   phoneNumber,
  //   nickNameNew,
  //   decryptedNickname
  // );

  request.query(
    `SELECT UserID, UserName, CurrentPassword, PhoneNumber, NickName FROM Users WHERE UserName= '${usernameNew}' `,
    function (err, result) {
      //console.log(result, "selected data");
      const findUsername = result.recordset.map((a) => a.UserName);
      // console.log(findUsername.length)
      if (err) {
        // console.log(result, "Please enter Username and Password!");
        res.send({
          status: false,
          data: "Please enter Username and Password!",
        });
        // console.log(findUserName) Please enter username an password
      }
      if (findUsername.length != 0) {
        // console.log(result, "UserName is Already exists");
        res.send({ status: true, data: "UserName is Already exists" });
      } else if (findUsername.length == 0) {
        //console.log(result, "resultsNew");
        request.query(
          `INSERT INTO Users (UserId, UserName,CurrentPassword,PhoneNumber,NickName) VALUES ((select top 1 UserID from users order by UserID desc) + 1,'${usernameNew}', '${decryptedPassword}','${phoneNumber}','${decryptedNickname}')`,
          function (err, result) {
            // console.log(
            //   typeof usernameNew,
            //   typeof decryptedPassword,
            //   typeof phoneNumber,
            //   typeof decryptedNickname
            // );
            if (err) {
              //   console.log(err, "err");
              res.send({ status: false, data: err });
            } else if (result) {
              //   console.log(result, "User Registered Successfully!!");
              res.send({
                status1: true,
                data1: "User Registered Successfully!!",
              });
            } else {
              res.send({
                status: false,
                data: "Please enter Username and Password!",
              });
              //   console.log(result, "Please enter Username and Password!");
            }
          }
        );
      }
    }
  );
});

app.post("/edit", async (req, res) => {
  const isLoggedin = req.body.isLoggedin;
  const oldPass = req.body.oldPass;
  const newPass = req.body.newPass;
  const confirmPass = req.body.confirmPass;
  let user = atob(isLoggedin);
  // console.log(user.toString("utf8"), "user");
  // console.log(oldPass, newPass, confirmPass, "ravina");

  if (newPass === confirmPass) {
    const decryptedNew = new Buffer.from(newPass, "utf8");
    const encryptedCurrentPassword = decryptedNew.toString("base64");

    const decryptedOld = new Buffer.from(oldPass, "utf8");
    const encryptedOldPass = decryptedOld.toString("base64");
    // console.log(encryptedCurrentPassword, encryptedOldPass, user, "123456");
    request.query(
      `UPDATE Users SET OldPassword = '${encryptedOldPass}' , CurrentPassword ='${encryptedCurrentPassword}' where UserName = '${isLoggedin}'`,
      function (err, result) {
        if (result) {
          request.query(
            `select CurrentPassword from Users where UserName = '${isLoggedin}'`,
            function (err, result) {
              if (result) {
                if (result != null) {
                  // console.log(result, "Data Updated  Successfully!!");
                  res.send({
                    status: true,
                    data: "Data Updated Successfully!!",
                  });
                } else {
                  res.send({
                    status: false,
                    data: "Please enter Correct details!!",
                  });

                  // console.log(result, "Please enter Correct details");
                }
              } else {
                // console.log("failed");
              }
            }
          );
        } else {
          //console.log("false");
        }
      }
    );
  }
});

app.post("/forgotPass", async (req, res) => {
  const username = req.body.username;
  const nickName = req.body.nickName;
  const password = req.body.password;
  const passwordConfirm = req.body.passwordConfirm;
  const decryptedNick = new Buffer.from(nickName, "utf8");
  decryptedNickNameNew = decryptedNick.toString("base64");
  const decryptedPass = new Buffer.from(password, "utf8");
  decryptedPassNew = decryptedPass.toString("base64");
  const decryptedPassConf = new Buffer.from(passwordConfirm, "utf8");
  decryptedPassConfNew = decryptedPassConf.toString("base64");

  // console.log(
  //   username,
  //   nickName,
  //   decryptedNickNameNew,
  //   password,
  //   decryptedPassNew,
  //   passwordConfirm,
  //   decryptedPassConfNew
  // );

  request.query(
    ` UPDATE Users SET CurrentPassword = '${decryptedPassConfNew}' WHERE UserName ='${username}' AND  NickName = '${decryptedNickNameNew}'`,
    function (err, result) {
      if (err) {
        res.send({ status: false, data: "Please enter correct details" });
      } else if (result) {
        request.query(
          `select CurrentPassword from Users where UserName = '${username}' AND NickName = '${decryptedNickNameNew}'`,
          function (err, result) {
            if (err) {
              res.send({ status: false, data: err });
            } else if (result != null && result.recordset.length > 0) {
              // console.log(result, "Data Updated  Successfully!!");
              res.send({ status: true, data: "Password reset successfully!!" });
            } else {
              res.send({
                status: false,
                data: "Either username or nickname is incorrect!!",
              });
              // console.log(result, "Please enter Correct details");
            }
          }
        );
      } else {
        res.send({ status: false, data: "Please enter correct details" });
        // console.log("Please enter correct details");
      }
    }
  );
});

app.get("/loading_flowrate/:thisIsTrialDate", (req, res) => {
  const { thisIsTrialDate } = req.params;
  // console.log('req.params', thisIsTrialDate);
  request.query(
    "select bayId,prodDesc,qtyKL from Analytics_Dashboard ",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.listen(port, () => {
  // console.log(`example app listening on port ${port}`);
});

// updated on 17-03-23
app.get("/ChartForMonth/:SelectedMonth", (req, res) => {
  const { SelectedMonth } = req.params;

  request.query(
    `SELECT convert(varchar,DateTime,5)as[DateTime], 'Bay ' + CAST(BayId AS VARCHAR(50)) AS BayId, NoOfTrucks from BayLoadingTrucks where MONTH(DateTime) = '${SelectedMonth}';`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/ChartForRange/:getfromdate/:gettodate", (req, res) => {
  const { getfromdate, gettodate } = req.params;
  //console.log('req.params', getfromdate, gettodate);
  request.query(
    `SELECT convert(varchar,DateTime,5)as[DateTime], 'Bay ' + CAST(BayId AS VARCHAR(50)) AS BayId, NoOfTrucks from BayLoadingTrucks where DateTime between '${getfromdate}' and '${gettodate}';`,
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/ChartForToday/:todaysDate", (req, res) => {
  const { todaysDate } = req.params;
  // console.log('req.params', todaysDate);
  // SELECT 'Bay ' + CAST(BayId AS VARCHAR(50)) AS BayId, NoOfTrucks from BayLoadingTrucks
  request.query(
    `SELECT convert(varchar,DateTime,5)as[DateTime], 'Bay ' + CAST(BayId AS VARCHAR(50)) AS BayId, NoOfTrucks from BayLoadingTrucks where DateTime = '${todaysDate}';`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        //console.log("hello", recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/Headings", (req, res) => {
  request.query("select * from AnalyticsMaster;", function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
    }
  });
});

app.get("/Menu", (req, res) => {
  request.query(
    "select id,Analytics_Discription,Link from Analytics_Sidebar ORDER BY id ASC ;",
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/BarChart1/:todaysDate", (req, res) => {
  const { todaysDate } = req.params;
  // request.query(`SELECT Source,Series,Hours,DateTime FROM (select Source , SeriesOn,SeriesOff,Maint,Fail,DateTime from BayLoadingTrucks ) table1 UNPIVOT( Hours FOR Series IN ([SeriesOn],[SeriesOff],[Maint],[Fail]) ) as table2 where DateTime = '${todaysDate}';`, function (err, recordSet) {
  request.query(
    `select Source,Maint,convert(varchar,DateTime,26)as[DateTime] from BayLoadingTrucks where DateTime = '${todaysDate}' AND Maint>30;`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        //console.log("hello", recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/BarChart1ForMonth/:SelectedMonth", (req, res) => {
  const { SelectedMonth } = req.params;

  request.query(
    `SELECT Source,Maint,convert(varchar,DateTime,26)as[DateTime] from BayLoadingTrucks where MONTH(DateTime) = '${SelectedMonth}' AND Maint>30;`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

app.get("/BarChart1ForRange/:getfromdate/:gettodate", (req, res) => {
  const { getfromdate, gettodate } = req.params;
  //console.log('req.params', getfromdate, gettodate);
  request.query(
    `SELECT Source,Maint,convert(varchar,DateTime,26)as[DateTime] from BayLoadingTrucks where DateTime between '${getfromdate}' and '${gettodate}' AND Maint>30;`,
    function (err, recordSet) {
      if (err) {
        // console.log(err);
        res.send(err);
      } else {
        // console.log(recordSet);
        res.send(recordSet);
      }
    }
  );
});

//27-03-2013

app.get("/selectionOfInput/", (req, res) => {
  const { InputValue, Series } = req.query;
  const { fromDateValue, todaysDate, toMonthValue, toDateValue } = req.query;
  if (fromDateValue && toDateValue) {
    request.query(
      `SELECT Source,Series,Hours FROM (select Source , SeriesOn,SeriesOff,Maint,Fail,DateTime from BayLoadingTrucks ) table1 UNPIVOT( Hours FOR Series IN ([SeriesOn],[SeriesOff],[Maint],[Fail]) ) as table2 where Hours > '${InputValue}' AND Series='${Series}' AND DateTime between '${fromDateValue}' and '${toDateValue}' `,
      function (err, recordSet) {
        if (err) {
          res.send(err);
        } else {
        }
      }
    );
  } else if (toMonthValue) {
    request.query(
      `SELECT Source,Series,Hours FROM (select Source , SeriesOn,SeriesOff,Maint,Fail,DateTime from BayLoadingTrucks ) table1 UNPIVOT( Hours FOR Series IN ([SeriesOn],[SeriesOff],[Maint],[Fail]) ) as table2 where Hours > '${InputValue}' AND Series='${Series}' AND MONTH(DateTime) = '${toMonthValue}' `,
      function (err, recordSet) {
        if (err) {
          res.send(err);
        } else {
          res.send(recordSet);
        }
      }
    );
  } else if (todaysDate) {
    request.query(
      `SELECT Source,Series,Hours FROM (select Source , SeriesOn,SeriesOff,Maint,Fail,DateTime from BayLoadingTrucks ) table1 UNPIVOT( Hours FOR Series IN ([SeriesOn],[SeriesOff],[Maint],[Fail]) ) as table2 where Hours > '${InputValue}' AND Series='${Series}' AND DateTime = '${todaysDate}' `,
      function (err, recordSet) {
        if (err) {
          res.send(err);
        } else {
          res.send(recordSet);
        }
      }
    );
  } else {
    // console.log("fail")
  }
});

app.get("/selectionSeries", (req, res) => {
  request.query(
    "SELECT Source,Series,Hours FROM (select Source , SeriesOn,SeriesOff,Maint,Fail from BayLoadingTrucks ) table1 UNPIVOT( Hours FOR Series IN ([SeriesOn],[SeriesOff],[Maint],[Fail]) ) as table2",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/TTs_failure_interlocks/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(StartDate, EndDate);
  request.query(
    `select LogId,LogDesc,LogTime from LrcLog  where CONVERT(DATE,LogTime) between '${StartDate}' and '${EndDate}'`,
    function (err, recordSet) {
      //LogId,LogCode,LogDesc,Operator,Location,Priority,Application,LoadId
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});
//FE_maintenance_more_than_month
app.get("/FE_maintenance_more_than_month/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // /:StartDate/:EndDate
  // console.log(StartDate, EndDate, "StartDate")
  getData =
    "EXECUTE FE_maintenance_more_than_month  @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log("recordSet");
      res.send(recordSet);
    }
  });
});





app.get("/FE_maintenance_more_than_month/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;

  // console.log(StartDate, EndDate, "StartDate")
  getData =
    "EXECUTE FE_maintenance_more_than_month @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log("recordSet");
      res.send(recordSet);
    }
  });
});




app.get("/Foam_tank_level_low/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;

  // console.log(StartDate, EndDate, "data dates");
  getData =
    "EXECUTE Foam_tank_level_low @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log("recordSet");
      res.send(recordSet);
    }
  });
});
//ESD_not_tested_in_month
app.get("/selectAnalytics", (req, res) => {
  request.query(
    "select  * from AnalyticsMaster where Category IS NOT NULL And Enable=1  ;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/search", (req, res) => {
  request.query(
    "select * from AnalyticsMaster where Category IS NOT NULL And Enable=1   ;",
    function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    }
  );
});

app.get("/Fire_water_tank_not_topped_up/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;

  // console.log(StartDate, EndDate, "StartDate");
  getData =
    "EXECUTE Fire_water_tank_not_topped_up  @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log(recordSet, "recordSet");
      res.send(recordSet);
    }
  });
});

app.get("/list_of_Tanks_level_difference/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;

  // console.log(StartDate, EndDate, "data dates");
  getData =
    "EXECUTE list_of_Tanks_level_difference @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log("recordSet");
      res.send(recordSet);
    }
  });
});



app.get("/TLF_1_Combined_Date/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(StartDate, EndDate, "tlf1");
  const spName = "TLF_1_Combined";
  TLF1_Grid =
    " EXECUTE " +
    spName +
    " @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      // console.log(err);
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

app.get("/TotalCountOfIndents/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(StartDate, EndDate,'TotalCountOfIndents');
  const spName = "TotalCountOfIndents";
  TotalCountOfIndents =
    " EXECUTE " +
    spName +
    " @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TotalCountOfIndents, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

app.get("/TLF_2_Combined/:StartDate/:EndDate/:value1/:value2", (req, res) => {
  const { StartDate, EndDate, value1, value2 } = req.params;
  // console.log(StartDate, EndDate, value, "TLF_2_Combined_Date");
  TLF1_Grid =
    " EXECUTE TLF_2_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "', @value1 = " +
    value1 +
    " , @value2 = " +
    value2 +
    " ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log("tlf2 ", recordSet);
    }
  });
});

app.get("/TLF_4_Combined/:StartDate/:EndDate/:value1/:value2", (req, res) => {
  const { StartDate, EndDate, value1, value2 } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_4_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "', @value1 = " +
    value1 +
    " , @value2 = " +
    value2 +
    " ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});
//TLF_5_Date // GRID
app.get("/TLF_5_Combined/:StartDate/:EndDate/:value", (req, res) => {
  const { StartDate, EndDate, value } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_5_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' , @value = " +
    value +
    " ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF_6_Date // GRID
app.get("/TLF_6_Combined/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(StartDate, EndDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_6_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF_7_Date // GRID
app.get("/TLF_7_Combined/:StartDate/:EndDate/:error", (req, res) => {
  const { StartDate, EndDate, error } = req.params;
  // console.log(StartDate, EndDate);
  TLF1_Grid =
    " EXECUTE TLF_7_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' , @error = " +
    error +
    " ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
      // console.log(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF_8_Date // GRID
app.get("/TLF_8_Combined/:StartDate/:EndDate/:value1/:value2", (req, res) => {
  const { StartDate, EndDate, value1, value2 } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_8_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "', @value1 = " +
    value1 +
    " , @value2 = " +
    value2 +
    " ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
      // console.log(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

// app.get("/TLF_9_Combined/:StartDate/:EndDate", (req, res) => {
//   const {StartDate, EndDate } = req.params;
//   // console.log(filterType, todaysDate, "op");
//   TLF1_Grid =
//     " EXECUTE TLF_9_Combined @StartDate = '" +
//     StartDate +
//     "', @EndDate = '" +
//     EndDate +
//     "' ";

//   request.query(TLF1_Grid, function (err, recordSet) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(recordSet);
//       // console.log(recordSet);
//     }
//   });
// });

app.get("/TotalCountOfCompartments/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(StartDate, EndDate);
  const spName = "TotalCountOfCompartments";
  TotalCountOfCompartments =
    " EXECUTE " +
    spName +
    " @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TotalCountOfCompartments, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

app.get("/TLF_9_Combined/:StartDate/:EndDate/:value1/:value2", (req, res) => {
  const { StartDate, EndDate, value1, value2 } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_9_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "', @value1 = " +
    value1 +
    " , @value2 = " +
    value2 +
    " ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF_10_Date // GRID
app.get("/TLF_10_Combined/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_10_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

// app.get("/TLF_11_Combined/:StartDate/:EndDate/:value", (req, res) => {
//   const { StartDate, EndDate, value } = req.params;
//   // console.log(filterType, todaysDate, "op");
//   TLF1_Grid =
//     " EXECUTE TLF_11_Combined @StartDate = '" +
//     StartDate +
//     "', @EndDate = '" +
//     EndDate +
//     "' , @value = " +
//     value +
//     " ";

//   request.query(TLF1_Grid, function (err, recordSet) {
//     if (err) {
//       res.send(err);
//     } else {
//       res.send(recordSet);
//       // console.log(recordSet);
//     }
//   });
// });

app.get("/TLF_12_Graph/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  const spName = "TLF_12_Graph";
  TLF1_Grid =
    " EXECUTE " +
    spName +
    " @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      // console.log(err, "tlf12");
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet, "tlf12");
    }
  });
});

// app.get("/TLF_12_Graph1/:StartDate/:EndDate", (req, res) => {
//   const { StartDate, EndDate } = req.params;
//   const spName = "TLF_12_Graph1";
//   TLF1_Grid =
//     " EXECUTE " +
//     spName +
//     " @StartDate = '" +
//     StartDate +
//     "', @EndDate = '" +
//     EndDate +
//     "' ";

//   request.query(TLF1_Grid, function (err, recordSet) {
//     if (err) {
//       // console.log(err, "tlf12");
//       res.send(err);
//     } else {
//       res.send(recordSet);
//       // console.log(recordSet, "tlf12");
//     }
//   });
// });

//TLF15

//TLF_15_Date // GRID
app.get("/TLF_15_Combined/:StartDate/:EndDate/:value", (req, res) => {
  const { StartDate, EndDate, value } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_15_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' , @value = " +
    value +
    "  ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF_15_Date // Bay
app.get("/TLF_15_Combined_Bay/:StartDate/:EndDate/:value", (req, res) => {
  const { StartDate, EndDate, value } = req.params;
  // console.log(filterType, todaysDate, "op");
  TLF1_Grid =
    " EXECUTE TLF_15_Combined_Bay @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' , @value = " +
    value +
    "  ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log("TLF15bay: ", recordSet);
    }
  });
});

//TLF_16_Date // GRID
app.get(
  "/TLF_16_Combined/:StartDate/:EndDate/:value2/:selectedColumn1/:selectedColumn2",
  (req, res) => {
    const {
      StartDate,
      EndDate,
    
      value2,
      selectedColumn1,
      selectedColumn2,
    } = req.params;
    // console.log(StartDate, EndDate, value);
    TLF1_Grid =
      " EXECUTE TLF_16_Combined @StartDate = '" +
      StartDate +
      "', @EndDate = '" +
      EndDate +
      "', @value2 = " +
      value2 +
      " , @Column1 = '" +
      selectedColumn1 +
      "'  , @Column2 = '" +
      selectedColumn2 +
      "' ";

    request.query(TLF1_Grid, function (err, recordSet) {
      if (err) {
        res.send(err);
      } else {
        res.send(recordSet);
      }
    });
  }
);

//TLF_16_Graph
app.get("/TLF_16_Graph/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  TLF1_Grid =
    " EXECUTE TLF_16_Graph @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
      // console.log(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF17

//TLF_17_Date // GRID
app.get("/TLF_17_Combined_Date/:StartDate/:EndDate/:value", (req, res) => {
  const { StartDate, EndDate, value } = req.params;
  TLF1_Grid =
    " EXECUTE TLF_17_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "'  , @value = " +
    value +
    "   ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
      // console.log(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

//TLF18

app.get("/TLF_18_Combined/:StartDate/:EndDate/:value", (req, res) => {
  const { StartDate, EndDate, value } = req.params;
  TLF1_Grid =
    " EXECUTE TLF_18_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "'  , @value = " +
    value +
    "   ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
    } else {
      res.send(recordSet);
    }
  });
});

//TLF19

app.get("/TLF_19_Combined/:StartDate/:EndDate/:value", (req, res) => {
  const { StartDate, EndDate, value } = req.params;

  TLF1_Grid =
    " EXECUTE TLF_19_Combined @StartDate = '" +
    StartDate +
    "', @EndDate = '" +
    EndDate +
    "' , @value = " +
    value +
    "  ";

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
      // console.log(err, "err");
    } else {
      res.send(recordSet);
      // console.log(recordSet, "recordSet");
    }
  });
});


app.get(
  "/TLF_20/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TLF_20  @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get("/TLF_20_Combined_Graph", (req, res) => {
  //const { StartDate, EndDate } = req.params;

  TLF1_Grid = " EXECUTE TLF_20_Combined_Graph ";  

  request.query(TLF1_Grid, function (err, recordSet) {
    if (err) {
      res.send(err);
      // console.log(err, "err");
    } else {
      res.send(recordSet);
      // console.log(recordSet, "recordSet");
    }
  });
});

app.get(
  "/AOPS_not_tested_as_per_their_PTI_interval/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE AOPS_not_tested_as_per_their_PTI_interval @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS2/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS2 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS_03/:fromdate",
  (req, res) => {
    const {fromdate} = req.params;
    // console.log(fromdate , "date");
    getData =
      "EXECUTE TFMS_03_pv @fromdate='" +
      fromdate + "' ";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.l/og("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS_03_ullage/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS_03_ullage @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

//ravina ....................................  14/12/2023 11:30 ...............................................................

app.get(
  "/AOPS_not_tested_as_per_their_PTI_interval/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE AOPS_not_tested_as_per_their_PTI_interval @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS7/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS7 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS10/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS10 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS12/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS12 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS9/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS9 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS11/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS11 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS13/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS13 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);


app.get(
  "/TFMS15_TanksSprinkler/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE TFMS15_TanksSprinkler @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/TFMS15_FoamFacility/:StartDate/:EndDate",
  (req, res) => {
     const { StartDate, EndDate } = req.params;

  // console.log(StartDate, EndDate, "StartDate")
  getData =
    "EXECUTE TFMS15_FoamFacility @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log("recordSet", recordSet);
      res.send(recordSet);
    }
  });
  }
);

app.get(
  "/FE_is_not_run_for_four_hours_in_a_year/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE FE_is_not_run_for_four_hours_in_a_year @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/FE_freq_engine_wise_for_min_30m_in_a_week/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "data dates")
    getData =
      "EXECUTE FE_freq_engine_wise_for_min_30m_in_a_week @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet");
        res.send(recordSet);
      }
    });
  }
);

app.get("/ESD_not_tested_in_month/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;

  // console.log(StartDate, EndDate, "data dates")
  getData =
    "EXECUTE ESD_not_tested_in_month @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log("err");
      res.send(err);
    } else {
      // console.log("recordSet", recordSet);
      res.send(recordSet);
    }
  });
});


app.get(
  "/SYSTEM_1/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE SYSTEM_1 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);


app.get(
  "/jockey_running_frequency_in_a_day/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;
    // console.log(StartDate, EndDate);

    // console.log(StartDate, EndDate, "data dates");
    getData =
      "EXECUTE jockey_running_frequency_in_a_day @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/FE_not_run_for_two_times_in_a_week/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDateData")
    getData =
      "EXECUTE FE_not_run_for_two_times_in_a_week @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";

    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet",recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get("/Hydrant_system_automation/:StartDate/:EndDate", (req, res) => {
  const { StartDate, EndDate } = req.params;
  // console.log(StartDate, EndDate ,"LTEST DATA");

  // console.log(StartDate, EndDate, "data dates");
  getData =
    "EXECUTE Hydrant_system_automation @StartDate='" +
    StartDate +
    "' ,  @EndDate = '" +
    EndDate +
    "'";
  request.query(getData, function (err, recordSet) {
    if (err) {
      // console.log(err,"recordSet");
      res.send(err);
    } else {
      // console.log("recordSet", recordSet);
      res.send(recordSet);
    }
  });
});



app.get(
  "/SYSTEM_2/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE SYSTEM_2 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err");
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

app.get(
  "/SYSTEM_3/:StartDate/:EndDate",
  (req, res) => {
    const { StartDate, EndDate } = req.params;

    // console.log(StartDate, EndDate, "StartDate")
    getData =
      "EXECUTE SYSTEM_3 @StartDate='" +
      StartDate +
      "' ,  @EndDate = '" +
      EndDate +
      "'";
    request.query(getData, function (err, recordSet) {
      if (err) {
        // console.log("err",err);
        res.send(err);
      } else {
        // console.log("recordSet", recordSet);
        res.send(recordSet);
      }
    });
  }
);

//Visibility

app.get("/Utilization_TLF", (req, res) => {
  const {} = req.params;
  // console.log(StartDate, EndDate,'TotalCountOfIndents');

  TotalCountOfIndents = " EXECUTE Utilization_TLF";

  request.query(TotalCountOfIndents, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      //  console.log(recordSet);
    }
  });
});

//DG,FE,Foam Pump

app.get("/Utilization_DG_FE_Pump", (req, res) => {
  const {} = req.params;
  // console.log(StartDate, EndDate,'TotalCountOfIndents');

  TotalCountOfIndents = "EXECUTE Utilization_DG_FE_Pump";

  request.query(TotalCountOfIndents, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      // console.log(recordSet);
    }
  });
});

app.get("/Utilization_BG", (req, res) => {
  const {} = req.params;
  // console.log(StartDate, EndDate,'TotalCountOfIndents');

  TotalCountOfIndents = " EXECUTE Utilization_BG";

  request.query(TotalCountOfIndents, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      //  console.log(recordSet);
    }
  });
});

app.get("/Utilization_Pump", (req, res) => {
  const {} = req.params;
  // console.log(StartDate, EndDate,'TotalCountOfIndents');

  TotalCountOfIndents = " EXECUTE Utilization_Pump";

  request.query(TotalCountOfIndents, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      //  console.log(recordSet);
    }
  });
});

app.get("/Utilization_OtherPump", (req, res) => {
  const {} = req.params;
  // console.log(StartDate, EndDate,'TotalCountOfIndents');

  TotalCountOfIndents = " EXECUTE Utilization_OtherPump";

  request.query(TotalCountOfIndents, function (err, recordSet) {
    if (err) {
      res.send(err);
    } else {
      res.send(recordSet);
      //  console.log(recordSet);
    }
  });
});