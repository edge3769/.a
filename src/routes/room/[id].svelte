<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        let {id} = params
        if(!user){
            this.redirect('302', 'enter')
        }
        let { items, page, total } = await api.get(`messages?id=${id}`)
        let messages = items
        let room = await api.get(`rooms/${id}`, user.token)
        return {room, messages, page, total, user, id}
    }
</script>

<script>
    export let room, messages, page, total, user, id
    import { context } from '../../stores.js'
    import {
        Row,
        Column,
        TextInput,
    } from 'carbon-components-svelte'
    import io from 'socket.io-client'
    import { onMount } from 'svelte'

    const socket = io()
    $context = room.name
    let body
    let ref

    socket.emit('join', room.id)
    
    onMount(async()=>{
        await api.put(`in_room/${id}`, null, user.token)
    })

    let unload=async()=>{
        await api.put(`left/${id}`, user.token)
    }

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }
        
    socket.on('connect', ()=>{
        console.log(id, socket.id)
    })

    socket.on('gmsg', (obj)=>{
        console.log('gmsg')
        messages = [...messages, obj]
        updateScroll()
    })

    // $: if(total > 100 && document.body.scrollTop == 0){
    //     page++
    //     get()
    // }

    let get=async()=>{
        let res = await api.get(`/messages?id=${id}&page=${page}`)
        messages = res.items
        total = res.total
    }

    let send=async()=>{
        if(!body) return
        await api.put('messages', {id, body}, user.token)
        let obj = {unseen: user.unseen, user: user.username, room: id, body}
        messages = [...messages, obj]
        socket.emit('room', obj, (response)=>{
            console.log(response.status)
        })
        updateScroll()
        body=''
    }

    let updateScroll=()=>{
        let chat = document.getElementById('chat')
        setTimeout(()=>{
            chat.scrollTop=chat.scrollHeight
        }, 3)
    }
</script>

<svelte:window on:unload={unload} on:keydown={keydown} />

<svelte:head>
    <title>{room.name}</title>
</svelte:head>

<Row noGutter>
    <Column>
        <p class='head'>{$context}</p>
        <div class='head-space'></div>
    </Column>
</Row>

<div style='height: 400px;' id='chat'>
    <div>
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
</div>

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