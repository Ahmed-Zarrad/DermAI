const { OpenAI } = require("openai");

const openai = new OpenAI({
    organization: "org-WBB0TDQN6UZwSQYBvaHurv1L",
    apiKey: "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",
});


module.exports = { openai };