function parseSummonerName(playerInfo, json) {
    playerInfo["id"] = json["id"];
    playerInfo["accountId"] = json["accountId"];
    playerInfo["puuid"] = json["puuid"];
    playerInfo["summonerLevel"] = json["summonerLevel"];
    playerInfo["name"] = json["name"];
}

function parseSummonerInfo(playerInfo, json) {
    playerInfo["queueType"] = json[0]["queueType"];
    playerInfo["tier"] = json[0]["tier"];
    playerInfo["rank"] = json[0]["rank"];
    playerInfo["leaguePoints"] = json[0]["leaguePoints"];
    playerInfo["wins"] = json[0]["wins"];
    playerInfo["losses"] = json[0]["losses"];
    playerInfo["veteran"] = json[0]["veteran"];
    playerInfo["inactive"] = json[0]["inactive"];
    playerInfo["freshBlood"] = json[0]["freshBlood"];
    playerInfo["hotStreak"] = json[0]["hotStreak"];
}

function parseSummonerMatchesIds(playerInfo, json) {
    playerInfo['matchIds'] = {};
    for (let i = 0; i < json.length; i++) {
        playerInfo['matchIds'][i] = json[i];
    }
}

function parseMatchInfo(playerInfo, json) {
    let curObj = {};
    curObj['gameDuration'] = json['info']['gameDuration'];
    curObj['gameCreation'] = json['info']['gameCreation'];
    curObj['gameStartTimestamp'] = json['info']['gameStartTimestamp'];
    curObj['queueId'] = json['info']['queueId'];

    // Parse the players
    curObj['allPlayers'] = [{}];
    for (let i = 0; i < json['info']['participants'].length; i++) {
        curObj['allPlayers'][i] = {
            'championName': json['info']['participants'][i]['championName'],
            'summonerName': json['info']['participants'][i]['summonerName'],
            "kills": json['info']['participants'][i]['kills'],
            "deaths": json['info']['participants'][i]['deaths'],
            "assists": json['info']['participants'][i]['assists'],
            "cs": json['info']['participants'][i]['totalMinionsKilled'] + json['info']['participants'][i]['neutralMinionsKilled'],
            "totalDamageDealtToChampions": json['info']['participants'][i]['totalDamageDealtToChampions'],
            "goldEarned": json['info']['participants'][i]['goldEarned'],
            "win": json['info']['participants'][i]['win'],
            "champLevel": json['info']['participants'][i]['champLevel'],
        };
    }
    playerInfo['matchesInfo'].push(curObj);
}

module.exports = {
    parseSummonerName: parseSummonerName,
    parseSummonerInfo: parseSummonerInfo,
    parseSummonerMatchesIds: parseSummonerMatchesIds,
    parseMatchInfo: parseMatchInfo
}