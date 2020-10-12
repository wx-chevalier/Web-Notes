import Vue from 'vue';
import Vuex from 'vuex';

import { POKEMON_TYPE, POKEMON_PROPERTIES } from './constants';

Vue.use(Vuex);

const types = {
  CLEAR_POKEMONS: 'CLEAR_POKEMONS',
  ADD_POKEMON: 'ADD_POKEMON',
  ATTACK_POKEMON: 'ATTACK_POKEMON',
  KILL_POKEMON: 'KILL_POKEMON',
  REMOVE_POKEMON: 'REMOVE_POKEMON'
};

const state = {
  pokemons: {}
};

const getters = {
  pokemonsList(state) {
    return Object.values(state.pokemons);
  },
  rankings(state, getters) {
    const rankingObject = getters.pokemonsList.reduce(
      (accum, pokemon) => {
        accum[pokemon.type].value += pokemon.life > 0 ? pokemon.life : 0;
        return accum;
      },
      {
        [POKEMON_TYPE.FIRE]: { type: POKEMON_TYPE.FIRE, value: 0 },
        [POKEMON_TYPE.PLANT]: { type: POKEMON_TYPE.PLANT, value: 0 },
        [POKEMON_TYPE.WATER]: { type: POKEMON_TYPE.WATER, value: 0 }
      }
    );
    return Object.values(rankingObject).sort((rankingLeft, rankingRight) =>
      rankingLeft.value > rankingRight.value ? -1 : 1
    );
  }
};

const actions = {
  resetPokemons({ commit, dispatch }) {
    commit(types.CLEAR_POKEMONS);
    [
      { type: POKEMON_TYPE.FIRE, name: 'charmy' },
      { type: POKEMON_TYPE.PLANT, name: 'planty' },
      { type: POKEMON_TYPE.WATER, name: 'tortly' }
    ].forEach(pokemon => {
      dispatch('addPokemon', pokemon);
    });
  },
  clearPokemons({ commit }) {
    commit(types.CLEAR_POKEMONS);
  },
  addPokemon({ state, commit }, { type, name }) {
    if (name && !state.pokemons[name]) {
      // add only if not exists
      commit(types.ADD_POKEMON, {
        type,
        name,
        ...POKEMON_PROPERTIES[type],
        dying: false
      });
    }
  },
  attackPokemon({ state, commit, dispatch }, { src, target }) {
    if (!src || !target || src === target || target.dying) return;
    let damage = src.attack;
    if (
      (src.type === POKEMON_TYPE.FIRE && target.type === POKEMON_TYPE.PLANT) ||
      (src.type === POKEMON_TYPE.PLANT && target.type === POKEMON_TYPE.WATER) ||
      (src.type === POKEMON_TYPE.WATER && target.type === POKEMON_TYPE.FIRE)
    ) {
      damage *= 2;
    }
    commit(types.ATTACK_POKEMON, { name: target.name, damage });
    if (state.pokemons[target.name].life <= 0) {
      dispatch('removePokemon', target);
    }
  },
  removePokemon({ state, commit }, pokemon) {
    if (pokemon.dying) return;
    commit(types.KILL_POKEMON, pokemon.name);
    setTimeout(() => {
      if (state.pokemons[pokemon.name] === pokemon) {
        // check if the pokemon is the same
        commit(types.REMOVE_POKEMON, pokemon.name);
      }
    }, 2000);
  }
};

const mutations = {
  [types.CLEAR_POKEMONS](state) {
    state.pokemons = {};
  },
  [types.ADD_POKEMON](state, pokemon) {
    // state.pokemons[pokemon.name] = pokemon;
    Vue.set(state.pokemons, pokemon.name, pokemon);
  },
  [types.ATTACK_POKEMON](state, { name, damage }) {
    state.pokemons[name].life -= damage;
  },
  [types.KILL_POKEMON](state, name) {
    state.pokemons[name].dying = true;
  },
  [types.REMOVE_POKEMON](state, name) {
    Vue.delete(state.pokemons, name);
  }
};

const store = new Vuex.Store({
  state,
  getters,
  actions,
  mutations
});

export default store;
