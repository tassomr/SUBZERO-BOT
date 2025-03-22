const axios = require("axios");
const { cmd } = require("../command");
const yts = require("yt-search"); // For searching YouTube
const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

cmd(
    {
        pattern: "songa",
        alias: ["mp3a", "ytmp3a"],
        desc: "Download a song from YouTube as MP3 (compressed).",
        category: "download",
        use: "<song name or YouTube URL>\nExample: .songa faded\nExample: .songa https://youtu.be/UDSYAD1sQuE",
        filename: __filename,
        react: "🎵"
    },
    async (conn, mek, m, { args, reply, from }) => {
        try {
            const input = args.join(" "); // Combine the query parts

            if (!input) {
                return reply("Please provide a song name or YouTube URL.\nExample: `.songa faded`\nExample: `.songa https://youtu.be/UDSYAD1sQuE`");
            }

            let youtubeUrl;

            // Check if the input is a YouTube URL
            if (input.startsWith("http://") || input.startsWith("https://")) {
                youtubeUrl = input;
            } else {
                // Search YouTube for the song
                const searchResults = await yts(input);
                if (!searchResults || searchResults.videos.length === 0) {
                    return reply("❌ No results found for your query. Please try again.");
                }
                youtubeUrl = searchResults.videos[0].url; // Get the first result's URL
            }

            // Call the API to fetch song details and download link
            const apiUrl = `https://bk9.fun/download/ytmp3?url=${encodeURIComponent(youtubeUrl)}&type=mp3`;
            const response = await axios.get(apiUrl);

            // Log the API response for debugging
            console.log("API Response:", response.data);

            // Check if the API response is valid
            if (!response.data || !response.data.status || !response.data.BK9 || !response.data.BK9.downloadUrl) {
                return reply("❌ Unable to fetch the song. Please check the URL and try again.");
            }

            // Extract song details
            const { title, downloadUrl } = response.data.BK9;

            // Download the song
            const tempDir = "./temp";
            const originalFilePath = path.join(tempDir, `${title}_original.mp3`);
            const compressedFilePath = path.join(tempDir, `${title}_compressed.mp3`);

            // Ensure the temp directory exists
            if (!fs.existsSync(tempDir)) {
                fs.mkdirSync(tempDir);
            }

            // Download the original MP3 file
            const audioResponse = await axios({
                method: "get",
                url: downloadUrl,
                responseType: "stream"
            });

            const writer = fs.createWriteStream(originalFilePath);
            audioResponse.data.pipe(writer);

            await new Promise((resolve, reject) => {
                writer.on("finish", resolve);
                writer.on("error", reject);
            });

            // Compress the MP3 file using FFmpeg
            await new Promise((resolve, reject) => {
                exec(
                    `ffmpeg -i "${originalFilePath}" -b:a 64k "${compressedFilePath}"`,
                    (error, stdout, stderr) => {
                        if (error) {
                            console.error("FFmpeg error:", error);
                            reject("❌ Failed to compress the audio file.");
                        } else {
                            resolve();
                        }
                    }
                );
            });

            // Send the compressed song to the user
            await conn.sendMessage(
                from,
                {
                    audio: fs.readFileSync(compressedFilePath),
                    mimetype: "audio/mpeg",
                    fileName: `${title}_compressed.mp3`,
                    caption: `🎵 *Title:* ${title}\n📦 *Compressed to 64kbps*\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`
                },
                { quoted: mek }
            );

            // Clean up temporary files
            fs.unlinkSync(originalFilePath);
            fs.unlinkSync(compressedFilePath);

        } catch (error) {
            console.error("Error in songa command:", error);
            reply("❌ An error occurred while processing your request. Please try again later.");
        }
    }
);
