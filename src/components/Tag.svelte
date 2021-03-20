<script>
    export let tags = []
    import {
        Tag,
        Row,
        Search,
        Column,
        TextInput
    } from 'carbon-components-svelte'

    let focused
    let value
    let open

    let focus=()=>{
        focused=true
        if(tags.length > 0) open=true
    }

    let blur=()=>{
        focused=false
        open=false
        add()
    }

    let keydown=(e)=>{
        switch(e.keyCode){
            case 13:
                if (focused){
                    add()
                }
        }
    }

    let add=()=>{
        if (value != '' && !tags.includes(value)){
            tags=[...tags, value]
            open=true
            value=''
        }
    }

    let del=(tag)=>{
        tags=tags.filter(t => t != tag)
    }

    let clear=()=>{
        tags=[]
        open=false
    }
</script>

<svelte:window on:keydown={keydown} />

<Row noGutter>
    <Column>
        <TextInput placeholder='Add Tag' on:focus={focus} on:blur={blur} bind:value />
        <slot />
    </Column>
</Row>

{#if open}
    <Row noGutter>
        <Column>
            <Tag on:click={clear} type='magenta'>
                Clear
            </Tag>
            {#each tags as tag}
                <Tag filter on:click={del(tag)}>{tag}</Tag>
            {/each}
        </Column>
    </Row>
{/if}
