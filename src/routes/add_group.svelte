<script context="module">
    export async function preload({ path }, { user }) {
        if (!user) {
            this.redirect(302, `enter`);
        }
        return { user }
    }
</script>

<script>
    export let user
    import Input from '../components/Input/Input.svelte'
    import {
        Tag,
        Row,
        Button,
        Column,
        TextInput,
        ButtonSet,
        FluidForm,
    } from 'carbon-components-svelte'
    import { goto } from '@sapper/app'
    import * as api from 'api'
    import purify from 'dompurify';

    $: name = purify.sanitize(name)
    $: tag = purify.sanitize(tag)

    let name
    let nameInvalid

    let token = user.token
    let tags = []
    let current
    let open
    let tag
    let ref

    let clear = () => {
        tags = []
        open = false
    }

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                if (current==ref){
                    addTag()
                }
        }
    }

    let addTag = () => {
        if (tag != '' && !tags.includes(tag)){
            tags = [...tags, tag]
            open=true
            tag=''
        }
    }

    let delTag = (tag) => {
        tags = tags.filter(t => t != tag)
    }

    let add = async function() {
        let data = {
            tags,
            name,
        }
        let res = await api.post('groups', data, token)
        if (res.nameError) {
            nameInvalid = true
        }
        if (res.id) {
            goto(`group/${res.id}`)
        }
    }
</script>

<svelte:window on:keydown={keydown} />
    
<svelte:head>
    <title>Add Group</title>
</svelte:head>

<Row noGutter>
    <Column noGutter>
        <TextInput
            on:blur={addTag}
            on:focus={() => (current=ref)}
            placeholder='Add tag'
            bind:value={tag}
            bind:ref
        />
    </Column>
</Row>

{#if open}
    <Row noGutter>
        <Column>
            <Tag
                on:click={clear}
                type='magenta'
            >
                Clear
            </Tag>
            {#each tags as tag}
                <Tag filter on:click={delTag(tag)}>{tag}</Tag>
            {/each}
        </Column>
    </Row>
{/if}

<Row noGutter>
    <Column>
        <FluidForm>
            <Input
                bind:invalid={nameInvalid}
                invalidText='Name taken'
                labelText="Name"
                bind:value={name} 
            />
        </FluidForm>
    </Column>
</Row>

<Row noGutter>
    <Column>     
        <ButtonSet stacked>
            <Button on:click={add}>Add</Button>
        </ButtonSet>
    </Column>
</Row>