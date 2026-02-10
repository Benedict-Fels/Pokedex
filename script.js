
const pokemonLocation = document.getElementById("content");
const dialogContentRef = document.getElementById("dialog-contentID");
let pokemonObject = {};
let currentNumberPokemon = 0;
let searchState = false;
let currentSearchResults = [];
let searchArray = [];

// async function loadAPI() {
//     let pokemonFullAPI = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=1024`);
//     let pokemonFullAPIAsJson = await pokemonFullAPI.json();
//     console.log("Full", pokemonFullAPIAsJson);
//     let pokemonAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/2`);
//     let pokemonAPIAsJson = await pokemonAPI.json();
//     console.log(pokemonAPIAsJson);
//     loadSpeciesAPI();
//     loadEvoAPI();
//     load134API();
//     loadSpecies134API();
//     loadEvo14API()
//     loadEvo134API();
// }

async function loadSpeciesAPI() {
    let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/133`);
    let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
    console.log("Species133", pokemonSpeciesAPIAsJson);
    loadEvoAPI();
    loadSpecies134API();
    loadEvo14API();
    loadEvo10API();
}

async function loadEvoAPI() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/67/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChainEevee", pokemonEvoAPIAsJson);
}

// async function load134API() {
//     let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/30/`);
//     let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
//     console.log("30", pokemonEvoAPIAsJson);
// }

async function loadSpecies134API() {
    let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/113/`);
    let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
    console.log("Species113", pokemonSpeciesAPIAsJson);
}

async function loadEvo14API() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/51/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChain51", pokemonEvoAPIAsJson);
}

async function loadEvo10API() {
    let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/10/`);
    let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
    console.log("EvoChain510", pokemonEvoAPIAsJson);
}

// async function loadEvo134API() {
//     let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/67/`);
//     let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
//     console.log("EvoChainEevee", pokemonEvoAPIAsJson);
// }

async function getMorePokemon() {
    document.body.classList.add('disable-interaction');
    const pantomimeRef = document.getElementById('pantomimeID');
    pokemonLocation.style.visibility = "hidden";
    pantomimeRef.classList.remove("display-none");
    let myIndex = currentNumberPokemon
    for (let index = myIndex + 1; index < myIndex + 25; index++) {
        await getPokemon(index);
        currentNumberPokemon += 1;
    }
    pantomimeRef.classList.add("display-none");
    pokemonLocation.style.visibility = "visible";
    document.body.classList.remove('disable-interaction');
}

async function getPokemon(index) {
    await fetchPokemon(index);
    loadPokemon(index);
}

function loadCurrentPokemon() {
    pokemonLocation.innerHTML = "";
    let currentPokemon = currentNumberPokemon;
    for (let i = 1; i <= currentPokemon; i++) {
        loadPokemon(i);
    }
    return currentNumberPokemon = currentPokemon;
}

async function preloadSearchList() {
    const data = await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=1024')).json();
    allPokemonSearchList = data.results.map((pokemon) => ({
        name: pokemon.name,
        id: cutOutIndex(pokemon.url)
    }));
}

function loadPokemon(index) {
    pokemonLocation.innerHTML += pokemonTemplate(pokemonObject[index], index);
    getTypesBackground(pokemonObject[index]);
}

async function searchPokemon(searchInput) {
    const searchTerm = searchInput.toLowerCase();
    if (searchTerm.length === 0) {
        loadCurrentPokemon();
        searchState = false;
        return
    }
    if (searchTerm.length < 3) {
        return;
    }
    searchState = true;
    currentSearchResults = allPokemonSearchList.filter(p =>
        p.name.includes(searchTerm) || p.id.toString() === searchTerm
    );

    if (currentSearchResults.length < 1) {
        pokemonLocation.innerHTML = `<p class="black">No Pokemons found for this search</p>`;
    } else {
        pokemonLocation.innerHTML = "";
        searchArray = [];
        for (const pokemon of currentSearchResults) {
            await getPokemon(pokemon.id);
            searchArray.push(Number(pokemon.id))
        };
    }
}

async function fetchPokemon(index) {
    if (!pokemonObject[index]) {
        let pokemonAPI = await (await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`)).json();
        let newPokemon = {
            id: index,
            name: pokemonAPI.species.name,
            sprite: pokemonAPI.sprites.other["official-artwork"].front_default,
            types: pokemonAPI.types,
            stats: pokemonAPI.stats,
            abilitiesURL: pokemonAPI.abilities,
        };
        pokemonObject[index] = newPokemon;
    }
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