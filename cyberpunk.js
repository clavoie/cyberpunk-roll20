function sendChatCharacter(characterId, message) {
    sendChat('character|'+characterId, message);
}

function sendChatPlayer(value, message) {
    sendChat('player|'+value.playerid, message);
}

on("chat:message", function (value) {
    log(value);
    if (value.type !== "api") {
        log("Not an api message: '" + value.type + "'. Exiting");
        return;
    }
    
    const args = value.content.split(' ');
    const content = args.shift();
    
    if (content === "!damage") {
        if (args.length !== 3) {
            sendChatPlayer(value, `Wrong number of args to damage! [${args.join(', ')}]`);
            return;
        }

        dealDamage(value, args[1] === "true", args[2] === "true");
        return;
    }
    
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
