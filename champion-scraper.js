const fetch = require('node-fetch');
const Champion = require('./champion');
const ChampionLevel = require('./champion-level');
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
           console.log(`name: ${name}`);

           let cost = this.parseCost();
           let origins = this.parseOrigins();
           let classes = this.parseClasses();
           let health = this.getPiDataValueDataSource('health');
           let mana = parseInt(this.getPiDataValueDataSource('mana'));
           let startingMana = this.parseStartingMana();
           let damage = this.getPiDataValueDataSource('ad');
           let attackSpeed = this.parseAttackSpeed();
           let range = this.parseAttackRange('attack range');
           let armor = parseInt(this.getPiDataValueDataSource('armor'));
           let mr = parseInt(this.getPiDataValueDataSource('mr'));
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

           let firstLevel = new ChampionLevel(attackSpeed, firstHealth, firstDamage, firstPlayerDamage);
           let secondLevel = new ChampionLevel(attackSpeed, secondHealth, secondDamage, secondPlayerDamage);
           let thirdLevel = new ChampionLevel(attackSpeed, thirdHealth, thirdDamage, thirdPlayerDamage);
           this.champion = new Champion(name, cost, origins, classes, mana, startingMana, attackSpeed, range, armor, mr, firstLevel, secondLevel, thirdLevel);

           return this;
       })();
    }

    parseChampion() {
        return this.champion;
    }

    parseFirstLevelStat(stat) {
        const regex = '\\s*(\\d+)\\s*\\/\\s*\\d+\\s*\\/\\s*\\d+\\s*';
        let match = regexUtils.getFirstCapturingGroup(stat, regex);
        return parseInt(match);
    }

    parseSecondLevelStat(stat) {
        const regex = '\\s*\\d+\\s*\\/\\s*(\\d+)\\s*\\/\\s*\\d+\\s*';
        let match = regexUtils.getFirstCapturingGroup(stat, regex);
        return parseInt(match);
    }

    parseThirdLevelStat(stat) {
        const regex = '\\s*\\d+\\s*\\/\\s*\\d+\\s*\\/\\s*(\\d+)\\s*';
        let match = regexUtils.getFirstCapturingGroup(stat, regex);
        return parseInt(match);
    }

    parseAttackSpeed() {
        let attackSpeed = '';
        const regex = '<[^<>]+data-source\\s*=\\s*[\'"]as[\'"][^<>]*>.*?<[^<>]+class\\s*=\\s*[\'"][^\'"]*pi-data-value[^\'"]*[\'"][^<>]*>\\s*(\\d)\\s*\\.?\\s*(?:<small>)?(\\d+)?(?:<\\/small>)?\\s*<';
        let matches = regexUtils.getMatches(this.statsText, regex, 's');
        attackSpeed += matches[1];
        if(matches[2]) {
            attackSpeed += '.' + matches[2];
        }
        return Number(attackSpeed);
    }

    parseStartingMana() {
        try {
            let match = this.getPiDataValueDataSource('starting mana');
            return parseInt(match);
        } catch(err) {
            return 0;
        }
    }

    parseName() {
        return this.getIdDataSource('mw-content-text', 1);
    }

    parseAttackRange() {
        const regex = '<[^<>]+data-source\\s*=\\s*[\'"]attack range[\'"][^<>]*>.*<span[^<>]*><a[^<>]*>.*<\\/a>\\s*[\'"]?(?:&nbsp)?;?(\\d)[\'"]?\\s*<\\/span>';
        let match = regexUtils.getFirstCapturingGroup(this.statsText, regex, 's');
        return parseInt(match);
    }

    parseCost() {
        const regex = 'title\\s*=\\s*[\'"](\\d)\\s*Gold\\s*[\'"]';
        let match = regexUtils.getFirstCapturingGroup(this.statsText, regex);
        return parseInt(match);
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
        let match = this.getDataSourceClass(dataSource, 'pi-data-value');
        return match;
    }

    getDataSourceClass(dataSource, className) {
        const regex = `<[^<>]+data-source\\s*=\\s*['"]${dataSource}['"][^<>]*>.*?<[^<>]+class\\s*=\\s*['"][^'"]*${className}[^'"]*['"][^<>]*>([^<>]*)<\\/`;
        return regexUtils.getFirstCapturingGroup(this.statsText, regex, 's');
    }

}

module.exports = ChampionScraper;

