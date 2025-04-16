<script lang='ts'>
    import Fa from 'svelte-fa'
    import { faClose } from '@fortawesome/free-solid-svg-icons'
    import { createEventDispatcher, onMount } from 'svelte'
    import { base } from '$app/paths'
    import { slide } from 'svelte/transition'

    export let title = "No Title";
    export let loaded = true;
    export let titleSize = ''
    export let layout = 'horizontal'

    let frontmatter = {
        title: 'No Title!'
    }

    const dispatch = createEventDispatcher()

    function sendClose() {
        dispatch('close', {
            name: title
        })
        loaded = false;
    }
    let el:any
    
    function capture(s:boolean) {
        dispatch('capture', s)
    }
</script>

{#if loaded}
<article bind:this={el} on:mouseenter={() => capture(false)} on:mouseleave={() => capture(true)} transition:slide|global class='panel-card card {layout}'>
    <header class='card-header is-dark is-sticky'>
        <h2 class='card-header-title mb-3 pb-0'>{title}</h2>
        <button on:click={sendClose} class="card-header-icon" aria-label="close">
            <span class="icon">
              <Fa icon={faClose} />
            </span>
        </button>
    </header>
    <section class='card-content'>
        <slot />
    </section>
</article>
{/if}
<style lang='scss'>
    .panel-card.horizontal {
        margin: 1rem 0.5rem;
        min-width: 20rem;
        max-width: 33rem;
        // max-height: 85vh;
        background-color: white;
        display: inline-block;
        position: relative;
        vertical-align: top;
        section {
            position: static;
        }
    }
    .panel-card.vertical {
        margin: 1rem 0.5rem;
        min-width: 20rem;
        max-width: 33rem;
        // max-height: 85vh;
        background-color: white;
        position: relative;
        vertical-align: top;
        section {
            position: static;
        }
    }
    h2.large {
        font-size: larger;
    }
    header {
        position: relative;
        z-index: 1;
    }
    section {
        z-index: 0;
        overflow-y: scroll;
        max-height: 80vh;
    }
</style>