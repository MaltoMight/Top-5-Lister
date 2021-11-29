import { useContext } from "react";
import { Typography } from "@mui/material";
import { AuthContext } from "../auth";
import { useLocation } from "react-router-dom";

export default function StatusBar() {
  const { auth } = useContext(AuthContext);
  let isVisible = false;
  let statusBar = null;
  const location = useLocation();

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
          <Typography variant="h4">Community Lists</Typography>
        </div>
      );
    } else {
      return null;
    }
  }
  return statusBarManager();
}
