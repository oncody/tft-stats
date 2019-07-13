class ChampionLevel {
    constructor(attackSpeed, armor, health, damage, playerDamage) {
        this.attackSpeed = attackSpeed;
        this.armor = armor;
        this.health = health;
        this.damage = damage;
        this.playerDamage = playerDamage;
    }

    getEffectiveHealth() {
        let armorPercent = this.armor / 100;
        return this.health + (armorPercent * this.health);
    }

    getHealth() {
        return this.health;
    }

    getDamage() {
        return this.damage;
    }

    getDps() {
        return this.attackSpeed * this.damage;
    }

    getPlayerDamage() {
        return this.playerDamage;
    }
}

module.exports = ChampionLevel;
