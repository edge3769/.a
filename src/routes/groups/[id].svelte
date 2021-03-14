<script context='module'>
    export async function preload({params}, {user}){
        let {id} = params
        let tagString = JSON.stringify([])
        let url = `groups?id=${id}&tags=${tagString}&page=1`
        let res = await api.get(url)
        let groups = res.groups
        let total = res.total
        let pages = res.pages
        if (res == '404'){
            this.error(404, 'User not Found')
        }
        if (res == '423'){
            this.error(423, 'User not visible')
        }
        return {groups, total, pages, user, id}
    }
</script>

<script>
    export let groups = []
    export let total = 0
    export let pages = 0
    export let user
    export let id

    import { myTags } from '../../stores'
    import {
        PaginationNav,
        Checkbox,
        Column,
        Search,
        Link,
        Tag,
        Row,
    } from 'carbon-components-svelte'
    import * as api from 'api'
    import { onMount } from 'svelte';

    onMount(()=>{
        ref.focus()
    })

    let page = 0

    let visible = true
    let open = false
    let current
    let got
    let tag
    let ref

    $: get($myTags, visible)

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                if (current==ref){
                    addTag()
                }
        }
    }

    let searchF=()=>{
        current=ref
        if ($myTags.length > 0){
            open=true
            get()
        }
    }

    let addTag = () => {
        if (tag != '' && !$myTags.includes(tag)){
            $myTags = [...$myTags, tag]
            open=true
            tag = ''
        }
    }

    let delTag = (tag) => {
        $myTags=$myTags.filter(t => t != tag)
    }

    let clear = () => {
        $myTags = []
        open = false
    }

    let get = async function(){
        let tagString = JSON.stringify($myTags)
        let url = `groups?visible=${visible}&id=${id}&tags=${tagString}&page=${page+1}`
        let res = await api.get(url)
        groups = res.items
        total = res.total
        pages = res.pages
        got = true
    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>My Groups</title>
</svelte:head>

<Row noGutter>
    <Column noGutter>
        <Search
            on:focus={searchF}
            bind:value={tag}
            bind:ref
        />
    </Column>
</Row>

{#if user}
    <Row noGutter>
        <Column>
            <Checkbox bind:checked={visible} labelText='Visible' />
        </Column>
    </Row>
{/if}

{#if open}
    <Row noGutter>
        <Column>
            <Tag
                on:click={clear}
                type='magenta'
            >
                Clear
            </Tag>
            {#each $myTags as tag}
                <Tag filter on:click={delTag(tag)}>{tag}</Tag>
            {/each}
        </Column>
    </Row>
{/if}

{#each groups as group}
    <br/>
    <Row noGutter>
        <div>
            <Link href='group/{group.id}'>{group.name}</Link>
        </div>
    </Row>
{/each}

{#if got && total < 1}
<Row noGutter>
    <p>There don't seem to be any results</p>
</Row>
{/if}

{#if total>10}
    <PaginationNav loop bind:page bind:total={pages}/>
{/if}