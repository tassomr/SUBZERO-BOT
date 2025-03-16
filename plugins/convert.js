const { cmd } = require('../command');
const webp = require('node-webpmux');
const fs = require('fs-extra');
const { Sticker } = require("wa-sticker-formatter");
const Config = require('../config');

// Convert Sticker to Image
cmd(
    {
        pattern: 'sticker2img',
        alias: ['s2i', 'stickertoimage','toimg','toimage','tophoto','sticker2image'],
        desc: 'Convert a sticker to an image.',
        category: 'sticker',
        use: '<reply to a sticker>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        if (!mek.quoted) return reply(`*Reply to any sticker.*`);
        let mime = mek.quoted.mtype;

        if (mime === "stickerMessage") {
            let media = await mek.quoted.download();
            let imgBuffer = await webpToImage(media);
            return conn.sendMessage(mek.chat, { image: imgBuffer }, { quoted: mek });
        } else {
            return reply("*Uhh, Please reply to a sticker.*");
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
