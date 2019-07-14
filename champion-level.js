class ChampionLevel {
    constructor(attackSpeed, armor, health, damage, playerDamage) {
        this.attackSpeed = attackSpeed;
        this.armor = armor;
        this.health = health;
        this.damage = damage;
        this.playerDamage = playerDamage;
        this.dps = attackSpeed * damage;

        let armorPercent = armor / 100;
        this.effectiveHealth = health + (armorPercent * health);
    }

    getEffectiveHealth() {
        return this.effectiveHealth;
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
