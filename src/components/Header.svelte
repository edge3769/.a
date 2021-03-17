<script>
  import { post } from 'utils.js'
  import { stores, goto } from '@sapper/app'
  import SideNavLink from './SideNavLink.svelte'
  import { isSideNavOpen, context, logged } from '../stores.js'
  import {
    SkipToContent,
    SideNavItems,
    SideNav,
    Header
  } from "carbon-components-svelte"

  $isSideNavOpen = false

  let { session } = stores()

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
  company='x'
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
      <SideNavLink href='add_room' text='Add Room'/>
      <SideNavLink href='rooms/{$session.user.id}' text='My Rooms'/>
      <!-- <SideNavLink href='rooms' text='Rooms'/> -->
      <SideNavLink href='edit' text='Edit'/>
      <SideNavLink text='Exit' href='' on:click={exit} />
    {/if}
    {#if !$session.user || !$logged}
      <SideNavLink text='Enter' href='enter'/>
    {/if}
  </SideNavItems>
</SideNav>