import { Outlet } from "react-router-dom";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import React, { useState } from 'react';
import MenuIcon from "@material-ui/icons/Menu";
import Header from "./navbar/Header";
import Sidebar from "./sidebar/Sidebar";
export default function Sharedlayout() {
    const [isOpened, setIsOpened] = useState(false);

    return (
        <>  <div className="header">
            <div className="icon" style={{ color: "#3E3E3E" }} onClick={() => setIsOpened(!isOpened)}>
                {isOpened ? <ChevronLeftIcon /> : <MenuIcon />}

            </div>
            <div>
                <img
                    className="img1"
                    height={'100px'}
                    src={require(`C:/Users/MNGR/Desktop/Projects/motihari-iocl/src/components/assets/HoneywellLogo.png`)}
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
                <main className="main">
                </main>
            </div>

            <Outlet />

            <div className="footer">Copyright © 2023 Honeywell International Inc.</div>


        </>
    )
}