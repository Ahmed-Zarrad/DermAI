const chatRouter = require("express").Router();
const { openai } = require("../services/chatbot");
const Chat = require("../models/chat");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

chatRouter.get("/:type", async (req, res) => {
    const { type } = req.params;
    const chats = await Chat.find({ type }).sort({ created: -1 });
    res.json(chats);
});

chatRouter.get("/chat/:id", async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
    });

    if (!chat) {
        return res
            .status(404)
            .json({ error: { chat: "Chat not found." } });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
        return res
            .status(401)
            .json({ error: "User not authorized to view this chat." });
    }

    res.json(chat);
});

chatRouter.post("/:type", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    const { type } = req.params;
    const { subject } = req.body;
    const error = {};

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    if (!type) {
        error.type = "Type is required.";
    }  
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const chat = new Chat({
        subject,
        type
    });
    const savedChat = await chat.save();

    res.status(201).json(savedChat);
});
chatRouter.delete("/:id", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }

    let chat = await Chat.findById(req.params.id);

    if (!chat) {
        return res
            .status(404)
            .json({ error: { chat: "Chat not found." } });
    }

    await Chat.findByIdAndRemove(req.params.id);

    res.status(204).end();
});
chatRouter.get("/chat/:chatId/message", async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    const messages = await Message.find({ chat });

    res.json(messages);
});

chatRouter.get("/chat/:chatId/message/:id", async (req, res) => {
    const { chatId } = req.params;
    const message = await Message.findOne({
        _id: req.params.id,
    });

    if (!message) {
        return res
            .status(404)
            .json({ error: { chat: "Message not found." } });
    }

    if (message.chat.toString() !== chatId.toString()) {
        return res
            .status(401)
            .json({ error: "This message don't belong to this chat." });
    }

    res.json(message);
});


chatRouter.post("/:chatId/chatbot/message/", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    const { chatId } = req.params;
    const user = req.user;
    const chat = await Chat.findById(chatId);
    const { role, content } = req.body;
    const error = {};
    if (!role) {
        error.role = "Role is required.";
    }
    if (!content) {
        error.content = "Content is required.";
    }
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const message = new Message({
        chat: chat._id,
        sender: user._id,
        role,
        content,
    });
    const savedMessage = await message.save();
    chat.messages = chat.messages.concat(savedMessage._id);
    await chat.save();
    user.sendMessages = user.sendMessages.concat(savedMessage._id);
    await user.save();
    const AllMessages = await Message.find({ chat });
    const transformedData = {
        chats: AllMessages.map(message => ({
            role: message.role,
            content: message.content
        }))
    };
    const { chats } = transformedData;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are DermAI. You are a chatbot who acts as a dermatologist to help users",
            },
            {
                role: "system",
                content: 'This user is a '+user.role+' and this user first name is '+user.firstName+' and this user last name is '+user.lastName,
            },
            ...chats,
        ],
    });

    res.status(201).json({
        output: chatCompletion.choices[0].message,
    });
    const result = chatCompletion.choices[0].message;
    const messageAssistant = new Message({
        chat: chat._id,
        role: result.role,
        content: result.content,
    });
    const savedMessageAssistant = await messageAssistant.save();
    chat.messages = chat.messages.concat(savedMessageAssistant._id);
    await chat.save();
    user.recivedMessages = user.recivedMessages.concat(savedMessageAssistant._id);
    await user.save();
});
chatRouter.post("/chat/:chatId/user/message", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    const { role, content } = req.body;
    if (!role) {
        error.role = "Role is required.";
    }
    if (!content) {
        error.content = "Content is required.";
    }
    const messageUser = new Message({
        chat: chat._id,
        role,
        content,
    });
    const savedMessageUser = await messageUser.save();
    chat.messages = chat.messages.concat(savedMessageUser._id);
    await chat.save();
    const AllMessages = await Message.find({ chat });
    const transformedData = {
        chats: AllMessages.map(message => ({
            role: message.role,
            content: message.content
        }))
    };
    const { chats } = transformedData;

    const chatCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are DermAI. You are a chatbot who acts as a dermatologist to help users",
            },
            ...chats,
        ],
    });

    res.json({
        output: chatCompletion.choices[0].message,
    });
    const result = chatCompletion.choices[0].message;
    const messageAssistant = new Message({
        chat: chat._id,
        role: result.role,
        content: result.content,
    });
    const savedMessageAssistant = await messageAssistant.save();
    chat.messages = chat.messages.concat(savedMessageAssistant._id);
    await chat.save();
});
chatRouter.delete("/chat", async (req, res) => {
    await Chat.deleteMany({});

    res.status(204).end();
});
chatRouter.delete("/chat/message", async (req, res) => {
    await Message.deleteMany({});

    res.status(204).end();
});

module.exports = chatRouter;
