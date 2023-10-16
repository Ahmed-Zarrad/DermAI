const chatbotRouter = require("express").Router();
const { openai } = require("../services/chatbot");

chatbotRouter.post("/", async (req, res) => {

    const { chats } = req.body;

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
});

module.exports = chatbotRouter;
