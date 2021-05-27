<script context='module'>
    import * as api from '$lib/api'
    export async function load({ session }){
        const token = session.token
        if(!token){
            return {
                status: 302,
                redirect: 'login'
            }
        }
        const user_res = await api.get('user', token)
        if(user_res.error){
            return {
                status: user_res.status,
                error: user_res.error
            }
        }
        let rooms
        let room_res = await api.get('xrooms', token)
        if(room_res.error){
            return {
                status: room_res.status,
                error: room_res.error
            }
        }
        let { items, total, page } = room_res
        if (Array.isArray(items)) {
            rooms = items
        } else {
            rooms = []
        }
        return {
            props: {
                user: user_res,
                rooms,
                total,
                page
            }
        }
    }
</script>

<script>
    export let rooms
    export let total
    export let page
    export let user
    import {
        Row,
        Column,
    } from 'carbon-components-svelte'
    import Tag from '$lib/components/Tag.svelte'
    import { goto } from '$lib/navigation'

    let tags

    $: if(typeof document != 'undefined' && total>100 && document.body.scrollTop==document.body.scrollHeight){
        page++
        get()
    }

    let go=(room)=>{
        goto(`/room/${room.id}`)
    }

    let get=async()=>{
        let tagString = JSON.stringify(tags)
        let res = await api.get(`xrooms?tags=${tagString}&page=${page}`, user.token)
        rooms = res.items
        total = res.total
    }
</script>

<Tag on:change={get} bind:tags />

{#each rooms as room}
    <br />
    <Row noGutter>
        <Column>
            <p class:unseen={room.unseen} class='item' on:click={go(room)}>{room.name}</p>
        </Column>
    </Row>
{/each}

<style>
    .item {
        width: min-content;
        cursor: pointer; 
    }
    .item:hover {
        color: grey;
    }
    .unseen {
        font-weight: 600;
    }
</style>