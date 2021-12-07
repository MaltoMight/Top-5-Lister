import * as React from "react";

import { Typography, Box, Grid, IconButton } from "@mui/material";
import { useLocation } from "react-router-dom";
import AuthContext from "../../auth";
import { useContext, useState } from "react";
import { makeStyles } from "@material-ui/styles";
import { Link } from "react-router-dom";
import { GlobalStoreContext } from "../../store/index.js";

import { createTheme, ThemeProvider } from "@mui/material/styles";
import HomeIcon from "@mui/icons-material/HomeOutlined";
import GroupsIcon from "@mui/icons-material/GroupsOutlined";
import PersonIcon from "@mui/icons-material/PersonOutlined";
import FunctionsIcon from "@mui/icons-material/FunctionsOutlined";
import SortIcon from "@mui/icons-material/SortOutlined";
import TextField from "@mui/material/TextField";
import { useHistory } from "react-router-dom";

import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";

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
  const history = useHistory();

  const location = useLocation();
  const { auth } = useContext(AuthContext);
  const classes = useStyles();
  const { store } = useContext(GlobalStoreContext);

  //***********************************************************************************************************

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  let homeIconText = "disabled";
  if (auth.loggedIn) {
    homeIconText = "enabled";
  }

  // ***********************************************************************************************************8
  function handleSort(options) {
    if (options === 1) {
      store.sortListByNewestDate();
    } else if (options === 2) {
      store.sortListByOldestDate();
    } else if (options === 3) {
      store.sortListByViews();
    } else if (options === 4) {
      store.sortListByLike();
    } else if (options === 5) {
      store.sortListByDislike();
    }
  }

  function iconClassName(number) {
    let check = location.pathname.replace("/", "");

    if (
      (check === "" || (check.includes("top5list") && store.currentList)) &&
      number === 1
    ) {
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

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const menuId = "primary-search-account-menu";
  const menuOpened = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    ></Menu>
  );

  const handleSearchBar = function (event) {
    let path = history.location.pathname;
    if (event.key === "Enter") {
      if (path === "/user" || path === "/user/") {
        // console.log(event.target.value);
        let redirect = "/user?username=" + event.target.value;
        history.push(redirect);
        history.go();
      }
    }
  };
  function colorManager() {
    if (location.pathname.includes("top5list")) {
      return "disabled";
    } else {
      return "enabled";
    }
  }
  function menuBar() {
    console.log("location:", location);
    let valid = false;
    let clickable = false;
    let homeClickable = false;

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
      if (location.pathname.includes("top5list")) {
        clickable = true;
        homeClickable = true;
      } else {
        clickable = false;
        homeClickable = false;
      }
    }
    if (auth.loggedIn) {
      homeIconText = "enabled";
      homeIcon = (
        <IconButton disabled={homeClickable}>
          <Link to="/">
            <HomeIcon
              className={iconClassName(1)}
              color={colorManager()}
              style={{ fontSize: "30pt" }}
            />
          </Link>
        </IconButton>
      );
    } else {
      homeIcon = <HomeIcon color={homeIconText} style={{ fontSize: "30pt" }} />;
    }
    const sortOptionsMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        id={menuId}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenuOpen}
        onClose={handleMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleSort(1);
          }}
        >
          Publish Date (Newest)
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSort(2);
          }}
        >
          Publish Date (Oldest)
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSort(3);
          }}
        >
          Views
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSort(4);
          }}
        >
          Likes
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleSort(5);
          }}
        >
          Dislikes
        </MenuItem>
      </Menu>
    );
    let sortMenu = sortOptionsMenu;
    if (valid) {
      menuBar = (
        <div className="top5-menuBar">
          <ThemeProvider theme={theme}>
            <Box sx={{ flexGrow: 1 }}>
              <Grid container direction="row" alignItems="center" spacing={2}>
                <Grid item></Grid>
                <Grid item>{homeIcon}</Grid>
                <Grid item>
                  <IconButton disabled={clickable}>
                    <Link to="/all">
                      <GroupsIcon
                        className={iconClassName(2)}
                        color={colorManager()}
                        style={{ fontSize: "30pt" }}
                      />
                    </Link>
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton disabled={clickable}>
                    <Link to="/user">
                      <PersonIcon
                        className={iconClassName(3)}
                        color={colorManager()}
                        style={{ fontSize: "30pt" }}
                      />
                    </Link>
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton disabled={clickable}>
                    <Link to="/community">
                      <FunctionsIcon
                        className={iconClassName(4)}
                        color={colorManager()}
                        style={{ fontSize: "30pt" }}
                      />
                    </Link>
                  </IconButton>
                </Grid>
                <Grid item xs>
                  <TextField
                    size="small"
                    color="primary"
                    disabled={clickable}
                    style={{ width: "60%" }}
                    label="Search"
                    onKeyPress={handleSearchBar}
                    InputProps={{ className: classes.input }}
                  />
                </Grid>
                <Grid item>
                  <Typography>SORT BY</Typography>
                </Grid>
                <Grid item>
                  <IconButton disabled={clickable}>
                    <SortIcon
                      color={colorManager()}
                      style={{ fontSize: "30pt" }}
                      onClick={handleProfileMenuOpen}
                    />
                  </IconButton>
                </Grid>
              </Grid>
              {sortMenu}
            </Box>
          </ThemeProvider>
        </div>
      );
    }

    return menuBar;
  }
  return menuBar();
}
