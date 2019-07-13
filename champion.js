class Champion {
    constructor(name,
                cost,
                origins,
                classes,
                mana,
                startingMana,
                attackSpeed,
                range,
                armor,
                mr,
                firstLevel,
                secondLevel,
                thirdLevel) {
        this.name = name;
        this.cost = cost;
        this.origins = origins;
        this.classes = classes;
        this.mana = mana;
        this.startingMana = startingMana;
        this.attackSpeed = attackSpeed;
        this.range = range;
        this.armor = armor;
        this.mr = mr;
        this.firstLevel = firstLevel;
        this.secondLevel = secondLevel;
        this.thirdLevel = thirdLevel;
    }

    getName() {
        return this.name;
    }

    getCost() {
        return this.cost;
    }

    getOrigins() {
        return this.origins;
    }

    getClasses() {
        return this.classes;
    }

    getMana() {
        return this.mana;
    }

    getStartingMana() {
        return this.startingMana;
    }

    getAttackSpeed() {
        return this.attackSpeed;
    }

    getRange() {
        return this.range;
    }

    getArmor() {
        return this.armor;
    }

    getMr() {
        return this.mr;
    }

    getFirstLevel() {
        return this.firstLevel;
    }

    getSecondLevel() {
        return this.secondLevel;
    }

    getThirdLevel() {
        return this.thirdLevel;
    }
}

module.exports = Champion;
