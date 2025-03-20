const config = require('../config');
const acrcloud = require("acrcloud");
const { cmd, commands } = require('../command');
const { fetchJson } = require('../lib/functions');

cmd({
  pattern: 'shazam2',
  alias: ['find2'],
  react: '🔎',
  desc: 'Identify a song.',
  category: 'music',
  filename: __filename
}, async (conn, mek, m, {
  from,
  quoted,
  body,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
  try {
    if (!quoted) return reply('Please tag a song/audio for the AI to identify.');

    
    
    let buffer = await m.quoted.download();

    const acr = new acrcloud({
      host: 'identify-eu-west-1.acrcloud.com',
      access_key: '716b4ddfa557144ce0a459344fe0c2c9',
      access_secret: 'Lz75UbI8g6AzkLRQgTgHyBlaQq9YT5wonr3xhFkf'
    });

    let { status, metadata } = await acr.identify(buffer);
    if (status.code !== 0) return reply(status.msg);

    let { title, artists, album, genres, release_date } = metadata.music[0];
    let txt = `*📑 Title:* ${title}${artists ? ` ${album.name}` : ''}${genres ? `\n*🎀 Genres:* ${genres.map(v => v.name).join(', ')}` : ''}\n`;
    txt += `*🕐 Release Date:* ${release_date}`;
    return reply(`*🔎 SUBZERO SONG IDENTIFYER 🔎*:\n\n${txt}`);
  } catch (error) {
    console.error(error);
    reply(`An error occurred: ${error.message}`);
  }
});
