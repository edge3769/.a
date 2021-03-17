<script context='module'> 
    export async function preload({params}, {user}){
        if(!user){
            this.redirect('302', 'enter')
        }
        return {user}
    }
</script>

<script>
    export let user
    import {
        Tag,
        Row,
        Link,
        Search,
        Column,
        PaginationNav,
    } from 'carbon-components-svelte'
    import * as api from 'api'
    import { goto } from '@sapper/app'
    import { onMount } from 'svelte'
    import {
        context,
        groupTags
    } from '../stores.js'
    import purify from 'dompurify';

    $: tag = purify.sanitize(tag)

    let groups = []
    let page = 0
    let total = 0
    let pages = 0

    let current

    let open = false
    let got
    let tag
    let ref

    $: get($groupTags)

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                if (current==ref){
                    addTag()
                }
        }
    }

    let go=async(group)=>{
        user = await api.put('users', {add: {form: 'group', id:group.id}}, user.token)
        $context = group.name
        goto(`group/${group.id}`)
    }

    let focused=()=>{
        current=ref
        if ($groupTags.length > 0){
            open=true
        }
    }

    let addTag = () => {
        if (tag != '' && !$groupTags.includes(tag)){
            $groupTags=[...$groupTags, tag]
            open=true
            tag=''
        }
    }

    let delTag = (tag) => {
        $groupTags=$groupTags.filter(t => t != tag)
    }

    let clear = () => {
        $groupTags = []
        open = false
    }

    let get = async function(){
        let tagString = JSON.stringify($groupTags)
        let url = `groups?tags=${tagString}&visible=1&page=${page+1}`
        let res = await api.get(url)
        // console.log(res)
        groups = res.items
        total = res.total
        pages = res.pages
        got = true

    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>x369</title>
</svelte:head>

<Row noGutter>
    <Column>
        <Search
            on:focus={focused}
            bind:value={tag}
            bind:ref
        />
    </Column>
</Row>

{#if open}
    <Row noGutter>
        <Column>
            <Tag
                on:click={clear}
                type='magenta'
            >
                Clear
            </Tag>
            {#each $groupTags as tag}
                <Tag filter on:click={delTag(tag)}>{tag}</Tag>
            {/each}
        </Column>
    </Row>
{/if}

{#each groups as group}
    <br />
    <Row noGutter>
        <div>
            <Link href='' on:click={go(group)}>{group.name}</Link>
        </div>
    </Row>
{/each}

{#if got && total < 1}
    <Row noGutter>
        <Column>
            <p>There don't seem to be any results</p>        
        </Column>
    </Row>
{/if}

{#if total>10}
    <Row noGutter>
        <Column>
            <PaginationNav loop bind:page bind:total={pages}/>
        </Column>
    </Row>
{/if}