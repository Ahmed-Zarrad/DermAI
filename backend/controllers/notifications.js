const notificationRouter = require("express").Router();
const Notification = require("../models/notification");
const User = require("../models/user");
const jwt = require("jsonwebtoken");

notificationRouter.get("/",async (req, res) => {
    const authenticatedUserId = req.user._id;
    const notifications = await Notification.find({ user: authenticatedUserId }).sort({ created: -1 });
    res.json(notifications);
});

notificationRouter.get("/:id", async (req, res) => {
    const notification = await Notification.findOne({
        _id: req.params.id,
    });

    if (!notification) {
        return res
            .status(404)
            .json({ error: { notification: "Notification not found." } });
    }

    if (!notification.users.includes(req.user._id.toString())) {
        return res
            .status(401)
            .json({ error: "User not authorized to view this notification." });
    }

    res.json(notification);
});
notificationRouter.post("/:userId", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    const { userId } = req.params;
    const { title, description, image } = req.body;
    const error = {};

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const notification = new Notification({
        user: userId,
        title,
        description,
        image
    });
    const savedNotification = await notification.save();
    user.notifications = user.notifications.concat(savedNotification._id);
    await user.save();
    return res.json(savedNotification);
});
 
notificationRouter.delete("/:id", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }

    let notification = await Notification.findById(req.params.id);

    if (!notification) {
        return res
            .status(404)
            .json({ error: { notification: "Notification not found." } });
    }
    if (!notification.users.includes(req.user._id.toString())) {
        return res
            .status(401)
            .json({ error: "User not authorized to delete this notification." });
    }
    await Notification.findByIdAndRemove(req.params.id);

    res.status(204).end();
});

module.exports = notificationRouter;
