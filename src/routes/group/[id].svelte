<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        let {id} = params
        if(!user){
            this.redirect('302', 'enter')
        }
        // let group = await api.get(`groups/${id}`)
        // if(group.private && !group.users.contain(user.username)){
        //     this.error('423', "You're not in this group")
        // }
        return {user, id}
    }
</script>

<script>
    export let user, id
    import { context } from '../../stores.js'
    import {
        Row,
        Column,
        TextInput,
    } from 'carbon-components-svelte'
    import { goto } from '@sapper/app'
    import io from 'socket.io-client'
    import {onMount} from 'svelte'
    import purify from 'dompurify';

    $: message = purify.sanitize(message)

    let title = 'Group'
    if(!$context) $context=title

    const socket = io()

    let messages = []
    let message
    let ref

    onMount(()=>{
        ref.focus()
    })

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                send()
        }
    }

    socket.on('connect', async()=>{
        await api.put('users', {add: {form:'group', id:id}}, user.token)
        socket.emit('join', id)
    })

    socket.on('gmsg', (obj)=>{
        messages = [...messages, obj]
    })

    let go=async(obj)=>{
        $context = obj.user
        await api.put('users', {add: {form:'user', id:obj.id}}, user.token)
        goto(`user/${obj.id}`)
    }

    let send=()=>{
        let obj = {user: user.username, group: id, id: user.id, msg: message}
        messages = [...messages, obj]
        socket.emit('group', obj)
        updateScroll()
        message=''
    }

    let updateScroll=()=>{
        const div = document.getElementById('div')
        setTimeout(()=>{
            div.scrollTop=div.scrollHeight
        }, 0)
    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>{title}</title>
</svelte:head>

<div style='height: 90%;' id='div'>
    {#each messages as message}
        <Row noGutter>
            <Column>
                <p on:click={go(message)} style='color: grey; font-size: 0.75rem;'>{message.user}</p>
                <p>{message.msg}</p>            
            </Column>
        </Row>
    {/each}
</div>

<Row noGutter>
    <Column>
        <TextInput bind:ref bind:value={message} />
    </Column>
</Row>