
function stringToCapital(string) {
    return string.replace(/\b\w/g, letter => letter.toUpperCase())
}

function assignColor(type) {
    switch (type) {
        case "normal": return "rgb(159,161,159)";
        case "fighting": return "rgb(255,128,0)";
        case "flying": return "rgb(129,185,239)";
        case "poison": return "rgb(144,64,204)";
        case "ground": return "rgb(145,81,33)";
        case "rock": return "rgb(175,169,129)";
        case "bug": return "rgb(145,161,25)";
        case "ghost": return "rgb(112,65,112)";
        case "steel": return "rgb(96,161,184)";
        case "fire": return "rgb(230,40,41)";
        case "water": return "rgb(41,128,239)";
        case "grass": return "rgb(66,161,41)";
        case "electric": return "rgb(250,192,0)";
        case "psychic": return "rgb(241,65,121)";
        case "ice": return "rgb(63,216,255)";
        case "dragon": return "rgb(80,97,225)";
        case "dark": return "rgb(80,65,63)";
        case "fairy": return "rgb(241,112,241)";
    }
}

function getStatName(name) {
    switch (name) {
        case "hp": return "HP";
        case "special-attack": return "Sp. Atk";
        case "special-defense": return "Sp. Def";
        default: return name.charAt(0).toUpperCase() + name.slice(1);
    }
}

function getStatColor(statValue) {
    switch (true) {
        case (statValue / 150) * 100 <= 20: return "rgb(255, 60, 60)";
        case (statValue / 150) * 100 <= 40: return "rgb(255, 150, 50)";
        case (statValue / 150) * 100 <= 60: return "rgb(255, 210, 0)";
        case (statValue / 150) * 100 <= 80: return "rgb(160, 230, 50)";
        case (statValue / 150) * 100 > 80: return "rgb(0, 200, 100)";
    }
}


function cutOutIndex(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
}