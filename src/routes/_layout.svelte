<script>
  export let segment = undefined;

  import {
    Content,
    Grid,
  } from "carbon-components-svelte";
  import Header from "../components/Header.svelte";
  import Theme from "../components/Theme.svelte";
import { isSideNavOpen } from "../stores";
  // import { isSideNavOpen } from '../stores.js'
  // import {onMount} from 'svelte'

  let click=(e)=>{
    // console.log(e.target)
    // var nodeList = document.querySelectorAll('nav')
    // for (var node of nodeList){
    //   if (node != e.target){
    //     $isSideNavOpen=false
    //   }
    // }   
  }
</script>

<svelte:window on:click={click} />

<Theme persist theme="g10">
  <Header segment="{segment}" />
  <Content style="background: none; padding: 1rem">
    <Grid noGutter>
      <slot />
    </Grid>
  </Content>
</Theme>
