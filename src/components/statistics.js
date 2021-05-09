import React from "react";
import usersSvg from "../assets/users-solid.svg";
import notifSvg from "../assets/paper-plane-regular.svg";

export const Statistics = () => {
  return (
    <div className="stat-box">
      <div className="stat-1">
        <img height={60} src={usersSvg} alt="users-registered" />

        <h5>63 Users Registered</h5>
      </div>
      <div className="stat-2">
        <img height={60} src={notifSvg} alt="users-registered" />

        <h5>Notifications Sent</h5>
      </div>
      
    </div>
  );
};
