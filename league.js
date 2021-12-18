const fetch = require('node-fetch');
const parser = require('./parser');
require('dotenv').config();

const api_key = process.env.API_KEY;
const api_link1 = "https://na1.api.riotgames.com";
const api_link2 = "https://americas.api.riotgames.com";
const headers = new fetch.Headers({
    "X-Riot-Token": api_key,
});

const maxPrevMatches = 10;

// All the GET calls to league's api
// We get the player profile, league rank & stats, and matches here
async function getAllSummonerInfo(name) {
    let playerInfo = {};

    await getSummonerByName(name)
        .then(res => res.json()
            .then(data => parser.parseSummonerName(playerInfo, data)))
        .catch(e => console.log(`Error when getting summoner by name. Error msg: ${e}`));

    if (playerInfo == null || playerInfo['id'] == null) {
        return;
    }

    await getSummonerExtraInfo(playerInfo['id'])
        .then(res => res.json()
            .then(data => parser.parseSummonerInfo(playerInfo, data)))
        .catch(e => console.log(`Error when getting summoner info by name. Error msg: ${e}`));

    await getPreviousSummonerMatches(0, maxPrevMatches, playerInfo['puuid'])
        .then(res => res.json()
            .then(data => parser.parseSummonerMatchesIds(playerInfo, data)))
        .catch(e => console.log(`Error when getting summoner matches by puuid. Error msg: ${e}`));

    playerInfo['matchesInfo'] = [];
    // Grab recent matches
    for (let i = 0; i < maxPrevMatches; i++) {
        await getMatchInfo(playerInfo["matchIds"][i])
            .then(res => res.json()
                .then(data => parser.parseMatchInfo(playerInfo, data)))
            .catch(e => console.log(`Error when getting a match by matchId. Error msg: ${e}`))
    }

    return playerInfo;
}

// Grabs getSummonerByName() & getSummonerExtraInfo
async function getSummonerProfile(name) {
    let playerInfo = {};

    await getSummonerByName(name)
        .then(res => res.json()
            .then(data => parser.parseSummonerName(playerInfo, data)))
        .catch(e => console.log(`Error when getting summoner by name. Error msg: ${e}`));

    if (playerInfo == null || playerInfo['id'] == null) {
        return;
    }

    await getSummonerExtraInfo(playerInfo['id'])
        .then(res => res.json()
            .then(data => parser.parseSummonerInfo(playerInfo, data)))
        .catch(e => console.log(`Error when getting summoner info by name. Error msg: ${e}`));

    return playerInfo;
}

async function getSummonerByName(name) {
    return await fetch(api_link1 + `/lol/summoner/v4/summoners/by-name/${name}`, {
        method: 'GET',
        headers: headers
    });
}

async function getSummonerExtraInfo(id) {
    return await fetch(api_link1 + `/lol/league/v4/entries/by-summoner/${id}`, {
        method: 'GET',
        headers: headers
    });
}

async function getPreviousSummonerMatches(start, end, puuid) {
    // This one needs americas.api.riotgames.com instead of that na1.api.riotgames.com
    return await fetch(api_link2 + `/lol/match/v5/matches/by-puuid/${puuid}/ids?start=${start}&count=${end}`, {
        method: 'GET',
        headers: headers
    });
}

async function getMatchInfo(matchId) {
    // This one needs americas.api.riotgames.com instead of that na1.api.riotgames.com
    return await fetch(api_link2 + `/lol/match/v5/matches/${matchId}`, {
        method: 'GET',
        headers: headers
    });
}

// Make these visible for other files
module.exports = {
    getAllSummonerInfo: getAllSummonerInfo,
    getSummonerProfile: getSummonerProfile
}