import * as React from "react";

import { Typography, Box, Grid } from "@mui/material";
import { useLocation } from "react-router-dom";
import AuthContext from "../../auth";
import { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/styles";

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

  function menuBar() {
    console.log("location:", location);
    let valid = false;

    let menuBar = null;
    let homeIcon = "disabled";
    if (
      location.pathname === "/community/" ||
      location.pathname === "/community"
    ) {
      console.log("valid");
      valid = true;
    } else if (location.pathname === "/" && auth.loggedIn) {
      console.log("valid");
      valid = true;
    }

    if (auth.loggedIn) {
      homeIcon = "enabled";
    }
    if (valid) {
      menuBar = (
        <ThemeProvider theme={theme}>
          <Box sx={{ flexGrow: 1 }}>
            <Grid container direction="row" alignItems="center" spacing={2}>
              <Grid item></Grid>
              <Grid item>
                <HomeIcon color={homeIcon} style={{ fontSize: "30pt" }} />
              </Grid>
              <Grid item>
                <GroupsIcon color="enabled" style={{ fontSize: "30pt" }} />
              </Grid>
              <Grid item>
                <PersonIcon color="enabled" style={{ fontSize: "30pt" }} />
              </Grid>
              <Grid item>
                <FunctionsIcon color="enabled" style={{ fontSize: "30pt" }} />
              </Grid>
              <Grid item xs>
                <TextField
                  size="small"
                  color="primary"
                  style={{ width: "60%" }}
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
      );
    }

    return menuBar;
  }
  return menuBar();
}
// xs, sm, md, lg, and xl.
