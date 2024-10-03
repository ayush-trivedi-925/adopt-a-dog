const express = require("express");
const User = require("../models/user");
const wrapAsync = require("../utilities/wrapAsync");
const passport = require("passport");
const { func } = require("joi");
const router = express.Router();
const { storeReturnTo } = require("../middleware");
const users = require("../controllers/users");

router
  .route("/register")
  .get(users.getRegisterForm)
  .post(wrapAsync(users.createUser));

router
  .route("/login")
  .get(users.getLoginForm)
  .post(
    storeReturnTo,
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    users.loginUser
  );

router.get("/logout", users.logoutUser);

module.exports = router;
