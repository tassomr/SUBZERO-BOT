const { cmd } = require('../command');
const config = require('../config'); // Ensure this is the correct path to your config file
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "setprefix",
    alias: "changeprefix",
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

    // Update the PREFIX in the runtime config
    config.PREFIX = newPrefix;

    // Save the updated config to the file
    const configPath = path.join(__dirname, '../config.js'); // Adjust the path as needed
    try {
        // Read the config file
        let configContent = fs.readFileSync(configPath, 'utf8');

        // Update the PREFIX variable in the config file
        const updatedConfigContent = configContent.replace(
            /PREFIX\s*:\s*["'][.,?!/,+*]["']/, // Match the current PREFIX value
            `PREFIX: "${newPrefix}"` // Replace with the new PREFIX value
        );

        // Write the updated content back to the config file
        fs.writeFileSync(configPath, updatedConfigContent, 'utf8');

        // Notify the user
        return reply(`✅ Prefix updated successfully to: *${newPrefix}*`);
    } catch (error) {
        console.error("Error updating config file:", error);
        return reply("❌ Failed to update the prefix in the config file.");
    }
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

    // Update the OWNER_NUMBER in the runtime config
    config.OWNER_NUMBER = newOwnerNumber;

    // Save the updated config to the file
    const configPath = path.join(__dirname, '../config.js'); // Adjust the path as needed
    try {
        // Read the config file
        let configContent = fs.readFileSync(configPath, 'utf8');

        // Update the OWNER_NUMBER variable in the config file
        const updatedConfigContent = configContent.replace(
            /OWNER_NUMBER\s*:\s*["'\d]+/, // Match the current OWNER_NUMBER value
            `OWNER_NUMBER: "${newOwnerNumber}"` // Replace with the new OWNER_NUMBER value
        );

        // Write the updated content back to the config file
        fs.writeFileSync(configPath, updatedConfigContent, 'utf8');

        // Notify the user
        return reply(`✅ Owner number updated successfully to: *${newOwnerNumber}*`);
    } catch (error) {
        console.error("Error updating config file:", error);
        return reply("❌ Failed to update the owner number in the config file.");
    }
});



cmd({
    pattern: "setownername",
    desc: "Set or update the owner name for the bot.",
    category: "settings",
    filename: __filename,
}, async (conn, mek, m, { from, args, isOwner, reply }) => {
    // Ensure only the current owner can use this command
    if (!isOwner) return reply("*📛 Only the current owner can use this command!*");

    // Check if the new owner name is provided
    if (!args[0]) return reply("❌ Please provide a new owner name. Example: `.setownername Mr Frank`");

    const newOwnerName = args.join(' ').trim(); // Join all arguments to allow spaces in the name

    // Update the OWNER_NAME in the runtime config
    config.OWNER_NAME = newOwnerName;

    // Save the updated config to the file
    const configPath = path.join(__dirname, '../config.js'); // Adjust the path as needed
    try {
        // Read the config file
        let configContent = fs.readFileSync(configPath, 'utf8');

        // Update the OWNER_NAME variable in the config file
        const updatedConfigContent = configContent.replace(
            /OWNER_NAME\s*:\s*["'][^"']*["']/, // Match the current OWNER_NAME value
            `OWNER_NAME: "${newOwnerName}"` // Replace with the new OWNER_NAME value
        );

        // Write the updated content back to the config file
        fs.writeFileSync(configPath, updatedConfigContent, 'utf8');

        // Notify the user
        return reply(`✅ Owner name updated successfully to: *${newOwnerName}*`);
    } catch (error) {
        console.error("Error updating config file:", error);
        return reply("❌ Failed to update the owner name in the config file.");
    }
});
