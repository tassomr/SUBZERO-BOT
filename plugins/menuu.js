const config = require('../config');
const { cmd, commands } = require('../command');
const os = require("os");
const { runtime } = require('../lib/functions');
const axios = require('axios');
const more = String.fromCharCode(8206);
const readMore = more.repeat(4001);
const fs = require('fs');
const path = require('path');

// Global object to track user activity
const activeUsers = {};

// Function to update user activity
function updateUserActivity(userId) {
    activeUsers[userId] = Date.now(); // Store the current timestamp
}

// Function to calculate total online users
function getTotalOnlineUsers() {
    const now = Date.now();
    const threshold = 5 * 60 * 1000; // 5 minutes in milliseconds
    return Object.keys(activeUsers).filter(userId => now - activeUsers[userId] <= threshold).length;
}

// Function to get Harare time
function getHarareTime() {
    return new Date().toLocaleString('en-US', {
        timeZone: 'Africa/Harare',
        hour12: true,
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });
}

// Function to fetch version from package.json
async function fetchVersion() {
    try {
        const packageJsonUrl = 'https://raw.githubusercontent.com/mrfrank-ofc/SUBZERO-BOT/main/package.json';
        const response = await axios.get(packageJsonUrl);
        const packageJson = response.data;
        return packageJson.version || 'Unknown';
    } catch (error) {
        console.error("Error fetching version:", error);
        return 'Unknown';
    }
}

cmd({
    pattern: "usermenu",
    desc: "subzero menu",
    alias: "help",
    category: "menu",
    react: "✅",
    filename: __filename
}, 
async (conn, mek, m, { from, quoted, body, isCmd, command, args, q, isGroup, sender, senderNumber, botNumber2, botNumber, pushname, isMe, isOwner, groupMetadata, groupName, participants, groupAdmins, isBotAdmins, isAdmins, reply }) => {
    try {
        // Update user activity
        updateUserActivity(sender);

        // Fetch version dynamically
        const version = await fetchVersion();

        // Get total online users
        const totalOnlineUsers = getTotalOnlineUsers();

        let dec = `

       \`\`\`${config.BOT_NAME}\`\`\`
    
⟣──────────────────⟢
▧ *ᴄʀᴇᴀᴛᴏʀ* : *ᴍʀ ғʀᴀɴᴋ (🇿🇼)*
▧ *ᴍᴏᴅᴇ* : *${config.MODE}* 
▧ *ᴘʀᴇғɪx* : *${config.PREFIX}*
▧ *ʀᴀᴍ* : ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)}MB / ${Math.round(os.totalmem() / 1024 / 1024)}MB 
▧ *ᴠᴇʀsɪᴏɴ* : *${version}* ⚡
▧ *ᴜᴘᴛɪᴍᴇ* : ${runtime(process.uptime())} 
▧ *ᴏɴʟɪɴᴇ ᴜsᴇʀs* : *${totalOnlineUsers}* 👥
▧ *ᴛɪᴍᴇ* : ${getHarareTime()} ⌛

⟣──────────────────⟢

> ＳＵＢＺＥＲＯ - ＭＤ- ＢＯＴ

⟣──────────────────⟢
${readMore}

... [Rest of the menu content remains unchanged] ...

*━━━━━━━━━━━━━━━━━━━━*⁠⁠⁠⁠
> ＭＡＤＥ ＢＹ ＭＲ ＦＲＡＮＫ
*━━━━━━━━━━━━━━━━━━━━━*
`;

        await conn.sendMessage(
            from,
            {
                image: { url: `https://i.postimg.cc/WpQLCg85/White-and-Green-Simple-Professional-Business-Project-Presentation.jpg` },
                caption: dec,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363304325601080@newsletter',
                        newsletterName: '📑『 𝐒𝐔𝐁𝐙𝐄𝐑𝐎 𝐌𝐃 』📑',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send audio
        await conn.sendMessage(from, {
            audio: { url: 'https://github.com/mrfrank-ofc/SUBZERO-MD-DATABASE/raw/refs/heads/main/audios/subzero-menu.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek });
        
    } catch (e) {
        console.log(e);
        reply(`${e}`);
    }
});
