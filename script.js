// async function fetchData(){
//     const pokeAPI = await fetch('https://www.fruityvice.com/api/fruit/all');
//     const pokeAPIAsJson = await pokeAPI.json();
//     console.log(pokeAPIAsJson[5]);

// renderSynonyms(pokeAPIAsJson);
// }

// function renderSynonyms(pokeAPIAsJson){
//     const contentRef = document.getElementById('content');
//     let terms = pokeAPIAsJson.synsets[0].terms;
//     console.log(terms);
// terms.forEach((arrayElement) => {
//         const term = arrayElement.term;
//         contentRef.innerHTML += `<p>${term}</p>`;
//     })
// }

const dialog = document.getElementById("dialogID");
const dialogName = document.getElementById("pokemonName");
const dialogImage = document.getElementById("dialogImage");
const dialogFooterNumber = document.getElementById("dialogFooterNumberID");
// let currentIndex = 10;
const closeButton = document.getElementById("closeButton");

// const dialogDiv = document.getElementById('dialogDivID');
// dialogDiv.addEventListener('click', (event) => event.stopPropagation());

const pokemonLocation = document.getElementById("content");
let currentNumberPokemon = 0;

async function loadAPI() {
    let pokemonAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/1`);
    let pokemonAPIAsJson = await pokemonAPI.json();
    console.log(pokemonAPIAsJson);
}
async function loadPokemon() {
    for (let index = currentNumberPokemon+1; index < currentNumberPokemon+25; index++) {
        let pokemonAPI = await fetch(`https://pokeapi.co/api/v2/pokemon/${index}`);
        let pokemonAPIAsJson = await pokemonAPI.json();
        let types = pokemonAPIAsJson.types;
        pokemonLocation.innerHTML += `<div id="pokemon${index}" class="pokemon-div" onclick="openDialog(${index})">
                                         <div class="pokemon-overwiew">
                                             <p>#${index}</p> 
                                             <p>${pokemonAPIAsJson.species.name.replace(/\b\w/g, letter => letter.toUpperCase())}</p>
                                             <p></p>
                                         </div>
                                         <img src=${pokemonAPIAsJson.sprites.other["official-artwork"].front_default}></img>
                                            <div class="type-icon-div">
                                                ${getTypesImage(types)}
                                            </div>
                                         </div>`;
        getTypesBackground(types, index)
    }
    return currentNumberPokemon += 24
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
        pokemonDivRef.style.background = `linear-gradient(60deg,${assignColor(types[0].type.name)} 50%, ${assignColor(types[1].type.name)} 50%)`;
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



        default:
    }

}

function openDialog() {
    dialog.showModal();
    dialog.classList.add("dialog");
    showDialogContent();
}

function showDialogContent() {
    
}

function closeDialog() {
    dialog.close();
    dialog.classList.remove("dialog");
    closeButton.classList.remove("button-press");
}

// function registerClickXButton() {
//     closeButton.classList.add("button-press");
// }

// document.addEventListener('keydown', function (event) {
//     if (event.key === 'Escape') {
//         closeDialog();
//     }
//     if (event.key === 'ArrowLeft') {
//         swipeLeft();
//     }
//     if (event.key === 'ArrowRight') {
//         swipeRight();
//     }


// })

// function displayPic(picIndex) {
//     dialogImage.src = `./img/${photos[picIndex]}`;
//     dialogImage.setAttribute("alt", `${photosAltName[picIndex]}`);
//     dialogName.innerHTML = photosAltName[picIndex];
//     dialogFooterNumber.innerHTML = `${picIndex + 1} / ${photos.length}`;
//     return currentIndex = picIndex;

// }

// function swipeLeft() {
//     if (currentIndex == 0) {
//         displayPic(photos.length - 1)
//     }
//     else {
//         currentIndex -= 1;
//         displayPic(currentIndex);
//     }
// }


// function swipeRight() {
//     if (currentIndex == 19) {
//         displayPic(0)
//     }
//     else {
//         currentIndex += 1;
//         displayPic(currentIndex);
//     }
// }
