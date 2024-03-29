import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../auth";
import Copyright from "./Copyright";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Grid from "@mui/material/Grid";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { GlobalStoreContext } from "../store";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";
import Modal from "@mui/material/Modal";

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

export default function RegisterScreen() {
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
    const formData = new FormData(event.currentTarget);
    // console.log(formData);
    auth
      .registerUser(
        {
          firstName: formData.get("firstName"),
          lastName: formData.get("lastName"),
          email: formData.get("email"),
          password: formData.get("password"),
          passwordVerify: formData.get("passwordVerify"),
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
  function showRegister() {
    if (auth.loggedIn) {
      return "";
    } else {
      if (!modalStatus) {
        return (
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
                Sign up
              </Typography>
              <Box
                component="form"
                noValidate
                onSubmit={handleSubmit}
                sx={{ mt: 3 }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      autoComplete="fname"
                      name="firstName"
                      required
                      fullWidth
                      id="firstName"
                      label="First Name"
                      autoFocus
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required
                      fullWidth
                      id="lastName"
                      label="Last Name"
                      name="lastName"
                      autoComplete="lname"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      id="email"
                      label="Email Address"
                      name="email"
                      autoComplete="email"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="password"
                      label="Password"
                      type="password"
                      id="password"
                      autoComplete="new-password"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      fullWidth
                      name="passwordVerify"
                      label="Password Verify"
                      type="password"
                      id="passwordVerify"
                      autoComplete="new-password"
                    />
                  </Grid>
                </Grid>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign Up
                </Button>
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <Link href="/login/" variant="body2">
                      Already have an account? Sign in
                    </Link>
                  </Grid>
                </Grid>
              </Box>
            </Box>
            <Copyright sx={{ mt: 5 }} />
          </Container>
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
  }
  return showRegister();
}
