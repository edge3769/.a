<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        let {id} = params
        if(!user){
            this.redirect('302', 'enter')
        }
        let { items, page, total } = await api.get(`messages?id=${id}`)
        let messages = items
        let room = await api.get(`rooms/${id}`)
        let ids = await api.get(`idsinroom/${id}`).then(r=>r.ids)
        console.log(ids)
        return {room, messages, page, total, user, ids, id}
    }
</script>

<script>
    export let room, messages, page, total, user, ids, id
    import { context } from '../../stores.js'
    import {
        Row,
        Button,
        Column,
        TextInput,
    } from 'carbon-components-svelte'
    import io from 'socket.io-client'
    import { onMount } from 'svelte'

    $context = room.name

    onMount(()=>{
        div = document.getElementById('div')
    })

    const socket = io()

    let body
    let ref
    let div

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }

    socket.on('gmsg', (obj, fn)=>{
        fn('res')
        messages = [...messages, obj]
    })

    $: if(total > 100 && div.scrollTop == 0){
        page++
        get()
    }

    let get=async()=>{
        let res = await api.get(`/messages?id=${id}&page=${page}`)
        messages = res.items
        total = res.total
    }

    let send=async()=>{
        await api.put('messages', {id, body}, user.token)
        let obj = {ids: ids, user: user.username, room: id, body}
        messages = [...messages, obj]
        socket.emit('room', obj)
        updateScroll()
        body=''
    }

    let updateScroll=()=>{
        setTimeout(()=>{
            div.scrollTop=div.scrollHeight
        }, 0)
    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>'Rooms'</title>
</svelte:head>

<Row noGutter>
    <Column>
        <p class='head'>{$context}</p>
        <div class='head-space'></div>
    </Column>
</Row>

<div style='height: 90%;' id='div'>
    {#each messages as message}
        <Row noGutter>
            <Column>
                <p style='color: grey; font-size: 0.75rem;'>{message.user}</p>
                <p>{message.body}</p>            
            </Column>
        </Row>
    {/each}
</div>

<Row noGutter>
    <Column>
        <TextInput bind:ref bind:value={body} />
    </Column>
</Row>

<style>
    .head-space {
        height: 0.5rem;
    }
    .head {
        font-size: .875rem;
        line-height: 1.125em;
        font-weight: 600;
        letter-spacing: .16px;
    }
</style>