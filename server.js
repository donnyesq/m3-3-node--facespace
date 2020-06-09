"use strict";

const express = require("express");
const morgan = require("morgan");

const { users } = require("./data/users");

let currentUser = {};

const findUser = (arr, id) => {
  let foundUser;

  arr.forEach((user) => {
    if (user._id === id) {
      foundUser = user;
    }
  });

  return foundUser;
};

// declare the 404 function
const handleFourOhFour = (req, res) => {
  res.status(404).send("I couldn't find what you're looking for.");
};

const handleHomepage = (req, res) => {
  res.status(200).render("pages/homepage", { users: users });
};

const handleProfilePage = (req, res) => {
  res.status(200).render("pages/profile", {
    users: users,
    user: findUser(users, req.params.id),
  });
};

const handleSignin = (req, res) => {
  res.status(200).render("pages/signin");
};

const handleName = (req, res) => {
  let firstName = req.query.firstName;

  let matchedUser = users.find((user) => user.name === firstName);

  if (!matchedUser) {
    res.status(404).redirect("/signin");
  }

  res.status(200).redirect(`/users/${matchedUser._id}`);
};

// -----------------------------------------------------
// server endpoints
express()
  .use(morgan("dev"))
  .use(express.static("public"))
  .use(express.urlencoded({ extended: false }))
  .set("view engine", "ejs")

  // endpoints
  .get("/", handleHomepage)
  .get("/users/:id", handleProfilePage)
  .get("/signin", handleSignin)
  .get("/getname", handleName)

  // a catchall endpoint that will send the 404 message.
  .get("*", handleFourOhFour)

  .listen(8000, () => console.log("Listening on port 8000"));
