<script context="module">
    export async function preload({ path }, { user }) {
        if (!user) {
            this.redirect(302, `enter`);
        }
        return { user }
    }
</script>

<script>
    export let user
    import Input from '../components/Input/Input.svelte'
    import Tag from '../components/Tag.svelte'
    import {
        Row,
        Button,
        Column,
        Checkbox,
        ButtonSet,
        FluidForm
    } from 'carbon-components-svelte'
    import {context} from '../stores.js'
    import { goto } from '@sapper/app'
    import * as api from 'api'

    let nameInvalid
    
    let open = true
    let name
    let tags

    let add = async function() {
        let data = {
            open,
            tags,
            name
        }
        let res = await api.post('rooms', data, user.token)
        if (res.nameError) {
            nameInvalid = true
        }
        if (res.id) {
            $context=name
            goto(`room/${res.id}`)
        }
    }
</script>

<svelte:head>
    <title>Add Room</title>
</svelte:head>

<Checkbox bind:checked={open} labelText='Open' />

<Tag bind:tags />

<Row noGutter>
    <Column>
        <FluidForm>
            <Input
                bind:invalid={nameInvalid}
                invalidText='Name taken'
                labelText="Name"
                bind:value={name} 
            />
        </FluidForm>
    </Column>
</Row>

<Row noGutter>
    <Column>     
        <ButtonSet stacked>
            <Button on:click={add}>Add</Button>
        </ButtonSet>
    </Column>
</Row>