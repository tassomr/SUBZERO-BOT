const { cmd, commands } = require('../command');

cmd({
    pattern: "save1",
    alias: ['get1'],
    desc: "Save or forward a status update to your chat.",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, quoted }) => {
    try {
        // Check if the user replied to a message
        if (!quoted) {
            return reply("Please reply to a status update with `.save` or `.get`.");
        }

        // Check if the quoted message is a status update
        if (quoted.key.remoteJid !== 'status@broadcast') {
            return reply("This is not a status update. Please reply to a status update.");
        }

        // Forward the status update based on its type
        if (quoted.message.imageMessage) {
            const imageUrl = await conn.downloadAndSaveMediaMessage(quoted.message.imageMessage);
            await conn.sendMessage(from, { image: { url: imageUrl }, caption: quoted.message.imageMessage.caption || '' }, { quoted: mek });
        } else if (quoted.message.videoMessage) {
            const videoUrl = await conn.downloadAndSaveMediaMessage(quoted.message.videoMessage);
            await conn.sendMessage(from, { video: { url: videoUrl }, caption: quoted.message.videoMessage.caption || '' }, { quoted: mek });
        } else if (quoted.message.extendedTextMessage) {
            await conn.sendMessage(from, { text: quoted.message.extendedTextMessage.text }, { quoted: mek });
        } else {
            return reply("Unsupported status update type. Only images, videos, and text are supported.");
        }
    } catch (e) {
        console.error("Error in save/get command:", e);
        reply("An error occurred while processing your request.");
    }
});
