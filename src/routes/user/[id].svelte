<script context='module'>
    export async function preload({params}, {user}){
        let {id} = params
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

    let message
    let messages = []

    socket.on('connect', ()=>{
        user.socket_id = socket.id
    })

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }

    let send=()=>{
        msgObj = {user: user.username, body: message}
        messages = [...messages, msgObj]
        io.to(id).emit('message', msgObj)
        updateScroll()
        message=''
    }

    let updateScroll=()=>{
        let div = document.getElementById('div')
        setInterval(()=>{
            div.scrollHeight=div.scrollTop
        }, 0)
    }
</script>

<svelte:window on:keydown={keydown} />

<div id='div'>
    {#each messages as message}
        <Row>
            <Column>
                <p style='font-size: 3em;'>{message.user}</p>
                <p>{message.body}</p>            
            </Column>
        </Row>
    {/each}
</div>

<Row>
    <Column>
        <TextInput bind:value={message} />
    </Column>
</Row>