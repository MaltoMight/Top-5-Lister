import { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Top5Item from "./Top5Item.js";
import List from "@mui/material/List";
import { Typography } from "@mui/material";
import { GlobalStoreContext } from "../store/index.js";
import AuthContext from "../auth";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useHistory } from "react-router-dom";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
/*
    This React component lets us edit a loaded list, which only
    happens when we are on the proper route.
    
    @author McKilla Gorilla
*/
function WorkspaceScreen() {
  const { store } = useContext(GlobalStoreContext);
  const { auth } = useContext(AuthContext);
  const history = useHistory();
  const currentList = store.currentList;
  const location = useLocation();

  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  // console.log(auth);
  function checkPermission(id) {
    auth.tokenStatus().then((email) => {
      if (!email) {
        setModalStatus(false);
        setErrorMessage("Unauthorized access");
      } else {
        store.restoreList(id, email).then((response) => {
          setModalStatus(response.success);
          setErrorMessage(response.message);
        });
      }
    });

    // console.log(auth);
  }
  useEffect(() => {
    let pathName = location.pathname;
    let id = pathName.substring("/top5list/".length);
    checkPermission(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // [] makes to render only once

  function itemList(index) {
    if (!currentList) {
      return null;
    } else {
      return currentList.items[index];
    }
  }
  function modalController() {
    return (
      <div id="top5-workspace">
        <div id="workspace-edit">
          <div id="edit-numbering">
            <div className="item-number">
              <Typography variant="h3">1. {itemList(0)}</Typography>
            </div>
            <div className="item-number">
              <Typography variant="h3">2. {itemList(1)}</Typography>
            </div>
            <div className="item-number">
              <Typography variant="h3">3. {itemList(2)}</Typography>
            </div>
            <div className="item-number">
              <Typography variant="h3">4. {itemList(3)} </Typography>
            </div>
            <div className="item-number">
              <Typography variant="h3">5. {itemList(4)}</Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return modalController();
}

export default WorkspaceScreen;
