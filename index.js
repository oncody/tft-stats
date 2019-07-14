const ConfigStore = require('configstore');
const fetch = require('node-fetch');
const ChampionScraper = require('./champion-scraper');
const regexUtils = require('./regex-utils');
const lodash = require('lodash');

const config = new ConfigStore('tft-stats');

(async function () {
    const championUrlRegexName = 'Teamfight_Tactics:(.*?)\\s*$';
    const urlBase = 'https://leagueoflegends.fandom.com';
    const url = urlBase + '/wiki/Teamfight_Tactics:Champions#Stat%20List';
    let championUrls = await getChampionUrls(url);
    let champions = [];

    // todo: remove this line
    // config.clear();

    for(let championUrl of championUrls) {
        if(championUrl.toLowerCase().includes('twisted_fate')) {
            continue;
        }

        let championUrlName = regexUtils.getFirstCapturingGroup(championUrl, championUrlRegexName);
        if(!config.has(championUrlName)) {
            let championScraper = await new ChampionScraper(urlBase + championUrl);
            let champion = championScraper.parseChampion();
            config.set(championUrlName, champion);
        }

        champions.push(config.get(championUrlName));
    }

    let oneCostChampions = champions.filter(function(champion) {
       return champion.cost === 1;
    });

    let averageHealth = averageStat(oneCostChampions, champion => champion.firstLevel.health);
    let averageEffectiveHealth = averageStat(oneCostChampions, champion => champion.firstLevel.effectiveHealth);
    let averageDps = averageStat(oneCostChampions, champion => champion.firstLevel.dps);
    console.log('averageHealth: ' + lodash.round(averageHealth, 2));
    console.log('averageEffectiveHealth: ' + lodash.round(averageEffectiveHealth, 2));
    console.log('averageDps: ' + lodash.round(averageDps, 2));

    // printHighestStats(oneCostChampions, champion => champion.getFirstLevel().getEffectiveHealth());
    // printHighestStats(oneCostChampions, champion => champion.getFirstLevel().getDps());


    oneCostChampions.sort((a, b) => {
        let aDpsBeforeDying = getChampionDpsBeforeDying(a, averageDps);
        let bDpsBeforeDying = getChampionDpsBeforeDying(b, averageDps);
        return bDpsBeforeDying - aDpsBeforeDying;
    });
    for(let champion of oneCostChampions) {
        console.log(`${champion.cost} ` +
            `${champion.name} | ` +
            `${lodash.round(getChampionDpsBeforeDying(champion, averageDps), 2)} | ` +
            `${lodash.round(champion.firstLevel.effectiveHealth, 2)} | ` +
            `${lodash.round(champion.firstLevel.dps, 2)} `);
    }


    // let twoCostChampions = champions.filter(function(champion) {
    //     return champion.cost === 2
    // });
    //
    // let threeCostChampions = champions.filter(function(champion) {
    //     return champion.cost === 3;
    // });
    //
    // let fourCostChampions = champions.filter(function(champion) {
    //     return champion.cost === 4;
    // });
    //
    // let fiveCostChampions = champions.filter(function(champion) {
    //     return champion.cost === 5;
    // });
})();

function getChampionDpsBeforeDying(champion, averageDps) {
    return champion.firstLevel.effectiveHealth / averageDps * champion.firstLevel.dps;
}

function printHighestStats(champions, championStatFunction) {
    champions.sort((a, b) => championStatFunction(b) - championStatFunction(a));
    for(let champion of champions) {
        console.log(`${champion.getName()}: ${championStatFunction(champion)}`);
    }
}

function averageStat(champions, championStatFunction) {
    let reducer = (accumulator, champion) => accumulator + championStatFunction(champion);
    let total = champions.reduce(reducer, 0);
    return total / champions.length;
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


