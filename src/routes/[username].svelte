<script context='module'>
    import * as api from 'api'
    export async function preload({params}){
        let {username} = params
        let user = await api.get(`user/${username}`)
        if (user == '404')(
            this.error(404, 'User not Found')
        )
        if (!user.visible)(
            this.error(423, 'User not visible')
        )
        return {user}
    }
</script>

<script>
    export let user
    import {
        Column,
        Row
    } from 'carbon-components-svelte'
    import { stores } from '@sapper/app'
    import { whose } from '../stores'

    let { session } = stores()

    let change=()=>{
        if($session.user.id==user.id){
            $whose='my'
        } else {
            $whose='any'
        }
    }
</script>

<Row noGutter>
    <Column lg={4} sm={4} md={4} xlg={4}>
        <h2>{user.name}</h2>
        {#if user.username}
            <p>{user.username}</p>
        {/if}
    </Column>
</Row>