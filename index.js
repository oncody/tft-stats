const ConfigStore = require('configstore');
const fetch = require('node-fetch');
const ChampionScraper = require('./champion-scraper');
const regexUtils = require('./regex-utils');
const lodash = require('lodash');

const config = new ConfigStore('tft-stats');

const favoriteChampions =
    [
        'garen',
        'warwick',
        'darius',
        'tristana',
        'nidalee',
        'braum',
        'shen',
        'blitzcrank',
        'rek\'sai',
        'lucian',
        'zed',
        'pyke',
        'varus',
        'poppy',
        'aatrox',
        'volibear',
        'kennen',
        'ashe',
        'cho\'gath',
        'leona',
        'gnar',
        'sejuani',
        'akali',
        'draven',
        'kayle',
        'karthus',
        'swain',
        'yasuo',
        'miss fortune'
    ];

(async function () {
    const championUrlRegexName = 'Teamfight_Tactics:(.*?)\\s*$';
    const urlBase = 'https://leagueoflegends.fandom.com';
    const url = urlBase + '/wiki/Teamfight_Tactics:Champions#Stat%20List';
    let championUrls = await getChampionUrls(url);
    let champions = [];

    // todo: remove this line
    // config.clear();

    for(let championUrl of championUrls) {
        let championUrlName = regexUtils.getFirstCapturingGroup(championUrl, championUrlRegexName);
        if(!config.has(championUrlName)) {
            let championScraper = await new ChampionScraper(urlBase + championUrl);
            let champion = championScraper.parseChampion();
            config.set(championUrlName, champion);
        }

        champions.push(config.get(championUrlName));
    }

    let origins = [];
    let classes = [];
    for(let name of favoriteChampions) {
        let champ = champions.find(champ => champ.name.toLowerCase() === name);
        if(!champ) {
            console.log('coulnt find ' + name);
        }

        for(let name of champ.origins) {
            let foundOrigin = origins.find(origin => origin.name === name);
            if(foundOrigin) {
                foundOrigin.count++;
            } else {
                origins.push({
                    name: name,
                    count: 1
                });
            }
        }

        for(let name of champ.classes) {
            let foundClass = classes.find(champClass => champClass.name === name);
            if(foundClass) {
                foundClass.count++;
            } else {
                classes.push({
                    name: name,
                    count: 1
                });
            }
        }
    }


    let synergies = origins.concat(classes);

    origins.sort((a, b) => b.count - a.count);
    classes.sort((a, b) => b.count - a.count);
    synergies.sort((a, b) => b.count - a.count);

    for(let synergy of origins) {
        // console.log(`${synergy.name}: ${synergy.count}`);
    }

    for(let synergy of classes) {
        // console.log(`${synergy.name}: ${synergy.count}`);
    }

    for(let synergy of synergies) {
        // console.log(`${synergy.name}: ${synergy.count}`);
    }

    // analyzeChampionsPerCost(champions, 1);
    // analyzeChampionsPerCost(champions, 2);
    // analyzeChampionsPerCost(champions, 3);
    // analyzeChampionsPerCost(champions, 4);
    analyzeChampionsPerCost(champions, 5);
})();

function analyzeChampionsPerCost(allChampions, cost) {
    let champions = allChampions.filter(function(champion) {
        return champion.cost < cost + 1;
        // return champion.cost === cost;
    });

    let origins = [];
    let classes = [];

    let averageEffectiveHealth = averageStat(champions, champion => champion.thirdLevel.effectiveHealth);
    let averageDps = averageStat(champions, champion => champion.thirdLevel.dps);
    let averageDpsBeforeDying = averageStat(champions, champion => getChampionDpsBeforeDying(champion, averageDps));

    printHighestStats('health', champions, averageEffectiveHealth, champion => champion.thirdLevel.effectiveHealth);
    printHighestStats('dps', champions, averageDps, champion => champion.thirdLevel.dps);
    printHighestDpsPlusHealth(champions, averageDps, averageEffectiveHealth);

    // console.log('averageHealth: ' + lodash.round(averageHealth, 2));
    // console.log('averageEffectiveHealth: ' + lodash.round(averageEffectiveHealth, 2));
    // console.log('averageDps: ' + lodash.round(averageDps, 2));
    // console.log('averageDpsBeforeDying: ' + lodash.round(averageDpsBeforeDying, 2));

    // champions.sort((a, b) => {
    //     let aDpsBeforeDying = getChampionDpsBeforeDying(a, averageDps);
    //     let bDpsBeforeDying = getChampionDpsBeforeDying(b, averageDps);
    //     return bDpsBeforeDying - aDpsBeforeDying;
    // });
    // for(let champion of champions) {
    //     for(let originName of champion.origins) {
    //         let foundOrigin = origins.find(origin => origin.name === originName);
    //
    //         if(foundOrigin) {
    //             foundOrigin.count++;
    //             foundOrigin.valueSum += getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying;
    //             foundOrigin.averageValue = foundOrigin.valueSum / foundOrigin.count;
    //         } else {
    //             let origin = {};
    //             origin.name = originName;
    //             origin.count = 1;
    //             origin.valueSum = getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying;
    //             origin.averageValue = getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying;
    //             origins.push(origin);
    //         }
    //     }
    //
    //     for(let className of champion.classes) {
    //         let foundClass = classes.find(championClass => championClass.name === className);
    //         if(foundClass) {
    //             foundClass.count++;
    //             foundClass.valueSum += getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying;
    //             foundClass.averageValue = foundClass.valueSum / foundClass.count;
    //         } else {
    //             let championClass = {};
    //             championClass.name = className;
    //             championClass.count = 1;
    //             championClass.valueSum = getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying;
    //             championClass.averageValue = getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying;
    //             classes.push(championClass);
    //         }
    //     }
    //
    //     console.log(`${champion.cost} ` +
    //         `${champion.name} | ` +
    //         `${lodash.round(getChampionDpsBeforeDying(champion, averageDps) / averageDpsBeforeDying, 2)} | ` +
    //         `${lodash.round(getChampionDpsBeforeDying(champion, averageDps), 2)} | ` +
    //         `${lodash.round(champion.thirdLevel.effectiveHealth, 2)} | ` +
    //         `${lodash.round(champion.thirdLevel.dps, 2)} | ` +
    //         `${lodash.round(champion.attackSpeed, 2)} | ` +
    //         `${champion.origins} | ` +
    //         `${champion.classes}`);
    // }

    let synergies = origins.concat(classes);

    origins.sort((a, b) => b.averageValue - a.averageValue);
    classes.sort((a, b) => b.averageValue - a.averageValue);
    synergies.sort((a, b) => b.averageValue - a.averageValue);

    for(let synergy of synergies) {
        // console.log(`${synergy.name}: ${lodash.round(synergy.averageValue, 2)} | ${synergy.count}`);
    }



}

function getChampionDpsBeforeDying(champion, averageDps) {
    return champion.thirdLevel.effectiveHealth / averageDps * champion.thirdLevel.dps;
}

function getHpAndDpsModifier(champion, averageDps, averageEffectiveHealth) {
        let effectiveHealthPercent = champion.thirdLevel.effectiveHealth / averageEffectiveHealth;
        let dpsPercent = champion.thirdLevel.dps / averageDps;
        return dpsPercent + effectiveHealthPercent;
}

function printHighestDpsPlusHealth(champions, averageDps, averageEffectiveHealth) {
    console.log('\n\nSorting by: dps+hp');

    champions.sort((a, b) => {
        let aHealthAndDpsModifier = getHpAndDpsModifier(a, averageDps, averageEffectiveHealth);
        let bHealthAndDpsModifier = getHpAndDpsModifier(b, averageDps, averageEffectiveHealth);
        return bHealthAndDpsModifier - aHealthAndDpsModifier;
    });
    for(let champion of champions) {
        console.log(`${champion.cost} ` +
            `${champion.name} ` +
            `${lodash.round(((getHpAndDpsModifier(champion, averageDps, averageEffectiveHealth) - 2.0) * 100), 0)}%`);
    }
}

function printHighestStats(statName, champions, averageStat, championStatFunction) {
    console.log('\n\nSorting by: ' + statName);

    champions.sort((a, b) => championStatFunction(b) - championStatFunction(a));
    for(let champion of champions) {
        console.log(`${champion.cost} ` +
            `${champion.name} ` +
            `${lodash.round((((championStatFunction(champion) / averageStat) - 1.0) * 100), 0)}%`);
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


