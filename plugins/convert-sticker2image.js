const { cmd } = require('../command');
const webp = require('node-webpmux');
const fs = require('fs-extra');
const { Sticker } = require("wa-sticker-formatter");
const Config = require('../config');

// Convert Sticker to Image
cmd(
    {
        pattern: 'sticker2img',
        alias: ['s2i', 'stickertoimage'],
        react: '🎆',
        desc: 'Convert a sticker to an image.',
        category: 'sticker',
        use: '<reply to a sticker>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        try {
            if (!mek.quoted) return reply(`*Reply to any sticker.*`);

            // Add a reaction to indicate processing
        //    await conn.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } });

            let mime = mek.quoted.mtype;

            if (mime === "stickerMessage") {
                // Download the sticker
                let media = await mek.quoted.download();

                // Convert WebP to Image
                let imgBuffer = await webpToImage(media);

                // Send the image back to the user
                await conn.sendMessage(mek.chat, { image: imgBuffer }, { quoted: mek });

                // Add a reaction to indicate success
         //       await conn.sendMessage(mek.chat, { react: { text: "✅", key: mek.key } });
            } else {
                return reply("*Uhh, Please reply to a sticker.*");
            }
        } catch (error) {
            console.error("Error in sticker2img command:", error);

            // Add a reaction to indicate failure
       //     await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });

            return reply("*An error occurred while processing the sticker. Please try again later.*");
        }
    }
);

// Function to convert WebP to Image
async function webpToImage(webpBuffer) {
    const img = new webp.Image();
    await img.load(webpBuffer);
    const imageBuffer = await img.getBuffer('image/png'); // You can change 'image/png' to 'image/jpeg' if needed
    return imageBuffer;
}
