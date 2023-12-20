const chatRouter = require("express").Router();
const { openai } = require("../services/chatbot");
const Chat = require("../models/chat");
const Message = require("../models/message");
const User = require("../models/user");
const SkinResult = require("../models/skin-result");
const jwt = require("jsonwebtoken");

chatRouter.get("/:type", async (req, res) => {
    const { type } = req.params;
    const authenticatedUserId = req.user._id;
    const chats = await Chat.find({ users: authenticatedUserId, type  }).sort({ created: -1 });
    res.json(chats);
});

chatRouter.get("/:id", async (req, res) => {
    const chat = await Chat.findOne({
        _id: req.params.id,
    });

    if (!chat) {
        return res
            .status(404)
            .json({ error: { chat: "Chat not found." } });
    }

    if (!chat.users.includes(req.user._id.toString())) {
        return res
            .status(401)
            .json({ error: "User not authorized to view this chat." });
    }

    res.json(chat);
});
chatRouter.post("/user/:userId", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    const { userId } = req.params;
    const { subject, usersId } = req.body;
    const usersIdArray = Array.isArray(usersId) ? usersId : [];
    usersIdArray.push(userId);
    const userss = await User.find({
        _id: { $in: usersIdArray },
    });
    usersIdArray.push(req.user._id, userId);
    userss.push(req.user);
    const error = {};

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const chat = new Chat({
        users: usersIdArray,
        subject,
        type: 'UserChat'
    });
    const savedChat = await chat.save();
    userss.forEach(async user => {
        user.chats = user.chats.concat(savedChat._id);
        await user.save();
    });
    return res.json(savedChat);
});
chatRouter.post("/chatbot", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    const { subject, usersId } = req.body;
    const usersIdArray = Array.isArray(usersId) ? usersId : [];
    const userss = await User.find({
        _id: { $in: usersIdArray },
    });
    usersIdArray.push(req.user._id);
    userss.push(req.user);
    const error = {};

    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
   
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const chat = new Chat({
        users: usersIdArray,
        subject,
        type: 'ChatbotChat'
    });
    const savedChat = await chat.save();
    userss.forEach(async user => {
        user.chats = user.chats.concat(savedChat._id);
        await user.save();
    });
    return res.json(savedChat);
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
    if (!chat.users.includes(req.user._id.toString())) {
        return res
            .status(401)
            .json({ error: "User not authorized to delete this chat." });
    }
    await Message.deleteMany({ chat: chat._id });
    await SkinResult.deleteMany({ chat: chat._id });
    await Chat.findByIdAndRemove(req.params.id);

    res.status(204).end();
});
chatRouter.get("/:chatId/message", async (req, res) => {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId);
    if (!chat) {
        return res
            .status(404)
            .json({ error: { chat: "Chat not found." } });
    }

    if (!chat.users.includes(req.user._id.toString())) {
        return res
            .status(401)
            .json({ error: "User not authorized to view this chat." });
    }
    const messages = await Message.find({ chat });

    res.json(messages);
});
chatRouter.get("/:chatId/message/count", async (req, res) => {
    try {
        const { chatId } = req.params;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return res.status(404).json({ error: { chat: "Chat not found." } });
        }

        const messageCount = chat.messages.length;


        res.status(200).json({ messageCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

chatRouter.get("/:chatId/message/:id", async (req, res) => {
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
    if (!chatId) {
        error.chatId = "chatId is required.";
    }
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const message = new Message({
        chat: chat._id,
        username: user.username,
        role,
        content,
    });
    const savedMessage = await message.save();
    chat.messages = chat.messages.concat(savedMessage._id);
    await chat.save();
    const AllMessages = await Message.find({ chat });
    const transformedData = {
        chats: AllMessages
            .filter(message => ["user", "assistant", "system"].includes(message.role))
            .map(message => ({
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
                content: "You are DermAI. You are a chatbot who acts as a dermatologist to help users, the system composed of 2 AI models who the forst one is gpt-3.5-turbo and the second one is Inceptionv3 model who is able predict predict which skin disease the patient has.",
            },
            {
                role: "system",
                content: 'This user is a '+user.role+' and this user first name is '+user.firstName+' and this user last name is '+user.lastName,
            },
            ...chats,
        ],
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
    res.status(201).json({
        User: savedMessage,
        DermAI: savedMessageAssistant,
    });
});
chatRouter.post("/:chatId/skinResult/message/", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    const { chatId } = req.params;
    const user = req.user;
    const chat = await Chat.findById(chatId);
    const { content, role } = req.body;
    const error = {};

    if (!content) {
        error.content = "content is required.";
    }
    if (!role) {
        error.content = "role is required.";
    }
    if (!chatId) {
        error.chatId = "chatId is required.";
    }
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const message = new Message({
        chat: chat._id,
        username: user.username,
        role,
        content
    });
    const savedMessage = await message.save();
    chat.messages = chat.messages.concat(savedMessage._id);
    await chat.save();

    res.status(201).json(savedMessage);
});
chatRouter.post("/:chatId/user/message/", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    const { chatId } = req.params;
    const user = req.user;
    const chat = await Chat.findById(chatId);
    const {content} = req.body;
    const error = {};
    
    if (!content) {
        error.content = "content is required.";
    }
    if (!chatId) {
        error.chatId = "chatId is required.";
    }
    if (Object.keys(error).length > 0) {
        return res.status(400).json(error);
    }
    const message = new Message({
        chat: chat._id,
        username: user.username,
        content,
    });
    const savedMessage = await message.save();
    chat.messages = chat.messages.concat(savedMessage._id);
    await chat.save();
    
    res.status(201).json(savedMessage);
});
chatRouter.delete("/", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    await Chat.deleteMany({});

    res.status(204).end();
});
chatRouter.delete("/message", async (req, res) => {
    const decodedToken = jwt.verify(req.token, process.env.JWT_SECRET_KEY);
    if (!req.token || !decodedToken.id) {
        return res
            .status(401)
            .json({ error: { token: "Token missing or invalid." } });
    }
    await Message.deleteMany({});

    res.status(204).end();
});

module.exports = chatRouter;
