<script context='module'>
    import * as api from 'api'
    export async function preload({params}, {user}){
        if (!user){
            this.redirect(302, 'enter')
        }
        let {id} = params
        let group = await api.get(`groups/${id}`)
        return { group, user }
    }
</script>

<script>
    export let group, user
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
    import Image from '../../components/Image.svelte'
    import Input from '../../components/Input/Input.svelte'

    let nameInvalid

    let visible = group.visible
    let code = group.code
    let name = group.name
    let tags = group.tags
    let current
    let delOpen
    let open
    let ref
    let tag

    let clear = () => {
        tags = []
        open = false
    }

    let keydown = (e) => {
        switch(e.keyCode){
            case 13:
                if (current==ref){
                    addTag()
                }
        }
    }

    let addTag = () => {
        if (tag != '' && !tags.includes(tag)){
            tags = [...tags, tag]
            open=true
            tag=''
        }
    }

    let delTag = (tag) => {
        tags = tags.filter(t => t != tag)
    }

    let del = async function(){
        let res = await api.del(`groups/${group.id}`, user.token)
        if (res.yes){
            goto(`groups/${user.id}`)
        }
    }

    let edit = async function(){
        let data = {
            id: group.id,
            code,
            visible,
            name,
            tags,
        }
        let res = await api.put('groups', data, user.token)
        if (res.nameError) {
            nameInvalid = true
        }
        if (res.id){
            goto(`group/${group.id}`)
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<Modal
    bind:open={delOpen}
    modalHeading='Delete group'
    primaryButtonText='Delete'
    secondaryButtonText='Cancel'
    on:click:button--secondary={() => (delOpen=false)}
    on:submit={del}
>
    <p>Sure you want to delete this group?</p>
</Modal>

<svelte:head>
    <title>Edit Group</title>
</svelte:head>

<Image bind:code />

<Row noGutter>
    <Column>
        <Checkbox bind:checked={visible} labelText='Visible' />
    </Column>
</Row>

<Row noGutter>
    <Column noGutter>
        <TextInput
            on:focus={() => {open=true;current=ref}}
            placeholder='Add tag'
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
            {#each tags as tag}
                <Tag filter on:click={delTag(tag)}>{tag}</Tag>
            {/each}
        </Column>
    </Row>
{/if}

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
        <Button on:click={() => (delOpen=true)}>Delete Group</Button>
        <Button on:click={edit}>Edit</Button>
    </ButtonSet>
</Row>