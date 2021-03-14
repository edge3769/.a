<script>
    export let code

    import {placeholder} from 'placeholder'
    import {
        Row,
        Column,
        ButtonSet,
        FileUploaderButton
    } from 'carbon-components-svelte'

    let codeRef
    let imgRef

    $: if (!code){
        code = placeholder
    }

    $: if (imgRef) imgRef.src = code

    let codeChange = () => {
        let i = codeRef.files[0]
        var reader = new FileReader()
        reader.onload = (e) => {
            code = e.target.result
        }
        if (i){
            reader.readAsDataURL(i)
        }
    }

    
</script>

<Row noGutter>
    <Column>
        <img
            style='width: 137px;'
            width=100% heigth=100%
            alt='display'
            src=''
            bind:this={imgRef}
        >
    </Column>
</Row>

<Row noGutter>
    <Column>
        <ButtonSet stacked>
            <FileUploaderButton 
                disableLabelChanges 
                on:change={codeChange} 
                bind:ref={codeRef} 
                labelText='Kik code'
            />
        </ButtonSet>
    </Column>
</Row>