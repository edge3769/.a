<script>
    export let href
    export let text
    import { context, isSideNavOpen } from '../stores.js'
    import { SideNavLink } from 'carbon-components-svelte'

    let click=()=>{
        $isSideNavOpen=false
        $context=text
    }
</script>

<SideNavLink on:click on:click={click} bind:href bind:text />