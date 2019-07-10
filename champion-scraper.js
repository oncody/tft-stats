const fetch = require('node-fetch');
const champion = require('./champion');

class ChampionScraper {

    constructor(url) {
       return (async () => {
           const statsRegex = /<aside.*<\/aside>/s;

           const response = await fetch(url);
           const body = await response.text();
           let statsMatches = statsRegex.exec(body);
           this.statsText = statsMatches[0];

           let name = this.parseName();
           let cost = this.parseCost();
           let origins = this.parseOrigins();
           let classes = this.parseClasses();

           console.log(name);
           console.log(cost);
           console.log(origins);

           return this;
       })();
    }

    parseName() {
        const nameRegex = /<[^<>]+class\s*=\s*['"][^'"]*pi-title[^'"]*['"][^<>]*>\s*([^\s<>]+)\s*[<>]/;
        let matches = nameRegex.exec(this.statsText);
        return matches[1];
    }

    parseCost() {
        const costRegex = /title\s*=\s*['"](\d)\s*Gold\s*['"]/;
        let matches = costRegex.exec(this.statsText);
        return matches[1];
    }

    parseOrigins() {
        const originsRegex = /(<td\s+.*data-source\s*=\s*['"]origin['"].*>.*<.*data-param\s*=\s*['"][^'"]*['"].*>.*)<td\s+.*data-source\s*=\s*['"]class['"].*>/s;
        const originRegex = /data-param=['"]([^'"]*)['"]/g;

        let origins = [];
        let originTextMatch;

        let originsMatches = originsRegex.exec(this.statsText);
        let originsText = originsMatches[1];


        while (originTextMatch = originRegex.exec(originsText)) {
            origins.push(originTextMatch[1]);
        }

        return origins;
    }

    parseClasses() {

    }

}

module.exports = ChampionScraper;

