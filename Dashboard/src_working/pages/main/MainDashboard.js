import './maindashboard.scss';
import React, { useState } from 'react';
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import Header from '../../components/navbar/Header';
import Home from '../../components/home/Home';
import Sidebar from '../../components/sidebar/Sidebar';
import AnalyticAxios from "../../Axios/Axios";
function MainDashboard() {
  const [isOpened, setIsOpened] = useState(false);
  // <aside className={`${isOpened ? "opened" : ""} drawer`}>Drawer</aside>

  return (
    <div className="App">
      <div className="header">
        <div className="icon" onClick={() => setIsOpened(!isOpened)}>
          {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}

        </div>
        <div>
          <img
            className="img1"
            // height={'11rem'}
            style={{ height: "11rem" }}
            src={require(`../../components/assets/HoneywellLogo.png`)}
          />
        </div>
        <div className="header-title" >
          <div className="flex-end" style={{ position: 'absolute', top: '0px', right: '0px' }}>
            <Header />
          </div>
        </div>
      </div>
      <div className="container">
        <aside className={`${isOpened ? "opened" : ""} drawer`}><Sidebar /></aside>
        {/* <aside className="drawer">Drawer</aside> */}
        <main className="main"><Home /></main>
      </div>
      <div className="footer">Footer</div>
    </div>
  );
}


export default MainDashboard;
