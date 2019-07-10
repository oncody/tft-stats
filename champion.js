class Champion {
    constructor(name,
                cost,
                origins,
                classes,
                abilityName,
                abilityText,
                firstHealth,
                secondHealth,
                thirdHealth,
                mana,
                startingMana,
                firstDamage,
                secondDamage,
                thirdDamage,
                attackSpeed,
                firstDps,
                secondDps,
                thirdDps,
                range,
                armor,
                mr,
                firstPlayerDamage,
                secondPlayerDamage,
                thirdPlayerDamage) {
        this.name = name;
        this.cost = cost;
        this.origins = origins;
        this.classes = classes;
        this.abilityName = abilityName;
        this.abilityText = abilityText;
        this.firstHealth = firstHealth;
        this.secondHealth = secondHealth;
        this.thirdHealth = thirdHealth;
        this.mana = mana;
        this.startingMana = startingMana;
        this.firstDamage = firstDamage;
        this.secondDamage = secondDamage;
        this.thirdDamage = thirdDamage;
        this.attackSpeed = attackSpeed;
        this.firstDps = firstDps;
        this.secondDps = secondDps;
        this.thirdDps = thirdDps;
        this.range = range;
        this.armor = armor;
        this.mr = mr;
        this.firstPlayerDamage = firstPlayerDamage;
        this.secondPlayerDamage = secondPlayerDamage;
        this.thirdPlayerDamage = thirdPlayerDamage;
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

    getAbilityName() {
        return this.abilityName;
    }

    getAbilityText() {
        return this.abilityText;
    }

    getFirstHealth() {
        return this.firstHealth;
    }

    getSecondHealth() {
        return this.secondHealth;
    }

    getThirdHealth() {
        return this.thirdHealth;
    }

    getMana() {
        return this.mana;
    }

    getStartingMana() {
        return this.startingMana;
    }

    getFirstDamage() {
        return this.firstDamage;
    }

    getSecondDamage() {
        return this.secondDamage;
    }

    getThirdDamage() {
        return this.thirdDamage;
    }

    getAttackSpeed() {
        return this.attackSpeed;
    }

    getFirstDps() {
        return this.firstDps;
    }

    getSecondDps() {
        return this.secondDps;
    }

    getThirdDps() {
        return this.thirdDps;
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

    getFirstPlayerDamage() {
        return this.firstPlayerDamage;
    }

    getSecondPlayerDamage() {
        return this.secondPlayerDamage;
    }

    getThirdPlayerDamage() {
        return this.thirdPlayerDamage;
    }
}

module.exports = Champion;
