<template>
  <div >
   
    <h1> {{ mess }}</h1>
    <h1>counter is {{ vars.count }}</h1>
    <h1> test</h1>
     <button @click='test' >test </button>
     <button @click='increment' >++ </button>
     <button @click='decrement' >-- </button>
     <router-link :to="'/test/1'" class="">link</router-link>
     <router-link :to="'/test'" class="">link</router-link>
  </div>
</template>

<script lang='ts'>
//official vue class component usage via vue property decorator

//import { Component,  prop, watch } from 'vue-class-decorators';
import { RouterOptions, Location, RouteConfig, Route } from 'vue-router'
import { Component, Inject, Model, Prop, Vue,Watch  } from "ext1"

@Component({ name:"test" })  //alternatively you put class name
export default class extends Vue {
  
  mess:string = 'message'
    @Prop()
    propA: number;

    @Watch('$route.path', { immediate:true})  
    onChildChanged(val: string, oldVal: string) 
    { //this.$route.
      console.log("watch call "+val);
    }  

   test():void{ 
     alert('hi there');
     this.mess = 'new message';
     }
 
   mounted() {
   console.log('tst mounted and'+ this.mess);
   //if you go over dollar its typed as any
   
   //this.sstore  //this guy is typed
   }

    created() { 
    this.mess = ' tst created';
    console.log('tst created');
  }

  increment()
  {
    this.$storets.commit('increment');
  }
  decrement()
  {
    this.$store.commit('decrement');
  }
  
} 
  </script>