var express = require("express");
var router = express.Router();
let bcrypt = require("bcrypt");
let schemas = require("../models/sechema.js");
let bodyParser = require("body-parser");

/* GET users listing. */
router.get("/", (req, res) => {
  res.render("login", {
    title: "Login",
    loggedIn: false,
    error: null,
  });
});

/* GET for new users. */
router.get("/newAccount", (req, res) => {
  res.render("newAccount", {
    title: "New Account",
    loggedIn: false,
    error: null,
  });
});

// POST Request for Login
router.post("/", async (req, res) => {
  let email = req.body.emailInput;
  let password = req.body.pwdInput;
  let loginSuccess = false;
  let session = req.session;
  session.loggedIn = false;

  let users = schemas.users;

  if (email != "" && password != "") {
    let searchResult = await users
      .findOne({ email: email })
      .then(async (data) => {
        // Email found:
        if (data) {
          //  Check if password matches or not:
          let checkPasswordResult = await bcrypt
            .compare(password, data.password)
            .then((isMatch) => {
              if (isMatch) {
                // Password Match:
                session.loggedIn = true;
                loginSuccess = true;
              }
            });
        }
      });
  }

  if (loginSuccess) {
    res.redirect("/");
  } else {
    res.render("login", {
      title: "Login",
      loggedIn: false,
      error: "Invalid Login Credentials!",
    });
  }
});

// POST Request for New User
router.post("/new", async (req, res) => {
  let email = req.body.emailInput;
  let password = req.body.pwdInput;

  if (email != "" && password != "") {
    let users = schemas.users;

    let userSearch = await users
      .findOne({ email: email })
      .then(async (data) => {
        if (!data) {
          // Encrypting the password:
          let saltRounds = 10;
          let passwordSalt = await bcrypt.genSalt(
            saltRounds,
            async (err, salt) => {
              let hashPassword = await bcrypt.hash(
                password,
                salt,
                async (err, hash) => {
                  let userAccount = { email: email, password: hash };
                  let newUser = new users(userAccount);
                  let saveUser = newUser.save();
                }
              );
            }
          );
        }
      });
    res.render("login", {
      title: "Login",
      loggedIn: false,
      error: "Please logIn with your new account",
    });
  } else {
    res.render("newAccount", {
      title: "New Account",
      loggedIn: false,
      error: "Something went wrong!",
    });
  }
});

module.exports = router;
