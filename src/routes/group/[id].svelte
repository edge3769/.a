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
    import { stores } from '@sapper/app'

    let { session } = stores()
</script>

<Row  noGutter>
    <Column lg={4} sm={4} md={4} xlg={4}>
            <img style='padding:0 1em; max-width: 100%; height: auto;' alt='groupImage' src={group.code}>
    </Column>
    <Column lg={4} sm={4} md={4} xlg={4}>
        {#if group.name}
            <h2>{group.name}</h2>
        {/if}
        {#if $session.user && $session.user.username == group.user}
            <Link href='edit/{group.id}'>Edit</Link>
        {/if}
    </Column>
</Row>