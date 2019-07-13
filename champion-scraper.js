const fetch = require('node-fetch');
const champion = require('./champion');
const regexUtils = require('./regex-utils');

class ChampionScraper {

    constructor(url) {
       return (async () => {
           // const statsRegex = /<aside.*<\/aside>/s;

           const response = await fetch(url);
           const body = await response.text();
           // let statsMatches = statsRegex.exec(body);
           // this.statsText = statsMatches[0];
           this.statsText = body;

           let name = this.parseName();
           let cost = this.parseCost();
           let origins = this.parseOrigins();
           let classes = this.parseClasses();
           let health = this.getPiDataValueDataSource('health');
           let mana = this.getPiDataValueDataSource('mana');
           // let startingMana = this.getPiDataValueDataSource('starting mana');
           let damage = this.getPiDataValueDataSource('ad');
           let attackSpeed = this.getPiDataValueDataSource('as');
           let range = this.getPiDataValueDataSource('attack range');
           let armor = this.getPiDataValueDataSource('armor');
           let mr = this.getPiDataValueDataSource('mr');
           let playerDamage = this.getPiDataValueDataSource('player damage');

           console.log(`name: ${name}`);
           console.log(`cost: ${cost}`);
           console.log(`origins: ${origins}`);
           console.log(`classes: ${classes}`);
           console.log(`health: ${health}`);
           console.log(`mana: ${mana}`);
           console.log(`damage: ${damage}`);
           console.log(`attackSpeed: ${attackSpeed}`);
           console.log(`range: ${range}`);
           console.log(`armor: ${armor}`);
           console.log(`mr: ${mr}`);
           console.log(`playerDamage: ${playerDamage}`);

           return this;
       })();
    }

    parseName() {
        return this.getIdDataSource('mw-content-text', 1);
    }

    parseCost() {
        return regexUtils.getFirstCapturingGroup(this.statsText, 'title\\s*=\\s*[\'"](\\d)\\s*Gold\\s*[\'"]');
    }

    parseOrigins() {
        const originsRegex = /(<td\s+[^<>]*data-source\s*=\s*['"]origin['"][^<>]*>.*)<td\s+[^<>]*data-source\s*=\s*['"]class['"][^<>]*>/s;
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
        const classesRegex = /(<td\s+[^<>]*data-source\s*=\s*['"]class['"][^<>]*>.*)<\/tr>/s;
        const classRegex = /data-param=['"]([^'"]*)['"]/g;

        let classes = [];
        let classTextMatch;

        let classesMatches = classesRegex.exec(this.statsText);
        let classesText = classesMatches[1];


        while (classTextMatch = classRegex.exec(classesText)) {
            classes.push(classTextMatch[1]);
        }

        return classes;

    }

    getIdDataSource(id, dataSource) {
        let value = '';
        const regex = `<[^<>]+id\\s*=\\s*['"]${id}['"].*data-source\\s*=\\s*['"]${dataSource}['"][^<>]*>`;
        let match = regexUtils.getEntireMatch(this.statsText, regex, 's');
        let startIndex = this.statsText.indexOf(match);
        let endIndex = startIndex + match.length;
        let cursor = endIndex;
        let currentChar = this.statsText.charAt(cursor);

        // read until we reach a >
        while(currentChar !== '>' && currentChar !== '<') {
            value += currentChar;
            cursor++;
            currentChar = this.statsText.charAt(cursor);
        }

        return value;
    }

    getPiDataValueDataSource(dataSource) {
        return this.getDataSourceClass(dataSource, 'pi-data-value');
    }

    getDataSourceClass(dataSource, className) {
        return regexUtils.getFirstCapturingGroup(this.statsText, `<[^<>]+data-source\\s*=\\s*['"]${dataSource}['"][^<>]*>.*?<[^<>]+class\\s*=\\s*['"][^'"]*${className}[^'"]*['"][^<>]*>([^<>]*)<\\/`, 's');
    }

}

module.exports = ChampionScraper;

