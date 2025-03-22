const axios = require("axios");
const { cmd } = require("../command");

// Gemini AI Command
cmd({
  pattern: "geminit",
  alias: ["gmi", "googleai"], // Aliases for Gemini
  desc: "Interact with Gemini AI.",
  category: "AI",
  use: ".gemini <query>\nExample: .gemini What is the capital of France?",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.gemini What is the capital of France?`");
    }

    // Send a "thinking" message
    const thinkingMsg = await reply("🤔 *Gemini AI is thinking...*");

    // Call the Gemini API
    const apiUrl = `https://bk9.fun/ai/gemini?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return conn.sendMessage(from, { text: "❌ Unable to fetch a response from Gemini AI. Please try again later." }, { edit: thinkingMsg.key });
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Gemini AI.";

    // Edit the "thinking" message with the AI's response
    await conn.sendMessage(from, { text: `🤖 *Gemini AI:*\n\n${aiResponse}` }, { edit: thinkingMsg.key });

  } catch (error) {
    console.error("Error in Gemini AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Subzero AI Command
cmd({
  pattern: "subzero",
  alias: ["sz", "subz"], // Aliases for Subzero
  desc: "Interact with Subzero AI.",
  category: "AI",
  use: ".subzero <query>\nExample: .subzero What is your purpose?",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.subzero What is your purpose?`");
    }

    // Send a "thinking" message
    const thinkingMsg = await reply("🤔 *Subzero AI is thinking...*");

    // Call the Subzero API
    const apiUrl = `https://bk9.fun/ai/BK93?BK9=you%20are%20subzero%20from%20mortal%20kombat%20Created/Developed%20by%20Mr%20Frank%20(Darrell Mucheri🇿🇼)&q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return conn.sendMessage(from, { text: "❌ Unable to fetch a response from Subzero AI. Please try again later." }, { edit: thinkingMsg.key });
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Subzero AI.";

    // Edit the "thinking" message with the AI's response
    await conn.sendMessage(from, { text: `❄️ *Subzero AI:*\n\n${aiResponse}` }, { edit: thinkingMsg.key });

  } catch (error) {
    console.error("Error in Subzero AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Llama AI Command
cmd({
  pattern: "llamat",
  alias: ["llm", "lamma"], // Aliases for Llama
  desc: "Interact with Llama AI.",
  category: "AI",
  use: ".llama <query>\nExample: .llama Hi",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.llama Hi`");
    }

    // Send a "thinking" message
    const thinkingMsg = await reply("🤔 *Llama AI is thinking...*");

    // Call the Llama API
    const apiUrl = `https://bk9.fun/ai/llama?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return conn.sendMessage(from, { text: "❌ Unable to fetch a response from Llama AI. Please try again later." }, { edit: thinkingMsg.key });
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Llama AI.";

    // Edit the "thinking" message with the AI's response
    await conn.sendMessage(from, { text: `🦙 *Llama AI:*\n\n${aiResponse}` }, { edit: thinkingMsg.key });

  } catch (error) {
    console.error("Error in Llama AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Deepseek AI Command
cmd({
  pattern: "deepseekt",
  alias: ["ds", "deep"], // Aliases for Deepseek
  desc: "Interact with Deepseek AI.",
  category: "AI",
  use: ".deepseek <query>\nExample: .deepseek Hello",
  filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.deepseek Hello`");
    }

    // Send a "thinking" message
    const thinkingMsg = await reply("🤔 *Deepseek AI is thinking...*");

    // Call the Deepseek API
    const apiUrl = `https://bk9.fun/ai/deepseek-r1?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return conn.sendMessage(from, { text: "❌ Unable to fetch a response from Deepseek AI. Please try again later." }, { edit: thinkingMsg.key });
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9?.content || response.data.BK9 || "No response from Deepseek AI.";

    // Edit the "thinking" message with the AI's response
    await conn.sendMessage(from, { text: `🤖 *Deepseek AI:*\n\n${aiResponse}` }, { edit: thinkingMsg.key });

  } catch (error) {
    console.error("Error in Deepseek AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
