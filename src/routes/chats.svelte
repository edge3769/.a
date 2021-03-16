<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        if(!user){
            this.redirect('302', 'enter')
        }
        return {user}
    }
</script>

<script>
    export let user
    import { search } from '../stores.js'
    import {
        Row,
        Link,
        Column,
        TextInput
    } from 'carbon-components-svelte'

    let items  =[]
    $: get($search)

    let get=async()=>{
        items = await api.get(`get?q=${$search}`, user.token).then(r=>r.items)
    }
</script>

<Row noGutter>
    <Column>
        <TextInput bind:value={$search} />
    </Column>
</Row>

{#each items as item}
    <Row noGutter>
        <Column>
            <Link href='{item.form}/{item.id}' />
        </Column>
    </Row>
{/each}