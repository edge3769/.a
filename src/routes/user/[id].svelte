<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        let {id} = params
        id = await api.get(`users/${id}`).then(r=>r.socket_id)
        if(!user){
            this.redirect('302', 'enter')
        }
        return {user, id}
    }
</script>

<script>
    export let user, id
    import {
        Row,
        Column,
        TextInput
    } from 'carbon-components-svelte'
    import io from 'socket.io-client'

    const socket = io()

    let items = []
    let value
    let ref

    socket.on('umsg', (msg)=>{
        items = [...items, msg]
    })

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }

    let send=()=>{
        let obj = {me: user.id, id: id, value}
        items = [...items, obj]
        socket.emit('user', obj)
        updateScroll()
        message=''
    }

    let updateScroll=()=>{
        setInterval(()=>{
            let div = document.getElementById('div')
            div.scrollTop=div.scrollHeight
        }, 0)
    }
</script>

<svelte:window on:keydown={keydown} />

<div id='div'>
    {#each items as message}
        <Row noGutter>
            <Column>
                {#if message.me == user.id}
                    <p style='padding: 0.25rem; border-left: 3px solid aliceblue;'>{message.value}</p>
                {:else}
                    <p style='padding: 0.25rem; border-left: 3px solid antiquewhite;'>{message.value}</p>
                {/if}
            </Column>
        </Row>
    {/each}
</div>

<Row noGutter>
    <Column>
        <TextInput bind:ref bind:value />
    </Column>
</Row>