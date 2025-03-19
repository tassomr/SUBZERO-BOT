const { cmd } = require("../command");
const yts = require("yt-search");
const { ytdl } = require("@dark-yasiya/yt-dl.js");
const scrap = require("@dark-yasiya/scrap");
const fs = require("fs");
const path = require("path");

cmd({
  pattern: "scrap",
  alias: ["song", "mp3", "music"],
  react: '🎵',
  desc: "Download songs from YouTube using scraping.",
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

    // Scrape YouTube video details
    const videoInfo = await scrap.youtube(videoUrl);
    if (!videoInfo || !videoInfo.videoDetails) {
      return reply('❌ Unable to fetch video details. Please try again later.');
    }

    // Extract video details
    const title = videoInfo.videoDetails.title || "Unknown";
    const artist = videoInfo.videoDetails.author?.name || "Unknown";
    const duration = videoInfo.videoDetails.lengthSeconds || "Unknown";

    // Inform the user that the song is being downloaded
    await reply(`🎵 *Downloading ${title}...*`);

    // Download audio using ytdl
    const audioStream = await ytdl(videoUrl, { filter: 'audioonly', quality: 'highestaudio' });
    if (!audioStream) {
      return reply('❌ Failed to download the song. Please try again later.');
    }

    // Save the downloaded file temporarily
    const tempFilePath = path.join(__dirname, `${title}.mp3`);
    const writeStream = fs.createWriteStream(tempFilePath);
    audioStream.pipe(writeStream);

    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Read the downloaded file
    const audioBuffer = fs.readFileSync(tempFilePath);

    // Send the audio as a document
    await conn.sendMessage(from, {
      document: audioBuffer,
      mimetype: 'audio/mpeg',
      fileName: `${title}.mp3`,
      caption: `> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ\n> Title: ${title}\n> Artist: ${artist}\n> Duration: ${duration}s`,
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
