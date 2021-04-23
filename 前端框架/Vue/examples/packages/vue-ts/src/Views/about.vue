<template>
    <div>
        This is ABOUT template..{{someabout}}
        </br>
          <multiselect v-bind:selected="mselected" 
          v-bind:options="options" :showLabels="false"
          :searchable='true' :allowEmpty='false'  >
          </multiselect></br>
            some input text <input type="text" v-model="someabout">
         </br></br>
          And multi searchable</br></br>
           <multiselect 
            v-bind:value="mselected" 
            v-bind:options="options" 
          :showLabels="false" :searchable='true' :allowEmpty='true'
          :multiple="true" :taggable='true' @tag="addTag" @input="updateSelectedTagging"
            >
          </multiselect> 
              <br>
   <ul id="example-1">
  <li v-for="m in msg" v-bind:key='m'>
    {{ m }}
  </li>
</ul> <button @click.stop='test' >test</button>
    </div>

</template>
<script lang="ts" >
import { Component, Inject, Model, Prop, Vue,Watch  } from 'vue-property-decorator'
import multiselect from 'vue-multiselect';


 @Component({
      name: 'aboutname', components:{ multiselect }
 })
export default class extends Vue {
    someabout = 'about'  
    mselected = [];
    options = ['polo', 'trans', 'golf','jaguar', 'a6', 'tiguan', 'kadjar','ateca']; 
   // db : fn.SignalRDM;
   // connected = false;
    msg = [];
     mounted() {    
       console.log('about mounted')      
    }  

    addTag(tag:string)
    {
        this.options.push(tag);
         this.mselected.push(tag)
    }
    updateSelectedTagging (value) 
    {
       // console.log('@tag: ', value)
        this.mselected = value
    }
//experimental
   test () 
    {  
            
    }
 
  
  created() {   
    
         console.log('about created');
        }
      
}
</script>