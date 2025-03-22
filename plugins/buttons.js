const axios = require("axios");
const { cmd } = require("../command");

// Perplexity AI Command
cmd({
  pattern: "perplexity",
  desc: "Interact with Perplexity AI.",
  category: "AI",
  use: ".perplexity <query>\nExample: .perplexity Who is Mrfrankofc?",
  filename: __filename,
  alias: ["pp", "plex"],
  react: "🤔"
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.perplexity Who is Mrfrankofc?`");
    }

    // Call the Perplexity API
    const apiUrl = `https://bk9.fun/ai/Perplexity?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.BK9) {
      return reply("❌ Unable to fetch a response from Perplexity AI. Please try again later.");
    }

    // Extract the AI's response and sources
    const aiResponse = response.data.BK9.answer || "No response from Perplexity AI.";
    const sources = response.data.BK9.sources || [];

    // Format the sources with emojis
    let sourcesText = "";
    if (sources.length > 0) {
      sourcesText = "\n\n📚 *Sources:*\n" + sources.map((source, index) => `🔗 ${source}`).join("\n");
    }

    // Send the AI's response with sources
    await reply(`🤔 *Perplexity AI:*\n\n${aiResponse}${sourcesText}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`);

  } catch (error) {
    console.error("Error in Perplexity AI command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
