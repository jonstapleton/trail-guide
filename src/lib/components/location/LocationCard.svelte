<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faClose } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher } from 'svelte'
    import { base } from '$app/paths'

    export let nodeInfo;
    let data;
    let loaded = false;

    let frontmatter = {
        title: 'No Title!'
    }

    const dispatch = createEventDispatcher()

    $: fetchNode(nodeInfo)

    function sendClose() {
        dispatch('close')
        loaded = false;
    }

    async function fetchNode(node:object) {
        if(!node) { console.log("Not a valid node"); return }
        const md = await (await fetch(`${base}/api/file/${node.file}.json`)).json()
        console.log(md)
        data = md

        console.log(data);
        loaded = true;
    }
</script>

{#if loaded}
<!-- TODO: this needs to show the quick take (if available) or the first couple of lines of the full thing (if there's no quick take) -->
<article class='location-card card'>
    <header class='card-header'>
        <h2 class='card-header-title'>{data.frontmatter.title}</h2>
        <button on:click={sendClose} class="card-header-icon" aria-label="close">
            <span class="icon">
              <Fa icon={faClose} />
            </span>
        </button>
    </header>
    <section class='card-content content'>
        {#if data && data.content}
        {@html data.content}
        {data.path}
        {:else}
        <p>No content in file</p>
        {/if}
    </section>
</article>
{/if}

<style lang='scss'>
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
</style>