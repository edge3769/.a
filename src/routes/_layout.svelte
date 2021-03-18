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
  import io from 'socket.io-client'
  const socket = io()

  let {session} = stores()

  let getSub=()=>{
    navigator.serviceWorker.ready
    .then((registration)=>{
      return registration.pushManager.getSubscription()
      .then(async(sub)=>{
        if (sub){
          return sub
        }
        vapidKey = await fetch(`get`).then(r=>url8(r.text()))
        options = {
          user_id: $session.user.id,
          userVisibleOnly: true,
          applicationServerKey: vapidKey
        }
        return registration.pushManager.subscribe(options)
      })
    }).then((sub)=>{
      s = {subscription: sub}
      body = JSON.stringify(s)
      headers = {
        'Content-type': 'application/json'
      }
      options = {
        method: 'post',
        headers: headers,
        body: body
      }
      fetch(`register`, options)
    })
  }  

  if($session.user && typeof window != 'undefined') getSub()

  function askNotificationPermission(){
    function checkNotificationPromise(){
      try {
        Notification.requestPermission().then()
      } catch(e){
        return false
      }
      return true
    }

    async function handlePermission(permission){
      if(Notification.permission==='denied' || Notification.permission==='default'){
        $session.user = await api.put('users', {notifications: false}, $session.user.token)        
      } else {
        $session.user = await api.put('users', {notifications: true}, $session.user.token)        
      } 
    }

    if((!'Notification' in window)){
      return
    } else {
      if(checkNotificationPromise()){
        Notification.requestPermission()
        .then((permission)=>{
          handlePermission(permission)
        })
      } else {
        Notification.requestPermission(function(permission){
          handlePermission(permission)
        })
      }
    }
  }

  socket.on('connect', async()=>{
    if($session.user){
      $session.user = await api.put('users', {socket_id: socket.id}, $session.user.token)
    }
  })

  socket.on('notify', (obj)=>{
    options = {
      vibrate: [137],
      renotify: true,
      tag: 'new message',
      icon: '/placeholder.png',
      badge: '/placeholder.png',
    }
    var notification = new Notification('New message', options)
    notification.onclick =(e)=>{
      e.preventDefault()
      goto('rooms')
    }
  })
</script>


<Theme persist theme="g10">
  <Header segment="{segment}" />
  <Content style="background: none; padding: 1rem">
    <Grid noGutter>
      <slot />
    </Grid>
  </Content>
</Theme>
