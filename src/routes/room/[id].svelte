<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        let {id} = params
        if(!user){
            this.redirect('302', 'enter')
        }
        let { items, page, total } = await api.get(`messages?id=${id}`, user.token)
        if (!Array.isArray(items)) items = []
        let room = await api.get(`rooms/${id}`, user.token)
        return {room, items, page, total, user, id}
    }
</script>

<script>
    export let room, items, page, total, user, id
    import {goto} from '@sapper/app'
    import { context } from '../../stores.js'
    import {
        Row,
        Column,
        TextInput,
    } from 'carbon-components-svelte'
    import io from 'socket.io-client'
    import {onMount} from 'svelte'

    let go=()=>{
        if(!room.open && room.user == user.username){
            goto(`edit/${room.id}`)
        }
    }

    onMount(()=>{
        window.scrollTo({left: 0, top: document.body.scrollHeight})
        ref.focus()
    })

    $context = room.name

    $: if(total > 100 && window.scrollTop==window.scrollHeight){
        page++
        get()
    }

    const socket = io()
    socket.on('connect', ()=>{
        socket.emit('join', id)
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
        if(!value) return
        value=value.trim()
        let obj = {user: user.username, id, value}
        items = [...items, obj]
        socket.emit('msg', obj)
        await api.put('messages', {id, value}, user.token)
        updateScroll()
        value=''
    }

    let updateScroll=()=>{
        setInterval(()=>{
            window.scrollTo({left: 0, top: document.body.scrollHeight})
        }, 0)
    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>'Rooms'</title>
</svelte:head>

<Row noGutter>
    <Column>
        <p on:click={go} class='head'>{$context}</p>
        <div class='head-space'></div>
    </Column>
</Row>

{#each items as item}
    <Row noGutter>
        <Column>
            <p style='color: grey; font-size: 0.75rem;'>{item.user}</p>
            <p style='overflow-wrap: break-word'>{item.value}</p>            
        </Column>
    </Row>
{/each}

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