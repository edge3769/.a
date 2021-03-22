<script context='module'>
    import * as api from 'api'
    export async function preload({}, {user}){
        if(!user){
            this.redirect(302, 'enter')
        }
        let rooms
        let {items, total, pages} = await api.get('xrooms', user.token)
        if (Array.isArray(items)) {
            rooms = items
        } else {
            rooms = []
        }
        return {rooms, pages, total, user}
    }
</script>

<script>
    export let rooms, user, pages, total
    import {
        Row,
        Link,
        Column,
    } from 'carbon-components-svelte'
    import {onMount} from 'svelte'
    import Tag from '../components/Tag.svelte'

    let tags
    let div

    $: if(div && total > 100 && div.scrollTop==div.scrollHeight){
        page++
        get()
    }

    onMount(()=>{
        div = document.getElementById('div')
    })

    let get=async()=>{
        let tagString = JSON.stringify(tags)
        let res = await api.get(`xrooms?tags=${tagString}&page=${page}`, user.token)
        rooms = res.items
        pages = res.pages
        total = res.total
    }
</script>

<Tag on:change={get} bind:tags />

<div id='div'>
    {#each rooms as room}
        <br />
        <Row noGutter>
            {#if room.unseen}
                <Column>
                    <Link rel='prefetch' style='font-weight: 600' href='room/{room.id}'>{room.name}</Link>
                </Column>
            {:else}
                <Column>
                    <Link rel='prefetch' href='room/{room.id}'>{room.name}</Link>
                </Column>
            {/if}
        </Row>
    {/each}
</div>