<template>
  <div class="pokemon-icon" :class="className">
    <!-- charmander -->
    <template v-if="type === POKEMON_TYPE.FIRE">
      <div class="arms"></div>
      <div class="feet"></div>
      <div class="body">
        <div class="eyes"></div>
        <div v-if="!dying" class="pupils"></div>
        <div class="nostrils"></div>
        <div class="mouth"></div>
        <div class="belly"></div>
      </div>
      <div class="tail"></div>
      <div class="flame"></div>
    </template>

    <!-- bulbasaur -->
    <template v-else-if="type === POKEMON_TYPE.PLANT">
      <div class="head">
        <div class="eyes"></div>
        <div v-if="!dying" class="pupils"></div>
        <div class="nostrils"></div>
        <div class="mouth"></div>
      </div>
      <div class="ears"></div>
      <div class="body">
        <div class="spots spot1"></div>
        <div class="spots spot2"></div>
        <div class="spots spot3"></div>
      </div>
      <div class="front-feet"></div>
      <div class="back-feet"></div>
      <div class="bulb"></div>
    </template>

    <!-- squirtle -->
    <template v-else-if="type === POKEMON_TYPE.WATER">
      <div class="arms"></div>
      <div class="feet"></div>
      <div class="head">
        <div class="eyes"></div>
        <div v-if="!dying" class="pupils"></div>
        <div class="nostrils"></div>
        <div class="mouth"></div>
      </div>
      <div class="body"></div>
      <div class="shell"></div>
      <div class="tail"></div>
    </template>

    <template v-else>
      <div>Pokemon not defined</div>
    </template>
  </div>
</template>

<script>
// pokemons from https://codepen.io/steftastan/pen/XbMVGw all credits to Stef Tastan https://codepen.io/steftastan/

import { POKEMON_TYPE } from '@/store/constants';

export default {
  props: ['type', 'dying'],
  data() {
    return {
      POKEMON_TYPE
    };
  },
  computed: {
    className() {
      return this.type === POKEMON_TYPE.FIRE
        ? 'charmander'
        : this.type === POKEMON_TYPE.PLANT
        ? 'bulbasaur'
        : this.type === POKEMON_TYPE.WATER
        ? 'squirtle'
        : '';
    }
  }
};
</script>

<style>
body {
  background-color: #f5f5f5;
}

.pokemon-icon {
  /* width: 715px;
	height: 500px;
	margin: 0 auto; */
  position: relative;
  font-size: 6px;
  height: 100px;
  width: 100px;
}

/*
 * CHARMANDER 
 */

.pokemon-icon.charmander {
  position: relative;
  /* width: 10em;
	height: 14em; */
  /* float: left; */
}
.pokemon-icon.charmander .body {
  width: 8em;
  height: 13em;
  background-color: #e88923;
  border-radius: 5em 5em 0 0;
  z-index: 150;
  position: relative;
}

.pokemon-icon.charmander .feet::before {
  content: '';
  width: 2em;
  height: 2em;
  background-color: #e88923;
  border-radius: 0 0 1em 1em;
  position: absolute;
  top: 12em;
  left: 0;
}

.pokemon-icon.charmander .feet::after {
  content: '';
  width: 2em;
  height: 2em;
  background-color: #e88923;
  border-radius: 0 0 1em 1em;
  position: absolute;
  top: 12em;
  left: 6em;
}

.pokemon-icon.charmander .eyes::before {
  content: '';
  width: 1.5em;
  height: 1.5em;
  background-color: #fff;
  border-radius: 1em;
  position: absolute;
  top: 2em;
  left: 1em;
}

.pokemon-icon.charmander .eyes::after {
  content: '';
  width: 1.5em;
  height: 1.5em;
  background-color: #fff;
  border-radius: 1em;
  position: absolute;
  top: 2em;
  left: 4.5em;
}

.pokemon-icon.charmander .pupils::before {
  content: '';
  width: 0.75em;
  height: 1.5em;
  background-color: #000;
  border-radius: 0 1em 1em 0;
  position: absolute;
  top: 2em;
  left: 5.25em;
}

.pokemon-icon.charmander .pupils::after {
  content: '';
  width: 0.75em;
  height: 1.5em;
  background-color: #000;
  border-radius: 0 1em 1em 0;
  position: absolute;
  top: 2em;
  left: 1.75em;
}

.pokemon-icon.charmander .nostrils::before {
  content: '';
  width: 0.25em;
  height: 0.25em;
  background-color: #000;
  border-radius: 1em;
  position: absolute;
  top: 3em;
  left: 3em;
}

.pokemon-icon.charmander .nostrils::after {
  content: '';
  width: 0.25em;
  height: 0.25em;
  background-color: #000;
  border-radius: 1em;
  position: absolute;
  top: 3em;
  left: 3.75em;
}

.pokemon-icon.charmander .mouth::before {
  content: '';
  width: 1.25em;
  height: 0.75em;
  background-color: #942e58;
  border-radius: 0 0 3em 3em;
  position: absolute;
  top: 3.75em;
  left: 2.85em;
}

.pokemon-icon.charmander .belly {
  content: '';
  width: 5.5em;
  height: 5.5em;
  background-color: #f8e393;
  border-radius: 2em 2em 0 2em;
  position: absolute;
  top: 7.5em;
  left: 0.5em;
  z-index: 10;
}

.pokemon-icon.charmander .tail::before {
  content: '';
  width: 3em;
  height: 2.75em;
  background-color: #e88923;
  border-radius: 0 0 2em 0;
  position: absolute;
  top: 10em;
  left: 8em;
  z-index: 10;
}

.pokemon-icon.charmander .tail::after {
  content: '';
  width: 1.5em;
  height: 1.5em;
  background-color: #f5f5f5;
  border-radius: 0 0 50% 0;
  position: absolute;
  top: 9.5em;
  left: 8em;
  z-index: 10;
}

.pokemon-icon.charmander .tail-tip {
  content: '';
  width: 1.5em;
  height: 1.5em;
  background-color: #e88923;
  border-radius: 2em 2em 0 0;
  position: absolute;
  top: 9em;
  left: 9.5em;
  z-index: 30;
}

.pokemon-icon.charmander .arms::before {
  content: '';
  width: 2em;
  height: 2em;
  background-color: #e88923;
  border-radius: 2em 0 0 2em;
  position: absolute;
  top: 5.75em;
  left: -1.5em;
  z-index: 10;
}

.pokemon-icon.charmander .arms::after {
  content: '';
  width: 2em;
  height: 2em;
  background-color: #e88923;
  border-radius: 0 2em 2em 0;
  position: absolute;
  top: 5.75em;
  left: 7.75em;
  z-index: 10;
}

.pokemon-icon.charmander .flame {
  content: '';
  width: 2.5em;
  height: 2.5em;
  overflow: hidden;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-left-radius: 50%;
  -webkit-transform: rotate(-45deg);
  background-color: #ffb800;
  position: absolute;
  top: 8em;
  left: 9em;
  z-index: 300;
}

/*
 * BULBASAUR
 */

.pokemon-icon.bulbasaur {
  position: relative;
  /* float: left; */
  /* left: 3em; */
  /* width: 10em;
	height: 12em; */
  top: 1em;
}
.pokemon-icon.bulbasaur .body {
  content: '';
  width: 12em;
  height: 7em;
  top: 5em;
  left: 2em;
  background-color: #89e1bc;
  border-radius: 0 8em 8em 8em;
  z-index: 150;
  position: absolute;
}

.pokemon-icon.bulbasaur .head {
  width: 9em;
  height: 7em;
  left: 1em;
  top: 1em;
  background-color: #89e1bc;
  border-radius: 1em 0 0 1em;
  z-index: 200;
  position: absolute;
}

.pokemon-icon.bulbasaur .eyes::before,
.pokemon-icon.squirtle .eyes::before {
  content: '';
  width: 1.5em;
  height: 1.5em;
  background-color: #fff;
  border-radius: 1em;
  position: absolute;
  top: 2em;
  left: 1em;
}

.pokemon-icon.bulbasaur .eyes::after,
.pokemon-icon.squirtle .eyes::after {
  content: '';
  width: 1.5em;
  height: 1.5em;
  background-color: #fff;
  border-radius: 1em;
  position: absolute;
  top: 2em;
  left: 4.5em;
}

.pokemon-icon.bulbasaur .pupils::before,
.pokemon-icon.squirtle .pupils::before {
  content: '';
  width: 0.75em;
  height: 1.5em;
  background-color: #000;
  border-radius: 0 1em 1em 0;
  position: absolute;
  top: 2em;
  left: 5.25em;
}

.pokemon-icon.bulbasaur .pupils::after,
.pokemon-icon.squirtle .pupils::after {
  content: '';
  width: 0.75em;
  height: 1.5em;
  background-color: #000;
  border-radius: 0 1em 1em 0;
  position: absolute;
  top: 2em;
  left: 1.75em;
}

.pokemon-icon.bulbasaur .nostrils::before,
.pokemon-icon.squirtle .nostrils::before {
  content: '';
  width: 0.25em;
  height: 0.25em;
  background-color: #000;
  border-radius: 1em;
  position: absolute;
  top: 3em;
  left: 3em;
}

.pokemon-icon.bulbasaur .nostrils::after,
.pokemon-icon.squirtle .nostrils::after {
  content: '';
  width: 0.25em;
  height: 0.25em;
  background-color: #000;
  border-radius: 1em;
  position: absolute;
  top: 3em;
  left: 3.75em;
}

.pokemon-icon.bulbasaur .mouth,
.pokemon-icon.squirtle .mouth {
  content: '';
  width: 1.25em;
  height: 0.75em;
  background-color: #942e58;
  border-radius: 0 0 3em 3em;
  position: absolute;
  top: 3.75em;
  left: 2.85em;
}

.pokemon-icon.bulbasaur .front-feet::before {
  content: '';
  width: 2em;
  height: 5em;
  background-color: #89e1bc;
  border-radius: 0 0 1em 1em;
  position: absolute;
  top: 8em;
  left: 2em;
}

.pokemon-icon.bulbasaur .front-feet::after {
  content: '';
  width: 2em;
  height: 5em;
  background-color: #89e1bc;
  border-radius: 0 0 1em 1em;
  position: absolute;
  top: 8em;
  left: 5em;
}

.pokemon-icon.bulbasaur .back-feet::before {
  content: '';
  width: 2em;
  height: 5em;
  background-color: #89e1bc;
  border-radius: 0 0 1em 1em;
  position: absolute;
  top: 8em;
  left: 12em;
}

.pokemon-icon.bulbasaur .back-feet::after {
  content: '';
  width: 2em;
  height: 5em;
  background-color: #89e1bc;
  border-radius: 0 0 1em 1em;
  position: absolute;
  top: 8em;
  left: 9em;
}

.pokemon-icon.bulbasaur .bulb::before {
  content: '';
  width: 11em;
  height: 11em;
  overflow: hidden;
  border-bottom-right-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-left-radius: 50%;
  -webkit-transform: rotate(-45deg);
  background-color: #6aac34;
  position: absolute;
  top: -1em;
  left: 5em;
}

.pokemon-icon.bulbasaur .bulb::after {
  content: '';
  background-color: #6aac34;
  border-radius: 0 0 3em 2em;
  position: absolute;
  top: 1em;
  left: 5em;
}

.pokemon-icon.bulbasaur .ears::before {
  content: '';
  width: 1em;
  height: 4em;
  left: 2em;
  top: 1em;
  background-color: #89e1bc;
  border-radius: 4em 4em 0 4em;
  z-index: 150;
  position: absolute;
  top: 0.25em;
  left: 2em;
}

.pokemon-icon.bulbasaur .ears::after {
  content: '';
  width: 1em;
  height: 4em;
  background-color: #89e1bc;
  border-radius: 4em 4em 0 4em;
  z-index: 150;
  position: absolute;
  top: 0.25em;
  left: 9em;
}

.pokemon-icon.bulbasaur .spots {
  content: '';
  background-color: #006359;
  border-radius: 1em;
  z-index: 500;
  position: absolute;
}

.spot1 {
  width: 1.5em;
  height: 1.5em;
  top: 1.25em;
  left: 8em;
}

.spot2 {
  width: 1em;
  height: 1em;
  top: 2.25em;
  left: 9.75em;
}

.spot3 {
  width: 1em;
  height: 1em;
  top: 3em;
  left: 8.6em;
}

/*
 * SQUIRTLE
 */

.pokemon-icon.squirtle {
  position: relative;
  /* float: left; */
  /* left: 13em; */
  /* width: 10em;
  height: 12em; */
  top: 0;
}

.pokemon-icon.squirtle .body {
  width: 8em;
  height: 13em;
  background-color: #ffe69c;
  border-radius: 5em 5em 2em 4em;
  z-index: 150;
  position: relative;
}

.pokemon-icon.squirtle .head {
  content: '';
  width: 8em;
  height: 8em;
  background-color: #94d5cd;
  border-radius: 4em;
  position: absolute;
  top: 0em;
  z-index: 300;
}

.pokemon-icon.squirtle .feet::before {
  content: '';
  width: 2em;
  height: 3em;
  background-color: #94d5cd;
  border-radius: 1em;
  position: absolute;
  top: 11em;
  left: 1em;
  z-index: 500;
}

.pokemon-icon.squirtle .feet::after {
  content: '';
  width: 2em;
  height: 3em;
  background-color: #94d5cd;
  border-radius: 1em;
  position: absolute;
  top: 11em;
  left: 5em;
  z-index: 400;
}

.pokemon-icon.squirtle .arms::before {
  content: '';
  width: 2em;
  height: 2em;
  background-color: #94d5cd;
  border-radius: 2em 0 0 2em;
  position: absolute;
  top: 5.75em;
  left: -1.5em;
  z-index: 10;
}

.pokemon-icon.squirtle .arms::after {
  content: '';
  width: 2em;
  height: 2em;
  background-color: #94d5cd;
  border-radius: 0 2em 2em 0;
  position: absolute;
  top: 5.75em;
  left: 7.75em;
  z-index: 50;
}

.pokemon-icon.squirtle .shell::before {
  content: '';
  width: 3em;
  height: 10em;
  background-color: #dddbdb;
  border-radius: 0 2em 2em 0;
  position: absolute;
  top: 2.75em;
  left: 6em;
  z-index: 10;
}

.pokemon-icon.squirtle .shell::after {
  content: '';
  width: 3em;
  height: 8.5em;
  background-color: #bd6a00;
  border-radius: 0 3em 3em 0;
  position: absolute;
  top: 3.5em;
  left: 8em;
  z-index: 5;
}

.pokemon-icon.squirtle .tail::before {
  content: '';
  width: 3em;
  height: 6.5em;
  background-color: #94d5cd;
  border-radius: 0 3em 3em 0;
  position: absolute;
  top: 4.5em;
  left: 9.5em;
  z-index: 4;
}

.pokemon-icon.squirtle .tail::after {
  content: '';
  width: 5em;
  height: 5em;
  background-color: #94d5cd;
  border-radius: 3em;
  position: absolute;
  top: 2em;
  left: 9em;
  z-index: 4;
}
</style>