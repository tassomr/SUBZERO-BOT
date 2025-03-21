/*

- MADE BY MR FRANK 
- COPY WITH CREDITS

*/

const yts = require("yt-search");
const axios = require("axios");
const config = require('../config');
const { cmd } = require('../command');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();

function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "song",
    alias: ["play", "music"],
    react: "🔍",
    desc: "Download Ytmp3",
    category: "download",
    use: ".song <Text or YT URL>",
    filename: __filename
}, async (conn, m, mek, { from, q, reply }) => {
    try {
        if (!q) return await reply("❌ Please provide a Query or Youtube URL!");

        let id = q.startsWith("https://") ? replaceYouTubeID(q) : null;

        if (!id) {
            const searchResults = await dy_scrap.ytsearch(q);
            if (!searchResults?.results?.length) return await reply("❌ No results found!");
            id = searchResults.results[0].videoId;
        }

        const data = await dy_scrap.ytsearch(`https://youtube.com/watch?v=${id}`);
        if (!data?.results?.length) return await reply("❌ Failed to fetch video!");

        const { url, title, image, timestamp, ago, views, author } = data.results[0];

        let info = `📽️ *\`𝚂𝚄𝙱𝚉𝙴𝚁𝙾 𝚈𝚃 𝙿𝙻𝙰𝚈𝙴𝚁\`*📽️\n\n⟡─────────────────⟡\n` +
            `🎵 *Title:* ${title || "Unknown"}\n` +
            `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `👀 *Views:* ${views || "Unknown"}\n` +
            `🌏 *Release Ago:* ${ago || "Unknown"}\n` +
            `👤 *Author:* ${author?.name || "Unknown"}\n` +
            `🖇 *Url:* ${url || "Unknown"}\n\n⟡─────────────────⟡\n` +
            `🔢 *Reply with your choice:*\n\n` +
            `1️⃣ |  *Audio* Type 🎵\n` +
            `2️⃣ |  *Document* Type 📁\n` +
            `3️⃣ |  *Video* Type 🎥\n\n` +

            `${config.FOOTER || "> © ᴘᴏᴡᴇʀᴇᴅ ʙʏ ᴍʀ ғʀᴀɴᴋ"}`;

        const sentMsg = await conn.sendMessage(from, { image: { url: image }, caption: info }, { quoted: mek });
        const messageID = sentMsg.key.id;
        await conn.sendMessage(from, { react: { text: '🎶', key: sentMsg.key } });

        // Listen for user reply only once!
        conn.ev.on('messages.upsert', async (messageUpdate) => { 
            try {
                const mekInfo = messageUpdate?.messages[0];
                if (!mekInfo?.message) return;

                const messageType = mekInfo?.message?.conversation || mekInfo?.message?.extendedTextMessage?.text;
                const isReplyToSentMsg = mekInfo?.message?.extendedTextMessage?.contextInfo?.stanzaId === messageID;

                if (!isReplyToSentMsg) return;

                let userReply = messageType.trim();
                let msg;
                let type;
                let response;
                
                if (userReply === "1") {
                    msg = await conn.sendMessage(from, { text: "_⏳ Subzero Processing, Wait 5 seconds..._" }, { quoted: mek });
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };
                    
                } else if (userReply === "2") {
                    msg = await conn.sendMessage(from, { text: "_⏳ Subzero Processing, Wait 5 seconds..._" }, { quoted: mek });
                    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title };
                    
                
                } else if (userReply === "3") {
                    msg = await conn.sendMessage(from, { text: "_⏳ Subzero Processing, Wait 5 seconds..._" }, { quoted: mek });
                    const response = await dy_scrap.ytmp4_v2(`https://youtube.com/watch?v=${id}`, 360); // Default quality: 360p
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { video: { url: downloadUrl }, caption: title };
                    
                } else { 
                    return await reply("❌ Invalid choice! Reply with 1️⃣, 2️⃣ or 3️⃣");
                }

                await conn.sendMessage(from, type, { quoted: mek });
                await conn.sendMessage(from, { text: '✅ Downloaded Successfully ✅', edit: msg.key });

            } catch (error) {
                console.error(error);
                await reply(`❌ *An error occurred while processing:* ${error.message || "Error!"}`);
            }
        });

    } catch (error) {
        console.error(error);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        await reply(`❌ *An error occurred:* ${error.message || "Error!"}`);
    }
});


// OTHER PLAYERS



// List of APIs to try (fallback mechanism)
const APIS = [
  "https://api.giftedtech.web.id/api/download/ytmp3?apikey=_0x5aff35,_0x1876stqr&url=",
  "https://api.fgmods.xyz/api/downloader/ytmp3?url=",
  "https://api.siputzx.my.id/api/d/ytmp3?url=",
  "https://apis.davidcyriltech.my.id/download/ytmp3?url=",
  "https://api.giftedtech.web.id/api/download/ytplay?apikey=_0x5aff35,_0x1876stqr&url=",
  "https://api.giftedtech.web.id/api/download/dlmp3?apikey=_0x5aff35,_0x1876stqr&url=",
  "https://api.giftedtech.web.id/api/download/yta?apikey=_0x5aff35,_0x1876stqr&url=",
];

cmd({
  pattern: "play4",
  react: '🔄',
  alias: ['ytmp3','ytplay','ytdoc','play2','play3'],
  desc: "Download audio from YouTube by searching for keywords (using multiple APIs).",
  category: "music",
  use: ".play <song name or keywords>",
  filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      return reply("*Please provide a song name or keywords to search for.*");
    }

    reply("```Subzero Searching Song 🔍```");

    // Search for videos on YouTube
    const searchResults = await yts(searchQuery);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return reply(`❌ No results found for "${searchQuery}".`);
    }

    const firstResult = searchResults.videos[0];
    const videoUrl = firstResult.url;

    let downloadUrl = null;
    let title = firstResult.title;

    // Try each API until one works
    for (const api of APIS) {
      try {
        const apiUrl = api + encodeURIComponent(videoUrl);
        const response = await axios.get(apiUrl);

        if (response.data && response.data.success && response.data.result && response.data.result.download_url) {
          downloadUrl = response.data.result.download_url;
          title = response.data.result.title || title;
          break; // Exit loop if successful
        }
      } catch (error) {
        console.error(`API failed: ${api}`, error);
      }
    }

    if (!downloadUrl) {
      return reply("❌ All APIs failed. Please try again later.");
    }

    // Send the audio file
    await conn.sendMessage(from, {
      document: { url: downloadUrl },
      mimetype: "audio/mpeg",
      fileName: title + ".mp3",
      caption: `> Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ ⚡`
    }, { quoted: mek });

    reply(`✅ *${title}* has been downloaded successfully!`);
  } catch (error) {
    console.error("Error downloading audio:", error);
    reply("❌ An error occurred while processing your request.");
  }
});

//song cmd
cmd({
  pattern: "song2",
  react: '🎵',
  alias: ['yta','ytaudio','audio','song4','song3' ],
  desc: "Download audio from YouTube by searching for keywords (using multiple APIs).",
  category: "music",
  use: ".play <song name or keywords>",
  filename: __filename
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    const searchQuery = args.join(" ");
    if (!searchQuery) {
      return reply("*Please provide a song name or keywords to search for.*");
    }

    reply("_Subzero Searching Audio ⚡_");

    const searchResults = await yts(searchQuery);
    if (!searchResults.videos || searchResults.videos.length === 0) {
      return reply(`❌ No results found for "${searchQuery}".`);
    }

    const firstResult = searchResults.videos[0];
    const videoUrl = firstResult.url;

    // List of APIs to try in order
    const apis = [
      `https://apis.davidcyriltech.my.id/download/ytmp3?url=${videoUrl}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?apikey=_0x5aff35,_0x1876stqr&url=${videoUrl}`,
      `https://api.fgmods.xyz/api/downloader/ytmp3?url=${videoUrl}`,
      `https://www.dark-yasiya-api.site/download/ytmp3?url=${videoUrl}`,
      `https://api.giftedtech.web.id/api/download/dlmp3?apikey=_0x5aff35,_0x1876stqr&url=${videoUrl}`
    ];

    let response;
    for (const apiUrl of apis) {
      try {
        response = await axios.get(apiUrl);
        if (response.data.success) {
          break; // Exit the loop if the API call is successful
        }
      } catch (error) {
        console.error(`API call failed: ${apiUrl}`, error);
      }
    }

    if (!response || !response.data.success) {
      return reply(`❌ Failed to fetch audio for "${searchQuery}".`);
    }

    const { title, download_url } = response.data.result;

    // Send the audio file
    await conn.sendMessage(from, {
      audio: { url: download_url },
      mimetype: 'audio/mp4',
      ptt: false
    }, { quoted: mek });

    reply(`✅ *${title}* has been downloaded successfully!`);
  } catch (error) {
    console.error(error);
    reply("❌ An error occurred while processing your request.");
  }
});
