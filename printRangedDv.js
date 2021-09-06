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