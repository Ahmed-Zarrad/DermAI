const chatbotRouter = require("express").Router();
const { openai } = require("../services/chatbot");
const Chat = require("../models/chat");
const Message = require("../models/message");
const jwt = require("jsonwebtoken");

chatbotRouter.get("/chat", async (req, res) => {
    const chats = await Chat.find({ user: req.user });

    res.json(chats);
});

chatbotRouter.get("/chat/:id", async (req, res) => {
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

chatbotRouter.post("/chat", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    const user = req.user;
    const {subject} = req.body;

    const chat = new Chat({
        user: user._id,
        subject,
    });
    const savedChat = await chat.save();
    user.chats = user.chats.concat(savedChat._id);
    await user.save();

    res.status(201).json(savedChat);
});
chatbotRouter.get("/chat/:chatId/message", async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    const messages = await Message.find({ chat });

    res.json(messages);
});

chatbotRouter.get("/chat/:chatId/message/:id", async (req, res) => {
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


chatbotRouter.post("/chat/:chatId/message", async (req, res) => {
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

module.exports = chatbotRouter;
