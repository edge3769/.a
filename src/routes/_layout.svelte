<script>
  export let segment = undefined;

  import {
    Content,
    Grid,
  } from "carbon-components-svelte";
  import url8 from 'url8'
  import Header from "../components/Header.svelte";
  import Theme from "../components/Theme.svelte";
  import {stores} from '@sapper/app'
  import * as api from 'api'

  let deferredPrompt

  const prompt=()=>{
    window.addEventListener('beforeInstallPrompt', (e)=>{
      e.preventDefault()
      deferredPrompt = e
      deferredPrompt.prompt()
    })
  }

  const {session} = stores()

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
    }).then((sub)=>{
      api.post('subs', {id: $session.user.id, sub})
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
