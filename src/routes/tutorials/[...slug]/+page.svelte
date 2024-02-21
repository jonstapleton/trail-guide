<script lang='ts'>
    // import { onMount } from 'svelte';
    import Header from './Header.svelte';
    import * as components from '$lib/components/location/directives' // This is what enables custom elements in tutorial bodies

    export let data;
    // onMount(() => {
    //     console.log(data)
    // })
</script>

<div class='hero banner'>
    <div class='container'>
        <Header frontmatter={data.frontmatter} />
    </div>
</div>
<div class='container content tutorial'>
    <div class='section'>
        {@html data.content.full}
    </div>
</div>

<style lang='scss'>
    .banner {
        padding-top: 5rem;
        padding-bottom: 5rem;
        // background-color: whitesmoke;
        border-bottom: 4px dashed black;
    }
</style>
