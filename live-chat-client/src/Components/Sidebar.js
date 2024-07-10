import React, { useContext, useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import {
  AccountCircle as AccountCircleIcon,
  PersonAdd as PersonAddIcon,
  GroupAdd as GroupAddIcon,
  Nightlight as NightlightIcon,
  LightMode as LightModeIcon,
  ExitToApp as ExitToAppIcon,
  AddCircle as AddCircleIcon,
  Search as SearchIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../Features/themeSlice";
import axios from "axios";
import { refreshSidebarFun } from "../Features/refreshSidebar";
import { myContext } from "./MainContainer";

function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const lightTheme = useSelector((state) => state.themeKey);
  const { sharedData, refresh, setRefresh } = useContext(myContext);
  const [conversations, setConversations] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));

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

    axios.get("http://localhost:8080/chat/", config).then((response) => {
      setConversations(response.data);
    });
  }, [refresh]);

  return (
    <div className="sidebar-container">
      <div className={"sb-header" + (lightTheme ? "" : " dark")}>
        <div className="other-icons">
          <IconButton onClick={() => navigate("/app/welcome")}>
            <AccountCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => navigate("users")}>
            <PersonAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => navigate("groups")}>
            <GroupAddIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => navigate("create-groups")}>
            <AddCircleIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
          <IconButton onClick={() => dispatch(toggleTheme())}>
            {lightTheme ? (
              <NightlightIcon className={"icon" + (lightTheme ? "" : " dark")} />
            ) : (
              <LightModeIcon className={"icon" + (lightTheme ? "" : " dark")} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              localStorage.removeItem("userData");
              navigate("/");
            }}
          >
            <ExitToAppIcon className={"icon" + (lightTheme ? "" : " dark")} />
          </IconButton>
        </div>
      </div>
      <div className={"sb-search" + (lightTheme ? "" : " dark")}>
        <IconButton className={"icon" + (lightTheme ? "" : " dark")}>
          <SearchIcon />
        </IconButton>
        <input placeholder="Search" className={"search-box" + (lightTheme ? "" : " dark")} />
      </div>
      <div className={"sb-conversations" + (lightTheme ? "" : " dark")}>
        {/* //{sharedData && <div>Data from Outlet: {sharedData}</div>} */}
        {conversations.map((conversation, index) => {
          const otherUser = conversation.users.find(u => u._id !== user._id);
          if (!otherUser) return null; // Skip if there's no other user

          return (
            <div
              key={index}
              className="conversation-container"
              onClick={() => {
                setRefresh(!refresh);
                navigate("chat/" + conversation._id + "&" + otherUser.name);
              }}
            >
              <p className={"con-icon" + (lightTheme ? "" : " dark")}>{otherUser.name[0]}</p>
              <p className={"con-title" + (lightTheme ? "" : " dark")}>{otherUser.name}</p>
              <p className="con-lastMessage">
                {conversation.latestMessage ? conversation.latestMessage.content : "No previous Messages, click here to start a new chat"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
