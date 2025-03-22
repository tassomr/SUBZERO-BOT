const { cmd } = require('../command');
const webp = require('node-webpmux');
const fs = require('fs-extra');
const { Sticker } = require("wa-sticker-formatter");

cmd(
    {
        pattern: 'toimg',
        alias: ['stickertoimg', 'webptojpg', 'webptopng'],
        desc: 'Convert a sticker (webp) to an image (png/jpg).',
        category: 'sticker',
        use: '<reply to a sticker>',
        filename: __filename,
        react: '🖼️'
    },
    async (conn, mek, m, { quoted, reply, from }) => {
        try {
            if (!mek.quoted) return reply(`*Please reply to a sticker.*`);

            // Check if the quoted message is a sticker
            if (mek.quoted.mtype !== "stickerMessage") {
                return reply("*Uhh, Please reply to a sticker.*");
            }

            // Download the sticker
            const stickerBuffer = await mek.quoted.download();

            // Convert webp to image (png/jpg)
            const imageBuffer = await convertWebpToImage(stickerBuffer);

            // Send the converted image
            await conn.sendMessage(
                from,
                { image: imageBuffer, caption: "🖼️ *Here's your image!*\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ" },
                { quoted: mek }
            );

        } catch (error) {
            console.error("Error in toimg command:", error);
            reply("❌ An error occurred while processing your request. Please try again later.");
        }
    }
);

/**
 * Convert a webp buffer to an image buffer (png/jpg).
 * @param {Buffer} webpBuffer - The webp sticker buffer.
 * @returns {Promise<Buffer>} - The converted image buffer.
 */
async function convertWebpToImage(webpBuffer) {
    try {
        // Write the webp buffer to a temporary file
        const tempWebpPath = './temp/temp_sticker.webp';
        const tempImagePath = './temp/temp_image.png';
        await fs.ensureDir('./temp'); // Ensure the temp directory exists
        await fs.writeFile(tempWebpPath, webpBuffer);

        // Use node-webpmux to extract the first frame (for animated stickers)
        const img = new webp.Image();
        await img.load(tempWebpPath);
        const frame = img.frames[0].getImage(); // Get the first frame

        // Write the frame to a temporary image file
        await fs.writeFile(tempImagePath, frame);

        // Read the image file as a buffer
        const imageBuffer = await fs.readFile(tempImagePath);

        // Clean up temporary files
        await fs.remove(tempWebpPath);
        await fs.remove(tempImagePath);

        return imageBuffer;
    } catch (error) {
        console.error("Error converting webp to image:", error);
        throw new Error("Failed to convert sticker to image.");
    }
}
