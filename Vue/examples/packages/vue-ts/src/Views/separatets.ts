import { Component, Inject, Model, Prop, Vue,Watch  } from 'vue-property-decorator'
//let BootstrapVue = require('bootstrap-vue'); 
import  multiselect from 'vue-multiselect';
//var multiselect = require('vue-multiselect').default;
// name:string = 'separatets'
//  name:'test' 
@Component({ components: { multiselect }, name:'ts' })
export default class extends Vue { // separatets extends Vue
  someabout = 'aboutTS'
  name = 'tscomponent'
  selected = [];
   somemethod(): number {
    
    return 1;
  }

}