const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

    title: {
        type: String,
    },
    description: {
        type: String,
    },
     image: {
        type: String,
    },
    unread: {
        type: Boolean,
        default: true,
    },
    user:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    created: {
        type: Date,
        default: Date.now,
    },
});

// .toJSON method is called everytime res.send is called
// id is sent in response but no changed in the db
notificationSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        if (returnedObject.created) {
            returnedObject.created = new Date(returnedObject.created).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        }
    },
});

// Create a model using the schema
const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
