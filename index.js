const fetch = require('node-fetch');
const ChampionScraper = require('./champion-scraper');

(async function () {
    const urlBase = 'https://leagueoflegends.fandom.com';
    const url = urlBase + '/wiki/Teamfight_Tactics:Champions#Stat%20List';
    let championUrls = await getChampionUrls(url);
    let champions = [];

    for(let championUrl of championUrls) {
        if(championUrl.toLowerCase().includes('twisted_fate')) {
            continue;
        }

        let championScraper = await new ChampionScraper(urlBase + championUrl);
        champions.push(championScraper.parseChampion());
    }

    let oneCostChampions = champions.filter(function(champion) {
       return champion.getCost() === 1;
    });

    let averageHealth = averageStat(oneCostChampions, champion => champion.getFirstLevel().getHealth());
    let averageEffectiveHealth = averageStat(oneCostChampions, champion => champion.getFirstLevel().getEffectiveHealth());
    console.log('averageHealth: ' + averageHealth);
    console.log('averageEffectiveHealth: ' + averageEffectiveHealth);


    let twoCostChampions = champions.filter(function(champion) {
        return champion.getCost() === 2
    });

    let threeCostChampions = champions.filter(function(champion) {
        return champion.getCost() === 3;
    });

    let fourCostChampions = champions.filter(function(champion) {
        return champion.getCost() === 4;
    });

    let fiveCostChampions = champions.filter(function(champion) {
        return champion.getCost() === 5;
    });
})();

function averageStat(arr, fn) {
    let reducer = (accumulator, champion) => accumulator + fn(champion);
    let total = arr.reduce(reducer, 0);
    return total / arr.length;
}

async function getChampionUrls(url) {
    const championsRegex = /<[^<>]+\s+id\s*=\s*['"]List_of_champions['"]\s*>(.*)<[^<>]+\s+id\s*=\s*['"]Trivia['"]\s*>/s;
    const championRegex = /<td.*data-type\s*=\s*['"]champion['"].*<.*a\s+href\s*=\s*['"](.*?)['"]/g;

    let championTextMatch;
    let championUrls = new Set();

    const response = await fetch(url);
    const body = await response.text();
    const championsTextMatches = championsRegex.exec(body);
    const championsText = championsTextMatches[1];

    while (championTextMatch = championRegex.exec(championsText)) {
        championUrls.add(championTextMatch[1]);
    }

    return championUrls;
}


