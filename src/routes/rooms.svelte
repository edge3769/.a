<script context='module'>
    import * as api from 'api'
    export async function preload({}, {user}){
        if(!user){
            this.redirect(302, 'enter')
        }
        let {rooms, total, pages} = api.get('/xrooms', user.token)
        return {rooms, pages, total, user}
    }
</script>

<script>
    export let rooms, user, pages, total
    import {
        Row,
        Link,
        Column,
        TextInput
    } from 'carbon-components-svelte'
    import {onMount} from 'svelte'
    import Tag from '../components/Tag.svelte'

    let tags
    let div

    $: if(total > 100 && div.scrollTop==div.scrollHeight){
        page++
        get()
    }

    $: (tags)=>{console.log(1)}

    onMount(()=>{
        div = document.getElementById('div')
    })

    let get=async()=>{
        tagString = JSON.stringify(tags)
        let res = await api.get(`xrooms?tags=${tagString}&page=${page}`, user.token)
        rooms = res.rooms
        pages = res.pages
        total = res.total
    }
</script>

<Tag bind:tags />

<div id='div'>
    {#each rooms as room}
        <Row>
            <Column>
                <Link href='room/{room.id}' />
            </Column>
        </Row>
    {/each}
</div>