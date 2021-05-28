<script>
    import Invalid from './Invalid.svelte'
    import Valid from './Valid.svelte'

    export let value
    export let invalid
    export let password = false
    export let labelText
    export let invalidText


    $: if (invalid==true) {
        current = Invalid
    } else if (invalid==false) {
        current = Valid
    }

    let current = Valid

    const validate=()=>{
        console.log('v')
        invalid=false
    }
</script>

<svelte:component on:input={validate} this={current} {invalidText} {labelText} {password} bind:value />
