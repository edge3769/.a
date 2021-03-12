<script context='module'>
    import * as api from 'api'
    export async function preload({params}){
        let {id} = params
        let group = await api.get(`groups/${id}`)
        if (group == '404')(
            this.error(404, 'group not Found')
        )
        if (group == '423')(
            this.error(423, 'group not visible')
        )
        return {group}
    }
</script>

<script>
    export let group
    import {
        Row,
        Link,
        Column,
    } from 'carbon-components-svelte'
    import {marked} from 'utils'
    import { stores } from '@sapper/app'

    let alt
    
    let { session } = stores()

    let description
    if (group.description){
        description = marked(group.description)
    }
</script>

<Row  noGutter>
    <Column lg={4} sm={4} md={4} xlg={4}>
            <img style='padding:0 1em; max-width: 100%; height: auto;' alt='groupImage' src={group.image}>
    </Column>
    <Column lg={4} sm={4} md={4} xlg={4}>
        {#if group.name}
            <h2>{group.name}</h2>
        {/if}
        <p>{group.itype}</p>
        {#if group.address}
            <p>{group.address}</p>
        {/if}
        {#if group.website}
            <Link href={group.website}>{group.website}</Link>
        {/if}
        {#if group.email}
            <p>{group.email}</p>
        {/if}
        {#if group.phone}
            <p>{group.phone}</p>
        {/if}
        <!-- <Link href='' on:click={open}>Gallery</Link> -->
        <Link href='{group.user}'>User</Link>
        {#if $session.user.username == group.user}
            <Link href='edit/{group.id}'>Edit</Link>
        {/if}
    </Column>
</Row>

{#if description}
    <Row noGutter>
        <Column lg={4} sm={4} md={4} xlg={4}>
            <p>{@html description}</p>
        </Column>
    </Row>
{/if}