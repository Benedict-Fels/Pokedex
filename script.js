const dialog = document.getElementById("dialogID");
const dialogName = document.getElementById("pokemonName");
const dialogImage = document.getElementById("dialogImage");
const dialogFooterNumber = document.getElementById("dialogFooterNumberID");
let currentIndex = 0;
const closeButton = document.getElementById("closeButton");

const dialogDiv = document.getElementById('dialogDivID');
dialogDiv.addEventListener('click', (event) => event.stopPropagation());

const pokemonLocation = document.getElementById("content");
const dialogContentRef = document.getElementById("dialog-contentID");
const statsRef = document.getElementById("statsID");
let pokemonArray = []
let currentNumberPokemon = 0;

async function loadAPI() {
    let pokemonAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/2`);
    let pokemonAPIAsJson = await pokemonAPI.json();
    console.log(pokemonAPIAsJson);
    loadSpeciesAPI();
    loadEvoAPI();
    load108API();
    loadSpecies108API();
    loadEvo108API();
}

async function loadSpeciesAPI() {
    let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/2/`);
    let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
    console.log("Species2", pokemonSpeciesAPIAsJson);
}

async function loadEvoAPI() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/1/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChain2", pokemonEvoAPIAsJson);
}

async function load108API() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/108/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("108", pokemonEvoAPIAsJson);
}

async function loadSpecies108API() {
    let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/108/`);
    let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
    console.log("Species108", pokemonSpeciesAPIAsJson);
}

async function loadEvo108API() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/108/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChain108", pokemonEvoAPIAsJson);
}

async function loadPokemon() {
    document.body.classList.add('disable-interaction');
    const pantomimeRef = document.getElementById('pantomimeID');
    pantomimeRef.classList.remove("display-none");
    for (let index = currentNumberPokemon + 1; index < currentNumberPokemon + 25; index++) {
        let pokemonAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
        let pokemonAPIAsJson = await pokemonAPI.json();
        pokemonArray.push(pokemonAPIAsJson);
        let types = pokemonAPIAsJson.types;
        pokemonLocation.innerHTML += `  
                                     <div id="pokemon${index}" class="pokemon-div" onclick="openDialog(${index -1})">
                                         <div class="pokemon-overview">
                                             <p>#${index}</p> 
                                             <p>${pokemonAPIAsJson.species.name.replace(/\b\w/g, letter => letter.toUpperCase())}</p>
                                             <p></p>
                                         </div>
                                         <img class="pokemon-sprites" src=${pokemonAPIAsJson.sprites.other["official-artwork"].front_default}></img>
                                         <img class="pokeball-background" src=./assets/pokeballbackground-removebg-preview.png></img>
                                         <div class="type-icon-div">
                                                ${getTypesImage(types)}
                                         </div>
                                     </div>`;
        getTypesBackground(types, index)
    }
    pantomimeRef.classList.add("display-none");
    document.body.classList.remove('disable-interaction');
    currentNumberPokemon += 24;
}

function getTypesImage(types) {
    let typesImg = "";
    types.forEach((e, i) => {
        typesImg += `<img class="type-icon" src="./assets/types/${types[i].type.name}.png"></img>`
    });
    return typesImg;
}

function getTypesBackground(types, index) {
    const pokemonDivRef = document.getElementById(`pokemon${index}`)
    if (types.length > 1) {
        pokemonDivRef.style.background = `linear-gradient(32deg,${assignColor(types[0].type.name)} 53.2%, ${assignColor(types[1].type.name)} 53.2%)`;
    } else {
        pokemonDivRef.style.backgroundColor = `${assignColor(types[0].type.name)}`
    }
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

function openDialog(i) {
    currentIndex = i;
    dialog.showModal();
    dialog.classList.add("dialog");
    showDialogPic(i);
    loadStats(i);
}

function showDialogPic(i) {
    const dialogPicRef = document.getElementById('dialogPicID')
    dialogPicRef.innerHTML = `
                        <img class="dialog-pokemon-sprites" src=${pokemonArray[i].sprites.other["official-artwork"].front_default}></img>
                        `
}

function closeDialog() {
    dialog.close();
    dialog.classList.remove("dialog");
    // closeButton.classList.remove("button-press");
}

function loadStats(i) {
    statsRef.classList.add("red-underline")
    dialogContentRef.innerHTML = "";
    pokemonArray[i].stats.forEach(pokeStat => {
        dialogContentRef.innerHTML += `
        <div class="dialog-stat-div">
            <p class="pokemon-stat-name">${getStatName(pokeStat.stat.name)}</p>
            <p class="pokemon-stat-value">${pokeStat.base_stat}</p> 
            <div class="stat-bar" style="background: linear-gradient(90deg, ${getStatColor(pokeStat.base_stat)} ${pokeStat.base_stat}%, #ccc ${pokeStat.base_stat}%)"></div>
        </div>
        `
    });
}

function getStatName(name) {
    let Name = name.charAt(0).toUpperCase() + name.slice(1);
    switch (Name) {
        case "Hp": return "HP";
        case "Special-attack": return "Sp. Atk";
        case "Special-defense": return "Sp. Def";
        default: return Name;
    }
}

function getStatColor(statValue) {
    switch (true) {
        case statValue <= 30: return "yellow";
        case statValue >= 80: return "green";
        default: return "blue";
    }
}

// function registerClickXButton() {
//     closeButton.classList.add("button-press");
// }

document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
        closeDialog();
    }
    if (event.key === 'ArrowLeft') {
        swipeLeft();
    }
    if (event.key === 'ArrowRight') {
        swipeRight();
    }
})

// function displayPic(picIndex) {
//     dialogImage.src = `./img/${photos[picIndex]}`;
//     dialogImage.setAttribute("alt", `${photosAltName[picIndex]}`);
//     dialogName.innerHTML = photosAltName[picIndex];
//     dialogFooterNumber.innerHTML = `${picIndex + 1} / ${photos.length}`;
//     return currentIndex = picIndex;

// }

function swipeLeft() {
    currentIndex -= 1;
    showDialogPic(currentIndex);
    loadStats(currentIndex);
}

async function swipeRight() {
    if (currentNumberPokemon -1 == currentIndex) {
     await loadPokemon();
    }
    currentIndex += 1;
    showDialogPic(currentIndex);
    loadStats(currentIndex);
}
