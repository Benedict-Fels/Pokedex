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
let pokemonArray = [];
let pokemonObject = {};
let currentNumberPokemon = 0;

async function loadAPI() {
    let pokemonFullAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/`);
    let pokemonFullAPIAsJson = await pokemonFullAPI.json();
    console.log("Full", pokemonFullAPIAsJson);
    let pokemonAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/2`);
    let pokemonAPIAsJson = await pokemonAPI.json();
    console.log(pokemonAPIAsJson);
    loadSpeciesAPI();
    loadEvoAPI();
    load134API();
    loadSpecies134API();
    loadEvo134API();
}

async function loadSpeciesAPI() {
    let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/25/`);
    let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
    console.log("Species25", pokemonSpeciesAPIAsJson);
}

async function loadEvoAPI() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/10/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChain10", pokemonEvoAPIAsJson);
}

async function load134API() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/134/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("134", pokemonEvoAPIAsJson);
}

async function loadSpecies134API() {
    let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/134/`);
    let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
    console.log("Species134", pokemonSpeciesAPIAsJson);
}

async function loadEvo134API() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/67/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChainEevee", pokemonEvoAPIAsJson);
}

async function loadPokemon() {
    document.body.classList.add('disable-interaction');
    const pantomimeRef = document.getElementById('pantomimeID');
    pokemonLocation.classList.add("display-none");
    pantomimeRef.classList.remove("display-none");
    let pokemons = "";
    for (let index = currentNumberPokemon + 1; index < currentNumberPokemon + 25; index++) {
        await fetchPokemon(index);
        pokemons += pokemonTemplate(pokemonObject[index], index);
    }
    pokemonLocation.innerHTML += pokemons;
    let pokemon = Object.keys(pokemonObject);
    pokemon.forEach(pokemon => getTypesBackground(pokemonObject[pokemon]));
    pantomimeRef.classList.add("display-none");
    pokemonLocation.classList.remove("display-none");
    document.body.classList.remove('disable-interaction');
    currentNumberPokemon += 24;
}

async function fetchPokemon(index) {
    let pokemonAPIAsJson = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)).json();
    let newPokemon = {
        id: index,
        name: pokemonAPIAsJson.species.name,
        sprite: pokemonAPIAsJson.sprites.other["official-artwork"].front_default,
        types: pokemonAPIAsJson.types,
        stats: pokemonAPIAsJson.stats
    };
    pokemonObject[index] = newPokemon;
}

function stringToCapital(string) {
    return string.replace(/\b\w/g, letter => letter.toUpperCase())
}

function getTypesImage(types) {
    let typesImg = "";
    types.forEach((e, i) => {
        typesImg += `<img class="type-icon" src="./assets/types/${types[i].type.name}.png"></img>`
    });
    return typesImg;
}

function getTypesBackground(pokemon) {
    const pokemonDivRef = document.getElementById(`pokemon${pokemon.id}`)
    if (pokemon.types.length > 1) {
        pokemonDivRef.style.background = `linear-gradient(32deg,${assignColor(pokemon.types[0].type.name)} 53.2%, ${assignColor(pokemon.types[1].type.name)} 53.2%)`;
    } else {
        pokemonDivRef.style.backgroundColor = `${assignColor(pokemon.types[0].type.name)}`;
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
    loadPokeName(pokemonObject[i]);
    showDialogTypes(pokemonObject[i])
    showDialogPic(pokemonObject[i]);
    loadStats(pokemonObject[i]);
}

function loadPokeName(pokemon) {
    const dialogpokeNameRef = document.getElementById('dialogpokeNameID');
    dialogpokeNameRef.innerHTML = `
    #${pokemon.id.toString().padStart(3, "0")} ${stringToCapital(pokemon.name)}`
}

function showDialogTypes(pokemon) {
    const dialogPokemonTypesRef = document.getElementById('dialog-pokemon-typesID');
    dialogPokemonTypesRef.innerHTML =
        pokemon.types.map(pokeType => `
                            <img class="small-type" title="${stringToCapital(pokeType.type.name)}" src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${pokeType.type.name}.svg">`
        ).join('');
}

function showDialogPic(pokemon) {
    const dialogPicRef = document.getElementById('dialogPicID')
    dialogPicRef.innerHTML = `
                        <img class="dialog-pokemon-sprites" title="${stringToCapital(pokemon.name)}" src=${pokemon.sprite}></img>
                        `
    // if (pokemon.types.length > 1) {
    //     dialogPicRef.innerHTML += `
    //                      <div class="dialog-types-div">
    //                          <img class="small-type" title="${stringToCapital(pokemon.types[0].type.name)}" src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${pokemon.types[0].type.name}.svg">
    //                          <img class="small-type" title="${stringToCapital(pokemon.types[1].type.name)}" src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${pokemon.types[1].type.name}.svg">
    //                      </div>`
    // } else {
    //     dialogPicRef.innerHTML += `
    //      <div class="dialog-type-div">
    //          <img class="small-type" title="${stringToCapital(pokemon.types[0].type.name)}" src="https://raw.githubusercontent.com/partywhale/pokemon-type-icons/main/icons/${pokemon.types[0].type.name}.svg">
    //      </div>
    //     `
    // }
}

function closeDialog() {
    dialog.close();
    dialog.classList.remove("dialog");
    // closeButton.classList.remove("button-press");
}

function loadStats(pokemon) {
    statsRef.classList.add("red-underline");
    dialogContentRef.innerHTML = "";
    pokemon.stats.forEach(pokeStat => {
        dialogContentRef.innerHTML += `
        <div class="dialog-stat-div">
            <p class="pokemon-stat-name">${getStatName(pokeStat.stat.name)}</p>
            <p class="pokemon-stat-value">${pokeStat.base_stat}</p> 
            <div class="stat-bar" style="background: linear-gradient(90deg, ${getStatColor(pokeStat.base_stat)} ${(pokeStat.base_stat / 150) * 100}%, #ccc ${(pokeStat.base_stat / 150) * 100}%)"></div>
        </div>
        `
    });
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

function loadEvolution() {
    let evolutionChain = pokemonObject[currentIndex].evoChain;
    dialogContentRef.innerHTML = evolutionChain.map((evoIndex, i) => {
        let html = `<img class="evo-sprites" title="${stringToCapital(pokemonObject[evoIndex.id].name)}" src="${pokemonObject[evoIndex.id].sprite}">`;
        if (i < evolutionChain.length - 1) {
            let nextLevel = evolutionChain[i + 1].minLevel;
            html += `
                <div class="evo-arrow-container">
                <p>${nextLevel ? 'Lvl ' + nextLevel : '?'}</p>
                    <span>↓</span>
                </div>`;
        }

        return html;
    }).join('');
    dialogContentRef.classList.add('evo-content')
}

async function getEvolution() {
    let SpeciesAPI = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentIndex}/`)).json();
    let EvoAPI = await (await fetch(`${SpeciesAPI.evolution_chain.url}`)).json();
    let evoArray = getEvoArray(EvoAPI.chain);
    for (const pokemon of evoArray){
    // evoArray.forEach(pokemon => {
        if (!pokemonObject[pokemon.id]) {
          await fetchPokemon(pokemon.id);
        }
        pokemonObject[pokemon.id].evoChain = evoArray;
    };
    loadEvolution();
}


function getEvoArray(chain, pokemonIDs = []) {
    let currentStep = {
        id: cutOutIndex(chain.species.url),
        minLevel: chain.evolution_details && chain.evolution_details.length > 0
            ? chain.evolution_details[0].min_level
            : null
    };
    pokemonIDs.push(currentStep);
    if (chain.evolves_to.length > 0) {
        getEvoArray(chain.evolves_to[0], pokemonIDs);
    }
    return pokemonIDs;
}

function cutOutIndex(url) {
    const parts = url.split('/');
    return parts[parts.length - 2];
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

function swipeLeft() {
    currentIndex -= 1;
    loadPokeName(pokemonObject[currentIndex]);
    showDialogTypes(pokemonObject[currentIndex]);
    showDialogPic(pokemonObject[currentIndex]);
    loadStats(pokemonObject[currentIndex]);
}

async function swipeRight() {
    if (currentNumberPokemon - 1 == currentIndex) {
        await loadPokemon();
    }
    currentIndex += 1;
    loadPokeName(pokemonObject[currentIndex]);
    showDialogTypes(pokemonObject[currentIndex]);
    showDialogPic(pokemonObject[currentIndex]);
    loadStats(pokemonObject[currentIndex]);
}
