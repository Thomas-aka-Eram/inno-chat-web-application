import React from "react";
import { useContext } from "react";
import { UserContext } from "../context/AuthContext";
import "./UserProfile.css";

export const UserProfile = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="profile_container">
      <div className="profile_information">
        <div className="userimage">
          <img src={`http://localhost:5000/${user?.pfUrl}`} alt="UserProfile" />
        </div>
        <h4 className="username">{user?.name}</h4>
        <h5 className="useremail">{user?.email}</h5>
      </div>
    </div>
  );
};
