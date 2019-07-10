const fetch = require('node-fetch');
const ChampionScraper = require('./champion-scraper');

(async function () {
    const urlBase = 'https://leagueoflegends.fandom.com';
    const url = urlBase + '/wiki/Teamfight_Tactics:Champions#Stat%20List';
    let championUrls = await getChampionUrls(url);

    let firstChampionUrl = championUrls.values().next().value;
    let kennenChampionUrl;

    for(let championUrl of championUrls) {
        if(championUrl.toLowerCase().includes('gangplank')) {
            kennenChampionUrl = championUrl;
        }
    }

    let championScraper = await new ChampionScraper(urlBase + kennenChampionUrl);
})();

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


