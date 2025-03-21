/*

- MADE BY MR FRANK 
- COPY WITH CREDITS

*/


const { cmd } = require("../command");
const yts = require("yt-search");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const config = require('../config');
const DY_SCRAP = require('@dark-yasiya/scrap');
const dy_scrap = new DY_SCRAP();




function replaceYouTubeID(url) {
    const regex = /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "songs",
    alias: ["ytmp3s", "ytmp3dls"],
    react: "🎵",
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

        let info = ` *\`📽️ 𝚂𝚄𝙱𝚉𝙴𝚁𝙾 𝚈𝚃 𝙳𝙾𝚆𝙽𝙻𝙾𝙰𝙳𝙴𝚁 📽️\`*\n\n` +
            `🎵 *Title:* ${title || "Unknown"}\n` +
            `⏳ *Duration:* ${timestamp || "Unknown"}\n` +
            `👀 *Views:* ${views || "Unknown"}\n` +
            `🌏 *Release Ago:* ${ago || "Unknown"}\n` +
            `👤 *Author:* ${author?.name || "Unknown"}\n` +
            `🖇 *Url:* ${url || "Unknown"}\n\n⟡────────────────⟡\n\n` +
            `🔢 *Reply with your choice:*\n\n` +
            `1️⃣ | *Audio* Type 🎵\n` +
            `2️⃣ | *Document* Type 📁\n\n` +
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
                    msg = await conn.sendMessage(from, { text: "⏳ Subzero Processing..." }, { quoted: mek });
                    response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { audio: { url: downloadUrl }, mimetype: "audio/mpeg" };
                    
                } else if (userReply === "2") {
                    msg = await conn.sendMessage(from, { text: "⏳ Subzero Processing..." }, { quoted: mek });
                    const response = await dy_scrap.ytmp3(`https://youtube.com/watch?v=${id}`);
                    let downloadUrl = response?.result?.download?.url;
                    if (!downloadUrl) return await reply("❌ Download link not found!");
                    type = { document: { url: downloadUrl }, fileName: `${title}.mp3`, mimetype: "audio/mpeg", caption: title };
                    
                } else { 
                    return await reply("❌ Invalid choice! Reply with 1️⃣ or 2️⃣.");
                }

                await conn.sendMessage(from, type, { quoted: mek });
                await conn.sendMessage(from, { text: '✅ Song Downloaded Successfully ✅', edit: msg.key });

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


cmd({
  pattern: "ytmp4pro",
  alias: ["videopro", "mp4pro"],
  react: '🎥',
  desc: "Download videos from YouTube using Keith's API.",
  category: "download",
  use: ".ytmp4 <YouTube URL or video name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    // Check if the user provided a query
    if (!q) {
      return reply('Please provide a YouTube URL or video name. Example: `.ytmp4 https://youtube.com/...` or `.ytmp4 La la la`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let videoUrl = q;
    let searchData = null;

    // If the user provided a video name instead of a URL
    if (!q.startsWith("https://")) {
      const searchResults = await yts(q);
      if (!searchResults.videos.length) {
        return reply('❌ No results found. Please try a different query.');
      }

      searchData = searchResults.videos[0];
      videoUrl = searchData.url;
    }

    // Prepare the API URL
    const apiUrl = `https://apis-keith.vercel.app/download/dlmp4?url=${encodeURIComponent(videoUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.downloadUrl) {
      return reply('❌ Unable to fetch the video. Please try again later.');
    }

    // Extract the download link and video details
    const downloadUrl = response.data.result.downloadUrl;
    const videoDetails = {
      title: response.data.result.title || "Unknown",
      quality: response.data.result.quality || "Unknown"
    };

    // Inform the user that the video is being downloaded
    await reply(`🎥 *Downloading ${videoDetails.title}...*`);

    // Download the video
    const videoResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    if (!videoResponse.data) {
      return reply('❌ Failed to download the video. Please try again later.');
    }

    // Save the downloaded file temporarily
    const tempFilePath = path.join(__dirname, `${videoDetails.title}.mp4`);
    fs.writeFileSync(tempFilePath, videoResponse.data);

    // Read the downloaded file
    const videoBuffer = fs.readFileSync(tempFilePath);

    // Send the video as a document
    await conn.sendMessage(from, {
      document: videoBuffer,
      mimetype: 'video/mp4',
      fileName: `${videoDetails.title}.mp4`,
      caption: `> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ\n> Title: ${videoDetails.title}\n> Quality: ${videoDetails.quality}`,
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

    // Delete temporary file
    fs.unlinkSync(tempFilePath);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading video:', error);
    reply('❌ Unable to download the video. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});

// PLAY PRO


cmd({
  pattern: "ytmp3pro",
  alias: ["playpro", "mp3pro", "musicpro"],
  react: '🎵',
  desc: "Download songs from YouTube using Keith's API.",
  category: "download",
  use: ".ytmp3 <YouTube URL or song name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    // Check if the user provided a query
    if (!q) {
      return reply('Please provide a YouTube URL or song name. Example: `.ytmp3 https://youtube.com/...` or `.ytmp3 Believer`');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    let videoUrl = q;
    let searchData = null;

    // If the user provided a song name instead of a URL
    if (!q.startsWith("https://")) {
      const searchResults = await yts(q);
      if (!searchResults.videos.length) {
        return reply('❌ No results found. Please try a different query.');
      }

      searchData = searchResults.videos[0];
      videoUrl = searchData.url;
    }

    // Prepare the API URL
    const apiUrl = `https://apis-keith.vercel.app/download/dlmp3?url=${encodeURIComponent(videoUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.downloadUrl) {
      return reply('❌ Unable to fetch the song. Please try again later.');
    }

    // Extract the download link and song details
    const downloadUrl = response.data.result.downloadUrl;
    const songDetails = {
      title: response.data.result.title || "Unknown",
      format: response.data.result.format || "mp3"
    };

    // Inform the user that the song is being downloaded
    await reply(`🎵 *Downloading ${songDetails.title}...*`);

    // Download the song
    const songResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });
    if (!songResponse.data) {
      return reply('❌ Failed to download the song. Please try again later.');
    }

    // Save the downloaded file temporarily
    const tempFilePath = path.join(__dirname, `${songDetails.title}.mp3`);
    fs.writeFileSync(tempFilePath, songResponse.data);

    // Read the downloaded file
    const audioBuffer = fs.readFileSync(tempFilePath);

    // Send the audio as a document
    await conn.sendMessage(from, {
      document: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${songDetails.title}.mp3`,
      caption: `> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ\n> Title: ${songDetails.title}\n> Format: ${songDetails.format}`,
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

    // Delete temporary file
    fs.unlinkSync(tempFilePath);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading song:', error);
    reply('❌ Unable to download the song. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
