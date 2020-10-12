<template>
   <div>

   </div>
</template>
<script lang="ts">
    import { Component, Vue, Prop, Watch } from '../ext1'

    @Component({       
    name: 'compname'
    })
    export default class extends Vue {  
    
        public somemethod(newSelected) {
            console.log("enter your code")
          
        }          

    }
</script>
<!--<style lang="less" >
</style>-->