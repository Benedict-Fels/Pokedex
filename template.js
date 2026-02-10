function pokemonTemplate(newPokemon, index) {
    return `  
                                     <div id="pokemon${index}" class="pokemon-div" onclick="openDialog(${index})">
                                         <div class="pokemon-overview">
                                             <p>#${index.toString().padStart(3, "0")}</p> 
                                             <p>${stringToCapital(newPokemon.name)}</p>
                                             <p></p>
                                         </div>
                                         <img class="pokemon-sprites" src=${newPokemon.sprite}></img>
                                         <img class="pokeball-background" src=./assets/pokeballbackground-removebg-preview.png></img>
                                         <div class="type-icon-div">
                                                ${getTypesImage(newPokemon.types)}
                                         </div>
                                     </div>`
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

function loadDescription(ID) {
    let pokemon = pokemonObject[ID];
    dialogContentRef.innerHTML = `<h2>Description:</h2>
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

function loadEeveeTemplate(eeveeArray) {
    let html1 = "";
    let html2 = "";
    for (let i = 0; i < 4; i++) {
        html1 += `   <div class="eevee-evolution-div">
                         <img class="evo-sprites" title="${stringToCapital(pokemonObject[eeveeArray[i]].name)}" src="${pokemonObject[eeveeArray[i]].sprite}"></img>
                     </div>`
    }
    for (let i = 4; i < 8; i++) {
        html2 += `   <div class="eevee-evolution-div">
                         <img class="evo-sprites" title="${stringToCapital(pokemonObject[eeveeArray[i]].name)}" src="${pokemonObject[eeveeArray[i]].sprite}"></img>
                     </div>`
    }
    dialogContentRef.innerHTML = `
                     <div class="eevee-container">
                         <div class="eevee-compact-grid">
                             ${html1}
                             <div class="base-eevee">
                                 <img title="${stringToCapital(pokemonObject[133].name)}" src="${pokemonObject[133].sprite}">
                             </div>
                             ${html2}
                         </div>
                     </div>
    `
}