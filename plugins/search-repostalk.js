const { cmd } = require('../command');
const axios = require('axios');
const Config = require('../config');

cmd(
    {
        pattern: 'repostalk',
        alias: ['reposearch', 'gitrepo'],
        desc: 'Get information about a GitHub repository',
        category: 'utility',
        use: '<github-repo-url>',
        filename: __filename,
    },
    async (conn, mek, m, { quoted, args, q, reply, from }) => {
        try {
            if (!q) return reply('*Please provide a GitHub repository URL*\nExample: .repostalk https://github.com/mrfrank-ofc/SUBZERO-BOT');

            // Extract repo URL from message
            let repoUrl = q.trim();
            if (!repoUrl.startsWith('http')) {
                repoUrl = 'https://github.com/' + repoUrl;
            }

            // Send processing reaction
            await conn.sendMessage(mek.chat, { react: { text: "⏳", key: mek.key } });

            // Call BK9 API
            const apiUrl = `https://bk9.fun/stalk/githubrepo?url=${encodeURIComponent(repoUrl)}`;
            const response = await axios.get(apiUrl);
            
            if (!response.data.status) {
                return reply('*Failed to fetch repository information*');
            }

            const repoData = response.data.BK9;
            const ownerData = repoData.owner;

            // Format the response
            const message = `
📂 *Repository Information* 📂

🔹 *Name:* ${repoData.name}
🔹 *Owner:* [${ownerData.login}](${ownerData.html_url})
🔹 *Description:* ${repoData.description || 'No description'}
🔹 *Stars:* ⭐ ${repoData.stargazers_count}
🔹 *Forks:* 🍴 ${repoData.forks_count}
🔹 *Watchers:* 👀 ${repoData.watchers_count}
🔹 *Open Issues:* ⚠️ ${repoData.open_issues_count}
🔹 *Language:* ${repoData.language || 'Not specified'}
🔹 *Created At:* ${new Date(repoData.created_at).toLocaleDateString()}
🔹 *Last Updated:* ${new Date(repoData.updated_at).toLocaleDateString()}

🌐 *Links:*
- [Repository](${repoData.html_url})
- [Owner Profile](${ownerData.html_url})

📊 *Stats:*
- Size: ${repoData.size} KB
- Default Branch: ${repoData.default_branch}
- ${repoData.private ? '🔒 Private' : '🔓 Public'}
${repoData.archived ? '\n⚠️ This repository is archived' : ''}
            `;

            // Send owner avatar along with the message
            await conn.sendMessage(mek.chat, {
                image: { url: ownerData.avatar_url },
                caption: message,
            }, { quoted: mek });

            // Send success reaction
            await conn.sendMessage(mek.chat, { react: { text: "✅", key: mek.key } });

        } catch (error) {
            console.error('Error in repostalk command:', error);
            await conn.sendMessage(mek.chat, { react: { text: "❌", key: mek.key } });
            reply('*Error fetching repository information. Please check the URL and try again.*');
        }
    }
);
