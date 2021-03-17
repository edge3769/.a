<script>
  export let segment = undefined;

  import {
    Content,
    Grid,
  } from "carbon-components-svelte";
  import { stores } from '@sapper/app'
  import Header from "../components/Header.svelte";
  import Theme from "../components/Theme.svelte";
  import * as api from 'api'
  import io from 'socket.io-client'
  const socket = io()
  // import { isSideNavOpen } from '../stores.js'
  // import {onMount} from 'svelte'

  let {session} = stores()

  socket.on('connect', async()=>{
    if($session.user){
      await api.put('users', {socket_id: socket.id}, $session.user.token)
    }
  })

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
