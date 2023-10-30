let mongoose = require("mongoose");
let schema = mongoose.Schema;

let menuSchema = new schema({
  name: { type: String, require: true },
  menuURL: { type: String, require: true },
  entryDate: { type: Date, default: Date.now },
});

let userSchema = new schema({
  email: { type: String, require: true },
  password: { type: String, require: true },
  entryDate: { type: Date, default: Date.now },
});

let menu = mongoose.model("menu", menuSchema, "menu");
let users = mongoose.model("users", userSchema, "users");

let mySchema = { menu: menu, users: users };

module.exports = mySchema;
