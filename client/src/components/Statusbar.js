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
  const location = useLocation();

  function handleCreateNewList() {
    console.log("added clicked");

    store.createNewList();
    // console.log("auth clicked:", auth);
  }

  function statusBarManager() {
    if (auth.loggedIn) {
      location.pathname = location.pathname.replace("/", "");
      if (location.pathname === "") {
        return (
          <>
            <Button onClick={handleCreateNewList}>
              <AddIcon style={{ fontSize: "50px" }} sx={{ color: "black" }} />
            </Button>

            <Typography variant="h4">Your Lists</Typography>
          </>
        );
      } else if (location.pathname.includes("top5list")) {
        return (
          <>
            <Button disabled>
              <AddIcon style={{ fontSize: "50px" }} />
            </Button>
            <Typography color="textDisabled" variant="h4">
              Your Lists
            </Typography>
          </>
        );
      } else if (location.pathname === "all") {
        return (
          <>
            <Typography variant="h4">ALL (from input field) Lists</Typography>
          </>
        );
      } else if (location.pathname === "user") {
        return (
          <>
            <Typography variant="h4">User's Lists</Typography>
          </>
        );
      } else if (location.pathname === "community") {
        return (
          <>
            <Typography variant="h4">Community Lists</Typography>
          </>
        );
      }
    }
  }
  return <div id="top5-statusbar">{statusBarManager()} </div>;
}
