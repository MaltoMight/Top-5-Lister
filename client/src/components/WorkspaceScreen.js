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

  // Assuming is allowed first
  const [modalStatus, setModalStatus] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  let editItems = "";
  if (store.currentList) {
    editItems = (
      <List id="edit-items" sx={{ width: "100%", bgcolor: "background.paper" }}>
        {store.currentList.items.map((item, index) => (
          <Top5Item
            key={"top5-item-" + (index + 1)}
            text={item}
            index={index}
          />
        ))}
      </List>
    );
  }
  const location = useLocation();
  const handleClose = () => {
    setModalStatus(false);
    history.push("/");
  };

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

  function modalController() {
    if (modalStatus) {
      return (
        <div id="top5-workspace">
          <div id="workspace-edit">
            <div id="edit-numbering">
              <div className="item-number">
                <Typography variant="h3">1.</Typography>
              </div>
              <div className="item-number">
                <Typography variant="h3">2.</Typography>
              </div>
              <div className="item-number">
                <Typography variant="h3">3.</Typography>
              </div>
              <div className="item-number">
                <Typography variant="h3">4.</Typography>
              </div>
              <div className="item-number">
                <Typography variant="h3">5.</Typography>
              </div>
            </div>
            {editItems}
          </div>
        </div>
      );
    } else {
      return (
        <Modal open={true}>
          <Box sx={style}>
            <Stack sx={{ width: "100%" }} spacing={2}>
              <Alert severity="error">
                {errorMessage}{" "}
                <Button onClick={handleClose} variant="text">
                  OK
                </Button>
              </Alert>
            </Stack>
          </Box>
        </Modal>
      );
    }
  }
  return modalController();
}

export default WorkspaceScreen;
