import AuthContext from "../auth";
import { Typography, Button, Box, Grid } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useContext } from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#000",
    },
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

export default function WelcomeScreen() {
  const { auth } = useContext(AuthContext);
  return (
    <ThemeProvider theme={theme}>
      <div id="top5-welcome-body">
        <div className="title">
          <Typography color={"primary"} variant={"h3"} align={"center"}>
            Welcome to the
          </Typography>
          <Typography color={"primary"} variant={"h3"} align={"center"}>
            Top 5 Lister
          </Typography>
        </div>
        <div className="description">
          <Typography variant={"subtitle1"} align={"center"}>
            Top 5 Lister helps you create list of your top 5 favorites things
          </Typography>
        </div>
        <div className="buttons">
          <Grid
            container
            direction="row"
            spacing={2}
            justifyContent="space-evenly"
          >
            <Grid item>
              <Typography align={"center"}>Description</Typography>
              <Link to="/login" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Login</Button>
              </Link>
            </Grid>
            <Grid item>
              <Typography align={"center"}>Get started</Typography>
              <Link to="/register" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Create Account</Button>
              </Link>
            </Grid>
            <Grid item>
              <Typography align={"center"}>Description</Typography>
              <Link to="/community" style={{ textDecoration: "none" }}>
                <Button variant="outlined">Continue as Guest</Button>
              </Link>
            </Grid>
          </Grid>
        </div>
        <div className="footer">
          <Typography align={"center"}>
            Top 5 Lister developer by "student name" for CSE 316
          </Typography>
        </div>
      </div>
    </ThemeProvider>
  );
}
