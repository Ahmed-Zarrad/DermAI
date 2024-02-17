const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const usersRouter = require("express").Router();
const upload = require("../middlewares/upload");

const User = require("../models/user");
const { tokenExtractor, userExtractor } = require("../utils/middleware");

const {
    uploadToCloudinary,
    removeFromCloudinary,
} = require("../services/cloudinary");

usersRouter.post("/photo", upload.single("photo"), async (req, res) => {
   
    if (!req.file) {
        return res.status(400).json({
            error: { photo: "Photo is required." },
        });
    }
    const response = await uploadToCloudinary(req.file.path, "profile-photo");

    res.status(201).json({
        photo: response.url,
        publicId: response.public_id,});
});

usersRouter.post("/:role", async (req, res) => {
    const { role } = req.params;
    const { username, password, confirmPassword, firstName, lastName, email, birthday, phone, country, city, address, postalCode, speciality, photo, publicId } = req.body;

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
    if (!role) {
        error.role = "Role is required.";
    } 

  if (Object.keys(error).length > 0) {
    return res.status(400).json(error);
  }

  const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

  const user = new User({
    username,
      passwordHash, role,
      firstName, lastName, email, birthday, phone, country, city, address, postalCode,
      speciality, photo, publicId,
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
usersRouter.get("/", async (req, res) => {
    const users = await User.find().sort({ speciality: -1 });
    res.json(users);
});
usersRouter.get("/byRole/:role", async (req, res) => {
    const { role } = req.params;
    const users = await User.find({ role }).sort({ speciality: -1 });
    res.json(users);
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

  if (userd._id.toString() !== req.user._id.toString()) {
    return res
     .status(401)
      .json({ error: { user: "User not authorized." } });
  }

    await User.findByIdAndRemove(req.params.id);
    await removeFromCloudinary(userd.publicId);

  res.status(204).end();
});
usersRouter.put('/updateStatus', (req, res) => {
    const userId = req.user._id;
    const { status } = req.body;

    User.findByIdAndUpdate(userId, { status: status }, { new: true }, (err, updatedUser) => {
        if (err) {

            res.status(500).send({ message: 'Error updating user status', error: err });
        } else {
            res.status(200).send({ message: 'User status updated successfully', user: updatedUser });
        }
    });
});


module.exports = usersRouter;
