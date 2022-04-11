<svelte:window on:appinstalled={installed} on:beforeinstallprompt={before} />

<script>
  import { post } from 'utils.js'
  import { goto } from '$app/navigation'
  import SideNavLink from './SideNavLink.svelte'
  import { open, isSideNavOpen, logged } from '../../stores.js'
  import {
    SkipToContent,
    SideNavItems,
    SideNav,
    Header
  } from "carbon-components-svelte"

  let show
  let installRef
  let installPrompt
  $isSideNavOpen = false

  let openAdd=()=>{
    $open=true
  }

  let installed=()=>{
    show=false
  }

  let before=(e)=>{
    show=true
    e.preventDefault()
    installPrompt = e
  }

  let install=()=>{
        installPrompt.prompt()
        installPrompt.userChoice.then((choice)=>{
          if(choice.outcome === 'accepted'){
            show = false
          }
        })
  }

  import { session } from '$app/stores'

  if ($session.user){
    $logged = true
  }

  let exit = async()=>{
    await post(`auth/exit`)
    delete $session.user
    $logged=false
    goto('enter')
  }
</script>

<Header 
  persistentHamburgerMenu={true}
  company='xd'
  platFormName=''
  bind:isSideNavOpen={$isSideNavOpen}
  href='/'
>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
</Header>

<SideNav bind:isOpen={$isSideNavOpen}>
  <SideNavItems>
    {#if $session.user && $logged}
      {#if show}
        <SideNavLink bind:ref={installRef} on:click={install} href='' text='Add To Homescreen'/>
      {/if}
      <SideNavLink on:click={openAdd} href='add_room' text='Add Room'/>
      <!-- <SideNavLink href='rooms/{$session.user.id}' text='My Rooms'/> -->
      <SideNavLink href='rooms' text='Rooms'/>
      <SideNavLink href='users' text='Users'/>
      <SideNavLink href='edit' text='Edit'/>
      <SideNavLink text='Exit' href='' on:click={exit} />
    {/if}
    {#if !$session.user || !$logged}
      <SideNavLink text='Enter' href='enter'/>
    {/if}
  </SideNavItems>
</SideNav>