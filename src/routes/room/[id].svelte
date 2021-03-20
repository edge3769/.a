<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        let {id} = params
        if(!user){
            this.redirect('302', 'enter')
        }
        let { items } = await api.get(`messages?id=${id}`)
        let room = await api.get(`rooms/${id}`, user.token)
        return {room, items, user, id}
    }
</script>

<script>
    export let room, items, user, id
    import { context } from '../../stores.js'
    import {
        Row,
        Column,
        TextInput,
    } from 'carbon-components-svelte'
    import io from 'socket.io-client'

    $context = room.name

    const socket = io()
    socket.on('connect', ()=>{
        socket.emit('join', id)
        console.log('sr', socket.id, socket.rooms)
    })

    let value
    let ref

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }

    socket.on('msg', (obj)=>{
        items = [...items, obj]
        updateScroll()
    })

    let send=async()=>{
        // await api.put('messages', {id, value}, user.token)
        let obj = {user: user.username, id, value}
        items = [...items, obj]
        socket.emit('msg', obj)
        updateScroll()
        value=''
    }

    let updateScroll=()=>{
        setTimeout(()=>{
            let div = document.getElementById('div')
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
    {#each items as item}
        <Row noGutter>
            <Column>
                <p style='color: grey; font-size: 0.75rem;'>{item.user}</p>
                <p>{item.value}</p>            
            </Column>
        </Row>
    {/each}
</div>

<Row noGutter>
    <Column>
        <TextInput bind:ref bind:value />
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