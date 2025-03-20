const fs = require('fs');
const acrcloud = require('acrcloud');
const { cmd } = require('../command');
const config = require('../config');

// Initialize ACRCloud
const acr = new acrcloud({
  host: 'identify-eu-west-1.acrcloud.com',
  access_key: '716b4ddfa557144ce0a459344fe0c2c9',
  access_secret: 'Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf'
});

cmd({
  pattern: "shazam2",
  alias: ["find2", "whatmusic"],
  react: '🎵',
  desc: "Identify songs using Shazam-like functionality.",
  category: "tools",
  use: ".shazam <quote an audio or video message>",
  filename: __filename
}, async (conn, mek, m, { from, reply, quoted, isQuoted }) => {
  try {
    // Check if the message is quoted and contains audio or video
    if (!isQuoted || (quoted.mtype !== 'audioMessage' && quoted.mtype !== 'videoMessage')) {
      return reply('You asked about music. Please provide a quoted audio or video message for identification.');
    }

    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Download the quoted media
    const media = await conn.downloadMediaMessage(quoted);
    const filePath = `./${Date.now()}.mp3`;
    fs.writeFileSync(filePath, media);

    // Inform the user that the song is being identified
    await reply('Identifying the music, please wait...');

    // Identify the song using ACRCloud
    const res = await acr.identify(fs.readFileSync(filePath));
    const { code, msg } = res.status;

    if (code !== 0) {
      throw new Error(msg);
    }

    // Extract song details
    const { title, artists, album, genres, release_date } = res.metadata.music[0];
    const txt = `
𝚁𝙴𝚂𝚄𝙻𝚃 
• 📌 *TITLE*: ${title}
• 👨‍🎤 𝙰𝚁𝚃𝙸𝚂𝚃: ${artists ? artists.map(v => v.name).join(', ') : 'NOT FOUND'}
• 💾 𝙰𝙻𝙱𝚄𝙼: ${album ? album.name : 'NOT FOUND'}
• 🌐 𝙶𝙴𝙽𝚁𝙴: ${genres ? genres.map(v => v.name).join(', ') : 'NOT FOUND'}
• 📆 RELEASE DATE: ${release_date || 'NOT FOUND'}
`.trim();

    // Delete the temporary file
    fs.unlinkSync(filePath);

    // Send the result to the user
    await reply(txt);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error identifying song:', error);
    reply('❌ An error occurred during music identification.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
