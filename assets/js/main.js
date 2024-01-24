const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" onClick="getPokemon(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

const getPokemon = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const res = await fetch(url);
    const pokemon = await res.json();
    popUp(pokemon);
}

const popUp = (pokemon) => {
    const types = pokemon.types.map((typeSlot) => typeSlot.type.name);
    const [type] = types;

    pokemon.types = types;
    pokemon.type = type;

    const img = pokemon.sprites.other.dream_world.front_default;
    const htmlString = `
    
    <div class="pop-up">
        <div class="pokemon-detail ${pokemon.type}">
            <a class="exit" id="exit"> x </a>
            <li class="pokeup ${pokemon.type}">
                <span class="name">${pokemon.name}</span>
                <span class="number">${pokemon.number}</span>
                <div class="detail">
                    <ol class="types">
                        ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                    </ol>
                </div>
                <img id="img-pokemon" src="${img}"alt="${pokemon.name}">
                
                <div id="data">
                    <h4>BASE STATS</h4>
                    <div id="hability">
                        <div class="stat-desc">
                        ${pokemon.stats.map((name_stats) => `<p class="${type}">${name_stats.stat.name}</p>`).join('')}
                        </div>
                        <div class="bar-inner"> ${pokemon.stats.map((base_stats) => `<p class="${type}">${base_stats.base_stat}</p>`).join('')}
                        </div>
                    </div>
                    <div id="stats">
                        <div class="stat-bar">
                            <p>Height: ${(pokemon.height / 10).toFixed(2)}m</p>
                            <p>Weight: ${(pokemon.weight / 10)}kg</p>
                        </div>
                    </div>
                </div>
           </li>
        </div>
    </div>
    `
    pokemonList.innerHTML = htmlString + pokemonList.innerHTML
}

const exitPopup = () => {
    const popup = document.getElementsById('exit');
    popup.parentElement.removeChild(popup);
}