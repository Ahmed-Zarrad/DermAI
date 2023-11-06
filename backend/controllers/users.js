const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();

const User = require("../models/user");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

usersRouter.post("/", async (req, res) => {
  const { username, password, confirmPassword } = req.body;

  const error = {};

  if (!username) {
    error.username = "Username is required.";
  } else {
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      error.username = "Username already exists.";
    }
  }

  if (!password) {
    error.password = "Password is required.";
  } else if (password.toLowerCase().includes("password")) {
    error.password = "Password can't contain 'password'";
  } else if (password.length < 7) {
    error.password =
      "Password is too short, it must contain at least 7 characters.";
  }

  if (!confirmPassword) {
    error.confirmPassword = "Password confirmation is required.";
  } else if (password !== confirmPassword) {
    error.password = "Passwords do not match.";
    error.confirmPassword = "Passwords do not match.";
  }

  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
    passwordHash,
  });

  const savedUser = await user.save();

  res.status(201).json(savedUser);
});

usersRouter.get("/:id", tokenExtractor, userExtractor, async (req, res) => {
  const user = await User.findById(req.params.id).populate("skinResults", {
    image: 1,
    diseaseName: 1,
    probability: 1,
    date: 1,
  });

  if (user) {
    return res.json(user);
  }

  res.status(404).json({ error: "user not found" });
});
usersRouter.delete("/:id", async (req, res) => {
  const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

  if (!req.token || !decodedToken.id) {
    return res
      .status(401)
      .json({ error: { token: "Token missing or invalid." } });
  }

  let userd = await User.findById(req.params.id);

  if (!userd) {
    return res
      .status(404)
      .json({ error: { userd: "User not found." } });
  }

  //if (user.toString() !== req.user._id.toString()) {
   // return res
    //  .status(401)
    //  .json({ error: { user: "User not authorized." } });
 // }

  await User.findByIdAndRemove(req.params.id);

  res.status(204).end();
});


module.exports = usersRouter;
