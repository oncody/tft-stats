class ChampionLevel {
    constructor(health, damage, dps, playerDamage) {
        this.health = health;
        this.damage = damage;
        this.dps = dps;
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
