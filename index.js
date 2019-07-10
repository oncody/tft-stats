const fetch = require('node-fetch');


(async function() {
    const urlBase = 'https://leagueoflegends.fandom.com';
    const url = urlBase + '/wiki/Teamfight_Tactics:Champions#Stat%20List';
    let championUrls = await getChampionUrls(url);

    console.log(championUrls);

    let firstChampionUrl = championUrls.values().next().value;
    let championInfo = await scrapeChampionDataFromUrl(urlBase + firstChampionUrl);
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

async function scrapeChampionDataFromUrl(url) {
    const statsRegex = /<aside.*<\/aside>/s;

    const response = await fetch(url);
    const body = await response.text();
    let statsMatches = statsRegex.exec(body);
    let statsText = statsMatches[0];

    // console.log(statsText);
}
