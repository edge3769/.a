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

    let messages = []
    let message

    socket.on('connect', async()=>{
        await api.put('users', {socket_id: socket.id}, user.token)
    })

    socket.on('umsg', (msg)=>{
        messages = [...messages, msg]
    })

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }

    let send=()=>{
        let obj = {id: id, msg: message}
        messages = [...messages, obj]
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
    {#each messages as message}
        <Row noGutter>
            <Column>
                <p>{message.msg}</p>
            </Column>
        </Row>
    {/each}
</div>

<Row noGutter>
    <Column>
        <TextInput bind:value={message} />
    </Column>
</Row>