const axios = require("axios");
const yts = require("yt-search");
const ffmpeg = require("fluent-ffmpeg");
const { cmd } = require("../command");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "song3",
  alias: ["ytmp3v3", "david", "musicv3"],
  react: '🎵',
  desc: "Download songs from YouTube using David Cyril Tech API.",
  category: "download",
  use: ".song3 <YouTube URL or song name>",
  filename: __filename
}, async (conn, mek, m, { from, reply, args, q }) => {
  try {
    // Check if the user provided a query
    if (!q) {
      return reply('Please provide a YouTube URL or song name. Example: `.song3 https://youtube.com/...` or `.song3 Dance Monkey`');
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

    // Prepare the David Cyril Tech API URL
    const apiUrl = `https://apis.davidcyriltech.my.id/youtube/mp3?url=${encodeURIComponent(videoUrl)}`;

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.success || !response.data.result || !response.data.result.downloadUrl) {
      return reply('❌ Unable to fetch the song. Please try again later.');
    }

    // Extract the download link and song details
    const downloadUrl = response.data.result.downloadUrl;
    const songDetails = {
      title: response.data.result.title || "Unknown",
      artist: "Unknown", // API does not provide artist info
      duration: "Unknown", // API does not provide duration
      size: "Unknown" // API does not provide file size
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

    // Compress the audio using ffmpeg
    const compressedFilePath = path.join(__dirname, `${songDetails.title}_compressed.mp3`);
    await new Promise((resolve, reject) => {
      ffmpeg(tempFilePath)
        .audioBitrate(128) // Set audio bitrate to 128kbps
        .output(compressedFilePath)
        .on('end', resolve)
        .on('error', reject)
        .run();
    });

    // Read the compressed file
    const compressedBuffer = fs.readFileSync(compressedFilePath);

    // Send the compressed song as a document
    await conn.sendMessage(from, {
      document: compressedBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${songDetails.title}.mp3`,
      caption: `> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ\n> Title: ${songDetails.title}`,
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

    // Delete temporary files
    fs.unlinkSync(tempFilePath);
    fs.unlinkSync(compressedFilePath);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error downloading song:', error);
    reply('❌ Unable to download the song. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
