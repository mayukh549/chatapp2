import React, { useContext, useEffect, useState } from "react";
import "./myStyles11.css";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import logo from "../Images/live-chat_512px.png";
import { useDispatch, useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import RefreshIcon from "@mui/icons-material/Refresh";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Groups() {
  const { refresh, setRefresh } = useContext(myContext);
  const lightTheme = useSelector((state) => state.themeKey);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const navigate = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    navigate("/");
  }

  const user = userData.data;

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:8080/chat/fetchGroups", config)
      .then((response) => {
        setGroups(response.data);
      });
  }, [refresh]);

  const handleGroupClick = (group) => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .post(
        "http://localhost:8080/chat/",
        {
          userId: user._id,
          groupId: group._id, // Assuming group object has _id property
        },
        config
      )
      .then(() => {
        dispatch(refreshSidebarFun());
        navigate(`/app/chat/${group._id}&${group.chatName}`);
      });
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0 }}
        transition={{
          ease: "anticipate",
          duration: "0.3",
        }}
        className="list-container"
      >
        <div className={"ug-header" + (lightTheme ? "" : " dark")}>
          <img
            src={logo}
            alt="logo"
            style={{ height: "2rem", width: "2rem", marginLeft: "10px" }}
          />
          <p className={"ug-title" + (lightTheme ? "" : " dark")}>Available Groups</p>
          <IconButton
            className={"icon" + (lightTheme ? "" : " dark")}
            onClick={() => setRefresh(!refresh)}
          >
            <RefreshIcon />
          </IconButton>
        </div>
        <div className={"sb-search" + (lightTheme ? "" : " dark")}>
          <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
            <SearchIcon />
          </IconButton>
          <input placeholder="Search" className={"search-box" + (lightTheme ? "" : " dark")} />
        </div>
        <div className="ug-list">
          {groups.map((group, index) => (
            <motion.div
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className={"list-item" + (lightTheme ? "" : " dark")}
              key={index}
              onClick={() => handleGroupClick(group)}
            >
              <p className={"con-icon" + (lightTheme ? "" : " dark")}>T</p>
              <p className={"con-title" + (lightTheme ? "" : " dark")}>{group.chatName}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export default Groups;
