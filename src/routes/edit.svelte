<script context="module">
    import fs from 'fs'
    import * as api from 'api.js';
    export async function preload({params}, { user }) {
        if (!user){
            this.redirect(302, 'enter')
        }
        user = await api.get(`users/${user.id}`)
        return {user}
    }
</script>
    
<script>
    export let user
    import { goto, stores } from '@sapper/app';
    import {
        InlineLoading,
        FluidForm,
        TextInput,
        Checkbox,
        Button,
        Column,
        Row,
        Tag
    } from 'carbon-components-svelte'
    import Input from '../components/Input/Input.svelte'

    let { session } = stores();

    let username = user.username
    let visible = user.visible
    let tags = user.tags
    let token = user.token

    let usernameInvalid
    let usernameError
    let current
    let userRes
    let open
    let tag
    let ref

    $: promise=get(tags)
    let get=async()=>{
        let tagString=JSON.stringify(tags)
        userRes=await api.get(`users?tags=${tagString}`).then(r=>r.items[0].username)
        if(userRes.items){
            return userRes.items[0].username
        }
    }

    get()
    let promise = get()

    $: if (username === '') {
        usernameInvalid=true
        usernameError='No username'
    } else {
        usernameInvalid=false
    }

    let clear = () => {
        open=false
        tags = []
    }

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                if (e.ctrlKey){ edit()
                } else if (current==ref) addTag()
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

    let checkUsername = async () => {
        if (username != user.username){
            usernameInvalid = await api.get(`check_username/${username}`).then(r => !r.res)
        }
    }

    let edit = async () => {
        let data = {
            username,
            visible,
            tags,
        } 
        let res = await api.put('users', data, token)
        if (res.id) {
            $session.user = res;
            goto('/')
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>Edit</title>
</svelte:head>

{#if userRes}
    <Row noGutter>
        <Column>
            <strong>Best match</strong>
            {#await promise}
                <span><InlineLoading /></span>
            {:then userRes}
                <p>{userRes}</p>
            {/await}
        </Column>
    </Row>
{/if}

<Row noGutter>
    <Column>
        <Checkbox bind:checked={visible} labelText='Visible'/>
    </Column>
</Row>

<Row noGutter>
    <Column noGutter>
        <TextInput
            on:focus={() => {open=true; current=ref}}
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
                bind:invalidText={usernameError}
                bind:invalid={usernameInvalid}
                on:blur={checkUsername}
                bind:value={username}
                labelText="Username"
            />
        </FluidForm>
    </Column>
</Row>
    
<Row noGutter>
    <Column>
        <Button on:click={edit}>Edit</Button>
    </Column>
</Row>