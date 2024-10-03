const User = require("../models/user");

module.exports.getRegisterForm = (req, res) => {
  res.render("users/register");
};

module.exports.createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email });

  // Register the user
  const registeredUser = await User.register(newUser, password);

  // Automatically log in the user after registration
  req.login(registeredUser, (err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You've been successfully registered!");
    res.redirect("/dogs");
  });
};

module.exports.getLoginForm = (req, res) => {
  res.render("users/login");
};

module.exports.loginUser = (req, res) => {
  req.flash("success", "Welcome Back!");
  const redirectUrl = res.locals.returnTo || "/dogs";
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Successfully logged out!");
      res.redirect("/login");
    }
  });
};
