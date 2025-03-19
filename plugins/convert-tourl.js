const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

// List of Mr Frank APIs change with yourz lol
const API_KEYS = [
  "40dfb24c7b48ba51487a9645abf33148",
  "4a9c3527b0cd8b12dd4d8ab166a0f592",
  "0e2b3697320c339de00589478be70c48",
  "7b46d3cddc9b67ef690ed03dce9cb7d5"
];

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url","url2"],
  react: '🔄',
  desc: "Convert an image to a URL.",
  category: "utility",
  use: ".tourl (reply to an image)",
  filename: __filename
}, async (conn, mek, m, { reply }) => {
  try {
    // Check if the message is a quoted message or contains media
    const quotedMessage = m.quoted ? m.quoted : m;
    const mimeType = (quotedMessage.msg || quotedMessage).mimetype || '';

    if (!mimeType || !mimeType.startsWith('image')) {
      return reply("*[❗] Oops! Reply to An Image*");
    }

    // Download the media file
    const mediaBuffer = await quotedMessage.download();
    const tempFilePath = path.join(os.tmpdir(), "subzero_bot.jpg"); // I dare you to change it !
    fs.writeFileSync(tempFilePath, mediaBuffer);

    let imageUrl;
    let lastError;

    // Rotate through API keys until one succeeds
    for (const apiKey of API_KEYS) {
      try {
        // Upload the media to imgBB
        const formData = new FormData();
        formData.append('image', fs.createReadStream(tempFilePath));

        const uploadResponse = await axios.post("https://api.imgbb.com/1/upload", formData, {
          params: {
            key: apiKey // Use the current API key
          },
          headers: {
            ...formData.getHeaders()
          }
        });

        if (!uploadResponse.data || !uploadResponse.data.data || !uploadResponse.data.data.url) {
          throw new Error("❌ Error uploading the image.");
        }

        imageUrl = uploadResponse.data.data.url;
        break; // Exit the loop if upload is successful
      } catch (error) {
        lastError = error;
        console.error(`Error with API key ${apiKey}:`, error.message || error);
        // Continue to the next API key
      }
    }

    // Delete the temporary file
    fs.unlinkSync(tempFilePath);

    // Check if any API key succeeded
    if (!imageUrl) {
      throw lastError || "❌ All API keys failed to upload the image.";
    }

    // Send the URL to the user
    await reply(`\`IMAGE UPLOADED SUCCESSFULLY!\`\n\n──────────────────────\n📂 *File Size:* ${mediaBuffer.length} bytes\n🔗 *URL:* ${imageUrl}\n\n──────────────────────\n> © ᴘϙᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ `);

  } catch (error) {
    console.error("Error in tourl command:", error);
    reply(`❌ Error: ${error.message || error}`);
  }
});
