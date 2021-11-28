import { useContext, useState, useEffect } from "react";
import Copyright from "./Copyright";
import AuthContext from "../auth";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GlobalStoreContext } from "../store";

import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";

const theme = createTheme();

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

export default function LoginScreen() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);

  const [modalStatus, setModalStatus] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleClose = () => setModalStatus(false);
  useEffect(() => {
    auth.checkLoggedIn();
  });
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    // console.log("data", data);
    // console.log({
    //   email: data.get("email"),
    //   password: data.get("password"),
    // });

    auth
      .loginUser(
        {
          email: data.get("email"),
          password: data.get("password"),
        },
        store
      )
      .then((response) => {
        if (response.status > 200) {
          setModalStatus(true);
          setErrorMessage(response.data.errorMessage);
        }
      })
      .catch((err) => console.log("err:", err));
  };

  function modalManager() {
    if (auth.loggedIn) {
      return "";
    }
    if (!modalStatus) {
      return (
        <ThemeProvider theme={theme}>
          <Grid container component="main" sx={{ height: "80vh" }}>
            <CssBaseline />
            <Grid
              item
              xs={false}
              sm={4}
              md={7}
              sx={{
                backgroundImage: "url(https://source.unsplash.com/random)",
                backgroundRepeat: "no-repeat",
                backgroundColor: (t) =>
                  t.palette.mode === "light"
                    ? t.palette.grey[50]
                    : t.palette.grey[900],
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <Grid
              item
              xs={12}
              sm={8}
              md={5}
              component={Paper}
              elevation={6}
              square
            >
              <Box
                sx={{
                  my: 8,
                  mx: 4,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
                </Typography>
                <Box
                  component="form"
                  noValidate
                  onSubmit={handleSubmit}
                  sx={{ mt: 1 }}
                >
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus
                  />
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                  />
                  <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                  >
                    Sign In
                  </Button>
                  <Grid container>
                    {/* <Grid item xs>
                      <Link href="#" variant="body2">
                        Forgot password?
                      </Link>
                    </Grid> */}
                    <Grid item>
                      <Link href="/register" variant="body2">
                        {"Don't have an account? Sign Up"}
                      </Link>
                    </Grid>
                  </Grid>
                  <Copyright sx={{ mt: 5 }} />
                </Box>
              </Box>
            </Grid>
          </Grid>
        </ThemeProvider>
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
  return modalManager();
}
