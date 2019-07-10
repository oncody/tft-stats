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
           let abilityName = this.parseAbilityName();
           // let abilityDescription = this.parseAbilityDescription();
           let health = this.getDataValue('health');
           let mana = this.getDataValue('mana');
           // let startingMana = this.getDataValue('starting mana');
           let damage = this.getDataValue('ad');
           let attackSpeed = this.getDataValue('as');
           let range = this.getDataValue('attack range');
           let armor = this.getDataValue('armor');
           let mr = this.getDataValue('mr');
           let playerDamage = this.getDataValue('player damage');

           console.log(name);
           console.log(cost);
           console.log(origins);
           console.log(classes);
           console.log(abilityName);
           // console.log(abilityDescription);
           console.log(health);
           console.log(mana);
           // console.log(startingMana);
           console.log(damage);
           console.log(attackSpeed);
           console.log(range);
           console.log(armor);
           console.log(mr);
           console.log(playerDamage);

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

    parseAbilityName() {
        // const abilityNameRegex = /<[^<>]+data-source\s*=\s*['"]ability name['"][^<>]*>.*?<[^<>]+class\s*=\s*['"]pi-data-value[^'"]*['"][^<>]*>.*?<span[^<>]*>([^<>]*)<\/span>/s;
        // let matches = abilityNameRegex.exec(this.statsText);
        // return matches[1];
        return this.getDataValueNestedInSpan('ability name');
    }

    parseAbilityDescription() {
        // const abilityDescrptionRegex = /<[^<>]+data-source\s*=\s*['"]ability description['"][^<>]*>.*?<[^<>]+class\s*=\s*['"]pi-data-value[^'"]*['"][^<>]*>.*?<span[^<>]*>([^<>]*)<\/span>/s;
        // let matches = abilityDescrptionRegex.exec(this.statsText);
        // return matches[1];
        return '';
    }

    parseHealth() {
        return
    }

    getDataValueNestedInSpan(dataSource) {
        const regex = new RegExp(`<[^<>]+data-source\s*=\s*['"]${dataSource}['"][^<>]*>.*?<[^<>]+class\s*=\s*['"]pi-data-value[^'"]*['"][^<>]*>.*?<span[^<>]*>([^<>]*)<\/span>`, 's');
        let matches = regex.exec(this.statsText);
        return matches[1];
    }

    getDataValue(dataSource) {
        const regex = new RegExp(`<[^<>]+data-source\\s*=\\s*['"]${dataSource}['"][^<>]*>.*?<[^<>]+class\\s*=\\s*['"]pi-data-value[^'"]*['"][^<>]*>([^<>]*)<\\/`, 's');
        let matches = regex.exec(this.statsText);
        return matches[1];
    }

}

module.exports = ChampionScraper;

