class ChampionLevel {
    constructor(attackSpeed, health, damage, playerDamage) {
        this.health = health;
        this.damage = damage;
        this.dps = attackSpeed * damage;
        this.playerDamage = playerDamage;
    }

    getHealth() {
        return this.health;
    }

    getDamage() {
        return this.damage;
    }

    getDps() {
        return this.dps;
    }

    getPlayerDamage() {
        return this.playerDamage;
    }
}

module.exports = ChampionLevel;
