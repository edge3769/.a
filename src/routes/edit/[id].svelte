<script context='module'>
    import * as api from '$lib/api'
    export async function load({page, session}){
        let {id} = page.params
        let room = await api.get(`telegram/${id}`)
        const token = session.token
        if (!token){
            return {
                status: 302,
                redirect: 'login'
            }
        }
        let user = await api.get('user', token)
        if (!(room.user == user.username)){
            return {
                status: 401,
                error: 'Unauthorized'
            }
        }
        return {
            props: {
                room,
                user
            }
        }
    }
</script>

<script>
    export let room, user
    import { goto } from '$app/navigation'
    import {
        InlineLoading,
        FluidForm,
        ButtonSet,
        Column,
        Button,
        Modal,
        Row,
    } from 'carbon-components-svelte'
    import {
        not_empty_telegram_link_regex,
        telegram_link_regex 
    } from '$lib/utils'
    import Tag from '$lib/components/Tag.svelte'
    import Input from '$lib/components/Input/Input.svelte'

    let linkInvalid
    let linkError
    let editLoading
    let delLoading

    let link = room.link
    let tags = room.tags
    let delOpen

    let del = async function(){
        delLoading = true
        let res = await api.del(`telegram/${room.id}`, user.token)
        if (res.status === 401){
            delLoading = false
            goto('/login')
        } 
        if (res.yes){
            delLoading = false
            goto(`/rooms/${user.id}`)
        }
    }

    let edit = async function(){
        editLoading=true
        if (!link){
            linkInvalid = true
            linkError = 'Empty'
            editLoading = false
            return
        }
        if (!telegram_link_regex.test(link)){
            linkInvalid = true
            if(!not_empty_telegram_link_regex.test(link)){
                linkError = 'Empty link'
            } else {
                linkError = 'Telegram links normally begin with "https://t.me/"'
            }
            editLoading = false
            return
        }
        let data = {
            id: room.id,
            link,
            tags,
        }
        let res = await api.put('telegram', data, user.token)
        if (res.status === 401){
            editLoading = false
            goto('/login')
        } 
        if (res.linkError) {
            linkInvalid = true
            linkError = res.linkError
            editLoading=false
            return
        }
        if (res.id){
            editLoading = false
            goto(`/room/${room.id}`)
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

{#if room.open}
    <Tag bind:tags />
{/if}

<Row noGutter>
    <Column>
        <FluidForm>
            <Input 
                labelText="Link" 
                bind:value={link}
                bind:invalid={linkInvalid}
                invalidText={linkError}
            />
        </FluidForm>
    </Column>
</Row>

<Row noGutter>
    <ButtonSet stacked>
        <Button as let:props>
            <div on:click={edit} {...props}>
                <p>Edit</p>
                {#if editLoading}
                    <div class='right'>
                        <InlineLoading />
                    </div>
                {/if}
            </div>
        </Button>
        <Button as let:props>
            <div on:click={del} {...props}>
                <p>Delete</p>
                {#if delLoading}
                    <div class='right'>
                        <InlineLoading />
                    </div>
                {/if}
            </div>
        </Button>
    </ButtonSet>
</Row>

<style>
    .right {
        float: right;
    }
</style>