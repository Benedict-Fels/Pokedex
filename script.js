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
let pokemonObject = {};
let currentNumberPokemon = 0;

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

// async function loadSpeciesAPI() {
//     let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/10202/`);
//     let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
//     console.log("Species10202", pokemonSpeciesAPIAsJson);
// }

// async function loadEvoAPI() {
//     let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/10/`);
//     let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
//     console.log("EvoChain10", pokemonEvoAPIAsJson);
// }

// async function load134API() {
//     let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/30/`);
//     let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
//     console.log("30", pokemonEvoAPIAsJson);
// }

// async function loadSpecies134API() {
//     let pokemonSpeciesAPI = await fetch(`https://pokeapi.co/api/v2/pokemon-species/35/`);
//     let pokemonSpeciesAPIAsJson = await pokemonSpeciesAPI.json();
//     console.log("Species35", pokemonSpeciesAPIAsJson);
// }

// async function loadEvo14API() {
//     let pokemonEvoAPI = await fetch(`https://pokeapi.co/api/v2/evolution-chain/14/`);
//     let pokemonEvoAPIAsJson = await pokemonEvoAPI.json();
//     console.log("EvoChain14", pokemonEvoAPIAsJson);
// }

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
    pokemonLocation.innerHTML ="";
    let currentPokemon = currentNumberPokemon;
    for (let i = 1; i <= currentPokemon; i++) {
        loadPokemon(i);
    }
    return currentNumberPokemon = currentPokemon;
}

async function preloadSearchList() {
    const data = await (await fetch('https://pokeapi.co/api/v2/pokemon?limit=1024')).json();
    // const data = await response.json();
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
    }
    if (searchTerm.length < 3) {
        return;
    }
    const filtered = allPokemonSearchList.filter(p =>
        p.name.includes(searchTerm) || p.id.toString() === searchTerm
    );
    pokemonLocation.innerHTML = "";
    // filtered.forEach(p => {
        for (const pokemon of filtered) {
            await getPokemon(pokemon.id);
        };
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

function openDialog(i) {
    currentIndex = i;
    // getDialogData();
    dialog.showModal();
    dialog.classList.add("dialog");
    loadPokeName(pokemonObject[i]);
    showDialogTypes(pokemonObject[i])
    showDialogPic(pokemonObject[i]);
    loadStats();
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

function getDescription(flavor_text_entries) {
    const description = flavor_text_entries.find(entry =>
        entry.language.name === 'en' && entry.version.name === 'scarlet' || entry.version.name === 'violet'
    );
    const fallbackEntry = flavor_text_entries.find(entry =>
        entry.language.name === 'en'
    );

    const finalDescription = (description || fallbackEntry).flavor_text.replace(/[\n\f\r]/g, " ");
    return finalDescription;
}

function loadDescription() {
    let pokemon = pokemonObject[currentIndex];
    dialogContentRef.innerHTML += `<p>Description:</p>
                                   <p>${pokemon.flavorText}</p>
    `
}

function loadAbilities() {
    let pokemon = pokemonObject[currentIndex];
    let html = `<p>Abilities:</p> <ul>`
        + pokemon.abilities.map(pokeAbility => `
                            <li>${stringToCapital(pokeAbility.abilityName)}: ${pokeAbility.abilityDescription}</li>
                            `
        ).join('') + `</ul>`;
    dialogContentRef.innerHTML += html
}

async function getAbilities() {
    if (!pokemonObject[currentIndex].abilities) {
        let abilitiesData = [];
        for (const abilitySlot of pokemonObject[currentIndex].abilitiesURL) {
            let abilityAPI = await (await fetch(`${abilitySlot.ability.url}`)).json();
            let effectEntry = abilityAPI.effect_entries.find(entry => entry.language.name === 'en');
            let abilityDetail = {
                abilityName: abilitySlot.ability.name,
                abilityDescription: effectEntry ? effectEntry.short_effect : "No description available"
            };
            abilitiesData.push(abilityDetail);
        }
        pokemonObject[currentIndex].abilities = abilitiesData;
    }
}

function loadStats() {
    // statsRef.classList.add("red-underline");
    dialogContentRef.innerHTML = "";
    updateDialogNav('stats');
    pokemonObject[currentIndex].stats.forEach(pokeStat => {
        dialogContentRef.innerHTML += `
        <div class="dialog-stat-div">
            <p class="pokemon-stat-name">${getStatName(pokeStat.stat.name)}</p>
            <p class="pokemon-stat-value">${pokeStat.base_stat}</p> 
            <div class="stat-bar" style="background: linear-gradient(90deg, ${getStatColor(pokeStat.base_stat)} ${(pokeStat.base_stat / 150) * 100}%, #ccc ${(pokeStat.base_stat / 150) * 100}%)"></div>
        </div>
        `
    });
}

async function aboutClick() {
    await getAbilities();
    await getDialogData();
    dialogContentRef.innerHTML = "";
    updateDialogNav('about');
    loadDescription();
    loadAbilities();
}

async function evolutionClick() {
    dialogContentRef.innerHTML = `<div class="loader">Loading evolution...</div>`;
    await getDialogData();
    updateDialogNav('evolution')
    loadEvolution();
}

function updateDialogNav(content) {
    dialogContentRef.classList.remove('evo-content');
    dialogContentRef.classList.remove('about-content');
    dialogContentRef.classList.add(`${content}-content`);
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove("red-underline");
        if (item.id === `${content}ID`) {
            item.classList.add("red-underline");
        }
    });
}

function loadEvolution() {
    let evolutionChain = pokemonObject[currentIndex].evoChain;
    dialogContentRef.innerHTML = evolutionChain.map((evoIndex, i) => {
        let html = `<img class="evo-sprites" title="${stringToCapital(pokemonObject[evoIndex.id].name)}" src="${pokemonObject[evoIndex.id].sprite}">`;
        if (i < evolutionChain.length - 1) {
            let nextStep = evolutionChain[i + 1];
            let conditionText = "";
            if (nextStep.minLevel) {
                conditionText = `Lvl ${nextStep.minLevel}`;
            } else if (nextStep.item) {
                conditionText = stringToCapital(nextStep.item.replace("-", " "));
            } else if (nextStep.minHappiness) {
                conditionText = `Happiness ${nextStep.minHappiness}`;
            } else {
                conditionText = "?";
            }
            html += `
                    <div class="evo-arrow-container">
                    <p>${conditionText}</p>
                        <span>↓</span>
                    </div>`;
        }

        return html;
    }).join('');
    dialogContentRef.classList.add('evo-content');
}

async function getDialogData() {
    if (!pokemonObject[currentIndex].evoChain && !pokemonObject[currentIndex].flavorText) {
        let speciesAPI = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${currentIndex}/`)).json();
        let evoAPI = await (await fetch(`${speciesAPI.evolution_chain.url}`)).json();
        pokemonObject[currentIndex].flavorText = getDescription(speciesAPI.flavor_text_entries);
        let evoArray = getEvoArray(evoAPI.chain);
        for (const pokemon of evoArray) {
            if (!pokemonObject[pokemon.id]) {
                await fetchPokemon(pokemon.id);
            }
            pokemonObject[pokemon.id].evoChain = evoArray;
        };
    }
}

function getEvoArray(chain, pokemonIDs = []) {
    let currentStep = {
        id: cutOutIndex(chain.species.url),
        minLevel: chain.evolution_details.length > 0
            ? chain.evolution_details[0].min_level
            : null,
        item: (chain.evolution_details.length > 0 && chain.evolution_details[0].item != null)
            ? chain.evolution_details[0].item.name
            : null,
        minHappiness: chain.evolution_details.length > 0
            ? chain.evolution_details[0].min_happiness
            : null,

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
    // getDialogData();
    loadPokeName(pokemonObject[currentIndex]);
    showDialogTypes(pokemonObject[currentIndex]);
    showDialogPic(pokemonObject[currentIndex]);
    loadStats();
}

async function swipeRight() {
    if (currentNumberPokemon - 1 == currentIndex) {
        getMorePokemon();
    }
    currentIndex += 1;
    // getDialogData();
    loadPokeName(pokemonObject[currentIndex]);
    showDialogTypes(pokemonObject[currentIndex]);
    showDialogPic(pokemonObject[currentIndex]);
    loadStats();
}
