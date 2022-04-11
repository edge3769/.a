<script>
import "carbon-components-svelte/css/all.css";

  import {
    Content,
    Grid,
  } from "carbon-components-svelte";
  import url8 from 'url8'
  import Header from "../lib/components/Header.svelte";
  import Theme from "../lib/components/Theme.svelte";
  import {stores} from '$app/navigation'
  import * as api from '$lib/components/api'

  let deferredPrompt

  const prompt=()=>{
    window.addEventListener('beforeInstallPrompt', (e)=>{
      e.preventDefault()
      deferredPrompt = e
      deferredPrompt.prompt()
    })
  }

  import {session} from '$app/stores'

  let getSub=()=>{
    navigator.serviceWorker.ready
    .then((registration)=>{
      return registration.pushManager.getSubscription()
      .then(async(sub)=>{
        if (sub){
          return sub
        }
        let vapidKey = await fetch(`get`).then(async(r)=>{
          r = await r.text()
          r = url8(r)
          return r
        })
        let options = {
          userVisibleOnly: true,
          applicationServerKey: vapidKey
        }
        return registration.pushManager.subscribe(options)
      })
    }).then(async(sub)=>{
      await api.post('subs', {id: $session.user.id, sub})
    })
  }  

  if(typeof window != 'undefined'){
    if(navigator && navigator.serviceWorker && $session.user){
      getSub()  
    }
  } 
</script>


<Theme persist theme="g10">
  <Header segment="{segment}" />
  <Content style="background: none; padding: 1rem">
    <Grid noGutter>
      <slot />
    </Grid>
  </Content>
</Theme>
