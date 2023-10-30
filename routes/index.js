var express = require("express");
var router = express.Router();
let schemas = require("../models/sechema.js");

/* GET home page. */
router.get("/", async (req, res) => {
  let sesh = req.session;
  let menu = schemas.menu;
  let menuResults = await menu.find({}).then((menuData) => {
    res.render("index", {
      title: "Menu Finder",
      data: menuData,
      search: "",
      loggedIn: sesh.loggedIn,
    });
  });
});

// LogOut Request
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// Getting the POST request from the template at "/q":
router.post("/q", async (req, res) => {
  let sesh = req.session;

  let menu = schemas.menu;
  let q = req.body.searchInput;
  let menuData = null;
  let qery = { name: { $regex: "^" + q, $options: "i" } };

  if (q != null) {
    let menuResult = await menu.find(qery).then((data) => {
      menuData = data;
    });
  } else {
    q = "Search";
    let menuResult = await menu.find({}).then((data) => {
      menuData = data;
    });
  }

  res.render("index", {
    title: "Menu Finder",
    data: menuData,
    search: q,
    loggedIn: sesh.loggedIn,
  });
});

module.exports = router;
