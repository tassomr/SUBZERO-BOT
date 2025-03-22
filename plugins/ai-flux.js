/*

$$$$$$\            $$\                                               
$$  __$$\           $$ |                                              
$$ /  \__|$$\   $$\ $$$$$$$\  $$$$$$$$\  $$$$$$\   $$$$$$\   $$$$$$\  
\$$$$$$\  $$ |  $$ |$$  __$$\ \____$$  |$$  __$$\ $$  __$$\ $$  __$$\ 
 \____$$\ $$ |  $$ |$$ |  $$ |  $$$$ _/ $$$$$$$$ |$$ |  \__|$$ /  $$ |
$$\   $$ |$$ |  $$ |$$ |  $$ | $$  _/   $$   ____|$$ |      $$ |  $$ |
\$$$$$$  |\$$$$$$  |$$$$$$$  |$$$$$$$$\ \$$$$$$$\ $$ |      \$$$$$$  |
 \______/  \______/ \_______/ \________| \_______|\__|       \______/

Project Name : SubZero MD
Creator      : Darrell Mucheri ( Mr Frank OFC )
Repo         : https//github.com/mrfrank-ofc/SUBZERO-MD
Support      : wa.me/18062212660
*/
// Fuck You Bro
// Mr Frank


const axios = require("axios");
const { cmd } = require("../command");

// Flux Image Command
cmd({
  pattern: "fluximg",
  desc: "Generate an image using Flux AI.",
  category: "AI",
  use: ".fluximg <query>\nExample: .fluximg cat",
  filename: __filename,
  alias: ["flux", "fimg"],
  react: "🖼️"
}, async (conn, mek, m, { from, reply, args }) => {
  try {
    const query = args.join(" "); // Combine the query parts

    if (!query) {
      return reply("Please provide a query.\nExample: `.fluximg cat`");
    }

    // Call the Flux Image API
    const apiUrl = `https://bk9.fun/ai/fluximg?q=${encodeURIComponent(query)}`;
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.BK9 || response.data.BK9.length === 0) {
      return reply("❌ Unable to generate an image. Please try again later.");
    }

    // Extract the image URL
    const imageUrl = response.data.BK9[0];

    // Send the image with caption and footer
    await conn.sendFile(from, imageUrl, "flux_image.webp", `🖼️ *Query:* ${query}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`, m);

  } catch (error) {
    console.error("Error in Flux Image command:", error);
    reply("❌ An error occurred while processing your request. Please try again later.");
  }
});
