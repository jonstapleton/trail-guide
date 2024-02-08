<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faClose } from '@fortawesome/free-solid-svg-icons'
    import { base } from '$app/paths'

    export let node = {};
    let loaded = false;

    let frontmatter = {
        title: 'No Title!'
    }
</script>

<div class='location-card'>
    {#if node && node.content}
    {@html node.content}
    {node.path}
    {:else}
    <p>No content in file</p>
    {/if}
</div>

<!-- <style lang='scss'>
    .location-card {
        margin: 2rem;
        background-color: white;
        width: 25%;
        display: inline-block;
        position: absolute;
        section {
            position: static;
        }
    }
</style> -->