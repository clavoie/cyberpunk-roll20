function dealDamage(value, isPlayerToEnemy, isRanged) {
    const selected = value.selected;
    
    if (!selected) {
        sendChatPlayer(value, "Nothing is selected! (selected not found)");
        return;
    }
    
    if (!_.isArray(selected)) {
        sendChatPlayer(value, "Selected is not an array for some reason!");
        return;
    }
    
    if (selected.length === 0) {
        sendChatPlayer(value, "Nothing is selected! (0 selected)");
        return;
    }
    
    if (selected.length === 1) {
        sendChatPlayer(value, "Only one thing selected!");
        return;
    }
    
    if (!playerIsGM(value.playerid)) {
        sendChatPlayer(value, "You're not the GM!");
        return;
    }

    const inlineRolls = value.inlinerolls;
    if (!inlineRolls) {
        sendChatPlayer(value, "No damage values provided!");
        return;
    }

    if (!_.isArray(inlineRolls)) {
        sendChatPlayer(value, "Inline rolls is not an array for some reason!");
        return;
    }

    if (inlineRolls.length === 0) {
        sendChatPlayer(value, "Inline rolls is empty!");
        return;
    }

    // log(inlineRolls[0]);
    const damageValue = inlineRolls[0].results.total;
    if (!_.isNumber(damageValue)) {
        sendChatPlayer(value, `Damage value is not a number! (${damageValue})`);
        return;
    }

    const damageItems = [];
    let heroes = 0;
    let enemies = 0;
    for (const selectedItem of selected) {
        const item = getObj('graphic', selectedItem._id);

        if (!item) {
            sendChatPlayer(value, "Could not find a graphic of the selected items!");
            return;
        }

        const damageItem = new DamageItem(item);
        damageItems.push(damageItem);

        if (damageItem.isHero) {
            heroes++;
        } else {
            enemies++;
        }
    }

    log(`Heroes: ${heroes}, Enemies: ${enemies}`);
    let attacker = null;

    if (heroes === 0 || enemies === 0) {
        attacker = damageItems.shift();
    } else if (isPlayerToEnemy) {
        damageItems.sort((x, y) => {
            if (x.isHero === y.isHero) {
                return x.name.localeCompare(y.name);
            }

            if (x.isHero) {
                return -1;
            }

            return 1;
        });

        attacker = damageItems.shift();
        log(`Sorting by player to enemy. Attacker is: ${attacker.name}`);
    } else {
        damageItems.sort((x, y) => {
            if (x.isHero === y.isHero) {
                return x.name.localeCompare(y.name);
            }

            if (x.isHero) {
                return 1;
            }

            return -1;
        });

        attacker = damageItems.shift();
        log(`Sorting by enemy to player. Attacker is: ${attacker.name}`);
    }

    for (const damageItem of damageItems) {
        const name = damageItem.name;
        const hpCurrent = damageItem.hp;
        const armorCurrent = damageItem.armor;

        if (!_.isNumber(hpCurrent)) {
            sendChatPlayer(value, `Targets (${name}) current hp is not a number! ${hpCurrent}`);
            return;
        }

        if (!_.isNumber(armorCurrent)) {
            sendChatPlayer(value, `Targets (${name}) current armor is not a number! ${armorCurrent}`);
            return;
        }

        if (hpCurrent <= 0) {
            sendChatPlayer(value, `${attacker.name} hits ${name} for [[${damageValue}]], but they are already dead!`);
            continue;
        }

        if (damageValue > armorCurrent) {
            damageItem.armorCurrent--;
        }

        const hitValue = Math.max(0, damageValue - armorCurrent);
        if (hitValue === 0) {
            sendChatPlayer(value, `${attacker.name} hits ${name} for [[${damageValue}]], but their armor [[${armorCurrent}]] stops it!`);    
            continue;
        }

        let reducedText = '';
        if (hitValue < damageValue) {
            reducedText = '(reduced)';
        }
        
        const newHp = Math.max(0, hpCurrent - hitValue);
        damageItem.hp = newHp;

        if (newHp === 0) {
            sendChatPlayer(value, `${attacker.name} hits ${name} for [[${damageValue}]], killing them!`);
            continue;
        }

        sendChatPlayer(value, `${attacker.name} hits ${name} for [[${damageValue}]]${reducedText}, new hp: [[${newHp}]], new armor: [[${damageItem.armor}]]!`);
    }
}

class DamageItem {
    constructor (graphic) {
        this.graphic = graphic;

        const characterId = graphic.get("represents");
        this.isHero = characterId && getAttrByName(characterId, "hero") === "1";
        this.isHero = !!this.isHero;

        this.name = graphic.get("name");
    }
    
    get armor() { return parseInt(this.graphic.get("bar2_value")); }
    set armor(value) { this.graphic.set("bar2_value", value); }
    get hp() { return parseInt(this.graphic.get("bar1_value")); }
    set hp(value) { this.graphic.set("bar1_value", value); }
}