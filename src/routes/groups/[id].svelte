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

    import { myItype, userItype, whose } from '../../stores'
    import {
        RadioButtonGroup,
        PaginationNav,
        RadioButton,
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

    let title
    let itype='all'

    $:get(itype)

    function changeItype() {
        if($whose && $whose=='my'){
            $myItype=itype
        } else {
            $userItype=itype
        }
    }

    $: changeItype(itype)

    if ($whose && $whose=='my'){
        title='My Groups'
    } else {
        if(user.name){
            title=`${user.name.split(' ')[0]}'s groups`
        }else{
            title=`${user.username}'s groups`
        }
    }

    let page = 0

    let visible = true
    let open = false
    let current
    let tags=[]
    let got
    let tag
    let ref

    $: get(visible)

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                if (current==ref){
                    addTag()
                    get()
                }
        }
    }

    let addTag = () => {
        if (tag != '' && !tags.includes(tag)){
            tags = [...tags, tag]
            open=true
            tag = ''
        }
    }

    let delTag = (tag) => {
        tags=tags.filter(t => t != tag)
        get()
    }

    let clear = () => {
        tags = []
        open = false
    }

    let get = async function(){
        let tagString = JSON.stringify(tags)
        let url = `groups?visible=${visible}&id=${id}&tags=${tagString}&page=${page+1}`
        if (itype != 'all') url = url + '&itype=' + itype
        let res = await api.get(url)
        groups = res.items
        total = res.total
        pages = res.pages
        got = true
    }
</script>

<svelte:window on:keydown={keydown} />

<svelte:head>
    <title>{title}</title>
</svelte:head>

<Row noGutter>
    <Column noGutter>
        <Search
            on:focus={() => (current=ref)}
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
            {#each tags as tag}
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