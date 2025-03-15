const { cmd } = require('../command');
const config = require('../config');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "setprefix",
    desc: "Change the bot's command prefix.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isOwner, reply }) => {
    // Ensure only the owner can use this command
    if (!isOwner) return reply("*📛 Only the owner can use this command!*");

    // Check if the new prefix is provided
    if (!args[0]) return reply("❌ Please provide a new prefix. Example: `.setprefix !`");

    const newPrefix = args[0].trim();

    // Validate the new prefix (only allow .,?!/,+*)
    const allowedPrefixes = [".", ",", "?", "!", "/", "+", "*"];
    if (!allowedPrefixes.includes(newPrefix)) {
        return reply("❌ Invalid prefix. Allowed prefixes are: `.,?!/,+*`");
    }

    // Update the PREFIX in the config
    config.PREFIX = newPrefix;

    // Save the updated config to the file (if using a config file)
    const configPath = path.join(__dirname, '../config.js'); // Adjust the path as needed
    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const updatedConfigContent = configContent.replace(
            /PREFIX\s*:\s*["'][.,?!/,+*]["']/,
            `PREFIX: "${newPrefix}"`
        );
        fs.writeFileSync(configPath, updatedConfigContent, 'utf8');
    } catch (error) {
        console.error("Error updating config file:", error);
        return reply("❌ Failed to update the prefix in the config file.");
    }

    return reply(`✅ Prefix updated successfully to: *${newPrefix}*`);
});



cmd({
    pattern: "setownernumber",
    desc: "Set or update the owner number for the bot.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isOwner, reply }) => {
    // Ensure only the current owner can use this command
    if (!isOwner) return reply("*📛 Only the current owner can use this command!*");

    // Check if the new owner number is provided
    if (!args[0]) return reply("❌ Please provide a valid phone number. Example: `.setownernumber 18062212660`");

    const newOwnerNumber = args[0].trim();

    // Validate the phone number format (basic validation)
    if (!/^\d{10,15}$/.test(newOwnerNumber)) {
        return reply("❌ Invalid phone number format. Please provide a valid 10-15 digit number.");
    }

    // Update the OWNER_NUMBER in the config
    config.OWNER_NUMBER = newOwnerNumber;

    // Save the updated config to the file (if using a config file)
    const configPath = path.join(__dirname, '../config.js'); // Adjust the path as needed
    try {
        const configContent = fs.readFileSync(configPath, 'utf8');
        const updatedConfigContent = configContent.replace(
            /OWNER_NUMBER\s*:\s*["'\d]+/,
            `OWNER_NUMBER: "${newOwnerNumber}"`
        );
        fs.writeFileSync(configPath, updatedConfigContent, 'utf8');
    } catch (error) {
        console.error("Error updating config file:", error);
        return reply("❌ Failed to update the owner number in the config file.");
    }

    return reply(`✅ Owner number updated successfully to: *${newOwnerNumber}*`);
});
