const bcrypt = require("bcrypt");
const signupRouter = require("express").Router();
const upload = require("../middlewares/upload");

const User = require("../models/user");


const {
    uploadToCloudinary,
} = require("../services/cloudinary");
signupRouter.post("/photo", upload.single("photo"), async (req, res) => {

    if (!req.file) {
        return res.status(400).json({
            error: { photo: "Photo is required." },
        });
    }
    const response = await uploadToCloudinary(req.file.path, "profile-photo");

    res.status(201).json({
        photo: response.url,
        publicId: response.public_id,
    });
});

signupRouter.post("/:role", async (req, res) => {
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

module.exports = signupRouter;