const dialog = document.getElementById("dialogID");
const dialogDiv = document.getElementById('dialogDivID');
dialogDiv.addEventListener('click', (event) => event.stopPropagation());
let eeveeArray = [];
let currentIndex = 0;

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

function openDialog(i) {
    if (searchState) {
        currentIndex = searchArray.indexOf(i);
    } else {
        currentIndex = i;
    }
    if (i == 1 || searchArray.indexOf(i) == 0) {
        document.getElementById('left-arrow').style.visibility = "hidden";
    } else {
        document.getElementById('left-arrow').style.visibility = "visible";
    }
    dialog.showModal();
    dialog.classList.add("dialog");
    document.body.classList.add('no-scroll');
    loadDialog(pokemonObject[i]);
}

function loadDialog(pokemon) {
    showPokeName(pokemon);
    showDialogTypes(pokemon)
    showDialogPic(pokemon);
    showStats(pokemon);
}

function closeDialog() {
    dialog.close();
    dialog.classList.remove("dialog");
    document.body.classList.remove('no-scroll');
}

async function aboutClick() {
    dialogContentRef.innerHTML = "Loading About section...";
    const effectiveIndex = getEffectiveIndex();
    await getAbilities(effectiveIndex);
    await getDialogData(effectiveIndex);
    updateDialogNav('about');
    loadDescription(effectiveIndex);
    loadAbilities(effectiveIndex);
}

async function evolutionClick() {
    dialogContentRef.innerHTML = `<div class="loader">Loading evolution...</div>`;
    const effectiveIndex = getEffectiveIndex();
    updateDialogNav('evolution');
    if (await getDialogData(effectiveIndex) === 'Eevee') {
        loadEeveeTemplate(eeveeArray);
        return
    }
    loadEvolution(effectiveIndex);
}

function updateDialogNav(content) {
    dialogContentRef.classList.remove('evolution-content');
    dialogContentRef.classList.remove('about-content');
    dialogContentRef.classList.remove('stats-content');
    dialogContentRef.classList.add(`${content}-content`);
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove("red-underline");
        if (item.id === `${content}ID`) {
            item.classList.add("red-underline");
        }
    });
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

async function getAbilities(ID) {
    if (!pokemonObject[ID].abilities) {
        let abilitiesData = [];
        for (const abilitySlot of pokemonObject[ID].abilitiesURL) {
            let abilityAPI = await (await fetch(`${abilitySlot.ability.url}`)).json();
            let effectEntry = abilityAPI.effect_entries.find(entry => entry.language.name === 'en');
            let abilityDetail = {
                abilityName: abilitySlot.ability.name,
                abilityDescription: effectEntry ? effectEntry.short_effect : "No description available"
            };
            abilitiesData.push(abilityDetail);
        }
        pokemonObject[ID].abilities = abilitiesData;
    }
}

async function getDialogData(ID) {
    let speciesAPI = ""
    if (!pokemonObject[ID].flavorText || !pokemonObject[ID].evoChain) {
        speciesAPI = await (await fetch(`https://pokeapi.co/api/v2/pokemon-species/${ID}/`)).json();
        pokemonObject[ID].flavorText = getDescription(speciesAPI.flavor_text_entries);
    }
    if (!pokemonObject[ID].evoChain) {
        let evoAPI = await (await fetch(`${speciesAPI.evolution_chain.url}`)).json();
        // console.log(evoAPI);
        if (evoAPI.chain.evolves_to.length > 5) {
            await getEeveeEvo(evoAPI.chain.evolves_to);
            return 'Eevee';
        }
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
        heldItem: chain.evolution_details.length > 0
            ? chain.evolution_details[0].held_item
            : null,
        trigger: (chain.evolution_details.length > 0 && chain.evolution_details[0].trigger.name != 'level-up')
            ? chain.evolution_details[0].trigger.name
            : null,
    };
    pokemonIDs.push(currentStep);
    if (chain.evolves_to.length > 0) {
        getEvoArray(chain.evolves_to[0], pokemonIDs);
    }
    return pokemonIDs;
}

async function getEeveeEvo(pokemonIDs) {
    for (let i = 0; i < pokemonIDs.length; i++) {
        let evolutionID = cutOutIndex(pokemonIDs[i].species.url)
        eeveeArray.push(evolutionID);
        await fetchPokemon(evolutionID);
    } 
}

function getEffectiveIndex() {
    if (searchState) {
        return searchArray[currentIndex];
    }
    return currentIndex;
}

function swipeLeft() {
    currentIndex -= 1;
    if (searchState) {
        if (currentIndex == -1) {
            currentIndex = searchArray.length - 1;
        }
        loadDialog(pokemonObject[searchArray[currentIndex]]);
        return
    }
    if (currentIndex == 1) {
        document.getElementById('left-arrow').style.visibility = "hidden";
    }
    loadDialog(pokemonObject[currentIndex])
}

async function swipeRight() {
    currentIndex += 1;
    if (searchState) {
        if (currentIndex == searchArray.length) {
            currentIndex = 0;
        }
        loadDialog(pokemonObject[searchArray[currentIndex]]);
        return
    }
    if (currentNumberPokemon == currentIndex - 1) {
        await getMorePokemon();
    }
    if (currentIndex == 2) {
        document.getElementById('left-arrow').style.visibility = "visible";
    }
    loadDialog(pokemonObject[currentIndex]);
}