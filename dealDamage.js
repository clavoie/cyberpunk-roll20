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

    const targets = [];
    let heroes = 0;
    let enemies = 0;
    for (const selectedItem of selected) {
        const item = getObj('graphic', selectedItem._id);

        if (!item) {
            sendChatPlayer(value, "Could not find a graphic of the selected items!");
            return;
        }

        const target = new DamageItem(item);
        targets.push(target);

        if (target.isHero) {
            heroes++;
        } else {
            enemies++;
        }
    }

    log(`Heroes: ${heroes}, Enemies: ${enemies}`);
    let attacker = null;

    if (heroes === 0 || enemies === 0) {
        attacker = targets.shift();
    } else if (isPlayerToEnemy) {
        targets.sort((x, y) => {
            if (x.isHero === y.isHero) {
                return x.name.localeCompare(y.name);
            }

            if (x.isHero) {
                return -1;
            }

            return 1;
        });

        attacker = targets.shift();
        log(`Sorting by player to enemy. Attacker is: ${attacker.name}`);
    } else {
        targets.sort((x, y) => {
            if (x.isHero === y.isHero) {
                return x.name.localeCompare(y.name);
            }

            if (x.isHero) {
                return 1;
            }

            return -1;
        });

        attacker = targets.shift();
        log(`Sorting by enemy to player. Attacker is: ${attacker.name}`);
    }

    for (const target of targets) {
        const name = target.name;
        const hpCurrent = target.hp;
        const armorPristine = target.armor;
        let armorCurrent = target.armor;

        if (!_.isNumber(hpCurrent)) {
            sendChatPlayer(value, `Targets (${name}) current hp is not a number! ${hpCurrent}`);
            return;
        }

        if (!_.isNumber(armorCurrent)) {
            sendChatPlayer(value, `Targets (${name}) current armor is not a number! ${armorCurrent}`);
            return;
        }

        if (hpCurrent <= 0) {
            attacker.sendHitText(`hits ${name}, but they are already dead!`);
            continue;
        }

        if (!isRanged) {
            armorCurrent = Math.ceil(armorCurrent/2);
        }

        if (damageValue > armorCurrent) {
            target.armor--;
        }

        const hitValue = Math.max(0, damageValue - armorCurrent);
        let hitValueText = ` for [[${hitValue}]] (🗡[[${damageValue}]] - 🛡[[${armorCurrent}]])`;
        if (!target.isHero) {
            hitValueText = "";
        }

        if (hitValue === 0) {
            attacker.sendHitText(`hits ${name}${hitValueText}, but their 🛡 stops it!`);    
            continue;
        }
        
        const newHp = Math.max(0, hpCurrent - hitValue);
        target.hp = newHp;

        if (newHp === 0) {
            attacker.sendHitText(`hits ${name}${hitValueText}, killing them!`);
            continue;
        }

        let updateText = ` ♥[[${hpCurrent}]]➡[[${newHp}]] 🛡[[${armorPristine}]]➡[[${target.armor}]]`;
        if (!target.isHero) {
            updateText = "";
        }

        if (!target.isHero) {
            if (hitValue <= 5) {
                hitValueText = ", dealing some damage";
            } else if (hitValue <= 10) {
                hitValueText = ", dealing solid damage";
            } else {
                hitValueText = ", dealing massive damage";
            }
        }

        attacker.sendHitText(`hits ${name}${hitValueText}!${updateText}`);
    }
}

class DamageItem {
    constructor (graphic) {
        this.graphic = graphic;
        log(graphic.get("statusmarkers"));

        const characterId = graphic.get("represents");
        this.isHero = characterId && getAttrByName(characterId, "hero") === "1";
        this.isHero = !!this.isHero;
        this.characterId = characterId;

        this.name = graphic.get("name");
    }
    
    get armor() { return parseInt(this.graphic.get("bar2_value")); }
    set armor(value) { this.graphic.set("bar2_value", value); }
    get hp() { return parseInt(this.graphic.get("bar1_value")); }
    set hp(value) { 
        this.graphic.set("bar1_value", value);

        if (value > 0) {
            return;
        }

        const markers = this.graphic.get("statusmarkers");
        if (markers.includes("dead")) {
            return;
        }

        this.graphic.set("statusmarkers", markers + ",dead");
    }

    sendHitText (text) {
        if (this.characterId) {
            sendChatCharacter(this.characterId, "/em " + text);
            return;
        }

        sendChat(this.name, `/em ${text}`);
    }
}