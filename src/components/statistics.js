import React, { useEffect, useState } from "react";
import usersSvg from "../assets/users-solid.svg";
import notifSvg from "../assets/paper-plane-regular.svg";
import axios from 'axios';
export const Statistics = () => {
  const [stat, setStat] = useState();
  useEffect(()=> {
    axios.get("https://covid-vaccination-tracker.azurewebsites.net/Register/statistics").then(res => {
      if(res.status===200){
        setStat(res.data);
        
      }
    });
  },[])
  return (
    <div className="stat-box">
      <div className="stat-1">
        <img height={60} src={usersSvg} alt="users-registered" />

        {stat && <h5>{`${stat.totalRegistrations} Users Registered`}</h5>}
      </div>
      <div className="stat-2">
        <img height={60} src={notifSvg} alt="users-registered" />

        {stat && <h5>{`${stat.totalNotifications} Notifications Sent`}</h5>}
      </div>
      
    </div>
  );
};
