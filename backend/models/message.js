const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({

    role: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat",
    },
});

// .toJSON method is called everytime res.send is called
// id is sent in response but no changed in the db
messageSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.chat;
        delete returnedObject.created;
    },
});

// Create a model using the schema
const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
