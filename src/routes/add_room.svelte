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
    import Tag from '../components/Tag.svelte'
    import {
        Row,
        Button,
        Column,
        Checkbox,
        ButtonSet,
        FluidForm
    } from 'carbon-components-svelte'
    import {context} from '../stores.js'
    import { goto } from '@sapper/app'
    import * as api from 'api'

    let nameInvalid
    let userInvalid
    let username

    $: change(username)

    $: if(!open) tags = null

    $: if(process.browser && !(username === '')) {
        let check = window.setTimeout(checkUser, 123)
    }

    let change=()=>{
        if(username){
            name = `${user.username}.${username}`
        }
    }

    const checkUser=async()=>{
        let res = await api.get(`users/${username}`)
        if(res.id){
            userInvalid = false
        } else {
            userInvalid = true
        }
    }
    
    let open = true
    let name
    let tags

    const add = async function() {
        let data = {
            open,
            tags,
            name,
            username
        }
        let res = await api.post('rooms', data, user.token)
        if (res.nameError) {
            nameInvalid = true
        }
        if (res.id) {
            $context=name
            goto(`room/${res.id}`)
        }
    }
</script>

<svelte:head>
    <title>Add Room</title>
</svelte:head>

<Row noGutter>
    <Column>
        <Checkbox bind:checked={open} labelText='Open' />
    </Column>
</Row>

{#if open}
    <Tag bind:tags />
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
            {#if !open}
                <Input
                    bind:invalid={userInvalid}
                    invalidText='No user'
                    labelText='Username'
                    bind:value={username}
                />
            {/if}
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