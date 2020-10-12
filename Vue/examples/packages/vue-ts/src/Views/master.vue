<template>
       <div class="site-wrapper">

      <div class="site-wrapper-inner">

        <div class="cover-container">

          <div class="masthead clearfix">
            <div class="inner">
              <h3 class="masthead-brand">Cover</h3>
              <nav class="nav nav-masthead">
                
                 <router-link tag="a" to="/">
                      <a class="nav-link">Home</a>
                 </router-link>   
                <router-link tag="a" to="about">
                     <a class="nav-link">About</a>
                 </router-link>               
                 <router-link tag="a" to="/ts">
                  <a class="nav-link">Contact</a>
                 </router-link>   
              </nav>
            </div>
          </div>

          <div class="inner cover">
            <br/><br/><br/><br/>
            <h1 class="cover-heading">Cover your page. {{ someprop}}</h1>
            <p class="lead">Cover is a one-page template for building simple and beautiful home pages. Download, edit the text, and add your own fullscreen background photo to make it your own.</p>
            
            <p class="lead">
              <a href="#" class="btn btn-lg btn-secondary">Learn more</a>
            </p>
            <p>
            <transition name="slide" mode="out-in">
                <router-view :key="$route.fullPath" class="view"></router-view>
              </transition>
              </p>
          </div>

          <!-- <div class="mastfoot">
            <div class="inner">
              <p>Cover template for <a href="https://getbootstrap.com">Bootstrap</a>, by <a href="https://twitter.com/mdo">@mdo</a>.</p>
            </div>
          </div> -->

        </div>

      </div>

    </div>

</template>
<script lang="ts">
import navbar from "@/components/navbar.vue";
import store from "System/store";

import { Component, Inject, Model, Prop, Vue, Watch } from "ext1"; 
//extending default vue instance with special features, aka good tactics via inheritance
import "bootstrap";

@Component({
  components: { navbar }
}) //,separatets, about , Bootstrap
export default class master extends Vue {
  name = "master";
  loc = "at";
  @Prop() someprop: Number;
  //example of manipulating central store values
  mounted() {
    //here you show the alert
    console.log("app mounted , store dateformat:" + this.vars.dateformat);
  }
}
</script>
<style lang="less" >
/*
 * Globals
 */
body {
  color: white !important;
  background-color: #333 !important;
}

/* Links */
a,
a:focus,
a:hover {
  color: #fff;
}

/* Custom default button */
.btn-secondary,
.btn-secondary:hover,
.btn-secondary:focus {
  color: #333;
  text-shadow: none; /* Prevent inheritance from `body` */
  background-color: #fff;
  border: 0.05rem solid #fff;
}

.nav-link {
  padding-left: 10px;
  padding-right: 10px;
}

/*
 * Base structure
 */

html,
body {
  height: 100%;
  background-color: #333;
}
body {
  color: #fff;
  text-align: center;
  text-shadow: 0 0.05rem 0.1rem rgba(0, 0, 0, 0.5);
}

/* Extra markup and styles for table-esque vertical and horizontal centering */
.site-wrapper {
  display: table;
  width: 100%;
  height: 100%; /* For at least Firefox */
  min-height: 100%;
  -webkit-box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.5);
  box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.5);
}
.site-wrapper-inner {
  display: table-cell;
  vertical-align: top;
}
.cover-container {
  margin-right: auto;
  margin-left: auto;
}

/* Padding for spacing */
.inner {
  padding: 2rem;
}

/*
 * Header
 */

.masthead {
  margin-bottom: 2rem;
}

.masthead-brand {
  margin-bottom: 0;
}

.nav-masthead .nav-link {
  padding: 0.25rem 0;
  font-weight: bold;
  color: rgba(255, 255, 255, 0.5);
  background-color: transparent;
  border-bottom: 0.25rem solid transparent;
}

.nav-masthead .nav-link:hover,
.nav-masthead .nav-link:focus {
  border-bottom-color: rgba(255, 255, 255, 0.25);
}

.nav-masthead .nav-link + .nav-link {
  margin-left: 1rem;
}

.nav-masthead .active {
  color: #fff;
  border-bottom-color: #fff;
}

@media (min-width: 48em) {
  .masthead-brand {
    float: left;
  }
  .nav-masthead {
    float: right;
  }
}

/*
 * Cover
 */

.cover {
  padding: 0 1.5rem;
}
.cover .btn-lg {
  padding: 0.75rem 1.25rem;
  font-weight: bold;
}

/*
 * Footer
 */

.mastfoot {
  color: rgba(255, 255, 255, 0.5);
}

/*
 * Affix and center
 */

@media (min-width: 40em) {
  /* Pull out the header and footer */
  .masthead {
    position: fixed;
    top: 0;
  }
  .mastfoot {
    position: fixed;
    bottom: 0;
  }
  /* Start the vertical centering */
  .site-wrapper-inner {
    vertical-align: middle;
  }
  /* Handle the widths */
  .masthead,
  .mastfoot,
  .cover-container {
    width: 100%; /* Must be percentage or pixels for horizontal alignment */
  }
}

@media (min-width: 62em) {
  .masthead,
  .mastfoot,
  .cover-container {
    width: 42rem;
  }
}
</style>