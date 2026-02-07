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

async function getMorePokemon() {
    let myIndex = currentNumberPokemon
    for (let index = myIndex + 1; index < myIndex + 25; index++) {
      await getPokemon(index)
    }
}

async function getPokemon(index) {
    await fetchPokemon(index);
    await loadPokemon(index);
    
}

async function loadPokemon(index) {
    document.body.classList.add('disable-interaction');
    const pantomimeRef = document.getElementById('pantomimeID');
    pokemonLocation.classList.add("display-none");
    pantomimeRef.classList.remove("display-none");
    pokemonLocation.innerHTML += pokemonTemplate(pokemonObject[index], index);
    getTypesBackground(pokemonObject[index]);
    pantomimeRef.classList.add("display-none");
    pokemonLocation.classList.remove("display-none");
    document.body.classList.remove('disable-interaction');
    currentNumberPokemon += 1;
}

async function fetchPokemon(index) {
    let pokemonAPIAsJson = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)).json();
    let pokemonSpeciesAPIAsJson = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)).json();
    let newPokemon = {
        id: index,
        name: pokemonAPIAsJson.species.name,
        // flavorText: pokemonSpeciesAPIAsJson.fl
        sprite: pokemonAPIAsJson.sprites.other["official-artwork"].front_default,
        types: pokemonAPIAsJson.types,
        stats: pokemonAPIAsJson.stats
    };
    pokemonObject[index] = newPokemon;
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
}

function closeDialog() {
    dialog.close();
    dialog.classList.remove("dialog");
    // closeButton.classList.remove("button-press");
}

function loadDescription(pokemon) {
    const description = pokemon.flavor_text_entries.find(entry =>
        entry.language.name === 'en' && entry.version.name === 'scarlet' || entry.version.name === 'violet'
    );

    // const fallbackEntry = SpeciesAPI.flavor_text_entries.find(entry => 
    //     entry.language.name === 'en'
    // );

    const finalDescription = (scarletEntry || fallbackEntry).flavor_text.replace(/[\n\f\r]/g, " ");
}

function loadStats(pokemon) {
    statsRef.classList.add("red-underline");
    dialogContentRef.classList.remove('evo-content')
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
    dialogContentRef.classList.add('evo-content');
}

async function getEvolution() {
    let SpeciesAPI = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentIndex}/`)).json();
    let EvoAPI = await (await fetch(`${SpeciesAPI.evolution_chain.url}`)).json();
    let evoArray = getEvoArray(EvoAPI.chain);
    for (const pokemon of evoArray) {
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
        getMorePokemon();
    }
    currentIndex += 1;
    loadPokeName(pokemonObject[currentIndex]);
    showDialogTypes(pokemonObject[currentIndex]);
    showDialogPic(pokemonObject[currentIndex]);
    loadStats(pokemonObject[currentIndex]);
}
