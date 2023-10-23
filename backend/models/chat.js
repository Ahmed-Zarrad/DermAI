const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({

    subject: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
      messages: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
        },
      ]
});

// .toJSON method is called everytime res.send is called
// id is sent in response but no changed in the db
chatSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
        delete returnedObject.user;
        delete returnedObject.created;
    },
});
chatSchema.pre("remove", async function (next) {
    
    await Message.deleteMany({ chat: this._id });
    next();
});

// Create a model using the schema
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
