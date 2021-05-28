<script context="module">
    export async function load({ session }) {
        const token = session.token
        if (!token) {
            return {
                status: 302,
                redirect: 'login'
            }
        }
        const res = await api.get('user', token)
        if (!res) {
            return {
                status: 302,
                redirect: login
            }
        }
        return {
            props: {
                token
            }
        }
    }
</script>

<script>
    export let token
    import Input from '$lib/components/Input/Input.svelte'
    import Tag from '$lib/components/Tag.svelte'
    import {
        Row,
        Button,
        Column,
        Checkbox,
        ButtonSet,
        FluidForm,
        InlineLoading
    } from 'carbon-components-svelte'
    import {
        not_empty_telegram_link_regex,
        telegram_link_regex 
    } from '$lib/utils'
    import { goto } from '$app/navigation'
    import * as api from '$lib/api'

    let loading
    
    let linkInvalid
    let linkError
    let link
    let tags

    const add = async function() {
        loading = true
        if (!link){
            linkInvalid = true
            linkError = 'Empty'
            loading = false
            return
        }
        if (!not_empty_telegram_link_regex.test(link)){
            linkInvalid = true
            if(!telegram_link_regex.test(link)){
                linkError = 'Telegram links normally begin with "https://t.me/"'
            } else {
                linkError = 'Empty link'
            }
            loading = false
            return
        }
        let data = {
            link,
            tags,
        }
        let res = await api.post('telegram', data, token)
        if (res.status === 401){
            loading=false
            goto('/login')
        }        
        if (res.linkError) {
            linkError = res.linkError
            linkInvalid = true
            loading = false
            return
        } else if (res.id) {
            loading=false
            goto('/')
        }
    }
</script>

<svelte:head>
    <title>Add Room</title>
</svelte:head>

<Tag bind:tags />

<Row noGutter>
    <Column>
        <FluidForm>
            <Input
                bind:invalid={linkInvalid}
                invalidText={linkError}
                labelText="Link"
                bind:value={link} 
            />
        </FluidForm>
    </Column>
</Row>

<Row noGutter>
    <Column>     
        <ButtonSet stacked>
            <Button as let:props>
                <div on:click={add} {...props}>
                    <p>Add</p>
                    {#if loading}
                        <div class='right'>
                            <InlineLoading />
                        </div>
                    {/if}
                </div>
            </Button>
        </ButtonSet>
    </Column>
</Row>

<style>
    .right {
        float: right;
    }
</style>