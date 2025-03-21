// DARRELL
const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "tempnumber",
  alias: ["tempnum", "randomnumber","tn","tempsms"],
  react: '📞',
  desc: "Get a random temporary number for SMS verification.",
  category: "tools",
  use: ".tempnumber2",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = "https://apis-keith.vercel.app/tempnumber";

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.length) {
      return reply('❌ Unable to fetch temporary numbers. Please try again later.');
    }

    // Get a random number from the list
    const numbers = response.data.result;
    const randomNumber = numbers[Math.floor(Math.random() * numbers.length)];

    // Extract number details
    const { country, number, link } = randomNumber;

    // Prepare the message
    const message = `📞 *\`Temporary Number for SMS\`* 📞\n\n` +
                    `🌍 *Country:* ${country}\n` +
                    `📱 *Number:* ${number}\n` +
                    `🔗 *Link:* ${link}\n\n` +
                    `> © 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐁𝐎𝐓`;

    // Attach an image (replace with your image URL)
    const imageUrl = "https://i.postimg.cc/nLn4gDGg/Glavnoe-New-Africa-0f076b51bf.webp"; // Example image URL

    // Send the message with the image
    await conn.sendMessage(from, {
      image: { url: imageUrl },
      caption: message,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363304325601080@newsletter',
          newsletterName: '『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error fetching temporary number:', error);
    reply('❌ Unable to fetch a temporary number. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
