const { cmd } = require('../command');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const { exec } = require('child_process');
const { downloadContentFromMessage } = require('@adiwajshing/baileys');
const { Buffer } = require('buffer');
const webp = require('node-webpmux');
const fs = require('fs-extra');
const path = require('path');


cmd(
    {
        pattern: 'toimg',
        alias: ['stickertoimg', 's2i'],
        desc: 'Convert a sticker to an image.',
        category: 'sticker',
        use: '<reply to a sticker>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, reply }) => {
        try {
            // Check if the message is a quoted message and contains a sticker
            if (!mek.quoted) return reply('*Please reply to a sticker.*');
            if (mek.quoted.mtype !== 'stickerMessage') return reply('*This is not a sticker. Please reply to a sticker.*');

            // Ensure the temp directory exists
            const tempDir = path.join(__dirname, '../temp');
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir, { recursive: true });
            }

            // Download the sticker
            const mediaBuffer = await mek.quoted.download();

            // Save the sticker to a temporary file
            const tempFilePath = path.join(tempDir, 'sticker.webp');
            fs.writeFileSync(tempFilePath, mediaBuffer);

            // Convert WebP to PNG using dwebp
            const imageBuffer = await convertWebpToImage(tempFilePath);

            // Send the image to the user
            await conn.sendMessage(mek.chat, { image: imageBuffer }, { quoted: mek });

            // Clean up temporary files
            fs.unlinkSync(tempFilePath);
            fs.unlinkSync(tempFilePath.replace('.webp', '.png'));
        } catch (error) {
            console.error('Error in toimg command:', error);
            reply('❌ Error converting sticker to image. Please try again.');
        }
    }
);

/**
 * Convert WebP to PNG using dwebp
 * @param {string} webpFilePath - Path to the WebP file
 * @returns {Buffer} - Image buffer (PNG format)
 */
async function convertWebpToImage(webpFilePath) {
    return new Promise((resolve, reject) => {
        const outputFilePath = webpFilePath.replace('.webp', '.png');
        exec(`dwebp "${webpFilePath}" -o "${outputFilePath}"`, (err) => {
            if (err) return reject(err);

            // Read the converted PNG file
            const imageBuffer = fs.readFileSync(outputFilePath);
            resolve(imageBuffer);
        });
    });
}



cmd(
    {
        pattern: 'toimg2',
        alias: ['stickertoimg', 's2i'],
        desc: 'Convert a sticker to an image.',
        category: 'sticker',
        use: '<reply to a sticker>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, reply }) => {
        try {
            // Check if the message is a quoted message and contains a sticker
            if (!mek.quoted) return reply('*Please reply to a sticker.*');
            if (mek.quoted.mtype !== 'stickerMessage') return reply('*This is not a sticker. Please reply to a sticker.*');

            // Download the sticker
            const mediaBuffer = await mek.quoted.download();

            // Convert WebP to PNG in memory
            const imageBuffer = await convertWebpToImage(mediaBuffer);

            // Send the image to the user
            await conn.sendMessage(mek.chat, { image: imageBuffer }, { quoted: mek });
        } catch (error) {
            console.error('Error in toimg command:', error);
            reply('❌ Error converting sticker to image. Please try again.');
        }
    }
);

/**
 * Convert WebP to PNG in memory
 * @param {Buffer} webpBuffer - WebP buffer
 * @returns {Buffer} - PNG buffer
 */
async function convertWebpToImage(webpBuffer) {
    return new Promise((resolve, reject) => {
        // Use node-webpmux to extract the first frame (for animated stickers)
        const img = new webp.Image();
        img.load(webpBuffer)
            .then(() => {
                // Extract the first frame (for animated stickers)
                const frame = img.frames[0]?.image || img.image;
                resolve(frame);
            })
            .catch((err) => {
                reject(err);
            });
    });
}
