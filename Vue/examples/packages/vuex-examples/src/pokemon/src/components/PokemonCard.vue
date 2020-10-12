<template>
  <div class="pokemon-card" :class="{removing: pokemon.dying}">
    <span class="delete" @click="deleteClick" v-if="!pokemon.dying">×</span>
    <pokemon-icon :type="pokemon.type" :dying="pokemon.dying"></pokemon-icon>
    <div>name: {{ pokemon.name }}</div>
    <div>life: {{ pokemon.life }}</div>
    <div>attack: {{ pokemon.attack }}</div>
    <div class="attack-buttons">
      <button @click="leftClick">&lt;-</button>
      <button @click="rightClick">-&gt;</button>
    </div>
  </div>
</template>

<script>
import PokemonIcon from './PokemonIcon.vue';

export default {
  props: ['pokemon'],
  data() {
    return {};
  },
  methods: {
    leftClick() {
      this.$emit('attackLeft');
    },
    rightClick() {
      this.$emit('attackRight');
    },
    deleteClick() {
      this.$emit('delete');
    }
  },
  components: {
    PokemonIcon
  }
};
</script>

<style>
.pokemon-card {
  display: flex;
  position: relative;
  flex-direction: column;
  margin: 5px;
  padding: 15px 15px 10px 15px;
  border: solid 1px #ccc;
}

.pokemon-card.removing {
  background-color: red;
}

.pokemon-card .delete {
  position: absolute;
  top: 0px;
  right: 5px;
  cursor: pointer;
}

.pokemon-card .attack-buttons {
  display: flex;
  justify-content: space-between;
}
</style>