<script>
  import { post } from 'utils.js'
  import { stores, goto } from '@sapper/app'
  import { whose, logged } from '../stores.js'
  import {
    SkipToContent,
    SideNavItems,
    SideNavLink,
    SideNav,
    Header
  } from "carbon-components-svelte"

  let { session } = stores()

  if ($session.user){
    $logged = true
  }

  let isSideNavOpen = false

  let change=()=>{
    $whose = 'my'
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
  company="Marketlinks"
  platFormName=''
  bind:isSideNavOpen
  href='/'
>
  <div slot="skip-to-content">
    <SkipToContent />
  </div>
</Header>

<SideNav bind:isOpen={isSideNavOpen}>
  <SideNavItems>
    <!-- <SideNavLink href='events' text='Events'/> -->
    {#if $session.user && $logged}
      <!-- <SideNavLink href='add_event' text='Add Event'/> -->
      <SideNavLink href='users' text='Users'/>
      <SideNavLink href='add_group' text='Add Group'/>
      <SideNavLink on:click={change} href='groups/{$session.user.id}' text='My Groups'/>
      <SideNavLink href='edit' text='Edit'/>
      <SideNavLink text='Exit' href='' on:click={exit} />
    {/if}
    {#if !$session.user || !$logged}
      <SideNavLink text='Enter' href='enter'/>
    {/if}
  </SideNavItems>
</SideNav>