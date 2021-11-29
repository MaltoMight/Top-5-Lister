import { useContext } from "react";
import { Button, Typography } from "@mui/material";
import { AuthContext } from "../auth";
import { useLocation } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GlobalStoreContext } from "../store";

export default function StatusBar() {
  const { store } = useContext(GlobalStoreContext);

  const { auth } = useContext(AuthContext);
  let isVisible = false;
  let statusBar = null;
  const location = useLocation();

  function handleCreateNewList() {
    console.log("added clicked");

    store.createNewList();
    // console.log("auth clicked:", auth);
  }

  //Check if is visible
  if (
    location.pathname === "/community/" ||
    location.pathname === "/community"
  ) {
    isVisible = true;
  } else if (location.pathname === "/" && auth.loggedIn) {
    isVisible = true;
  }
  function statusBarManager() {
    if (isVisible) {
      return (
        <div id="top5-statusbar">
          <Button onClick={handleCreateNewList}>
            <AddIcon
              style={{ fontSize: "50px" }}
              sx={{ color: "black" }}
            ></AddIcon>
          </Button>
          <Typography variant="h4">Your Lists</Typography>
        </div>
      );
    } else {
      return null;
    }
  }
  return statusBarManager();
}
