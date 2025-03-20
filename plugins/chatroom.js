/* const { cmd } = require('../command');
const axios = require('axios');
const fs = require('fs-extra');
const Config = require('../config');

// Play.ht API credentials
const PLAY_HT_USER_ID = 'cyoWP5uRqJTEVsYUJCFWM2GFiWs1'; // Replace with your Play.ht User ID
const PLAY_HT_API_KEY = '01c6fc42e662484888d505c27dad6c3f'; // Replace with your Play.ht API Key

// Cache for storing available voices
let voicesCache = [];

// Text-to-Speech Command
cmd(
    {
        pattern: 'playai',
        alias: ['playht', 'speak'],
        desc: 'Convert text to speech using Play.ht.',
        category: 'utility',
        use: '<text>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        try {
            if (!q) return reply(`*Please provide text to convert to speech.*\nExample: .tts Hello, how are you?`);

            // Step 1: Fetch available voices (if not already cached)
            if (voicesCache.length === 0) {
                await fetchVoices();
            }

            // Step 2: List available voices to the user
            let voiceList = "🎤 *Available Voices:*\n";
            voicesCache.forEach((voice, index) => {
                voiceList += `${index + 1}. ${voice.name} (${voice.gender})\n`;
            });
            voiceList += "\n*Reply with the number of the voice you want to use.*";

            await reply(voiceList);

            // Step 3: Wait for the user to reply with a voice number
            const voiceNumber = await waitForUserResponse(mek.chat, from);
            if (isNaN(voiceNumber) return reply("*Invalid voice number. Please try again.*");

            const selectedVoice = voicesCache[voiceNumber - 1];
            if (!selectedVoice) return reply("*Invalid voice selection. Please try again.*");

            // Step 4: Convert text to speech using the selected voice
            const audioUrl = await convertTextToSpeech(q, selectedVoice.voiceId);

            // Step 5: Download the audio file and send it to the user
            const audioBuffer = await downloadAudio(audioUrl);
            await conn.sendMessage(mek.chat, { audio: audioBuffer, mimetype: 'audio/mpeg' }, { quoted: mek });

        } catch (error) {
            console.error("Error in tts command:", error);
            reply("*An error occurred while processing your request. Please try again later.*");
        }
    }
);

// Function to fetch available voices from Play.ht
async function fetchVoices() {
    const response = await axios.get('https://api.play.ht/api/v2/voices', {
        headers: {
            'Authorization': `Bearer ${PLAY_HT_API_KEY}`,
            'X-User-ID': PLAY_HT_USER_ID,
        },
    });
    voicesCache = response.data;
}

// Function to convert text to speech using Play.ht
async function convertTextToSpeech(text, voiceId) {
    const response = await axios.post(
        'https://api.play.ht/api/v2/tts',
        {
            text: text,
            voice: voiceId,
        },
        {
            headers: {
                'Authorization': `Bearer ${PLAY_HT_API_KEY}`,
                'X-User-ID': PLAY_HT_USER_ID,
                'Content-Type': 'application/json',
            },
        }
    );
    return response.data.audioUrl;
}

// Function to download the audio file
async function downloadAudio(url) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data, 'binary');
}

// Function to wait for user response
function waitForUserResponse(chatId, userId) {
    return new Promise((resolve) => {
        const listener = (response) => {
            if (response.chat === chatId && response.from === userId) {
                conn.off('message', listener); // Remove the listener
                resolve(parseInt(response.text.trim()));
            }
        };
        conn.on('message', listener);
    });
}
*/
