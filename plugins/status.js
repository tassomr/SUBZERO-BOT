const { cmd, commands } = require('../command');
const fs = require('fs');
const path = require('path');

// Temporary storage for status updates
let statusCache = {};

cmd({
    pattern: "save1",
    alias: ['get1'],
    desc: "Save or forward a status update to your chat.",
    category: "misc",
    filename: __filename
},
async (conn, mek, m, { from, reply, sender, isGroup }) => {
    try {
        // Check if the user has a cached status update
        if (!statusCache[sender]) {
            return reply("No status update found. Please view a status update first.");
        }

        const status = statusCache[sender];

        // Forward the status update to the user's chat
        if (status.type === 'image') {
            await conn.sendMessage(from, { image: { url: status.url }, caption: status.caption }, { quoted: mek });
        } else if (status.type === 'video') {
            await conn.sendMessage(from, { video: { url: status.url }, caption: status.caption }, { quoted: mek });
        } else if (status.type === 'text') {
            await conn.sendMessage(from, { text: status.text }, { quoted: mek });
        }

        // Clear the cached status update
        delete statusCache[sender];
    } catch (e) {
        console.error("Error in save/get command:", e);
        reply("An error occurred while processing your request.");
    }
});

// Listen for status updates
conn.ev.on('messages.upsert', async (mek) => {
    const message = mek.messages[0];
    if (!message.message) return;

    // Check if the message is a status update
    if (message.key.remoteJid === 'status@broadcast') {
        const sender = message.key.participant || message.key.remoteJid;

        // Cache the status update
        if (message.message.imageMessage) {
            statusCache[sender] = {
                type: 'image',
                url: await conn.downloadAndSaveMediaMessage(message.message.imageMessage),
                caption: message.message.imageMessage.caption || ''
            };
        } else if (message.message.videoMessage) {
            statusCache[sender] = {
                type: 'video',
                url: await conn.downloadAndSaveMediaMessage(message.message.videoMessage),
                caption: message.message.videoMessage.caption || ''
            };
        } else if (message.message.extendedTextMessage) {
            statusCache[sender] = {
                type: 'text',
                text: message.message.extendedTextMessage.text
            };
        }

        // Notify the user
        await conn.sendMessage(sender, { text: "Status update detected! Type `.save` or `.get` to forward it to your chat." });
    }
});
