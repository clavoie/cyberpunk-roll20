class TokenWeapon {
    #ammoType;
    #autoFire;
    #damage;
    #modAttack;
    #modDamage;
    #modUse;
    #name;
    #notes;
    #rof;
    #skill;
    #suppress;

    constructor (characterId, weaponId) {
        this.#ammoType = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponammotype`);
        this.#autoFire = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponautofire`) === "on";
        this.#damage = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weapondamage`);
        this.#modAttack = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponmodifier`);
        this.#modDamage = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weapondamagemod`);
        this.#modUse = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponshowmodifiers`) === "on";
        this.#name = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponname`);
        this.#notes = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponnotes`);
        this.#rof = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponrof`);
        this.#skill = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponskill`);
        this.#suppress = getAttrByName(characterId, $`"repeating_weapons_${weaponId}_weaponsuppress`) === "on";
    }
}