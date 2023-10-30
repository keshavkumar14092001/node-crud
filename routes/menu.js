var express = require("express");
var router = express.Router();
let bodyParser = require("body-parser");
let schemas = require("../models/sechema.js");

/* GET home page. */
router.get("/", function (req, res) {
  let sesh = req.session;
  let loggedIn = sesh.loggedIn;
  res.render("index", { loggedIn: loggedIn });
});

// Catching the "POST" request from the frontend to add a new menu in the database:
router.post("/new", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let menuName = req.body.menuName;
    let menuUrl = req.body.menuUrl;

    let menu = schemas.menu;

    // Searching if the entered menu is already present or not:
    let searchResults = await menu
      .findOne({ name: menuName })
      .then(async (userData) => {
        if (!userData) {
          // No Data Found
          let newMenu = new menu({
            name: menuName,
            menuURL: menuUrl,
          });

          let saveMenu = await newMenu.save();
        }
      });

    res.redirect("/");
  }
});

// Getting the "edit" request to update a menu:
router.get("/edit/:id", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let id = req.params.id;
    let err = "";
    let menu = schemas.menu;

    let itemResult = await menu.findOne({ _id: id }).then((data) => {
      if (data == null) {
        err = "Invalid ID";
      }
      res.render("menu", {
        title: "Edit",
        item: data,
        loggedIn: sesh.loggedIn,
        error: err,
      });
    });
  }
});

// Getting the "Save" request after edit:
router.post("/save", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let menuId = req.body.menuId;
    let menuName = req.body.menuName;
    let menuUrl = req.body.menuUrl;
    let menu = schemas.menu;

    let saveData = await menu.findByIdAndUpdate(
      { _id: menuId },
      {
        name: menuName,
        menuURL: menuUrl,
      }
    );

    res.redirect("/");
  }
});

// Getting the "delete" request to delete a menu:
router.get("/delete/:id", async (req, res) => {
  let sesh = req.session;

  if (!sesh.loggedIn) {
    res.redirect("/login");
  } else {
    let menu = schemas.menu;
    let menuId = req.params.id;
    let deleteResult = await menu.findByIdAndDelete({ _id: menuId });
    res.redirect("/");
  }
});

module.exports = router;
