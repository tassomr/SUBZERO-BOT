const axios = require("axios");
const { cmd } = require("../command");

// Gemini AI Command
cmd({
  pattern: "geminit",
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

    // Call the Gemini API
    const apiUrl = `https://bk9.fun/ai/gemini?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return reply("❌ Unable to fetch a response from Gemini AI. Please try again later.");
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Gemini AI.";

    // Send the AI's response
    await reply(`🤖 *Gemini AI:*\n\n${aiResponse}`);

  } catch (error) {
    console.error("Error in Gemini AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Subzero AI Command
cmd({
  pattern: "subzerot",
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

    // Call the Subzero API
    const apiUrl = `https://bk9.fun/ai/BK93?BK9=you%20are%20subzero%20from%20mortal%20kombat&q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return reply("❌ Unable to fetch a response from Subzero AI. Please try again later.");
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Subzero AI.";

    // Send the AI's response
    await reply(`🤖 *Subzero AI:*\n\n${aiResponse}`);

  } catch (error) {
    console.error("Error in Subzero AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Llama AI Command
cmd({
  pattern: "llamat",
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

    // Call the Llama API
    const apiUrl = `https://bk9.fun/ai/llama?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return reply("❌ Unable to fetch a response from Llama AI. Please try again later.");
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Llama AI.";

    // Send the AI's response
    await reply(`🤖 *Llama AI:*\n\n${aiResponse}`);

  } catch (error) {
    console.error("Error in Llama AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Deepseek AI Command
cmd({
  pattern: "deepseekt",
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

    // Call the Deepseek API
    const apiUrl = `https://bk9.fun/ai/deepseek-r1?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return reply("❌ Unable to fetch a response from Deepseek AI. Please try again later.");
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9?.content || response.data.BK9 || "No response from Deepseek AI.";

    // Send the AI's response
    await reply(`🤖 *Deepseek AI:*\n\n${aiResponse}`);

  } catch (error) {
    console.error("Error in Deepseek AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
