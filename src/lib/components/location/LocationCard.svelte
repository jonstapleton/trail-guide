<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faClose } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher } from 'svelte'
    import { base } from '$app/paths'

    export let nodeInfo;
    let data;

    const dispatch = createEventDispatcher()

    $: fetchNode(nodeInfo)

    function sendClose() {
        dispatch('close')
    }

    async function fetchNode(node:object) {
        if(!node) { console.log("Not a valid node"); return }
        const md = await (await fetch(`${base}/api/file/${node.file}.json`)).json()
        console.log(md)
        data = md
    }
</script>

<article class='location-card card m-2'>
    <header class='card-header'>
        <h2 class='card-header-title'>Location Name</h2>
        <button on:click={sendClose} class="card-header-icon" aria-label="close">
            <span class="icon">
              <Fa icon={faClose} />
            </span>
        </button>
    </header>
    <section class='card-content content'>
        {#if data}
        {@html data.content}
        {data.path}
        {/if}
    </section>
</article>