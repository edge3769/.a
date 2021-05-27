<script context="module">
    import * as api from '$lib/api';
    export async function load({ page, session }) {
        const token = session.token
        if (!token){
            return {
                status: 302,
                redirect: 'login'
            }
        }
        const res = await api.get('user', token)
        if(res.error){
            return {
                status: res.status,
                error: res.error
            }
        }
        return {
            props: {
                user: res
            }
        }
    }
</script>
    
<script>
    export let user
    import { goto } from '$app/navigation'
    import {
        FluidForm,
        Checkbox,
        Button,
        Column,
        Row,
    } from 'carbon-components-svelte'
    import Tag from '$lib/components/Tag.svelte'
    import Input from '$lib/components/Input/Input.svelte'

    let username = user.username
    let visible = user.visible
    let token = user.token
    let tags = user.tags

    let usernameInvalid
    let usernameError

    $: if (username === '') {
        usernameInvalid=true
        usernameError='No username'
    } else {
        usernameInvalid=false
    }

    let checkUsername = async () => {
        if (username != user.username){
            usernameInvalid = await api.get(`check_username/${username}`).then(r => !r.res)
        }
    }

    let edit = async () => {
        if(usernameInvalid) return
        let data = {
            username,
            visible,
            tags,
        } 
        let res = await api.put('users', data, token)
        usernameInvalid = res.usernameInvalid
        usernameError = res.usernameError
        if (res.id) {
            goto('/')
        }
    }
</script>

<svelte:head>
    <title>Edit</title>
</svelte:head>

<Row noGutter>
    <Column>
        <Checkbox bind:checked={visible} labelText='Visible'/>
    </Column>
</Row>

<Tag bind:tags={tags} />
    
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