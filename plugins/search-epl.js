const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "eplstandings",
  alias: ["epltable", "standings"],
  react: '🏆',
  desc: "Get English Premier League standings.",
  category: "sports",
  use: ".eplstandings",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = "https://apis-keith.vercel.app/epl/standings";

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.standings) {
      return reply('❌ Unable to fetch EPL standings. Please try again later.');
    }

    // Extract standings data
    const { competition, standings } = response.data.result;

    // Format the standings into a readable message
    let standingsList = `🏆 *${competition} - Standings* 🏆\n\n`;
    standings.forEach(team => {
      standingsList += `*${team.position}.* ${team.team}\n`;
      standingsList += `📊 *Played:* ${team.played} | *Won:* ${team.won} | *Draw:* ${team.draw} | *Lost:* ${team.lost}\n`;
      standingsList += `⚽ *Goals For:* ${team.goalsFor} | *Goals Against:* ${team.goalsAgainst} | *Goal Difference:* ${team.goalDifference}\n`;
      standingsList += `📈 *Points:* ${team.points}\n\n`;
    });

    // Send the standings list to the user
    await reply(standingsList);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error fetching EPL standings:', error);
    reply('❌ Unable to fetch EPL standings. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


// SUBZERO EPL RESULTS

cmd({
  pattern: "finishedeplmatches",
  alias: ["eplfinished", "eplresults"],
  react: '⚽',
  desc: "Get finished English Premier League matches.",
  category: "sports",
  use: ".finishedEplmatches",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = "https://apis-keith.vercel.app/epl/matches";

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.matches) {
      return reply('❌ Unable to fetch finished matches. Please try again later.');
    }

    // Extract match data
    const { competition, matches } = response.data.result;

    // Filter only finished matches
    const finishedMatches = matches.filter(match => match.status === "FINISHED");

    // Format the matches into a readable message
    let matchList = `⚽ *${competition} - Finished Matches* ⚽\n\n`;
    finishedMatches.forEach((match, index) => {
      matchList += `*Match ${index + 1}:*\n`;
      matchList += `🏠 *Home Team:* ${match.homeTeam}\n`;
      matchList += `🛫 *Away Team:* ${match.awayTeam}\n`;
      matchList += `📅 *Matchday:* ${match.matchday}\n`;
      matchList += `📊 *Score:* ${match.score}\n`;
      matchList += `🏆 *Winner:* ${match.winner}\n\n`;
    });

    // Send the match list to the user
    await reply(matchList);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error fetching finished matches:', error);
    reply('❌ Unable to fetch finished matches. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});


// EPL MATCHES


cmd({
  pattern: "upcomingeplmatches",
  alias: ["eplmatches", "epl"],
  react: '⚽',
  desc: "Get upcoming English Premier League matches.",
  category: "sports",
  use: ".upcomingEplmatches",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    // Add a reaction to indicate processing
    await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

    // Prepare the API URL
    const apiUrl = "https://apis-keith.vercel.app/epl/upcomingmatches";

    // Call the API using GET
    const response = await axios.get(apiUrl);

    // Check if the API response is valid
    if (!response.data || !response.data.status || !response.data.result || !response.data.result.upcomingMatches) {
      return reply('❌ Unable to fetch upcoming matches. Please try again later.');
    }

    // Extract match data
    const { competition, upcomingMatches } = response.data.result;

    // Format the matches into a readable message
    let matchList = `⚽ *${competition} - Upcoming Matches* ⚽\n\n`;
    upcomingMatches.forEach((match, index) => {
      matchList += `*Match ${index + 1}:*\n`;
      matchList += `🏠 *Home Team:* ${match.homeTeam}\n`;
      matchList += `🛫 *Away Team:* ${match.awayTeam}\n`;
      matchList += `📅 *Date:* ${match.date}\n`;
      matchList += `📋 *Matchday:* ${match.matchday}\n\n`;
    });

    // Send the match list to the user
    await reply(matchList);

    // Add a reaction to indicate success
    await conn.sendMessage(from, { react: { text: '✅', key: m.key } });
  } catch (error) {
    console.error('Error fetching upcoming matches:', error);
    reply('❌ Unable to fetch upcoming matches. Please try again later.');

    // Add a reaction to indicate failure
    await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
  }
});
