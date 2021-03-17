<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        if(!user){
            this.redirect('302', 'enter')
        }
        let { items, total, pages } = await api.get('users', user.token)
        return { items, total, pages}
    }
</script>

<script>
    export let items, total//, pages
    import {
        Row,
        Column,
    } from 'carbon-components-svelte'

    // let page = 0
</script>

<svelte:head>
    <title>Users</title>
</svelte:head>

<Row noGutter>
    <Column>
        <strong>Best match</strong>
    </Column>
</Row>

{#each items as user}
    <br/>
    <Row noGutter>
        <Column>
            <div>
                <p>{user.username}</p>
            </div>  
        </Column>
    </Row>
{/each}

{#if total < 1}
<div>
    <p>There doesn't seem to be any result</p><!-- <p>There don't seem to be any results</p> -->
</div>
{/if}