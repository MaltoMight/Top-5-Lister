import React, { createContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../api";

export const AuthContext = createContext();
console.log("create AuthContext: " + AuthContext);

// THESE ARE ALL THE TYPES OF UPDATES TO OUR AUTH STATE THAT CAN BE PROCESSED
export const AuthActionType = {
  GET_LOGGED_IN: "GET_LOGGED_IN",
  REGISTER_USER: "REGISTER_USER",
  SET_LOGGED_IN: "LOGGED_IN",
  SET_LOGOUT: "SET_LOGOUT",
};

function AuthContextProvider(props) {
  const [auth, setAuth] = useState({
    user: null,
    loggedIn: false,
  });
  const history = useHistory();

  useEffect(() => {
    auth.getLoggedIn();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const authReducer = (action) => {
    const { type, payload } = action;
    switch (type) {
      case AuthActionType.GET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: payload.loggedIn,
        });
      }
      case AuthActionType.REGISTER_USER: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
        });
      }
      case AuthActionType.SET_LOGGED_IN: {
        return setAuth({
          user: payload.user,
          loggedIn: true,
        });
      }
      case AuthActionType.SET_LOGOUT: {
        return setAuth({
          loggedIn: false,
        });
      }

      default:
        return auth;
    }
  };

  auth.getLoggedIn = async function () {
    try {
      const response = await api.getLoggedIn();
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.SET_LOGGED_IN,
          payload: {
            loggedIn: response.data.loggedIn,
            user: response.data.user,
          },
        });
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  // Returns true if server authorizes the credentials
  // returns the value after sendin the cookies w/ token
  auth.loginUser = async function (userCredentials, store) {
    try {
      let response = await api.loginUser(userCredentials); // Makes call to server
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.SET_LOGGED_IN,
          payload: {
            loggedIn: response.data.loggedIn,
            user: response.data.user,
          },
        });
        history.push("/");
      }
      // await this.getLoggedIn(); // no need to getLoggedIn
    } catch (err) {
      // Credentials not VALID - return False
      // console.log("[AUTH API]  Status error code:", err.response.status);

      // Separates the messages error separately by
      // 1: Not entered address/password -> 400 error
      let response = err.response;
      if (response.status === 400) {
        // console.log(
        //   "[AUTH API]  Credentials data is missing. Please enter the email/password"
        // );
        // 2: Invalid password / email -> 401 error
      } else if (response.status === 401) {
        // console.log("[AUTH API]  Wrong credentials");
      }
      return response;
    }
  };

  //********************************************************************* */

  auth.registerUser = async function (userData, store) {
    try {
      console.log("registerUser");
      console.log("userData", userData);
      const response = await api.registerUser(userData);
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.REGISTER_USER,
          payload: {
            user: response.data.user,
          },
        });
        history.push("/");
        store.loadIdNamePairs();
      }
    } catch (err) {
      let response = err.response;
      return response;
    }
  };

  auth.tokenStatus = async function () {
    try {
      const response = await api.getLoggedIn();

      if (response.status === 200) {
        return response.data.user.email;
      } else {
        return null;
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  // Check if is loggedIn, if so, it will redirect to homepage
  auth.checkLoggedIn = async function () {
    if (auth.loggedIn) {
      history.push("/");
    }
  };

  auth.logoutUser = async function () {
    try {
      console.log("logging out");
      const response = await api.logoutUser();
      console.log("PASSED LOGOUT");
      if (response.status === 200) {
        authReducer({
          type: AuthActionType.SET_LOGOUT,
        });
      }
    } catch (err) {
      console.log("err:", err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        auth,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
export { AuthContextProvider };
