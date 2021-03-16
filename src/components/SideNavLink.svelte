<script>
    export let href
    export let text
    import { isSideNavOpen } from '../stores.js'
    import { SideNavLink } from 'carbon-components-svelte'

    $isSideNavOpen = false

</script>

<SideNavLink on:click={()=>($isSideNavOpen=false)} bind:href bind:text />