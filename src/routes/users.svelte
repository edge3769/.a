<script context='module'> 
    export async function load({session}){
        let user = session.user
        if(!user){
            return {
                status: 302,
                redirect: 'enter'
            }
        }
        return {props: {user}}
    }
</script>

<script>
    export let user
    import {
        Row,
        Link,
        Column
    } from 'carbon-components-svelte'
    import Tag from '../lib/components/Tag.svelte'
    import * as api from '$lib/components/api'
    import { goto } from '$app/navigation'
    import {
        open,
        username,
        userTags
    } from '../stores.js'

    let users = []
    let page = 0
    let total = 0
    let got

    let go=async(u)=>{
        $open=false
        $username=u
        goto('add_room')
    }

    let get=async()=>{
        let tagString = JSON.stringify($userTags)
        let url = `users?tags=${tagString}&page=${page+1}`
        let res = await api.get(url, user.token)
        if(Array.isArray(res.items)){
            users = res.items
        }
        total = res.total
        got = true

    }
</script>

<svelte:head>
    <title>369</title>
</svelte:head>

<Tag on:change={get} bind:tags={$userTags} />

{#each users as user}
    <br />
    <Row noGutter>
        <Column>
            <p on:click={go(user.username)}>{user.username}</p>
        </Column>
    </Row>
{/each}

{#if got && total < 1}
    <Row noGutter>
        <Column>
            <p>There don't seem to be any results</p>        
        </Column>
    </Row>
{/if}