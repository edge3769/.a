<script>
  export let segment = undefined;

  import {
    Content,
    Grid,
  } from "carbon-components-svelte";
  import Header from "../components/Header.svelte";
  import Theme from "../components/Theme.svelte";
  // import { isSideNavOpen } from '../stores.js'
  // import {onMount} from 'svelte'

  // onMount(()=>{
  //   document.getElementById('main-content')
  //     .addEventListener('click', ()=>{
  //       $isSideNavOpen = false
  //   })
  // })
</script>

<Theme persist theme="g10">
  <Header segment="{segment}" />
  <Content style="background: none; padding: 1rem">
    <Grid noGutter>
      <slot />
    </Grid>
  </Content>
</Theme>
