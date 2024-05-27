import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useState } from "react";
import MainDashboard from "./pages/main/MainDashboard";
import "./style/dark.scss";
import { useContext } from "react";
import { DarkModeContext } from "./context/darkModeContext";
import "./style/dark.scss";
// import StepChart from "./StepChart";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import MenuIcon from "@material-ui/icons/Menu";
import Header from "./components/navbar/Header";
import Sidebar from "./components/sidebar/Sidebar";
import Home from "./components/home/Home";
import Tlf_1 from "./components/Tlf_grid/Tlf_1";
import Tlf_2 from "./components/Tlf_grid/Tlf_2";
import Tlf_4 from "./components/Tlf_grid/Tlf_4";
import Tlf_5 from "./components/Tlf_grid/Tlf_5";
import Tlf_6 from "./components/Tlf_grid/Tlf_6";
import Tlf_7 from "./components/Tlf_grid/Tlf_7";
import Tlf_8 from "./components/Tlf_grid/Tlf_8";
import Tlf_9 from "./components/Tlf_grid/Tlf_9";
import Tlf_10 from "./components/Tlf_grid/Tlf_10";
import Tlf_11 from "./components/Tlf_grid/Tlf_11";
import Tlf_12 from "./components/Tlf_grid/Tlf_12";
import Login from "./components/login/Login";
import Signup from "./components/login/Signup";
import ConfirmPassword from "./components/login/ConfirmPassword";
import Edit from "./components/login/Edit";
import Tlf_16 from "./components/Tlf_grid/Tlf_16";

import Tlf_18 from "./components/Tlf_grid/Tlf_18";
import Tlf_19 from "./components/Tlf_grid/Tlf_19";
import Tlf_15 from "./components/Tlf_grid/Tlf_15";
// import AOPS_not_tested from "./components/fire_engine/AOPS_not_tested";
import WebServerTable from "./components/home/WebServerTable";

// 14-12-23
import FE01 from "./components/fire_engine/FE01";
import FE02 from "./components/fire_engine/FE02";
import FE03 from "./components/fire_engine/FE03";
import FE05 from "./components/fire_engine/FE05";
import FE04 from "./components/fire_engine/FE04";
import FE_freq_engine_wise_for_min_30m_in_a_week from "./components/fire_engine/FE_freq_engine_wise_for_min_30m_in_a_week";
import Jockey_running_frequency_in_a_day from "./components/fire_engine/Jockey_running_frequency_in_a_day";
import System1 from "./components/system/System1";
import System2 from "./components/system/System2";
import System3 from "./components/system/System3";
import System4 from "./components/system/System4";
import Tfms1 from "./components/tfms/Tfms1";
import Tfms2 from "./components/tfms/Tfms2";
import Tfms3_loading from "./components/tfms/Tfms3_loading";
import Tfms3_receipt from "./components/tfms/Tfms3_receipt";
import Tfms5 from "./components/tfms/Tfms5";
import Tfms6 from "./components/tfms/Tfms6";
import Tfms7 from "./components/tfms/Tfms7";
import Tfms8 from "./components/tfms/Tfms8";
import TFMS9 from "./components/tfms/TFMS9";
import Tfms10 from "./components/tfms/Tfms10";
import Tfms11 from "./components/tfms/Tfms11";
import Tfms12 from "./components/tfms/Tfms12";
import Tfms13 from "./components/tfms/Tfms13";
import Tfms14 from "./components/tfms/Tfms14";
// import Tfms15 from "./components/tfms/Tfms15";
import Tfms4 from "./components/tfms/Tfms4";
import { Critical_alarm, Fire_engine_pump, PumpOverview, TankOverview } from "./components/overview/TankOverview";
import Tlf_20 from "./components/Tlf_grid/Tlf_20";
import TFMS15_TanksSprinkler from "./components/tfms/TFMS15_TanksSprinkler";
import TFMS15_FoamFacility from "./components/tfms/TFMS15_FoamFacility";
import Utilization_FE_DG_JP from "./components/Visibility/Utilization_FE_DG_JP";
import Utilization_TLF from "./components/Visibility/Utilization_TLF";
import Utilization_BG from "./components/Visibility/Utilization_BG";
import Utilization_Pump from "./components/Visibility/Utilization_Pump";
import Utilization_OtherPump from "./components/Visibility/Utilization_OtherPump";

function App() {
  const { darkMode } = useContext(DarkModeContext);
  const [isOpened, setIsOpened] = useState(false);

  const location = useLocation();
console.log("IP", window.location.hostname);
  const isLoginPage =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname === "/confirm-password" ||
    location.pathname === "/edit-password";
  return (
    <div className={darkMode ? "app dark" : "app"}>
      {/* <BrowserRouter> */}
      {/* {isLoginPage ? null : ( */}
      <div className="App">
        {!isLoginPage && (
          <div className="header">
            <div
              className="icon"
              style={{
                color: "#1B2631",
              }}
              onClick={() => setIsOpened(!isOpened)}
            >
              {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}
            </div>
            <div>
              <img
                className="img1"
                height={"150rem"}
                style={{ paddingTop: "10px" }}
                src={require(`./components/assets/HoneywellLogo.png`)}
              />
            </div>
            <hr></hr>
            <div className="header-title">
              <div
                className="flex-end"
                style={{ position: "absolute", top: "0px", right: "0px" }}
              >
                <Header />
              </div>
            </div>
          </div>
        )}
        <div className="container">
          {!isLoginPage && (
            <aside className={`${isOpened ? "opened" : ""} drawer`}>
              <Sidebar />
            </aside>
          )}
          <main className="main">
            <Routes>
              <Route path="/" element={<Home />} />
              
            
             

              {/* ; */}

              <Route path="/TLF1" element={<Tlf_1 />} />
              <Route path="/Tlf2" element={<Tlf_2 />} />
              
              <Route path="/Tlf4" element={<Tlf_4 />} />
              <Route path="/Tlf5" element={<Tlf_5 />} />
              <Route path="/Tlf6" element={<Tlf_6 />} />
              <Route path="/Tlf7" element={<Tlf_7 />} />
              <Route path="/Tlf8" element={<Tlf_8 />} />
              <Route path="/Tlf9" element={<Tlf_9 />} />
              <Route path="/Tlf10" element={<Tlf_10 />} />
              <Route path="/Tlf11" element={<Tlf_11 />} />
              <Route path="/Tlf12" element={<Tlf_12 />} />
              <Route path="/Tlf15" element={<Tlf_15 />} />
              <Route path="/Tlf16" element={<Tlf_16 />} />
          
              <Route path="/Tlf18" element={<Tlf_18 />} />
              <Route path="/Tlf19" element={<Tlf_19 />} />
              <Route path="/Tlf20" element={<Tlf_20 />} />
              <Route path="/FieldData" element={<WebServerTable />} />
              
              {/* fire */}
              <Route path="/FE01" element={<FE01 />} />
              <Route path="/FE03" element={<FE03 />} />
              <Route path="/FE02" element={<FE02 />} />
              <Route path="/FE05" element={<FE05 />} />
              <Route path="/FE04" element={<FE04 />} />
              <Route path="/FE_freq_engine_wise_for_min_30m_in_a_week" element={<FE_freq_engine_wise_for_min_30m_in_a_week />} />
              <Route path="/Jockey_running_frequency_in_a_day" element={<Jockey_running_frequency_in_a_day />} />

              {/* TFMS */}
              <Route path="/Tfms1" element={<Tfms1 />} />
              <Route path="/Tfms2" element={<Tfms2 />} />
              <Route path="/Tfms3_loading" element={<Tfms3_loading />} />
              <Route path="/Tfms3_receipt" element={<Tfms3_receipt />} />
              <Route path="/Tfms4" element={<Tfms4 />} />
              <Route path="/Tfms5" element={<Tfms5 />} />
              <Route path="/Tfms6" element={<Tfms6 />} />
              <Route path="/Tfms7" element={<Tfms7 />} />
              <Route path="/Tfms8" element={<Tfms8 />} />
              <Route path="/TFMS9" element={<TFMS9 />} />
              <Route path="/TFMS10" element={<Tfms10 />} />
              <Route path="/Tfms11" element={<Tfms11 />} />
              <Route path="/Tfms12" element={<Tfms12 />} />
              <Route path="/Tfms13" element={<Tfms13 />} />
              <Route path="/Tfms14" element={<Tfms14 />} />
              {/* <Route path="/Tfms15" element={<Tfms15 />} /> */}

              <Route
                path="/TFMS15_TanksSprinkler"
                element={<TFMS15_TanksSprinkler />}
              />
              <Route
                path="/TFMS15_FoamFacility"
                element={<TFMS15_FoamFacility />}
              />              {/* System */}
              <Route path="/System1" element={<System1 />} />
              <Route path="/System2" element={<System2 />} />
              <Route path="/System3" element={<System3 />} />
              <Route path="/System4" element={<System4 />} />

              {/* visibility */}
              <Route path="/Utilization_TLF" element={<Utilization_TLF/>} />
              <Route path="/Utilization_FE_DG_JP" element={<Utilization_FE_DG_JP/>} />
              <Route path="/Utilization_BG" element={<Utilization_BG/>} />
              <Route path="/Utilization_Pump" element={<Utilization_Pump/>} />
              <Route path="/Utilization_OtherPump" element={<Utilization_OtherPump/>} />

               {/* overview wala part */}
               <Route path="/TANK_FARM" element={<TankOverview/>} />
              <Route path="/PUMP_OVERVIEW" element={<PumpOverview/>} />
                 <Route path="/FIRE_ENGINE_PUMP" element={<Fire_engine_pump/>} />
              <Route path="/CRITICAL_ALARM" element={<Critical_alarm/>} />

              {/*  page  */}
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/confirm-password" element={<ConfirmPassword />} />
              <Route path="/edit-password" element={<Edit />} />
            </Routes>
          </main>
        </div>
        {!isLoginPage && (
          <div className="footer">
            Copyright © 2024 Honeywell International Inc.
          </div>
        )}
      </div>
      {/* // )} */}
      {/* </BrowserRouter> */}
    </div>
  );
}

export default App;
