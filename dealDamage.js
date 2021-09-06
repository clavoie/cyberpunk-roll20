function dealDamage(value) {
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
    
    const attacker = getObj('graphic', selected.shift()._id);
    if (!attacker) {
        sendChatPlayer(value, "Could not find the attacker!");
        return;
    }

    const attackerName = attacker.attributes.name;

    for (const targetSelected of selected) {
        const targetGraphic = getObj('graphic', targetSelected._id);

        if (!targetGraphic){
            sendChatPlayer(value, "Could not find one of the targets!");
            return;
        }

        // log(targetGraphic);
        // log(Object.getOwnPropertyNames(targetGraphic));
        // log(targetGraphic.attributes);
        // log("NAME: " + targetGraphic.get('name'));
        const name = targetGraphic.attributes.name;
        const hpCurrent = targetGraphic.attributes.bar1_value;
        const armorCurrent = targetGraphic.attributes.bar2_value;

        if (!_.isNumber(hpCurrent)) {
            sendChatPlayer(value, `Targets (${name}) current hp is not a number! ${hpCurrent}`);
            return;
        }

        if (!_.isNumber(armorCurrent)) {
            sendChatPlayer(value, `Targets (${name}) current armor is not a number! ${armorCurrent}`);
            return;
        }

        if (hpCurrent <= 0) {
            sendChatPlayer(value, `${attackerName} hits ${name} for ${damageValue}, but they are already dead!`);
            continue;
        }

        if (damageValue > armorCurrent) {
            // log(`${damageValue} > ${armorCurrent} = armor ablated`);
            targetGraphic.set('bar2_value', armorCurrent-1);
            // targetGraphic.attributes.bar2_value--;
        }

        log(`${damageValue} - ${armorCurrent} = ${damageValue - armorCurrent}`);
        const hitValue = Math.max(0, damageValue - armorCurrent);
        
        log(`Hit value: ${hitValue}`);
        if (hitValue === 0) {
            sendChatPlayer(value, `${attackerName} hits ${name} for ${damageValue}, but their armor (${armorCurrent}) stops it!`);    
            continue;
        }

        let reducedText = '';
        if (hitValue < damageValue) {
            reducedText = '(reduced)';
        }
        
        const newHp = Math.max(0, hpCurrent - hitValue);
        targetGraphic.set('bar1_value', newHp);

        if (newHp === 0) {
            sendChatPlayer(value, `${attackerName} hits ${name} for ${damageValue}, killing them!`);
            continue;
        }

        sendChatPlayer(value, `${attackerName} hits ${name} for ${damageValue}${reducedText}, new hp: ${newHp}, new armor: ${targetGraphic.attributes.bar2_value}!`);
    }
}