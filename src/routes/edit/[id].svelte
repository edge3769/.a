<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        if (!user){
            this.redirect(302, 'enter')
        }
        let {id} = params
        let room = await api.get(`rooms/${id}`)
        return { room, user }
    }
</script>

<script>
    export let room, user
    import {context} from '../../stores.js'
    import { goto } from '@sapper/app'
    import {
        FluidForm,
        ButtonSet,
        TextInput,
        Checkbox,
        Column,
        Button,
        Modal,
        Row,
        Tag
    } from 'carbon-components-svelte'
    import Input from '../../components/Input/Input.svelte'

    let nameInvalid

    let name = room.name
    let tags = room.tags
    let open = room.open
    let delOpen

    let del = async function(){
        let res = await api.del(`rooms/${room.id}`, user.token)
        if (res.yes){
            goto(`rooms/${user.id}`)
        }
    }

    let edit = async function(){
        let data = {
            id: room.id,
            name,
            open,
            tags,
        }
        let res = await api.put('rooms', data, user.token)
        if (res.nameError) {
            nameInvalid = true
        }
        if (res.id){
            $context=name
            goto(`room/${room.id}`)
        }
    }
</script>

<Modal
    bind:open={delOpen}
    modalHeading='Delete room'
    primaryButtonText='Delete'
    secondaryButtonText='Cancel'
    on:click:button--secondary={() => (delOpen=false)}
    on:submit={del}
>
    <p>Sure you want to delete this room?</p>
</Modal>

<svelte:head>
    <title>Edit Room</title>
</svelte:head>

<Row noGutter>
    <Column>
        <Checkbox bind:checked={open} labelText='Open' />
    </Column>
</Row>

<Tag bind:tags />

<Row noGutter>
    <Column>
        <FluidForm>
            <Input 
                labelText="Name" 
                bind:value={name}
                bind:invalid={nameInvalid}
                invalidText='Name taken'
            />
        </FluidForm>
    </Column>
</Row>

<Row noGutter>
    <ButtonSet stacked>
        <Button on:click={() => (delOpen=true)}>Delete</Button>
        <Button on:click={edit}>Edit</Button>
    </ButtonSet>
</Row>