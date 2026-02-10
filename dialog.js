const dialog = document.getElementById("dialogID");
const dialogDiv = document.getElementById('dialogDivID');
dialogDiv.addEventListener('click', (event) => event.stopPropagation());

let currentIndex = 0;
// let currentSearchIndex = 0;

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
    loadDialog(pokemonObject[i]);
}

function loadDialog(pokemon) {
    showPokeName(pokemon);
    showDialogTypes(pokemon)
    showDialogPic(pokemon);
    showStats(pokemon);
}

function showPokeName(pokemon) {
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

function loadDescription(ID) {
    let pokemon = pokemonObject[ID];
    dialogContentRef.innerHTML += `<h2>Description:</h2>
                                   <p>${pokemon.flavorText}</p>
    `
}

function loadAbilities(ID) {
    let pokemon = pokemonObject[ID];
    let html = `<h2>Abilities:</h2> <ul>`
        + pokemon.abilities.map(pokeAbility => `
                            <li>${stringToCapital(pokeAbility.abilityName)}: ${pokeAbility.abilityDescription}</li>
                            `
        ).join('') + `</ul>`;
    dialogContentRef.innerHTML += html
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

function showStats(pokemon) {
    dialogContentRef.innerHTML = "";
    updateDialogNav('stats');
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

async function aboutClick() {
    const effectiveIndex = getEffectiveIndex();
    await getAbilities(effectiveIndex);
    await getDialogData(effectiveIndex);
    dialogContentRef.innerHTML = "";
    updateDialogNav('about');
    loadDescription(effectiveIndex);
    loadAbilities(effectiveIndex);
}

async function evolutionClick() {
    dialogContentRef.innerHTML = `<div class="loader">Loading evolution...</div>`;
    const effectiveIndex = getEffectiveIndex();
    updateDialogNav('evolution');
    if (await getDialogData(effectiveIndex) === 'Eevee') {
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

function loadEvolution(ID) {
    let evolutionChain = pokemonObject[ID].evoChain;
    dialogContentRef.classList.add('evo-content');
    if (evolutionChain.length == 1) {
        dialogContentRef.innerHTML = '<h4>This Pokemon has no evolution</h4>'
    }
    dialogContentRef.innerHTML = evolutionChain.map((evoIndex, i) => {
        let html = `<img class="evo-sprites" title="${stringToCapital(pokemonObject[evoIndex.id].name)}" src="${pokemonObject[evoIndex.id].sprite}">`;
        if (i < evolutionChain.length - 1) {
            let nextStep = evolutionChain[i + 1];
            let conditionText = "";
            if (nextStep.trigger) {
                conditionText += `${stringToCapital(nextStep.trigger)}`;
            }
            if (nextStep.minHappiness) {
                conditionText += `Happiness ${nextStep.minHappiness}`;
            }
            if (nextStep.heldItem) {
                conditionText += stringToCapital(nextStep.heldItem.name.replace("-", " "));
            }
            if (nextStep.minLevel) {
                conditionText = `Lvl ${nextStep.minLevel}`;
            }
            if (nextStep.item) {
                conditionText = stringToCapital(nextStep.item.replace("-", " "));
            }
            if (conditionText == "") {
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
            getEeveeEvo(evoAPI.chain.evolves_to);
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
    console.log('EeveeArray', pokemonIDs);
    let eeveeArray = [];
    for (let i = 0; i < pokemonIDs.length; i++) {
        let evolutionID = cutOutIndex(pokemonIDs[i].species.url)
        eeveeArray.push(evolutionID);
        await fetchPokemon(evolutionID);
    } 
    loadEeveeTemplate(eeveeArray);
}

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
    if (currentNumberPokemon == currentIndex) {
        getMorePokemon();
    }
    if (currentIndex == 2) {
        document.getElementById('left-arrow').style.visibility = "visible";
    }
    loadDialog(pokemonObject[currentIndex]);
}