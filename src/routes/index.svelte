<script context='module'> 
    export async function load({ session }){
        const token = session.token
        const res = await api.get('user', token)
        if (!res) {
            token = null
        }
        return {
            props: {
                token
            }
        }
    }
</script>

<script>
    export let token
    import {
        Row,
        Column,
        Checkbox
    } from 'carbon-components-svelte'
    import Tag from '$lib/components/Tag.svelte'
    import * as api from '$lib/api'
    import {
        tags
    } from '$lib/stores'

    $: if(!mine){
        visible=true
    }

    $: get($tags, mine, visible)

    let rooms = []
    let total = 0
    let page = 0
    let visible
    let mine
    let got

    let get = async function(){
        let tagString = JSON.stringify($tags)
        let url = `telegram?tags=${tagString}&visble=${visible}&page=${page+1}`
        if(mine) {
            url = url + '&mine'
        }
        let res = await api.get(url, token)
        console.log(res)
        if(Array.isArray(res.items)){
            rooms = res.items
        }
        total = res.total
        got = true

    }
</script>

<svelte:head>
    <title>369</title>
</svelte:head>

<Tag on:change={get} bind:tags={$tags} />

<Row noGutter>
    <Column sm={2} md={2} lg={2} xlg={2}>
        <div style='display: flex;'>
            {#if token}
                <Checkbox bind:checked={mine} labelText='Mine' />
            {/if}
            {#if mine}
                <Checkbox bind:checked={visible} labelText='Visible' />
            {/if}
        </div>
    </Column>
</Row>

{#each rooms as room}
    <br />
    <Row noGutter>
        <Column>
            <p class='item' href={room.link}>{room.name}</p>
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

<style>
    .item {
        width: min-content;
        cursor: pointer; 
    }
    .item:hover {
        color: grey;
    }
</style>