<script>
  export let segment = undefined;

  import {
    Content,
    Grid,
  } from "carbon-components-svelte";
  import { stores } from '@sapper/app'
  import url8 from 'url8'
  import Header from "../components/Header.svelte";
  import Theme from "../components/Theme.svelte";
  import * as api from 'api'

  let {session} = stores()

  let getSub=()=>{
    navigator.serviceWorker.ready
    .then((registration)=>{
      return registration.pushManager.getSubscription()
      .then(async(s)=>{
        if (s){
          return s
        }
        let res = await fetch(`get`)
        let vapidKey = await res.text()
        vapidKey = url8(vapidKey)
        let options = {
          applicationServerKey: vapidKey
        }
        return registration.pushManager.subscribe(options)
      })
    }).then(async(sub)=>{
        await api.post('subs', {id: $session.user.id, sub: sub})
    })
  }  

  // if($session.user && typeof window !== 'undefined') getSub()
</script>


<Theme persist theme="g10">
  <Header segment="{segment}" />
  <Content style="background: none; padding: 1rem">
    <Grid noGutter>
      <slot />
    </Grid>
  </Content>
</Theme>
