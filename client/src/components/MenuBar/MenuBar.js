import * as React from "react";

import { Typography, Box, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import AuthContext from "../../auth";
import { useContext } from "react";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import FunctionsIcon from "@mui/icons-material/FunctionsOutlined";
import SortIcon from "@mui/icons-material/SortOutlined";
import TextField from "@mui/material/TextField";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00000",
    },
  },
  input: {
    color: "white",
  },
  typography: {
    fontFamily: ["Gill Sans", "sans-serif"].join(","),
    h3: {
      fontWeight: "100",
    },
    subtitle1: {
      fontWeight: "150",
      fontSize: "1.6rem",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  input: {
    background: "rgb(232, 241, 250)",
  },
}));
export default function MenuBar() {
  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const classes = useStyles();

  let homeIconText = "disabled";
  if (auth.loggedIn) {
    homeIconText = "enabled";
  }
  function iconClassName(number) {
    let check = location.pathname.replace("/", "");

    if ((check === "" || check.includes("top5list")) && number === 1) {
      return "selectedIcon";
    } else if (check === "all" && number === 2) {
      return "selectedIcon";
    } else if (check === "user" && number === 3) {
      return "selectedIcon";
    } else if (check === "community" && number === 4) {
      return "selectedIcon";
    } else {
      return "non-selectedIcon";
    }
  }

  function menuBar() {
    console.log("location:", location);
    let valid = false;

    let menuBar = null;
    let homeIconText = "disabled";
    let homeIcon;
    if (
      location.pathname === "/community/" ||
      location.pathname === "/community" ||
      location.pathname === "/all" ||
      location.pathname === "/all/" ||
      location.pathname === "/user" ||
      location.pathname === "/user/"
    ) {
      console.log("valid");
      valid = true;
    } else if (location.pathname === "/" && auth.loggedIn) {
      console.log("valid");
      valid = true;
    } else if (auth.loggedIn) {
      valid = true;
    }
    if (auth.loggedIn) {
      homeIconText = "enabled";
      homeIcon = (
        <Link to="/">
          <HomeIcon
            className={iconClassName(1)}
            color={homeIconText}
            style={{ fontSize: "30pt" }}
          />
        </Link>
      );
    } else {
      homeIcon = <HomeIcon color={homeIconText} style={{ fontSize: "30pt" }} />;
    }

    if (valid) {
      menuBar = (
        <div className="top5-menuBar">
          <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item></Grid>
                <Grid item>{homeIcon}</Grid>
                <Grid item>
                  <Link to="/all">
                    <GroupsIcon
                      className={iconClassName(2)}
                      color="enabled"
                      style={{ fontSize: "30pt" }}
                    />
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/user">
                    <PersonIcon
                      className={iconClassName(3)}
                      color="enabled"
                      style={{ fontSize: "30pt" }}
                    />
                  </Link>
                </Grid>
                <Grid item>
                  <Link to="/community">
                    <FunctionsIcon
                      className={iconClassName(4)}
                      color="enabled"
                      style={{ fontSize: "30pt" }}
                    />
                  </Link>
                </Grid>
                <Grid item xs>
                  <TextField
                    size="small"
                    color="primary"
                    style={{ width: "60%" }}
                    label="Search"
                    InputProps={{ className: classes.input }}
                  />
                </Grid>
                <Grid item>
                  <Typography>SORT BY</Typography>
                </Grid>
                <Grid item>
                  <SortIcon color="disabled" style={{ fontSize: "30pt" }} />
                </Grid>
              </Grid>
            </Box>
          </ThemeProvider>
        </div>
      );
    }

    return menuBar;
  }
  return menuBar();
}
