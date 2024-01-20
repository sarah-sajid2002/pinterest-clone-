var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const passport = require("passport");
passport.use(new localStrategy(userModel.authenticate()));

// main route
router.get("/", (req, res) => {
  res.render("index");
});

// profile route
router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile");
});

// login route
router.get("/login", (req, res) => {
  res.render("login");
});

// feed route
router.get("/feed", (req, res) => {
  res.render("feed");
});

// register route
router.post("/register", (req, res) => {
  const userData = new userModel(({ username, email, fullname } = req.body));
  userModel.register(userData, req.body.password).then((registeredUser) => {
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  });
});

// login route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "profile",
    failureRedirect: "/",
  }),
  function (req, res) {}
);

// logout route
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/llogin");
  });
});

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
module.exports = router;
