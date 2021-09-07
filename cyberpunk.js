function sendChatCharacter(characterId, message) {
    sendChat('character|'+characterId, message);
}

function sendChatPlayer(value, message) {
    sendChat('player|'+value.playerid, message);
}

/**
 * https://app.roll20.net/forum/post/8087224/script-find-token/?pageforid=8089453#post-8089453
 * @param {string} playerId
 */
function getPageForPlayer (playerId) {
    const player = getObj('player', playerId);

    if (playerIsGM(playerId)) {
        return player.get('lastpage');
    }

    let psp = Campaign().get('playerspecificpages');
    if (psp[playerId]) {
        return psp[playerId];
    }

    return Campaign().get('playerpageid');
}

function getToken (tokenName, pageId, chatMessagePlayerId, isGm) {
    const tokens = findObjs({
        _pageid: pageId,
        _type: "graphic",
        _name: tokenName
    }).filter((token) => {
        let controlledby = (getObj('character', token.get('represents')) || token).get('controlledby');
        return isGm || controlledby.split(",").includes('all') || controlledby.split(",").includes(chatMessagePlayerId);
    });

    return tokens[0] || '';
};

on("chat:message", function (chatMessage) {
    log(chatMessage);
    if (chatMessage.type !== "api") {
        log("Not an api message: '" + chatMessage.type + "'. Exiting");
        return;
    }
    
    const args = chatMessage.content.split(' ');
    const command = args.shift();
    const isGm = playerIsGM(chatMessage.playerid);
    const playerId = chatMessage.playerid;
    const playerName = chatMessage.who || getObj('player', chatMessage.playerid).get('_displayname');
    
    if (command === "!damage") {
        if (args.length !== 3) {
            // args[0] is the damage value
            sendChatPlayer(chatMessage, `Wrong number of args to damage! [${args.join(', ')}]`);
            return;
        }

        dealDamage(chatMessage, args[1] === "true", args[2] === "true");
        return;
    }

    if (command === "!roll-weapon") {
        if (args.length !== 2) {
            sendChatPlayer(chatMessage, `Wrong number of args to roll weapon! [${args.join(', ')}]`);
            return;
        }

        const pageId = getPageForPlayer(playerId);
        if (!pageId) {
            sendChatPlayer(chatMessage, `Could not find the current players page!`);
            return;
        }

        const playerToken = getToken(playerName, pageId, playerName, isGm);
        if (!playerToken) {
            sendChatPlayer(chatMessage, `Could not find the current players token!`);
            return;
        }

        const targetToken = getObj('graphic', args[0]);
        if (!targetToken) {
            sendChatPlayer(chatMessage, `Could not find the targets token!`);
            return;
        }
        
        sendChatPlayer(chatMessage, `roll-weapon ${playerName}, ${targetToken.get('name')}, ${args[1]}`);
    }
    
    if (command === "!critbody") {
        log("Rolling body crit");
        rollAndDisplayCritBody();
        return;
    }
    
    if (command === "!dvpistol") {
        printRangedDv("Pistol");
        return;
    }
    
    if (command === "!dvsmg") {
        printRangedDv("SMG");
        return;
    }
    
    if (command === "!dvshotgun") {
        printRangedDv("Shotgun");
        return;
    }
    
    if (command === "!dvgrenade") {
        printRangedDv("Grenade");
        return;
    }
    
    if (command === "!speedheal") {
        log("Using speedheal");
        useSpeedheal(chatMessage);
        return;
    }
});
