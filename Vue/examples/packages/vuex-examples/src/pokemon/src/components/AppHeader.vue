<template>
<div class="header">

    <div class="add-pokemon">
    <h3>Add pokemon</h3>
    <select v-model="newPokemon.type">
        <option v-for="option in newPokemon.typeOptions" :key="option.value" :value="option.value">
        {{ option.label }}
        </option>
    </select>
    <input v-model="newPokemon.name" placeholder="name">
    <p><button @click="addPokemon(newPokemon)">Add</button></p>
    </div>

    <div class="pokemon-ranking">
    <h3>Ranking</h3>
    <ul>
        <li v-for="ranking in rankings" :key="ranking.type">{{ ranking.type + ': ' + ranking.value }}</li>
    </ul>
    </div>

    <button class="reset-button" @click="resetPokemons">RESET</button>

</div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import { POKEMON_TYPE } from '@/store/constants';

export default {
    data() {
        return {
            newPokemon: {
                type: POKEMON_TYPE.FIRE,
                typeOptions: [
                {value: POKEMON_TYPE.FIRE, label: 'Fire'},
                {value: POKEMON_TYPE.PLANT, label: 'Plant'},
                {value: POKEMON_TYPE.WATER, label: 'Water'},
                ],
                name: '',
            },
        };
    },
    computed: {
        ...mapGetters([
            'rankings',
        ]),
    },
    methods: {
        ...mapActions([
            'resetPokemons',
            'addPokemon',
        ]),
    },
}
</script>

<style>
.header {
  display: flex;
  margin-bottom: 10px;
}

.header .pokemon-ranking {
  margin-left: 10px;
  padding-left: 10px;
  border-left: solid 1px #ccc;
}

.header .reset-button {
  height: 50px;
  width: 50px;
  align-self: center;
  margin-left: 20px;
  cursor: pointer;
}
</style>