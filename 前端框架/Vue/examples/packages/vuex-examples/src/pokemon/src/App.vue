<template>
  <div id="app">

    <app-header></app-header>

    <div class="pokemon-list">
      <pokemon-card
        v-for="(pokemon, index) in pokemonsList"
        :key="pokemon.name"
        :pokemon="pokemon"
        @attackLeft="pokemonListAttack(pokemon, index - 1)"
        @attackRight="pokemonListAttack(pokemon, index + 1)"
        @delete="removePokemon(pokemon)"
      ></pokemon-card>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

import AppHeader from './components/AppHeader';
import PokemonCard from './components/PokemonCard.vue';

export default {
  name: 'app',
  data () {
    return {};
  },
  computed: {
    ...mapGetters([
      'pokemonsList',
    ]),
  },
  methods: {
    ...mapActions([
      'resetPokemons',
      'attackPokemon',
      'removePokemon',
    ]),
    pokemonListAttack(pokemonSrc, targetIndex) {
      if (targetIndex < 0) targetIndex = this.pokemonsList.length - 1;
      if (targetIndex > this.pokemonsList.length - 1) targetIndex = 0;
      const pokemonTarget = this.pokemonsList[targetIndex];
      this.attackPokemon({src: pokemonSrc, target: pokemonTarget});
    },
  },
  components: {
    AppHeader,
    PokemonCard,
  },
  created() {
    this.resetPokemons();
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

.pokemon-list {
  display: flex;
  flex-wrap: wrap;
}
</style>
