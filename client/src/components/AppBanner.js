import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../auth";
import { GlobalStoreContext } from "../store";
import EditToolbar from "./EditToolbar";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useHistory } from "react-router-dom";
// import { Button } from "@mui/material";

export default function AppBanner() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  const handleLoginButton = () => {
    history.push("/login/");
    handleMenuClose();
  };
  const handleCreateAccountButton = () => {
    history.push("/register/");
    handleMenuClose();
  };
  const handleLogout = () => {
    handleMenuClose();
    store.closeCurrentList();
    auth.logoutUser();
  };

  const menuId = "primary-search-account-menu";
  const loggedOutMenu = (
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
    >
      <MenuItem onClick={handleLoginButton}>
        <Link to="/login/">Login</Link>
      </MenuItem>
      <MenuItem onClick={handleCreateAccountButton}>
        <Link to="/register/">Create New Account</Link>
      </MenuItem>
    </Menu>
  );
  const loggedInMenu = (
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
    >
      <MenuItem onClick={handleLogout}>Logout</MenuItem>
    </Menu>
  );

  let editToolbar = "";
  let menu = loggedOutMenu;
  if (auth.loggedIn) {
    menu = loggedInMenu;
    editToolbar = <EditToolbar />;
    // if (store.currentList) {
    //   editToolbar = <EditToolbar />;
    // }
  }

  // Display the circle
  function getAccountMenu(loggedIn) {
    if (loggedIn) {
      return getUserInitials(auth.user.firstName, auth.user.lastName);
    } else {
      return <AccountCircle />;
    }
  }
  function getUserInitials(userName, lastName) {
    // if (userName)
    return (userName[0] + lastName[0]).toUpperCase();
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h4"
            noWrap
            component="div"
            sx={{ display: { xs: "none", sm: "block" } }}
          >
            <Link
              onClick={() => {
                if (auth.loggedIn) {
                  store.closeCurrentList();
                }
              }}
              style={{ textDecoration: "none", color: "white" }}
              to={"/"}
            >
              T<sup>5</sup>L
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }}>{editToolbar}</Box>
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {getAccountMenu(auth.loggedIn)}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      {menu}
    </Box>
  );
}
