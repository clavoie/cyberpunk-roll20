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