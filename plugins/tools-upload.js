const config = require('../config');
const { cmd, commands } = require('../command');
const axios = require('axios'); // For making HTTP requests
const FormData = require('form-data'); // For file uploads
const fs = require('fs'); // For handling file system operations
const path = require('path'); // For handling file paths

cmd({
  pattern: 'upload',
  react: '📤',
  desc: 'Upload media (images/videos) to file.io and get the URL',
  category: 'utility',
  filename: __filename
}, async (conn, mek, m, {
  body,
  from,
  quoted,
  isCmd,
  command,
  args,
  q,
  isGroup,
  sender,
  senderNumber,
  botNumber2,
  botNumber,
  pushname,
  isMe,
  isOwner,
  groupMetadata,
  groupName,
  participants,
  groupAdmins,
  isBotAdmins,
  isAdmins,
  reply
}) => {
    // Check if the quoted message is an image or video
    if (!quoted || !(quoted.mimetype.startsWith('image') || !quoted.mimetype.startsWith('video'))) {
        return reply(`❌ Reply to an image or video to upload it.`);
    }

    try {
        // Download the media
        const media = await quoted.download();
        const fileType = quoted.mimetype.split('/')[1]; 

        // Save the media temporarily
        const tempFilePath = path.join(__dirname, `temp_media.${fileType}`);
        fs.writeFileSync(tempFilePath, media);

        // Upload the media to file.io
        const formData = new FormData();
        formData.append('file', fs.createReadStream(tempFilePath));

        const uploadResponse = await axios.post('https://file.io', formData, {
            headers: formData.getHeaders()
        });

        // Delete the temporary file
        fs.unlinkSync(tempFilePath);

        if (!uploadResponse.data || !uploadResponse.data.success) {
            return reply(`❌ Failed to upload media to file.io. Response: ${JSON.stringify(uploadResponse.data)}`);
        }

        const fileUrl = uploadResponse.data.link;
        console.log('Media uploaded to file.io. URL:', fileUrl); // Debugging

        // Send the file URL back to the user
        await reply(`✅ *Media Uploaded Successfully!*\n\n🔗 *URL:* ${fileUrl}\n\n⚠️ *Note:* This link will expire after 14 days.`);

    } catch (error) {
        console.error('Error in upload command:', error);
        reply(`❌ Error: ${error.message}`);
    }
});
