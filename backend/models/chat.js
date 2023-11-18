const mongoose = require("mongoose");
const SkinResult = require("./skin-result");
const chatSchema = new mongoose.Schema({

    subject: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    type: {
        type: String,
        enum: ['ChatbotChat', 'UserChat'],
        required: true,
    },
    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
    skinResults: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SkinResult",
        },
    ],
});

// .toJSON method is called everytime res.send is called
// id is sent in response but no changed in the db
chatSchema.set("toJSON", {
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
chatSchema.pre("remove", async function (next) {

    await Message.deleteMany({ chat: this._id });
    await SkinResult.deleteMany({ chat: this._id });
    next();
});
// Create a model using the schema
const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
