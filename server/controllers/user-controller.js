const auth = require("../auth");
const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken"); // remove this

getLoggedIn = async (req, res) => {
  auth.verify(req, res, async function () {
    const loggedInUser = await User.findOne({ _id: req.userId });
    console.log("loggedInUser:", loggedInUser);
    return res.status(200).json({
      loggedIn: true,
      user: {
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
      },
    });
  });
};

loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({
        loggedIn: false,
        success: false,
        credentialsMissing: true,
        errorMessage: "Please enter all required fields.",
      })
      .send();
  }

  // Check if the email is registered
  // Returns null if not exists
  const emailRegistered = await User.findOne({ email: email });
  if (!emailRegistered) {
    return res
      .status(401)
      .json({
        loggedIn: false,
        success: false,
        credentialsMissing: false,
        errorMessage: "Invalid Email or Password",
      })
      .send();
  }

  // Check the password
  let hashPass = emailRegistered.passwordHash;
  let isCorrectPass = bcrypt.compareSync(password, hashPass);
  if (!isCorrectPass) {
    return res
      .status(401)
      .json({
        loggedIn: true,
        success: false,
        errorMessage: "Invalid Email or Password",
      })
      .send();
  }

  // Password correct :
  // Set new token
  const token = auth.signToken(emailRegistered);
  // console.log("token", token);
  const verified = jwt.verify(token, process.env.JWT_SECRET);
  let userId = verified.userId;
  console.log("user", userId);
  console.log("token:", token);
  await res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      loggedIn: true,
      success: true,
      user: {
        firstName: emailRegistered.firstName,
        lastName: emailRegistered.lastName,
        email: emailRegistered.email,
      },
    })
    .send();
};

// ******************************************************************
registerUser = async (req, res) => {
  try {
    console.log("req.body", req.body);
    const { firstName, lastName, email, password, passwordVerify } = req.body;
    if (!firstName || !lastName || !email || !password || !passwordVerify) {
      return res
        .status(400)
        .json({ errorMessage: "Please enter all required fields." });
    }
    if (password.length < 8) {
      return res.status(400).json({
        errorMessage: "Please enter a password of at least 8 characters.",
      });
    }
    if (password !== passwordVerify) {
      return res.status(400).json({
        errorMessage: "Please enter the same password twice.",
      });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        errorMessage: "An account with this email address already exists.",
      });
    }

    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const passwordHash = await bcrypt.hash(password, salt);
    let list = [];
    // *************************************************************************8
    const newUser = new User({
      firstName,
      lastName,
      email,
      passwordHash,
      list,
    });

    // *************************************************************************8

    const savedUser = await newUser.save();

    // LOGIN THE USER
    const token = auth.signToken(savedUser);

    console.log("token", token);
    await res
      .cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
      })
      .status(200)
      .json({
        success: true,
        user: {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
        },
      })
      .send();
  } catch (err) {
    console.error(err);
    res.status(500).send();
  }
};
logoutUser = async (req, res) => {
  let token = "0";
  console.log("logout user");

  await res
    .cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .json({
      success: true,
      loggedIn: false,
    });
};
module.exports = {
  getLoggedIn,
  registerUser,
  loginUser,
  logoutUser,
};
