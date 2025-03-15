/* const fs = require('fs');
const path = require('path');
const { cmd } = require('./command'); // Import command handler
const config = require('./config'); // Import config file

// Path to the shared file for tracking bot activity
const botActivityFile = path.join(__dirname, '../bot_activity.json');

// Function to read bot activity from the file
function readBotActivity() {
    if (!fs.existsSync(botActivityFile)) {
        fs.writeFileSync(botActivityFile, JSON.stringify({})); // Create file if it doesn't exist
    }
    return JSON.parse(fs.readFileSync(botActivityFile, 'utf8'));
}

// Function to update bot activity in the file
function updateBotActivity(botId, status) {
    const activity = readBotActivity();
    activity[botId] = status; // Update the bot's status
    fs.writeFileSync(botActivityFile, JSON.stringify(activity, null, 2));
}

// Function to send a message to the developer
async function sendToDeveloper(conn, message) {
    await conn.sendMessage(config.DEVELOPER_NUMBER, { text: message });
}

// Echo command handler
cmd({
    pattern: "echo",
    desc: "Send an echo response to the developer from all bots.",
    category: "utility",
    filename: __filename,
}, async (conn, mek, m, { from, sender, reply }) => {
    const botId = conn.user.id.split(':')[0]; // Get the bot's ID

    // Update bot activity
    updateBotActivity(botId, 'active');

    // Notify all bots to send an echo to the developer
    const activity = readBotActivity();
    for (const [otherBotId, status] of Object.entries(activity)) {
        if (status === 'active' && otherBotId !== botId) {
            // Simulate sending a message to other bots (replace with actual inter-bot communication)
            await sendToDeveloper(conn, `Echo from bot ${otherBotId}`);
        }
    }

    // Send echo response from this bot to the developer
    await sendToDeveloper(conn, `Echo from bot ${botId}`);

    // Notify the user
    return reply("Echo sent to the developer from all bots!");
});

// Periodically check bot activity (optional)
setInterval(async () => {
    const conn = require('../lib/connection'); // Import connection file
    const activity = readBotActivity();
    let activeBots = [];

    for (const [botId, status] of Object.entries(activity)) {
        if (status === 'active') {
            activeBots.push(botId);
        }
    }

    if (activeBots.length > 0) {
        await sendToDeveloper(conn, `Active bots: ${activeBots.join(', ')}`);
    }
}, 60000); // Check every 60 seconds
*/
