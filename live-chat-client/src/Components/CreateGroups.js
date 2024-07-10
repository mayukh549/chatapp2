import React, { useState, useEffect } from "react";
import DoneOutlineRoundedIcon from "@mui/icons-material/DoneOutlineRounded";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CreateGroups() {
  const lightTheme = useSelector((state) => state.themeKey);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const nav = useNavigate();

  if (!userData) {
    console.log("User not Authenticated");
    nav("/");
  }

  const user = userData.data;
  const [groupName, setGroupName] = useState("");
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .get("http://localhost:8080/users", config)
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleUserSelect = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const createGroup = () => {
    const config = {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    };

    axios
      .post(
        "http://localhost:8080/chat/createGroup",
        {
          name: groupName,
          users: JSON.stringify(selectedUsers),
        },
        config
      )
      .then(() => {
        nav("/app/groups");
      })
      .catch((error) => {
        console.error("Error creating group:", error);
      });
  };

  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {"Do you want to create a Group Named " + groupName}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will create a group in which you will be the admin and others
              will be able to join this group.
            </DialogContentText>
            {users.map((user) => (
              <FormControlLabel
                key={user._id}
                control={
                  <Checkbox
                    checked={selectedUsers.includes(user._id)}
                    onChange={() => handleUserSelect(user._id)}
                  />
                }
                label={user.name}
              />
            ))}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Disagree</Button>
            <Button
              onClick={() => {
                createGroup();
                handleClose();
              }}
              autoFocus
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      <div className={"createGroups-container" + (lightTheme ? "" : " dark")}>
        <input
          placeholder="Enter Group Name"
          className={"search-box" + (lightTheme ? "" : " dark")}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <IconButton
          className={"icon" + (lightTheme ? "" : " dark")}
          onClick={handleClickOpen}
        >
          <DoneOutlineRoundedIcon />
        </IconButton>
      </div>
    </>
  );
}

export default CreateGroups;
