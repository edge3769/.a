<svelte:window on:appinstalled={installed} on:beforeinstallprompt={before} />

<script>
  import { post } from '$lib/utils'
  import { goto } from '$app/navigation'
  import { page, session } from '$app/stores'
  import SideNavLink from '$lib/components/SideNavLink.svelte'
  import { isSideNavOpen } from '$lib/stores'
  import {
    SkipToContent,
    SideNavItems,
    SideNav,
    Header
  } from "carbon-components-svelte"

  let show
  let installRef
  let installPrompt
  let token = $session.token

  const installed=()=>{
    show=false
  }

  const before=(e)=>{
    show=true
    e.preventDefault()
    installPrompt = e
  }

  const install=()=>{
        installPrompt.prompt()
        installPrompt.userChoice.then((choice)=>{
          if(choice.outcome === 'accepted'){
            show = false
          }
        })
  }

  const exit = async()=>{
    await post('/auth/exit')
    delete $session.token
    goto('/login')
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
    {#if token}
      {#if show}
        <SideNavLink bind:ref={installRef} on:click={install} href='' text='Add To Homescreen'/>
      {/if}
      <SideNavLink isSelected={$page.path.split('/')[1] == 'add' ? true : false} href='add' text='Add'/>
      <SideNavLink text='Exit' href='' on:click={exit} />
    {/if}
    {#if !token}
      <SideNavLink text='Login' href='login'/>
    {/if}
  </SideNavItems>
</SideNav>