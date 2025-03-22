const axios = require("axios");
const { cmd } = require("../command");

// Gemini AI Command
cmd({
  pattern: "gemini",
  desc: "Interact with Gemini AI.",
  category: "AI",
  use: ".gemini <query>\nExample: .gemini What is the capital of France?",
  filename: __filename,
  alias: ["gmi", "geminiai","geminipro","googleai","gemini1.5"],
  react: "🤖"
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
    await reply(`🤖 \`GEMINI AI:\`\n\n${aiResponse}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`);

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
  filename: __filename,
  alias: ["sz", "sub"],
  react: "❄️"
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.subzero What is your purpose?`");
    }

    // Call the Subzero API
    const apiUrl = `https://bk9.fun/ai/BK93?BK9=I%20am%20the%20enigmatic%20Subzero%2C%20created%20by%20the%20visionary%20Mr.%20Frank%20(Darrell%20Mucheri)%2C%20a%20tech%20genius%20from%20Zimbabwe%20%F0%9F%87%AF%F0%9F%87%BC._He%20is%20a%20master%20of%20coding%2C%20physics%2C%20and%20strategic%20silence._His%20website%20%28https%3A%2F%2Fmrfrankinc.vercel.app%29%20and%20GitHub%20%28github.com%2Fmrfrank-ofc%29%20reveal%20glimpses%20of%20his%20innovative%20spirit._When%20asked%20about%20personal%20matters%2C%20he%20remains%20mysteriously%20elusive%2C%20leaving%20others%20in%20suspense._Now%2C%20ask%20me%20anything%2C%20and%20I'll%20respond%20with%20the%20wisdom%20of%20Subzero.%20&q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status) {
      return reply("❌ Unable to fetch a response from Subzero AI. Please try again later.");
    }

    // Extract the AI's response
    const aiResponse = response.data.BK9 || "No response from Subzero AI.";

    // Send the AI's response
    await reply(`❄️ \`SUBZERO AI:\`\n\n${aiResponse}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`);

  } catch (error) {
    console.error("Error in Subzero AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Llama AI Command
cmd({
  pattern: "llama",
  desc: "Interact with Llama AI.",
  category: "AI",
  use: ".llama <query>\nExample: .llama Hi",
  filename: __filename,
  alias: ["llm", "llama2","llama3","meta","metai","bing","copilot","gpt","chatgpt","gpt3","gpt4","ai","bot","chat","claude","claudeai","gpt3.5","gptturbo"],
  react: "⏳"
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.ai Hi`");
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
    await reply(`🤖 \`SUBZERO MODEL:\`\n\n${aiResponse}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`);

  } catch (error) {
    console.error("Error in Llama AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});

// Deepseek AI Command
cmd({
  pattern: "deepseek",
  desc: "Interact with Deepseek AI.",
  category: "AI",
  use: ".deepseek <query>\nExample: .deepseek Hello",
  filename: __filename,
  alias: ["ds", "seek","deeseekr1","deepseek-r1"],
  react: "🔍"
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
    await reply(`🔍 \`Deepseek AI:\`\n\n${aiResponse}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`);

  } catch (error) {
    console.error("Error in Deepseek AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
