const { OpenAI } = require("openai");

const openai = new OpenAI({
    organization: process.env.OpenAI_organization,
    apiKey: process.env.OpenAI_apiKey,
});


module.exports = { openai };