import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const TankOverview = () => {
  const { state } = useLocation();
  // const hostName = window.location.hostname;
  return (
    <>
      <h3>{state.PageTitle}</h3>
      <div style={{ justifyContent: "center", border: "solid", color: "gray",height:'100%' }}>
     
        <iframe
         src={`http://${window.location.hostname}/eServer/PageLoader.asp?page=TANK_FARM.htm`}
          width={'100%'}
          height={'100%'}
          title="Tank Overview"
        />  
      </div>
    </>
  );
};

export const PumpOverview = () => {
  const { state } = useLocation();
  // const hostName = window.location.hostname;
  return (
    <>
      <h3>{state.PageTitle}</h3>
      <div style={{ justifyContent: "center", border: "solid", color: "gray",height:'100%' }}>
     
        <iframe
          // src={'http://' + hostName + ':3005/eServer/PageLoader.asp?page=PUMP_OVERVIEW.htm'}
          src={`http://${window.location.hostname}/eServer/PageLoader.asp?page=PUMP_OVERVIEW.htm`}
          width={'100%'}
          height={'100%'}
          title="Pump Overview"
        />
      </div>
    </>
  );
};

export const Fire_engine_pump = () => {
  const { state } = useLocation();
  // const hostName = window.location.hostname;
  return (
    <>
      <h3>{state.PageTitle}</h3>
      <div style={{ justifyContent: "center", border: "solid", color: "gray",height:'100%' }}>
      
        <iframe
          // src={'http://' + hostName + ':3005/eServer/PageLoader.asp?page=FIRE_ENGINE_PUMP.htm'}
          src={`http://${window.location.hostname}/eServer/PageLoader.asp?page=FIRE_ENGINE_PUMP.htm`}
          width={'100%'}
          height={'100%'}
          title="Fire Engine Pump"
        />
      </div>
    </>
  );
};

export const Critical_alarm = () => {
  const { state } = useLocation();
  // const hostName = window.location.hostname;
  return (
    <>
      <h3>{state.PageTitle}</h3>
      <div style={{ justifyContent: "center", border: "solid", color: "gray" ,height:'100%'}}>
   
        <iframe
          // src={'http://' + hostName + ':3005/eServer/PageLoader.asp?page=CRITICAL_ALARM.htm'}
          src={`http://${window.location.hostname}/eServer/PageLoader.asp?page=CRITICAL_ALARM.htm`}
          width={'100%'}
          height={'100%'}
          title="Critical Alarm"
        />
      </div>
    </>
  );
};