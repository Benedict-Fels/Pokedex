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

function loadEeveeTemplate(eeveeArray) {
    let html1 = "";
    let html2 = "";
    for (let i = 0; i < 4; i++) {
        html1 += `   <div class="eevee-evolution-div">
                         <img class="eevee-evolution" title="${stringToCapital(pokemonObject[eeveeArray[i]].name)}" src="${pokemonObject[eeveeArray[i]].sprite}"></img>
                     </div>`
    }
    for (let i = 4; i < 8; i++) {
        html2 += `   <div class="eevee-evolution-div">
                         <img class="eevee-evolution" title="${stringToCapital(pokemonObject[eeveeArray[i]].name)}" src="${pokemonObject[eeveeArray[i]].sprite}"></img>
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