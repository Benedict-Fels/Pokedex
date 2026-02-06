function pokemonTemplate(newPokemon, index){
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