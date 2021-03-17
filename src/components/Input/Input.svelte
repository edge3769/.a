<script>
    import Invalid from './Invalid.svelte'
    import Valid from './Valid.svelte'
    import purify from 'dompurify'

    export let value
    export let invalid
    export let password = false
    export let labelText
    export let invalidText

    let current = Valid

    $: value = purify.sanitize(value)

    $: if (invalid==true) {
        current = Invalid
    } else if (invalid==false) {
        current = Valid
    }
</script>

<svelte:component this={current} {invalidText} {labelText} {password} bind:value />
