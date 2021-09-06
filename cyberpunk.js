function sendChatCharacter(characterId, message) {
    sendChat('character|'+characterId, message);
}

function sendChatPlayer(value, message) {
    sendChat('player|'+value.playerid, message);
}

const rollToInjury = {};
rollToInjury[2] = ['Dismembered Arm', 'The Dismembered Arm is gone. You drop any items in that dismemberedarm\'s hand immediately. Base Death Save Penalty is increased by 1.\n\nQuick Fix: N/A\n\nTreatment: Surgery DV17'];
rollToInjury[3] = ['Dismembered Hand', 'The Dismembered Hand is gone. You drop any items in the dismembered hand immediately. Base Death Save Penalty is increased by 1.\n\nQuick Fix: N/A\n\nTreatment: Surgery DV17'];
rollToInjury[4] = ['Collapsed Lung', '-2 to MOVE (minimum 1) Base Death Save Penalty is increased by 1.\n\nQuick Fix: Paramedic DV15\n\nTreatment: Surgery DV15'];
rollToInjury[5] = ['Broken Ribs', 'At the end of every Turn where you move further than 4m/yds on foot, you re-suffer this Critical Injury\'s Bonus Damage directly to your Hit Points.\n\nQuick Fix: Paramedic DV13\n\nTreatment: Surgery DV13 or Paramedic DV15'];
rollToInjury[6] = ['Broken Arm', 'The Broken Arm cannot be used. You drop any items in that arm\'s hand immediately.\n\nQuick Fix: Paramedic DV13\n\nTreatment: Surgery DV13 or Paramedic DV15'];
rollToInjury[7] = ['Foreign Object', 'At the end of every Turn where you move further than 4m/yds on foot, youre-suffer this Critical Injury\'s Bonus Damage directly to your Hit Points.\n\nQuick Fix: First Aid or Paramedic DV13\n\nTreatment: Quick Fix removes injury'];
rollToInjury[8] = ['Broken Leg', '-4 to MOVE (minimum 1)\n\nQuick Fix: Paramedic DV13\n\nTreatment: Surgery DV13 or Paramedic DV15'];
rollToInjury[9] = ['Torn Muscle', '-2 to Melee Attacks\n\nQuick Fix: First Aid or Paramedic DV13\n\nTreatment: Quick Fix removes injury'];
rollToInjury[10] = ['Spinal Injury', 'Next Turn, you cannot take an Action, but you can still take a Move Action. Base Death Save Penalty is increased by 1.\n\nQuick Fix: Paramedic DV15\n\nTreatment: Surgery DV15'];
rollToInjury[11] = ['Crushed Fingers', '-4 to all Actions involving that hand\n\nQuick Fix: Paramedic DV13\n\nTreatment: Surgery DV15'];
rollToInjury[12] = ['Dismembered Leg', 'The Dismembered Leg is gone. -6 to MOVE (minimum 1) You cannot dodge attacks. Base Death Save Penalty is increased by 1.\n\nQuick Fix: N/A\n\nTreatment: Surgery DV17'];

function rollAndDisplayCritBody() {
    const d1 = randomInteger(6);
    const d2 = randomInteger(6);
    const injury = rollToInjury[d1+d2];
    sendChat('', '&{template:minimal}{{charactername=Critical Injury Body}}{{label=' + injury[0] + '}}{{roll=[[' + d1 + '+' + d2 + ']]}}{{message=' + injury[1] + '}}');
}

function useSpeedheal(value) {
    const selected = value.selected;
    if (!selected || !selected.length) {
        sendChatPlayer(value, "I need to select my character! (nothing selected)");
        return;
    }
    
    const graphic = getObj('graphic', selected[0]._id);
    if (!graphic) {
        sendChatPlayer(value, "I need to select my character! (something selected but not a token)");
        return;
    }
    
    const characterId = graphic.get("represents");
    if (!characterId) {
        sendChatPlayer(value, "Chris done fucked up! (something selected that's a token, but not a character)");
        return;
    }
    
    const hpCurrent = parseInt(getAttrByName(characterId, "hp"));
    const hpMax = parseInt(getAttrByName(characterId, "hp", "max"));
    
    if (hpCurrent >= hpMax) {
        sendChatCharacter(characterId, "I'm already at max health. No need for speedheal.");
        return;
    }
    
    const speedheals = parseInt(getAttrByName(characterId, "speedheal"));
    
    if (speedheals <= 0) {
        sendChatCharacter(characterId, "I don't have any speedheals left to use!");
        return;
    }
    
    const speedhealAttrs = findObjs({
        _type: "attribute",
        _characterid: characterId,
        name: "speedheal"
    });
    
    if (!speedhealAttrs || !speedhealAttrs.length) {
        sendChatCharacter(characterId, "I couldn't find my speedheals!");
        return;
    }
    
    const speedhealAttr = speedhealAttrs[0];
    const hpAttrs = findObjs({
        _type: "attribute",
        _characterid: characterId,
        name: "hp"
    });
    
    if (!hpAttrs || !hpAttrs.length) {
        sendChatCharacter(characterId, "I couldn't find my hp!");
        return;
    }
    
    const hpAttr = hpAttrs[0];
    const willpower = parseInt(getAttrByName(characterId, "stat_will"));
    const body = parseInt(getAttrByName(characterId, "stat_body"));
    
    if (!willpower) {
        sendChatCharacter(characterId, "Something might be wrong. Willpower is 0.");
        return;
    }
    
    if (!body) {
        sendChatCharacter(characterId, "Something might be wrong. Body is 0.");
        return;
    }
    
    // log(hpCurrent + ": " + body + ": " + willpower + ": " + hpMax);
    
    let hpNew = hpCurrent + body + willpower;
    if (hpNew > hpMax) {
        hpNew = hpMax;
    }
    
    const speedhealsNew = speedheals - 1;
    hpAttr.set("current", hpNew);
    speedhealAttr.set("current", speedhealsNew);
    sendChatCharacter(characterId, "/em Healed [[" + (hpNew-hpCurrent) + "]] hp and used one speedheal. [[" + speedhealsNew + "]] speedheals remaining.");
}

const dvs = {
    'Pistol': [
        "0m to 6m\t\t13",
        "7m to 12m\t\t15",
        "13m to 25m\t\t20",
        "26m to 50m\t\t25",
        "51m to 100m\t\t30",
        "101m to 200m\t\t30",
    ].join('\n'),
    'SMG': [
        "0m to 6m\t\t15",
        "7m to 12m\t\t13",
        "13m to 25m\t\t15",
        "26m to 50m\t\t20",
        "51m to 100m\t\t25",
        "101m to 200m\t\t25",
        "201m to 400m\t\t30",
    ].join('\n'),
    'Shotgun': [
        "0m to 6m\t\t13",
        "7m to 12m\t\t15",
        "13m to 25m\t\t20",
        "26m to 50m\t\t25",
        "51m to 100m\t\t30",
        "101m to 200m\t\t35",
    ].join('\n'),
    'Grenade': [
        "0m to 6m\t\t16",
        "7m to 12m\t\t15",
        "13m to 25m\t\t15",
        "26m to 50m\t\t17",
        "51m to 100m\t\t20",
        "101m to 200m\t\t22",
        "201m to 400m\t\t25",
    ].join('\n'),
};

function printRangedDv(type) {
    sendChat('', '&{template:minimal}{{charactername=' + type + '}}{{message=' + dvs[type] + '}}');
}

on("chat:message", function (value) {
    log(value);
    if (value.type !== "api") {
        log("Not an api message: '" + value.type + "'. Exiting");
        return;
    }
    
    const content = value.content;
    if (content === "!critbody") {
        log("Rolling body crit");
        rollAndDisplayCritBody();
        return;
    }
    
    if (content === "!dvpistol") {
        printRangedDv("Pistol");
        return;
    }
    
    if (content === "!dvsmg") {
        printRangedDv("SMG");
        return;
    }
    
    if (content === "!dvshotgun") {
        printRangedDv("Shotgun");
        return;
    }
    
    if (content === "!dvgrenade") {
        printRangedDv("Grenade");
        return;
    }
    
    if (content === "!speedheal") {
        log("Using speedheal");
        useSpeedheal(value);
        return;
    }
});
