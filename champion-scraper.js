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
           let startingMana = this.parseStartingMana();
           let damage = this.getPiDataValueDataSource('ad');
           let attackSpeed = this.parseAttackSpeed();
           let range = this.parseAttackRange('attack range');
           let armor = this.getPiDataValueDataSource('armor');
           let mr = this.getPiDataValueDataSource('mr');
           let playerDamage = this.getPiDataValueDataSource('player damage');

           let firstHealth = this.parseFirstLevelStat(health);
           let secondHealth = this.parseSecondLevelStat(health);
           let thirdHealth = this.parseThirdLevelStat(health);

           let firstDamage = this.parseFirstLevelStat(damage);
           let secondDamage = this.parseSecondLevelStat(damage);
           let thirdDamage = this.parseThirdLevelStat(damage);

           let firstPlayerDamage = this.parseFirstLevelStat(playerDamage);
           let secondPlayerDamage = this.parseSecondLevelStat(playerDamage);
           let thirdPlayerDamage = this.parseThirdLevelStat(playerDamage);

           console.log(`name: ${name}`);
           console.log(`cost: ${cost}`);
           console.log(`origins: ${origins}`);
           console.log(`classes: ${classes}`);
           console.log(`firstHealth: ${firstHealth}`);
           console.log(`secondHealth: ${secondHealth}`);
           console.log(`thirdHealth: ${thirdHealth}`);
           console.log(`mana: ${mana}`);
           console.log(`startingMana: ${startingMana}`);
           console.log(`damage: ${damage}`);
           console.log(`firstDamage: ${firstDamage}`);
           console.log(`secondDamage: ${secondDamage}`);
           console.log(`thirdDamage: ${thirdDamage}`);
           console.log(`attackSpeed: ${attackSpeed}`);
           console.log(`range: ${range}`);
           console.log(`armor: ${armor}`);
           console.log(`mr: ${mr}`);
           console.log(`playerDamage: ${playerDamage}`);
           console.log(`firstPlayerDamage: ${firstPlayerDamage}`);
           console.log(`secondPlayerDamage: ${secondPlayerDamage}`);
           console.log(`thirdPlayerDamage: ${thirdPlayerDamage}`);

           return this;
       })();
    }

    parseFirstLevelStat(stat) {
        const regex = '\\s*(\\d+)\\s*\\/\\s*\\d+\\s*\\/\\s*\\d+\\s*';
        return regexUtils.getFirstCapturingGroup(stat, regex);
    }

    parseSecondLevelStat(stat) {
        const regex = '\\s*\\d+\\s*\\/\\s*(\\d+)\\s*\\/\\s*\\d+\\s*';
        return regexUtils.getFirstCapturingGroup(stat, regex);
    }

    parseThirdLevelStat(stat) {
        const regex = '\\s*\\d+\\s*\\/\\s*\\d+\\s*\\/\\s*(\\d+)\\s*';
        return regexUtils.getFirstCapturingGroup(stat, regex);
    }

    parseAttackSpeed() {
        const regex = '<[^<>]+data-source\\s*=\\s*[\'"]as[\'"][^<>]*>.*<[^<>]+class\\s*=\\s*[\'"][^\'"]*pi-data-value[^\'"]*[\'"][^<>]*>\\s*(\\d)\\s*\\.\\s*(?:<small>)(\\d+)(?:<\\/small?)\\s*>';
        let matches = regexUtils.getMatches(this.statsText, regex, 's');
        return '' + matches[1] + '.' + matches[2];
    }

    parseStartingMana() {
        try {
            return this.getPiDataValueDataSource('starting mana');
        } catch(err) {
            return 0;
        }
    }

    parseName() {
        return this.getIdDataSource('mw-content-text', 1);
    }

    parseAttackRange() {
        const regex = '<[^<>]+data-source\\s*=\\s*[\'"]attack range[\'"][^<>]*>.*<span[^<>]*><a[^<>]*>.*<\\/a>\\s*[\'"]?(?:&nbsp)?;?(\\d)[\'"]?\\s*<\\/span>';
        return regexUtils.getFirstCapturingGroup(this.statsText, regex, 's');
    }

    parseCost() {
        const regex = 'title\\s*=\\s*[\'"](\\d)\\s*Gold\\s*[\'"]';
        return regexUtils.getFirstCapturingGroup(this.statsText, regex);
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
        const classesRegex = /(<td\s+[^<>]*data-source\s*=\s*['"]class['"][^<>]*>.*?)<\/tr>/s;
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
        const regex = `<[^<>]+data-source\\s*=\\s*['"]${dataSource}['"][^<>]*>.*?<[^<>]+class\\s*=\\s*['"][^'"]*${className}[^'"]*['"][^<>]*>([^<>]*)<\\/`;
        return regexUtils.getFirstCapturingGroup(this.statsText, regex, 's');
    }

}

module.exports = ChampionScraper;

