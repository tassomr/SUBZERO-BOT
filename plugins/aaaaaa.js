const axios = require("axios");
const { cmd } = require("../command");
const yts = require("yt-search"); // For searching YouTube

cmd(
    {
        pattern: "songa",
        alias: ["mp3a", "ytmp3a"],
        desc: "Download a song from YouTube as MP3.",
        category: "download",
        use: "<song name or YouTube URL>\nExample: .song faded\nExample: .song https://youtu.be/UDSYAD1sQuE",
        filename: __filename,
        react: "🎵"
    },
    async (conn, mek, m, { args, reply, from }) => {
        try {
            const input = args.join(" "); // Combine the query parts

            if (!input) {
                return reply("Please provide a song name or YouTube URL.\nExample: `.song faded`\nExample: `.song https://youtu.be/UDSYAD1sQuE`");
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
            const { title, image, downloadUrl } = response.data.BK9;

            // Send the song to the user
            await conn.sendMessage(
                from,
                {
                    audio: { url: downloadUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${title}.mp3`,
                    caption: `🎵 *Title:* ${title}\n\n> © Gᴇɴᴇʀᴀᴛᴇᴅ ʙʏ Sᴜʙᴢᴇʀᴏ`
                },
                { quoted: mek }
            );

        } catch (error) {
            console.error("Error in song command:", error);
            reply("❌ An error occurred while processing your request. Please try again later.");
        }
    }
);
