<script context='module'> 
    export async function preload({params}, {user}){
        if(!user){
            this.redirect('302', 'enter')
        }
        return {user}
    }
</script>

<script>
    export let user
    import {
        Row,
        Link,
        Column,
        PaginationNav,
    } from 'carbon-components-svelte'
    import Tag from '../components/Tag.svelte'
    import * as api from 'api'
    import { goto } from '@sapper/app'
    import {
        roomTags
    } from '../stores.js'

    let rooms = []
    let page = 0
    let total = 0
    let pages = 0
    let got

    let go=async(room)=>{
        await api.put('join', {id: room.id}, user.token)
        goto(`room/${room.id}`)
    }

    let get = async function(){
        let tagString = JSON.stringify($roomTags)
        let url = `rooms?tags=${tagString}&visible=1&page=${page+1}`
        let res = await api.get(url, user.token)
        if(Array.isArray(res.items)){
            rooms = res.items
        }
        total = res.total
        pages = res.pages
        got = true

    }
</script>

<svelte:head>
    <title>369</title>
</svelte:head>

<Tag on:change={get} bind:tags={$roomTags} />

{#each rooms as room}
    <br />
    <Row noGutter>
        <Column>
            <Link href='' on:click={go(room)}>{room.name}</Link>
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

{#if total>10}
    <Row noGutter>
        <Column>
            <PaginationNav loop bind:page bind:total={pages}/>
        </Column>
    </Row>
{/if}