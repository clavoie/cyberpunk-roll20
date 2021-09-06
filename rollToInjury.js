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