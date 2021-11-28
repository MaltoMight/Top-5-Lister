import { useContext, useState, useEffect } from "react";
import AuthContext from "../auth";

import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { GlobalStoreContext } from "../store";
import Container from "@mui/material/Container";

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
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

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
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Box
              sx={{
                marginTop: 8,
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
                onSubmit={handleSubmit}
                noValidate
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

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </Container>
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
