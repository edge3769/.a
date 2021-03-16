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

  if (!$context) $context='Groups'

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
  company={$context}
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
    <!-- <SideNavLink href='events' text='Events'/> -->
    {#if $session.user && $logged}
      <!-- <SideNavLink href='add_event' text='Add Event'/> -->
      <SideNavLink href='chats' text='Chats'/>
      <SideNavLink href='users' text='Users'/>
      <SideNavLink href='add_group' text='Add Group'/>
      <SideNavLink href='groups/{$session.user.id}' text='My Groups'/>
      <SideNavLink href='edit' text='Edit'/>
      <SideNavLink text='Exit' href='' on:click={exit} />
    {/if}
    {#if !$session.user || !$logged}
      <SideNavLink text='Enter' href='enter'/>
    {/if}
  </SideNavItems>
</SideNav>