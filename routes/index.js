var express = require("express");
var router = express.Router();
const userModel = require("./users");
const postModel = require("./posts");
const localStrategy = require("passport-local");
const passport = require("passport");
passport.use(new localStrategy(userModel.authenticate()));
const upload = require("./multer"); // Import the Multer

// index route
router.get("/", (req, res) => {
  res.render("index");
});

// profile route
router.get("/profile", isLoggedIn, async (req, res, next) => {
  const user = await userModel
    .findOne({
      username: req.session.passport.user,
    })
    .populate("posts");
  console.log(user);
  res.render("profile", { user });
});

// login route
router.get("/login", (req, res) => {
  res.render("login", { error: req.flash("error") });
});

// upload image route
router.get("/upload", isLoggedIn, async (req, res) => {
  res.render("upload", { error: "" });
});

// logout route
router.get("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
});

// update profile get route
router.get("/updateProfile", isLoggedIn, (req, res) => {
  res.render("updateProfile");
});

// register route
router.post("/register", async (req, res) => {
  const { username, email, fullname, password } = req.body;

  try {
    // Check if the username or email already exists in the database
    const existingUser = await userModel.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      // User with the same username or email already exists
      req.flash(
        "error",
        "Username or email already in use. Please choose another."
      );
      return res.redirect("/login");
    }

    // If no existing user, proceed with registration
    const userData = new userModel({ username, email, fullname });
    const registeredUser = await userModel.register(userData, password);

    // Successful registration
    passport.authenticate("local")(req, res, () => {
      res.redirect("/profile");
    });
  } catch (error) {
    // Handle any errors, possibly flash a generic message
    req.flash("error", "Something went wrong. Please try again.");
    res.redirect("/login");
  }
});

// login route
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "profile",
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {}
);

// isLoggedIn middleware
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

// Handle file upload-multer
router.post("/upload", isLoggedIn, upload.single("file"), async (req, res) => {
  if (!req.file) {
    return res.status(404).send("Select file");
  } else if (
    req.body.filecaption.length < 8 ||
    req.body.filrdescription.length < 15
  ) {
    res.render("upload", {
      error: "length of caption or description is less",
    });
  } else {
    const user = await userModel.findOne({
      username: req.session.passport.user,
    });
    if (!user) {
      return res.status(404).send("User not found");
    }
    console.log("Username from session:", req.session.passport.user);
    console.log("User:", user);

    const post = await postModel.create({
      image: req.file.filename,
      text: req.body.filecaption,
      description: req.body.filrdescription,
      user: user._id,
    });

    user.posts.push(post._id);
    await user.save();
    // doing data association
    console.log("uploaded successfully");
    res.redirect("profile");
  }
});

// Route to update user information
router.post(
  "/updateProfile",
  isLoggedIn,
  upload.fields([{ name: "dp" }, { name: "coverPhoto" }]),
  async (req, res) => {
    try {
      const user = await userModel.findOne({
        username: req.session.passport.user,
      });
      const userId = user._id;
      console.log(userId);
      const { username, email, fullname, categories, description } = req.body;

      // Files are available in req.files
      const dpFile = req.files["dp"][0];
      const coverPhotoFile = req.files["coverPhoto"][0];

      // You can access file details like dpFile.filename, etc.
      console.log("DP File:", dpFile);
      console.log("Cover Photo File:", coverPhotoFile);

      // Update user information, including file details
      const updatedUser = await userModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            username,
            email,
            fullname,
            categories,
            description,
            dp: dpFile.filename,
            coverPhoto: coverPhotoFile.filename,
          },
        },
        { new: true } // Return the modified document
      );
      res.redirect("profile");
      if (!updatedUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Optionally, you can send the updated user as a response
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
);

// API route for fetching more feed items
router.get("/feed", isLoggedIn, async (req, res) => {
  console.log("hiiiiiiiiiiiiiiiiiiiiiiiiiii");
  const user = await userModel.findOne({
    username: req.session.passport.user,
  });
  const posts = await postModel.find().populate("user");
  console.log("posts", posts);
  console.log("user", user);
  res.render("feed", { user, posts });
});

module.exports = router;
